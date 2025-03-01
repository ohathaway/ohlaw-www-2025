<template>
  <div class="relative">
    <header :class="['fixed top-0 left-0 right-0 flex justify-between items-center px-8 bg-[rgba(246,246,246,0.95)] transition-all duration-300 ease-in-out z-[1000] shadow-md', 
      scrolled ? 'h-[50px] bg-[rgba(246,246,246,0.98)] shadow-lg' : 'h-[80px]']">
      <div class="absolute left-1/2 -translate-x-1/2 z-[1001] lg:block">
        <NuxtLink to="/" class="block">
          <img 
            src="/img/ohlaw_icon_circle_gray.svg" 
            alt="OH Law Colorado" 
            :class="['rounded-full shadow-md transition-all duration-300 ease-in-out bg-white', 
              scrolled ? 'w-[70px] h-[70px]' : 'w-[160px] h-[160px]']" 
          />
        </NuxtLink>
      </div>
      
      <div class="mr-auto pr-[120px] lg:block hidden">
        <Menubar :model="leftMenuItems" />
      </div>
      
      <div class="ml-auto pl-[120px] lg:block hidden">
        <Menubar :model="rightMenuItems" />
      </div>
      
      <!-- Mobile Menu Button -->
      <div class="lg:hidden justify-end">
        <Button 
          icon="pi pi-bars" 
          @click="toggleMobileMenu" 
          class="p-button-text p-button-rounded"
          aria-label="Menu" 
          :dt="mobileButtonTheme"
        />
      </div>
    </header>
    
    <!-- Mobile Menu Sidebar -->
    <Sidebar v-model:visible="mobileMenuVisible" position="left" class="lg:hidden">
      <div class="p-3">
        <img src="/img/ohlaw_icon_circle_gray.svg" alt="OH Law Colorado" class="w-[60px] h-[60px] mx-auto block" />
      </div>
      <Divider />
      <PanelMenu :model="allMenuItems" class="w-full" />
    </Sidebar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Menu items for left side of logo
const leftMenuItems = ref([
  {
    label: 'Services',
    items: [
      { label: 'Estate Planning', icon: 'pi pi-file', to: '/services/estate-planning' },
      { label: 'Bankruptcy', icon: 'pi pi-calculator', to: '/services/bankruptcy' },
      { label: 'Small Business', icon: 'pi pi-briefcase', to: '/services/small-business' },
      { label: 'Nonprofits', icon: 'pi pi-heart', to: '/services/nonprofits' }
    ]
  },
  {
    label: 'About',
    to: '/about'
  }
])

// Menu items for right side of logo
const rightMenuItems = ref([
  {
    label: 'Blog',
    to: '/blog'
  },
  {
    label: 'Contact',
    to: '/contact'
  },
  {
    label: 'Schedule',
    className: 'schedule-button',
    to: '/schedule'
  }
])

// Combine menu items for mobile view
const allMenuItems = computed(() => {
  return [
    ...leftMenuItems.value,
    ...rightMenuItems.value
  ]
})

// Mobile menu state
const mobileMenuVisible = ref(false)
const toggleMobileMenu = () => {
  mobileMenuVisible.value = !mobileMenuVisible.value
};

// Scroll detection for header styling
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

// theme token overrides
const mobileButtonTheme = ref({
  textPrimaryColor: '{slate-500}',
  textPrimaryHoverBackground: '{slate-600}'
})
</script>

<style lang="scss">
/* Styling for the Schedule button - keeping this as a scoped style since it targets PrimeVue components */
/*
:deep(.schedule-button) .p-menuitem-link {
  @apply bg-primary text-white rounded px-4 py-2;
}

:deep(.schedule-button) .p-menuitem-link:hover {
  @apply bg-primary-600;
}
*/
</style>