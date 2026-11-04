import { ArrowLeft, ArrowRight, Check, HardHat, ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Dispatch } from 'react';
import { categories, categoryQuestionCount, questions, QUESTION_COUNT } from '../data/questions';
import { getProgressiveRoast, getReaction } from '../data/reactions';
import { getSoftMeme } from '../data/memes';
import { calculateCurrentHardness } from '../lib/scoring';
import type { MemeReaction, QuizAction, QuizState } from '../types';

export function Quiz({ state, dispatch }: { state: QuizState; dispatch: Dispatch<QuizAction> }) {
  const question = questions[state.index];
  const categoryIndex = categories.findIndex((category) => category.id === question.category);
  const category = categories[categoryIndex];
  const selected = state.answers[question.id];
  const current = calculateCurrentHardness(state.answers);
  const answered = current.answeredCount;
  const ordered = (
    state.answerOrder[question.id] ?? question.answers.map((answer) => answer.id)
  ).map((id) => question.answers.find((answer) => answer.id === id)!);
  const [reaction, setReaction] = useState<MemeReaction>();
  const shown = useRef(new Set<string>());
  const lastReactionAt = useRef(-3);
  const previousReaction = useRef<MemeReaction | undefined>(undefined);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const progressiveRoast = getProgressiveRoast(current.total, answered);
  const sidebarMeme = getSoftMeme(state.seed + Math.floor(answered / 6));

  useEffect(() => {
    setReaction(undefined);
    clearTimeout(timer.current);
    return () => clearTimeout(timer.current);
  }, [state.index]);

  const choose = (answerId: string) => {
    const answers = { ...state.answers, [question.id]: answerId };
    // Only an actual selection event can emit a reaction. Renders do not run this logic.
    clearTimeout(timer.current);
    setReaction(undefined);
    const next = getReaction({
      questionId: question.id,
      answerId,
      answers,
      seed: state.seed,
      lastReactionAt: lastReactionAt.current,
      shownQuestionIds: shown.current,
      previousMemeId: previousReaction.current?.meme.id,
      previousText: previousReaction.current?.text,
    });
    dispatch({ type: 'answer', questionId: question.id, answerId });
    if (next) {
      shown.current.add(question.id);
      lastReactionAt.current = calculateCurrentHardness(answers).answeredCount;
      previousReaction.current = next;
      setReaction(next);
      timer.current = setTimeout(() => setReaction(undefined), 6500);
    }
  };

  return (
    <main className="quiz-page container" id="main">
      <div className="quiz-topline">
        <span className="eyebrow">
          <span className="status-dot" /> HÄNDE AUF DEN PRÜFSTAND
        </span>
        <span className="mono muted">
          {String(answered).padStart(2, '0')} / {QUESTION_COUNT} BEANTWORTET
        </span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label="Quiz-Fortschritt"
        aria-valuemin={0}
        aria-valuemax={QUESTION_COUNT}
        aria-valuenow={answered}
      >
        <span style={{ width: `${(answered / QUESTION_COUNT) * 100}%` }} />
      </div>
      <div className="quiz-layout">
        <aside className="quiz-sidebar" aria-label="Bereiche der Prüfung">
          <div className="eyebrow muted">DIE BEWEISAKTE</div>
          <ol>
            {categories.map((category, i) => (
              <li
                key={category.id}
                aria-current={i === categoryIndex ? 'step' : undefined}
                className={i === categoryIndex ? 'current' : i < categoryIndex ? 'complete' : ''}
              >
                <span className="step-number">
                  {i < categoryIndex ? <Check aria-hidden="true" size={14} /> : `0${i + 1}`}
                </span>
                <span>
                  {category.name}
                  <small>{categoryQuestionCount(category.id)} FRAGEN</small>
                </span>
              </li>
            ))}
          </ol>
          {progressiveRoast ? (
            <figure className="sidebar-soft-meme">
              <img
                src={sidebarMeme.src}
                alt={sidebarMeme.alt}
                width={150}
                height={160}
                style={{ objectPosition: sidebarMeme.position }}
              />
              <figcaption>
                <span className="eyebrow orange">BISHERIGE BEWEISLAGE</span>
                <p>{progressiveRoast}</p>
              </figcaption>
            </figure>
          ) : (
            <div className="sidebar-note">
              <ShieldCheck aria-hidden="true" size={24} />
              <p>
                Schutz an. Pausen machen. Vernünftig arbeiten.
                <br />
                <strong>Nur dein Ego muss hier ohne Helm durch.</strong>
              </p>
            </div>
          )}
        </aside>
        <section className="question-section" aria-labelledby="question-title">
          <div className="question-kicker">
            <span className="eyebrow orange">{category.name}</span>
            <span className="question-count">
              FRAGE <strong>{String(state.index + 1).padStart(2, '0')}</strong>
              <span>/ {QUESTION_COUNT}</span>
            </span>
          </div>
          <div className="question-body" key={question.id}>
            <h1 id="question-title" tabIndex={-1}>
              {question.text}
            </h1>
            <p className="question-aside">{question.aside}</p>
            <fieldset className="answer-list" aria-labelledby="question-title">
              <legend className="sr-only">Wähle eine Antwort</legend>
              {ordered.map((answer, i) => (
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
                  <span className="answer-letter" aria-hidden="true">
                    {String.fromCharCode(65 + i)}
                  </span>
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
              <ArrowLeft aria-hidden="true" size={18} /> ZURÜCK
            </button>
            <span className="question-hint">
              EINE ANTWORT. KEIN URTEIL.
              <br />
              <strong>DAS KOMMT ERST AM ENDE.</strong>
            </span>
            <button
              className="button primary next-button"
              disabled={!selected}
              onClick={() => dispatch({ type: 'next' })}
            >
              {state.index === QUESTION_COUNT - 1 ? 'URTEIL ABHOLEN' : 'WEITER'}{' '}
              <ArrowRight aria-hidden="true" size={19} />
            </button>
          </div>
          <div
            className={`reaction-slot ${reaction ? `active reaction-${reaction.kind} reaction-${reaction.stage} ${reaction.intensity === 'high' ? 'reaction-intense' : ''}` : ''}`}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {reaction && (
              <>
                <img
                  className="reaction-meme"
                  src={reaction.meme.src}
                  alt={reaction.meme.alt}
                  width={84}
                  height={96}
                  style={{ objectPosition: reaction.meme.position }}
                />
                <p>{reaction.text}</p>
              </>
            )}
          </div>
        </section>
      </div>
      <div className="quiz-bottom-note">
        <HardHat aria-hidden="true" size={16} /> SATIRE. DEIN WERT ALS MENSCH WIRD NICHT IN HORNHAUT
        GEMESSEN.
      </div>
    </main>
  );
}
