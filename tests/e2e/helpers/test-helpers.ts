import { expect, Page } from '@playwright/test';

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
