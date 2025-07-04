<template>
  <main>
    <!-- Services Overview -->
    <section id="our-services" class="py-16 bg-slate-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-semibold mb-6 relative inline-block">
            Our Practice Areas
            <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500"></span>
          </h2>
          <p class="text-xl text-slate-600 max-w-3xl mx-auto">
            We focus on four key areas where families and small businesses need the most support. Each service is designed to work together, creating a comprehensive foundation for your success.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
          <!-- Estate Planning -->
          <div class="relative h-96 group overflow-hidden">
            <div 
              class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style="background-image: url('/img/estatenotebook_1024.webp')"
            >
              <div class="absolute inset-0 bg-primary-800 opacity-75 group-hover:opacity-65 transition-opacity duration-300"></div>
            </div>
            <div class="relative h-full p-8 flex flex-col justify-between z-10 text-white">
              <div>
                <h3 class="text-2xl font-semibold mb-4">Estate Planning</h3>
                <p class="mb-6">Protect your legacy and provide peace of mind with comprehensive estate planning that works for real people.</p>
                <ul class="text-sm space-y-1 opacity-90">
                  <li>Wills and Trusts</li>
                  <li>Healthcare Directives</li>
                  <li>Gun Trusts</li>
                  <li>Probate Avoidance</li>
                </ul>
              </div>
              <NuxtLink 
                to="/services/estate-planning" 
                class="text-white hover:text-amber-300 uppercase text-sm tracking-wider border-b border-white hover:border-amber-300 pb-1 w-fit transition-colors duration-300"
              >
                Learn More →
              </NuxtLink>
            </div>
          </div>

          <!-- Small Business -->
          <div class="relative h-96 group overflow-hidden">
            <div 
              class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style="background-image: url('/img/business1_1024.webp')"
            >
              <div class="absolute inset-0 bg-primary-800 opacity-75 group-hover:opacity-65 transition-opacity duration-300"></div>
            </div>
            <div class="relative h-full p-8 flex flex-col justify-between z-10 text-white">
              <div>
                <h3 class="text-2xl font-semibold mb-4">Small Business</h3>
                <p class="mb-6">Legal support that helps entrepreneurs build, grow, and protect their businesses with confidence.</p>
                <ul class="text-sm space-y-1 opacity-90">
                  <li>Business Formation</li>
                  <li>Contracts & Agreements</li>
                  <li>Employment Matters</li>
                  <li>Ongoing Compliance</li>
                </ul>
              </div>
              <NuxtLink 
                to="/services/small-business" 
                class="text-white hover:text-amber-300 uppercase text-sm tracking-wider border-b border-white hover:border-amber-300 pb-1 w-fit transition-colors duration-300"
              >
                Learn More →
              </NuxtLink>
            </div>
          </div>

          <!-- Bankruptcy -->
          <div class="relative h-96 group overflow-hidden">
            <div 
              class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style="background-image: url('/img/helpinghand_1024.webp')"
            >
              <div class="absolute inset-0 bg-primary-800 opacity-75 group-hover:opacity-65 transition-opacity duration-300"></div>
            </div>
            <div class="relative h-full p-8 flex flex-col justify-between z-10 text-white">
              <div>
                <h3 class="text-2xl font-semibold mb-4">Bankruptcy</h3>
                <p class="mb-6">Compassionate bankruptcy services that provide a fresh start and help you regain financial control.</p>
                <ul class="text-sm space-y-1 opacity-90">
                  <li>Chapter 7 & Chapter 13</li>
                  <li>Stop Creditor Harassment</li>
                  <li>Debt Relief Solutions</li>
                  <li>Fresh Start Planning</li>
                </ul>
              </div>
              <NuxtLink 
                to="/services/bankruptcy" 
                class="text-white hover:text-amber-300 uppercase text-sm tracking-wider border-b border-white hover:border-amber-300 pb-1 w-fit transition-colors duration-300"
              >
                Learn More →
              </NuxtLink>
            </div>
          </div>

          <!-- Nonprofits -->
          <div class="relative h-96 group overflow-hidden">
            <div 
              class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style="background-image: url('/img/dotorgtablet_1024.webp')"
            >
              <div class="absolute inset-0 bg-primary-800 opacity-75 group-hover:opacity-65 transition-opacity duration-300"></div>
            </div>
            <div class="relative h-full p-8 flex flex-col justify-between z-10 text-white">
              <div>
                <h3 class="text-2xl font-semibold mb-4">Nonprofits</h3>
                <p class="mb-6">Support your mission with practical legal solutions that build sustainability and maximize impact.</p>
                <ul class="text-sm space-y-1 opacity-90">
                  <li>501(c)(3) Formation</li>
                  <li>Tax Exemption Applications</li>
                  <li>Governance & Compliance</li>
                  <li>Alternative Structures (co-ops, B-corps, etc.)</li>
                </ul>
              </div>
              <NuxtLink 
                to="/services/nonprofits" 
                class="text-white hover:text-amber-300 uppercase text-sm tracking-wider border-b border-white hover:border-amber-300 pb-1 w-fit transition-colors duration-300"
              >
                Learn More →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How We're Different -->
    <section class="py-16 bg-slate-200">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-semibold mb-6 relative inline-block">
            How We're Different
            <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500"></span>
          </h2>
          <p class="text-xl text-slate-600 max-w-3xl mx-auto">
            We offer people a different way to buy legal services that's transparent, affordable, and accessible.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="bg-primary-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 text-4xl">
              <i class="pi pi-wallet text-orange-800"></i>
            </div>
            <h3 class="text-xl font-semibold mb-4">Fixed Fees</h3>
            <p class="text-slate-600">
              Almost everything we do for our clients, we offer at a fixed fee. If we can't offer you a fixed price, we will always commit to a budget set by you.
            </p>
          </div>

          <div class="text-center">
            <div class="bg-primary-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 text-4xl">
              <i class="pi pi-home text-orange-800"></i>
            </div>
            <h3 class="text-xl font-semibold mb-4">We Come To You</h3>
            <p class="text-slate-600">
              We keep our costs down by not maintaining a permanent office. We will even come to your home to meet with you.
            </p>
          </div>

          <div class="text-center">
            <div class="bg-primary-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 text-4xl">
              <i class="pi pi-users text-orange-800"></i>
            </div>
            <h3 class="text-xl font-semibold mb-4">For Everyone</h3>
            <p class="text-slate-600">
              We think this transparency, affordability, and accessibility make our services available to people who may not think they can actually hire a lawyer.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Integrated Approach -->
    <section class="py-16 bg-slate-50">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-semibold mb-6 relative inline-block">
              An Integrated Approach to Your Legal Needs
              <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500"></span>
            </h2>
            <p class="text-xl text-slate-600">
              Our services work together to provide comprehensive protection and support throughout your journey.
            </p>
          </div>

          <div class="bg-orange-50 rounded-lg shadow-md p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 class="text-xl font-semibold mb-4 text-primary-700">From Crisis to Growth</h3>
                <p class="text-slate-600 mb-4">
                  We can help folks in a debt crisis through bankruptcy, then support them as they rebuild with business formation or estate planning services.
                </p>
                <p class="text-slate-600">
                  Special discounts are available when transitioning between services within one year of completing bankruptcy.
                </p>
              </div>

              <div>
                <h3 class="text-xl font-semibold mb-4 text-primary-700">Business and Estate Integration</h3>
                <p class="text-slate-600 mb-4">
                  Business owners need estate planning that accounts for their business interests. We ensure your business succession plan aligns with your family's needs.
                </p>
                <p class="text-slate-600">
                  Our experience in both areas means we can create seamless plans that protect your business legacy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PFL Promise -->
    <HomePFL />

    <!-- Getting Started -->
    <section class="py-16 bg-stone-200">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-semibold mb-6 relative inline-block">
            Ready to Get Started?
            <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500"></span>
          </h2>
          <p class="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Every journey begins with a single step. Schedule a consultation to discuss your needs and learn how we can help.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div class="bg-slate-50 rounded-lg p-6 text-center">
            <h3 class="text-xl font-semibold mb-4">New to Our Services?</h3>
            <p class="text-slate-600 mb-6">
              Schedule a free consultation to explore your options and learn about our approach.
            </p>
            <NuxtLink to="/contact" class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md inline-block transition-colors duration-300">
              Schedule Free Consultation
            </NuxtLink>
          </div>

          <div class="bg-slate-50 rounded-lg p-6 text-center">
            <h3 class="text-xl font-semibold mb-4">Have Questions?</h3>
            <p class="text-slate-600 mb-6">
              Get in touch to discuss your specific situation and how we can help.
            </p>
            <NuxtLink to="/contact" class="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white px-6 py-3 rounded-md inline-block transition-all duration-300">
              Contact Us
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="py-16 bg-gradient-to-r from-primary-700 to-primary-900 text-white text-center">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl font-bold mb-6">Let's Build Something Great Together</h2>
          <p class="text-xl mb-8">
            Whether you're protecting your family's future, growing your business, or overcoming financial challenges, we're here to provide the legal foundation you need to succeed.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <NuxtLink to="/contact" class="bg-white text-primary-700 hover:bg-slate-100 px-8 py-3 rounded-md uppercase text-sm font-medium tracking-wider transition-all duration-300">
              Get Started Today
            </NuxtLink>
            <NuxtLink to="/about" class="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-md uppercase text-sm font-medium tracking-wider transition-all duration-300">
              Learn About Us
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
// SEO metadata with enhanced local targeting
const { seo } = useAppConfig()

useHead(useSeo({
  title: 'Legal Services Fort Collins | Estate Planning, Business Law, Bankruptcy | Owen Hathaway',
  description: 'Comprehensive legal services for families and small businesses in Fort Collins, Colorado. Expert estate planning, business law, bankruptcy, and nonprofit formation with transparent fixed-fee pricing.',
  keywords: `${seo.localKeywords.estate}, ${seo.localKeywords.business}, ${seo.localKeywords.bankruptcy}, ${seo.localKeywords.nonprofit}, Fort Collins legal services, Colorado family law firm`,
  image: seo.defaultImage,
  structuredData: [
    {
      '@type': 'LegalService',
      'serviceType': 'Legal Services',
      'areaServed': seo.serviceAreas,
      'hasOfferCatalog': {
        '@type': 'OfferCatalog',
        'name': 'Comprehensive Legal Services',
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Estate Planning',
              'description': 'Comprehensive estate planning services including wills, trusts, and healthcare directives for Colorado families',
              'url': 'https://ohlawcolorado.com/services/estate-planning'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Small Business Law',
              'description': 'Business formation, contracts, and legal support for Colorado entrepreneurs and small businesses',
              'url': 'https://ohlawcolorado.com/services/small-business'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Bankruptcy Services',
              'description': 'Chapter 7 and Chapter 13 bankruptcy services for debt relief and fresh start solutions in Colorado',
              'url': 'https://ohlawcolorado.com/services/bankruptcy'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Nonprofit Formation',
              'description': '501(c)(3) formation and legal support for nonprofit organizations in Colorado',
              'url': 'https://ohlawcolorado.com/services/nonprofits'
            }
          }
        ]
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Legal Services Overview',
      'description': 'Comprehensive legal services for families and small businesses in Fort Collins, Colorado',
      'url': 'https://ohlawcolorado.com/services',
      'mainEntity': {
        '@type': 'ItemList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'item': {
              '@type': 'Service',
              'name': 'Estate Planning',
              'url': 'https://ohlawcolorado.com/services/estate-planning'
            }
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'item': {
              '@type': 'Service',
              'name': 'Small Business Law',
              'url': 'https://ohlawcolorado.com/services/small-business'
            }
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'item': {
              '@type': 'Service',
              'name': 'Bankruptcy Services',
              'url': 'https://ohlawcolorado.com/services/bankruptcy'
            }
          },
          {
            '@type': 'ListItem',
            'position': 4,
            'item': {
              '@type': 'Service',
              'name': 'Nonprofit Formation',
              'url': 'https://ohlawcolorado.com/services/nonprofits'
            }
          }
        ]
      }
    }
  ]
}))
</script>

<style scoped>
.pi {
  font-size: inherit;
}
</style>