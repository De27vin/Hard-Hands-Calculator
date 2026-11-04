import type { Rank } from '../types';
import { getResultMeme } from '../data/memes';

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

// Canvas uses device-local fonts and shapes; no network, screenshots, or image APIs.
export async function createShareCard(score: number, rank: Rank): Promise<Blob> {
  await document.fonts.ready;
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1200;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Your browser could not create an image. Try another browser.');
  ctx.fillStyle = '#141413';
  ctx.fillRect(0, 0, 1200, 1200);
  // Same-origin bundled assets keep PNG export independent of third-party CORS.
  // An unavailable image still yields a complete, readable text certificate.
  try {
    const image = new Image();
    image.src = getResultMeme(score).src;
    await image.decode();
    const scale = Math.max(1200 / image.naturalWidth, 1200 / image.naturalHeight);
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    ctx.drawImage(image, (1200 - width) / 2, (1200 - height) / 2, width, height);
    ctx.fillStyle = 'rgba(20, 20, 19, 0.78)';
    ctx.fillRect(0, 0, 1200, 1200);
  } catch {
    /* Keep the text-only background when image decoding is unavailable. */
  }
  ctx.strokeStyle = '#292925';
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
  ctx.fillText('HARD HANDS CALCULATOR', 600, 105);
  ctx.fillStyle = '#f4f1e8';
  ctx.font = '800 82px "Barlow Condensed", Impact, sans-serif';
  ctx.fillText("You've got soooft hands", 600, 200);
  ctx.fillText('sissy boy', 600, 278);
  ctx.font = '22px monospace';
  ctx.fillStyle = '#aca99f';
  ctx.fillText('OFFICIAL UNOFFICIAL HARDNESS CERTIFICATE', 600, 329);
  ctx.fillStyle = rank.color;
  ctx.font = '800 340px "Barlow Condensed", Impact, sans-serif';
  ctx.fillText(String(score).padStart(3, '0'), 600, 604);
  ctx.font = 'bold 32px monospace';
  ctx.fillStyle = '#aca99f';
  ctx.fillText('/ 1000 HARDNESS POINTS', 600, 671);
  ctx.fillStyle = '#36362f';
  ctx.fillRect(100, 718, 1000, 16);
  ctx.fillStyle = rank.color;
  ctx.fillRect(100, 718, score, 16);
  ctx.font = '800 72px "Barlow Condensed", Impact, sans-serif';
  ctx.fillStyle = '#f4f1e8';
  const rankEnd = wrappedText(ctx, rank.name, 600, 832, 1020, 70);
  ctx.font = 'bold 27px monospace';
  ctx.fillStyle = rank.color;
  wrappedText(ctx, rank.tagline, 600, rankEnd + 32, 1000, 38);
  ctx.font = '22px monospace';
  ctx.fillStyle = '#aca99f';
  ctx.fillText('30 QUESTIONS. 1 SCORE. ZERO MERCY.', 600, 1080);
  ctx.font = '19px monospace';
  ctx.fillText('100% SATIRE. 0% SCIENTIFIC ACCURACY.', 600, 1130);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('PNG export failed. Please try again.'))),
      'image/png',
    ),
  );
}

export function downloadCard(blob: Blob, score: number): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `hard-hands-${score}.png`;
  document.body.append(link);
  link.click();
  link.remove();
  // Give mobile browsers enough time to consume the object URL.
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

export async function shareCard(
  blob: Blob,
  score: number,
  rank: Rank,
): Promise<'shared' | 'downloaded' | 'cancelled'> {
  const file = new File([blob], `hard-hands-${score}.png`, { type: 'image/png' });
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: "You've got soooft hands sissy boy",
        text: `I scored ${score}/1000: ${rank.name}. ${rank.tagline} Your turn.`,
      });
      return 'shared';
    } catch (error) {
      if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError')
        return 'cancelled';
      // Restricted or unsupported share targets fall back to an ordinary download.
    }
  }
  downloadCard(blob, score);
  return 'downloaded';
}
