<template>
  <div class="rich-text prose ">
    <template v-for="(brick, brickIndex) in block" :key="brickIndex">
      <!-- headings -->
      <h2
        v-if="brick.type === 'heading' && brick.level === 1"
        :id="brick.children[0].text.replaceAll(' ', '-').toLowerCase()"
      >
        {{ brick.children[0].text }}
      </h2>
      <h3 v-else-if="brick.type === 'heading' && brick.level === 2">
        {{ brick.children[0].text }}
      </h3>
      <h4 v-else-if="brick.type === 'heading' && brick.level === 3">
        {{ brick.children[0].text }}
      </h4>

      <!-- lists -->
      <BlogRichTextOrderedList
        v-else-if="brick.type === 'list' && brick.format === 'ordered'"
        :brick="brick"
      />
      <BlogRichTextUnOrderedList
        v-else-if="brick.type === 'list' && brick.format === 'unordered'"
        :brick="brick"
      />

      <!-- paragraphs -->
      <p v-else-if="brick.type === 'paragraph'">
        <template v-for="(child, childIndex) in brick.children" :key="childIndex">
          <BlogRichTextModifier v-if="isModifier(child)" :brick="child" />
          <BlogRichTextLink
            v-else-if="child.type === 'link'"
            :brick="child"
          />
          <span v-else>
            {{ child.text }}
          </span>
        </template>
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { RichTextBlock } from '~/types/blog'

const { block } = defineProps<{
  block: RichTextBlock[]
}>()
</script>
