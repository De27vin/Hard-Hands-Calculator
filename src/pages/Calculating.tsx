import { useEffect, useState } from 'react';
import { Fingerprint } from 'lucide-react';

const messages = [
  'FIKTIVE HORNHAUTDICHTE WIRD GEMESSEN …',
  'MAUSARM WIRD VON ARBEIT UNTERSCHIEDEN …',
  'AUSREDEN WERDEN ENTFERNT …',
  'DIE KOMMISSION FORMULIERT DEN SPRUCH …',
];

export function Calculating({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const interval = setInterval(
      () => setStep((value) => Math.min(messages.length - 1, value + 1)),
      650,
    );
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
      <span className="eyebrow orange">DIE KOMMISSION MUSS KURZ LACHEN</span>
      <h1 tabIndex={-1}>
        KURZ WARTEN.
        <br />
        HART <span className="orange">GUCKEN.</span>
      </h1>
      <div className="calculation-status" role="status" aria-live="polite">
        {messages[step]}
      </div>
      <div className="calculation-track">
        <span style={{ width: `${(step + 1) * 25}%` }} />
      </div>
      <p>Erfundene Analyse. Echte Addition. Keine biometrische Messung.</p>
    </main>
  );
}
