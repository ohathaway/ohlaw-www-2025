<template>
  <NuxtLayout name="base">
    <template #specialized-header>
      <LayoutBreadcrumbNav />
    </template>

    <!-- Standardized policy content structure -->
    <div class="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <PolicyContent>
        <slot />
      </PolicyContent>
    </div>
  </NuxtLayout>
  <ClientOnly>
    <FloatingCta
      :scroll-threshold="300"
      :visible="showFloatingCta"
    />
    <BookingDialog />
  </ClientOnly>
</template>
