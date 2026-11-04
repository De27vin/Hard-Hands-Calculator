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
import { QUESTION_COUNT } from '../data/questions';

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
          <Check aria-hidden="true" size={16} /> PRÜFUNG ABGESCHLOSSEN
        </span>
        <span className="mono muted">AKTE NR. HH–{String(score.total).padStart(4, '0')}</span>
      </div>
      <div className="results-layout">
        <section className="score-certificate" aria-labelledby="result-title">
          <div className="hazard-stripe" />
          <div className="certificate-inner">
            <div className="eyebrow muted">DEIN HÄRTEGRAD</div>
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
              aria-label="Härtegrad"
              aria-valuemin={0}
              aria-valuemax={1000}
              aria-valuenow={score.total}
            >
              <span style={{ width: `${score.total / 10}%` }} />
            </div>
            <div className="meter-labels">
              <span>STREICHZART</span>
              <span>SCHWERES GERÄT</span>
            </div>
            <div className="rank-verdict">
              <span className="result-emoji">
                <RankIcon level={rank.level} size={46} />
                <span className="sr-only">{rank.emoji}</span>
              </span>
              <div>
                <span className="eyebrow muted">DAS URTEIL / STUFE 0{rank.level}</span>
                <h2>{rank.name}</h2>
              </div>
            </div>
            <p className="rank-description">“{rank.description}”</p>
            <div className="certification-seal">
              <ShieldCheck aria-hidden="true" size={20} />
              <span>100 % UNAMTLICH. 100 % DEIN PROBLEM.</span>
            </div>
          </div>
        </section>
        <div className="results-detail">
          <figure
            className={`result-meme result-meme-${meme.kind} ${rank.level <= 3 ? 'result-meme-prominent' : ''}`}
          >
            <img
              src={meme.src}
              alt={meme.alt}
              width={716}
              height={800}
              style={{ objectPosition: meme.position }}
            />
            <figcaption>
              <span className="eyebrow orange">DAS GESICHT ZUM ERGEBNIS</span>
              <p>{meme.caption}</p>
            </figcaption>
          </figure>
          <section className="breakdown" aria-labelledby="breakdown-title">
            <div className="eyebrow orange">DIE SCHADENSBILANZ</div>
            <h2 id="breakdown-title">WO DU WIRKLICH STEHST.</h2>
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
                SO WIRD GERECHNET <ArrowRight aria-hidden="true" size={14} />
              </summary>
              <p>
                Jede Antwort gibt 0–4 Rohpunkte. Alle {QUESTION_COUNT} Fragen zählen gleich viel.
                Deine {score.raw} von {score.max} Rohpunkten werden auf 1000 Punkte umgerechnet und
                einmal gerundet. Die Prozentwerte zeigen den Anteil innerhalb des jeweiligen
                Bereichs. Bereiche mit vier Fragen haben maximal 16 Rohpunkte, Bereiche mit drei
                Fragen maximal 12. Schutz, Erholung und sichere Arbeitsstopps bringen keinen Abzug.
              </p>
            </details>
          </section>

          <section className="commentary" aria-labelledby="commentary-title">
            <div className="eyebrow orange">EINE ANMERKUNG DER KOMMISSION</div>
            <h2 id="commentary-title">WIR MÜSSEN REDEN.</h2>
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
          <p>Der Gruppenchat hat ein Recht auf diese Information.</p>
        </div>
        <div className="result-buttons">
          <button className="button primary" onClick={() => setSharing(true)}>
            <Share2 aria-hidden="true" size={19} /> ERGEBNIS TEILEN
          </button>
          <button className="button secondary" onClick={onRestart}>
            <RotateCcw aria-hidden="true" size={17} /> NOCH MAL ANTRETEN
          </button>
        </div>
      </section>
      <p className="results-disclaimer">
        Das ist Satire, Bruder. Jede Arbeit verdient Respekt. Härte ist kein Gesundheitswert. Trag
        deine Schutzausrüstung, mach Pause und pflege diese prächtigen Hände.
      </p>
      {sharing && (
        <ShareDialog
          score={score.total}
          rank={rank}
          commentary={commentary[0]}
          onClose={() => setSharing(false)}
        />
      )}
    </main>
  );
}
