import { questions } from '../data/questions';
import { isComplete } from './scoring';
import type { QuizAction, QuizState } from '../types';

export const initialState: QuizState = { view: 'landing', index: 0, answers: {} };

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'start':
      return { view: 'quiz', index: 0, answers: {} };
    case 'restart':
      return { ...initialState, answers: {} };
    case 'answer': {
      const question = questions[state.index];
      if (
        state.view !== 'quiz' ||
        question.id !== action.questionId ||
        !question.answers.some((a) => a.id === action.answerId)
      )
        return state;
      return { ...state, answers: { ...state.answers, [action.questionId]: action.answerId } };
    }
    case 'previous':
      return state.view === 'quiz' ? { ...state, index: Math.max(0, state.index - 1) } : state;
    case 'next': {
      if (
        state.view !== 'quiz' ||
        !questions[state.index].answers.some(
          (a) => a.id === state.answers[questions[state.index].id],
        )
      )
        return state;
      if (state.index === questions.length - 1)
        return isComplete(state.answers) ? { ...state, view: 'calculating' } : state;
      return { ...state, index: state.index + 1 };
    }
    case 'finish':
      return state.view === 'calculating' && isComplete(state.answers)
        ? { ...state, view: 'results' }
        : state;
  }
}
