<template>
  <div class="media-focus-wrapper py-8 md:px-8">
    <NuxtImg
      class="w-full border border-gray-200 rounded-xl"
      :provider="provider"
      :src="src"
      :title="title"
      placeholder
    />
  </div>
</template>

<script setup>
const { provider, source, title } = defineProps({
  provider: {
    type: String,
    default: 'strapi',
  },
  source: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})

const src = computed(() => {
  const isUrl = source.includes('https://')
  const isAbsolute = source.startsWith('/')

  // console.debug(`${source} isUrl? ${isUrl}`)
  return isUrl || isAbsolute
    ? source
    : `/${source}`
})
</script>
