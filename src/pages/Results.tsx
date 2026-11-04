import { ArrowRight, Check, RotateCcw, Share2, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { calculateScore } from '../lib/scoring';
import { getRank } from '../data/ranks';
import { getCommentary } from '../data/reactions';
import type { Answers } from '../types';
import { ShareDialog } from '../components/ShareDialog';
import { RankIcon } from '../components/RankIcon';
import { getResultMeme } from '../data/memes';

function AnimatedScore({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(value);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame: number;
    const start = performance.now();
    const update = (now: number) => {
      const progress = Math.min(1, (now - start) / 1200);
      setDisplayed(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return (
    <>
      <span aria-hidden="true">{String(displayed).padStart(3, '0')}</span>
      <span className="sr-only">{value}</span>
    </>
  );
}

export function Results({ answers, onRestart }: { answers: Answers; onRestart: () => void }) {
  const score = calculateScore(answers);
  const rank = getRank(score.total);
  const commentary = getCommentary(answers);
  const meme = getResultMeme(score.total);
  const [sharing, setSharing] = useState(false);
  return (
    <main
      id="main"
      className={`results-page container rank-level-${rank.level}`}
      style={{ '--rank-color': rank.color } as CSSProperties}
    >
      <div className="results-topline">
        <span className="eyebrow">
          <Check aria-hidden="true" size={16} /> INSPECTION COMPLETE
        </span>
        <span className="mono muted">
          CERTIFICATE NO. HH–{String(score.total).padStart(4, '0')}
        </span>
      </div>
      <div className="results-layout">
        <section className="score-certificate" aria-labelledby="result-title">
          <div className="hazard-stripe" />
          <div className="certificate-inner">
            <div className="eyebrow muted">YOUR HARDNESS SCORE</div>
            <h1
              className={`huge-score ${score.total === 1000 ? 'four-digit' : ''}`}
              id="result-title"
              tabIndex={-1}
            >
              <AnimatedScore value={score.total} />
              <span className="score-denominator">/ 1000</span>
            </h1>
            <div
              className="hardness-meter"
              role="meter"
              aria-label="Hardness score"
              aria-valuemin={0}
              aria-valuemax={1000}
              aria-valuenow={score.total}
            >
              <span style={{ width: `${score.total / 10}%` }} />
            </div>
            <div className="meter-labels">
              <span>LOTION ENTHUSIAST</span>
              <span>HEAVY MACHINERY</span>
            </div>
            <div className="rank-verdict">
              <span className="result-emoji">
                <RankIcon level={rank.level} size={46} />
                <span className="sr-only">{rank.emoji}</span>
              </span>
              <div>
                <span className="eyebrow muted">THE VERDICT / LEVEL 0{rank.level}</span>
                <h2>{rank.name}</h2>
              </div>
            </div>
            <p className="rank-description">“{rank.description}”</p>
            <div className="certification-seal">
              <ShieldCheck aria-hidden="true" size={20} />
              <span>100% UNOFFICIAL. 100% YOUR PROBLEM.</span>
            </div>
          </div>
        </section>
        <div className="results-detail">
          <section className="breakdown" aria-labelledby="breakdown-title">
            <div className="eyebrow orange">THE DAMAGE REPORT</div>
            <h2 id="breakdown-title">WHERE YOU STAND.</h2>
            {score.categories.map((c) => (
              <div className="category-score" key={c.category.id}>
                <div>
                  <span>{c.category.name}</span>
                  <strong>
                    {c.percent}
                    <small>%</small>
                  </strong>
                </div>
                <div className="category-meter">
                  <span style={{ width: `${c.percent}%` }} />
                </div>
              </div>
            ))}
            <details className="scoring-details">
              <summary>
                HOW THE MATH WORKS <ArrowRight aria-hidden="true" size={14} />
              </summary>
              <p>
                Each answer earns 0–4 points. All 30 questions carry equal weight. Your {score.raw}{' '}
                / {score.max} raw points are normalized to 1000 and rounded once. Each category
                contributes up to one sixth of the total. Percentages above describe each category
                independently.
              </p>
            </details>
          </section>
          <figure className="result-meme">
            <img src={meme.src} alt={meme.alt} width={716} height={704} />
            <figcaption>
              <span className="eyebrow orange">THE FOREMAN’S REACTION</span>
              <p>{meme.caption}</p>
            </figcaption>
          </figure>
          <section className="commentary" aria-labelledby="commentary-title">
            <div className="eyebrow orange">A WORD FROM THE COMMITTEE</div>
            <h2 id="commentary-title">WE HAVE SOME NOTES.</h2>
            {commentary.map((line, i) => (
              <p key={line}>
                <span>0{i + 1}</span>
                {line}
              </p>
            ))}
          </section>
        </div>
      </div>
      <section className="results-actions">
        <div>
          <h2>{rank.tagline}</h2>
          <p>The group chat deserves to know.</p>
        </div>
        <div className="result-buttons">
          <button className="button primary" onClick={() => setSharing(true)}>
            <Share2 aria-hidden="true" size={19} /> SHARE RESULTS
          </button>
          <button className="button secondary" onClick={onRestart}>
            <RotateCcw aria-hidden="true" size={17} /> RESTART QUIZ
          </button>
        </div>
      </section>
      <p className="results-disclaimer">
        This is a joke, brother. All professions deserve respect. Toughness isn’t a health metric.
        Wear your PPE, take your breaks, and moisturize those magnificent hands.
      </p>
      {sharing && <ShareDialog score={score.total} rank={rank} onClose={() => setSharing(false)} />}
    </main>
  );
}
