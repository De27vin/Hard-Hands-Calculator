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
import { memes } from '../data/memes';
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
            <span className="hero-line">You've got </span>
            <span className="hero-line orange">soooft hands </span>
            <span className="hero-line">sissy boy</span>
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
        <div className="inspection-art">
          <div className="art-top">
            <span>
              <ScanLine aria-hidden="true" size={17} /> THE INSPECTION FOREMAN
            </span>
            <span>HH–001</span>
          </div>
          <div className="foreman-photo">
            <img
              className="hero-meme"
              src={memes.construction.src}
              alt={memes.construction.alt}
              width={716}
              height={704}
              fetchPriority="high"
            />
            <div className="foreman-caption">
              <span className="eyebrow">YOUR ASSIGNED FOREMAN</span>
              <strong>“A BREAK? I JUST GOT HERE.”</strong>
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
      <section className="meme-reports container" aria-labelledby="reports-title">
        <div className="meme-reports-heading">
          <span className="eyebrow orange">REPORTS FROM THE TRENCHES</span>
          <h2 id="reports-title">IT’S BEEN A LONG FIVE MINUTES.</h2>
        </div>
        <div className="meme-report-grid">
          <figure className="meme-report">
            <img
              src={memes.miner.src}
              alt={memes.miner.alt}
              width={716}
              height={658}
              decoding="async"
            />
            <figcaption>
              <span className="eyebrow muted">AFTER ONE HOUSEHOLD CHORE</span>
              <h3>“I JUST DID THE DISHES. DON’T TALK TO ME ABOUT HARD WORK.”</h3>
              <p>The sink was basically a coal mine.</p>
            </figcaption>
          </figure>
          <figure className="meme-report">
            <img
              src={memes.jobsite.src}
              alt={memes.jobsite.alt}
              width={716}
              height={1031}
              decoding="async"
            />
            <figcaption>
              <span className="eyebrow muted">AFTER A MINOR DIY PROJECT</span>
              <h3>“CHANGED A LIGHT BULB. THE FAMILY’S FED FOR ANOTHER DAY.”</h3>
              <p>A provider. A legend. A guy with a stepladder.</p>
            </figcaption>
          </figure>
        </div>
        <details className="meme-source-details">
          <summary>
            MEME SOURCES <ArrowDown aria-hidden="true" size={13} />
          </summary>
          <ul>
            {Object.values(memes).map((meme) => (
              <li key={meme.source}>
                <a href={meme.source} target="_blank" rel="noreferrer">
                  {meme.title} · Know Your Meme
                </a>
              </li>
            ))}
          </ul>
        </details>
      </section>
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
