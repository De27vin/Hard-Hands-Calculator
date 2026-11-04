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
import { categories, categoryQuestionCount, QUESTION_COUNT } from '../data/questions';
import { ranks } from '../data/ranks';
import { memes, softMemes } from '../data/memes';
import { RankIcon } from '../components/RankIcon';

export function Landing({ onStart }: { onStart: () => void }) {
  return (
    <main id="main">
      <section className="hero container" aria-labelledby="landing-title">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="mini-stripes" /> DER AMTLICH UNAMTLICHE HÄRTECHECK
          </div>
          <h1 id="landing-title" tabIndex={-1}>
            <span className="hero-line">Bruder, </span>
            <span className="hero-line orange">sooo weiche </span>
            <span className="hero-line">Hände?</span>
          </h1>
          <p className="hero-description">
            Dein Schreibtisch hat Rollen. Deine Ausreden auch.
            <br className="desktop-br" /> Zeig, ob du anpackst – oder nur{' '}
            <strong>„An alle antworten“</strong> drückst.
          </p>
          <button className="button primary hero-cta" onClick={onStart}>
            HÄNDE PRÜFEN <ArrowRight aria-hidden="true" size={22} />
          </button>
          <div className="hero-meta">
            <span>
              <Timer aria-hidden="true" size={14} /> ETWA 4 MINUTEN
            </span>
            <span>KEIN KONTO. KEINE AUSREDEN.</span>
          </div>
        </div>
        <div className="inspection-art">
          <div className="art-top">
            <span>
              <ScanLine aria-hidden="true" size={17} /> DIE PRÜFKOMMISSION
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
              <span className="eyebrow">DEIN ZUGEWIESENER VORARBEITER</span>
              <strong>„PAUSE? ICH BIN DOCH GERADE ERST HIER.“</strong>
            </div>
          </div>
          <figure className="hero-soft-sticker">
            <img src={softMemes[1].src} alt={softMemes[1].alt} width={100} height={110} />
            <figcaption>
              GEGENPROBE:
              <br />
              <strong>WERKSEINSTELLUNG</strong>
            </figcaption>
          </figure>
          <div className="art-bottom">
            <span className="status-dot" /> HÄRTEGRAD: <strong>UNGEKLÄRT.</strong>
            <Fingerprint aria-hidden="true" size={22} />
          </div>
          <div className="hazard-stripe" />
        </div>
      </section>
      <div className="statement-band">
        <div className="container">
          <span>
            {QUESTION_COUNT} <small>FRAGEN.</small>
          </span>
          <span className="band-star">✳</span>
          <span>
            1 <small>URTEIL.</small>
          </span>
          <span className="band-star">✳</span>
          <span>
            NULL <small>GNADE.</small>
          </span>
          <ArrowDown aria-hidden="true" size={28} />
        </div>
      </div>
      <section className="meme-reports container" aria-labelledby="reports-title">
        <div className="meme-reports-heading">
          <span className="eyebrow orange">AUSSAGEN AUS DER KOMFORTZONE</span>
          <h2 id="reports-title">FÜNF MINUTEN. VÖLLIG AM ENDE.</h2>
        </div>
        <div className="meme-report-grid">
          <figure className="meme-report">
            <img
              src={softMemes[0].src}
              alt={softMemes[0].alt}
              width={600}
              height={800}
              decoding="async"
            />
            <figcaption>
              <span className="eyebrow muted">NACH EINEM SCHWERTRANSPORT</span>
              <h3>„DREI GETRÄNKE GETRAGEN. MEIN RÜCKEN BRAUCHT EIN SABBATJAHR.“</h3>
              <p>Die Kugeln im Tee waren Zusatzgewicht.</p>
            </figcaption>
          </figure>
          <figure className="meme-report">
            <img
              src={softMemes[3].src}
              alt={softMemes[3].alt}
              width={600}
              height={800}
              decoding="async"
            />
            <figcaption>
              <span className="eyebrow muted">NACH EINEM PRODUKTIVEN KLICK</span>
              <h3>„EIN TUTORIAL GESPEICHERT. ICH HAB HEUTE SCHON GENUG GELEISTET.“</h3>
              <p>Der Daumen hat morgen Muskelkater.</p>
            </figcaption>
          </figure>
        </div>
        <details className="meme-source-details">
          <summary>
            BILDNACHWEISE <ArrowDown aria-hidden="true" size={13} />
          </summary>
          <p>Meme-Fotos aus der bereitgestellten Sammlung. Die SpongeBob-Motive findest du hier:</p>
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
          <div className="eyebrow orange">DIE BEWEISAUFNAHME</div>
          <h2 id="measure-title">
            REDEN IST WEICH.
            <br />
            ZEIG DIE <span className="outline-text">BEWEISE.</span>
          </h2>
          <p>
            Sechs Bereiche. {QUESTION_COUNT} Fragen mit fragwürdiger Autorität. Ob du Schrauben
            drehst oder nur Däumchen: Wir finden die passende Frechheit.
          </p>
          <span className="small-note">
            <ShieldCheck aria-hidden="true" size={16} /> Echte Sicherheit. Erfundenes Gutachten.
            Stabile Sprüche.
          </span>
        </div>
        <div className="category-grid">
          {categories.map((category, i) => (
            <div className="category-item" key={category.id}>
              <span className="category-number">0{i + 1}</span>
              <div>
                <h3>{category.name}</h3>
                <p>
                  {category.description} · {categoryQuestionCount(category.id)} Fragen
                </p>
              </div>
              <Check aria-hidden="true" size={17} />
            </div>
          ))}
        </div>
      </section>
      <section className="rank-section container" id="ranks" aria-labelledby="rank-title">
        <div className="rank-heading">
          <div>
            <div className="eyebrow orange">DIE RANGORDNUNG</div>
            <h2 id="rank-title">
              VON STREICHZART BIS <span className="orange">STAHLBETON.</span>
            </h2>
          </div>
          <span className="small-note">8 RÄNGE. 0 ANSPRUCH AUF SCHMERZENSGELD.</span>
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
                {rank.min}–{rank.max} PUNKTE
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
            ALLE 8 RÄNGE ANSEHEN <ArrowDown aria-hidden="true" size={16} />
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
          <h2>DEINE HÄNDE. AKTENKUNDIG.</h2>
          <p>Test machen. Ergebnis schicken. Gruppenchat für den Rest des Tages ruinieren.</p>
        </div>
        <button className="button primary" onClick={onStart}>
          JETZT WIRD’S PERSÖNLICH <ArrowRight aria-hidden="true" size={20} />
        </button>
      </section>
    </main>
  );
}
