import {
  ArrowDown,
  ArrowRight,
  Check,
  Fingerprint,
  HardHat,
  ScanLine,
  ShieldCheck,
  Timer,
  Wrench,
} from 'lucide-react';
import { categories } from '../data/questions';
import { ranks } from '../data/ranks';
import { HandMark } from '../components/HandMark';
import { RankIcon } from '../components/RankIcon';

export function Landing({ onStart }: { onStart: () => void }) {
  return (
    <main id="main">
      <section className="hero container" aria-labelledby="landing-title">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="mini-stripes" /> THE OFFICIAL UNOFFICIAL TOUGHNESS TEST
          </div>
          <h1 id="landing-title" tabIndex={-1}>
            SOFT HANDS,
            <br />
            <span className="orange">BROTHER?</span>
            <span className="moai" aria-label="stone face">
              🗿
            </span>
          </h1>
          <p className="hero-description">
            Your 9-to-5 office job doesn’t impress us.
            <br className="desktop-br" /> Prove your hands are <strong>built different.</strong>
          </p>
          <button className="button primary hero-cta" onClick={onStart}>
            TEST YOUR HANDS <ArrowRight aria-hidden="true" size={22} />
          </button>
          <div className="hero-meta">
            <span>
              <Timer aria-hidden="true" size={14} /> ABOUT 5 MINUTES
            </span>
            <span>NO SIGN-UP. NO EXCUSES.</span>
          </div>
        </div>
        <div
          className="inspection-art"
          aria-label="Decorative fictional industrial hand inspection diagram"
          role="img"
        >
          <div className="art-top">
            <span>
              <ScanLine aria-hidden="true" size={17} /> HAND INSPECTION UNIT
            </span>
            <span>HH–001</span>
          </div>
          <div className="art-scan">
            <div className="scan-ring ring-one" />
            <div className="scan-ring ring-two" />
            <div className="crosshair crosshair-one" />
            <div className="crosshair crosshair-two" />
            <span className="scan-label label-left">
              PALM INTEGRITY
              <br />
              AWAITING INPUT
            </span>
            <span className="scan-label label-right">
              CALLOUS INDEX
              <br />
              ???.??
            </span>
            <HandMark className="hero-hand" />
            <div className="scan-beam" />
            <span className="scan-coordinate">X: 000 / Y: TOUGH</span>
            <div className="inspection-stamp">
              <ShieldCheck aria-hidden="true" size={24} />
              <span>
                NOT EVEN
                <br />
                <strong>
                  SLIGHTLY
                  <br />
                  SCIENTIFIC
                </strong>
              </span>
            </div>
          </div>
          <div className="art-bottom">
            <span className="status-dot" /> SUBJECT STATUS: <strong>UNPROVEN.</strong>
            <Fingerprint aria-hidden="true" size={22} />
          </div>
          <div className="hazard-stripe" />
        </div>
      </section>
      <div className="statement-band">
        <div className="container">
          <span>
            30 <small>QUESTIONS.</small>
          </span>
          <span className="band-star">✳</span>
          <span>
            1 <small>SCORE.</small>
          </span>
          <span className="band-star">✳</span>
          <span>
            ZERO <small>MERCY.</small>
          </span>
          <ArrowDown aria-hidden="true" size={28} />
        </div>
      </div>
      <section className="measure-section container" aria-labelledby="measure-title">
        <div className="section-intro">
          <div className="eyebrow orange">THE INSPECTION CHECKLIST</div>
          <h2 id="measure-title">
            TALK IS SOFT.
            <br />
            LET’S SEE THE <span className="outline-text">EVIDENCE.</span>
          </h2>
          <p>
            Six departments. Thirty highly questionable questions. One brutally honest, entirely
            made-up verdict.
          </p>
          <span className="small-note">
            <ShieldCheck aria-hidden="true" size={16} /> Real safety. Fake science. Excellent
            banter.
          </span>
        </div>
        <div className="category-grid">
          {categories.map((category, i) => (
            <div className="category-item" key={category.id}>
              <span className="category-number">0{i + 1}</span>
              <div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
              <Check aria-hidden="true" size={17} />
            </div>
          ))}
        </div>
      </section>
      <section className="rank-section container" id="ranks" aria-labelledby="rank-title">
        <div className="rank-heading">
          <div>
            <div className="eyebrow orange">THE PECKING ORDER</div>
            <h2 id="rank-title">
              FROM LOTION TO <span className="orange">LEGEND.</span>
            </h2>
          </div>
          <span className="small-note">8 RANKS. FEELINGS MAY VARY.</span>
        </div>
        <div className="rank-preview">
          {[ranks[0], ranks[2], ranks[5], ranks[7]].map((rank) => (
            <div
              className="rank-preview-card"
              key={rank.min}
              style={{ '--rank-color': rank.color } as React.CSSProperties}
            >
              <span className="rank-emoji">
                <RankIcon level={rank.level} />
              </span>
              <span className="rank-range">
                {rank.min}–{rank.max} PTS
              </span>
              <h3>{rank.name}</h3>
              <p>{rank.description}</p>
              <div className="rank-ticks">
                {Array.from({ length: 8 }, (_, i) => (
                  <i className={i < rank.level ? 'lit' : ''} key={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <details className="rank-details">
          <summary>
            INSPECT ALL 8 RANKS <ArrowDown aria-hidden="true" size={16} />
          </summary>
          <div className="all-ranks">
            {ranks.map((rank) => (
              <div key={rank.min}>
                <span>
                  {rank.emoji} {rank.name}
                </span>
                <span>
                  {rank.min}–{rank.max}
                </span>
              </div>
            ))}
          </div>
        </details>
      </section>
      <section className="final-cta container">
        <div className="final-cta-mark">
          <HardHat aria-hidden="true" size={38} />
          <Wrench aria-hidden="true" size={27} />
        </div>
        <div>
          <h2>YOUR HANDS. ON THE RECORD.</h2>
          <p>Take the test. Send the score. Start an argument in the group chat.</p>
        </div>
        <button className="button primary" onClick={onStart}>
          LET’S SETTLE THIS <ArrowRight aria-hidden="true" size={20} />
        </button>
      </section>
    </main>
  );
}
