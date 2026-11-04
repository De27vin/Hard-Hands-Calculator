import { describe, expect, it } from 'vitest';
import { categories, questions } from '../src/data/questions';
import { getRank, ranks } from '../src/data/ranks';
import { getCommentary, getReaction, reactions } from '../src/data/reactions';
import { calculateScore, isComplete } from '../src/lib/scoring';
import { initialState, quizReducer } from '../src/lib/quiz';
import type { Answers, QuizState } from '../src/types';

const answersFor = (points: number): Answers =>
  Object.fromEntries(questions.map((q) => [q.id, q.answers.find((a) => a.points === points)!.id]));

describe('content contract', () => {
  it('contains exactly 30 uniquely identified questions in six categories of five', () => {
    expect(questions).toHaveLength(30);
    expect(new Set(questions.map((q) => q.id)).size).toBe(30);
    expect(categories).toHaveLength(6);
    for (const category of categories)
      expect(questions.filter((q) => q.category === category.id)).toHaveLength(5);
  });
  it('has unique, valid answer choices and balanced point ranges', () => {
    for (const question of questions) {
      expect(question.text.length).toBeGreaterThan(5);
      expect(question.answers.length).toBeGreaterThanOrEqual(3);
      expect(question.answers.length).toBeLessThanOrEqual(5);
      expect(categories.some((c) => c.id === question.category)).toBe(true);
      expect(new Set(question.answers.map((a) => a.id)).size).toBe(question.answers.length);
      expect(new Set(question.answers.map((a) => a.label)).size).toBe(question.answers.length);
      for (const answer of question.answers) {
        expect(answer.label.length).toBeGreaterThan(5);
        expect(Number.isInteger(answer.points)).toBe(true);
        expect(answer.points).toBeGreaterThanOrEqual(0);
        expect(answer.points).toBeLessThanOrEqual(4);
      }
      expect(Math.max(...question.answers.map((a) => a.points))).toBe(4);
      expect(Math.min(...question.answers.map((a) => a.points))).toBe(0);
    }
  });
  it('does not reward skipping weather safety or penalize maintenance of working hands', () => {
    expect(questions[25].answers[0].points).toBe(questions[25].answers[1].points);
    expect(questions[26].answers[0].points).toBe(questions[26].answers[1].points);
    expect(questions[12].answers[0].points).toBe(4);
  });
});

describe('scoring', () => {
  it('reaches 0 and 1000 without exceeding either limit', () => {
    expect(calculateScore(answersFor(0)).total).toBe(0);
    expect(calculateScore(answersFor(4)).total).toBe(1000);
    expect(calculateScore({}).total).toBe(0);
    for (let seed = 0; seed < 100; seed++) {
      const mixed = Object.fromEntries(
        questions.map((q, i) => [q.id, q.answers[(seed * 13 + i * 7) % q.answers.length].id]),
      );
      expect(calculateScore(mixed).total).toBeGreaterThanOrEqual(0);
      expect(calculateScore(mixed).total).toBeLessThanOrEqual(1000);
    }
  });
  it('is deterministic and does not mutate answers', () => {
    const answers = Object.freeze(answersFor(2));
    expect(calculateScore(answers)).toEqual(calculateScore(answers));
    expect(calculateScore(answers).total).toBe(500);
  });
  it('ignores unknown answers and unrelated object properties', () => {
    expect(calculateScore({ q1: 'INVALID', bonus: 'a0' }).total).toBe(0);
    expect(isComplete({ ...answersFor(4), q15: 'INVALID' })).toBe(false);
  });
  it('keeps the category breakdown consistent with the raw total', () => {
    const score = calculateScore(answersFor(2));
    expect(score.categories).toHaveLength(6);
    expect(score.categories.reduce((s, c) => s + c.points, 0)).toBe(score.raw);
    expect(score.categories.reduce((s, c) => s + c.max, 0)).toBe(score.max);
    for (const c of score.categories) {
      expect(c.points).toBe(10);
      expect(c.max).toBe(20);
      expect(c.percent).toBe(50);
    }
    expect(score.max).toBe(120);
  });
  it('limits one question to 4 raw points and gives every category equal weight', () => {
    const low = answersFor(0);
    for (const q of questions)
      expect(
        calculateScore({ ...low, [q.id]: q.answers.find((a) => a.points === 4)!.id }).total,
      ).toBe(33);
    for (const cat of categories) {
      const answers = { ...low };
      for (const q of questions.filter((q) => q.category === cat.id))
        answers[q.id] = q.answers.find((a) => a.points === 4)!.id;
      expect(calculateScore(answers).total).toBe(167);
    }
  });
  it('detects complete submissions', () => {
    expect(isComplete({})).toBe(false);
    expect(isComplete(answersFor(4))).toBe(true);
  });
});

describe('ranks', () => {
  it('implements all eight rank boundaries', () => {
    expect(ranks).toHaveLength(8);
    for (const rank of ranks) {
      expect(getRank(rank.min)).toBe(rank);
      expect(getRank(rank.max)).toBe(rank);
    }
  });
  it('covers every integer score without gaps or overlap', () => {
    for (let score = 0; score <= 1000; score++)
      expect(ranks.filter((r) => score >= r.min && score <= r.max)).toHaveLength(1);
    expect(getRank(-10)).toBe(ranks[0]);
    expect(getRank(1001)).toBe(ranks[7]);
    expect(getRank(NaN)).toBe(ranks[0]);
  });
});

describe('quiz state', () => {
  const start = () => quizReducer(initialState, { type: 'start' });
  const choose = (state: QuizState, answerId = 'a0') =>
    quizReducer(state, { type: 'answer', questionId: questions[state.index].id, answerId });
  it('requires an answer before moving forward and clamps previous at zero', () => {
    expect(quizReducer(start(), { type: 'next' })).toEqual(start());
    expect(quizReducer(start(), { type: 'previous' }).index).toBe(0);
    expect(quizReducer(start(), { type: 'finish' }).view).toBe('quiz');
  });
  it('preserves answers while navigating backward and forward', () => {
    let state = choose(start());
    state = quizReducer(state, { type: 'next' });
    state = choose(state, 'a2');
    state = quizReducer(state, { type: 'previous' });
    expect(state.answers).toEqual({ q1: 'a0', q2: 'a2' });
    state = quizReducer(state, { type: 'next' });
    expect(state.index).toBe(1);
    expect(state.answers.q2).toBe('a2');
  });
  it('updates the score when an answer changes', () => {
    let state = choose(start());
    expect(calculateScore(state.answers).total).toBe(33);
    state = choose(state, 'a4');
    expect(calculateScore(state.answers).total).toBe(0);
    expect(Object.keys(state.answers)).toHaveLength(1);
  });
  it('rejects invalid answers and answers to the wrong question', () => {
    expect(choose(start(), 'invalid')).toEqual(start());
    expect(quizReducer(start(), { type: 'answer', questionId: 'q30', answerId: 'a0' })).toEqual(
      start(),
    );
  });
  it('finishes only after 30 valid answers and restarts from a clean slate', () => {
    let state = start();
    for (let i = 0; i < 30; i++) {
      state = choose(state);
      state = quizReducer(state, { type: 'next' });
    }
    expect(state.view).toBe('calculating');
    expect(state.index).toBe(29);
    expect(isComplete(state.answers)).toBe(true);
    state = quizReducer(state, { type: 'finish' });
    expect(state.view).toBe('results');
    expect(calculateScore(state.answers).total).toBe(1000);
    expect(quizReducer(state, { type: 'restart' })).toEqual(initialState);
  });
});

describe('personalization', () => {
  it('uses answer-specific, deterministic commentary', () => {
    const answers = { q1: 'a4', q19: 'a4' };
    expect(getCommentary(answers)).toEqual(getCommentary(answers));
    expect(getCommentary(answers).join(' ')).toContain('keyboard');
    expect(getCommentary(answers).join(' ')).toContain('chair');
    expect(getCommentary(answersFor(4)).join(' ')).toContain('weather');
    expect(getCommentary({}).length).toBeGreaterThanOrEqual(2);
  });
  it('has valid, context-specific reactions on a minority of questions', () => {
    expect(new Set(reactions.map((r) => r.questionId)).size).toBeLessThan(15);
    for (const r of reactions) {
      const q = questions.find((q) => q.id === r.questionId)!;
      expect(q).toBeDefined();
      for (const id of r.answerIds) expect(q.answers.some((a) => a.id === id)).toBe(true);
    }
    expect(getReaction('q18', 'a4')).toContain('AIR CONDITIONING');
    expect(getReaction('q1', 'a0')).toBeUndefined();
  });
});
