export default defineAppConfig({
  contactEmail: 'contact@ohlawcolorado.com',
  phoneNumbers: {
    voice: '9708183052',
    sms: '9708185559',
    fax: '9703607028',
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
    petitionReviewRemote: 'https://booking.ohlawcolorado.com/bk-review-remote',
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
      zip: '80528',
    },
    socialProfiles: {
      google: 'https://www.google.com/search?q=the+law+offices+of+owen+hathaway',
      linkedIn: 'https://www.linkedin.com/company/ohlawco',
      facebook: 'https://www.facebook.com/ohlawCO',
      instagram: 'https://www.instagram.com/hathaway.owen',
    },
    priceRange: 'Fixed Fees',
    founder: {
      name: 'Owen Hathaway',
      jobTitle: 'Attorney',
    },
    slogan: 'Make money by doing good things and build cool stuff.',
    services: [
      'Estate Planning',
      'Small Business Law',
      'Bankruptcy',
      'Nonprofit Legal Services',
    ],
  },
  meilisearch: {
    host: 'https://search.ohlawcolorado.com',
  },
  strapiUrl: 'https://strapi.ohlawcolorado.com',
  floatingCta: {
    alwaysPaths: [
      '/quizzes',
    ],
    neverPaths: [
      '/contact',
      '/make-a-payment',
    ],
  },
  quizzes: {
    reports: {
      layout: {
        footer_position: 65,
        footer_reserve_space: 80,
      },
      fromEmail: {
        address: 'quizzes@ohlawcolorado.com',
        name: 'OHLaw Quizzes',
      },
    },
  },
  routeTitles: {
    policies: 'Policies',
    fees: 'Fees and Charges',
    privacy: 'Privacy Policy',
    unbundled: 'Unbundled Services',
    services: 'Services',
    'estate-planning': 'Estate Planning',
    'gun-trusts': 'Gun Trusts',
    'small-business': 'Small Business',
    bankruptcy: 'Bankruptcy',
    nonprofits: 'Nonprofit Organizations',
    blog: 'Blog',
    contact: 'Contact Us',
    about: 'About Us',
  },
  layoutMapping: [
    { pattern: '/policies/**', layout: 'policy' },
    { pattern: '/blog/**', layout: 'blog' },
    { pattern: '/services/**', layout: 'services' },
  ],

  // Tool configuration
  tools: {
    rothConversion: {
      // Growth and distribution modeling
      defaultAnnualReturn: 0.06, // 6% annual return assumption
      distributionYears: 10, // SECURE 2.0 distribution period

      // Typography preferences for accessibility
      typography: {
        enhancedForSeniors: true,
        minimumFontSize: 14,
        chartTitleSize: 18,
        chartLabelSize: 14,
      },

      // Default calculation parameters
      defaults: {
        maxChildren: 4,
        conversionPercentages: [0.15, 0.25, 0.40, 0.50], // Conservative, Moderate, Aggressive, Danger
        defaultTaxRates: {
          parent: {
            conservative: 22,
            moderate: 24,
            aggressive: 24,
            danger: 37,
          },
          children: {
            conservative: 22,
            moderate: 24,
            aggressive: 28,
            danger: 20,
          },
        },
      },

      // Pre-filled form values for input form
      formDefaults: {
        totalPreTaxAccounts: 2180000,  // $2.18M
        totalRothAccounts: 105000,     // $105K
        numberOfChildren: 4            // 4 children
      },

      // Chart styling configuration
      chart: {
        responsiveBreakpoints: {
          mobile: 768,
          tablet: 1024,
        },
        colorPalette: {
          success: '#10b981',
          info: '#0ea5e9',
          warning: '#f59e0b',
          danger: '#ef4444',
        },
      },

      // Phase 5A: Performance-based color bands
      performanceBands: {
        excellent: { 
          threshold: 10, // >10% of starting IRA value saved
          severity: 'info', 
          color: 'blue',
          label: 'Excellent Performance'
        },
        good: { 
          threshold: 5, // 5-9% of starting IRA value saved
          severity: 'success', 
          color: 'green',
          label: 'Good Performance'
        },
        marginal: { 
          threshold: 2, // 1-2% of starting IRA value saved
          severity: 'warn', 
          color: 'orange',
          label: 'Marginal Performance'
        },
        negative: { 
          threshold: 0, // ≤0% family loses money
          severity: 'danger', 
          color: 'red',
          label: 'Negative Performance'
        },
      },
    },
  },
})