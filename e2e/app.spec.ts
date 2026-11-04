import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('landing, complete quiz, edit answers, PNG export, and restart', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle(/Hard Hands Calculator/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    "You've got soooft hands sissy boy",
  );
  await page.evaluate(() => document.fonts.ready);
  await expect
    .poll(() =>
      page.locator('.hero-meme').evaluate((image: HTMLImageElement) => image.naturalWidth),
    )
    .toBeGreaterThan(0);
  await expect(page.locator('.meme-report img')).toHaveCount(2);
  await page.screenshot({
    path: `test-results/home-${test.info().project.name}.png`,
    fullPage: true,
  });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole('button', { name: 'TEST YOUR HANDS' }).click();
  await expect(page.getByRole('button', { name: /next question/i })).toBeDisabled();
  await page.getByRole('radio').first().check();
  await page.getByRole('button', { name: /next question/i }).click();
  await page.getByRole('radio').nth(2).check();
  await page.getByRole('button', { name: /previous/i }).click();
  await expect(page.getByRole('radio').first()).toBeChecked();
  await page.getByRole('radio').last().check();
  await page.getByRole('button', { name: /next question/i }).click();
  await expect(page.getByRole('radio').nth(2)).toBeChecked();
  await page.getByRole('radio').first().check();
  await expect(page.getByRole('status')).toContainText('weather wants you to quit');
  await expect(page.locator('.reaction-meme')).toBeVisible();
  await page.screenshot({
    path: `test-results/quiz-${test.info().project.name}.png`,
    fullPage: true,
  });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  for (let i = 1; i < 30; i++) {
    await page.getByRole('radio').first().check();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    await page
      .getByRole('button', { name: i === 29 ? /deliver the verdict/i : /next question/i })
      .click();
  }
  // q1 was changed from 4 to 0: 116/120 × 1000 = 967.
  await expect(page.getByRole('heading', { name: /967/ })).toBeVisible({ timeout: 10_000 });
  await expect(page.getByRole('heading', { name: 'THE FINAL BOSS' })).toBeVisible();
  await expect(page.getByRole('meter')).toHaveAttribute('aria-valuenow', '967');
  await expect
    .poll(() =>
      page.locator('.result-meme img').evaluate((image: HTMLImageElement) => image.naturalWidth),
    )
    .toBeGreaterThan(0);
  await expect(page.getByText(/keyboard has seen more action/)).toBeVisible();
  await expect(page.locator('.huge-score > [aria-hidden]')).toHaveText('967');
  await page.screenshot({
    path: `test-results/results-${test.info().project.name}.png`,
    fullPage: true,
  });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole('button', { name: /share results/i }).click();
  const dialog = page.getByRole('dialog');
  await expect(
    dialog.getByRole('img', { name: /Hard Hands Calculator certificate/i }),
  ).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  const downloadPromise = page.waitForEvent('download');
  await dialog.getByRole('button', { name: /download png/i }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('hard-hands-967.png');
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  const png = Buffer.concat(chunks);
  expect(png.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  expect(png.readUInt32BE(16)).toBe(1200);
  expect(png.readUInt32BE(20)).toBe(1200);
  await download.saveAs(`test-results/card-${test.info().project.name}.png`);
  await dialog.getByRole('button', { name: /close share dialog/i }).click();
  await page.getByRole('button', { name: /restart quiz/i }).click();
  await page.getByRole('button', { name: 'TEST YOUR HANDS' }).click();
  await expect(page.getByRole('button', { name: /next question/i })).toBeDisabled();
  await expect(page.getByRole('radio', { checked: true })).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('keyboard, reduced motion, narrow screens, and network independence', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: `test-results/landing-${test.info().project.name}.png`,
    fullPage: true,
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.getByRole('button', { name: 'TEST YOUR HANDS' }).click();
  await page.getByRole('radio').first().focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('radio').first()).toBeChecked();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('radio').nth(1)).toBeChecked();
  await page.context().setOffline(true);
  for (let i = 0; i < 30; i++) {
    await page.getByRole('radio').last().check();
    await page
      .getByRole('button', { name: i === 29 ? /deliver the verdict/i : /next question/i })
      .click();
  }
  await expect(page.getByRole('heading', { name: 'BABY HANDS' })).toBeVisible();
  await expect(page.getByRole('meter')).toHaveAttribute('aria-valuenow', '0');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});

test('the maximum score fits a narrow certificate and shares without file support', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/');
  await page.getByRole('button', { name: 'TEST YOUR HANDS' }).click();
  for (let i = 0; i < 30; i++) {
    await page.getByRole('radio').first().check();
    await page
      .getByRole('button', { name: i === 29 ? /deliver the verdict/i : /next question/i })
      .click();
  }
  await expect(page.getByRole('meter')).toHaveAttribute('aria-valuenow', '1000');
  await expect(page.locator('.huge-score > [aria-hidden]')).toHaveText('1000');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.getByRole('button', { name: /share results/i }).click();
  await expect(page.getByRole('dialog').getByRole('img', { name: /certificate/i })).toBeVisible();
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'canShare', { configurable: true, value: () => false }),
  );
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: /share card/i }).click();
  expect((await downloaded).suggestedFilename()).toBe('hard-hands-1000.png');
  await page.getByRole('button', { name: /close share dialog/i }).click();
  await expect(page.getByRole('button', { name: /share results/i })).toBeFocused();
});
