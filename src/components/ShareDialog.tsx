import { Download, Share2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createShareCard, downloadCard, shareCard } from '../lib/sharing';
import type { Rank } from '../types';

export function ShareDialog({
  score,
  rank,
  onClose,
}: {
  score: number;
  rank: Rank;
  onClose: () => void;
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
    createShareCard(score, rank)
      .then((blob) => {
        if (disposed) return;
        url = URL.createObjectURL(blob);
        setCard({ blob, url });
      })
      .catch((e) => {
        if (!disposed)
          setError(
            e instanceof Error ? e.message : 'Could not create your card. Please try again.',
          );
      });
    return () => {
      disposed = true;
      if (url) URL.revokeObjectURL(url);
      element?.close();
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [score, rank]);

  const share = async () => {
    if (!card) return;
    setBusy(true);
    setError('');
    try {
      const result = await shareCard(card.blob, score, rank);
      setStatus(
        result === 'downloaded'
          ? 'PNG downloaded. Drop it into the group chat.'
          : result === 'shared'
            ? 'Certificate dispatched. Prepare for the replies.'
            : 'Sharing cancelled. Your card is still ready.',
      );
    } catch {
      setError('Sharing failed. Try the Download PNG button.');
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
            <div className="eyebrow orange">OFFICIAL UNOFFICIAL CERTIFICATE</div>
            <h2 id="share-title">MAKE IT THE GROUP CHAT’S PROBLEM.</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close share dialog">
            <X aria-hidden="true" />
          </button>
        </div>
        {card ? (
          <img
            className="share-preview"
            src={card.url}
            width={1200}
            height={1200}
            alt={`Hard Hands Calculator certificate: ${score} out of 1000. ${rank.name}. ${rank.tagline}`}
          />
        ) : (
          <p className="share-loading" role="status">
            {error || 'STAMPING YOUR CERTIFICATE…'}
          </p>
        )}
        <div className="share-actions">
          <button className="button primary" disabled={!card || busy} onClick={share}>
            <Share2 aria-hidden="true" size={18} />
            {busy ? 'SHARING…' : 'SHARE CARD'}
          </button>
          <button
            className="button secondary"
            disabled={!card}
            onClick={() => {
              if (card) {
                downloadCard(card.blob, score);
                setStatus('PNG downloaded. Send it to someone with softer hands.');
              }
            }}
          >
            <Download aria-hidden="true" size={18} /> DOWNLOAD PNG
          </button>
        </div>
        <p className="share-status" role="status">
          {error || status || 'Native sharing where supported. PNG download everywhere else.'}
        </p>
      </div>
    </dialog>
  );
}
