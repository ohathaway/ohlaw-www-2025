<template>
  <div
    id="toc"
    :class="['sticky py-8 ps-8 pe-4 z-[999] transition-all duration-300', scrolled ? 'top-[50px]' : 'top-[80px]']"
  >
    <h4>In This Article</h4>
    <div v-for="(brick, index) in content" :key="index">
      <div
        v-if="brick.type === 'heading' && brick.level === 1 "
        class="py-2"
      >
        <a
          :href="`#${brick.children[0].text.replaceAll(' ', '-').toLowerCase()}`"
          class="text-primary"
        >
          {{ brick.children[0].text }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RichTextBlock } from '~/types/blog'

const { content } = defineProps<{
  content: RichTextBlock[]
}>()

// Scroll detection for responsive top positioning
const scrolled = ref(false)
const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll() // Initial check
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
a {
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
</style>
