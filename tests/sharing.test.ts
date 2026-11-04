import { afterEach, describe, expect, it, vi } from 'vitest';
import { ranks } from '../src/data/ranks';
import { shareCard } from '../src/lib/sharing';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function mockDownload() {
  const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:test'), revokeObjectURL: vi.fn() });
  vi.spyOn(window, 'setTimeout').mockReturnValue(
    1 as unknown as ReturnType<typeof window.setTimeout>,
  );
  return click;
}

describe('sharing fallbacks', () => {
  const blob = new Blob(['png'], { type: 'image/png' });
  it('downloads a PNG when native file sharing is unavailable', async () => {
    const click = mockDownload();
    vi.stubGlobal('navigator', {});
    expect(await shareCard(blob, 782, ranks[5])).toBe('downloaded');
    expect(click).toHaveBeenCalledOnce();
  });
  it('uses native sharing when supported', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { canShare: () => true, share });
    expect(await shareCard(blob, 782, ranks[5])).toBe('shared');
    expect(share.mock.calls[0][0].files[0].type).toBe('image/png');
  });
  it('respects native share cancellation without downloading', async () => {
    const click = mockDownload();
    vi.stubGlobal('navigator', {
      canShare: () => true,
      share: vi.fn().mockRejectedValue(new DOMException('Cancelled', 'AbortError')),
    });
    expect(await shareCard(blob, 782, ranks[5])).toBe('cancelled');
    expect(click).not.toHaveBeenCalled();
  });
  it('downloads if the share target rejects the file', async () => {
    const click = mockDownload();
    vi.stubGlobal('navigator', {
      canShare: () => true,
      share: vi.fn().mockRejectedValue(new Error('Unsupported target')),
    });
    expect(await shareCard(blob, 782, ranks[5])).toBe('downloaded');
    expect(click).toHaveBeenCalledOnce();
  });
});
