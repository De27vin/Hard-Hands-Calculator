import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  categories,
  questions,
  QUESTION_COUNT,
  categoryQuestionCount,
} from '../src/data/questions';
import { getRank, ranks } from '../src/data/ranks';
import { allMemes, getResultMeme, memes, softMemes } from '../src/data/memes';
import { getCommentary, getProgressiveRoast, getReaction } from '../src/data/reactions';
import type { ReactionContext } from '../src/data/reactions';
import {
  calculateScore,
  calculateCurrentHardness,
  getHardnessBand,
  isComplete,
} from '../src/lib/scoring';
import { initialState, quizReducer } from '../src/lib/quiz';
import { createAnswerOrder, createQuizSession, shuffle } from '../src/lib/shuffle';
import type { Answers, QuizState } from '../src/types';

export const seededRandom =
  (seed = 42) =>
  () => {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
export const answersFor = (points: number): Answers =>
  Object.fromEntries(
    questions.map((question) => [
      question.id,
      question.answers.find((answer) => answer.points === points)!.id,
    ]),
  );

describe('deutscher Fragenkatalog', () => {
  it('enthält 20 eindeutige Fragen in sechs sinnvollen Bereichen', () => {
    expect(QUESTION_COUNT).toBe(20);
    expect(questions).toHaveLength(20);
    expect(new Set(questions.map((question) => question.id)).size).toBe(20);
    expect(categories).toHaveLength(6);
    expect(categories.map((category) => categoryQuestionCount(category.id))).toEqual([
      3, 4, 4, 3, 3, 3,
    ]);
  });
  it('hat eindeutige Antwort-IDs je Frage und gültige, gleich gewichtete Punktwerte', () => {
    const scopedIds = new Set<string>();
    for (const question of questions) {
      expect(categories.some((category) => category.id === question.category)).toBe(true);
      expect(question.answers.length).toBeGreaterThanOrEqual(3);
      expect(question.answers.length).toBeLessThanOrEqual(5);
      expect(new Set(question.answers.map((answer) => answer.id)).size).toBe(
        question.answers.length,
      );
      expect(new Set(question.answers.map((answer) => answer.label)).size).toBe(
        question.answers.length,
      );
      for (const answer of question.answers) {
        expect(answer.label.length).toBeGreaterThan(8);
        expect(Number.isInteger(answer.points)).toBe(true);
        expect(answer.points).toBeGreaterThanOrEqual(0);
        expect(answer.points).toBeLessThanOrEqual(4);
        scopedIds.add(`${question.id}:${answer.id}`);
      }
      expect(Math.min(...question.answers.map((answer) => answer.points))).toBe(0);
      expect(Math.max(...question.answers.map((answer) => answer.points))).toBe(4);
    }
    expect(scopedIds.size).toBe(
      questions.reduce((sum, question) => sum + question.answers.length, 0),
    );
  });
  it('behält bestehende IDs und Punkte der noch verwendeten Antworten bei', () => {
    for (const question of questions)
      expect(question.answers.map((answer) => [answer.id, answer.points])).toEqual([
        ['a0', 4],
        ['a1', 3],
        ['a2', 2],
        ['a3', 1],
        ['a4', 0],
      ]);
    expect(questions.find((question) => question.id === 'q7')?.answers[4].label).toContain(
      'Laptop',
    );
  });
  it('entfernt Selbsteinschätzung, Verletzungsbonus, Pflege- und Pausenwertung', () => {
    for (const id of [
      'q3',
      'q4',
      'q8',
      'q9',
      'q10',
      'q13',
      'q14',
      'q15',
      'q16',
      'q17',
      'q18',
      'q26',
      'q27',
      'q28',
      'q29',
      'q30',
    ])
      expect(questions.some((question) => question.id === id)).toBe(false);
    const weather = questions.find((question) => question.id === 'q2')!;
    expect(weather.answers[0].points).toBe(4);
    expect(weather.answers[0].label).toContain('sicheren Stopps');
    expect(questions.find((question) => question.id === 'q33')!.answers[0].points).toBe(4);
  });
  it('verwendet deutsche Fragen und keine alten englischen Oberflächentexte', () => {
    expect(questions[0].text).toBe('Wo findet deine Arbeit wirklich statt?');
    const text = JSON.stringify(questions);
    expect(text).not.toMatch(/How often|Your hands|My office|What time|Soft Hands Test/);
    expect(categories.map((category) => category.name).join(' ')).toContain('Körperlicher Einsatz');
  });
});

describe('Bewertung', () => {
  it('erreicht exakt 0 und 1000 bei maximal 80 Rohpunkten', () => {
    expect(calculateScore(answersFor(0)).total).toBe(0);
    expect(calculateScore(answersFor(4))).toMatchObject({ total: 1000, raw: 80, max: 80 });
    expect(calculateScore({}).total).toBe(0);
  });
  it('bleibt für gemischte Antworten deterministisch innerhalb der Grenzen', () => {
    for (let seed = 0; seed < 100; seed++) {
      const random = seededRandom(seed);
      const answers = Object.freeze(
        Object.fromEntries(
          questions.map((question) => [
            question.id,
            question.answers[Math.floor(random() * question.answers.length)].id,
          ]),
        ),
      );
      expect(calculateScore(answers)).toEqual(calculateScore(answers));
      expect(calculateScore(answers).total).toBeGreaterThanOrEqual(0);
      expect(calculateScore(answers).total).toBeLessThanOrEqual(1000);
    }
    expect(calculateScore(answersFor(2)).total).toBe(500);
  });
  it('ignoriert ungültige Antworten und fremde Objektfelder', () => {
    expect(calculateScore({ q1: 'ungültig', extra: 'a0' }).total).toBe(0);
    expect(isComplete({ ...answersFor(4), q1: 'ungültig' })).toBe(false);
  });
  it('begrenzt jede Frage auf 50 normalisierte Punkte', () => {
    const low = answersFor(0);
    for (const question of questions)
      expect(calculateScore({ ...low, [question.id]: 'a0' }).total).toBe(50);
  });
  it('weist Bereichswerte und unterschiedliche Bereichsgrößen korrekt aus', () => {
    const score = calculateScore(answersFor(2));
    expect(score.categories.reduce((sum, category) => sum + category.points, 0)).toBe(score.raw);
    expect(score.categories.reduce((sum, category) => sum + category.max, 0)).toBe(score.max);
    for (const category of score.categories) {
      expect(category.max).toBe(categoryQuestionCount(category.category.id) * 4);
      expect(category.percent).toBe(50);
    }
  });
  it('berechnet laufende Härte ausschließlich aus tatsächlich beantworteten Fragen', () => {
    expect(calculateCurrentHardness({})).toEqual({ total: null, answeredCount: 0, raw: 0, max: 0 });
    expect(calculateCurrentHardness({ q1: 'a0' })).toEqual({
      total: 1000,
      answeredCount: 1,
      raw: 4,
      max: 4,
    });
    expect(calculateCurrentHardness({ q1: 'a0', q2: 'a4', q24: 'ungültig', extra: 'a0' })).toEqual({
      total: 500,
      answeredCount: 2,
      raw: 4,
      max: 8,
    });
    expect(calculateCurrentHardness({ q1: 'a4' }).total).toBe(0);
  });
  it('erkennt vollständige und unvollständige Läufe', () => {
    expect(isComplete({})).toBe(false);
    expect(isComplete(answersFor(4))).toBe(true);
  });
});

describe('Antwortmischung', () => {
  it('verändert weder die Eingabe noch die Antwort-Punkt-Zuordnung', () => {
    const original = Object.freeze([...questions[0].answers]);
    const result = shuffle(original, seededRandom(21));
    expect(result).not.toBe(original);
    expect(new Set(result)).toEqual(new Set(original));
    expect(result.map((answer) => [answer.id, answer.points]).sort()).toEqual(
      original.map((answer) => [answer.id, answer.points]).sort(),
    );
  });
  it('kann alle sechs Permutationen von drei Elementen erzeugen', () => {
    const permutations = new Set<string>();
    for (const first of [0.1, 0.5, 0.9])
      for (const second of [0.25, 0.75]) {
        const values = [first, second];
        permutations.add(shuffle(['a', 'b', 'c'], () => values.shift()!).join(''));
      }
    expect(permutations.size).toBe(6);
  });
  it('mischt pro Frage mit eigenen Ziehungen und ist mit festem Generator reproduzierbar', () => {
    const order = createAnswerOrder(seededRandom(1));
    expect(order).toEqual(createAnswerOrder(seededRandom(1)));
    expect(order).not.toEqual(createAnswerOrder(seededRandom(2)));
    expect(new Set(Object.values(order).map((ids) => ids.join(','))).size).toBeGreaterThan(5);
    for (const question of questions)
      expect([...order[question.id]].sort()).toEqual(
        question.answers.map((answer) => answer.id).sort(),
      );
  });
  it('ändert das Ergebnis bei identischen Antwort-IDs niemals', () => {
    const answers = answersFor(2);
    for (let i = 0; i < 20; i++) {
      const order = createAnswerOrder(seededRandom(i));
      const selected = Object.fromEntries(
        questions.map((question) => [
          question.id,
          order[question.id].find((id) => id === answers[question.id]),
        ]),
      );
      expect(calculateScore(selected).total).toBe(500);
    }
  });
  it('weist unzulässige Zufallswerte zurück', () => {
    for (const value of [-0.1, 1, NaN])
      expect(() => shuffle([1, 2], () => value)).toThrow(RangeError);
  });
});

describe('Navigation und Neustart', () => {
  const start = () => quizReducer(initialState, createQuizSession(seededRandom(42)));
  const choose = (state: QuizState, answerId = 'a0') =>
    quizReducer(state, { type: 'answer', questionId: questions[state.index].id, answerId });
  it('ist als Reducer rein und mischt bei wiederholter Auswertung derselben Aktion nicht neu', () => {
    const action = createQuizSession(seededRandom(3));
    expect(quizReducer(initialState, action)).toEqual(quizReducer(initialState, action));
  });
  it('verhindert Weiter ohne gültige Auswahl und Zurück vor Frage eins', () => {
    expect(quizReducer(start(), { type: 'next' })).toEqual(start());
    expect(quizReducer(start(), { type: 'previous' }).index).toBe(0);
    expect(quizReducer(start(), { type: 'finish' }).view).toBe('quiz');
  });
  it('bewahrt Auswahl und Reihenfolge beim Vor- und Zurückgehen', () => {
    let state = choose(start());
    const order = state.answerOrder;
    state = quizReducer(state, { type: 'next' });
    state = choose(state, 'a2');
    state = quizReducer(state, { type: 'previous' });
    expect(state.answers).toEqual({ q1: 'a0', q2: 'a2' });
    expect(state.answerOrder).toBe(order);
    state = quizReducer(state, { type: 'next' });
    expect(state.answers.q2).toBe('a2');
    expect(state.answerOrder).toBe(order);
  });
  it('ändert bei geänderter Auswahl die Punktzahl und lässt die Reihenfolge bestehen', () => {
    let state = choose(start());
    const order = state.answerOrder;
    expect(calculateScore(state.answers).total).toBe(50);
    state = choose(state, 'a4');
    expect(calculateScore(state.answers).total).toBe(0);
    expect(state.answerOrder).toBe(order);
  });
  it('weist fremde oder ungültige Antwort-IDs ab', () => {
    expect(choose(start(), 'ungültig')).toEqual(start());
    expect(quizReducer(start(), { type: 'answer', questionId: 'q36', answerId: 'a0' })).toEqual(
      start(),
    );
  });
  it('schließt nach 20 Antworten ab und setzt alle Laufdaten beim Neustart zurück', () => {
    let state = start();
    for (let i = 0; i < QUESTION_COUNT; i++) {
      state = choose(state);
      state = quizReducer(state, { type: 'next' });
    }
    expect(state.view).toBe('calculating');
    expect(state.index).toBe(19);
    state = quizReducer(state, { type: 'finish' });
    expect(state.view).toBe('results');
    expect(calculateScore(state.answers).total).toBe(1000);
    expect(quizReducer(state, { type: 'restart' })).toEqual(initialState);
  });
});

describe('Ränge und Meme-Schwellen', () => {
  it('erhält alle acht Grenzen ohne Lücken oder Überschneidungen', () => {
    expect(ranks).toHaveLength(8);
    expect(ranks.map((rank) => [rank.min, rank.max])).toEqual([
      [0, 99],
      [100, 249],
      [250, 399],
      [400, 549],
      [550, 699],
      [700, 849],
      [850, 949],
      [950, 1000],
    ]);
    for (const rank of ranks) {
      expect(getRank(rank.min)).toBe(rank);
      expect(getRank(rank.max)).toBe(rank);
    }
    for (let score = 0; score <= 1000; score++)
      expect(ranks.filter((rank) => score >= rank.min && score <= rank.max)).toHaveLength(1);
    expect(getRank(-1)).toBe(ranks[0]);
    expect(getRank(1001)).toBe(ranks[7]);
    expect(getRank(NaN)).toBe(ranks[0]);
  });
  it('lässt mit 20 Fragen weiterhin alle Ränge tatsächlich erreichen', () => {
    const reachable = new Set(
      Array.from({ length: 81 }, (_, raw) => getRank(Math.round((raw / 80) * 1000)).name),
    );
    expect(reachable.size).toBe(8);
  });
  it('hält die fünf Reaktionsbänder von den acht Rängen getrennt', () => {
    for (const [score, band] of [
      [0, 'extremely-soft'],
      [250, 'extremely-soft'],
      [251, 'very-soft'],
      [450, 'very-soft'],
      [451, 'average'],
      [650, 'average'],
      [651, 'hard'],
      [800, 'hard'],
      [801, 'extremely-hard'],
      [1000, 'extremely-hard'],
    ] as const)
      expect(getHardnessBand(score)).toBe(band);
  });
  it('ordnet jedem Rang ein passendes Bild und eine deutsche Beschreibung zu', () => {
    for (const rank of ranks) {
      const meme = getResultMeme(rank.min);
      expect(meme.kind).toBe(rank.level <= 4 ? 'soft' : 'hard');
      expect(meme.caption.length).toBeGreaterThan(20);
    }
    expect(getResultMeme(0).id).not.toBe(getResultMeme(250).id);
    expect(getResultMeme(1000).id).toBe('construction');
  });
});

describe('lokale Bilddateien', () => {
  it('enthält vier optimierte lokale Fotos und erhält die drei SpongeBob-Bilder', () => {
    expect(softMemes).toHaveLength(4);
    expect(Object.keys(memes)).toEqual(['construction', 'miner', 'jobsite']);
    expect(allMemes).toHaveLength(7);
    expect(new Set(allMemes.map((meme) => meme.id)).size).toBe(7);
    for (const meme of softMemes) {
      const file = join(
        process.cwd(),
        'public',
        decodeURIComponent(meme.src.replace(/^\.\//, '').replace(/^\//, '')),
      );
      expect(existsSync(file)).toBe(true);
      expect(statSync(file).size).toBeLessThan(60_000);
      expect(readFileSync(file).subarray(8, 12).toString()).toBe('WEBP');
      expect(meme.alt).toContain('Person');
      expect(meme.src).not.toMatch(/^https?:/);
    }
  });
});

describe('situative Sprüche', () => {
  const findReaction = (context: Omit<ReactionContext, 'seed'>) => {
    for (let seed = 0; seed < 1000; seed++) {
      const reaction = getReaction({ ...context, seed });
      if (reaction) return reaction;
    }
    return undefined;
  };
  it('verwendet bei weichen Antworten die bereitgestellten Fotos', () => {
    const reaction = findReaction({ questionId: 'q7', answerId: 'a4', answers: { q7: 'a4' } })!;
    expect(reaction.kind).toBe('soft');
    expect(reaction.meme.kind).toBe('soft');
    expect(reaction.text).toContain('Laptop');
  });
  it('verwendet nach harten Antworten auch bei zuvor weicher Auswahl keine weichen Reaktionen', () => {
    const answers = { ...answersFor(0), q7: 'a0' };
    let hardReactions = 0;
    for (let seed = 0; seed < 100; seed++) {
      const reaction = getReaction({ questionId: 'q7', answerId: 'a0', answers, seed });
      if (reaction) {
        hardReactions++;
        expect(reaction.kind).toBe('hard');
        expect(reaction.meme.kind).toBe('hard');
      }
    }
    expect(hardReactions).toBeGreaterThan(0);
  });
  it('ignoriert unbekannte Antworten und noch nicht beantwortete Fragen', () => {
    expect(findReaction({ questionId: 'q1', answerId: 'a4', answers: {} })).toBeUndefined();
    expect(
      findReaction({ questionId: 'q1', answerId: 'ungültig', answers: { q1: 'ungültig' } }),
    ).toBeUndefined();
  });
  it('ist bei gleichem Lauf und gleicher Auswahl deterministisch', () => {
    const context = { questionId: 'q7', answerId: 'a4', answers: { q7: 'a4' }, seed: 17 };
    expect(getReaction(context)).toEqual(getReaction(context));
  });
  it('respektiert Abkühlphase und bereits gezeigte Fragen', () => {
    const context = { questionId: 'q7', answerId: 'a4', answers: { q7: 'a4' } };
    expect(findReaction({ ...context, shownQuestionIds: new Set(['q7']) })).toBeUndefined();
    expect(findReaction({ ...context, lastReactionAt: 0 })).toBeUndefined();
  });
  it('zeigt bei weichen Läufen öfter Bilder, aber nicht nach jeder Antwort', () => {
    const count = (points: number, seed: number) => {
      const answers: Answers = {};
      let lastReactionAt = -3;
      let n = 0;
      const shown = new Set<string>();
      for (const question of questions) {
        const answer = question.answers.find((answer) => answer.points === points)!;
        answers[question.id] = answer.id;
        const reaction = getReaction({
          questionId: question.id,
          answerId: answer.id,
          answers,
          seed,
          lastReactionAt,
          shownQuestionIds: shown,
        });
        if (reaction) {
          n++;
          lastReactionAt = Object.keys(answers).length;
          shown.add(question.id);
        }
      }
      expect(n).toBeLessThanOrEqual(7);
      return n;
    };
    let soft = 0,
      hard = 0;
    for (let seed = 0; seed < 100; seed++) {
      soft += count(0, seed);
      hard += count(4, seed);
    }
    expect(soft).toBeGreaterThan(hard);
  });
  it('steigert den Spott anhand vorhandener Antworten und bleibt bei harten Werten zurückhaltend', () => {
    expect(getProgressiveRoast(null, 0)).toBeUndefined();
    expect(getProgressiveRoast(0, 1)).toBeUndefined();
    expect(getProgressiveRoast(0, 4)).toContain('nicht gut');
    expect(getProgressiveRoast(0, 10)).toContain('Milchbrötchen');
    expect(getProgressiveRoast(0, 18)).toContain('Handcreme');
    expect(getProgressiveRoast(800, 18)).toBeUndefined();
    const answers = Object.fromEntries(
      questions.slice(0, 16).map((question) => [question.id, 'a4']),
    );
    expect(findReaction({ questionId: 'q5', answerId: 'a4', answers })?.stage).toBe('late');
  });
  it('macht persönliche Anmerkungen anhand echter Antwort-IDs', () => {
    const answers = { q1: 'a4', q19: 'a4', q7: 'a4' };
    expect(getCommentary(answers)).toEqual(getCommentary(answers));
    expect(getCommentary(answers).join(' ')).toContain('Tastatur');
    expect(getCommentary(answers).join(' ')).toContain('Laptop');
    expect(getCommentary(answersFor(4)).join(' ')).toContain('Wetterbericht');
    expect(getCommentary({}).length).toBeGreaterThanOrEqual(2);
  });
});
