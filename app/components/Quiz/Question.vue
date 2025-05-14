<template>
  <div class="p-4 bg-white rounded-lg">
    <!-- Question header -->
    <h3
      class="question-text mb-3 text-xl font-semibold"
      :id="`question-${question.questionId}-text`"
    >
      {{ question.questionText }}
    </h3>
    
    <!-- Optional description -->
    <div v-if="question.description" class="text-slate-600 mb-4">
      <BlogRichText :block="question.description" />
    </div>
    
    <!-- Question media if available -->
    <div v-if="question.media" class="mb-4">
      <NuxtImg
        :src="question.media"
        :alt="question.questionText"
        class="w-full rounded"
        provider="strapi"
      />
    </div>
    
    <!-- Answer options container -->
    <div
      class="mt-4"
      :aria-labelledby="`question-${question.questionId}-text`"
    >
      <!-- Multiple choice (checkboxes) -->
      <div v-if="question.type === 'multiple-choice'" class="multiple-choice">
        <fieldset :aria-labelledby="`question-${question.questionId}-text`">
          <div
            v-for="answer in question.answers"
            :key="answer.answerId"
            class="mb-3 border-2 border-primary-200 hover-border-primary-400 rounded-xl "
          >
            <QuizCheckboxOption
              :inputId="`checkbox-${question.questionId}-${answer.answerId}`"
              :ariaLabelledby="`answer-text-${question.questionId}-${answer.answerId}`"
              :modelValue="selectedAnswersMap[answer.answerId] || false"
              @update:modelValue="(value) => updateCheckbox(answer.answerId, value)"
            >
              <template #text>{{ answer.answerText }}</template>
              <template #media>
                <NuxtImg 
                  v-if="answer.media" 
                  :src="answer.media" 
                  class="mt-2 rounded w-full" 
                  :alt="answer.answerText" 
                  provider="strapi"
                />
              </template>
            </QuizCheckboxOption>
          </div>
        </fieldset>
      </div>
      
      <!-- Single choice (radio buttons) -->
      <div v-else-if="question.type === 'single-choice'" class="single-choice">
        <fieldset :aria-labelledby="`question-${question.questionId}-text`">
          <legend class="sr-only">{{ question.questionText }}</legend>
          <div v-for="answer in question.answers" :key="answer.answerId" class="mb-3">
            <label :for="`radio-${question.questionId}-${answer.answerId}`" class="w-full block">
              <div 
                class="answer-option flex items-start p-3 rounded border border-slate-200 transition-all duration-200 cursor-pointer hover:border-primary-500 hover:bg-primary-50" 
                :class="{ 'border-primary-500 bg-primary-100': selectedAnswer === answer.answerId }"
              >
                <RadioButton 
                  :inputId="`radio-${question.questionId}-${answer.answerId}`"
                  :name="`question-${question.questionId}`"
                  :value="answer.answerId"
                  v-model="selectedAnswer"
                  class="mr-3 mt-1"
                  :aria-labelledby="`answer-text-${question.questionId}-${answer.answerId}`"
                />
                <div class="answer-content flex-1">
                  <div :id="`answer-text-${question.questionId}-${answer.answerId}`" class="answer-text">{{ answer.answerText }}</div>
                  <NuxtImg 
                    v-if="answer.media" 
                    :src="answer.media" 
                    class="mt-2 rounded w-full" 
                    :alt="answer.answerText"
                    provider="strapi"
                  />
                </div>
              </div>
            </label>
          </div>
        </fieldset>
      </div>
      
      <!-- Boolean (Yes/No) -->
      <div v-else-if="question.type === 'boolean'" class="boolean-choice text-center">
        <fieldset :aria-labelledby="`question-${question.questionId}-text`">
          <legend class="sr-only">{{ question.questionText }}</legend>
          <div class="flex justify-center gap-4 mt-6">
            <div>
              <label 
                :for="`boolean-true-${question.questionId}`" 
                class="inline-flex items-center px-8 py-3 border rounded-md font-medium transition-all duration-200 cursor-pointer"
                :class="selectedAnswer === 'true' ? 'bg-primary-500 text-white border-primary-500' : 'border-primary-500 text-primary-500 hover:bg-primary-50'"
              >
                <RadioButton
                  :inputId="`boolean-true-${question.questionId}`"
                  :name="`question-${question.questionId}`"
                  value="true"
                  v-model="selectedAnswer"
                  class="hidden me-4"
                />
                <i class="pi pi-check-circle text-emerald-600 mr-2"></i> Yes
              </label>
            </div>
            
            <div>
              <label 
                :for="`boolean-false-${question.questionId}`" 
                class="inline-flex items-center px-8 py-3 border rounded-md font-medium transition-all duration-200 cursor-pointer"
                :class="selectedAnswer === 'false' ? 'bg-primary-500 text-white border-primary-500' : 'border-primary-500 text-primary-500 hover:bg-primary-50'"
              >
                <RadioButton
                  :inputId="`boolean-false-${question.questionId}`"
                  :name="`question-${question.questionId}`"
                  value="false"
                  v-model="selectedAnswer"
                  class="hidden me-4"
                />
                <i class="pi pi-times-circle text-rose-600 mr-2"></i> No
              </label>
            </div>
          </div>
        </fieldset>
      </div>
      
      <!-- Scale (1-5) -->
      <div v-else-if="question.type === 'scale'" class="scale-choice max-w-[600px] mx-auto">
        <fieldset :aria-labelledby="`question-${question.questionId}-text`">
          <legend class="sr-only">{{ question.questionText }}</legend>
          <div class="flex justify-between mb-2 text-sm text-slate-600">
            <span>Not at all</span>
            <span>Extremely</span>
          </div>
          <div class="flex justify-between" role="radiogroup">
            <template v-for="value in 5" :key="value">
              <div class="text-center">
                <label 
                  :for="`scale-${question.questionId}-${value}`"
                  class="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-sm border text-lg font-bold transition-all duration-200 cursor-pointer"
                  :class="selectedAnswer === value.toString() ? 'bg-primary-500 text-white border-primary-500' : 'border-primary-500 text-primary-500 hover:bg-primary-50'"
                >
                  <RadioButton
                    :inputId="`scale-${question.questionId}-${value}`"
                    :name="`question-${question.questionId}`"
                    :value="value.toString()"
                    v-model="selectedAnswer"
                    class="me-3"
                  />
                  {{ value }}
                </label>
              </div>
            </template>
          </div>
        </fieldset>
      </div>
    </div>
    
    <!-- Navigation buttons -->
    <div class="flex justify-between mt-8">
      <Button 
        v-if="showPrevButton && question.order > 1" 
        outlined
        severity="secondary"
        @click="$emit('previous')"
        aria-label="Go to previous question"
      >
        <i class="pi pi-chevron-left mr-2"></i> Previous
      </Button>
      <div v-else></div>
      
      <Button 
        @click="submitAnswer"
        :disabled="!isValid"
        :aria-label="isLastQuestion ? 'Submit answers' : 'Go to next question'"
      >
        {{ nextButtonText }}
        <i class="pi pi-chevron-right ml-2"></i>
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  isLastQuestion: {
    type: Boolean,
    default: false
  },
  showPrevButton: {
    type: Boolean,
    default: false
  },
  // Optional prop to restore previous answers when navigating back
  initialAnswers: {
    type: [Array, String],
    default: () => []
  }
})

const emit = defineEmits(['answer', 'previous'])

// State for different question types
const selectedAnswers = ref([]) // For multiple-choice
const selectedAnswer = ref('') // For single-choice, boolean, scale
const selectedAnswersMap = ref({}) // Object map for checkboxes to avoid double firing

// Initialize with initial answers if provided
onMounted(() => {
  if (props.initialAnswers) {
    if (props.question.type === 'multiple-choice' && Array.isArray(props.initialAnswers)) {
      selectedAnswers.value = [...props.initialAnswers]
      // Initialize the map
      props.initialAnswers.forEach(id => {
        selectedAnswersMap.value[id] = true
      })
    } else if (props.question.type !== 'multiple-choice') {
      selectedAnswer.value = props.initialAnswers.toString()
    }
  }
})

// Sync the checkbox map with the selectedAnswers array
const syncSelectedAnswers = () => {
  selectedAnswers.value = Object.keys(selectedAnswersMap.value).filter(key => selectedAnswersMap.value[key])
}

// Update checkbox when directly clicking the checkbox
const updateCheckbox = (answerId, value) => {
  selectedAnswersMap.value[answerId] = value
  syncSelectedAnswers()
}

// Toggle checkbox via clicking on the content div
const toggleCheckbox = (answerId) => {
  selectedAnswersMap.value[answerId] = !selectedAnswersMap.value[answerId]
  syncSelectedAnswers()
}

// Determine if the current answer selection is valid
const isValid = computed(() => {
  if (props.question.type === 'multiple-choice') {
    return Object.values(selectedAnswersMap.value).some(value => value === true)
  } else {
    return selectedAnswer.value !== ''
  }
})

// Text for the next button
const nextButtonText = computed(() => {
  return props.isLastQuestion ? 'Submit' : 'Next'
})

// Submit the answer
const submitAnswer = () => {
  if (!isValid.value) return
  
  // Make sure selectedAnswers is synced with the map first
  if (props.question.type === 'multiple-choice') {
    syncSelectedAnswers()
  }
  
  const answer = props.question.type === 'multiple-choice' 
    ? selectedAnswers.value 
    : selectedAnswer.value
    
  emit('answer', props.question.questionId, answer)
}
</script>