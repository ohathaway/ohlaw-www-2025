import { test, expect } from '@playwright/test'

const redirects = [
  {
    slug: 'll-plan-education',
    linkText: 'Schedule for Estate Planning',
    heading: 'Book Your Life & Legacy Education Session'
  },
  {
    slug: 'new-nonprofit-client',
    linkText: 'Schedule for Nonprofits',
    heading: 'Book a Free Nonprofit Consultation'
  },
  {
    slug: 'new-business-client',
    linkText: 'Schedule for Small Business',
    heading: 'Book a Free Business Consultation'
  },
  {
    slug: 'new-bankruptcy-client',
    linkText: 'Schedule for Bankruptcy',
    heading: 'Book a Free Bankruptcy Consultation'
  }
]

redirects.forEach(link => {
  test(`scheduling link redirects correctly to CRM page for ${link.slug}`, async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('link', { name: link.linkText }).click()
    await expect(
      page.getByRole('heading', { name: link.heading })
    ).toBeVisible()
  })
})