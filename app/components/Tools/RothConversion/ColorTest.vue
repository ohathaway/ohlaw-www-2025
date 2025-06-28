<template>
  <div class="p-4 space-y-4">
    <h3 class="text-lg font-semibold">Semantic Color Test</h3>
    
    <!-- Test Tailwind semantic classes -->
    <div class="grid grid-cols-4 gap-4">
      <div class="bg-success-100 border border-success-500 text-success-800 p-3 rounded">
        <div class="text-sm font-medium">Success</div>
        <div class="text-xs">bg-success-100</div>
      </div>
      <div class="bg-warning-100 border border-warning-500 text-warning-800 p-3 rounded">
        <div class="text-sm font-medium">Warning</div>
        <div class="text-xs">bg-warning-100</div>
      </div>
      <div class="bg-danger-100 border border-danger-500 text-danger-800 p-3 rounded">
        <div class="text-sm font-medium">Danger</div>
        <div class="text-xs">bg-danger-100</div>
      </div>
      <div class="bg-info-100 border border-info-500 text-info-800 p-3 rounded">
        <div class="text-sm font-medium">Info</div>
        <div class="text-xs">bg-info-100</div>
      </div>
    </div>

    <!-- Test with PrimeVue components -->
    <div class="space-y-2">
      <Button severity="success" label="Success Button" />
      <Button severity="warn" label="Warning Button" />
      <Button severity="danger" label="Danger Button" />
      <Button severity="info" label="Info Button" />
    </div>

    <!-- Test Messages -->
    <div class="space-y-2">
      <Message severity="success">This is a success message</Message>
      <Message severity="warn">This is a warning message</Message>
      <Message severity="error">This is an error message</Message>
      <Message severity="info">This is an info message</Message>
    </div>
  </div>
</template>

<script setup>
// No script needed for color testing
</script>