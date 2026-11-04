import { categories, questions } from '../data/questions';
import type { Answers, Score } from '../types';

export function calculateScore(answers: Answers): Score {
  const breakdown = categories.map((category) => {
    const members = questions.filter((q) => q.category === category.id);
    const max = members.reduce((sum, q) => sum + Math.max(...q.answers.map((a) => a.points)), 0);
    const points = members.reduce(
      (sum, q) => sum + (q.answers.find((a) => a.id === answers[q.id])?.points ?? 0),
      0,
    );
    return { category, points, max, percent: max ? Math.round((points / max) * 100) : 0 };
  });
  const raw = breakdown.reduce((sum, c) => sum + c.points, 0);
  const max = breakdown.reduce((sum, c) => sum + c.max, 0);
  return {
    total: max ? Math.min(1000, Math.max(0, Math.round((raw / max) * 1000))) : 0,
    raw,
    max,
    categories: breakdown,
  };
}

export function isComplete(answers: Answers): boolean {
  return questions.every((q) => q.answers.some((a) => a.id === answers[q.id]));
}
