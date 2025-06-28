<template>
  <div class="relative inline-block ml-2">
    <button
      type="button"
      class="w-4 h-4 bg-slate-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-slate-700 focus:outline-none"
      @mouseenter="showTooltip = true"
      @mouseleave="showTooltip = false"
      @focus="showTooltip = true"
      @blur="showTooltip = false"
    >
      i
    </button>
    <div 
      v-if="showTooltip" 
      class="absolute z-10 w-64 p-3 text-sm text-white bg-gray-800 rounded-lg shadow-lg -top-2 left-6 transform -translate-y-full"
    >
      <div class="relative">
        {{ tooltip }}
        <div class="absolute top-full left-4 transform -translate-x-1/2">
          <div class="w-2 h-2 bg-gray-800 rotate-45"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tooltip: {
    type: String,
    required: true
  }
})

const showTooltip = ref(false)
</script>