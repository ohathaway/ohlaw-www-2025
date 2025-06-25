<template>
  <div v-if="isFromPaymentForm" class="payment-thank-you">
    <!-- Hero Section -->
    <section class="relative py-12 bg-emerald-600 md:py-16 text-center text-white">
      <div class="container mx-auto px-4">
        <div class="flex justify-center mb-4">
          <div class="bg-white/20 p-4 rounded-full">
            <span class="text-5xl"><i class="pi pi-check-circle text-white"></i></span>
          </div>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold mb-4">Payment Received</h1>
        <p class="text-xl opacity-90">Thank you for your payment to OH Law</p>
      </div>
    </section>

    <!-- Thank You Message -->
    <section class="py-12 bg-slate-100">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-2xl md:text-3xl font-semibold mb-4">Your Payment Has Been Processed</h2>
          <p class="text-xl mb-4">We've received your payment and will process it promptly.</p>
          <div class="bg-stone-200 border border-stone-300 rounded-lg p-6 mb-6">
            <div class="flex items-start justify-center">
              <span class="text-lg"><i class="pi pi-info-circle text-stone-600 mt-1 mr-3 flex-shrink-0"></i></span>
              <div class="text-left">
                <p class="text-stone-800 font-medium mb-2">What happens next?</p>
                <p class="text-stone-700 text-sm">
                  You should receive an email confirmation shortly. We'll match your payment to your account 
                  and apply it appropriately. If you included helpful details in the notes field, 
                  this process will be even faster.
                </p>
              </div>
            </div>
          </div>
          <p class="text-slate-700 mb-6">
            <strong>Questions or concerns about your payment?</strong>
            <br />Don't hesitate to contact us using any of the methods below.
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Methods -->
    <section class="py-12">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-semibold mb-10 text-center relative pb-4">
          Contact Us Anytime
          <span class="absolute bottom-0 left-1/2 w-16 h-1 bg-primary-500 transform -translate-x-1/2"></span>
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <!-- Call Card -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:translate-y-[-5px] duration-300">
            <a href="tel:+19708183052" class="block no-underline text-slate-800 h-full">
              <div class="p-6 flex flex-col items-center text-center">
                <span class="text-4xl"><i class="pi pi-phone text-stone-600 mb-3"></i></span>
                <h3 class="text-lg font-semibold mb-2">Call Us</h3>
                <p class="text-lg">970-818-3052</p>
              </div>
            </a>
          </div>
          
          <!-- Text Card -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:translate-y-[-5px] duration-300">
            <a href="sms://+19708185559" class="block no-underline text-slate-800 h-full">
              <div class="p-6 flex flex-col items-center text-center">
                <span class="text-4xl"><i class="pi pi-comment text-stone-600 mb-3"></i></span>
                <h3 class="text-lg font-semibold mb-2">Text Us</h3>
                <p class="text-lg">970-818-5559</p>
              </div>
            </a>
          </div>
          
          <!-- Email Card -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:translate-y-[-5px] duration-300">
            <a href="mailto:contact@ohlawcolorado.com" class="block no-underline text-slate-800 h-full">
              <div class="p-6 flex flex-col items-center text-center">
                <span class="text-4xl"><i class="pi pi-envelope text-stone-600 mb-3"></i></span>
                <h3 class="text-lg font-semibold mb-2">Email Us</h3>
                <p class="text-sm">contact@ohlawcolorado.com</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Blog Post Section -->
    <section class="py-12 bg-slate-50">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-semibold mb-2 text-center relative pb-4">
          While You're Here
          <span class="absolute bottom-0 left-1/2 w-16 h-1 bg-primary-500 transform -translate-x-1/2"></span>
        </h2>
        <p class="text-center text-slate-600 mb-10">Check out our latest insights from the team</p>
        <BlogFeaturedPostCard />
      </div>
    </section>

    <section class="py-12 bg-gradient-to-r from-stone-600 to-stone-700 text-white text-center">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto">
          <h2 class="text-2xl md:text-3xl font-bold mb-4">We're Here When You Need Us</h2>
          <p class="text-lg mb-8 opacity-90">
            Whether you have questions about your payment or need additional legal services, 
            our team is ready to help you build a strong legal foundation.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <NuxtLink 
              to="/contact" 
              class="bg-white text-stone-700 hover:bg-slate-100 px-6 py-3 rounded-md font-medium transition-all duration-300"
            >
              Contact Our Team
            </NuxtLink>
            <NuxtLink 
              to="/services" 
              class="border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-md font-medium transition-all duration-300"
            >
              Explore Our Services
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
  <!-- Alternate Content for Direct Navigation -->
  <div v-else>
    <section class="relative py-12 bg-amber-500 md:py-16 text-center text-white">
      <div class="container mx-auto px-4">
        <div class="flex justify-center mb-4">
          <div class="bg-white/20 p-4 rounded-full">
            <i class="pi pi-exclamation-triangle text-5xl text-white"></i>
          </div>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold mb-4">Looking to Make a Payment?</h1>
        <p class="text-xl opacity-90">This page is for payment confirmations only</p>
      </div>
    </section>

    <section class="py-12 bg-slate-100">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-2xl md:text-3xl font-semibold mb-4">You've Reached the Payment Confirmation Page</h2>
          <p class="text-xl mb-6">This page is only shown after completing a payment through our secure payment portal.</p>
          
          <div class="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
            <div class="flex items-start justify-center">
              <i class="pi pi-info-circle text-amber-600 text-lg mt-1 mr-3 flex-shrink-0"></i>
              <div class="text-left">
                <p class="text-amber-800 font-medium mb-2">Need to make a payment?</p>
                <p class="text-amber-700 text-sm">
                  Use the button below to access our secure payment portal where you can 
                  safely submit payments to our attorney trust account.
                </p>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <NuxtLink 
              to="/make-a-payment" 
              class="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-md font-semibold transition-all duration-300"
            >
              Make a Payment
            </NuxtLink>
            <NuxtLink 
              to="/contact" 
              class="border-2 border-primary-600 text-primary-600 hover:bg-primary-50 px-8 py-3 rounded-md font-semibold transition-all duration-300"
            >
              Contact Us
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
    <!-- Featured Blog Post Section -->
    <section class="py-12 bg-slate-50">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-semibold mb-2 text-center relative pb-4">
          While You're Here
          <span class="absolute bottom-0 left-1/2 w-16 h-1 bg-primary-500 transform -translate-x-1/2"></span>
        </h2>
        <p class="text-center text-slate-600 mb-10">Check out our latest insights from the team</p>
        <BlogFeaturedPostCard />
      </div>
    </section>
  </div>
</template>

<script setup>
const isFromPaymentForm = ref(false)

// SEO and meta tags
useHead({
  title: 'Payment Received - Thank You | OH Law',
  meta: [
    { name: 'description', content: 'Thank you for your payment to The Law Offices of Owen Hathaway. Your payment has been received and will be processed promptly.' },
    { name: 'robots', content: 'noindex, nofollow' } // Keep this private
  ]
})

// Check if user came from Lawmatics payment form
const { query: { utm_source } } = useRoute()
const validReferrers = [
  'app.lawmatics.com',
  'pay.lawmatics.com', // in case they change the domain
  'lawmatics.com' // catch any lawmatics subdomain
]

isFromPaymentForm.value = utm_source === 'lawmatics'
</script>

<style scoped>
.pi {
  font-size: inherit;
}
</style>