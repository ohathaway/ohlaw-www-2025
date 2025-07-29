import { test, expect } from '@playwright/test'

// Home Page
test('homepage loads with correct title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Law Offices of Owen Hathaway/)
})


// Service Pages
test('can navigate to estate planning page', async ({ page }) => {
  // load the homepage
  await page.goto('/');

  await page.getByRole('link', { name: 'Estate Planning<br />That Works' }).click()
  await expect(page.getByRole('heading', { name: 'Estate Planning That Works' })).toBeVisible()
})

test('can navigate to bankruptcy page', async ({ page }) => {
  // load the homepage
  await page.goto('/');

  await page.getByRole('link', { name: 'Heart-Centered Bankruptcy' }).click()
  await expect(page.getByRole('heading', { name: 'Bankruptcy Relief That Gives You a Fresh Start' })).toBeVisible()
})

test('can navigate to nonprofit page', async ({ page }) => {
  // load the homepage
  await page.goto('/');

  await page.getByRole('link', { name: 'Sustainable<br />Nonprofits' }).click()
  await expect(page.getByRole('heading', { name: 'Nonprofit Services That Build Sustainability' })).toBeVisible()
  
})

test('can navigate to small business page', async ({ page }) => {
  // load the homepage
  await page.goto('/');

  await page.getByRole('link', { name: 'Small Business<br />Foundations' }).click()
  await expect(page.getByRole('heading', { name: 'Small Business Legal Services That Make Sense' })).toBeVisible()
  
})

// Contact Page
test('can navigate to contact page', async ({ page }) => {
  // load the homepage
  await page.goto('/');

  await page.getByRole('link', { name: 'contact' }).click()
  await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible()
})

// About Page
test('can navigate to about page', async ({ page }) => {
  // load the homepage
  await page.goto('/');

  // Use more specific selector to target the actual About Us navigation link
  await page.getByRole('link', { name: 'About Us' }).click()
  await expect(page.getByRole('heading', { name: 'About Us: A Family Serving Families' })).toBeVisible()
})

// Make A Payment
test('can navigate to payment page', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('link', { name: 'Make a Payment'}).click()
  await page.getByRole('button', { name: 'Continue to Payment Form'}).click()
  await page.waitForLoadState('domcontentloaded')
  // Use regex to match the full title including subtitle
  await expect(page).toHaveTitle(/Make a Payment/)
})