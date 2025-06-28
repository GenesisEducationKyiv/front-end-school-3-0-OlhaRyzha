import { test, expect, Page } from '@playwright/test';
import { ALL_ARTISTS, ALL_GENRES } from '@/constants/labels.constant';
import { TableState } from '@/store/slices/table/tableSlice';

declare global {
  interface Window {
    __PRELOADED_STATE__?: {
      table?: Partial<TableState>;
    };
    __QUERY_CLIENT__?: {
      [key: string]: unknown;
    };
  }
}

const ARTISTS_LIST = ['Lady Gaga', 'Justin Bieber', 'Post Malone', 'Rihanna'];
const GENRES_LIST = ['Rock', 'Jazz', 'Pop', 'Hip Hop'];
const TIMEOUT = { timeout: 15000 };
const FILTERS = {
  artist: 'filter-artist',
  genre: 'filter-genre',
};

test.use({
  contextOptions: {},
});

test.beforeEach(async ({ page }) => {
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
      window.__QUERY_CLIENT__['GENRES_QUERY_KEY'] = genres;
    },
    [ARTISTS_LIST, GENRES_LIST]
  );

  await page.goto('/tracker/');
  await page.getByTestId('go-to-tracks').click();
  await waitForLoaderToDisappear(page);
});

async function waitForLoaderToDisappear(page: Page) {
  await page.waitForFunction(() => {
    const loaders = Array.from(document.querySelectorAll('.loader-overlay'));
    if (!loaders.length) return true;
  }, TIMEOUT);
}

async function selectDropdownOption(
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

function getFilter(page: Page, filterTestId: string) {
  return page.getByTestId(filterTestId);
}

test.describe('FiltersBar Component', () => {
  test('should display initial filter values', async ({ page }) => {
    await expect(getFilter(page, FILTERS.artist)).toContainText(
      ALL_ARTISTS,
      TIMEOUT
    );
    await expect(getFilter(page, FILTERS.genre)).toContainText(
      ALL_GENRES,
      TIMEOUT
    );
  });

  test('should show artist options in dropdown', async ({ page }) => {
    await getFilter(page, FILTERS.artist).click();
    await expect(page.getByRole('option', { name: ALL_ARTISTS })).toBeVisible(
      TIMEOUT
    );
    await expect(
      page.getByRole('option', { name: 'Justin Bieber' })
    ).toBeVisible(TIMEOUT);
    await expect(page.getByRole('option', { name: 'Post Malone' })).toBeVisible(
      TIMEOUT
    );
  });

  test('should update artist filter selection', async ({ page }) => {
    await selectDropdownOption(page, FILTERS.artist, 'Justin Bieber');
    await expect(getFilter(page, FILTERS.artist)).toContainText(
      'Justin Bieber',
      TIMEOUT
    );
  });

  test('should reset artist filter to default', async ({ page }) => {
    await selectDropdownOption(page, FILTERS.artist, 'Post Malone');
    await selectDropdownOption(page, FILTERS.artist, ALL_ARTISTS);
    await expect(getFilter(page, FILTERS.artist)).toContainText(
      ALL_ARTISTS,
      TIMEOUT
    );
  });

  test('should update genre filter selection', async ({ page }) => {
    await selectDropdownOption(page, FILTERS.genre, 'Rock');
    await expect(getFilter(page, FILTERS.genre)).toContainText('Rock', TIMEOUT);
  });

  test('should persist filter state on page reload', async ({ page }) => {
    await selectDropdownOption(page, FILTERS.artist, 'Post Malone');
    await selectDropdownOption(page, FILTERS.genre, 'Pop');
    await page.reload();
    await waitForLoaderToDisappear(page);
    await expect(getFilter(page, FILTERS.artist)).toContainText(
      'Post Malone',
      TIMEOUT
    );
    await expect(getFilter(page, FILTERS.genre)).toContainText('Pop', TIMEOUT);
  });

  test('should update URL parameters when filters change', async ({ page }) => {
    await selectDropdownOption(page, FILTERS.artist, 'Lady Gaga');
    await selectDropdownOption(page, FILTERS.genre, 'Jazz');
    await expect(page).toHaveURL(/.*genre=Jazz.*artist=Lady\+Gaga.*/);
  });
});
