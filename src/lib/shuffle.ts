import { questions } from '../data/questions';
import type { AnswerOrder, QuizAction } from '../types';

// Fisher–Yates: copy first, then choose uniformly among the remaining positions.
// Randomness lives outside the reducer so React Strict Mode cannot reshuffle a run.
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const value = random();
    if (!Number.isFinite(value) || value < 0 || value >= 1)
      throw new RangeError('Zufallswert muss zwischen 0 und 1 liegen.');
    const j = Math.floor(value * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createAnswerOrder(random: () => number = Math.random): AnswerOrder {
  return Object.fromEntries(
    questions.map((question) => [
      question.id,
      shuffle(
        question.answers.map((answer) => answer.id),
        random,
      ),
    ]),
  );
}

export function createQuizSession(
  random: () => number = Math.random,
): Extract<QuizAction, { type: 'start' }> {
  return {
    type: 'start',
    answerOrder: createAnswerOrder(random),
    seed: Math.floor(random() * 0x100000000),
  };
}
