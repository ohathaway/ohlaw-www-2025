<template>
  <div class="px-4">
    <h5 class="mb-3 pb-2 border-b-2 border-gray-500 text-2xl">What Our Clients Say</h5>
    
    <div class="relative min-h-[200px]">
      <transition name="fade" mode="out-in">
        <div :key="currentIndex" class="p-4 rounded-lg bg-opacity-5 bg-white">
          <div class="mb-2">
            <font-awesome-icon 
              v-for="n in currentTestimonial.rating" 
              :key="n" 
              icon="fas fa-star" 
              class="text-yellow-400 mr-0.5" 
            />
          </div>
          
          <div class="mb-3 italic text-slate-800 leading-relaxed">
            <font-awesome-icon icon="fas fa-quote-left" class="text-slate-300 text-xs align-super mr-1" />
            {{ currentTestimonial.text }}
            <font-awesome-icon icon="fas fa-quote-right" class="text-slate-300 text-xs align-super ml-1" />
          </div>
          
          <div class="text-sm">
            <span class="font-semibold text-slate-700">{{ currentTestimonial.author }}</span>
            <span v-if="currentTestimonial.service" class="text-slate-700">
              • {{ currentTestimonial.service }}
            </span>
          </div>
          
          <div class="mt-2 flex items-center text-xs text-slate-700">
            <img 
              src="/img/Search_GSA.original.webp" 
              alt="Google Review" 
              class="h-4 w-4 mr-1" 
            />
            Verified Google Review
          </div>
        </div>
      </transition>
      
      <div class="mt-3 flex justify-center">
        <button 
          v-for="(_, index) in testimonials" 
          :key="index"
          @click="setTestimonial(index)"
          class="w-2 h-2 rounded-full mx-1 transition-colors duration-300 ease-in-out"
          :class="index === currentIndex ? 'bg-primary-400' : 'bg-gray-300 hover:bg-gray-400'"
          :aria-label="`View testimonial ${index + 1}`"
        ></button>
      </div>
      
      <a 
        v-if="googleReviewUrl"
        :href="googleReviewUrl" 
        target="_blank" 
        rel="noopener noreferrer"
        class="mt-3 inline-block text-white text-sm hover:underline"
      >
        <font-awesome-icon icon="fas fa-external-link-alt" class="mr-1" />
        Read more reviews
      </a>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  autoRotate: {
    type: Boolean,
    default: true
  },
  rotationInterval: {
    type: Number,
    default: 10000 // 10 seconds
  },
  googleReviewUrl: {
    type: String
  }
})

// Sample testimonials - replace with your actual reviews
const testimonials = ref([
  {
    author: 'joy simpson',
    rating: 5,
    text: `Amazing team! Knowledgeable, professional, Trustworthy and friendly. They go beyond and above to support your needs`,
    service: 'Estate Planning'
  },
  {
    author: 'Sandi Fank',
    rating: 5,
    text: `Highly recommend these guys! They've been by my side throughout the ups and downs and I feel confident that I'm not just another "file". Great job!`,
    service: 'Bankruptcy'
  },
  {
    author: 'Travis WH',
    rating: 5,
    text: `I recently has a case where I was in over my head and feeling bullied and abused by an aggressive lawyer and a murky and mysterious legal system. After trying a few law firms and resources with little to no help I was finally guided to Owen. To start his assistant was very friendly and kind and I appreciate her patience in hearing my woes and making sure Owen was available right away. She was great! In minutes he clarified all the facts, broke down the way to move forward, and restored a feeling of confidence and security. His quick and accurate answers, deep knowledge, and calm demeanor made a months worth of stress evaporate. I am sure to Owen this was just another Wednesday but to me and people reading this his services change your day and life quickly. 100% I would send friends and family to Owen for anything he can help with. THANK YOU OWEN AND STAFF!`,
    service: 'Debt Management'
  }
])

const currentIndex = ref(0)
const currentTestimonial = computed(() => testimonials.value[currentIndex.value])
let intervalId = null

// Function to advance to the next testimonial
const nextTestimonial = () => {
  currentIndex.value = (currentIndex.value + 1) % testimonials.value.length
}

// Function to set a specific testimonial
const setTestimonial = (index) => {
  currentIndex.value = index
  // Reset the timer when manually changing testimonials
  if (props.autoRotate && intervalId) {
    clearInterval(intervalId)
    startRotation()
  }
}

// Start the automatic rotation
const startRotation = () => {
  if (props.autoRotate) {
    intervalId = setInterval(nextTestimonial, props.rotationInterval)
  }
}

// Pause rotation on hover/focus for accessibility
const pauseRotation = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

// Resume rotation when not hovering/focusing
const resumeRotation = () => {
  if (props.autoRotate && !intervalId) {
    startRotation()
  }
}

// Set up event listeners and start rotation
onMounted(() => {
  startRotation()
  
  const element = document.querySelector('.relative')
  if (element) {
    element.addEventListener('mouseenter', pauseRotation)
    element.addEventListener('mouseleave', resumeRotation)
    element.addEventListener('focusin', pauseRotation)
    element.addEventListener('focusout', resumeRotation)
  }
})

// Clean up when component is destroyed
onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
  
  const element = document.querySelector('.relative')
  if (element) {
    element.removeEventListener('mouseenter', pauseRotation)
    element.removeEventListener('mouseleave', resumeRotation)
    element.removeEventListener('focusin', pauseRotation)
    element.removeEventListener('focusout', resumeRotation)
  }
})

defineExpose({
  setTestimonial,
  nextTestimonial,
  pauseRotation,
  resumeRotation
})
</script>

<style scoped>
/* Only keeping the fade transition styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>