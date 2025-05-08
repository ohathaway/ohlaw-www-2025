<template>
  <div class="booking-landing">
    <!-- Hero Section -->
    <section :style="backgroundStyleHero" class="relative py-12 bg-primary-700 md:py-16 text-center text-white">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ pageContent.title }}</h1>
        <p class="text-xl opacity-90">{{ pageContent.subtitle }}</p>
      </div>
    </section>

    <!-- Thank You Message -->
    <section class="py-12 bg-slate-100">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-2xl md:text-3xl font-semibold mb-4">Your Appointment is Confirmed</h2>
          <p class="text-xl mb-4">Thank you for scheduling with OH Law.</p>
          <p class="text-slate-700">
            If you scheduled your appointment from our website, you should receive a confirmation email shortly with details about your
            <br />{{ appointmentTypeLabel }} appointment.
          </p>
        </div>
        
        <div v-if="appointmentType === 'estate-plan-education'" class="mt-10 max-w-3xl mx-auto text-center">
          <h3 class="text-xl font-semibold mb-8">In the meantime...</h3>
          <p class="mb-6">We need you to do some homework.</p>
          
          <div class="flex justify-center gap-8 mb-6">
            <a class="flex flex-col items-center px-8 py-4 border border-primary-500 rounded-md hover:bg-primary-50 transition-colors" 
               href="https://app.lawmatics.com/forms/share/d57bebf9-6e6b-4966-b019-bb97036f8594" 
               target="_blank">
              <i class="pi pi-desktop text-5xl mb-2 text-primary-600"></i>
              <span>Online Form</span>
            </a>
            <a class="flex flex-col items-center px-8 py-4 border border-primary-500 rounded-md hover:bg-primary-50 transition-colors" 
               href="https://downloads.ohlawcolorado.com/Life-and-Legacy-Assessment-and-Inventory-v2.pdf" 
               download="Life-and-Legacy-Assessment-and-Inventory-v2.pdf">
              <i class="pi pi-file-pdf text-5xl mb-2 text-primary-600"></i>
              <span>PDF Download</span>
            </a>
          </div>
          
          <p class="text-lg">
            Our work together will be <u>much</u> more productive if you can have this back to us at least 1 week before our session. 
            We're happy to reschedule if you need more time.
          </p>
        </div>
      </div>
    </section>

    <!-- What to Expect -->
    <section class="py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 class="text-2xl md:text-3xl font-semibold mb-6 relative pb-4 text-center lg:text-left">
              What to Expect
              <span class="absolute bottom-0 left-1/2 lg:left-0 w-16 h-1 bg-primary-500 transform -translate-x-1/2 lg:translate-x-0"></span>
            </h2>
            
            <div v-if="pageContent.expectationsList" class="mt-8">
              <ul class="space-y-4">
                <li v-for="(item, index) in pageContent.expectationsList" :key="index" class="flex items-start">
                  <i class="pi pi-check-circle text-green-500 mr-3 mt-1"></i>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
            <div v-else class="mt-8">
              <p v-for="(para, index) in pageContent.expectations" :key="index" class="mb-4">
                {{ para }}
              </p>
            </div>
          </div>
          
          <div class="flex justify-center items-center">
            <div class="relative w-full max-w-lg overflow-hidden rounded-lg shadow-lg">
              <img 
                :src="pageContent.image" 
                :alt="pageContent.imageAlt || 'Appointment Preparation'"
                class="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- What to Bring -->
    <section class="py-12 bg-slate-100" v-if="pageContent.preparations">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-semibold mb-2 text-center relative pb-4">
          How to Prepare
          <span class="absolute bottom-0 left-1/2 w-16 h-1 bg-primary-500 transform -translate-x-1/2"></span>
        </h2>
        <h4 class="text-xl text-center italic mb-10">Do The Homework</h4>
        
        <div class="max-w-5xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="(prep, index) in pageContent.preparations" :key="index"
                 class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center">
              <i class="pi text-orange-900" :class="prepIcon(prep.icon)" style="font-size: 3rem"></i>
              <h3 class="text-xl font-semibold my-4">{{ prep.title }}</h3>
              <p class="text-slate-700">{{ prep.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-12" v-if="pageContent.faq && pageContent.faq.length">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-semibold mb-10 text-center relative pb-4">
          Frequently Asked Questions
          <span class="absolute bottom-0 left-1/2 w-16 h-1 bg-primary-500 transform -translate-x-1/2"></span>
        </h2>
        
        <div class="max-w-3xl mx-auto">
          <FaqAccordion :faqItems="pageContent.faq" />
        </div>
      </div>
    </section>

    <!-- Next Steps CTA -->
    <section class="py-12 text-center bg-primary-50">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-semibold mb-4">{{ pageContent.ctaHeading || 'Next Steps' }}</h2>
        <p class="text-xl max-w-3xl mx-auto mb-8">{{ pageContent.ctaText }}</p>
        
        <div class="flex flex-wrap justify-center gap-4">
          <NuxtLink v-if="pageContent.ctaButton" 
                :to="pageContent.ctaButton.url" 
                class="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium">
            {{ pageContent.ctaButton.text }}
          </NuxtLink>
          
          <NuxtLink v-if="pageContent.ctaSecondaryButton" 
                :to="pageContent.ctaSecondaryButton.url" 
                class="px-6 py-3 border border-primary-600 text-primary-600 rounded-md hover:bg-primary-50 transition-colors font-medium">
            {{ pageContent.ctaSecondaryButton.text }}
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const appointmentType = ref('')
const appointmentData = ref({})

const backgroundStyleHero = computed(() => {
  // if (!pageContent.value.image) return {}
  
  return {
    backgroundImage: `linear-gradient(rgba(38, 70, 124, 0.85), rgba(27, 53, 97, 0.9)), url('${pageContent.value.image}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
})

// Map appointment types to human-readable labels
const appointmentLabels = {
  'check-in': 'Check-In',
  'estate-plan-checkup': 'Estate Plan Checkup',
  'estate-plan-education': 'Life & Legacy Plan Education',
  'estate-plan-design': 'Life & Legacy Plan Design',
  'estate-plan-signing': 'Life & Legacy Plan Signing',
  'estate-plan-delivery': 'Life & Legacy Plan Delivery',
  'new-client': 'New Client Consultation',
  'new-bankruptcy-client': 'New Bankruptcy Client Consultation',
  'new-business-client': 'New Business Client Consultation',
  'new-nonprofit-client': 'New Nonprofit Consultation',
  'petition-review-in-person': 'Bankruptcy Petition Review (In-Person)',
  'petition-review-remote': 'Bankruptcy Petition Review (Remote)',
  'gun-trust': 'Gun Trust Consultation'
}

// Determine appointment type from route query parameters
onMounted(() => {
  appointmentType.value = route.query.type || 'new-client'
  
  // Extract any additional data from query params
  const queryParams = { ...route.query }
  delete queryParams.type // Remove the type since we already processed it
  appointmentData.value = queryParams
})

// Convert Bootstrap icons to PrimeIcons
const prepIcon = (bootstrapIcon) => {
  const iconMap = {
    'bi-file-earmark-text': 'pi-file',
    'bi-list-check': 'pi-list',
    'bi-question-circle': 'pi-question-circle',
    'bi-people': 'pi-users',
    'bi-currency-dollar': 'pi-dollar',
    'bi-heart': 'pi-heart',
    'bi-wallet2': 'pi-wallet',
    'bi-house-door': 'pi-home',
    'bi-building': 'pi-building',
    'bi-credit-card': 'pi-credit-card',
    'bi-pencil-square': 'pi-pencil',
    'bi-laptop': 'pi-desktop',
    'bi-person-square': 'pi-user',
    'bi-cash-coin': 'pi-money-bill',
    'bi-diagram-3': 'pi-sitemap'
  }
  
  return iconMap[bootstrapIcon] || 'pi-check-circle'
}

// Get the human-readable appointment type label
const appointmentTypeLabel = computed(() => {
  return appointmentLabels[appointmentType.value] || 'Consultation'
})

// Content data for different appointment types
const contentData = {
  'check-in': {
    title: 'Your Check In Appointment is Confirmed',
    subtitle: `We're looking forward to catching up with you.`,
    expectations: [
      `If you have any documents that we need to review, please send them either through the portal or by email.`,
      'Check-in appointments typically last 15-30 minutes and are designed to answer any quick questions and basically take stock of the state of your legal foundation.'
    ],
    image: '/img/chair_on_laptop.webp',
    ctaHeading: 'While You Wait',
    ctaText: 'Take a moment to review any questions you might have for your attorney.',
    ctaButton: {
      text: 'Browse our Educational Material',
      url: '/blog'
    }
  },
  'estate-plan-checkup': {
    title: 'Estate Plan Checkup Appointment Confirmed',
    subtitle: 'Let\'s make sure your estate plan is still working for you.',
    expectations: [
      'During your Estate Plan Checkup, we\'ll review your existing documents and discuss any changes in your life, assets, or goals that might require updates to your plan.',
      'This appointment typically lasts 60 minutes and helps ensure your estate plan continues to protect what matters most to you.'
    ],
    preparations: [
      {
        icon: 'bi-file-earmark-text',
        title: 'Bring Documents',
        description: 'Please bring copies of your current estate planning documents.'
      },
      {
        icon: 'bi-list-check',
        title: 'Note Changes',
        description: 'Make a list of any major life changes since your plan was created.'
      },
      {
        icon: 'bi-question-circle',
        title: 'Prepare Questions',
        description: 'Write down any questions or concerns you have about your current plan.'
      }
    ],
    image: '/img/estatenotebook_1024.webp',
    ctaHeading: 'Prepare for Your Appointment',
    ctaText: 'To make the most of your checkup, please review your current estate planning documents before our meeting.',
    ctaButton: {
      text: 'Learn About Estate Planning',
      url: '/services/estate-planning'
    }
  },
  'estate-plan-education': {
    title: 'Life & Legacy Plan Education Session Confirmed',
    subtitle: 'The first step toward protecting your legacy',
    expectationsList: [
      `We\'ll discuss your family situation, assets, and goals to design a customized estate plan`,
      `You\'ll learn about the different estate planning tools available (wills, trusts, powers of attorney, etc.)`,
      `We\'ll outline the process, timeline, and costs for creating your estate plan`,
      `You\'ll have plenty of time to ask questions and get clear answers`,
      `This session typically lasts 60-90 minutes`
    ],
    preparations: [
      {
        icon: 'bi-people',
        title: 'Who You Have',
        description: 'Think about who you have in your life and who should handle your affairs if needed.'
      },
      {
        icon: 'bi-currency-dollar',
        title: 'What You Have',
        description: `Since you've done your homework (you have, haven't you?), we'll have a Family Wealth Inventory prepared to help guide the discussion`
      },
      {
        icon: 'bi-heart',
        title: 'Your Beliefs',
        description: 'Consider what matters most to you in protecting your family and legacy.'
      }
    ],
    image: '/img/estatenotebook_1024.webp',
    /*
    faq: [
      {
        question: 'How much does an estate plan cost?',
        answer: `The purpose of the education session is to equip you to choose your cost. Our base plans range from $2,000 to $5,500, depending on complexity and the tools required. We\'ll provide a clear quote during your design session based on your specific needs and the options you choose.`
      },
      {
        question: 'How long does the process take?',
        answer: `Our process typically takes 4 - 6 weeks from your education session. We'll provide a more specific timeline based on your situation and needs.`
      },
      {
        question: 'Do I need a trust or is a will sufficient?',
        answer: `This depends on your specific circumstances, goals, and assets. During your education session, we'll help you understand the benefits of each option and recommend the best approach for your situation.`
      }
    ],
    */
    ctaHeading: 'Before Your Session',
    ctaText: `We've designed the homework we've assigned you to help you think about your goals and what you want to accomplish with your estate plan. Completing the homework as best you can helps us tailor your experience to your life and dreams. And if you're worried about costs, we promise that you will be in control of your costs. Our process gives you choices on how to balance cost and effectiveness.`,
    ctaButton: {
      text: 'Learn More About Our Process',
      url: '/services/estate-planning#our-process'
    },
    ctaSecondaryButton: {
      text: 'Read About Estate Planning Issues',
      url: '/blog/categories/legacy-planning'
    }
  },
  'new-client': {
    title: 'New Client Consultation Confirmed',
    subtitle: 'We\'re looking forward to meeting you and discussing how we can help.',
    expectations: [
      'During your consultation, we\'ll discuss your legal needs, answer your questions, and provide guidance on potential next steps.',
      'This appointment typically lasts 30-45 minutes and is designed to help us understand your situation and determine the best way forward.'
    ],
    image: '/img/placeholder_1024.webp',
    ctaHeading: 'Prepare for Your Consultation',
    ctaText: 'To make the most of our time together, please take a moment to gather any relevant documents and write down your key questions.',
    ctaButton: {
      text: 'Learn About Our Services',
      url: '/services'
    }
  },
  'new-bankruptcy-client': {
    title: `Bankruptcy Consultation Confirmed`,
    subtitle: `Your first step toward financial freedom and a fresh start`,
    expectationsList: [
      `We'll review your current financial situation and discuss your goals`,
      `You'll learn about bankruptcy options (Chapter 7 vs. Chapter 13) specific to your situation`,
      `We'll assess your debts, assets, income, and expenses to determine eligibility`,
      `You'll understand what property you can keep through exemptions`,
      `We'll outline clear next steps, including costs and timeline`,
      `This consultation typically lasts 30 minutes`
    ],
    preparations: [
      {
        icon: `bi-list-check`,
        title: `List Your Debts`,
        description: `Make a list of all your creditors, including approximate balances and account numbers if available.`
      },
      {
        icon: `bi-wallet2`,
        title: `Income Information`,
        description: `Gather recent pay stubs or documentation of your income sources for the past few months.`
      },
      {
        icon: `bi-house-door`,
        title: `Asset Overview`,
        description: `Make notes about your major assets (home, vehicles, retirement accounts, etc.) and their approximate values.`
      }
    ],
    image: `/img/helpinghand_1024.webp`,
    faq: [
      {
        question: `Do I need to bring documents to my initial consultation?`,
        answer: `While not required for the initial consultation, having a general list of your debts, recent pay stubs, and information about major assets can help us provide more specific guidance. Don't worry if you don't have everything organized yet - we'll help you through the document collection process after your consultation.`
      },
      {
        question: `How much does bankruptcy cost?`,
        answer: `Our bankruptcy services are offered at competitive flat rates. Chapter 7 bankruptcy typically costs between $1,725-$2,500, including the court filing fee. Chapter 13 bankruptcy in Colorado starts at $4,813 including the court filing fee. We offer flexible payment plans to make our services accessible. During your consultation, we'll provide a clear quote based on your specific situation.`
      },
      {
        question: `Will filing bankruptcy stop creditor calls right away?`,
        answer: `Yes, once your bankruptcy petition is filed with the court, the "automatic stay" immediately goes into effect. This legal protection prohibits creditors from contacting you, garnishing wages, repossessing property, or taking any collection actions. Even before filing, we can help you manage creditor communications once you've engaged our services.`
      },
      {
        question: `Am I eligible for bankruptcy?`,
        answer: `Eligibility depends on several factors including your income, household size, debt types, and previous bankruptcy filings. During your consultation, we'll analyze your specific situation to determine which bankruptcy options are available to you. Most people who feel they need bankruptcy relief do qualify for some form of bankruptcy protection.`
      }
    ],
    ctaHeading: `Start Your Journey to Financial Freedom`,
    ctaText: `Complete our intake forms before your appointment to help us provide the most comprehensive guidance for your situation.`,
    ctaButton: {
      text: `Learn More About Bankruptcy`,
      url: `/services/bankruptcy`
   /* },
    ctaSecondaryButton: {
      text: `Bankruptcy FAQ`,
      url: `/services/bankruptcy/about-ch7`
      */
    }
  },
  'new-business-client': {
    title: 'Business Consultation Confirmed',
    subtitle: `We're looking forward to helping you create a solid legal foundation for your business.`,
    expectationsList: [
      `We'll discuss your business structure, goals, and specific legal needs`,
      `You'll learn about entity options and their legal and tax implications`,
      `We'll identify any immediate legal vulnerabilities in your current setup`,
      `You'll get clear next steps and pricing options for your business legal needs`,
      `This consultation typically lasts 45-60 minutes`
    ],
    preparations: [
      {
        icon: 'bi-building',
        title: `Business Details`,
        description: `Prepare a brief overview of your business, including current structure, owners, and goals.`
      },
      {
        icon: 'bi-file-earmark-text',
        title: `Existing Documents`,
        description: `Gather any existing business documents (entity filings, contracts, etc.) you\'d like us to review.`
      },
      {
        icon: 'bi-question-circle',
        title: `Specific Questions`,
        description: `Write down your top business legal questions or concerns to ensure we address them.`
      }
    ],
    image: '/img/business1_1024.webp',
    faq: [
      {
        question: `What should I bring to my business consultation?`,
        answer: `If you have existing business documents such as formation papers, contracts, operating agreements, or partnership documents, please have those available. Also prepare a list of your most pressing legal questions or concerns about your business. Don't worry if you don't have anything formal yet - we can start from scratch too.`
      },
      {
        question: `What will we cover in the initial consultation?`,
        answer: `We'll discuss your business structure, goals, current legal setup, and identify the most important legal needs for your specific situation. We\'ll explain your options for entity formation, key contracts, compliance requirements, and develop a prioritized plan for addressing your business legal needs. You'll leave with a clear understanding of next steps and associated costs.`
      },
      {
        question: `How much will my business legal services cost?`,
        answer: `During our consultation, we'll provide transparent pricing for the specific services your business needs. We typically offer flat-fee packages for common services like entity formation ($800-1,200), operating agreements ($800-1,500), and contract creation ($500-1,000 per contract). We also offer ongoing small business counsel arrangements for predictable legal support costs. You'll always know costs upfront before committing to any services.`
      }
    ],
    ctaHeading: `Prepare for Your Business Consultation`,
    ctaText: `Think about your business goals and specific legal concerns to help us provide the most valuable guidance during our session.`,
    ctaButton: {
      text: 'Learn About Small Business Services',
      url: '/services/small-business'
    },
    ctaSecondaryButton: {
      text: 'Read Our Business Articles',
      url: '/blog/categories/small-business'
    }
  },
  'new-nonprofit-client': {
    title: 'Nonprofit Consultation Confirmed',
    subtitle: 'We\'re looking forward to helping you structure your charitable mission for success',
    expectationsList: [
      `We'll discuss your charitable purpose and mission`,
      `You'll learn about entity options (501c3, B corps, etc.) and their legal implications`,
      `We'll explore sustainable revenue models that align with your charitable purpose`,
      `You'll understand the process and requirements for tax-exempt status`,
      `We'll outline clear next steps and pricing options for your nonprofit legal needs`,
      `This consultation typically lasts 45-60 minutes`
    ],
    preparations: [
      {
        icon: 'bi-heart',
        title: 'Charitable Purpose',
        description: 'Think about how to clearly articulate your charitable purpose in preparation for a form 1023 submission.'
      },
      {
        icon: 'bi-cash-coin',
        title: 'Revenue Model',
        description: 'Consider your revenue model and how it aligns with your charitable purpose to ensure you have margin with which to accomplish your mission.'
      },
      {
        icon: 'bi-diagram-3',
        title: 'Organizational Structure',
        description: 'Think about potential board members and how you envision your organization\'s governance structure.'
      }
    ],
    image: '/img/dotorgtablet_1024.webp',
    faq: [
      {
        question: 'Do I really need to form a nonprofit or are there alternatives?',
        answer: 'Not every charitable mission requires a standalone nonprofit. During our consultation, we\'ll explore various options including fiscal sponsorship, donor-advised funds, B corporations, or partnering with existing organizations. We\'ll help you determine which structure best supports your specific mission and goals.'
      },
      {
        question: 'How much does it cost to form a nonprofit?',
        answer: 'Our nonprofit formation services typically range from $1,000-$3,000 depending on complexity, plus state filing fees ($50 as of 2025), plus IRS filing fees ($275-$600). This includes formation documents, bylaws, initial board resolutions, and guidance on the 501(c)(3) application process. We\'ll provide a clear quote during your consultation based on your specific needs.'
      },
      {
        question: 'How long does it take to get 501(c)(3) status?',
        answer: 'The complete process typically takes 3-9 months. State incorporation usually takes 1-2 weeks, while IRS 501(c)(3) determination can take 3-9 months depending on application completeness and IRS backlog. We\'ll help you understand the timeline and what you can and cannot do while waiting for IRS approval.'
      }
    ],
    ctaHeading: 'Prepare for Your Nonprofit Consultation',
    ctaText: 'Think about your charitable mission and how you envision making a sustainable impact in your community.',
    ctaButton: {
      text: 'Learn About Our Nonprofit Services',
      url: '/services/nonprofits'
    }
  },
    'petition-review-in-person': {
    title: 'Bankruptcy Petition Review Confirmed',
    subtitle: `We're ready to review your bankruptcy petition in person`,
    expectationsList: [
      'We\'ll go through your bankruptcy petition line by line to ensure accuracy',
      'We\'ll explain what to expect at your 341 meeting with creditors',
      'You\'ll have the opportunity to ask any questions about the bankruptcy process',
      'You\'ll leave with a clear understanding of next steps',
      'This appointment typically lasts 60-90 minutes'
    ],
    preparations: [
      {
        icon: 'bi-file-earmark-text',
        title: 'Bring Documents',
        description: 'Please bring all financial documents, including your draft petition if you have one.'
      },
      {
        icon: 'bi-credit-card',
        title: 'Recent Statements',
        description: 'Bring recent bank and credit card statements.'
      },
      {
        icon: 'bi-pencil-square',
        title: 'List of Questions',
        description: 'Write down any questions or concerns you have about the bankruptcy process.'
      }
    ],
    image: '/img/helpinghand_1024.webp',
    ctaHeading: 'Prepare for Your Appointment',
    ctaText: 'To make your petition review as productive as possible, please gather all your financial documents before our meeting.',
    ctaButton: {
      text: 'Learn More About Bankruptcy',
      url: '/services/bankruptcy'
    }
  },
  'petition-review-remote': {
    title: 'Remote Bankruptcy Petition Review Confirmed',
    subtitle: 'We\'re ready to review your bankruptcy petition via video conference',
    expectationsList: [
      'We\'ll connect via secure video conference (a link will be emailed to you)',
      'We\'ll go through your bankruptcy petition to ensure accuracy',
      'We\'ll explain what to expect at your 341 meeting with creditors',
      'You\'ll have the opportunity to ask any questions about the bankruptcy process',
      'This appointment typically lasts 60-90 minutes'
    ],
    preparations: [
      {
        icon: 'bi-laptop',
        title: 'Test Your Equipment',
        description: 'Make sure your computer, camera, and microphone are working properly.'
      },
      {
        icon: 'bi-file-earmark-text',
        title: 'Have Documents Ready',
        description: 'Have all your financial documents accessible during the call.'
      },
      {
        icon: 'bi-person-square',
        title: 'Private Location',
        description: 'Find a quiet, private space for our confidential conversation.'
      }
    ],
    image: '/img/helpinghand_1024.webp',
    ctaHeading: 'Prepare for Your Virtual Appointment',
    ctaText: 'Check your email for the video conference link and test your equipment before our meeting.',
    ctaButton: {
      text: 'Learn More About Bankruptcy',
      url: '/services/bankruptcy'
    }
  },
  'gun-trust': {
    title: 'Gun Trust Consultation Confirmed',
    subtitle: 'Protecting your firearms legacy the legal way',
    expectationsList: [
      'We\'ll discuss your specific firearms collection and your goals for protection and transfer',
      'You\'ll learn about the benefits of a gun trust and how it differs from standard trusts',
      'We\'ll explain how a gun trust can help prevent "accidental felonies" and ensure legal compliance',
      'You\'ll understand the process for creating and implementing your gun trust',
      'This consultation typically lasts 45-60 minutes'
    ],
    preparations: [
      {
        icon: 'bi-list-check',
        title: 'Inventory Overview',
        description: 'Have a general idea of your firearms collection (no need for serial numbers yet).'
      },
      {
        icon: 'bi-people',
        title: 'Consider Trustees',
        description: 'Think about who you might want to include as trustees who can use your firearms.'
      },
      {
        icon: 'bi-question-circle',
        title: 'Prepare Questions',
        description: 'Write down any specific questions you have about gun trusts and firearm laws.'
      }
    ],
    image: '/img/gun_trust.webp',
    faq: [
      {
        question: 'Why do I need a specialized gun trust instead of a regular trust?',
        answer: 'A specialized gun trust is designed to comply with federal and state firearm laws, address issues unique to firearm ownership, and help prevent "accidental felonies." It includes provisions for handling NFA items and measures to avoid allowing prohibited persons to possess your firearms.'
      },
      {
        question: 'How much does a gun trust cost?',
        answer: 'Our gun trusts typically cost between $1,000 and $1,500, depending on complexity. We\'ll provide a clear quote during your consultation based on your specific needs and collection.'
      },
      {
        question: 'Can family members use my firearms if they\'re in a trust?',
        answer: 'Yes, properly designated trustees can legally possess and use firearms in the trust, subject to applicable laws. This is one of the key benefits of a gun trust versus individual ownership.'
      }
    ],
    ctaHeading: 'Learn More Before Your Consultation',
    ctaText: 'Explore our gun trust services to get the most out of your upcoming consultation.',
    ctaButton: {
      text: 'Gun Trust Services',
      url: '/services/estate-planning/GunTrusts'
    }
  }
}

// Get content based on appointment type
const pageContent = computed(() => {
  return contentData[appointmentType.value] || contentData['new-client']
})
</script>

<style>
/* No scoped styles needed with Tailwind - all styling is done with utility classes */
</style>