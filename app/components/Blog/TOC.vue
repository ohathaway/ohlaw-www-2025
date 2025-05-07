<template>
  <div
    id="toc"
    class="sticky top-0 py-8 ps-8 pe-4"
  >
    <h4>In This Article</h4>
    <div v-for="brick in content">
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

<script setup>
const { content } = defineProps(['content'])
</script>

<style scoped>
a {
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
</style>