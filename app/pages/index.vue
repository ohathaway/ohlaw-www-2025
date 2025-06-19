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
    description: `We help you express your wishes for what happens to you and your estate when you no longer can express them. Our estate planning services ensure your life's accomplishments are properly passed on to the people and causes you care about.`
  },
  {
    id: 'small-business',
    title: 'Small Business',
    image: '/img/business1_1024.webp',
    imageAlt: 'Small business owner working on legal documents',
    link: '/services/small-business',
    shortPreview: `Legal foundations for your business growth and success.`,
    description: `As small business owners ourselves, we understand the challenges you face. From entity selection to contracts and liability management, we help you build a solid legal foundation so you can focus on growing your business.`
  },
  {
    id: 'nonprofits',
    title: 'Nonprofits',
    image: '/img/dotorgtablet_1024.webp',
    imageAlt: 'Nonprofit organization documents on tablet',
    link: '/services/nonprofits',
    shortPreview: `Sustainable structures for mission-driven organizations.`,
    description: `We help nonprofits set up for long-term sustainability with the right structure and compliance. Our experience with both small businesses and nonprofits gives us unique insight into creating organizations that balance mission with operational stability.`
  },
  {
    id: 'bankruptcy',
    title: 'Bankruptcy',
    image: '/img/helpinghand_1024.webp',
    imageAlt: 'Helping hand extended for financial relief',
    link: '/services/bankruptcy',
    shortPreview: `Clear your financial path forward with our bankruptcy services.`,
    description: `When financial obstacles are blocking your view of what's important, our bankruptcy program can help. We believe everyone deserves the opportunity to pursue their dreams regardless of past financial setbacks.`
  }
]

// Use your SEO composable to set page meta
const pageMeta = {
  title: 'The Law Offices of Owen Hathaway | Family and Business Legal Solutions',
  description: 'A family-operated law firm helping families and businesses establish rock-solid legal foundations in estate planning, small business, nonprofit, and bankruptcy law.',
  keywords: 'estate planning, small business law, bankruptcy, nonprofit law, Fort Collins attorney',
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
          'url': `https://ohlawcolorado.com${service.link}`
        },
        'position': index + 1
      }))
    }
  }
}

// Set up meta tags
useHead(useSeo(pageMeta))
</script>