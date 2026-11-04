import { Download, Share2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createShareCard, downloadCard, shareCard } from '../lib/sharing';
import type { Rank } from '../types';

export function ShareDialog({
  score,
  rank,
  onClose,
  commentary = '',
}: {
  score: number;
  rank: Rank;
  onClose: () => void;
  commentary?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [card, setCard] = useState<{ blob: Blob; url: string }>();
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const element = dialog.current;
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    element?.showModal();
    let disposed = false;
    let url: string;
    createShareCard(score, rank, commentary)
      .then((blob) => {
        if (disposed) return;
        url = URL.createObjectURL(blob);
        setCard({ blob, url });
      })
      .catch((e) => {
        if (!disposed)
          setError(
            e instanceof Error
              ? e.message
              : 'Die Karte konnte nicht erstellt werden. Bitte versuche es erneut.',
          );
      });
    return () => {
      disposed = true;
      if (url) URL.revokeObjectURL(url);
      element?.close();
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [score, rank, commentary]);

  const share = async () => {
    if (!card) return;
    setBusy(true);
    setError('');
    try {
      const result = await shareCard(card.blob, score, rank);
      setStatus(
        result === 'downloaded'
          ? 'PNG gespeichert. Ab damit in den Gruppenchat.'
          : result === 'shared'
            ? 'Zertifikat verschickt. Die Antworten werden persönlich.'
            : 'Teilen abgebrochen. Deine Karte wartet hier auf dich.',
      );
    } catch {
      setError('Teilen hat nicht geklappt. Versuch es mit „PNG speichern“.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <dialog
      ref={dialog}
      className="share-dialog"
      aria-labelledby="share-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="share-dialog-inner">
        <div className="share-heading">
          <div>
            <div className="eyebrow orange">AMTLICH UNAMTLICHES ZERTIFIKAT</div>
            <h2 id="share-title">MACH ES ZUM PROBLEM DES GRUPPENCHATS.</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Teilen-Fenster schließen">
            <X aria-hidden="true" />
          </button>
        </div>
        {card ? (
          <img
            className="share-preview"
            src={card.url}
            width={1200}
            height={1200}
            alt={`Hard Hands Calculator: Zertifikat mit ${score} von 1000 Punkten. ${rank.name}. ${rank.tagline}`}
          />
        ) : (
          <p className="share-loading" role="status">
            {error || 'DEIN ZERTIFIKAT WIRD ABGESTEMPELT …'}
          </p>
        )}
        <div className="share-actions">
          <button className="button primary" disabled={!card || busy} onClick={share}>
            <Share2 aria-hidden="true" size={18} />
            {busy ? 'WIRD GETEILT …' : 'KARTE TEILEN'}
          </button>
          <button
            className="button secondary"
            disabled={!card}
            onClick={() => {
              if (card) {
                downloadCard(card.blob, score);
                setStatus('PNG gespeichert. Schick es jemandem mit weicheren Händen.');
              }
            }}
          >
            <Download aria-hidden="true" size={18} /> PNG SPEICHERN
          </button>
        </div>
        <p className="share-status" role="status">
          {error ||
            status ||
            'Direkt teilen, wenn dein Browser es unterstützt. Sonst wird die PNG gespeichert.'}
        </p>
      </div>
    </dialog>
  );
}
