import type { Category, CategoryId, Question } from '../types';

export const categories: Category[] = [
  {
    id: 'conditions',
    name: 'Arbeitsbedingungen',
    short: 'Die Kulisse',
    description: 'Wetterbericht oder Bildschirmhintergrund?',
  },
  {
    id: 'labor',
    name: 'Körperlicher Einsatz',
    short: 'Die Belastung',
    description: 'Was bewegt sich außer deinem Mauszeiger?',
  },
  {
    id: 'tools',
    name: 'Hände & Handwerk',
    short: 'Die Werkzeugkiste',
    description: 'Kannst du mehr als „rückgängig“?',
  },
  {
    id: 'comfort',
    name: 'Arbeitsplatz & Komfort',
    short: 'Die Komfortzone',
    description: 'Wie viel Wellness steckt im Werktag?',
  },
  {
    id: 'mentality',
    name: 'Schicht & Routine',
    short: 'Der Alltag',
    description: 'Wann klingelt es wirklich?',
  },
  {
    id: 'ultimate',
    name: 'Feierabend-Prüfung',
    short: 'Die letzten Beweise',
    description: 'Auch ohne Chef kann man anpacken.',
  },
];

// Retained questions keep their IDs and answer IDs. Every question has equal weight.
function q(
  n: number,
  category: CategoryId,
  text: string,
  aside: string,
  options: [string, number][],
): Question {
  return {
    id: `q${n}`,
    category,
    text,
    aside,
    answers: options.map(([label, points], i) => ({ id: `a${i}`, label, points })),
  };
}

export const questions: Question[] = [
  q(
    1,
    'conditions',
    'Wo findet deine Arbeit wirklich statt?',
    'Dein Hintergrundbild zählt nicht als Außeneinsatz.',
    [
      ['Baustelle, Werkstatt oder Produktion. Hier hat alles Gebrauchsspuren.', 4],
      ['Meist draußen oder vor Ort. Mein Arbeitsplatz hat keine feste Adresse.', 3],
      ['Drinnen und draußen. Beruflich mit Türschwelle.', 2],
      ['Drinnen. Ab und zu muss ich tatsächlich vom Tisch weg.', 1],
      ['Am Schreibtisch. Draußen ist ein Bildschirmschoner.', 0],
    ],
  ),
  q(
    2,
    'conditions',
    'Wer stellt bei dir die Temperatur ein?',
    'Passende Ausrüstung gehört dazu. Bei Gefahr wird gestoppt – ohne Punktabzug.',
    [
      ['Das Wetter. Regelmäßig Hitze oder Kälte, mit Schutz und sicheren Stopps.', 4],
      ['Die Jahreszeit. Geschützt arbeiten, aber klimatisiert ist hier nichts.', 3],
      ['Die Halle. Im Winter Jacke, im Sommer große Gespräche mit dem Ventilator.', 2],
      ['Die Heizung. Eine Strickjacke entscheidet über die Produktivität.', 1],
      ['Ich. Bei 23 statt 22 Grad schreibe ich eine Gefährdungsanzeige.', 0],
    ],
  ),
  q(
    24,
    'conditions',
    'Was erzählt deine Arbeitskleidung am Freitag?',
    'Gemeint ist normaler Schmutz. Gefährliche Stoffe bleiben fachgerecht am Arbeitsplatz.',
    [
      ['Die Waschmaschine beantragt einen Branchenwechsel.', 4],
      ['Staub, Erde oder Späne. Der Beruf ist noch klar erkennbar.', 3],
      ['Hier und da Dreck. Kleine Beweise, keine Heldensage.', 2],
      ['Ein Kaffeefleck. Die Woche war brutal.', 1],
      ['Bügelfrei. Genau wie meine Hände.', 0],
    ],
  ),
  q(
    6,
    'labor',
    'Wie oft musst du bei der Arbeit richtig zupacken?',
    'Gemeint sind Lasten. Keine emotional schweren E-Mails.',
    [
      ['Jede Schicht. Mit Technik und Hebehilfe, nicht mit Ego.', 4],
      ['Mehrmals pro Woche. Die Kisten kennen meinen Namen.', 3],
      ['Gelegentlich. Ein körperlicher Gastauftritt.', 2],
      ['Selten. Meistens hebe ich nur die Stimmung. Erfolglos.', 1],
      ['Mein schwerster Auftrag ist „Datei hochladen“.', 0],
    ],
  ),
  q(
    7,
    'labor',
    'Was ist deine übliche Gewichtsklasse?',
    'Schwere Lasten werden mit Hilfe oder geeigneter Ausrüstung bewegt.',
    [
      ['Lasten über 25 kg gehören zum Job. Im Team oder mit Hebehilfe.', 4],
      ['15–25 kg. Die Pakete haben mehr Masse als mein Mittagessen.', 3],
      ['5–15 kg. Solide Getränkekisten-Liga.', 2],
      ['Unter 5 kg. Die Belastung bleibt überschaubar.', 1],
      ['Mein Laptop. Ohne Ladekabel ist Entlastungstag.', 0],
    ],
  ),
  q(
    19,
    'labor',
    'Wer bewegt sich während deiner Schicht?',
    'Reguläre Pausen und nötige Unterstützung gehören dazu.',
    [
      ['Ich. Viel gehen, tragen und arbeiten im Stehen.', 4],
      ['Meist ich. Der Stuhl ist nur als Gast dabei.', 3],
      ['Ungefähr halbe-halbe. Geteiltes Sorgerecht fürs Sitzkissen.', 2],
      ['Überwiegend der Stuhl. Ich lenke.', 1],
      ['Mein Bürostuhl und ich sind eine eingetragene Partnerschaft.', 0],
    ],
  ),
  q(
    25,
    'labor',
    'Musst du knien, greifen oder an blöde Stellen ran?',
    'Mit passenden Hilfsmitteln und Positionswechseln. Schmerzen sind kein Leistungsnachweis.',
    [
      ['Täglich. Ich richte die Arbeit sicher ein, der Raum bleibt trotzdem eng.', 4],
      ['Oft. Ich kenne die Unterseite von Dingen beruflich.', 3],
      ['Manchmal. Ein bisschen Berufs-Yoga, ohne Räucherstäbchen.', 2],
      ['Selten. Hinter dem Drucker war ich schon mal.', 1],
      ['Nur wenn die Maus runterfällt. Dann ist Eskalationsstufe Rot.', 0],
    ],
  ),
  q(
    11,
    'tools',
    'Wie fühlen sich deine Hände nach normaler Arbeit an?',
    'Gepflegte Hände sind erlaubt. Verletzungen bringen keine Bonuspunkte.',
    [
      ['Rau vom Anpacken. Gepflegt, geschützt, eindeutig im Einsatz.', 4],
      ['Ein paar feste Stellen. Kleine Arbeitszeugnisse.', 3],
      ['Etwas rau. Vor allem von meinen Hobbys.', 2],
      ['Eine Stelle vom letzten Möbelaufbau. Die wird noch erzählt.', 1],
      ['Sammlerzustand. Nicht mit Werkzeug in Berührung gekommen.', 0],
    ],
  ),
  q(
    12,
    'tools',
    'Wie oft benutzt du echtes Werkzeug?',
    'Das Zuschneiden-Werkzeug in Photoshop muss jetzt sehr tapfer sein.',
    [
      ['Täglich. Meine Werkzeugkiste hat mehr Berufserfahrung als ich.', 4],
      ['Mehrmals pro Woche. Wir duzen uns längst.', 3],
      ['Ab und zu. Ich finde das richtige Ende meistens selbst.', 2],
      ['Wenn IKEA mich persönlich herausfordert.', 1],
      ['Strg+C und Strg+V. Zwei starke Maschinen.', 0],
    ],
  ),
  q(
    23,
    'tools',
    'Etwas passt nicht. Was machst du praktisch?',
    'Die Lösung darf kreativ sein. Die Sicherheitsregeln bleiben stehen.',
    [
      ['Messen, Material prüfen, passende Lösung bauen. Alltag.', 4],
      ['Fehler suchen und mit geeignetem Werkzeug beheben.', 3],
      ['Mit Anleitung und etwas Geduld bekomme ich vieles hin.', 2],
      ['Erst mal jemanden fragen, der schon mal einen Zollstock besaß.', 1],
      ['Ticket erstellen. Zuständigkeit erfolgreich abgewehrt.', 0],
    ],
  ),
  q(
    31,
    'tools',
    'Was hast du zuletzt selbst instand gesetzt?',
    'Ein echter Handgriff zählt mehr als „ich könnte schon, wenn ich wollte“.',
    [
      ['Maschine, Fahrzeug oder Bauteil im Rahmen meiner Fachkenntnisse.', 4],
      ['Fahrrad, Möbel oder etwas am Haus. Danach ging es wirklich wieder.', 3],
      ['Etwas Kleines montiert oder nachgestellt. Es hält noch.', 2],
      ['Batterien gewechselt. Der Haushalt spricht von einem Durchbruch.', 1],
      ['WLAN neu gestartet. Ich war danach kurz unbesiegbar.', 0],
    ],
  ),
  q(
    20,
    'comfort',
    'Wie kommt der Kaffee zu dir?',
    'Die Entfernung zur Koffeinquelle verrät mehr als dein LinkedIn-Profil.',
    [
      ['Thermoskanne von zu Hause. Ein kleiner Tank mit Deckel.', 4],
      ['Baustellen- oder Werkstattküche. Der Wasserkocher hat Patina.', 3],
      ['Kantine. Dafür muss ich tatsächlich ein Stück laufen.', 2],
      ['Teeküche um die Ecke. Das überlebe ich knapp.', 1],
      ['Eine Drehung mit dem Bürostuhl. Hafermilch in Griffweite.', 0],
    ],
  ),
  q(
    32,
    'comfort',
    'Wie klingt dein Arbeitsplatz?',
    'Gehörschutz ist selbstverständlich. Lärm macht niemanden wertvoller.',
    [
      ['Maschinen oder Bauarbeiten. Passender Gehörschutz gehört dazu.', 4],
      ['Werkstatt oder Lager. Viel Betrieb, wenig Meditations-App.', 3],
      ['Kundschaft, Laufwege und Betrieb. Ganz ohne Presslufthammer.', 2],
      ['Tastaturen, Gespräche und ein sehr engagierter Drucker.', 1],
      ['Teams macht „Pling“. Ich brauche danach kurz Ruhe.', 0],
    ],
  ),
  q(
    33,
    'comfort',
    'Welche Schuhe machen deinen Arbeitstag mit?',
    'Es zählt der Einsatz. Die vorgeschriebene Schutzausrüstung wird nie abgewertet.',
    [
      ['Sicherheitsschuhe bei körperlicher Arbeit. Die Sohle hat Schichtdienst.', 4],
      ['Robuste Arbeitsschuhe, passend zur Aufgabe. Viel unterwegs.', 3],
      ['Bequeme Schuhe für einen aktiven Tag auf den Beinen.', 2],
      ['Büroschuhe. Sie kennen den Weg zum Mittagessen.', 1],
      ['Hausschuhe. Unter der Webcam herrscht Wellness.', 0],
    ],
  ),
  q(
    5,
    'mentality',
    'Wann geht deine Arbeit los?',
    'Den Wecker stellen ist noch kein Arbeitsbeginn.',
    [
      ['Vor 4 Uhr. Die Sonne kommt in meine Spätschicht.', 4],
      ['Zwischen 4 und 6 Uhr. Selbst der Kaffee schläft noch.', 3],
      ['Zwischen 6 und 8 Uhr. Solide, ohne Heldenmusik.', 2],
      ['Zwischen 8 und 10 Uhr. Erst mal den Kalender warmfahren.', 1],
      ['Nach 10 Uhr. Guten Morgen, Prinzessin.', 0],
    ],
  ),
  q(
    21,
    'mentality',
    'Was macht dein Dienstplan am Wochenende?',
    'Freie Tage sind gut. Andere Schichten sind nur ein anderer Arbeitsrhythmus.',
    [
      ['Regelmäßig arbeiten. Mein Samstag heißt manchmal Dienstag.', 4],
      ['Ein paar Wochenenden im Monat. Der Kalender wird kreativ.', 3],
      ['Gelegentlich. Ein zeitlich begrenzter Gastauftritt.', 2],
      ['Nur bei Ausnahmen. Der Grill muss es früh genug wissen.', 1],
      ['Freitag zu, Montag auf. Dazwischen bin ich gesetzlich privat.', 0],
    ],
  ),
  q(
    22,
    'mentality',
    'Wie oft kommen zusätzliche Arbeitsstunden dazu?',
    'Geplante, bezahlte Mehrarbeit mit ausreichender Erholung. Kein Wettbewerb im Kaputtgehen.',
    [
      ['Regelmäßig vereinbarte Zusatzschichten. Der Dienstplan hat Erweiterungspakete.', 4],
      ['Mehrmals im Monat. Die Schicht spielt eine Zugabe.', 3],
      ['Ab und zu. Ein kleines Bonuskapitel.', 2],
      ['Selten. Ich weiß, wo der Ausgang ist.', 1],
      ['Pünktlich Feierabend. Um 17 Uhr werde ich zum Privatgrundstück.', 0],
    ],
  ),
  q(
    34,
    'ultimate',
    'Dein letztes Wochenendprojekt?',
    'Keine Absichtserklärung. Was hast du wirklich gemacht?',
    [
      ['Garten, Renovierung oder etwas Größeres gebaut. Mit passender Ausrüstung.', 4],
      ['Am Fahrrad oder an Möbeln geschraubt. Danach war alles noch benutzbar.', 3],
      ['Ein Regal aufgebaut. Drei Schrauben sind jetzt Souvenirs.', 2],
      ['Eine Pflanze umgetopft. Ich bin quasi Landschaftsbau.', 1],
      ['Ein Tutorial gespeichert. Ausführung kommt mit dem nächsten Update.', 0],
    ],
  ),
  q(
    35,
    'ultimate',
    'Was machen deine Hände in der Freizeit?',
    'Auch Büro-Leute dürfen hier Punkte abholen. Unglaublich, aber wahr.',
    [
      ['Regelmäßig Garten, Werkstatt oder handwerkliche Projekte.', 4],
      ['Klettern, Krafttraining oder andere Sportarten mit ordentlich Griffarbeit.', 3],
      ['Sport oder Bewegung mit etwas praktischem Anpacken.', 2],
      ['Spaziergänge. Der Haustürgriff ist Teil des Trainings.', 1],
      ['Scrollen. Mein Daumen ist Leistungssportler.', 0],
    ],
  ),
  q(
    36,
    'ultimate',
    'Was war dein letzter Hand-Einsatz in der Küche?',
    'Hier zählt Handarbeit. Keine Punkte für verbrannte Finger.',
    [
      ['Teig geknetet, viel geschnippelt oder eine größere Runde bekocht.', 4],
      ['Frisch gekocht. Messer, Brett und Hände waren wirklich im Einsatz.', 3],
      ['Ein einfaches Essen gemacht. Der Topf wurde benutzt, nicht gegoogelt.', 2],
      ['Fertigessen geöffnet. Die Lasche hat sich gewehrt.', 1],
      ['Liefer-App bedient. Die härteste Nuss war der Mindestbestellwert.', 0],
    ],
  ),
];

export const QUESTION_COUNT = questions.length;
export const categoryQuestionCount = (id: CategoryId) =>
  questions.filter((question) => question.category === id).length;
