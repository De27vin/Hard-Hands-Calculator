import type { Rank } from '../types';
import { getResultMeme } from '../data/memes';
import { QUESTION_COUNT } from '../data/questions';

function wrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  width: number,
  lineHeight: number,
): number {
  let line = '';
  for (const word of text.split(' ')) {
    if (ctx.measureText(`${line} ${word}`.trim()).width > width && line) {
      ctx.fillText(line, x, y);
      y += lineHeight;
      line = word;
    } else line = `${line} ${word}`.trim();
  }
  ctx.fillText(line, x, y);
  return y + lineHeight;
}

export async function loadMemeImage(src: string, timeoutMs = 8000): Promise<HTMLImageElement> {
  const image = new Image();
  const loaded = new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('Meme-Bild konnte nicht geladen werden.'));
  });
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    image.src = src;
    await Promise.race([
      loaded,
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => reject(new Error('Das Meme-Bild braucht zu lange.')), timeoutMs);
      }),
    ]);
    if (image.decode) await image.decode();
    return image;
  } finally {
    clearTimeout(timeout);
    image.onload = null;
    image.onerror = null;
  }
}

// All images and fonts are local assets. A failed background never prevents PNG export.
export async function createShareCard(score: number, rank: Rank, commentary = ''): Promise<Blob> {
  await document.fonts.ready;
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1200;
  const ctx = canvas.getContext('2d');
  if (!ctx)
    throw new Error('Dein Browser kann gerade kein Bild erstellen. Bitte versuche es erneut.');
  ctx.fillStyle = '#141413';
  ctx.fillRect(0, 0, 1200, 1200);
  try {
    const image = await loadMemeImage(getResultMeme(score).src);
    const scale = Math.max(1200 / image.naturalWidth, 1200 / image.naturalHeight);
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    ctx.drawImage(image, (1200 - width) / 2, (1200 - height) / 2, width, height);
    ctx.fillStyle = 'rgba(20, 20, 19, 0.78)';
    ctx.fillRect(0, 0, 1200, 1200);
  } catch {
    /* Ohne Bild bleibt das vollständige Text-Zertifikat erhalten. */
  }
  ctx.strokeStyle = '#39392f';
  for (let i = 0; i <= 1200; i += 60) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 1200);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(1200, i);
    ctx.stroke();
  }
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, 1200, 24);
  ctx.clip();
  ctx.fillStyle = '#ff621d';
  ctx.fillRect(0, 0, 1200, 24);
  ctx.fillStyle = '#141413';
  for (let x = -30; x < 1200; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 24, 0);
    ctx.lineTo(x, 24);
    ctx.lineTo(x - 24, 24);
    ctx.fill();
  }
  ctx.restore();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ff621d';
  ctx.font = 'bold 27px monospace';
  ctx.fillText('HARD HANDS CALCULATOR', 600, 100);
  ctx.fillStyle = '#f4f1e8';
  ctx.font = '800 93px "Barlow Condensed", Impact, sans-serif';
  ctx.fillText('BRUDER, SOOO WEICHE HÄNDE?', 600, 220);
  ctx.font = '22px monospace';
  ctx.fillStyle = '#bab7aa';
  ctx.fillText('AMTLICH UNAMTLICHES HÄRTE-ZERTIFIKAT', 600, 277);
  ctx.fillStyle = rank.color;
  ctx.font = '800 310px "Barlow Condensed", Impact, sans-serif';
  ctx.fillText(String(score).padStart(3, '0'), 600, 570);
  ctx.font = 'bold 30px monospace';
  ctx.fillStyle = '#bab7aa';
  ctx.fillText('/ 1000 HÄRTEPUNKTE', 600, 629);
  ctx.fillStyle = '#36362f';
  ctx.fillRect(100, 672, 1000, 14);
  ctx.fillStyle = rank.color;
  ctx.fillRect(100, 672, score, 14);
  ctx.font = '800 67px "Barlow Condensed", Impact, sans-serif';
  ctx.fillStyle = '#f4f1e8';
  const rankEnd = wrappedText(ctx, rank.name, 600, 778, 1040, 64);
  ctx.font = 'bold 24px monospace';
  ctx.fillStyle = rank.color;
  const taglineEnd = wrappedText(ctx, rank.tagline, 600, rankEnd + 13, 1020, 33);
  ctx.font = '600 25px "DM Sans", Arial, sans-serif';
  ctx.fillStyle = '#eee9dc';
  const note = commentary || getResultMeme(score).caption;
  wrappedText(ctx, note, 600, taglineEnd + 28, 1000, 34);
  ctx.font = '22px monospace';
  ctx.fillStyle = '#bab7aa';
  ctx.fillText(`${QUESTION_COUNT} FRAGEN. 1 URTEIL. NULL GNADE.`, 600, 1090);
  ctx.font = '18px monospace';
  ctx.fillText('100 % SATIRE. 0 % WISSENSCHAFTLICH.', 600, 1140);
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(
        (blob) =>
          blob
            ? resolve(blob)
            : reject(new Error('PNG konnte nicht erstellt werden. Bitte erneut versuchen.')),
        'image/png',
      );
    } catch {
      reject(
        new Error('Das Bild konnte nicht exportiert werden. Bitte versuche einen anderen Browser.'),
      );
    }
  });
}

export function downloadCard(blob: Blob, score: number): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `hard-hands-${score}.png`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

export async function shareCard(
  blob: Blob,
  score: number,
  rank: Rank,
): Promise<'shared' | 'downloaded' | 'cancelled'> {
  const file = new File([blob], `hard-hands-${score}.png`, { type: 'image/png' });
  try {
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: 'Bruder, sooo weiche Hände?',
        text: `Ich habe ${score}/1000 Punkte: ${rank.name}. ${rank.tagline} Jetzt bist du dran.`,
      });
      return 'shared';
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError')
      return 'cancelled';
  }
  downloadCard(blob, score);
  return 'downloaded';
}
