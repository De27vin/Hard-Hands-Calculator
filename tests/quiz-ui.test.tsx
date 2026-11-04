import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useReducer } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { Quiz } from '../src/pages/Quiz';
import { initialState, quizReducer } from '../src/lib/quiz';

afterEach(cleanup);
function Harness() {
  const [state, dispatch] = useReducer(quizReducer, { ...initialState, view: 'quiz' });
  return <Quiz state={state} dispatch={dispatch} />;
}

describe('quiz interface', () => {
  it('disables next until selected and preserves checked answers when revisiting', () => {
    render(<Harness />);
    expect(screen.getByRole<HTMLButtonElement>('button', { name: /next question/i }).disabled).toBe(
      true,
    );
    const first = screen.getAllByRole<HTMLInputElement>('radio')[0];
    fireEvent.click(first);
    expect(first.checked).toBe(true);
    expect(screen.getByRole<HTMLButtonElement>('button', { name: /next question/i }).disabled).toBe(
      false,
    );
    fireEvent.click(screen.getByRole('button', { name: /next question/i }));
    fireEvent.click(screen.getAllByRole('radio')[2]);
    fireEvent.click(screen.getByRole('button', { name: /previous/i }));
    expect(screen.getAllByRole<HTMLInputElement>('radio')[0].checked).toBe(true);
    fireEvent.click(screen.getAllByRole('radio')[4]);
    fireEvent.click(screen.getByRole('button', { name: /next question/i }));
    expect(screen.getAllByRole<HTMLInputElement>('radio')[2].checked).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: /previous/i }));
    expect(screen.getAllByRole<HTMLInputElement>('radio')[4].checked).toBe(true);
  });
  it('shows an appropriate reaction once per question without blocking navigation', () => {
    render(<Harness />);
    fireEvent.click(screen.getAllByRole('radio')[0]);
    fireEvent.click(screen.getByRole('button', { name: /next question/i }));
    fireEvent.click(screen.getAllByRole('radio')[0]);
    expect(screen.getByRole('status').textContent).toContain('weather wants you to quit');
    expect(screen.getByRole<HTMLButtonElement>('button', { name: /next question/i }).disabled).toBe(
      false,
    );
    fireEvent.click(screen.getByRole('button', { name: /next question/i }));
    expect(screen.getByRole('status').textContent).toBe('');
  });
});
