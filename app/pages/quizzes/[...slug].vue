<template>
  <main class="main">
    <ClientOnly>
      <QuizContainer :quizSlug />
    </ClientOnly>
  </main>
</template>

<script setup>
const quiz = useQuizStore()
const route = useRoute()
const quizSlug = ref(route.params.slug[0])
</script>