import { expect, Locator, Page } from '@playwright/test';

export const TIMEOUT = { timeout: 5000 };
export const ARTISTS_LIST = [
  'Lady Gaga',
  'Justin Bieber',
  'Post Malone',
  'Rihanna',
];
export const GENRES_LIST = ['Rock', 'Jazz', 'Pop', 'Hip Hop'];

export const FILTERS = {
  artist: 'filter-artist',
  genre: 'filter-genre',
};

export async function waitForLoaderToDisappear(page: Page) {
  await page.waitForFunction(() => {
    const loaders = Array.from(document.querySelectorAll('.loader-overlay'));
    if (!loaders.length) return true;
  }, TIMEOUT);
}

export async function selectDropdownOption(
  page: Page,
  filterTestId: string,
  optionName: string
) {
  await page.getByTestId(filterTestId).click();
  await expect(page.getByRole('option', { name: optionName })).toBeVisible(
    TIMEOUT
  );
  await page.getByRole('option', { name: optionName }).click();
}

export function getFilter(page: Page, filterTestId: string) {
  return page.getByTestId(filterTestId);
}

export function getTrackRows(page: Page): Locator {
  return page.locator('table tbody tr');
}

export async function getCellText(
  row: Locator,
  cellIndex: number
): Promise<string> {
  return row.locator('td').nth(cellIndex).innerText();
}

export async function getColumnIndex(
  page: Page,
  headerText: string
): Promise<number> {
  const headers = page.locator('table thead th');
  const count = await headers.count();
  for (let i = 0; i < count; i++) {
    const text = await headers.nth(i).innerText();
    if (text.trim().toLowerCase().includes(headerText.toLowerCase())) {
      return i;
    }
  }
  throw new Error(`Header with text "${headerText}" not found`);
}
// Add to test-helpers.ts
export async function getTrackNames(page: Page): Promise<string[]> {
  const rows = getTrackRows(page);
  const count = await rows.count();
  const names = [];

  for (let i = 0; i < count; i++) {
    const name = await rows.nth(i).locator('td').first().innerText();
    names.push(name.trim());
  }

  return names;
}
// Add this function to get all dropdown options
export async function getDropdownOptions(page: Page): Promise<string[]> {
  return page.$$eval('.select-content .select-item', (items) =>
    items.map((item) => item.textContent?.trim() || '')
  );
}
