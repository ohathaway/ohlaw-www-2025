<template>
  <main>
    <!-- Hero Section -->
    <ServicesHero
      title="Small Business Legal Services<br />That Make Sense"
      subtitle="Helping entrepreneurs build, grow, and protect their businesses"
      buttonText="Schedule a Consultation"
      :button-link="link"
      backgroundImage="/img/business1_1024.webp"
    />

    <!-- Introduction Section -->
    <ServicesIntro
      title="Small Business Legal Support"
      description="<p>We are a small business. We've started and run several small businesses. We understand the reward as well as the challenges small business owners face. Choosing an entity, dividing ownership, managing liability, vendor contracts, staying out of tax trouble, employees?</p><p>We can help you keep your focus on building your business while managing predictable legal costs.</p>"
      :features="businessFeatures"
      imageSource="/img/business1_1024.webp"
      imageProvider="cloudflare"
      imageTitle="Small Business"
      buttonText="Get Started Today"
      :button-link="link"
    />

    <!-- Why Small Business Legal Services Matter -->
    <ServicesFeatures
      title="Protect What You're Building"
      :features="whyItMattersFeatures"
      :columns="3"
      background="light"
    />

    <!-- Small Business Services -->
    <ServicesOfferings
      title="Small Business Legal Services"
      :offerings="businessServices"
      :columns="2"
      background="light"
    />

    <!-- FAQ Section -->
    <section class="py-5">
      <div class="container w-3xl mx-auto">
        <h2 class="text-center mb-5">Frequently Asked Questions</h2>
        <FaqAccordion :faqItems="businessFaqs" />
      </div>
    </section>

    <!-- Call to Action -->
    <ServicesCta
      title="Ready to Focus on Your Business?"
      description="Let us handle the legal details while you build your dream."
      buttonText="Schedule a Consultation"
      :button-link="link"
    />
  </main>
</template>

<script setup>
// Get the scheduling link from app config
const { schedulingLinks: { newBusinessClient: link } } = useAppConfig()

// SEO metadata
useHead(useSeo({
  title: `Small Business Legal Services`,
  meta: [
    {
      name: 'description',
      content: `Legal services for small businesses in Colorado. Entity formation, contracts, employment matters, and ongoing legal support for entrepreneurs.`
    }
  ]
}))

// Introduction section features
const businessFeatures = [
  {
    title: `Entity Formation`,
    description: `Guidance on choosing the right business structure (LLC, Corporation, etc.)`
  },
  {
    title: `Core Business Agreements`,
    description: `Operating agreements, partnership agreements, buy/sell agreements, and ownership documents`
  },
  {
    title: `Contracts`,
    description: `Vendor contracts, leases, employment agreements, and more`
  },
  {
    title: 'Business Compliance',
    description: `Help with ongoing legal requirements to keep your business in good standing`
  },
  {
    title: 'Risk Management',
    description: `Strategies to protect your personal assets from business liabilities`
  },
  {
    title: 'Your Ultimate Exit Strategy',
    description: `Every business owner eventually steps away. <a href="/services/estate-planning" title="We follow the Personal Family Lawyer process, learn about what that means.">Our unique estate planning program</a> creates a succession plan that protects your stakeholders and ensures an orderly transition when the time comes.`
  }
]

// Why legal services matter features
const whyItMattersFeatures = [
  {
    icon: 'shield-fill',
    title: `Liability Protection`,
    description: `Proper legal structures and agreements protect your personal assets from business risks and liabilities.`
  },
  {
    faIcon: 'fa-file-signature',
    title: `Contract Security`,
    description: `Well-drafted contracts protect your interests, clarify relationships, and provide recourse if things go wrong.`
  },
  {
    icon: 'building-gear',
    title: `Business Compliance`,
    description: `Stay in good standing with government agencies and avoid penalties, fines, or forced business dissolution.`
  }
]

// Business service offerings
const businessServices = [
  {
    title: `Business Formation`,
    description: `We help entrepreneurs select and establish the right business entity:`,
    features: [
      { text: `LLC formation and operating agreements` },
      { text: `Corporate formation and bylaws` },
      { text: `Partnership agreements` },
      { text: `Business name research and registration` }
    ]
  },
  {
    title: 'Business Contracts',
    description: `We draft, review, and negotiate essential business agreements:`,
    features: [
      { text: `Service agreements and terms of service` },
      { text: `Vendor and supplier contracts` },
      { text: `Commercial lease agreements` },
      { text: `Purchase and sale agreements` }
    ]
  },
  {
    title: 'Employment Matters',
    description: `Legal support for hiring and managing employees:`,
    features: [
      { text: `Employment agreements and compensation plans` },
      { text: `Independent contractor agreements` },
      { text: `Non-compete and confidentiality agreements` },
      { text: `Employee handbooks and policies` }
    ]
  },
  {
    title: 'Ongoing Business Support',
    description: `Legal guidance as your business grows:`,
    features: [
      { text: `Annual business compliance reviews` },
      { text: `Contract management and updates` },
      { text: `Business succession planning` },
      { text: `Risk management strategies` }
    ]
  }
]

// FAQ items
const businessFaqs = [
  {
    question: `When should I consult with a business attorney?`,
    answer: `Ideally, you should consult with a business attorney before starting your business to ensure proper foundation and protection. However, it's never too late to get legal guidance. Key times to consult include: before forming your business entity, when drafting or signing important contracts, before hiring employees, when facing regulatory compliance issues, before taking on investors or partners, and when experiencing significant growth or considering business changes. Proactive legal guidance is almost always less expensive than resolving problems after they occur. Remember, it's never too late to start doing the right thing.`
  },
  {
    question: `Do I really need an LLC for my business?`,
    answer: `While not every business requires an LLC, forming one provides crucial liability protection that separates your personal assets from business debts and liabilities. For most small businesses, an LLC offers the right balance of liability protection, tax flexibility, and administrative simplicity. Caveat: you are always liable for the things that you do. An LLC is not a substitute for proper insurance. During our consultation, we can assess your specific situation and help you determine if an LLC is right for your business.`
  },
  {
    question: `What's the difference between an LLC and an S-Corporation?`,
    answer: `This question reflects a common misconception that <a href="https://ohlawcolorado.com/blog/understanding-the-real-relationship-between-ll-cs-and-s-corporations">we address in this article</a>. An LLC is a business entity type, while an S-Corporation is a tax election made with the IRS. In fact, an LLC can elect to be taxed as an S-Corporation while maintaining its LLC legal structure. By default, single-member LLCs are taxed as sole proprietorships and multi-member LLCs as partnerships, but they can elect S-Corporation tax treatment to potentially reduce self-employment taxes on a portion of income. This election comes with additional requirements like reasonable salary payments, more formalized accounting, and certain ownership restrictions. We can help you understand whether your LLC would benefit from S-Corporation tax treatment based on your specific financial situation and goals.`
  },
  {
    question: `Can't I just use online templates for my business contracts?`,
    answer: `While template contracts may seem cost-effective initially, they often fail to address your business's specific needs and Colorado's legal requirements. We've seen template contracts create mistakes that ultimately ended up costing thousands more than it would have cost to do custom agreements in the first place. Generic templates may contain unenforceable provisions, omit crucial protections, or include terms that don\'t serve your interests. Our customized contracts provide proper protection, clarity, and enforceability, potentially saving you from costly disputes and litigation in the future.`
  },
  {
    question: `How much does it cost to form an LLC in Colorado?`,
    answer: `The cost to form an LLC in Colorado includes the state filing fee ($50 as of 2025 for online filings) plus attorney fees for legal guidance and document preparation. Some business also require additional licensing or registration fees. Our LLC formation packages  depending on complexity of what you need. That's why we offer free initial consultations to get to know you and your business better. We try to always work on flat-fee pricing so you know exactly what to expect.`
  },
  {
    question: `What happens if I have a business partner and we disagree later?`,
    answer: `Business partnership disputes can be costly and destructive without proper planning. We strongly recommend creating comprehensive operating or partnership agreements that address decision-making authority, dispute resolution procedures, buyout provisions, and exit strategies. These agreements establish clear protocols for resolving disagreements and protect all owners' interests. We've experienced partnership disputes firsthand and use that knowledge to help our clients avoid similar challenges.`
  }
]
</script>