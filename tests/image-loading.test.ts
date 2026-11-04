import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadMemeImage } from '../src/lib/sharing';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('Bildladen vor dem PNG-Export', () => {
  it('wartet auf Laden und Dekodieren', async () => {
    const decode = vi.fn().mockResolvedValue(undefined);
    class LoadedImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      decode = decode;
      set src(_: string) {
        queueMicrotask(() => this.onload?.());
      }
    }
    vi.stubGlobal('Image', LoadedImage);
    expect(await loadMemeImage('/foto.webp')).toBeInstanceOf(LoadedImage);
    expect(decode).toHaveBeenCalledOnce();
  });
  it('gibt bei fehlendem Bild einen verständlichen deutschen Fehler zurück', async () => {
    class FailedImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(_: string) {
        queueMicrotask(() => this.onerror?.());
      }
    }
    vi.stubGlobal('Image', FailedImage);
    await expect(loadMemeImage('/fehlt.webp')).rejects.toThrow(
      'Meme-Bild konnte nicht geladen werden.',
    );
  });
  it('beendet hängende Bildanforderungen mit einem Timeout', async () => {
    vi.useFakeTimers();
    class StalledImage {
      onload = null;
      onerror = null;
      src = '';
    }
    vi.stubGlobal('Image', StalledImage);
    const assertion = expect(loadMemeImage('/wartet.webp', 20)).rejects.toThrow('braucht zu lange');
    await vi.advanceTimersByTimeAsync(20);
    await assertion;
  });
});
