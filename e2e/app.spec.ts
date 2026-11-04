import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { QUESTION_COUNT } from '../src/data/questions';

const nextName = (i: number) => (i === QUESTION_COUNT - 1 ? 'URTEIL ABHOLEN' : 'WEITER');

test('deutsche Oberfläche, stabile Mischung, Bearbeitung, PNG und Neustart', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(page).toHaveTitle(/Bruder, sooo weiche Hände/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Bruder, sooo weiche Hände?');
  const photos = await page
    .locator('.hero-soft-sticker img, .meme-report img')
    .evaluateAll((images) => images.map((image) => (image as HTMLImageElement).naturalWidth));
  expect(photos).toHaveLength(3);
  expect(photos.every((width) => width > 0)).toBe(true);
  await page.screenshot({
    path: `test-results/start-${test.info().project.name}.png`,
    fullPage: true,
  });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole('button', { name: 'HÄNDE PRÜFEN' }).click();
  await expect(page.getByRole('button', { name: 'WEITER', exact: true })).toBeDisabled();
  const firstOrder = await page
    .getByRole('radio')
    .evaluateAll((inputs) => inputs.map((input) => (input as HTMLInputElement).value));
  await page.locator('input[value="a0"]').check();
  await page.getByRole('button', { name: 'WEITER', exact: true }).click();
  const secondOrder = await page
    .getByRole('radio')
    .evaluateAll((inputs) => inputs.map((input) => (input as HTMLInputElement).value));
  await page.locator('input[value="a2"]').check();
  await page.getByRole('button', { name: 'ZURÜCK', exact: true }).click();
  expect(
    await page
      .getByRole('radio')
      .evaluateAll((inputs) => inputs.map((input) => (input as HTMLInputElement).value)),
  ).toEqual(firstOrder);
  await expect(page.locator('input[value="a0"]')).toBeChecked();
  await page.locator('input[value="a4"]').check();
  await page.getByRole('button', { name: 'WEITER', exact: true }).click();
  expect(
    await page
      .getByRole('radio')
      .evaluateAll((inputs) => inputs.map((input) => (input as HTMLInputElement).value)),
  ).toEqual(secondOrder);
  await expect(page.locator('input[value="a2"]')).toBeChecked();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  for (let i = 1; i < QUESTION_COUNT; i++) {
    await page.locator('input[value="a0"]').check();
    await expect(page.locator('.reaction-soft')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.getByRole('button', { name: nextName(i), exact: true }).click();
  }
  // Only the first question was changed to 0: 76 / 80 × 1000 = 950.
  await expect(page.getByRole('meter', { name: 'Härtegrad', exact: true })).toHaveAttribute(
    'aria-valuenow',
    '950',
  );
  await expect(page.locator('.huge-score > [aria-hidden]')).toHaveText('950');
  await expect(page.getByRole('heading', { name: 'DER ENDBOSS', exact: true })).toBeVisible();
  await expect(page.locator('.result-meme-hard img')).toBeVisible();
  await expect(page.getByText(/Deine Tastatur hat mehr gearbeitet/)).toBeVisible();
  await page.screenshot({
    path: `test-results/ergebnis-hart-${test.info().project.name}.png`,
    fullPage: true,
  });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole('button', { name: 'ERGEBNIS TEILEN', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('img', { name: /Zertifikat mit 950/ })).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  const downloaded = page.waitForEvent('download');
  await dialog.getByRole('button', { name: 'PNG SPEICHERN' }).click();
  const download = await downloaded;
  expect(download.suggestedFilename()).toBe('hard-hands-950.png');
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  const png = Buffer.concat(chunks);
  expect(png.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  expect(png.readUInt32BE(16)).toBe(1200);
  expect(png.readUInt32BE(20)).toBe(1200);
  await download.saveAs(`test-results/karte-hart-${test.info().project.name}.png`);
  await dialog.getByRole('button', { name: 'Teilen-Fenster schließen' }).click();
  await expect(page.getByRole('button', { name: 'ERGEBNIS TEILEN', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'NOCH MAL ANTRETEN' }).click();
  await page.getByRole('button', { name: 'HÄNDE PRÜFEN' }).click();
  await expect(page.getByRole('radio', { checked: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'WEITER', exact: true })).toBeDisabled();
  expect(errors).toEqual([]);
});

test('weicher Lauf: Tastatur, 320px, Offline-Nutzung, Foto-Reaktionen und reduzierte Bewegung', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.screenshot({
    path: `test-results/start-schmal-${test.info().project.name}.png`,
    fullPage: true,
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'HÄNDE PRÜFEN' }).click();
  await page.getByRole('radio').first().focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('radio').first()).toBeChecked();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('radio').nth(1)).toBeChecked();
  await page.context().setOffline(true);
  let softReactions = 0;
  for (let i = 0; i < QUESTION_COUNT; i++) {
    await page.locator('input[value="a4"]').check();
    if (await page.locator('.reaction-soft').count()) {
      softReactions++;
      await expect
        .poll(() =>
          page.locator('.reaction-meme').evaluate((image: HTMLImageElement) => image.naturalWidth),
        )
        .toBeGreaterThan(0);
      expect(await page.locator('.reaction-meme').getAttribute('src')).toContain(
        '/images/soft-hands/',
      );
      if (softReactions === 1)
        await page.screenshot({
          path: `test-results/weiche-reaktion-${test.info().project.name}.png`,
          fullPage: true,
        });
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.getByRole('button', { name: nextName(i), exact: true }).click();
  }
  expect(softReactions).toBeGreaterThan(0);
  expect(softReactions).toBeLessThanOrEqual(7);
  await expect(page.getByRole('heading', { name: 'BABYHÄNDE', exact: true })).toBeVisible();
  await expect(page.getByRole('meter', { name: 'Härtegrad', exact: true })).toHaveAttribute(
    'aria-valuenow',
    '0',
  );
  await expect(page.locator('.result-meme-prominent img')).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator('.result-meme-prominent img')
        .evaluate((image: HTMLImageElement) => image.naturalWidth),
    )
    .toBeGreaterThan(0);
  expect(await page.locator('.result-meme-prominent img').getAttribute('src')).toContain(
    '/images/soft-hands/',
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({
    path: `test-results/ergebnis-weich-${test.info().project.name}.png`,
    fullPage: true,
  });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole('button', { name: 'ERGEBNIS TEILEN', exact: true }).click();
  await expect(
    page.getByRole('dialog').getByRole('img', { name: /Zertifikat mit 0/ }),
  ).toBeVisible();
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'PNG SPEICHERN' }).click();
  await (await downloaded).saveAs(`test-results/karte-weich-${test.info().project.name}.png`);
});

test('1000 Punkte bleiben erreichbar und die Teilen-Funktion bietet einen Download-Fallback', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'HÄNDE PRÜFEN' }).click();
  for (let i = 0; i < QUESTION_COUNT; i++) {
    await page.locator('input[value="a0"]').check();
    await page.getByRole('button', { name: nextName(i), exact: true }).click();
  }
  await expect(page.getByRole('meter', { name: 'Härtegrad', exact: true })).toHaveAttribute(
    'aria-valuenow',
    '1000',
  );
  await expect(page.locator('.huge-score > [aria-hidden]')).toHaveText('1000');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'ERGEBNIS TEILEN', exact: true }).click();
  await expect(page.getByRole('dialog').getByRole('img', { name: /Zertifikat/ })).toBeVisible();
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'canShare', { configurable: true, value: () => false }),
  );
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'KARTE TEILEN', exact: true }).click();
  expect((await downloaded).suggestedFilename()).toBe('hard-hands-1000.png');
  await page.getByRole('button', { name: 'Teilen-Fenster schließen' }).click();
  await expect(page.getByRole('button', { name: 'ERGEBNIS TEILEN', exact: true })).toBeFocused();
});

test('PNG bleibt bei fehlendem Hintergrundbild exportierbar', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/images/soft-hands/**', (route) => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: 'HÄNDE PRÜFEN' }).click();
  for (let i = 0; i < QUESTION_COUNT; i++) {
    await page.locator('input[value="a4"]').check();
    await page.getByRole('button', { name: nextName(i), exact: true }).click();
  }
  await expect(page.getByRole('heading', { name: 'BABYHÄNDE', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'ERGEBNIS TEILEN', exact: true }).click();
  await expect(
    page.getByRole('dialog').getByRole('img', { name: /Zertifikat mit 0/ }),
  ).toBeVisible();
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'PNG SPEICHERN' }).click();
  expect((await downloaded).suggestedFilename()).toBe('hard-hands-0.png');
});
