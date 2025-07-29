<template>
  <div class="mb-4">
    <div class="flex items-center text-sm mb-2">
      Question {{ currentQuestion }} of {{ totalQuestions }}
    </div>
    <ProgressBar :value="percent" />
  </div>
</template>

<script setup>
const props = defineProps({
  currentQuestion: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  percent: {
    type: Number,
    required: true,
  },
})
</script>
