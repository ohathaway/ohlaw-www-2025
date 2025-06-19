<template>
  <div class="contact-us-container">
    <!-- Hero Section -->
    <section class="relative py-4 ">
      <div class="absolute inset-0 opacity-10" 
           :style="backgroundStyleHero">
      </div>
      <div class="container mx-auto px-4 py-[3rem] relative z-10">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-2 ">Contact Us</h1>
          <h3 class="text-2xl md:text-3xl mb-4">There's No Wrong Door</h3>
        </div>
      </div>
    </section>

    <!-- Scheduling Section -->
    <section id="schedule" class="py-16 bg-slate-200">
      <div class="container mx-auto px-4 relative" ref="schedulingSection">
        <div class="w-full flex justify-center mb-12">
          <h2 class="text-3xl font-semibold text-center relative inline-block">
            Schedule A Consultation
            <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500"></span>
          </h2>
        </div>
        <SchedulingCards />
      </div>
    </section>

    <!-- Visit Us Section -->
    <section id="visit-us" class="py-16">
      <div class="container mx-auto px-4">
        <div class="mb-8">
          <div class="w-full flex justify-center mb-12">
            <h2 class="text-3xl font-semibold text-center relative inline-block">
              Visit Us
              <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500"></span>
            </h2>
          </div>
          <p class="max-w-4xl mx-auto text-center mb-8">
            We try real hard to keep our overhead costs focused on things that truly matter. So we do most of our work from home (or wherever we happen to be that day). It's important to be able to meet people in person too, though. That's why we've partnered with 
            <a href="https://www.officeevolution.com/" title="Office Evolution" target="_blank" class="text-primary-600 hover:text-primary-800 underline">
              Office Evolution
            </a> 
            in order to provide folks the convenience of meeting places nearby.<br /> 
            <strong>Just please 
              <a href="#visit-us" @click="openBookingModal" class="text-primary-600 hover:text-primary-800 cursor-pointer">
                make an appointment
              </a> 
              so we meet you in the right city!
            </strong>
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          <div class="md:col-span-1 order-first md:order-last">
            <div class="bg-stone-400 text-white p-4 rounded-lg shadow-lg">
              <p class="mb-4">These are the offices we use most frequently.</p>
              
              <Accordion value="0" :activeIndex="0" @update:value="handleAccordionChange">
                <AccordionPanel value="0">
                  <AccordionHeader>Home Base - Fort Collins</AccordionHeader>
                  <AccordionContent>
                    <ul class="list-none pl-0">
                      <li>2580 E Harmony Rd</li>
                      <li>Suite 201</li>
                      <li>Fort Collins, CO 80528</li>
                    </ul>
                  </AccordionContent>
                </AccordionPanel>
                
                <AccordionPanel value="1">
                  <AccordionHeader>Denver Metro North</AccordionHeader>
                  <AccordionContent>
                    <ul class="list-none pl-0">
                      <li>11990 Grant St</li>
                      <li>Suite 550</li>
                      <li>Northglenn, CO 80233</li>
                    </ul>
                  </AccordionContent>
                </AccordionPanel>
                
                <AccordionPanel value="2">
                  <AccordionHeader>Broomfield/Interlocken</AccordionHeader>
                  <AccordionContent>
                    <ul class="list-none pl-0">
                      <li>11001 W 120th Ave</li>
                      <li>Suite 400</li>
                      <li>Broomfield, CO 80021</li>
                    </ul>
                  </AccordionContent>
                </AccordionPanel>
              </Accordion>
            </div>
          </div>
          
          <div class="md:col-span-3 order-last md:order-first">
            <div class="rounded-lg overflow-hidden shadow-lg">
              <iframe :src="currentMapUrl" width="100%" height="450" style="border:0;" 
                    allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Methods Section -->
    <section class="py-16 bg-stone-200">
      <div class="container mx-auto px-4">
        <div class="w-full flex justify-center mb-12">
          <h2 class="text-3xl font-semibold text-center relative inline-block">
            Get In Touch
            <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500"></span>
          </h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <!-- Call Card -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:translate-y-[-5px] duration-300">
            <a :href="formatPhoneNumberForTel(phoneNumbers.voice)" class="block no-underline text-slate-800 h-full">
              <div class="p-6 flex flex-col items-center">
                <div class="text-center mb-4">
                  <i class="pi pi-phone text-5xl text-primary-600"></i>
                </div>
                <h3 class="text-xl font-semibold mb-4 text-center">Call Us</h3>
                <p class="text-center text-2xl mb-0">{{ formatPhoneNumberWithDashes(phoneNumbers.voice) }}</p>
              </div>
            </a>
          </div>
          
          <!-- Text Card -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:translate-y-[-5px] duration-300">
            <a :href="formatPhoneNumberForSms(phoneNumbers.sms)" class="block no-underline text-slate-800 h-full">
              <div class="p-6 flex flex-col items-center">
                <div class="text-center mb-4">
                  <i class="pi pi-comment text-5xl text-primary-600"></i>
                </div>
                <h3 class="text-xl font-semibold mb-4 text-center">Text Us</h3>
                <p class="text-center text-2xl mb-0">{{ formatPhoneNumberWithDashes(phoneNumbers.sms) }}</p>
              </div>
            </a>
          </div>
          
          <!-- Email Card -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:translate-y-[-5px] duration-300">
            <a :href="`mailto:${contactEmail}`" class="block no-underline text-slate-800 h-full">
              <div class="p-6 flex flex-col items-center">
                <div class="text-center mb-4">
                  <i class="pi pi-envelope text-5xl text-primary-600"></i>
                </div>
                <h3 class="text-xl font-semibold mb-4 text-center">Email Us</h3>
                <p class="text-center text-lg mb-0">{{ contactEmail }}</p>
              </div>
            </a>
          </div>
          
          <!-- Fax Card -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:translate-y-[-5px] duration-300">
            <div class="p-6 flex flex-col items-center">
              <div class="text-center mb-4">
                <i class="pi pi-print text-5xl text-primary-600"></i>
              </div>
              <h3 class="text-xl font-semibold mb-4 text-center">Fax Us</h3>
              <p class="text-center text-2xl mb-0">{{ formatPhoneNumberWithDashes(phoneNumbers.fax) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { contactEmail, phoneNumbers } = useAppConfig()

// SEO metadata
useHead(useSeo({
  title: 'Contact The Law Offices of Owen Hathaway | Multiple Ways to Reach Us',
  meta: [
    { name: 'description', content: 'Reach our team the most convenient way for you. Schedule a consultation, visit our offices, call, text, or email us. There\'s no wrong door when you need our help.' },
    { property: 'og:title', content: 'Contact The Law Offices of Owen Hathaway | Multiple Ways to Reach Us' },
    { property: 'og:description', content: 'Reach our team the most convenient way for you. Schedule a consultation, visit our offices, call, text, or email us. There\'s no wrong door when you need legal help.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://ohlawcolorado.com/contact-us' },
    { name: 'twitter:title', content: 'Contact The Law Offices of Owen Hathaway | Multiple Ways to Reach Us' },
    { name: 'twitter:description', content: 'Reach our team the most convenient way for you. Schedule a consultation, visit our offices, call, text, or email us. There\'s no wrong door when you need legal help.' },
    { name: 'twitter:image', content: 'https://ohlawcolorado.com/files/ohlaw-logo-trans-450.D38LfYoB.svg' },
    { name: 'twitter:image:alt', content: 'The Law Offices of Owen Hathaway logo' }
  ],
  link: [
    { rel: 'canonical', href: 'https://ohlawcolorado.com/contact-us' }
  ]
}))

// Hero background
const backgroundStyleHero = useBackgroundStyle({ 
  image: '/img/business1_1024.webp',
  noOverlay: true
})

// Sticky header controls
const isHeadingSticky = ref(false)
const schedulingSection = ref(null)

// Handle scroll for sticky header
const handleScroll = () => {
  if (!schedulingSection.value) return
  
  const rect = schedulingSection.value.getBoundingClientRect()
  const visitUsSection = document.getElementById('visit-us')
  
  // Calculate when to make heading sticky/unsticky
  if (rect.top < 80 && (!visitUsSection || visitUsSection.getBoundingClientRect().top > 150)) {
    isHeadingSticky.value = true
  } else {
    isHeadingSticky.value = false
  }
}

onMounted(() => {
  if (process.client) {
    window.addEventListener('scroll', handleScroll)
    nextTick(() => handleScroll())
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('scroll', handleScroll)
  }
})

// Open the booking modal
const openBookingModal = () => {
  if (process.client) {
    // Use PrimeVue Dialog instead of Bootstrap Modal
    // This is just a placeholder - replace with your actual PrimeVue implementation
    console.log('Opening booking modal')
    // Implementation will depend on how you've set up the booking modal in PrimeVue
  }
}

// Map controls
const addressIframes = {
  foco: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3032.8064395418924!2d-105.0348897144356!3d40.52376917544674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876eb34d7d55dd11%3A0xcd425b9134c1d587!2sOffice%20Evolution!5e0!3m2!1sen!2sus!4v1741916038680!5m2!1sen!2sus',
  metroNorth: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3060.2495762449034!2d-104.98664062417319!3d39.91343068611849!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876c7591e4a9c9c5%3A0xf801bf8aa6ba55f2!2sOffice%20Evolution%20-%20Metro%20North%2C%20CO!5e0!3m2!1sen!2sus!4v1741916272047!5m2!1sen!2sus',
  interlocken: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3060.1878797991712!2d-105.12557541463585!3d39.91481151262766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876b8b869076500b%3A0x6134c1f5e6a0c76e!2sOffice%20Evolution%20-%20Broomfield%2C%20CO!5e0!3m2!1sen!2sus!4v1741916375745!5m2!1sen!2sus'
}

// Track the currently active location (default to Fort Collins)
const currentLocation = ref('foco')

// Create a computed property for the current map URL
const currentMapUrl = computed(() => {
  return addressIframes[currentLocation.value]
})

// Function to handle accordion tab changes
const handleAccordionChange = (event) => {
  // Map PrimeVue accordion index to location keys
  const locationMap = ['foco', 'metroNorth', 'interlocken']
  if (event !== undefined && locationMap[event]) {
    currentLocation.value = locationMap[event]
  }
}
</script>

<style scoped>
.pi {
  font-size: 3rem;
}
</style>
