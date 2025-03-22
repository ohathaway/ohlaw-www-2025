<template>
  <div class="grid grid-cols-2">
    <div>
      <h5>Primary Office</h5>
      <ul>
        <li>2580 E Harmony Rd</li>
        <li>Suite 201</li>
        <li>Fort Collins, CO 80528</li>
      </ul>
    </div>
    <div>
      <iframe
        :src="foco"
        width="400"
        height="250"
        class="border-2 border-surface-30 rounded-sm"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      />
    </div>
  </div>
</template>

<script setup>
const { addressIframes: { foco } } = useAppConfig()
</script>