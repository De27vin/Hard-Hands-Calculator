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
        Skip to content
      </a>
      <header className="site-header container">
        <button className="brand" onClick={onHome} title="Return to home">
          <span className="brand-icon">
            <HardHat aria-hidden="true" size={25} strokeWidth={2.5} />
          </span>
          <span>
            HARD HANDS <span className="brand-sub">CALCULATOR</span>
          </span>
        </button>
        <div className="header-status">
          <span className="status-dot" /> UNREASONABLY SERIOUS ABOUT A JOKE
        </div>
        <a className="header-link" href={isLanding ? '#ranks' : '#main'}>
          {isLanding ? 'THE RANKS' : 'THE INSPECTION'} <ArrowUpRight aria-hidden="true" size={15} />
        </a>
      </header>
      {children}
      <footer className="site-footer container">
        <span>
          HARD HANDS CALCULATOR <span className="muted">/ EST. FOR THE BANTER</span>
        </span>
        <span>100% satire. 0% scientific accuracy.</span>
        <span className="footer-note">All work deserves respect. Even yours.</span>
      </footer>
    </>
  );
}
