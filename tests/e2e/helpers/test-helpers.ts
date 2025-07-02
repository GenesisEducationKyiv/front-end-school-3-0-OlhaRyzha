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

export async function setupInitializedPage({ page }: { page: Page }) {
  await page.addInitScript(
    ([artists, genres]) => {
      window.__PRELOADED_STATE__ = {
        ...(window.__PRELOADED_STATE__ || {}),
        table: {
          ...(window.__PRELOADED_STATE__?.table || {}),
          allArtists: artists,
        },
      };
      window.__QUERY_CLIENT__ = window.__QUERY_CLIENT__ || {};
      window.__QUERY_CLIENT__['genres'] = genres;
    },
    [ARTISTS_LIST, GENRES_LIST]
  );

  await page.goto('/tracker/');
  await page.getByTestId('go-to-tracks').click();
  await waitForLoaderToDisappear(page);
}

export async function checkErrorToast(
  page: Page,
  expectedTitle: string,
  expectedDescription: string
) {
  const toast = page.getByTestId('toast-destructive');
  await expect(toast).toBeVisible(TIMEOUT);

  const toastTitle = toast.locator('.text-sm.font-semibold');
  await expect(toastTitle).toContainText(expectedTitle, TIMEOUT);

  const toastDescription = toast.locator('.text-sm.opacity-90');
  await expect(toastDescription).toContainText(expectedDescription, TIMEOUT);
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
