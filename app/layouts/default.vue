<template>
  <div class="min-h-screen flex flex-col pt-[80px]">
    <!-- Fixed header that stays at the top -->
    <div class="fixed top-0 left-0 right-0 z-50">
      <LayoutHeaderView />
    </div>
    
    <!-- Main content that starts after the header -->
    <main class="flex-1 bg-light">
      <slot />
    </main>
    
    <!-- Optional footer -->
    <LayoutFooterView />
  </div>
</template>

<script setup>
// No additional script needed
</script>