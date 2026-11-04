import {
  ArrowLeft,
  ArrowRight,
  Check,
  HardHat,
  MessageSquareQuote,
  ShieldCheck,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Dispatch } from 'react';
import { categories, questions } from '../data/questions';
import { getReaction } from '../data/reactions';
import type { QuizAction, QuizState } from '../types';

export function Quiz({ state, dispatch }: { state: QuizState; dispatch: Dispatch<QuizAction> }) {
  const question = questions[state.index];
  const categoryIndex = categories.findIndex((c) => c.id === question.category);
  const category = categories[categoryIndex];
  const selected = state.answers[question.id];
  const answered = Object.keys(state.answers).length;
  const [reaction, setReaction] = useState('');
  const shown = useRef(new Set<string>());
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setReaction('');
    clearTimeout(timer.current);
    return () => clearTimeout(timer.current);
  }, [state.index]);

  const choose = (answerId: string) => {
    dispatch({ type: 'answer', questionId: question.id, answerId });
    const text = getReaction(question.id, answerId);
    if (text && !shown.current.has(question.id)) {
      shown.current.add(question.id);
      setReaction(text);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setReaction(''), 6500);
    }
  };

  return (
    <main className="quiz-page container" id="main">
      <div className="quiz-topline">
        <span className="eyebrow">
          <span className="status-dot" /> INSPECTION IN PROGRESS
        </span>
        <span className="mono muted">{String(answered).padStart(2, '0')} / 30 ANSWERED</span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label="Quiz progress"
        aria-valuemin={0}
        aria-valuemax={30}
        aria-valuenow={answered}
      >
        <span style={{ width: `${(answered / 30) * 100}%` }} />
      </div>
      <div className="quiz-layout">
        <aside className="quiz-sidebar" aria-label="Inspection categories">
          <div className="eyebrow muted">THE CHECKLIST</div>
          <ol>
            {categories.map((cat, i) => (
              <li
                key={cat.id}
                aria-current={i === categoryIndex ? 'step' : undefined}
                className={i === categoryIndex ? 'current' : i < categoryIndex ? 'complete' : ''}
              >
                <span className="step-number">
                  {i < categoryIndex ? <Check aria-hidden="true" size={14} /> : `0${i + 1}`}
                </span>
                <span>
                  {cat.name}
                  <small>5 QUESTIONS</small>
                </span>
              </li>
            ))}
          </ol>
          <div className="sidebar-note">
            <ShieldCheck aria-hidden="true" size={24} />
            <p>
              Work smart. Wear your PPE. Take your breaks.
              <br />
              <strong>The only thing at risk is your ego.</strong>
            </p>
          </div>
        </aside>
        <section className="question-section" aria-labelledby="question-title">
          <div className="question-kicker">
            <span className="eyebrow orange">{category.name}</span>
            <span className="question-count">
              QUESTION <strong>{String(state.index + 1).padStart(2, '0')}</strong>
              <span>/ 30</span>
            </span>
          </div>
          <div className="question-body" key={question.id}>
            <h1 id="question-title" tabIndex={-1}>
              {question.text}
            </h1>
            <p className="question-aside">{question.aside}</p>
            <fieldset className="answer-list" aria-labelledby="question-title">
              <legend className="sr-only">Choose one answer</legend>
              {question.answers.map((answer, i) => (
                <label
                  className={`answer-card ${selected === answer.id ? 'selected' : ''}`}
                  key={answer.id}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={answer.id}
                    checked={selected === answer.id}
                    onChange={() => choose(answer.id)}
                  />
                  <span className="answer-letter">{String.fromCharCode(65 + i)}</span>
                  <span className="answer-label">{answer.label}</span>
                  <span className="radio-mark">
                    {selected === answer.id && (
                      <Check aria-hidden="true" size={14} strokeWidth={3} />
                    )}
                  </span>
                </label>
              ))}
            </fieldset>
          </div>
          <div className="quiz-navigation">
            <button
              className="button back-button"
              disabled={state.index === 0}
              onClick={() => dispatch({ type: 'previous' })}
            >
              <ArrowLeft aria-hidden="true" size={18} /> PREVIOUS
            </button>
            <span className="question-hint">
              ONE ANSWER. NO JUDGMENT.
              <br />
              <strong>OKAY, SOME JUDGMENT.</strong>
            </span>
            <button
              className="button primary next-button"
              disabled={!selected}
              onClick={() => dispatch({ type: 'next' })}
            >
              {state.index === 29 ? 'DELIVER THE VERDICT' : 'NEXT QUESTION'}{' '}
              <ArrowRight aria-hidden="true" size={19} />
            </button>
          </div>
          <div
            className={`reaction-slot ${reaction ? 'active' : ''}`}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {reaction && (
              <>
                <MessageSquareQuote aria-hidden="true" size={23} />
                <p>{reaction}</p>
              </>
            )}
          </div>
        </section>
      </div>
      <div className="quiz-bottom-note">
        <HardHat aria-hidden="true" size={16} /> THIS IS SATIRE. YOUR ACTUAL WORTH IS NOT MEASURED
        IN CALLOUSES.
      </div>
    </main>
  );
}
