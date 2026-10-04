import { expect, test, type Page } from '@playwright/test';

const isPhone = (page: Page) => (page.viewportSize()?.width ?? 1440) < 700;

/** On phones the session timeline is folded behind a "This session" button. */
async function openTimeline(page: Page) {
  if (isPhone(page)) await page.getByRole('button', { name: /This session/ }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto('./');
  await page.evaluate(() => localStorage.clear());
  await page.goto('./');
});

test('home shows the three most recent sample sessions', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Ask the Global Health Network' })).toBeVisible();
  const cards = page.getByRole('link', { name: /^Open session:/ });
  await expect(cards).toHaveCount(3);
  await expect(cards.first()).toContainText('Outline engagement activities');
  await expect(page.getByRole('link', { name: 'View all sessions' })).toBeVisible();
});

test('a search from home starts a session; resources come first, then the answer streams in', async ({ page }) => {
  await page.getByLabel('Your question or search').fill('Outline engagement activities for a malaria vaccine trial in coastal Kenya');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page).toHaveURL(/#\/s\/ses_\w+\/1$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/malaria vaccine trial/);
  await expect(page.getByRole('heading', { name: /Answer by Mesh-AI from 8 TGHN resources/ })).toBeVisible();
  await expect(page.locator('#res-1')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Helpful answer' })).toBeVisible({ timeout: 10_000 });
  await expect(page.locator('#answer-text')).toContainText('formative research');
});

test('a follow-up is added to the session and uses its context', async ({ page }) => {
  await page.getByRole('button', { name: /Outline engagement activities/ }).click();
  await page.getByLabel('Ask a follow-up question in this session').fill('How could we involve local schools?');
  await page.getByRole('button', { name: 'Ask follow-up' }).click();
  await expect(page).toHaveURL(/\/2$/);
  await page.getByRole('button', { name: 'Used earlier queries' }).click();
  await expect(page.getByText('Your follow-up, read together with query 1.')).toBeVisible();
  await openTimeline(page);
  await expect(page.getByRole('navigation', { name: 'This session' }).getByRole('link')).toHaveCount(2);
});

test('the timeline shows an earlier query as it was, with a way back to the latest', async ({ page }) => {
  await page.getByRole('link', { name: /^Open session: Outline engagement/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Write this up as a report I can share with my team');
  await openTimeline(page);
  await page.getByRole('navigation', { name: 'This session' }).getByRole('link', { name: /Outline engagement activities/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Outline engagement activities/);
  await expect(page.getByRole('button', { name: 'Short summary' })).toHaveAttribute('aria-pressed', 'true');
  await openTimeline(page);
  await page.getByRole('link', { name: 'Back to latest' }).click();
  await expect(page).toHaveURL(/\/3$/);
});

test('the question header shows what was searched and lets you edit the question', async ({ page }) => {
  await page.getByRole('link', { name: /^Open session: Outline engagement/ }).click();
  const used = page.getByRole('button', { name: 'Used earlier queries' });
  await expect(used).toHaveAttribute('aria-expanded', 'false');
  await used.click();
  await expect(used).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText('Mesh-AI searched for')).toBeVisible();
  await expect(page.getByText('Your follow-up, read together with queries 1 and 2.')).toBeVisible();
  await page.getByRole('link', { name: 'Edit question' }).click();
  await expect(page.getByLabel('Your question or search')).toHaveValue('Write this up as a report I can share with my team');
});

test('the session timeline stays in the margin at laptop widths', async ({ page }) => {
  test.skip(isPhone(page), 'phones use the folded bar');
  await page.setViewportSize({ width: 960, height: 720 });
  await page.getByRole('link', { name: /^Open session: Outline engagement/ }).click();
  const links = page.getByRole('navigation', { name: 'This session' }).getByRole('link');
  await expect(links).toHaveCount(3);
  for (const link of await links.all()) await expect(link).toBeVisible();
  await expect(page.getByRole('button', { name: /This session/ })).toBeHidden();
});

test('on phones the folded timeline says which query is on screen', async ({ page }) => {
  test.skip(!isPhone(page), 'only phones fold the timeline');
  await page.getByRole('link', { name: /^Open session: Outline engagement/ }).click();
  const bar = page.getByRole('button', { name: /This session/ });
  await expect(bar).toContainText('Query 3 of 3');
  await bar.click();
  await expect(page.getByRole('navigation', { name: 'This session' }).getByRole('link', { name: /Outline engagement activities/ })).toBeVisible();
});

test('changing filters re-runs the question as a new query at the end of the session', async ({ page }) => {
  await page.getByRole('link', { name: /^Open session: Outline engagement/ }).click();
  await page.getByRole('button', { name: /^Filters/ }).first().click();
  const dialog = page.getByRole('dialog', { name: 'Filters' });
  await dialog.getByRole('button', { name: 'Country' }).click();
  await dialog.getByText('Kenya', { exact: true }).click();
  await dialog.getByRole('button', { name: 'Apply and search' }).click();
  await expect(page).toHaveURL(/\/4$/);
  await expect(page.getByRole('button', { name: 'Remove filter Country: Kenya' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Filters, 2 applied' })).toBeVisible();
});

test('switching format re-formats the query on screen without adding a query', async ({ page }) => {
  await page.getByRole('link', { name: /^Open session: Outline engagement/ }).click();
  await page.getByRole('button', { name: 'Paragraph' }).click();
  await expect(page.getByText(/You chose a paragraph/)).toBeVisible();
  await expect(page).toHaveURL(/\/3$/);
});

test('all sessions: groups, search, the query list, and clearing', async ({ page }) => {
  await page.getByRole('link', { name: 'View all sessions' }).click();
  await expect(page.getByRole('heading', { name: 'All sessions' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Today' })).toBeVisible();
  await page.getByLabel('Search your sessions').fill('school');
  await expect(page.getByText(/2 of 4 sessions match/)).toBeVisible();
  await page.getByLabel('Search your sessions').fill('');
  await page.getByRole('button', { name: '3 queries' }).click();
  await expect(page.getByRole('list', { name: 'Queries in this session' }).getByRole('link')).toHaveCount(3);
  await page.getByRole('button', { name: 'Clear all sessions' }).click();
  await page.getByRole('button', { name: 'Clear all sessions' }).click();
  await expect(page.getByText('No sessions yet')).toBeVisible();
  await page.reload();
  await expect(page.getByText('No sessions yet')).toBeVisible();
});

test('sessions are kept in the browser across reloads', async ({ page }) => {
  await page.getByRole('button', { name: /List articles on engagement/ }).click();
  await expect(page).toHaveURL(/\/1$/);
  const url = page.url();
  await page.reload();
  await expect(page).toHaveURL(url);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('List articles on engagement with clinical trials');
});
