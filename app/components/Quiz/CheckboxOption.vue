<!-- app/components/Quiz/CheckBox.vue-->
<template>
  <div class="p-1">
    <div 
      class="answer-option flex items-start p-3 transition-all duration-200 cursor-pointer hover:bg-primary-50 rounded-xl" 
      :class="props.modelValue"
      @click="toggle"
    >
      <Checkbox 
        :inputId="props.inputId"
        class="mr-3 mt-1"
        v-model="props.modelValue"
        binary
        @update:modelValue="$emit('update:modelValue', $event)"
        :aria-labelledby="props.ariaLabelledby"
      />
      <div class="answer-content flex-1">
        <div :id="props.ariaLabelledby" class="answer-text">
          <slot name="text"></slot>
        </div>
        <slot name="media"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  inputId: {
    type: String,
    required: true
  },
  ariaLabelledby: {
    type: String,
    required: true
  },
  modelValue: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const toggle = () => {
  emit('update:modelValue', !props.modelValue)
}
</script>