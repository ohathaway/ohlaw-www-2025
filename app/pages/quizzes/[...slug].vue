<template>
  <main class="main">
    <ClientOnly>
      <QuizContainer :quizSlug />
      <template #fallback>
        <div class="max-w-[800px] my-5 mx-auto p-[1rem] md:p-[2rem] bg-white rounded-3xl drop-shadow-lg">
          <!-- Pre-hydration loading state -->
          <div class="quiz-loading">
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
              <div class="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p class="text-gray-600">Loading quiz...</p>
              <p class="text-sm text-gray-500 mt-2">Please wait while we prepare your assessment</p>
            </div>
          </div>
        </div>
      </template>
    </ClientOnly>
  </main>
</template>

<script setup>
const quiz = useQuizStore()
const route = useRoute()
const quizSlug = ref(route.params.slug[0])
</script>
