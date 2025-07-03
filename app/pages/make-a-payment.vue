<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Main Content -->
    <div class="container mx-auto px-4 py-12 max-w-4xl">
      <div class="bg-white rounded-lg shadow-lg p-8 md:p-12">
        
        <!-- Header Section -->
        <div class="text-center mb-8">
          <div class="flex justify-center mb-4">
            <div class="bg-emerald-600 p-3 rounded-full text-4xl">
              <i class="pi pi-shield text-stone-100 "></i>
            </div>
          </div>
          <h1 class="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Secure Payment Portal
          </h1>
          <p class="text-lg text-slate-600 max-w-2xl mx-auto">
            Use our our secure payment system to complete your transaction safely and securely.
          </p>
        </div>

        <!-- Trust Indicators -->
        <div class="bg-stone-100 border-stone-300 rounded-lg p-6 mb-8">
          <h2 class="text-xl font-semibold text-slate-800 mb-4 text-center">
            Your Payment is Secure
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div class="flex flex-col items-center text-3xl">
              <i class="pi pi-lock text-yellow-600 mb-2"></i>
              <span class="text-sm text-slate-700 font-medium">SSL Encrypted</span>
              <span class="text-xs text-slate-500 mt-2">Bank-level security</span>
            </div>
            <div class="flex flex-col items-center text-3xl">
              <i class="pi pi-verified text-yellow-600 mb-2"></i>
              <span class="text-sm text-slate-700 font-medium">
                Attorney Trust Account
                <i
                  class="pi pi-info-circle text-primary-600 text-xl"
                  v-tooltip="`Attorney trust accounts are heavily regulated in Colorado by the Colorado Supreme Court's Attorney Regulation Office`"
                ></i>
              </span>
              <span class="text-xs text-slate-500 mt-2">
                Fully regulated
              </span>
            </div>
            <div class="flex flex-col items-center text-3xl">
              <i class="pi pi-users text-yellow-600 mb-2"></i>
              <span class="text-sm text-slate-700 font-medium">Personal Service</span>
              <span class="text-xs text-slate-500 mt-2">We're here to help</span>
            </div>
          </div>
        </div>

        <!-- Instructions -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-slate-800 mb-4">
            Before You Continue
          </h2>
          <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div class="flex items-start">
              <i class="pi pi-info-circle text-amber-600 text-lg mt-1 mr-3 flex-shrink-0"></i>
              <div>
                <p class="text-amber-800 font-medium mb-1">Help Us Post Your Payment Faster</p>
                <p class="text-amber-700 text-sm">
                  Our client portal does not include a payment function, at
                  least not yet. So adding additional information in the notes
                  field helps us post your payment faster.
                  Please include any details that help us identify your matter - 
                  such as the type of service (estate planning, bankruptcy, business formation) or 
                  reference to recent correspondence.
                </p>
              </div>
            </div>
          </div>
          <p class="text-slate-600">
            Only your first name is required, but providing your full name and brief notes 
            helps us process your payment quickly and accurately.
          </p>
        </div>

        <!-- CTA Section -->
        <div class="text-center">
          <button
            @click="proceedToPayment"
            class="bg-stone-600 hover:bg-stone-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <i class="pi pi-arrow-right mr-2"></i>
            Continue to Payment Form
          </button>
          <p class="text-xs text-slate-500 mt-3">
            You'll be taken to our secure payment provider
          </p>
        </div>

        <!-- Contact Info -->
        <div class="mt-12 pt-8 border-t border-slate-200 text-center">
          <p class="text-slate-600 mb-2">Questions about your payment?</p>
          <div class="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm">
            <a 
              href="tel:+19708183052" 
              class="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
            >
              <!-- <i class="pi pi-phone mr-2"></i> -->
              <font-awesome-icon icon="fas fa-phone" class="mr-2" fixed-width></font-awesome-icon>
              970-818-3052
            </a>
            <span class="hidden sm:block text-slate-300">|</span>
            <a 
              href="mailto:contact@ohlawcolorado.com" 
              class="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
            >
              <i class="pi pi-envelope mr-2"></i>
              contact@ohlawcolorado.com
            </a>
            <span class="hidden sm:block text-slate-300">|</span>
            <font-awesome-icon icon="fas fa-comment-sms" fixed-width></font-awesome-icon>
            <a class="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
              href="sms://+19708185558"
              title="text us"
            >
              970-818-5559
            </a>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
// SEO and meta tags
useHead({
  title: 'Make a Payment - Secure Payment Portal',
  meta: [
    { name: 'description', content: 'Secure payment portal for The Law Offices of Owen Hathaway. Make payments safely to your attorney trust account.' },
    { name: 'robots', content: 'noindex, nofollow' } // Keep this private
  ]
})

const proceedToPayment = () => {
  // Redirect to the Lawmatics payment form
  window.location.href = 'https://app.lawmatics.com/forms/preview/71c062ba-8e47-4a63-8252-0bc3482aa6ec'
}
</script>

<style scoped>
.pi {
  font-size: inherit;
}
</style>