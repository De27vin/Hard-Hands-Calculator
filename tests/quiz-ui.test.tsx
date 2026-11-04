import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { StrictMode, useReducer } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Quiz } from '../src/pages/Quiz';
import App from '../src/App';
import { initialState, quizReducer } from '../src/lib/quiz';
import { createQuizSession } from '../src/lib/shuffle';
import { getReaction } from '../src/data/reactions';

const random =
  (seed = 9) =>
  () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
const session = createQuizSession(random());
let reactionSeed = 0;
while (
  !getReaction({ questionId: 'q1', answerId: 'a4', answers: { q1: 'a4' }, seed: reactionSeed })
)
  reactionSeed++;

function Harness() {
  const [state, dispatch] = useReducer(quizReducer, {
    ...initialState,
    view: 'quiz',
    answerOrder: session.answerOrder,
    seed: reactionSeed,
  });
  return <Quiz state={state} dispatch={dispatch} />;
}

beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const select = (container: HTMLElement, id: string) =>
  fireEvent.click(container.querySelector<HTMLInputElement>(`input[value="${id}"]`)!);
const order = () => screen.getAllByRole<HTMLInputElement>('radio').map((input) => input.value);

describe('deutsche Quiz-Oberfläche', () => {
  it('zeigt deutsche Beschriftungen und verlangt eine Auswahl vor Weiter', () => {
    const { container } = render(<Harness />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'Wo findet deine Arbeit wirklich statt?',
    );
    expect(screen.getByRole<HTMLButtonElement>('button', { name: 'WEITER' }).disabled).toBe(true);
    expect(screen.getByRole('progressbar').getAttribute('aria-valuemax')).toBe('20');
    select(container, 'a0');
    expect(screen.getByRole<HTMLButtonElement>('button', { name: 'WEITER' }).disabled).toBe(false);
  });
  it('bewahrt gemischte Reihenfolgen und geänderte Auswahl beim Zurückgehen', () => {
    const { container } = render(<Harness />);
    const firstOrder = order();
    expect(firstOrder).toEqual(session.answerOrder.q1);
    select(container, 'a0');
    fireEvent.click(screen.getByRole('button', { name: 'WEITER' }));
    const secondOrder = order();
    select(container, 'a2');
    fireEvent.click(screen.getByRole('button', { name: 'ZURÜCK' }));
    expect(order()).toEqual(firstOrder);
    expect(container.querySelector<HTMLInputElement>('input[value="a0"]')!.checked).toBe(true);
    select(container, 'a4');
    fireEvent.click(screen.getByRole('button', { name: 'WEITER' }));
    expect(order()).toEqual(secondOrder);
    expect(container.querySelector<HTMLInputElement>('input[value="a2"]')!.checked).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'ZURÜCK' }));
    expect(container.querySelector<HTMLInputElement>('input[value="a4"]')!.checked).toBe(true);
  });
  it('mischt bei Rerenders und Strict Mode nicht neu', () => {
    const { container, rerender } = render(
      <StrictMode>
        <Harness />
      </StrictMode>,
    );
    const before = order();
    select(container, 'a2');
    rerender(
      <StrictMode>
        <Harness />
      </StrictMode>,
    );
    expect(order()).toEqual(before);
    expect(container.querySelector<HTMLInputElement>('input[value="a2"]')!.checked).toBe(true);
  });
  it('zeigt eine weiche Reaktion einmal, blockiert keine Navigation und feuert bei Rerenders nicht erneut', () => {
    vi.useFakeTimers();
    const { container, rerender } = render(<Harness />);
    select(container, 'a4');
    expect(screen.getByRole('status').textContent).toContain('Tastatur');
    expect(screen.getByRole<HTMLButtonElement>('button', { name: 'WEITER' }).disabled).toBe(false);
    const image = container.querySelector<HTMLImageElement>('.reaction-meme')!;
    expect(image.src).toContain('/images/soft-hands/');
    act(() => vi.advanceTimersByTime(6600));
    expect(screen.getByRole('status').textContent).toBe('');
    rerender(<Harness />);
    expect(screen.getByRole('status').textContent).toBe('');
    select(container, 'a0');
    select(container, 'a4');
    expect(screen.getByRole('status').textContent).toBe('');
  });
  it('entfernt einen weichen Spruch sofort, wenn die Antwort in hart geändert wird', () => {
    const { container } = render(<Harness />);
    select(container, 'a4');
    expect(container.querySelector('.reaction-soft')).not.toBeNull();
    select(container, 'a0');
    expect(screen.getByRole('status').textContent).toBe('');
    expect(container.querySelector('.reaction-soft')).toBeNull();
  });
  it('startet nach Rückkehr zur Startseite mit leerer Auswahl und neuer Reihenfolge', () => {
    vi.spyOn(Math, 'random').mockImplementation(random(4));
    const { container } = render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'HÄNDE PRÜFEN' }));
    const first = order();
    select(container, 'a0');
    fireEvent.click(screen.getByTitle('Zur Startseite'));
    fireEvent.click(screen.getByRole('button', { name: 'HÄNDE PRÜFEN' }));
    expect(order()).not.toEqual(first);
    expect(screen.getByRole<HTMLButtonElement>('button', { name: 'WEITER' }).disabled).toBe(true);
    expect(screen.queryAllByRole('radio', { checked: true })).toHaveLength(0);
  });
});
