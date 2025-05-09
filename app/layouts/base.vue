// layouts/base.vue
<template>
  <div class="min-h-screen flex flex-col pt-[80px]">
    <!-- Fixed header that stays at the top -->
    <div class="fixed top-0 left-0 right-0 z-50">
      <LayoutHeaderView />
    </div>
    
    <!-- Conditional specialized headers -->
    <slot name="specialized-header"></slot>
    
    <!-- Main content that starts after the header -->
    <main class="flex-1 bg-slate-50">
      <slot />
    </main>
    
    <!-- Footer -->
    <LayoutFooterView />
  </div>
</template>