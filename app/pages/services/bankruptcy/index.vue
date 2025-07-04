<template>
  <main>
    <!-- Hero Section -->
    <ServicesHero
      title="Bankruptcy Relief<br />That Gives You a Fresh Start"
      subtitle="Regain Financial Control and Peace of Mind"
      buttonText="Schedule Your Free Consultation"
      :button-link="link"
      backgroundImage="/img/helpinghand_1024.webp"
    />

    <!-- Introduction Section -->
    <ServicesIntro
      title="Compassionate Bankruptcy Services"
      description="<p>Financial distress can happen to anyone. Job loss, medical bills, divorce, or unexpected expenses can quickly lead to overwhelming debt. Our bankruptcy services offer a path to financial recovery with dignity and respect.</p><p>We understand that seeking bankruptcy protection is a difficult decision, and we're here to guide you through the process with empathy and expertise.</p>"
      :features="introFeatures"
      imageSource="/img/helpinghand_1024.webp"
      imageProvider="cloudflare"
      imageTitle="Bankruptcy Services"
      buttonText="Start Your Fresh Start"
      :button-link="link"
    />

    <!-- Why Consider Bankruptcy -->
    <ServicesFeatures
      title="Benefits of Bankruptcy Protection"
      :features="bankruptcyBenefits"
      :columns="3"
      background="light"
    />

    <!-- Our Process Timeline -->
    <ServicesProcess
      id="bankruptcy-process"
      title="Our Bankruptcy Process"
      description="We've developed a streamlined, supportive process to make your bankruptcy filing as stress-free as possible."
      :process-steps="bankruptcyProcess"
    />

    <!-- Bankruptcy Options -->
    <ServicesOfferings
      title="Bankruptcy Options We Offer"
      :offerings="bankruptcyOptions"
      :columns="2"
      background="light"
    />

    <!-- FAQ Section -->
    <section class="py-5">
      <div class="container w-3xl mx-auto">
        <h2 class="text-center mb-5">Frequently Asked Questions</h2>
        <FaqAccordion :faqItems="bankruptcyFaqs" />
      </div>
    </section>

    <!-- Call to Action -->
    <ServicesCta
      title="Ready to Reclaim Your Financial Future?"
      description="Schedule your free bankruptcy consultation today and take the first step toward debt relief."
      buttonText="Schedule Your Free Consultation"
      :button-link="link"
    />
  </main>
</template>

<script setup>
// Get the scheduling link from app config
const { schedulingLinks: { newBankruptcyClient: link } } = useAppConfig()
// SEO metadata with enhanced local targeting
const { seo } = useAppConfig()

// Introduction section features
const introFeatures = [
  {
    title: 'Personalized Approach',
    description: `Your unique financial situation deserves individualized attention and solutions.`
  },
  {
    title: 'Immediate Protection',
    description: `Filing bankruptcy provides immediate relief through the automatic stay, stopping collection actions.`
  },
  {
    title: 'Clear Communication',
    description: `We explain complex bankruptcy concepts in straightforward, understandable terms.`
  },
  {
    title: 'Affordable Fees',
    description: `We offer reasonable flat-fee pricing and payment plans to make bankruptcy accessible.`
  },
  {
    title: 'Seamless Future Planning',
    description: `Your fresh start is just the beginning. We can easily transition your bankruptcy information into <a href="/services/estate-planning" title="Learn why we believe everyone should do estate planning and how we make that accessible to anyone.">estate planning protection</a> or <a href="/services/small-business" title="We love it when we can help someone through a bankruptcy then start and grow a business they love.">business services</a>, with special discounts available within one year of discharge.`
  }
]

// Bankruptcy Benefits features
const bankruptcyBenefits = [
  {
    icon: 'shield-fill-check',
    title: `Stop Creditor Harassment`,
    description: `Filing bankruptcy triggers an automatic court order halting collection calls, lawsuits, wage garnishments, and repossessions.`
  },
  {
    icon: 'trash3',
    title: `Eliminate Unsecured Debt`,
    description: `Discharge eligible debts including credit cards, medical bills, personal loans, certain types of taxes and other types of debt through Chapter 7 bankruptcy.`
  },
  {
    icon: 'house-gear-fill',
    title: `Save Your Home`,
    description: `Chapter 13 bankruptcy can help you catch up on mortgage arrears and potentially remove second mortgages or home equity lines of credit.`
  }
]

// Bankruptcy process steps
const bankruptcyProcess = [
  {
    type: 'content',
    info: 'Free Initial Consultation',
    content: `
      <p>Our bankruptcy process begins with a free consultation where we:</p>
      <ul>
        <li>Review your current financial situation</li>
        <li>Discuss your goals and concerns</li>
        <li>Assess your debts, assets, income, and expenses</li>
        <li>Explain bankruptcy options specific to your situation</li>
        <li>Answer all your questions about the bankruptcy process</li>
      </ul>
      <p>This consultation can be conducted in person or virtually for your convenience.</p>
    `
  },
  {
    type: 'content',
    info: 'Document Collection',
    content: `
      <p>We'll help you gather all necessary documents for your bankruptcy filing. The more organized you already are here, the faster we can work. But we can work with anyone to gather:</p>
      <ul>
        <li>Tax returns for the last 2 years</li>
        <li>Pay stubs or income documentation for the last 6 months</li>
        <li>Current bank statements</li>
        <li>Vehicle and property information</li>
        <li>Credit reports and debt documentation</li>
        <li>We provide a detailed checklist and secure document upload system to make this process as simple as possible</li>
      </ul>
    `
  },
  {
    type: 'content',
    info: 'Petition Preparation',
    content: `
      <p>Using the information you've helped us collect as well as your credit report, we'll prepare your comprehensive bankruptcy petition:</p>
      <ul>
        <li>Complete inventory of assets and exemption planning to protect your property</li>
        <li>Detailed analysis of your income and expenses</li>
        <li>Full disclosure of certain financial transactions to avoid bankruptcy fraud</li>
        <li>Calculation of your eligibility for a Chapter 7 case (necessary even in Chapter 13 cases)</li>
      </ul>
    `
  },
  {
    type: 'content',
    info: 'Petition Review and Filing',
    content: `
      <p>Before filing, we'll thoroughly review your petition with you:</p>
      <ul>
        <li>We'll explain each section of the bankruptcy petition</li>
        <li>You'll have the opportunity to ask questions and provide clarifications</li>
        <li>Once you're comfortable with the petition, we'll file it electronically with the bankruptcy court</li>
        <li>The automatic stay goes into effect immediately upon filing, stopping creditor actions</li>
      </ul>
    `
  },
  {
    type: 'content',
    info: '341 Meeting of Creditors',
    content: `
      <p>Approximately 30-45 days after filing, you'll attend the 341 Meeting of Creditors:</p>
      <ul>
        <li>We'll prepare you for this meeting in advance, we aim for no surprises</li>
        <li>Your attorney will attend with you for support and representation</li>
        <li>The trustee will ask you questions about your petition under oath</li>
        <li>Creditors may attend but rarely do</li>
        <li>Most meetings last less than 10 minutes</li>
      </ul>
    `
  },
  {
    type: 'content',
    info: 'Discharge and Fresh Start',
    content: `
      <p>The final step in your bankruptcy journey:</p>
      <ul>
        <li>In Chapter 7, discharge issues automatically from the court roughly 60 days after the 341 creditors' meeting</li>
        <li>In Chapter 13, we apply for a discharge order after completion of your repayment plan</li>
        <li>Our team remains available for questions about your bankruptcy</li>
        <li>We can help deal with creditors or fraudsters who haven't gotten the memo about your fresh start</li>
      </ul>
    `
  }
]

// Bankruptcy options
const bankruptcyOptions = [
  {
    title: 'Chapter 7 Bankruptcy',
    description: `Often called "straight bankruptcy," Chapter 7 provides debt relief through liquidation:`,
    features: [
      { text: `Eliminate most unsecured debts in approximately 3-4 months` },
      { text: `Keep exempt property while discharging eligible debts` },
      { text: `Escape from overly expensive rent-to-own contracts, time-shares, or loans on cars you no longer want` },
      { text: `Ideal for those with primarily unsecured debt and limited disposable income` },
      { text: `Must qualify through the means test based on income and household size` }
    ]
  },
  {
    title: 'Chapter 13 Bankruptcy',
    description: `A reorganization bankruptcy that creates an affordable payment plan based on your budget:`,
    features: [
      { text: `Create a 3-5 year repayment plan based on your disposable income` },
      { text: `Catch up on mortgage or car payments to avoid foreclosure or repossession` },
      { text: `Protect assets that can't be protected by an exemption in a Chapter 7` },
      { text: `Often pay just a portion of unsecured debts while still receiving a discharge` },
      { text: `Receive debt forgiveness (discharge) upon completion of your payment plan` }
    ]
  },
  {
    title: 'Means Test Analysis',
    description: `Not sure if you qualify for Chapter 7? We can help:`,
    features: [
      { text: `Comprehensive analysis of your income compared to Colorado median income` },
      { text: `Detailed review of allowable expenses and deductions` },
      { text: `Strategic planning to maximize your chances of Chapter 7 qualification` },
      { text: `Clear explanation of your options based on means test results` }
    ]
  },
  {
    title: 'Non-Bankruptcy Alternatives',
    description: `Sometimes bankruptcy isn't the best solution. We'll give you honest anlysis and advice based on your specific situation.:`,
    features: [
      { text: `Debt settlement negotiations with creditors` },
      { text: `Debt management plans through credit counseling` },
      { text: `Strategic default and statute of limitations planning` }
    ]
  }
]

// FAQ items
const bankruptcyFaqs = [
  {
    question: 'How much does bankruptcy cost?',
    answer: `Our bankruptcy services are offered at competitive flat rates. Chapter 7 bankruptcy typically costs between $1,725-$2,500, including the court filing fee. Chapter 13 bankruptcy in Colorado starts at $4,813 including the court filing fee. We typically ask you to pay $1,700 upfront and the remainder through your repayment plan. Chapter 13's are inherently more complicated, though, so our flat-fee pricing may differ depending on what we need to do for your situation. We offer very flexible payment plans to make our services accessible. During your free consultation, we'll provide a clear quote based on your specific situation.`
  },
  {
    question: `Will I lose my property if I file bankruptcy?`,
    answer: `Most bankruptcy filers keep all or most of their property. Colorado bankruptcy exemptions protect many types of assets, including equity in your home (up to certain limits), vehicles, retirement accounts, household goods, and personal belongings. We created a reference to the exemptions at <a href="https://coloradobankruptcyexemptions.com">https://coloradobankruptcyexemptions.com</a>. During your consultation, we'll review your assets and explain which exemptions apply to your situation. If you have non-exempt assets, we\'ll discuss strategies to protect them or explore Chapter 13 as an alternative.`
  },
  {
    question: 'How long does bankruptcy stay on my credit report?',
    answer: `Bankruptcy appears in two distinct places on your credit report. First, as a public record (visible for 10 years), and second, on individual accounts marked as "discharged in bankruptcy" (visible for 7 years from the original delinquency date). Importantly, credit scoring models like FICO don't factor public records into your score calculation. The discharged accounts begin aging immediately after filing, which is why many of our clients see dramatic credit score improvements—typically 100+ points within the first year. Our clients often begin receiving credit card and auto loan offers within weeks of filing their Chapter 7 case. However, we strongly discourage accepting these early offers, as they typically come with unfavorable terms. By waiting until your score improves further, you can qualify for much better interest rates and avoid replacing old debt problems with new ones.`
  },
  {
    question: `Can I get fired by my employer if I file bankruptcy?`,
    answer: `No, federal law specifically protects you from being fired solely because you filed for bankruptcy. The U.S. Bankruptcy Code (11 U.S.C. § 525) prohibits both government and private employers from terminating your employment based on your bankruptcy status. This same protection extends to hiring decisions by government employers, though private employers retain more discretion in the hiring process. While your employer might learn about your bankruptcy—especially if you have wage garnishments that suddenly stop—they cannot legally use this as grounds for termination. If you're concerned about your employer's reaction, we can discuss specific strategies to minimize workplace impacts during your bankruptcy consultation.`
  },
  {
    question: `What debts cannot be discharged in bankruptcy?`,
    answer: `Certain debts are typically not dischargeable in bankruptcy, including: recent income taxes (generally those less than 3 years old), student loans (except in rare hardship cases), child support and alimony, court-ordered fines or restitution, and debts incurred through fraud or recent luxury purchases. During your consultation, we\'ll review your specific debts and discuss which ones can likely be discharged through bankruptcy.`
  },
  {
    question: `How soon can I rebuild my credit after bankruptcy?`,
    answer: `Credit rebuilding can begin immediately after your bankruptcy discharge. We recommend starting with a secured credit card to pay regular bills, and paying each month's balance in full. There are nuances to making this cash-flow neutral, so talk to us about this works. Many clients see significant credit score improvements within 12-18 months using responsible credit practices. Some clients qualify for car loans immediately after discharge and for mortgages within 2-4 years, depending on their overall financial situation and down payment ability.`
  }
]

// Set up SEO after FAQ data is defined
useHead(useSeo({
  title: 'Bankruptcy Attorney Fort Collins | Chapter 7 & 13 Colorado | Owen Hathaway',
  description: 'Experienced bankruptcy attorney serving Fort Collins and Northern Colorado. Stop creditor harassment, eliminate debt, and get a fresh start with Chapter 7 or Chapter 13 bankruptcy. Free consultation.',
  keywords: seo.localKeywords.bankruptcy + ', Fort Collins bankruptcy lawyer, Colorado debt relief, bankruptcy protection Northern Colorado, stop foreclosure Fort Collins',
  structuredData: [
    {
      '@type': 'LegalService',
      'serviceType': 'Bankruptcy Law',
      'areaServed': seo.serviceAreas,
      'hasOfferCatalog': {
        '@type': 'OfferCatalog', 
        'name': 'Bankruptcy Services',
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Chapter 7 Bankruptcy',
              'description': 'Liquidation bankruptcy for individuals and families in Colorado'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Chapter 13 Bankruptcy', 
              'description': 'Reorganization bankruptcy with payment plans for Colorado residents'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Debt Relief Consultation',
              'description': 'Free bankruptcy consultation and debt analysis in Fort Collins'
            }
          }
        ]
      }
    },
    {
      '@type': 'FAQPage',
      'mainEntity': bankruptcyFaqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer.replace(/<[^>]*>/g, '').trim() // Strip HTML for schema
        }
      }))
    }
  ]
}))
</script>