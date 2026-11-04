export const categoryIds = [
  'conditions',
  'labor',
  'tools',
  'comfort',
  'mentality',
  'ultimate',
] as const;
export type CategoryId = (typeof categoryIds)[number];
export interface Category {
  id: CategoryId;
  name: string;
  short: string;
  description: string;
}
export interface Answer {
  id: string;
  label: string;
  points: number;
}
export interface Question {
  id: string;
  category: CategoryId;
  text: string;
  aside: string;
  answers: Answer[];
}
export type Answers = Partial<Record<string, string>>;
export type AnswerOrder = Record<string, string[]>;
export interface CategoryScore {
  category: Category;
  points: number;
  max: number;
  percent: number;
}
export interface Score {
  total: number;
  raw: number;
  max: number;
  categories: CategoryScore[];
}
export interface CurrentHardness {
  total: number | null;
  answeredCount: number;
  raw: number;
  max: number;
}
export interface Rank {
  min: number;
  max: number;
  name: string;
  emoji: string;
  description: string;
  tagline: string;
  color: string;
  level: number;
}
export interface Meme {
  id: string;
  src: string;
  alt: string;
  title: string;
  kind: 'soft' | 'hard';
  position?: string;
  source?: string;
}
export interface MemeReaction {
  text: string;
  meme: Meme;
  kind: 'soft' | 'hard';
  intensity: 'normal' | 'high';
  stage: 'early' | 'middle' | 'late';
}
export type QuizView = 'landing' | 'quiz' | 'calculating' | 'results';
export interface QuizState {
  view: QuizView;
  index: number;
  answers: Answers;
  answerOrder: AnswerOrder;
  seed: number;
}
export type QuizAction =
  | { type: 'start'; answerOrder: AnswerOrder; seed: number }
  | { type: 'next' | 'previous' | 'finish' | 'restart' }
  | { type: 'answer'; questionId: string; answerId: string };
