<template>
  <div class="collapsible">
    <slot 
      name="trigger" 
      :expanded="isExpanded" 
      :toggle="toggle"
    />
    
    <Transition
      name="collapse"
      @enter="onEnter"
      @leave="onLeave"
    >
      <div v-show="isExpanded" class="collapsible-content">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface Props {
  defaultExpanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultExpanded: false
})

const isExpanded = ref(props.defaultExpanded)

const toggle = () => {
  isExpanded.value = !isExpanded.value
}

// Animation helpers
const onEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = 'auto'
  const height = getComputedStyle(element).height
  element.style.height = '0'
  element.offsetHeight // force reflow
  element.style.height = height
}

const onLeave = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = getComputedStyle(element).height
  element.offsetHeight // force reflow
  element.style.height = '0'
}
</script>

<style scoped>
.collapsible-content {
  overflow: hidden;
}

.collapse-enter-active,
.collapse-leave-active {
  transition: height 0.3s ease;
}

.collapse-enter-from,
.collapse-leave-to {
  height: 0;
}
</style>