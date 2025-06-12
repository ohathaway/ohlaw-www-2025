<template>
  <div class="max-w-[800px] my-5 mx-auto p-[1rem] md:p-[2rem] bg-white rounded-3xl drop-shadow-lg">
    <!-- Loading state -->
    <div v-if="loading" class="text-center p-5">
      <ProgressSpinner class="text-primary" />
      <p class="mt-3">Loading quiz...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center p-5">
      <Message severity="error">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        {{ error }}
      </Message>
      <Button class="mt-3" raised @click="loadQuiz">Try Again</Button>
    </div>

    <!-- Quiz content -->
    <div v-else-if="quiz" class="quiz-content">
      <h2 class="mb-4">{{ quiz.title }}</h2>
      <!-- Introduction (shown before starting) -->
      <div v-if="!started && !completed" class="p-[2rem] text-center">
        <div class="quiz-description mb-5"><BlogRichText :block="quiz.description" /></div>
        <Button size="large" severity="success" @click="startQuiz">
          Start Quiz
        </Button>
      </div>

      <!-- Active quiz (questions) -->
      <div v-else-if="started && !completed" class="p-[1rem]">
        <!-- Progress bar -->
        <QuizProgress 
          :currentQuestion="currentQuestionIndex + 1"
          :totalQuestions="quiz.questions.length"
          :percent="progressPercent"
        />

        <!-- Current question -->
        <QuizQuestion 
          :question="currentQuestion"
          :key="currentQuestionIndex"
          :isLastQuestion="progressPercent === 100"
          :initialAnswers="userAnswers[currentQuestion.questionId]"
          showPrevButton
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
const {quizSlug } = defineProps({
  quizSlug: {
    type: String,
    default: ''
  }
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
  startQuiz
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