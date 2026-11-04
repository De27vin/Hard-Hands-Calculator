import { categories, questions } from '../data/questions';
import type { Answers, CurrentHardness, Score } from '../types';

export function calculateScore(answers: Answers): Score {
  const breakdown = categories.map((category) => {
    const members = questions.filter((question) => question.category === category.id);
    const max = members.reduce(
      (sum, question) => sum + Math.max(...question.answers.map((answer) => answer.points)),
      0,
    );
    const points = members.reduce(
      (sum, question) =>
        sum + (question.answers.find((answer) => answer.id === answers[question.id])?.points ?? 0),
      0,
    );
    return { category, points, max, percent: max ? Math.round((points / max) * 100) : 0 };
  });
  const raw = breakdown.reduce((sum, category) => sum + category.points, 0);
  const max = breakdown.reduce((sum, category) => sum + category.max, 0);
  return {
    total: max ? Math.min(1000, Math.max(0, Math.round((raw / max) * 1000))) : 0,
    raw,
    max,
    categories: breakdown,
  };
}

// A live assessment only considers valid answers actually given, never future questions.
export function calculateCurrentHardness(answers: Answers): CurrentHardness {
  let raw = 0;
  let max = 0;
  let answeredCount = 0;
  for (const question of questions) {
    const answer = question.answers.find((answer) => answer.id === answers[question.id]);
    if (!answer) continue;
    raw += answer.points;
    max += Math.max(...question.answers.map((answer) => answer.points));
    answeredCount++;
  }
  return { total: max ? Math.round((raw / max) * 1000) : null, answeredCount, raw, max };
}

export type HardnessBand = 'extremely-soft' | 'very-soft' | 'average' | 'hard' | 'extremely-hard';
export function getHardnessBand(score: number): HardnessBand {
  if (score <= 250) return 'extremely-soft';
  if (score <= 450) return 'very-soft';
  if (score <= 650) return 'average';
  if (score <= 800) return 'hard';
  return 'extremely-hard';
}

export function isComplete(answers: Answers): boolean {
  return questions.every((question) =>
    question.answers.some((answer) => answer.id === answers[question.id]),
  );
}
