<template>
  <!-- Hero Section -->
  <ServicesHero
    title="Estate Planning That Works<br />For Real People"
    subtitle="Protecting Your Legacy and Providing Peace of Mind"
    buttonText="Schedule Your Free Consultation"
    :button-link="link"
    backgroundImage="/img/estatenotebook_1024.webp"
  />

  <!-- Introduction Section -->
  <ServicesIntro
    title="What Sets Our<br />Estate Planning Services Apart"
    description="<p>You work hard toward your life's accomplishments. Whether that includes some measure of wealth, a business legacy, or raising a family you are proud of, the way you pass it all on to the people and causes you care about is an important part of your life's plan.</p><p>We can help you express your wishes for what happens to you and your estate when you no longer can express them.</p>"
    :features="introFeatures"
    imageSource="/img/estatenotebook_1024.webp"
    imageProvider="cloudflare"
    imageTitle="Estate Planning"
    buttonText="Get Started Today"
    :button-link="link"
  />

  <!-- Why Estate Planning Matters -->
  <ServicesFeatures
    title="Why Estate Planning Matters"
    :features="whyItMattersFeatures"
    :columns="3"
    background="light"
  />

  <!-- Our Process Timeline -->
  <ServicesProcess
    id="our-process"
    title="Our Estate Planning Process"
    description="We've developed a streamlined, client-friendly process to make creating your estate plan as simple and stress-free as possible."
    :process-steps="tlContent"
    background="secondary"
  />

  <!-- Estate Planning Tools -->
  <ServicesOfferings
    title="Some Estate Planning Tools We Offer"
    :offerings="toolsOfferings"
    :columns="2"
    background="light"
  />

  <!-- FAQ Section -->
  <section class="py-5">
    <div class="container w-3xl mx-auto">
      <h2 class="text-center mb-5">Frequently Asked Questions</h2>
      <FaqAccordion :faqItems="faqItems" />
    </div>
  </section>

  <!-- Call to Action -->
  <ServicesCta
    title="Ready to Protect Your Legacy?"
    description="Schedule your Life and Legacy Planning Session today and take the first step toward peace of mind."
    buttonText="Schedule Your Free Consultation"
    :button-link="link"
  />
</template>

<script setup>
// Get the scheduling link from app config
const { schedulingLinks: { estatePlanEducation: link } } = useAppConfig()

// SEO metadata with enhanced local targeting
const { seo } = useAppConfig()

useHead(useSeo({
  title: 'Estate Planning Attorney Fort Collins | Wills & Trusts Colorado | Owen Hathaway',
  description: 'Trusted estate planning attorney serving Fort Collins and Northern Colorado. Protect your family\'s future with comprehensive wills, trusts, and estate plans. Free consultation available.',
  keywords: seo.localKeywords.estate + ', estate attorney Fort Collins, will preparation Colorado, trust attorney Northern Colorado, probate avoidance Fort Collins, family estate planning',
  structuredData: [
    {
      '@type': 'LegalService',
      'serviceType': 'Estate Planning',
      'areaServed': seo.serviceAreas,
      'hasOfferCatalog': {
        '@type': 'OfferCatalog',
        'name': 'Estate Planning Services',
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Wills and Testament Preparation',
              'description': 'Comprehensive will preparation for Colorado residents'
            }
          },
          {
            '@type': 'Offer', 
            'itemOffered': {
              '@type': 'Service',
              'name': 'Revocable Living Trust',
              'description': 'Trust creation and funding services to avoid probate'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service', 
              'name': 'Healthcare Directives',
              'description': 'Medical power of attorney and advance directive preparation'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Guardianship Planning',
              'description': 'Minor children guardianship and care planning'
            }
          }
        ]
      }
    },
    {
      '@type': 'FAQPage',
      'mainEntity': faqItems.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer.replace(/<[^>]*>/g, '').trim() // Strip HTML for schema
        }
      }))
    }
  ],
  link: [
    { rel: 'canonical', href: 'https://ohlawcolorado.com/services/estate-planning' }
  ]
}))

// Introduction section features
const introFeatures = [
  {
    title: 'Personal Attention',
    description: 'Your plan is customized to your unique situation and goals.'
  },
  {
    title: 'Practical Solutions',
    description: 'We focus on what works in the real world, not just theory.'
  },
  {
    title: 'Proactive Planning',
    description: 'We help you anticipate and prevent problems before they arise.'
  },
  {
    title: 'Plain Language',
    description: 'We explain complex legal concepts in terms you can understand.'
  },
  {
    title: 'Ongoing Support',
    description: 'Estate planning is a process, not a one-time event.'
  }
]

// Why Estate Planning Matters features
const whyItMattersFeatures = [
  {
    icon: 'shield-check',
    title: 'Protect Your Family',
    description: 'Ensure your loved ones are provided for and avoid family conflicts over your assets. Designate guardians for minor children and dependents with special needs.'
  },
  {
    icon: 'coin',
    title: 'Preserve Your Assets',
    description: 'Avoid probate costs, protect your assets from creditors and minimize taxes. Ensure your hard-earned wealth goes to your chosen beneficiaries.'
  },
  {
    icon: 'heart-pulse',
    title: 'Healthcare Decisions',
    description: 'Make your healthcare wishes known through advance directives. Appoint trusted individuals to make medical decisions if you\'re unable to do so.'
  }
]

// Estate Planning Tools offerings
const toolsOfferings = [
  {
    title: 'Wills',
    description: 'A will is the foundation of many estate plans. It allows you to:',
    features: [
      { text: 'Name beneficiaries for your assets' },
      { text: 'Designate guardians for minor children' },
      { text: 'Appoint an executor to manage your estate' },
      { text: 'Provide instructions for asset distribution' }
    ]
  },
  {
    title: 'Trusts',
    description: 'Trusts offer additional benefits beyond wills:',
    features: [
      { text: 'Avoid probate and maintain privacy' },
      { text: 'Provide for minor children or beneficiaries with special needs' },
      { text: 'Control asset distribution over time' },
      { text: 'Can be joint plans for both spouses' }
    ]
  },
  {
    title: 'Specialized Trusts',
    description: 'We offer specialized trusts for specific situations:',
    features: [
      { text: '<a href="/services/estate-planning/gun-trusts">Gun Trusts</a> for firearm owners', isHtml: true },
      { text: 'Special Needs Trusts for beneficiaries with disabilities' },
      { text: 'Pet Trusts for beloved animal companions' },
      { text: 'Spendthrift Trusts for beneficiaries who need protection from creditors and predators' }
    ]
  },
  {
    title: 'Concierge Trust Funding',
    description: 'Creating a trust is useless unless you put something in it. We offer:',
    features: [
      { text: 'Complete asset transfer management, eliminating the frustration of DIY trust funding' },
      { text: 'Professional handling of complex property titles, financial accounts, and investment transfers' },
      { text: 'Regular progress updates throughout the transfer process to keep you informed' },
      { text: 'Peace of mind knowing your trust is properly funded and will work as intended when needed' }
    ]
  }
]

// Timeline content - expanded from the existing timeline
const tlContent = [
  {
    type: 'content',
    info: 'The Life and Legacy Education Session',
    content: `
      <p>Our process begins with a free educational session where we help you understand your options and the importance of estate planning.</p>
      <p>This no-pressure conversation allows you to:
      <ul>
        <li>Learn about different estate planning tools and strategies</li>
        <li>Discuss your specific concerns and goals</li>
        <li>Understand our process and pricing</li>
        <li>Ask any questions you have about estate planning</li>
        <li>Make an informed choice</li>
      </ul>
      </p>
      <p>This session typically lasts 60-90 minutes and can be conducted in person or virtually.</p>
    `
  },
  {
    type: 'content',
    info: 'Choose Your Path',
    content: `
      <p>After your education session, you'll decide which plan path is right for you:</p>
      <ul>
        <li><i>Always Documents:</i> Essential documents everyone needs including healthcare power of attorney, living will, HIPAA authorizations, and general durable power of attorney</li>
        <li><i>Quick Plan:</i> An efficient solution using streamlined features, including all core documents plus either a Quick Will (for estates without real estate) or Quick Trust (for estates with one real property)</li>
        <li><i>Will-Based Plan:</i> Suitable for simple estates without real estate succession complexity, including asset distribution provisions, executor nominations, and basic tax planning</li>
        <li><i>Trust-Based Plan:</i> Recommended for real estate owners and families seeking probate avoidance, including a revocable living trust, pour-over will, and transfer deed for primary residence</li>
        <li><i>Tax-Planning Trust Plan:</i> Advanced options including QTIP or A/B separate trust analysis and irrevocable trust options</li>
      </ul>
      <p>We respect your timeline and will never pressure you to make a decision before you're ready.</p>
    `
  },
  {
    type: 'content',
    info: 'Plan Design',
    content: `
      <p>If you choose to move forward, we'll schedule a design session to create the blueprint for your estate plan:</p>
      <ul>
        <li>More homework, we have a planning workbook to help guide the process</li>
        <li>We'll discuss your family structure, assets, and goals in detail</li>
        <li>Together, we'll determine which tools (wills, trusts, etc.) are appropriate for your situation</li>
        <li>We'll address specific concerns such as minor children, blended families, or beneficiaries with special needs</li>
      </ul>
    `
  },
  {
    type: 'content',
    info: 'Information Confirmation - CIMI',
    content: `
      <p>Accuracy is critical in estate planning. Our Confirm, Inventory, Modify, and Inform (CIMI) process ensures your plan is built on solid information:</p>
      <ul>
        <li><i>Confirm:</i> We'll verify all the information gathered during your design session</li>
        <li><i>Inventory:</i> We'll create a comprehensive inventory of your assets</li>
        <li><i>Modify:</i> You'll have the opportunity to make any necessary adjustments</li>
        <li><i>Inform:</i> We'll explain how your plan will address your specific goals</li>
      </ul>
      <p>This step helps prevent errors and ensures your plan truly reflects your wishes.</p>
    `
  },
  {
    type: 'content',
    info: 'Drafting',
    content: `
      <p>Using the confirmed information, our attorneys will draft your customized estate planning documents:</p>
      <ul>
        <li>Each document is tailored to your specific situation</li>
        <li>We use clear, understandable language whenever possible</li>
        <li>All documents comply with Colorado law and best practices</li>
        <li>We complete most drafting within 1-2 weeks of your CIMI session</li>
      </ul>
    `
  },
  {
    type: 'content',
    info: 'Signing Ceremony',
    content: `
      <p>Once your documents are prepared, we'll schedule a signing ceremony:</p>
      <ul>
        <li>We'll review each document with you to ensure you understand its purpose</li>
        <li>All documents will be properly executed according to legal requirements</li>
        <li>We'll serve as witnesses and provide notary services as needed</li>
        <li>Since we like to create multiple originals of most documents, the signing typically takes about an hour and can be scheduled at your convenience</li>
      </ul>
    `
  },
  {
    type: 'content',
    info: 'Delivery and Training',
    content: `
      <p>After your signing ceremony, we'll prepare your final document package. Once everything is ready, we'll schedule a delivery and training session where:</p>
      <ul>
        <li>You'll receive organized physical and digital copies of all documents</li>
        <li>We'll explain how to properly store your documents</li>
        <li>You'll learn how to communicate your plan to relevant family members and healthcare providers</li>
        <li>If you haven't chosen our Plan Funding option, we'll provide guidance on any necessary asset retitling or beneficiary designations</li>
      </ul>
    `
  },
  {
    type: 'content',
    info: 'Maintenance',
    content: `
      <p>Estate planning is an ongoing process, not a one-time event:</p>
      <ul>
        <li>We recommend reviewing your estate plan at least every 3 years or after major life events</li>
        <li>We offer annual check-in options to ensure your plan remains current</li>
        <li>Our team is available to answer questions as they arise</li>
        <li>Subscribe to our newsletter for updates when legal changes affect your estate plan</li>
      </ul>
      <p>This ongoing relationship helps ensure your estate plan continues to serve your needs as your life evolves.</p>
    `
  }
]

// FAQ items
const faqItems = [
  {
    question: 'How much does estate planning cost?',
    answer: `Our estate planning services range from $600 for essential documents only to $7,000 for complex tax-planning trust arrangements. We offer several tiered options and add-on services you can <a href="/services/estate-planning/pricing">learn more about here</a>. One thing we always promise, you'll know exactly what you're going to pay and exactly what we'll deliver.`
  },
  {
    question: 'Do I need a trust or is a will sufficient?',
    answer: `Whether you need a trust depends on your specific circumstances, goals, and assets. A will may be sufficient if you have a relatively simple estate, can effectively avoid probate through beneficiary designations, or are comfortable with your family navigating the probate process. Trusts offer benefits like default probate avoidance, privacy, and more control over asset distribution. One important difference for married couples: you cannot create a joint will, but we can create a joint trust. During your consultation, we'll help you understand which tools are most appropriate for your situation.`
  },
  {
    question: 'How long does the estate planning process take?',
    answer: `Most clients complete our estate planning process within 3-6 weeks from the initial consultation to the signing ceremony. However, the timeline can be adjusted based on your schedule and needs. We can expedite the process for urgent situations or extend it if you need more time to make decisions. We believe it's more important to do this job right than to do it fast. <a href="#our-process">Our process</a> ensures we cover your needs the way you want them covered.`
  },
  {
    question: 'What happens if I need to update my estate plan in the future?',
    answer: `Life changes, and your estate plan should evolve accordingly. We recommend reviewing your estate plan at least every 3 years or after major life events (marriage, divorce, birth of children, significant changes in assets, etc.). As our client, you'll have access to our team for questions and updates. We include every 3-year checkups in our fees to help ensure your plan remains current and effective.`
  },
  {
    question: 'What if I own property in multiple states?',
    answer: `Owning property in multiple states can complicate estate planning. Without proper planning, your heirs might face probate proceedings in each state where you own property. The plans we design create a comprehensive roadmap that addresses multi-state property ownership, potentially using tools like revocable living trusts to avoid multi-state probate issues. We also offer an option to help you implment the plan by making sure all the correct documents are filed with all the correct entities to make your plan effective.`
  },
  {
    question: 'How do I ensure my minor children are protected?',
    answer: `Protecting minor children is one of the most important aspects of estate planning for parents. We have a specific process, called the <a target="_blank" href="https://ohlawco.kidsprotectionplan.com/">Kids Protection Plan</a>, for making sure your plan covers your minor children in case something happens to you.`
  }
]
</script>