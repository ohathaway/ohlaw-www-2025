<template>
  <div class="max-w-[800px] my-5 mx-auto p-[1rem] md:p-[2rem] bg-white rounded-3xl drop-shadow-lg">
    <!-- Loading state -->
    <div v-if="loading" class="quiz-loading">
      <!-- Header skeleton -->
      <div class="mb-6">
        <div class="h-8 bg-gray-200 rounded-md w-3/4 mx-auto mb-4 animate-pulse"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
      </div>

      <!-- Description skeleton -->
      <div class="mb-8 space-y-3">
        <div class="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        <div class="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
        <div class="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
      </div>

      <!-- Progress bar skeleton -->
      <div class="mb-6">
        <div class="h-2 bg-gray-200 rounded-full w-full animate-pulse"></div>
      </div>

      <!-- Question skeleton -->
      <div class="mb-8">
        <div class="h-6 bg-gray-200 rounded w-2/3 mb-4 animate-pulse"></div>
        <div class="space-y-3">
          <div class="h-12 bg-gray-200 rounded-lg w-full animate-pulse"></div>
          <div class="h-12 bg-gray-200 rounded-lg w-full animate-pulse"></div>
          <div class="h-12 bg-gray-200 rounded-lg w-full animate-pulse"></div>
        </div>
      </div>

      <!-- Loading message -->
      <div class="text-center mt-8">
        <ProgressSpinner class="text-primary mb-3" />
        <p class="text-gray-600">Preparing your assessment...</p>
        <p class="text-sm text-gray-500 mt-2">This may take a moment</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center p-5">
      <Message severity="error">
        <i class="bi bi-exclamation-triangle-fill me-2" />
        {{ error }}
      </Message>
      <Button class="mt-3" raised @click="loadQuiz">
        Try Again
      </Button>
    </div>

    <!-- Quiz content -->
    <div v-else-if="quiz" class="quiz-content">
      <h2 class="mb-4">
        {{ quiz.title }}
      </h2>
      <!-- Introduction (shown before starting) -->
      <div v-if="!started && !completed" class="p-[2rem] text-center">
        <div class="quiz-description mb-5">
          <BlogRichText :block="quiz.description" />
        </div>
        <Button size="large" severity="success" @click="startQuiz">
          Start Quiz
        </Button>
      </div>

      <!-- Active quiz (questions) -->
      <div v-else-if="started && !completed" class="p-[1rem]">
        <!-- Progress bar -->
        <QuizProgress
          :current-question="currentQuestionIndex + 1"
          :total-questions="quiz.questions.length"
          :percent="progressPercent"
        />

        <!-- Current question -->
        <QuizQuestion
          :key="currentQuestionIndex"
          :question="currentQuestion"
          :is-last-question="progressPercent === 100"
          :initial-answers="userAnswers[currentQuestion.questionId]"
          show-prev-button
          @answer="handleAnswer"
          @previous="handlePrevious"
        />
      </div>

      <!-- Results -->
      <div v-else-if="completed" class="p-[2rem]">
        <!-- Basic Contact form or thank you message -->
        <div v-if="!basicContactSubmitted && quiz.collectContactInfo" class="mt-5">
          <QuizContactForm
            @submit="handleContactSubmit"
            @skip="handleContactSkip"
          />
        </div>

        <div v-else>
          <QuizResults
            :result="quizResult"
            :quiz="quiz"
            @reset="resetQuiz"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props and route
const { quizSlug } = defineProps({
  quizSlug: {
    type: String,
    default: '',
  },
})

const route = useRoute()
const quizStore = useQuizStore()
const {
  quiz,
  loading,
  error,
  started,
  completed,
  contactSubmitted,
  basicContactSubmitted,
  currentQuestionIndex,
  currentQuestion,
  progressPercent,
  quizResult,
  startTime,
  userAnswers,
} = storeToRefs(quizStore)

const {
  handleAnswer,
  handleContactSubmit,
  handleContactSkip,
  handlePrevious,
  resetQuiz,
  startQuiz,
} = useQuizStore()

// Load quiz on component mount
onMounted(async () => {
  const slug = quizSlug || route.params.quiz

  if (!slug) {
    error.value = 'Quiz not found. Please check the URL and try again.'
    return
  }

  await quizStore.loadQuiz(slug)
})
</script>
