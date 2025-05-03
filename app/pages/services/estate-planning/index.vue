<template>
  <!-- Hero Section -->
  <ServicesHero
    title="Estate Planning That Works<br />For Real People"
    subtitle="Protecting Your Legacy and Providing Peace of Mind"
    buttonText="Schedule Your Free Consultation"
    :button-link="link"
    backgroundImage="@/assets/img/estatenotebook_1024.webp"
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
    <div class="container">
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
import EstatePlanning from '@/assets/img/estatenotebook_1024.webp'
// Get the scheduling link from app config
const { schedulingLinks: { newClient: link } } = useAppConfig()

// SEO metadata
useHead(useSeo({
  title: 'Estate Planning That Works For Real People | The Law Offices of Owen Hathaway',
  meta: [
    { name: 'keywords', content: 'estate planning Colorado, wills and trusts Fort Collins, revocable living trust, estate lawyer, guardianship planning, healthcare directive, power of attorney, probate avoidance, asset protection' },
    { property: 'og:title', content: 'Estate Planning That Works For Real People | The Law Offices of Owen Hathaway' },
    { property: 'og:description', content: 'Don\'t let your legacy fall into legal limbo. Our practical estate planning solutions protect what matters most to you without the legal mumbo-jumbo. Free consultation available.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://ohlawcolorado.com/estate-planning' },
    { property: 'og:image', content: 'https://ohlawcolorado.com/files/ohlaw-logo-trans-450.D38LfYoB.svg' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Estate Planning That Works For Real People | The Law Offices of Owen Hathaway' },
    { name: 'twitter:description', content: 'Don\'t let your legacy fall into legal limbo. Our practical estate planning solutions protect what matters most to you without the legal mumbo-jumbo. Free consultation available.' }
  ],
  link: [
    { rel: 'canonical', href: 'https://ohlawcolorado.com/estate-planning' }
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
    content: [
      `Our process begins with a free educational session where we help you understand your options and the importance of estate planning. This no-pressure conversation allows you to:`,
      `• Learn about different estate planning tools and strategies`,
      `• Discuss your specific concerns and goals`,
      `• Understand our process and pricing`,
      `• Ask any questions you have about estate planning`,
      `• Make an informed choice`,
      `This session typically lasts 60-90 minutes and can be conducted in person or virtually.`
    ]
  },
  {
    type: 'content',
    info: 'Choose Your Path',
    content: [
      `After your education session, you'll decide which plan option is right for you:`,
      `• Always Documents: Essential documents everyone needs including healthcare power of attorney, living will, HIPAA authorizations, and general durable power of attorney`,
      `• Quick Plan: An efficient solution using streamlined features, including all core documents plus either a Quick Will (for estates without real estate) or Quick Trust (for estates with one real property)`,
      `• Will-Based Plan: Suitable for simple estates without real estate succession complexity, including asset distribution provisions, executor nominations, and basic tax planning`,
      `• Trust-Based Plan: Recommended for real estate owners and families seeking probate avoidance, including a revocable living trust, pour-over will, and transfer deed for primary residence`,
      `• Tax-Planning Trust Plan: Advanced options including QTIP or A/B separate trust analysis and irrevocable trust options`,
      `We respect your timeline and will never pressure you to make a decision before you're ready.`
    ]
  },
  {
    type: 'content',
    info: 'Plan Design',
    content: [
      `If you choose to move forward, we'll schedule a design session to create the blueprint for your estate plan:`,
      `• More homework, we have a planning workbook to help guide the process`,
      `• We'll discuss your family structure, assets, and goals in detail`,
      `• Together, we'll determine which tools (wills, trusts, etc.) are appropriate for your situation`,
      `• We'll address specific concerns such as minor children, blended families, or beneficiaries with special needs`
    ]
  },
  {
    type: 'content',
    info: 'Information Confirmation - CIMI',
    content: [
      `Accuracy is critical in estate planning. Our Confirm, Inventory, Modify, and Inform (CIMI) process ensures your plan is built on solid information:`,
      `• Confirm: We'll verify all the information gathered during your design session`,
      `• Inventory: We'll create a comprehensive inventory of your assets`,
      `• Modify: You'll have the opportunity to make any necessary adjustments`,
      `• Inform: We'll explain how your plan will address your specific goals`,
      `This step helps prevent errors and ensures your plan truly reflects your wishes.`
    ]
  },
  {
    type: 'content',
    info: 'Drafting',
    content: [
      `Using the confirmed information, our attorneys will draft your customized estate planning documents:`,
      `• Each document is tailored to your specific situation`,
      `• We use clear, understandable language whenever possible`,
      `• All documents comply with Colorado law and best practices`,
      `• We complete most drafting within 1-2 weeks of your CIMI session`
    ]
  },
  {
    type: 'content',
    info: 'Signing Ceremony',
    content: [
      `Once your documents are prepared, we'll schedule a signing ceremony:`,
      `• We'll review each document with you to ensure you understand its purpose`,
      `• All documents will be properly executed according to legal requirements`,
      `• We'll serve as witnesses and provide notary services as needed`,
      `• Since we like to create multiple originals of most documents, the signing typically takes about an hour and can be scheduled at your convenience`
    ]
  },
  {
    type: 'content',
    info: 'Delivery and Training',
    content: [
      `After your signing ceremony, we'll prepare your final document package. Once everything is ready, we'll schedule a delivery and training session where:`,
      `• You'll receive organized physical and digital copies of all documents`,
      `• We'll explain how to properly store your documents`,
      `• You'll learn how to communicate your plan to relevant family members and healthcare providers`,
      `• If you haven't chosen our Plan Funding option, we'll provide guidance on any necessary asset retitling or beneficiary designations`
    ]
  },
  {
    type: 'content',
    info: 'Maintenance',
    content: [
      `Estate planning is an ongoing process, not a one-time event:`,
      `• We recommend reviewing your estate plan at least every 3 years or after major life events`,
      `• We offer annual check-in options to ensure your plan remains current`,
      `• Our team is available to answer questions as they arise`,
      `• Subscribe to our newsletter for updates when legal changes affect your estate plan`,
      `This ongoing relationship helps ensure your estate plan continues to serve your needs as your life evolves.`
    ]
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

<style scoped>
h2 {
  color: #0056b3;
  font-weight: 700;
  margin-bottom: 25px;
  position: relative;
  
  &.text-center:after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background-color: #0056b3;
  }
}

@media (max-width: 768px) {
  h2.text-center:after {
    width: 60px;
  }
}

.btn-primary {
  background-color: #0056b3;
  border-color: #0056b3;
  
  &:hover {
    background-color: #004494;
    border-color: #004494;
  }
}

.bg-primary {
  background-color: #0056b3 !important;
}
</style>