<template>
  <div class="quiz-results">
    <!-- Results header -->
    <div class="results-header text-center mb-4">
      <h2 class="mb-0">Your Results</h2>
      <small class="mb-5">not legal advice, if you want legal advice you have to talk to us</small>
      <div v-if="result.category" class="result-category my-3">
        <span class="badge bg-primary p-2 fs-5">{{ result.category.title }}</span>
      </div>
    </div>

    <!-- Result content -->
    <div class="result-content p-4 border rounded bg-light">
      <!-- Result media if available -->
      <div v-if="result.category && result.category.media" class="result-media text-center mb-4">
        <img :src="result.category.media" :alt="result.category.title" class="img-fluid rounded">
      </div>

      <!-- Result description -->
      <div v-if="result.category && result.category.description" class="result-description mb-4">
        <BlogRichText :block="result.category.description" />
      </div>

      <!-- Fallback if no category found -->
      <div v-else class="result-default">
        <p>Thank you for completing our quiz. Based on your answers, we've prepared some insights that might be helpful for your situation.</p>
      </div>

      <!-- Call to action -->
      <div class="result-cta mt-4 text-center">
        <p class="lead mb-4">
          {{ result.category?.ctaText || quiz.defaultCTA || 'Want to learn more about how we can help?' }}
        </p>

        <!-- CTA buttons -->
        <div class="d-grid gap-2 d-md-flex justify-content-md-center">
          <a 
            v-if="result.category?.ctaLink" 
            :href="result.category.ctaLink" 
            class="btn btn-primary btn-lg"
            :target="linkLocal(result.category.ctaLink) ? '_self' : '_blank'"
            :rel="linkLocal(result.category.ctaLink) ? 'quiz' : 'noopener'"
          >
            Learn More
          </a>
          <Button 
            v-else
            class="btn btn-primary btn-lg" 
            @click="$emit('contact')"
          >
            Get Personalized Advice
          </Button>

          <!-- Lead magnet download if available -->
          <a 
            v-if="quiz.leadMagnet"
            :href="quiz.leadMagnet" 
            class="btn btn-outline-primary btn-lg" 
            download
          >
            <i class="bi bi-download me-2"></i> Download Guide
          </a>
        </div>
      </div>
    </div>

    <!-- Social sharing -->
    <div class="social-sharing mt-5 text-center">
      <p class="mb-3">Found this quiz helpful? Share it with others who might benefit:</p>
      <div class="d-flex justify-content-center gap-3">
        <Button class="btn btn-outline-primary" @click="shareOnFacebook">
          <i class="bi bi-facebook"></i>
        </Button>
        <Button class="btn btn-outline-primary" @click="shareOnTwitter">
          <i class="bi bi-twitter"></i>
        </Button>
        <Button class="btn btn-outline-primary" @click="shareOnLinkedIn">
          <i class="bi bi-linkedin"></i>
        </Button>
        <Button class="btn btn-outline-primary" @click="shareByEmail">
          <i class="bi bi-envelope"></i>
        </Button>
      </div>
    </div>

    <!-- Retake quiz option -->
    <div class="retake-quiz mt-4 text-center">
      <button class="btn btn-link" @click="$emit('reset')">
        <i class="bi bi-arrow-repeat me-1"></i> Take the quiz again
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  result: {
    type: Object,
    required: true
  },
  quiz: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['contact', 'reset'])

// Current page URL for sharing
const pageUrl = computed(() => {
  return typeof window !== 'undefined' ? window.location.href : ''
})

// Share functions
const shareOnFacebook = () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl.value)}`
  window.open(url, '_blank')
}

const shareOnTwitter = () => {
  const text = `I just took the "${props.quiz.title}" quiz. Check it out!`
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(pageUrl.value)}`
  window.open(url, '_blank')
}

const shareOnLinkedIn = () => {
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl.value)}`
  window.open(url, '_blank')
}

const shareByEmail = () => {
  const subject = `Check out this quiz: ${props.quiz.title}`
  const body = `I thought you might find this quiz interesting: ${pageUrl.value}`
  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
</script>

<style scoped>
.quiz-results {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.result-category .badge {
  background-color: #003399 !important;
}

.result-content {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.result-description {
  font-size: 1.1rem;
  line-height: 1.6;
}

.btn-primary {
  background-color: #003399;
  border-color: #003399;
}

.btn-outline-primary {
  color: #003399;
  border-color: #003399;
}

.btn-outline-primary:hover {
  background-color: #003399;
  color: white;
}

.social-sharing .btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.retake-quiz .btn-link {
  color: #6c757d;
  text-decoration: none;
}

.retake-quiz .btn-link:hover {
  text-decoration: underline;
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .quiz-results {
    padding: 1rem 0.5rem;
  }
  
  .result-description {
    font-size: 1rem;
  }
}
</style>