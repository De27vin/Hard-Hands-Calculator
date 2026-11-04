# Fragen-Review der deutschen Fassung

20 Fragen in sechs Bereichen. 14 bestehende Fragen behalten IDs und Antwort-Punkt-Zuordnungen; sechs neue Fragen ergänzen konkrete Handgriffe und Freizeitaktivitäten. Jede Frage zählt 0–4 Rohpunkte. Keine Punkte für bloße Behauptungen, besonders hart zu sein.

| Alte Frage / Thema | Entscheidung |
| --- | --- |
| 1 – draußen arbeiten | Als `q1` neu formuliert, einschließlich Werkstatt und Produktion. |
| 2, 3, 18, 26 – Temperatur, Regen, Klima, Wetterstopp | In `q2` gebündelt. Sicheres Stoppen gehört ausdrücklich zur stärksten Antwort. |
| 4 – Schichtlänge | Entfernt: Doppelung zur geplanten Mehrarbeit in `q22`. |
| 5 – Arbeitsbeginn | Als `q5` mit deutschen Sprüchen beibehalten. |
| 6 – Häufigkeit des Zupackens | Als `q6` beibehalten; Häufigkeit und Masse sind unterschiedliche Aspekte. |
| 7 – Lastgewicht | Als `q7` beibehalten, einschließlich Team- und Hebehilfen. |
| 8, 19, 29 – stehen, sitzen, ohne Bürostuhl | In `q19` zusammengeführt. |
| 9 – Schweiß | Entfernt: stark von Temperatur und Person abhängig. |
| 10 – Erschöpfung | Entfernt: subjektiv, kein guter Arbeitsnachweis. |
| 11, 15 – Hornhaut / Aussehen der Hände | In `q11` gebündelt; Arbeitsrückstände auf Kleidung bleiben separat in `q24`. |
| 12 – Werkzeug | Als `q12` mit pointierteren Antworten beibehalten. |
| 13 – Handschuhe | Eigenständige Wertung entfernt. Passender Schutz wird vorausgesetzt. |
| 14 – Kratzer | Entfernt. Verletzungen sind keine Leistung. |
| 16, 17 – Mittagspause / Zusatzpausen | Entfernt. Ausreichende Erholung wird nicht abgewertet. |
| 20 – Kaffeezugang | Als `q20` konkreter Komfortvergleich. |
| 21 – Wochenende | Als `q21` tatsächlicher Dienstplan statt Verzicht auf freie Tage. |
| 22 – Überstunden | Als `q22`, begrenzt auf vereinbarte, bezahlte Mehrarbeit mit ausreichender Erholung. |
| 23 – Improvisation | Als `q23` konkret über Messen und Fehlersuche. |
| 24 – Schmutz | Als `q24`, den Arbeitsbedingungen zugeordnet. Gefährliche Stoffe ausgeschlossen. |
| 25 – ungünstige Positionen | Als `q25` konkrete Bewegungen mit Hilfsmitteln und Positionswechseln. |
| 27 – Handcreme | Entfernt. Pflege verursacht keinen Abzug. |
| 28 – Beschwerden | Entfernt. Banter misst keine körperliche Arbeit. |
| 30 – eigene Härte einschätzen | Entfernt. Keine Punkte für Eigenlob. |

Neu sind `q31` (zuletzt instand gesetzter Gegenstand), `q32` (Geräuschkulisse mit angemessenem Gehörschutz), `q33` (Schuheinsatz), `q34` (erledigtes Wochenendprojekt), `q35` (praktische Freizeit-/Griffarbeit) und `q36` (Handarbeit beim Kochen). Die Datenreihenfolge ist nicht die Reihenfolge der sichtbaren Antworten.

| Bereich | Fragen | Rohpunktmaximum | Maximaler Anteil |
| --- | --- | --- | --- |
| Arbeitsbedingungen | 3 | 12 | 150 / 1000 |
| Körperlicher Einsatz | 4 | 16 | 200 / 1000 |
| Hände & Handwerk | 4 | 16 | 200 / 1000 |
| Arbeitsplatz & Komfort | 3 | 12 | 150 / 1000 |
| Schicht & Routine | 3 | 12 | 150 / 1000 |
| Feierabend-Prüfung | 3 | 12 | 150 / 1000 |

Jede Frage zählt maximal 50 normalisierte Punkte. Die größeren Bereiche enthalten bewusst mehr konkrete Aspekte körperlicher Arbeit und praktischer Fertigkeiten. Der Endwert entsteht aus Rohpunkten, nicht aus gerundeten Bereichsbalken.

## Bilder

Gefunden wurde `~/Downloads/cp cyril/` mit sieben JPEGs. Alle wurden visuell und technisch geprüft. Übernommen wurden Getränketisch, ausgestreckte Hand, grinsendes Porträt und Sofa/Smartphone. Die beiden Schlaf-/Badezimmermotive und das zusätzliche ähnliche Porträt wurden nicht benötigt.

Aus Kopien wurden schwarze Screenshot-Ränder entfernt und Metadaten gelöscht. Die WebP-Ausgaben sind 599×800 Pixel groß und bewahren das Foto-Seitenverhältnis bis auf Pixelrundung. Sie benötigen zusammen 114.572 statt 449.459 Bytes. Die Originaldateien wurden per SHA-256 vor und nach der Verarbeitung verglichen und blieben unverändert. Tatsächliche Dateinamen und Inventar stehen in `soft-hands-assets.json`.

Die drei vorhandenen SpongeBob-Motive bleiben unverändert erhalten. Es wurden keine zusätzlichen Bilder heruntergeladen oder generiert. Die Fassung liegt auf `feat/deutsche-meme-ueberarbeitung`; nach ausdrücklicher Freigabe wird der statische Build auf `gh-pages` veröffentlicht.

## Ausgeführte Validierung

Am 4. November 2026 lokal mit Node 24.14.1 geprüft:

- `npm test`: 49 Tests in vier Dateien bestanden, einschließlich sechs UI-Tests.
- `npm run test:e2e`: acht Tests auf Desktop-/Mobil-Chromium bestanden.
- `npm run build`: strenge TypeScript-Prüfung und Vite-Produktionsbuild erfolgreich.
- Automatische axe-Prüfungen auf Startseite, Quiz, Ergebnissen und Teilen-Dialog ohne verbleibende Verletzungen.
- Ein im ersten Browserlauf entdeckter Kontrastfehler während der Einblendanimation wurde behoben: Text bleibt sofort mit voller Deckkraft sichtbar; die Bewegung bleibt dezent.
- PNG-Signatur, 1200×1200-Maße, Download-Fallback und Export ohne Hintergrundbild im Browser geprüft.
- Ausgewählte Originalfotos vor/nach der Verarbeitung per SHA-256 unverändert.

Screenshots und tatsächliche PNG-Exporte liegen unter `test-results/`. Die Browserprüfung nutzt Chromium mit Mobilgrößen und ersetzt keine physischen iOS-/Android- oder manuellen Screenreader-Tests. Nach erfolgreicher Prüfung wurde die Veröffentlichung auf GitHub Pages ausdrücklich freigegeben.
