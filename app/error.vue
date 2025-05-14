<template>
  <NuxtLayout name="base">
    <div class="min-h-[60vh] flex flex-col items-center justify-center py-16 px-4">
      
      <h1 class="text-4xl font-semibold text-primary-800 mb-4">
        {{ error.statusCode === 404 ? 'Page Not Found' : 'An Error Occurred' }}
      </h1>
      
      <p class="text-lg text-slate-600 mb-8 max-w-xl text-center">
        {{ error.statusCode === 404 
          ? "We couldn't find the page you're looking for. It may have been moved or no longer exists."
          : "We're sorry, something went wrong on our end. Our team has been notified of the issue."
        }}
      </p>
      
      <div class="flex gap-4">
        <Button 
          label="Return Home" 
          icon="pi pi-home" 
          @click="handleError"
          class="p-button-primary"
        />
        
        <Button 
          v-if="error.statusCode === 404"
          label="Contact Us" 
          icon="pi pi-envelope" 
          class="p-button-outlined p-button-secondary"
          @click="navigateTo('/contact')"
        />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
const props = defineProps({
  error: Object
})

const handleError = () => {
  clearError({ redirect: '/' })
}
</script>