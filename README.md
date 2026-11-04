# Hard Hands Calculator

**You've got soooft hands sissy boy**

Ein deutscher, satirischer Härtecheck mit 20 Fragen, sechs Bereichen, acht Rängen und 0–1000 Punkten. Antwortreihenfolgen werden pro Durchlauf einmal gemischt. Weiche Antworten lösen häufiger die bereitgestellten Soft-Hands-Fotos und zunehmend freche Kommentare aus. Bei harten Ergebnissen bleiben die vorhandenen Blue-Collar-SpongeBob-Motive im Einsatz.

Die deutsche Fassung liegt auf `feat/deutsche-meme-ueberarbeitung`. Pushes auf diesen Entwicklungsbranch führen die Validierung aus. Die freigegebene Veröffentlichung erfolgt über `npm run deploy:pages` auf den separaten Branch `gh-pages`.

Website: https://de27vin.github.io/Hard-Hands-Calculator/

## Lokal starten

Node **22.12+** oder Node 24 sowie npm verwenden:

```sh
npm ci
npm run dev
```

Vite zeigt die lokale URL an, normalerweise `http://localhost:5173`.

```sh
npm test             # Logik-, Komponenten- und Bildlade-Tests
npm run test:watch   # Tests bei Änderungen wiederholen
npm run build       # TypeScript-Prüfung und statischer Produktionsbuild
npm run preview     # dist lokal bereitstellen
```

Für die vorhandenen Browserprüfungen:

```sh
npx playwright install chromium
npm run build
npm run test:e2e
```

Ein bereits installiertes Chromium lässt sich mit `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/absoluter/pfad/zu/chrome` angeben. Die Tests starten den lokalen Produktionsserver selbst. Screenshots und echte exportierte PNGs liegen im ignorierten Ordner `test-results/`.

## Technik und Struktur

React 19, TypeScript, Vite, Lucide und das bestehende industrielle CSS-Design. Kein Backend, keine Datenbank, keine Konten, keine Analyse-Dienste und keine API-Schlüssel. Schriften und Bilder werden vom selben statischen Host geladen.

```text
src/
  components/       Rahmen, Rang-Symbole, Teilen-Dialog
  data/
    questions.ts    Deutsche Fragen, stabile IDs, Antworten, Rohpunkte, Bereiche
    ranks.ts        Acht deutsche Ränge mit unveränderten Grenzen
    memes.ts        Lokale Bilder und rangabhängige Ergebnis-Motive
    reactions.ts    Sprüche, Auswahlregeln und persönliche Anmerkungen
  lib/
    quiz.ts         Reiner Zustands-Reducer
    shuffle.ts      Fisher–Yates und Start eines Quiz-Durchlaufs
    scoring.ts      Endergebnis, laufende Härte und fünf Reaktionsbänder
    sharing.ts      Bildladen, Canvas-PNG, natives Teilen und Download-Fallback
  pages/            Startseite, Quiz, Auswertung, Ergebnis
public/images/soft-hands/  Vier optimierte Kopien bereitgestellter Fotos
docs/               Fragen-Review und Bildinventar
tests/              Automatisierte Logik- und UI-Prüfungen
e2e/                Browserprüfungen inklusive echter PNG-Downloads
```

## Fragen und Bewertung bearbeiten

Fragen und Antworten stehen in `src/data/questions.ts`. Die 14 beibehaltenen Fragen behalten ihre IDs und Antwort-Punkt-Zuordnungen. Sechs neue Fragen ergänzen konkrete Handgriffe und praktische Freizeitaktivitäten. Entfernte IDs werden nicht neu vergeben. Bei Antwortänderungen auch die Regeln in `reactions.ts` prüfen.

```text
Endergebnis = runden(Summe aller Antwortpunkte / 80 × 1000)
Bereichsanteil = runden(Bereichspunkte / Bereichsmaximum × 100)
Laufende Härte = runden(Punkte gültiger vorhandener Antworten / deren Maximum × 1000)
```

Jede Frage gibt 0–4 Rohpunkte und trägt maximal 50 normalisierte Punkte bei. Körperlicher Einsatz und Hände & Handwerk haben jeweils vier Fragen, die übrigen Bereiche jeweils drei. Der Endwert wird einmal aus Rohpunkten gerundet. Bereichsprozente werden unabhängig berechnet und nicht einfach addiert.

Unbeantwortete Fragen werden bei der laufenden Härte vollständig ausgelassen. Vor der ersten gültigen Antwort gibt es keinen Zwischenwert (`null`). Reine Selbsteinschätzung, Verletzungen, Handcreme und Pausendauer werden nicht mehr bewertet. Schutz, Erholung und sichere Arbeitsstopps verursachen keinen Abzug.

Alle acht Grenzen bleiben erhalten: 0–99, 100–249, 250–399, 400–549, 550–699, 700–849, 850–949 und 950–1000. Jeder Rang ist weiterhin erreichbar. Ränge in `src/data/ranks.ts` bearbeiten; bei neuen Rängen die lückenlose Abdeckung, Bildzuordnung und Tests aktualisieren. Das vollständige Fragen-Review steht in [docs/UEBERARBEITUNG.md](docs/UEBERARBEITUNG.md).

## Stabile Antwortmischung

`createQuizSession()` läuft nur beim Start-Klick. Fisher–Yates mischt eine Kopie der Antwort-IDs unabhängig für jede Frage. Reihenfolgen und ein Lauf-Seed werden im Quiz-Zustand gespeichert. Der Reducer enthält keine Zufallsaufrufe. Auswahl, Zurückgehen, React-Rerenders und Strict Mode ändern die Reihenfolge nicht. Ein neuer Durchlauf erzeugt neue Reihenfolgen. Die Bewertung verwendet stets Antwort-IDs, niemals die sichtbaren Buchstaben A–E oder deren Positionen.

## Fotos und Meme-Reaktionen

Der tatsächliche Quellordner war `~/Downloads/cp cyril/`. Alle sieben JPEGs wurden geprüft. Vier Motive wurden übernommen: Getränketisch, ausgestreckte Hand, grinsendes Porträt und Sofa mit Smartphone. Schwarze Screenshot-Ränder wurden aus Kopien entfernt; Foto-Seitenverhältnis und Originaldateien bleiben erhalten. Die WebP-Kopien haben jeweils 599×800 Pixel, keine Metadaten und benötigen zusammen **114.572 Bytes**. Dateinamen und Original-Prüfsummen stehen in [docs/soft-hands-assets.json](docs/soft-hands-assets.json) und [ASSET_CREDITS.md](ASSET_CREDITS.md).

Die fünf Reaktionsbänder sind unabhängig von den acht Ergebnisrängen:

| Laufende Härte | Verhalten |
| --- | --- |
| 0–250 | Höchste Foto-Chance, größere weiche Reaktionsbilder |
| 251–450 | Häufiger weicher Spott, etwas zurückhaltender |
| 451–650 | Weiche Einzelantworten werden gelegentlich kommentiert |
| 651–800 | Weiche Foto-Reaktionen sind selten |
| 801–1000 | Weiche Fotos sind sehr selten; harte Antworten können SpongeBob auslösen |

Eine Antwort mit 0 Rohpunkten hat im weichsten Band 85 % deterministische Eignung, bei 1 Rohpunkt sind es 60 %. Höhere laufende Härte verringert die Eignung. Durchschnittliche Antworten kommen nur selten infrage. Harte Antworten erzeugen niemals ein Soft-Hands-Foto. Ein Hash aus Lauf-Seed, Frage und Antwort ergibt eine feste Entscheidung innerhalb des Laufs und kontrollierte Bildvielfalt.

Zwischen zwei Reaktionen liegen mindestens drei beantwortete Fragen; jede Frage reagiert höchstens einmal. Maximal sieben Reaktionen sind möglich. Rerenders lösen keine Reaktionen aus. Der Spott steigert sich mit tatsächlich vorhandenen Antworten: früh unter sechs, mittig sechs bis dreizehn, spät ab vierzehn. Bei einer harten Antwort nach früheren weichen Antworten erscheint kein irreführendes Soft-Hands-Foto.

Die Startseite kombiniert beide Meme-Seiten. Das Quiz bietet gelegentliche Reaktionen und ab vier dauerhaft weichen Antworten eine zusätzliche Desktop-Randnotiz. Auf der Ergebnisseite erhalten die unteren Ränge größere Fotos, höhere Ränge die drei erhaltenen Industriemotive. PNG-Karten verwenden dieselbe rangabhängige Bildwahl und eine persönliche Anmerkung aus tatsächlichen Antworten.

Die kleinen Bilder werden beim Einstieg vorgeladen, damit spätere Reaktionen nach dem Laden auch ohne Netz funktionieren. Der erste Besuch oder ein Neuladen benötigt weiterhin die statischen Dateien; es gibt keinen Service Worker.

## Teilen und Barrierefreiheit

Die 1200×1200-PNG entsteht clientseitig mit Canvas. Schrift und Bild werden vor dem Zeichnen geladen. Ein Bildladefehler fällt auf ein lesbares Text-Zertifikat zurück; ein Exportfehler erscheint auf Deutsch im Dialog. Dateibasiertes natives Teilen wird verwendet, wenn verfügbar. Abbruch wird respektiert; nicht unterstützte oder fehlerhafte Ziele führen zum Download. Auf vielen Geräten ist HTTPS für natives Teilen nötig.

Semantische Überschriften, beschriftete Radiogruppen, native Tastaturbedienung, sichtbare Fokusringe, Fokuswechsel zu neuen Fragen, Bildbeschreibungen, höfliche Live-Meldungen und ein modaler Dialog mit Fokusrückgabe bleiben erhalten. Reduzierte Bewegung entfernt Animationen und verkürzt die fiktive Berechnung. Texte bleiben auch während Übergängen kontrastreich lesbar.

## Statisches Hosting

Build: `npm run build`. Ausgabe: `dist`. `base: './'` unterstützt eine Domainwurzel und `/Hard-Hands-Calculator/`. Es gibt keine serverseitigen Routen oder nötigen Umgebungsvariablen.

- Cloudflare Pages: Build `npm run build`, Ausgabe `dist`, Node 22.12+ oder 24.
- Vercel: Vite-Vorlage mit denselben Build-Einstellungen.
- GitHub Pages: Der bestehende Befehl `npm run deploy:pages` baut und pusht die Ausgabe auf `gh-pages`. Nur nach ausdrücklicher Veröffentlichungserlaubnis ausführen. Die deutsche Fassung ist zur Veröffentlichung auf GitHub Pages freigegeben.
- Andere statische Hosts: Inhalt von `dist` einschließlich `assets/` und `images/` bereitstellen.

## Grenzen

- Antworten bleiben im React-Speicher und verschwinden bei Neustart oder Neuladen.
- Die Punktzahl bleibt Satire; der Zufall beeinflusst nur Reihenfolge und Reaktionsauswahl.
- Natives Teilen hängt vom Gerät ab. PNG-Download bleibt verfügbar.
- Chromium-Automation ersetzt keinen manuellen iOS-/Android- oder Screenreader-Test.
- Änderungen am Entwicklungsbranch werden erst mit einem expliziten Pages-Publishing-Lauf live.
