import { test, expect } from '@playwright/test'

const hasArticles = async (page) => {
  try {
    // Wait for the ClientOnly content to load and articles to appear
    await page.waitForSelector('article', { timeout: 10000 })

    // Wait a bit more for all articles to render
    await page.waitForTimeout(1000)

    // Verify articles actually appear, not just that page loads
    const articleCount = await page.locator('article').count()
    return articleCount > 0
  }
  catch {
    // If no articles found within timeout, return false
    return false
  }
}

const testSearch = async (page, searchTerm, expectResults) => {
  // Navigate directly to search page with query parameter - reliable across browsers
  await page.goto(`/blog/search?search=${encodeURIComponent(searchTerm)}`)

  // Wait for the search page to load completely
  await page.waitForLoadState('domcontentloaded')

  // Check if articles are present on the search results page
  const searchReturnsArticles = await hasArticles(page)

  if (expectResults) {
    expect(searchReturnsArticles).toBeTruthy()
  }
  else {
    expect(searchReturnsArticles).toBeFalsy()
  }
}

// High-value tests
test('blog listing loads articles from Strapi', async ({ page }) => {
  await page.goto('/blog')

  const pageHasArticles = await hasArticles(page)
  expect(pageHasArticles).toBeTruthy()
})

test('individual blog article loads content', async ({ page }) => {
  await page.goto('/blog')

  // Wait for articles to load and click the first one
  await page.waitForSelector('article > a', { timeout: 10000 })
  await page.locator('article > a').first().click()

  // Wait for navigation and article content to load
  await page.waitForLoadState('networkidle')

  // Look for the main article content specifically (the post-display article)
  const mainArticle = page.locator('article.post-display')

  // Wait for the main article to be present
  await mainArticle.waitFor({ timeout: 10000 })

  // Verify article content renders
  const articleText = await mainArticle.textContent()
  expect(articleText?.length).toBeGreaterThan(100) // At least 100 chars of content
})

test('search returns results - valid search term', async ({ page }) => {
  await testSearch(page, 'business', true)
})

test('search returns no results - invalid search term', async ({ page }) => {
  await testSearch(page, 'xyznonexistentterm123', false)
})
