import { test, expect } from '@playwright/test';
import { ALL_ARTISTS, ALL_GENRES } from '@/constants/labels.constant';
import {
  FILTERS,
  getFilter,
  getTrackNames,
  selectDropdownOption,
  TIMEOUT,
  waitForLoaderToDisappear,
  setupInitializedPage,
  verifyFilteredColumn,
  checkErrorToast,
  expectFilterText,
  verifyMultipleFiltersReset,
  verifyFiltersPersistAfterReload,
  EMPTY_JSON_RESPONSE,
  SERVER_ERROR_RESPONSE,
} from './helpers/test-helpers';

test.beforeEach(async ({ page }) => {
  await setupInitializedPage({ page });
});

test.describe('Error Handling', () => {
  test('should display error toast and no results when tracks fetch fails', async ({
    page,
  }) => {
    await page.route('**/api/tracks*', (route) =>
      route.fulfill(SERVER_ERROR_RESPONSE)
    );

    await page.reload();
    await waitForLoaderToDisappear(page);

    await checkErrorToast(page, 'Error', 'Server error');

    const tableBody = page.locator('table tbody.track-list');
    await expect(tableBody).toContainText('No results.', TIMEOUT);

    const selectedArtist = 'Post Malone';
    await selectDropdownOption(page, FILTERS.artist, selectedArtist);
    await expectFilterText(page, FILTERS.artist, selectedArtist);
  });
});

test('should actually filter tracks by artist', async ({ page }) => {
  const selectedArtist = 'Justin Bieber';
  await verifyFilteredColumn(page, FILTERS.artist, selectedArtist, 'Artist');
});

test('should actually filter tracks by genre', async ({ page }) => {
  const selectedGenre = 'Rock';
  await verifyFilteredColumn(page, FILTERS.genre, selectedGenre, 'Genres');
});

test('should display initial filter values', async ({ page }) => {
  await expectFilterText(page, FILTERS.artist, ALL_ARTISTS);
  await expectFilterText(page, FILTERS.genre, ALL_GENRES);
});

test('should show artist options in dropdown', async ({ page }) => {
  await getFilter(page, FILTERS.artist).click();
  await expect(page.getByRole('option', { name: ALL_ARTISTS })).toBeVisible(
    TIMEOUT
  );
  await expect(page.getByRole('option', { name: 'Justin Bieber' })).toBeVisible(
    TIMEOUT
  );
  await expect(page.getByRole('option', { name: 'Post Malone' })).toBeVisible(
    TIMEOUT
  );
});

test('should update artist filter selection', async ({ page }) => {
  await selectDropdownOption(page, FILTERS.artist, 'Justin Bieber');
  await expectFilterText(page, FILTERS.artist, 'Justin Bieber');
});

test('should reset artist filter to default', async ({ page }) => {
  await selectDropdownOption(page, FILTERS.artist, 'Post Malone');
  await selectDropdownOption(page, FILTERS.artist, ALL_ARTISTS);
  await expectFilterText(page, FILTERS.artist, ALL_ARTISTS);
});

test('should update genre filter selection', async ({ page }) => {
  await selectDropdownOption(page, FILTERS.genre, 'Rock');
  await expectFilterText(page, FILTERS.genre, 'Rock');
});

test('should persist filter state on page reload', async ({ page }) => {
  await verifyFiltersPersistAfterReload({
    page,
    filters: [
      { filterType: FILTERS.artist, value: 'Post Malone' },
      { filterType: FILTERS.genre, value: 'Pop' },
    ],
    waitForLoaderToDisappear,
    expectFilterText,
  });
});

test('should update URL parameters when filters change', async ({ page }) => {
  await selectDropdownOption(page, FILTERS.artist, 'Lady Gaga');
  await selectDropdownOption(page, FILTERS.genre, 'Jazz');
  await expect(page).toHaveURL(/.*genre=Jazz.*artist=Lady\+Gaga.*/);
});

test('should return to initial state when resetting artist filter', async ({
  page,
}) => {
  await verifyMultipleFiltersReset({
    page,
    actions: [
      {
        filterType: FILTERS.artist,
        selectValue: 'Justin Bieber',
        resetValue: ALL_ARTISTS,
      },
    ],
    getTrackNames,
    waitForLoaderToDisappear,
  });
});

test('should return to initial state when resetting genre filter', async ({
  page,
}) => {
  await verifyMultipleFiltersReset({
    page,
    actions: [
      {
        filterType: FILTERS.genre,
        selectValue: 'Rock',
        resetValue: ALL_GENRES,
      },
    ],
    getTrackNames,
    waitForLoaderToDisappear,
  });
});

test('should return to initial state when resetting both filters', async ({
  page,
}) => {
  await verifyMultipleFiltersReset({
    page,
    actions: [
      {
        filterType: FILTERS.artist,
        selectValue: 'Post Malone',
        resetValue: ALL_ARTISTS,
      },
      {
        filterType: FILTERS.genre,
        selectValue: 'Pop',
        resetValue: ALL_GENRES,
      },
    ],
    getTrackNames,
    waitForLoaderToDisappear,
  });
});

test.describe('FiltersBar with empty genre and track lists', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/genres', async (route) => {
      await route.fulfill(EMPTY_JSON_RESPONSE);
    });

    await page.route('**/api/all-tracks**', async (route) => {
      await route.fulfill(EMPTY_JSON_RESPONSE);
    });

    await page.addInitScript(() => {
      const store = window.__REDUX_STORE__;
      if (store) {
        store.dispatch({ type: 'table/setAllArtists', payload: [] });
      }
    });

    await page.goto('/tracker/tracks');
    await waitForLoaderToDisappear(page);

    await page.waitForSelector(`[data-testid="${FILTERS.artist}"]`, TIMEOUT);
    await page.waitForSelector(`[data-testid="${FILTERS.genre}"]`, TIMEOUT);
  });

  test('shows only ALL_GENRES and ALL_ARTISTS in dropdowns', async ({
    page,
  }) => {
    await getFilter(page, FILTERS.genre).click();
    await expect(page.getByRole('option', { name: ALL_GENRES })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Rock' })).toHaveCount(0);
    await page.keyboard.press('Escape');

    await getFilter(page, FILTERS.artist).click();
    await expect(page.getByRole('option', { name: ALL_ARTISTS })).toBeVisible();
    await expect(
      page.getByRole('option', { name: 'Justin Bieber' })
    ).toHaveCount(0);
  });
});
