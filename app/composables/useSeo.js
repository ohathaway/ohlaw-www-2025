// composables/useSeo.js
export function useSeo(pageMeta = {}) {
  const { seo } = useAppConfig()
  const route = useRoute()
  
  // Merge page data with defaults
  const title = pageMeta.title || seo.defaultTitle
  const description = pageMeta.description || seo.defaultDescription
  const keywords = pageMeta.keywords || seo.defaultKeywords
  const image = pageMeta.image || seo.defaultImage
  const imageAlt = pageMeta.imageAlt || `${seo.siteName} logo`
  const path = pageMeta.path || route.path
  const url = `${seo.siteUrl}${path}`
  
  // Build default structured data with enhanced local SEO
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    'name': seo.siteName,
    'image': seo.logo,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': seo.address.street,
      'addressLocality': seo.address.city,
      'addressRegion': seo.address.state,
      'postalCode': seo.address.zip
    },
    'description': description,
    'telephone': seo.phone,
    'smsNumber': seo.smsNumber,
    'url': url,
    'sameAs': Object.values(seo.socialProfiles),
    'priceRange': seo.priceRange,
    'founder': {
      '@type': 'Person',
      'name': seo.founder.name,
      'jobTitle': seo.founder.jobTitle,
      'hasCredential': seo.founder.credentials
    },
    'slogan': seo.slogan,
    'knowsAbout': seo.services,
    'areaServed': seo.serviceAreas?.map(area => ({
      '@type': 'City',
      'name': area
    })),
    'openingHours': seo.hours ? [
      'Mo-Fr 09:00-17:00',
      'Sa 09:00-17:00'
    ] : undefined,
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'Legal Services',
      'itemListElement': seo.services.map((service, index) => ({
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Service',
          'name': service
        }
      }))
    }
  }

  // Handle structured data - can be object, array, or merge with default
  let structuredData
  if (Array.isArray(pageMeta.structuredData)) {
    // If page provides an array, use it directly and add default as first item
    structuredData = [defaultStructuredData, ...pageMeta.structuredData]
  } else if (pageMeta.structuredData) {
    // If page provides an object, merge with default
    structuredData = { ...defaultStructuredData, ...pageMeta.structuredData }
  } else {
    // Use default only
    structuredData = defaultStructuredData
  }

  return {
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
      { name: 'twitter:image:alt', content: imageAlt }
    ],
    link: [
      { rel: 'canonical', href: url }
    ],
    script: Array.isArray(structuredData) 
      ? structuredData.map(data => ({
          type: 'application/ld+json',
          innerHTML: JSON.stringify(data)
        }))
      : [
          {
            type: 'application/ld+json',
            innerHTML: JSON.stringify(structuredData)
          }
        ]
  }
}