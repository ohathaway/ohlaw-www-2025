<template>
  <main>
    <!-- Hero Section -->
    <ServicesHero
      title="Effective Estate Planning At<br />Affordable and Transparent Pricing"
      subtitle="Options designed to fit your needs and budget"
      buttonText="Schedule Your Free Consultation"
      :button-link="link"
      backgroundImage="/img/estatenotebook_1024.webp"
    />

    <!-- Introduction Section -->
    <section class="py-16 bg-slate-50">
      <div class="container w-6xl mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl font-semibold mb-6 text-primary-700">An Investment in Your Family's Future</h2>
            <p class="text-slate-600 mb-4">As you consider estate planning, you're likely wondering about costs. We believe in complete transparency, which is why we've designed three clear pricing tiers based on your specific needs.</p>
            <p class="text-slate-600 mb-4">We don't believe in one-size-fits-all solutions or hidden fees. Our approach puts you in control by allowing you to choose the level of service that works best for your family and budget.</p>
            <p class="text-slate-600">All of our plans are designed with one goal in mind: creating an estate plan that actually works when your family needs it most.</p>
          </div>
          <div>
            <NuxtImg
              src="/img/affordable_and_effective_top_only.webp"
              alt="Intersection of Affordability and Effectiveness"
              width="500"
              height="300"
              class="rounded-lg shadow-md w-full"
              provider="cloudflare"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Why Quality Matters Section -->
    <section class="py-16 bg-slate-200">
      <div class="container w-6xl mx-auto px-4">
        <h2 class="text-3xl font-semibold text-center mb-6 relative inline-block w-full">
          Why Quality Matters in Estate Planning
          <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500"></span>
        </h2>
        <p class="text-center text-xl text-slate-600 mb-2">The true cost of an estate plan isn't what you pay today—it's what your family pays later if your plan fails.</p>
        <p class="text-center text-slate-600 mb-8">Don't believe us?</p>
        
        <div class="text-center mb-12">
          <NuxtLink 
            to="/blog/5-reasons-why-shopping-for-the-cheapest-estate-plan-could-leave-your-family-with-an-unintended-mess" 
            class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md inline-block transition-colors duration-300"
            target="_blank"
          >
            Read More About The Risks of Budget Estate Planning
          </NuxtLink>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-slate-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div class="p-8 text-center h-full flex flex-col">
              <div class="text-6xl mb-6 text-amber-500">
                <i class="pi pi-question-circle"></i>
              </div>
              <h3 class="text-xl font-semibold mb-4 text-primary-700">The Problem</h3>
              <p class="text-slate-600 flex-grow">Most estate plans fail. Even expensive plans from prestigious firms often don't achieve what clients intended. This happens not because lawyers write poor documents, but because life changes over time and plans aren't maintained.</p>
            </div>
          </div>
          <div class="bg-slate-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div class="p-8 text-center h-full flex flex-col">
              <div class="text-6xl mb-6 text-red-500">
                <i class="pi pi-exclamation-triangle"></i>
              </div>
              <h3 class="text-xl font-semibold mb-4 text-primary-700">The Risk</h3>
              <p class="text-slate-600 flex-grow">Choosing the lowest cost option, like online forms or an attorney who quotes prices without proper discovery, virtually guarantees your plan will fail when your family needs it most. The consequences can be costly probate proceedings, family conflicts, and lost assets.</p>
            </div>
          </div>
          <div class="bg-slate-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div class="p-8 text-center h-full flex flex-col">
              <div class="text-6xl mb-6 text-emerald-500">
                <i class="pi pi-verified"></i>
              </div>
              <h3 class="text-xl font-semibold mb-4 text-primary-700">Our Solution</h3>
              <p class="text-slate-600 flex-grow">We build plans that actually work. We're not the cheapest option (nor necessarily the most expensive). Instead, we offer tiered pricing based on your needs, comprehensive education, and ongoing support to ensure your plan remains effective.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Plans Section -->
    <section class="py-16 bg-slate-50">
      <div class="container w-6xl mx-auto px-4">
        <h2 class="text-3xl font-semibold text-center mb-6 relative inline-block w-full">
          Choose the Right Plan for Your Family
          <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500"></span>
        </h2>
        <p class="text-center text-slate-600 mb-12 max-w-4xl mx-auto">We put you in control of what you pay by offering three comprehensive programs, each with options for further customization based on your specific needs. Not sure which is right for you? We provide a <NuxtLink :to="link" class="text-primary-600 hover:text-primary-700 underline">no-obligation education session</NuxtLink> called the Life and Legacy Planning Session to help you decide.</p>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <!-- Will-Based Plan -->
          <div class="bg-slate-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div class="bg-slate-200 text-center py-4">
              <h3 class="text-xl font-semibold text-primary-700">Will-Based Plan</h3>
            </div>
            <div class="p-6">
              <div class="text-center mb-6">
                <span class="text-3xl font-bold text-primary-700">$1,500-$3,500</span>
              </div>
              <h4 class="font-semibold mb-3 text-primary-700">Ideal For:</h4>
              <ul class="space-y-2 mb-6">
                <li class="flex items-start">
                  <i class="pi pi-check text-primary-600 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-slate-600">Families with minor children who need guardianship provisions</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check text-primary-600 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-slate-600">Individuals concerned about healthcare decision-making</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check text-primary-600 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-slate-600">Those with straightforward assets who want essential protection</span>
                </li>
              </ul>
              <h4 class="font-semibold mb-3 text-primary-700">This Plan Includes:</h4>
              <ul class="space-y-2 mb-6">
                <li class="flex items-start">
                  <i class="pi pi-check text-primary-600 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-slate-600">Last Will and Testament</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check text-primary-600 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-slate-600">Healthcare Power of Attorney and Living Will</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check text-primary-600 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-slate-600">General Durable Power of Attorney</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check text-primary-600 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-slate-600">HIPAA Authorizations</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check text-primary-600 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-slate-600">Kids Protection Plan (if applicable)</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check text-primary-600 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-slate-600">May include post-death trust planning</span>
                </li>
              </ul>
            </div>
            <div class="p-6 pt-0">
              <NuxtLink 
                :to="link" 
                class="w-full bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white px-6 py-3 rounded-md text-center block transition-all duration-300"
              >
                Get Started
              </NuxtLink>
            </div>
          </div>

          <!-- Trust Plan -->
          <div class="bg-primary-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div class="bg-primary-700 text-center py-4">
              <h3 class="text-xl font-semibold text-white">Trust Plan</h3>
            </div>
            <div class="p-6">
              <div class="text-center mb-6">
                <span class="text-3xl font-bold text-white">$3,500-$5,000</span>
              </div>
              <h4 class="font-semibold mb-3 text-white">Ideal For:</h4>
              <ul class="space-y-2 mb-6">
                <li class="flex items-start">
                  <i class="pi pi-check text-amber-300 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-white">Real estate owners seeking to avoid probate</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check text-amber-300 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-white">Those wanting privacy in wealth transfer</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check text-amber-300 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-white">Families willing to implement their plan with guidance</span>
                </li>
              </ul>
              <h4 class="font-semibold mb-3 text-white">This Plan Includes:</h4>
              <ul class="space-y-2 mb-6">
                <li class="flex items-start">
                  <i class="pi pi-check text-amber-300 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-white">Revocable Living Trust</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check text-amber-300 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-white">Pour-Over Will</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check text-amber-300 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-white">All Core Documents (POAs, Healthcare Directives)</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check text-amber-300 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-white">Asset Transfer Guidance</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check text-amber-300 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-white">Optional Beneficiary Protection Provisions</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check text-amber-300 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-white">Kids Protection Plan (if applicable)</span>
                </li>
              </ul>
            </div>
            <div class="p-6 pt-0">
              <NuxtLink 
                :to="link" 
                class="w-full bg-white text-primary-600 hover:bg-slate-100 px-6 py-3 rounded-md text-center block transition-all duration-300 font-semibold"
              >
                Get Started
              </NuxtLink>
            </div>
          </div>

          <!-- Wealth Plan -->
          <div class="bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div class="bg-slate-900 text-center py-4 rounded-t-lg">
              <h3 class="text-xl font-semibold text-white">Wealth Plan</h3>
            </div>
            <div class="p-6">
              <div class="text-center mb-6">
                <span class="text-3xl font-bold text-white">$5,000-$7,000</span>
              </div>
              <h4 class="font-semibold mb-3 text-white">Ideal For:</h4>
              <ul class="space-y-2 mb-6">
                <li class="flex items-start">
                  <i class="pi pi-check text-amber-300 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-slate-200">Busy professionals with complex assets</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check text-amber-300 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-slate-200">Those wanting maximum convenience</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check text-amber-300 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-slate-200">Families seeking complete professional support</span>
                </li>
              </ul>
              <h4 class="font-semibold mb-3 text-white">This Plan Includes:</h4>
              <ul class="space-y-2 mb-6">
                <li class="flex items-start">
                  <i class="pi pi-check text-amber-300 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-slate-200">All Trust Plan Components</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check text-amber-300 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-slate-200">Complete Asset Transfer Service</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check text-amber-300 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-slate-200">Family Wealth Inventory</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check text-amber-300 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-slate-200">Preparation of All Transfer Documents</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check text-amber-300 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-slate-200">Beneficiary Designation Updates</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check text-amber-300 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-slate-200">Premium Support and Guidance</span>
                </li>
              </ul>
            </div>
            <div class="p-6 pt-0">
              <NuxtLink 
                :to="link" 
                class="w-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-slate-800 px-6 py-3 rounded-md text-center block transition-all duration-300"
              >
                Get Started
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Always Documents Section -->
    <section class="py-16 bg-slate-200">
      <div class="container w-6xl mx-auto px-4">
        <h2 class="text-3xl font-semibold text-center mb-6 relative inline-block w-full">
          Always Documents Package
          <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500"></span>
        </h2>
        <p class="text-center text-slate-600 mb-12 max-w-4xl mx-auto">If you aren't ready to dive all the way into estate planning yet, you might consider our Always Documents package. We credit the cost of this package toward your full estate planning package once you're ready to do that work.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div class="bg-slate-50 rounded-lg shadow-md">
            <div class="p-8">
              <h3 class="text-2xl font-bold text-primary-700 mb-4">$600</h3>
              <p class="text-lg text-slate-600 mb-6">Essential documents included in EVERY plan</p>
              <ul class="space-y-3 mb-6">
                <li class="flex items-start">
                  <i class="pi pi-check text-primary-600 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-slate-600">Healthcare Power of Attorney</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check text-primary-600 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-slate-600">Living Will (if desired)</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check text-primary-600 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-slate-600">HIPAA Authorizations</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check text-primary-600 mt-1 mr-3 flex-shrink-0"></i>
                  <span class="text-slate-600">General Durable Power of Attorney</span>
                </li>
              </ul>
              <p class="text-sm text-slate-500 italic">While you may have existing versions of these documents, we review them to ensure they are current and align with your wishes. We only create new versions if needed.</p>
            </div>
          </div>
          <div class="space-y-6">
            <h3 class="text-xl font-semibold text-primary-700">Why These Documents Matter</h3>
            <p class="text-slate-600">These four essential documents form the foundation of every estate plan we create. I call them the "Always Documents" because I firmly believe every adult should have them in place.</p>
            <p class="text-slate-600">Without these crucial documents, your family might face expensive and stressful court proceedings to gain the authority to help you when you need it most.</p>
            <p class="text-slate-600">The "Always Documents" aren't just paperwork - they're peace of mind for you and your loved ones.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Add-On Services -->
    <section class="py-16 bg-slate-50">
      <div class="container w-6xl mx-auto px-4">
        <h2 class="text-3xl font-semibold text-center mb-6 relative inline-block w-full">
          Optional Add-On Services
          <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500"></span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-slate-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-4 text-primary-700">Enhanced Protection</h3>
              <ul class="space-y-3">
                <li class="text-slate-600"><strong>Lifetime Asset Protection Trust</strong> for beneficiaries: $1,000</li>
                <li class="text-slate-600"><strong>Concierge Asset Transfer Service</strong>: $500-$1,000 (based on asset complexity)</li>
                <li class="text-slate-600"><strong>Advanced Tax Planning Provisions</strong>: Custom pricing based on needs</li>
                <li class="text-slate-600"><strong>Special Needs Planning</strong>: Custom pricing based on complexity</li>
              </ul>
            </div>
          </div>
          <div class="bg-slate-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-4 text-primary-700">Review Services</h3>
              <ul class="space-y-3">
                <li class="text-slate-600">
                  <strong>Comprehensive 90-point review</strong>: $200
                  <ul class="ml-4 mt-2 space-y-1 text-sm">
                    <li>Available for all clients</li>
                    <li>Includes plan update recommendations</li>
                    <li>Opportunity for service upgrades</li>
                  </ul>
                </li>
                <li class="text-slate-600"><strong>Three-year review</strong>: Complimentary</li>
                <li class="text-slate-600"><strong>Brief questions/updates</strong>: No charge</li>
              </ul>
            </div>
          </div>
          <div class="bg-slate-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-4 text-primary-700">Rush Services</h3>
              <ul class="space-y-3">
                <li class="text-slate-600">Available for <i>Always Documents</i>, <i>Simple Wills</i>, and <i>Kids Protection Plans</i> only: <strong>$500 (single) / $750 (married)</strong></li>
                <li class="text-slate-600">48-72 hour turnaround</li>
                <li class="text-slate-600">Not available for full estate plans</li>
              </ul>
              <p class="mt-4 text-slate-600">Regular service timeline: 3-4 weeks from engagement to signing</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Special Situations -->
    <section class="py-16 bg-slate-200">
      <div class="container w-6xl mx-auto px-4">
        <h2 class="text-3xl font-semibold text-center mb-6 relative inline-block w-full">
          Special Situations
          <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500"></span>
        </h2>
        <p class="text-center text-slate-600 mb-12">Some family situations require specialized planning approaches. We have extensive experience with:</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-slate-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <div class="p-6">
              <i class="pi pi-users text-5xl mb-4 text-primary-600"></i>
              <h3 class="text-lg font-semibold mb-3 text-primary-700">Blended Families</h3>
              <p class="text-slate-600 text-sm">Ensuring all children are protected while honoring current relationships</p>
            </div>
          </div>
          <div class="bg-slate-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <div class="p-6">
              <i class="pi pi-building text-5xl mb-4 text-primary-600"></i>
              <h3 class="text-lg font-semibold mb-3 text-primary-700">Business Owners</h3>
              <p class="text-slate-600 text-sm">Succession planning and business continuation strategies</p>
            </div>
          </div>
          <div class="bg-slate-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <div class="p-6">
              <i class="pi pi-money-bill text-5xl mb-4 text-primary-600"></i>
              <h3 class="text-lg font-semibold mb-3 text-primary-700">High Net Worth</h3>
              <p class="text-slate-600 text-sm">Advanced tax planning and wealth preservation</p>
            </div>
          </div>
          <div class="bg-slate-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <div class="p-6">
              <i class="pi pi-heart text-5xl mb-4 text-primary-600"></i>
              <h3 class="text-lg font-semibold mb-3 text-primary-700">Special Needs</h3>
              <p class="text-slate-600 text-sm">Planning that preserves benefits eligibility while providing support</p>
            </div>
          </div>
        </div>
        <div class="text-center mt-8">
          <p class="text-slate-600">These situations typically require specialized consultation. Contact us to discuss your specific needs.</p>
        </div>
      </div>
    </section>

    <!-- Service Standards -->
    <HomePFL />

    <!-- Call to Action -->
    <ServicesCta
      title="Ready to Secure Your Family's Future?"
      description="Schedule your free Life and Legacy Planning Session today to discuss which plan is right for you."
      buttonText="Schedule Your Free Consultation"
      :button-link="link"
    />
  </main>
</template>

<script setup>
// Get the scheduling link from app config
const { schedulingLinks: { estatePlanEducation: link } } = useAppConfig()

// SEO metadata with enhanced local targeting
const { seo } = useAppConfig()

useHead(useSeo({
  title: 'Estate Planning Pricing Fort Collins | Transparent Legal Fees | Owen Hathaway',
  description: 'Transparent estate planning pricing for Fort Collins families. Will-based plans, trust plans, and wealth plans starting at $600. No hidden fees, fixed-rate pricing for Colorado estate planning.',
  keywords: seo.localKeywords.estate + ', estate planning costs Fort Collins, estate planning pricing Colorado, will preparation costs, trust pricing Northern Colorado, transparent legal fees',
  structuredData: {
    '@type': 'LegalService',
    'serviceType': 'Estate Planning',
    'areaServed': seo.serviceAreas,
    'offers': [
      {
        '@type': 'Offer',
        'name': 'Always Documents Package',
        'price': '$600',
        'description': 'Essential estate planning documents including healthcare power of attorney, living will, HIPAA authorizations, and general durable power of attorney'
      },
      {
        '@type': 'Offer',
        'name': 'Will-Based Plan',
        'priceRange': '$1,500-$3,500',
        'description': 'Comprehensive will-based estate planning including last will and testament, healthcare directives, and guardian designations'
      },
      {
        '@type': 'Offer',
        'name': 'Trust Plan',
        'priceRange': '$3,500-$5,000',
        'description': 'Revocable living trust planning to avoid probate with complete estate planning documentation'
      },
      {
        '@type': 'Offer',
        'name': 'Wealth Plan',
        'priceRange': '$5,000-$7,000',
        'description': 'Comprehensive estate planning with complete asset transfer service and premium support'
      }
    ]
  }
}))
</script>