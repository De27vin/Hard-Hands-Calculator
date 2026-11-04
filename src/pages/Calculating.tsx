import { useEffect, useState } from 'react';
import { Fingerprint } from 'lucide-react';

const messages = [
  'ANALYZING HAND TOUGHNESS…',
  'MEASURING FICTIONAL CALLOUS DENSITY…',
  'CHECKING FOR OFFICE WORKER DNA…',
  'CALCULATING FINAL HARDNESS…',
];

export function Calculating({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const interval = setInterval(() => setStep((s) => Math.min(3, s + 1)), 650);
    const timeout = setTimeout(onComplete, reduced ? 150 : 2700);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);
  return (
    <main id="main" className="calculating-page container">
      <div className="calculator-spinner">
        <Fingerprint aria-hidden="true" size={100} strokeWidth={1} />
      </div>
      <span className="eyebrow orange">THE COMMITTEE IS DELIBERATING</span>
      <h1 tabIndex={-1}>
        PLEASE HOLD.
        <br />
        LOOK <span className="orange">TOUGH.</span>
      </h1>
      <div className="calculation-status" role="status" aria-live="polite">
        {messages[step]}
      </div>
      <div className="calculation-track">
        <span style={{ width: `${(step + 1) * 25}%` }} />
      </div>
      <p>Fictional analysis. Real arithmetic. Absolutely no biometric science.</p>
    </main>
  );
}
