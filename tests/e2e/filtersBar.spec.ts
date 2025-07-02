import { test, expect } from '@playwright/test';
import { ALL_ARTISTS, ALL_GENRES } from '@/constants/labels.constant';
import { TableState } from '@/store/slices/table/tableSlice';
import {
  ARTISTS_LIST,
  FILTERS,
  GENRES_LIST,
  getCellText,
  getColumnIndex,
  getFilter,
  getTrackNames,
  getTrackRows,
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
      window.__QUERY_CLIENT__['genres'] = genres;
    },
    [ARTISTS_LIST, GENRES_LIST]
  );

  await page.goto('/tracker/');
  await page.getByTestId('go-to-tracks').click();
  await waitForLoaderToDisappear(page);
});

test.describe('Error Handling', () => {
  test('should display error toast and no results when tracks fetch fails', async ({
    page,
  }) => {
    await page.route('**/api/tracks*', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Server Error' }),
      })
    );

    await page.reload();
    await waitForLoaderToDisappear(page);

    const toast = page.getByTestId('toast-destructive');
    await expect(toast).toBeVisible(TIMEOUT);

    const toastTitle = toast.locator('.text-sm.font-semibold');
    await expect(toastTitle).toContainText('Error', TIMEOUT);

    const toastDescription = toast.locator('.text-sm.opacity-90');
    await expect(toastDescription).toContainText('Server error', TIMEOUT);

    const tableBody = page.locator('table tbody.track-list');
    await expect(tableBody).toContainText('No results.', TIMEOUT);

    const selectedArtist = 'Post Malone';
    await selectDropdownOption(page, FILTERS.artist, selectedArtist);
    await expect(getFilter(page, FILTERS.artist)).toContainText(
      selectedArtist,
      TIMEOUT
    );
  });
});

test('should actually filter tracks by artist', async ({ page }) => {
  const selectedArtist = 'Justin Bieber';

  await selectDropdownOption(page, FILTERS.artist, selectedArtist);
  await waitForLoaderToDisappear(page);

  const artistColumnIndex = await getColumnIndex(page, 'Artist');

  const rows = getTrackRows(page);
  const count = await rows.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const row = rows.nth(i);
    const text = await getCellText(row, artistColumnIndex);
    expect(text).toContain(selectedArtist);
  }
});

test('should actually filter tracks by genre', async ({ page }) => {
  const selectedGenre = 'Rock';

  await selectDropdownOption(page, FILTERS.genre, selectedGenre);
  await waitForLoaderToDisappear(page);

  const genreColumnIndex = await getColumnIndex(page, 'Genres');

  const rows = getTrackRows(page);
  const count = await rows.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const row = rows.nth(i);
    const text = await getCellText(row, genreColumnIndex);
    expect(text).toContain(selectedGenre);
  }
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

  test.describe('Filter Reset', () => {
    test('should return to initial state when resetting artist filter', async ({
      page,
    }) => {
      const initialTrackNames = await getTrackNames(page);

      const selectedArtist = 'Justin Bieber';
      await selectDropdownOption(page, FILTERS.artist, selectedArtist);
      await waitForLoaderToDisappear(page);

      await selectDropdownOption(page, FILTERS.artist, ALL_ARTISTS);
      await waitForLoaderToDisappear(page);

      const resetTrackNames = (await getTrackNames(page)).filter(
        (name) => name.trim() !== ''
      );
      const filteredInitialTrackNames = initialTrackNames.filter(
        (name) => name.trim() !== ''
      );
      expect(resetTrackNames).toEqual(filteredInitialTrackNames);
    });

    test('should return to initial state when resetting genre filter', async ({
      page,
    }) => {
      const initialTrackNames = await getTrackNames(page);

      const selectedGenre = 'Rock';
      await selectDropdownOption(page, FILTERS.genre, selectedGenre);
      await waitForLoaderToDisappear(page);

      await selectDropdownOption(page, FILTERS.genre, ALL_GENRES);
      await waitForLoaderToDisappear(page);

      const resetTrackNames = (await getTrackNames(page)).filter(
        (name) => name.trim() !== ''
      );
      const filteredInitialTrackNames = initialTrackNames.filter(
        (name) => name.trim() !== ''
      );
      expect(resetTrackNames).toEqual(filteredInitialTrackNames);
    });

    test('should return to initial state when resetting both filters', async ({
      page,
    }) => {
      const initialTrackNames = await getTrackNames(page);

      await selectDropdownOption(page, FILTERS.artist, 'Post Malone');
      await selectDropdownOption(page, FILTERS.genre, 'Pop');
      await waitForLoaderToDisappear(page);

      await selectDropdownOption(page, FILTERS.artist, ALL_ARTISTS);
      await selectDropdownOption(page, FILTERS.genre, ALL_GENRES);
      await waitForLoaderToDisappear(page);

      const resetTrackNames = await getTrackNames(page);
      expect(resetTrackNames).toEqual(initialTrackNames);
    });
  });
});
