import { questions, QUESTION_COUNT } from './questions';
import { getSoftMeme, memes } from './memes';
import { calculateCurrentHardness, getHardnessBand } from '../lib/scoring';
import type { Answers, MemeReaction } from '../types';

export function hash(value: string): number {
  let result = 2166136261;
  for (const char of value) result = Math.imul(result ^ char.charCodeAt(0), 16777619);
  return result >>> 0;
}

const softLines = {
  early: [
    'Bruder, schon das Auswählen sah anstrengend aus.',
    'Diese Hände haben bisher nur Cookies akzeptiert.',
    'Der Werkzeugkasten hat gerade leise geweint.',
  ],
  middle: [
    'Deine Hände sind weicher als ein frisches Milchbrötchen.',
    'Du brauchst Handschuhe, um einen USB-Stick einzustecken.',
    'Dein härtester Gegner ist die Folie auf dem Fertigsalat.',
  ],
  late: [
    'Bruder, du kriegst Blasen vom Öffnen einer Wasserflasche. Ohne Kohlensäure. 💀',
    'Diese Hände stehen unter Denkmalschutz. Noch nie benutzt.',
    'Die Seife hat Angst, dich beim Händewaschen zu verletzen.',
  ],
};

const contextLines: Record<string, string[]> = {
  q1: [
    'Deine Tastatur hat mehr Baustellen gesehen als dein Werkzeugkasten.',
    'Dein Fensterplatz zählt nicht als Arbeit unter freiem Himmel.',
    'Bruder, dein Außeneinsatz endet am Fenstergriff.',
  ],
  q7: [
    'Der Laptop ist dein schwerster Kollege. Und du klappst ihn zum Tragen zu.',
    'Dein schwerster Satz lautet: „Mein Netzteil ist noch in der Tasche.“',
    'Bruder, der USB-Stick braucht bei dir einen Schwerlasttransport.',
  ],
  q19: [
    'Dein Bürostuhl macht die körperliche Arbeit.',
    'Dein Bürostuhl hat mehr Arbeitsstunden als deine Beine.',
    'Der Bürostuhl kriegt die Gehaltserhöhung. Du darfst mitrollen.',
  ],
  q12: [
    'Strg+C ist keine Berufsqualifikation als Maschinenführer.',
    'Dein handwerkliches Talent endet beim IKEA-Inbus.',
    'Bruder, du hältst einen Akkuschrauber für ein kostenpflichtiges Update.',
  ],
  q20: [
    'Einmal drehen, Kaffee da. Die Logistik ist beeindruckend.',
    'Deine Kaffeetasse hat den größeren Bewegungsradius.',
    'Dein härtester Transportweg endet an der Hafermilch.',
  ],
  q5: [
    'Guten Morgen, Prinzessin. Der Rest macht gleich Mittag.',
    'Bruder wacht auf, wenn die Frühschicht ihre Steuererklärung macht.',
    'Dein Wecker hat vermutlich Gleitzeit und einen Betriebsrat.',
  ],
  q32: [
    'Teams macht „Pling“. Sofort Schichtzulage beantragen.',
    'Bruder, deine Lärmbelastung hat einen Stummschalten-Knopf.',
    'Dein lautestes Werkzeug ist die Benachrichtigung vom Lieferdienst.',
  ],
  q33: [
    'Hausschuhe mit Firmenzugang. Die Baustelle ist begeistert.',
    'Diese Sicherheitsschuhe haben Flauschfutter und Hasenohren.',
    'Bruder, du brauchst keine Stahlkappe. Du brauchst eine Wärmflasche.',
  ],
  q34: [
    'Tutorial gespeichert. Der Akkuschrauber wartet auf Staffel zwei.',
    'Du hast das Projekt auf „später“ gelegt. Handwerklich abgelegt.',
    'Dein Werkzeug ist ein Lesezeichen. Das Regal hält sich an Hoffnung fest.',
  ],
  q36: [
    'Dein härtester Handgriff war „Bestellung bestätigen“.',
    'Die Küche kennt dich nur von der Lieferadresse.',
    'Bruder, du brauchst eine Einweisung für den Mindestbestellwert.',
  ],
};

export interface ReactionContext {
  questionId: string;
  answerId: string;
  answers: Answers;
  seed: number;
  lastReactionAt?: number;
  shownQuestionIds?: ReadonlySet<string>;
  previousMemeId?: string;
  previousText?: string;
}

export function getReaction(context: ReactionContext): MemeReaction | undefined {
  const { questionId, answerId, answers, seed } = context;
  if (context.shownQuestionIds?.has(questionId)) return;
  const answer = questions
    .find((question) => question.id === questionId)
    ?.answers.find((answer) => answer.id === answerId);
  if (!answer || answers[questionId] !== answerId) return;
  const current = calculateCurrentHardness(answers);
  if (current.total === null || current.answeredCount - (context.lastReactionAt ?? -3) < 3) return;
  const roll = hash(`${seed}:${questionId}:${answerId}:eligible`) % 100;
  const soft = answer.points <= 1;
  const rareAverage = answer.points === 2 && current.total <= 450;
  const band = getHardnessBand(current.total);
  const multiplier =
    band === 'extremely-soft'
      ? 1
      : band === 'very-soft'
        ? 0.9
        : band === 'average'
          ? 0.65
          : band === 'hard'
            ? 0.45
            : 0.3;
  const chance = soft
    ? (answer.points === 0 ? 85 : 60) * multiplier
    : rareAverage
      ? 10
      : answer.points === 4
        ? band === 'extremely-hard'
          ? 28
          : band === 'hard'
            ? 20
            : 15
        : 0;
  if (roll >= chance) return;
  const stage =
    current.total > 450 || current.answeredCount < QUESTION_COUNT * 0.3
      ? 'early'
      : current.answeredCount < QUESTION_COUNT * 0.7
        ? 'middle'
        : 'late';
  if (soft || rareAverage) {
    const lines = contextLines[questionId] ?? softLines[stage];
    const at = stage === 'early' ? 0 : stage === 'middle' ? 1 : 2;
    let text = contextLines[questionId]
      ? lines[at]
      : lines[hash(`${seed}:${questionId}:text`) % lines.length];
    if (text === context.previousText) text = softLines[stage].find((line) => line !== text)!;
    return {
      text,
      kind: 'soft',
      intensity: band === 'extremely-soft' ? 'high' : 'normal',
      stage,
      meme: getSoftMeme(hash(`${seed}:${questionId}:image`), context.previousMemeId),
    };
  }
  // A hard answer never produces a soft-hands image, even after earlier soft answers.
  const hardLines = [
    'Dein Werkzeugkasten hat gerade anerkennend genickt.',
    'Der Zollstock steht kurz stramm. Sauber arbeiten, Bruder.',
    'Der Vorarbeiter fragt, ob du morgen auch seine Schicht übernehmen kannst. Du darfst Nein sagen.',
  ];
  const hardAt = hash(`${seed}:${questionId}:hard`) % hardLines.length;
  const hardText =
    hardLines[hardAt] === context.previousText
      ? hardLines[(hardAt + 1) % hardLines.length]
      : hardLines[hardAt];
  return {
    text: hardText,
    kind: 'hard',
    intensity: 'normal',
    stage,
    meme: questionId === 'q2' || questionId === 'q24' ? memes.miner : memes.construction,
  };
}

export function getProgressiveRoast(
  total: number | null,
  answeredCount: number,
): string | undefined {
  if (total === null || answeredCount < 4 || total > 450) return;
  if (answeredCount < QUESTION_COUNT * 0.3)
    return 'Das sieht nicht gut aus, Bruder. Der Inbus hält schon Abstand.';
  if (answeredCount < QUESTION_COUNT * 0.7)
    return 'Zwischenstand: streichzart. Das Milchbrötchen verlangt einen härteren Gegner.';
  return 'Bruder, sogar die Handcreme fragt, ob du heute noch irgendwas anfasst.';
}

export function getCommentary(answers: Answers): string[] {
  const lines: string[] = [];
  const points = (id: string) =>
    questions
      .find((question) => question.id === id)
      ?.answers.find((answer) => answer.id === answers[id])?.points;
  if ((points('q1') ?? -1) <= 1 && points('q1') !== undefined)
    lines.push(
      'Deine Tastatur hat mehr gearbeitet als dein Werkzeugkasten. Die Leertaste verlangt Gefahrenzulage.',
    );
  if ((points('q1') ?? 0) >= 3)
    lines.push(
      'Der Wetterbericht ist dein täglicher Endgegner. Mit drei Wolken bist du inzwischen per Du.',
    );
  if ((points('q7') ?? 0) >= 3)
    lines.push(
      'Du bewegst echte Lasten. Dein Rücken bekommt dafür saubere Technik, Hebehilfen und Feierabend. Kein Obstkorb.',
    );
  if ((points('q7') ?? -1) === 0)
    lines.push(
      'Dein Laptop ist dein Schwertransport. Ein zweiter Browser-Tab zählt trotzdem nicht als Zusatzgewicht.',
    );
  if ((points('q19') ?? -1) <= 1 && points('q19') !== undefined)
    lines.push(
      'Dein Bürostuhl hat diese Nummer körperlich getragen. Das Zertifikat geht eigentlich an ihn.',
    );
  if ((points('q5') ?? 0) >= 3)
    lines.push(
      'Du stempelst ein, während andere noch vom Ausschlafen träumen. Selbst dein Wecker findet das unverhältnismäßig.',
    );
  if ((points('q12') ?? 0) >= 3)
    lines.push(
      'Dein Werkzeugkasten ist ein enger Freundeskreis. Nur die 10er-Nuss hat sich seit Monaten nicht gemeldet.',
    );
  if ((points('q34') ?? 0) >= 3 && (points('q1') ?? 99) <= 1)
    lines.push(
      'Büro unter der Woche, Schrauben am Wochenende. Die Hände haben wenigstens ein Nebengewerbe.',
    );
  if (lines.length < 2)
    lines.push(
      'Ein bisschen anpacken, ein bisschen Komfort. Du könntest ein Regal aufbauen und danach eine sachliche E-Mail darüber schreiben.',
    );
  if (lines.length < 2)
    lines.push(
      'Die Kommission ist unentschlossen. Der Zollstock möchte noch ein zweites Gespräch.',
    );
  return lines.slice(0, 3);
}
