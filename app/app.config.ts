export default defineAppConfig({
  contactEmail: 'contact@ohlawcolorado.com',
  phoneNumbers: {
    voice: '9708183052',
    sms: '9708185559',
    fax: '9703607028'
  },
  schedulingLinks: {
    checkIn: 'https://booking.ohlawcolorado.com/check-in',
    estatePlanCheckup: 'https://booking.ohlawcolorado.com/ll-plan-checkup',
    estatePlanEducation: 'https://booking.ohlawcolorado.com/ll-plan-education',
    estatePlanDesign: 'https://booking.ohlawcolorado.com/ll-plan-design',
    newClient: 'https://booking.ohlawcolorado.com/new-client',
    newBusinessClient: 'https://booking.ohlawcolorado.com/new-business-client',
    newBankruptcyClient: 'https://booking.ohlawcolorado.com/new-bankruptcy-client',
    newNonprofitClient: 'https://booking.ohlawcolorado.com/new-nonprofit-client',
    petitionReviewInPerson: 'https://booking.ohlawcolorado.com/bk-review-in-person',
    petitionReviewRemote: 'https://booking.ohlawcolorado.com/bk-review-remote'
  },
  seo: {
    siteName: 'The Law Offices of Owen Hathaway',
    siteUrl: 'https://ohlawcolorado.com',
    logo: 'https://ohlawcolorado.com/files/ohlaw-logo-trans-450.D38LfYoB.svg',
    defaultTitle: 'The Law Offices of Owen Hathaway | Colorado Heart-Centered Legal Services',
    defaultDescription: 'A family-owned law firm helping other families and small businesses build rock-solid legal foundations.',
    defaultKeywords: 'law firm, Colorado attorney, Fort Collins lawyer, family-owned',
    defaultImage: 'https://ohlawcolorado.com/files/ohlaw-logo-trans-450.D38LfYoB.svg',
    phone: '970-818-3052',
    smsNumber: '970-818-5559',
    address: {
      street: '2580 E Harmony Rd, Suite 201',
      city: 'Fort Collins',
      state: 'CO',
      zip: '80528'
    },
    socialProfiles: {
      google: 'https://www.google.com/search?q=the+law+offices+of+owen+hathaway',
      linkedIn: 'https://www.linkedin.com/company/ohlawco',
      facebook: 'https://www.facebook.com/ohlawCO',
      instagram: 'https://www.instagram.com/hathaway.owen'
    },
    priceRange: 'Fixed Fees',
    founder: {
      name: 'Owen Hathaway',
      jobTitle: 'Attorney'
    },
    slogan: 'Make money by doing good things and build cool stuff.',
    services: [
      'Estate Planning', 
      'Small Business Law', 
      'Bankruptcy', 
      'Nonprofit Legal Services'
    ]
  },
  meilisearch: {
    host: 'https://search.ohlawcolorado.com'
  },
  strapiUrl: 'https://strapi.ohlawcolorado.com',
  floatingCta: {
    alwaysPaths: [
      '/quizzes'
    ],
    neverPaths: [
      '/contact',
      '/make-a-payment'
    ]
  },
  quizzes: {
    reports: {
      layout: {
        footer_position: 65,
        footer_reserve_space: 80
      },
      fromEmail: {
        address: 'quizzes@ohlawcolorado.com',
        name: 'OHLaw Quizzes'
      },
    },
  },
  routeTitles: {
    'policies': 'Policies',
    'fees': 'Fees and Charges',
    'privacy': 'Privacy Policy',
    'unbundled': 'Unbundled Services',
    'services': 'Services',
    'estate-planning': 'Estate Planning',
    'gun-trusts': 'Gun Trusts',
    'small-business': 'Small Business',
    'bankruptcy': 'Bankruptcy',
    'nonprofits': 'Nonprofit Organizations',
    'blog': 'Blog',
    'contact': 'Contact Us',
    'about': 'About Us'
  },
  layoutMapping: [
    { pattern: '/policies/**', layout: 'policy' },
    { pattern: '/blog/**', layout: 'blog' },
    { pattern: '/services/**', layout: 'services' }
  ]
})