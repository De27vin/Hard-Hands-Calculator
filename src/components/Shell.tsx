import { ArrowUpRight, HardHat } from 'lucide-react';
import type { ReactNode } from 'react';

export function Shell({
  children,
  onHome,
  isLanding,
}: {
  children: ReactNode;
  onHome: () => void;
  isLanding: boolean;
}) {
  return (
    <>
      <a className="skip-link" href="#main">
        Zum Inhalt springen
      </a>
      <header className="site-header container">
        <button className="brand" onClick={onHome} title="Zur Startseite">
          <span className="brand-icon">
            <HardHat aria-hidden="true" size={25} strokeWidth={2.5} />
          </span>
          <span>
            HARD HANDS <span className="brand-sub">CALCULATOR</span>
          </span>
        </button>
        <div className="header-status">
          <span className="status-dot" /> UNANGEMESSEN ERNST FÜR EINEN WITZ
        </div>
        <a className="header-link" href={isLanding ? '#ranks' : '#main'}>
          {isLanding ? 'DIE RÄNGE' : 'DIE PRÜFUNG'} <ArrowUpRight aria-hidden="true" size={15} />
        </a>
      </header>
      {children}
      <footer className="site-footer container">
        <span>
          HARD HANDS CALCULATOR <span className="muted">/ ABTEILUNG GROSSE KLAPPE</span>
        </span>
        <span>100 % Satire. 0 % wissenschaftlich.</span>
        <span className="footer-note">Jede Arbeit verdient Respekt. Deine auch.</span>
      </footer>
    </>
  );
}
