<template>
  <!-- <HomeHero /> -->
  <HomeHeroLegacy />
  <HomeWelcome />
  <HomeLinesOfBusiness />
  <HomePFL />
</template>

<script setup>
const services = [
  {
    id: 'estate-planning',
    title: 'Estate Planning',
    image: '/img/estatenotebook_1024.webp',
    imageAlt: 'Estate planning notebook with pen and documents',
    link: '/services/estate-planning',
    shortPreview: `We help you express your wishes for your estate and legacy.`,
    description: `We help you express your wishes for what happens to you and your estate when you no longer can express them. Our estate planning services ensure your life's accomplishments are properly passed on to the people and causes you care about.`,
  },
  {
    id: 'small-business',
    title: 'Small Business',
    image: '/img/business1_1024.webp',
    imageAlt: 'Small business owner working on legal documents',
    link: '/services/small-business',
    shortPreview: `Legal foundations for your business growth and success.`,
    description: `As small business owners ourselves, we understand the challenges you face. From entity selection to contracts and liability management, we help you build a solid legal foundation so you can focus on growing your business.`,
  },
  {
    id: 'nonprofits',
    title: 'Nonprofits',
    image: '/img/dotorgtablet_1024.webp',
    imageAlt: 'Nonprofit organization documents on tablet',
    link: '/services/nonprofits',
    shortPreview: `Sustainable structures for mission-driven organizations.`,
    description: `We help nonprofits set up for long-term sustainability with the right structure and compliance. Our experience with both small businesses and nonprofits gives us unique insight into creating organizations that balance mission with operational stability.`,
  },
  {
    id: 'bankruptcy',
    title: 'Bankruptcy',
    image: '/img/helpinghand_1024.webp',
    imageAlt: 'Helping hand extended for financial relief',
    link: '/services/bankruptcy',
    shortPreview: `Clear your financial path forward with our bankruptcy services.`,
    description: `When financial obstacles are blocking your view of what's important, our bankruptcy program can help. We believe everyone deserves the opportunity to pursue their dreams regardless of past financial setbacks.`,
  },
]

// Use your SEO composable to set page meta with explicit image
const pageMeta = {
  title: 'The Law Offices of Owen Hathaway | Colorado Heart-Centered Legal Services',
  description: 'Family-owned law firm in Fort Collins, Colorado helping families and businesses with estate planning, bankruptcy, small business law, and nonprofit legal services. Expert, compassionate legal guidance.',
  image: 'https://ohlawcolorado.com/img/ohlaw_icon_circle_gray_drop2.png',
  keywords: 'estate planning, small business law, bankruptcy, nonprofit law, Fort Collins attorney, Colorado lawyer, family law firm',
  // Enhanced structured data that includes your services
  structuredData: {
    '@type': 'LegalService',
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'Legal Services',
      'itemListElement': services.map((service, index) => ({
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Service',
          'name': service.title,
          'description': service.description,
          'url': `https://ohlawcolorado.com${service.link}`,
        },
        'position': index + 1,
      })),
    },
  },
}

// Set up meta tags with explicit image priority
useHead(useSeo(pageMeta))

// Add additional meta tags to ensure proper social media image with cache busting
useHead({
  meta: [
    // Force the correct image for social media with unique IDs to prevent conflicts
    { hid: 'og:image', property: 'og:image', content: 'https://ohlawcolorado.com/img/ohlaw_icon_circle_gray_drop2.png?v=2' },
    { hid: 'og:image:secure_url', property: 'og:image:secure_url', content: 'https://ohlawcolorado.com/img/ohlaw_icon_circle_gray_drop2.png?v=2' },
    { hid: 'og:image:type', property: 'og:image:type', content: 'image/png' },
    { hid: 'og:image:width', property: 'og:image:width', content: '512' },
    { hid: 'og:image:height', property: 'og:image:height', content: '512' },
    { hid: 'og:image:alt', property: 'og:image:alt', content: 'The Law Offices of Owen Hathaway Logo' },
    { hid: 'twitter:image', name: 'twitter:image', content: 'https://ohlawcolorado.com/img/ohlaw_icon_circle_gray_drop2.png?v=2' },
    { hid: 'twitter:image:alt', name: 'twitter:image:alt', content: 'The Law Offices of Owen Hathaway Logo' },
  ],
})
</script>
