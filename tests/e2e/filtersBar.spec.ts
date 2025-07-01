import { test, expect } from '@playwright/test';
import { ALL_ARTISTS, ALL_GENRES } from '@/constants/labels.constant';
import { TableState } from '@/store/slices/table/tableSlice';
import {
  ARTISTS_LIST,
  FILTERS,
  GENRES_LIST,
  getFilter,
  selectDropdownOption,
  TIMEOUT,
  waitForLoaderToDisappear,
} from './helpers/test-helpers';

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
