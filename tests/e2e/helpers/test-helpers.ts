import { expect, Locator, Page } from '@playwright/test';
import { GENRES_QUERY_KEY } from '@/constants/queryKeys.constants';
import {
  GetTrackNames,
  WaitForLoaderToDisappear,
  FilterAction,
  FilterSelection,
} from './test-helpers.types';

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

export const EMPTY_JSON_RESPONSE = {
  status: 200,
  contentType: 'application/json',
  body: JSON.stringify([]),
};

export const SERVER_ERROR_RESPONSE = {
  status: 500,
  contentType: 'application/json',
  body: JSON.stringify({ message: 'Server Error' }),
};

export async function waitForLoaderToDisappear(page: Page) {
  await page.waitForFunction(() => {
    const loaders = Array.from(document.querySelectorAll('.loader-overlay'));
    return loaders.length === 0;
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

export async function setupInitializedPage({
  page,
  artists = ARTISTS_LIST,
  genres = GENRES_LIST,
}: {
  page: Page;
  artists?: string[];
  genres?: string[];
}) {
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
      window.__QUERY_CLIENT__[GENRES_QUERY_KEY[0]] = genres;
    },
    [artists, genres]
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

  const toastTitle = toast.getByTestId('toast-title');
  await expect(toastTitle).toContainText(expectedTitle, TIMEOUT);

  const toastDescription = toast.getByTestId('toast-description');
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
  const names: string[] = [];
  for (let i = 0; i < count; i++) {
    const name = await rows.nth(i).locator('td').first().innerText();
    names.push(name.trim());
  }
  return names;
}

export async function expectFilterText(
  page: Page,
  filterType: string,
  value: string,
  timeout: { timeout: number } = TIMEOUT
): Promise<void> {
  await expect(getFilter(page, filterType)).toContainText(value, timeout);
}

export async function verifyFilteredColumn(
  page: Page,
  filterType: string,
  filterValue: string,
  columnName: string
) {
  await selectDropdownOption(page, filterType, filterValue);
  await waitForLoaderToDisappear(page);

  const columnIndex = await getColumnIndex(page, columnName);
  const rows = getTrackRows(page);
  const count = await rows.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const row = rows.nth(i);
    const text = await getCellText(row, columnIndex);
    expect(text).toContain(filterValue);
  }
}

export async function verifyMultipleFiltersReset({
  page,
  actions,
  getTrackNames,
  waitForLoaderToDisappear,
}: {
  page: Page;
  actions: FilterAction[];
  getTrackNames: GetTrackNames;
  waitForLoaderToDisappear: WaitForLoaderToDisappear;
}) {
  const initialTrackNames = (await getTrackNames(page)).filter(Boolean);

  for (const { filterType, selectValue } of actions) {
    await selectDropdownOption(page, filterType, selectValue);
  }
  await waitForLoaderToDisappear(page);

  for (const { filterType, resetValue } of actions) {
    await selectDropdownOption(page, filterType, resetValue);
  }
  await waitForLoaderToDisappear(page);

  const resetTrackNames = (await getTrackNames(page)).filter(Boolean);
  expect(resetTrackNames).toEqual(initialTrackNames);
}

export async function verifyFiltersPersistAfterReload({
  page,
  filters,
  waitForLoaderToDisappear,
  expectFilterText,
}: {
  page: Page;
  filters: FilterSelection[];
  waitForLoaderToDisappear: WaitForLoaderToDisappear;
  expectFilterText: (
    page: Page,
    filterType: string,
    value: string
  ) => Promise<void>;
}) {
  for (const { filterType, value } of filters) {
    await selectDropdownOption(page, filterType, value);
  }

  await page.reload();
  await waitForLoaderToDisappear(page);

  for (const { filterType, value } of filters) {
    await expectFilterText(page, filterType, value);
  }
}
