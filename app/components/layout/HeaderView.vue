<template>
  <div class="relative">
    <!-- Header Bar -->
    <header :class="['fixed top-0 left-0 right-0 grid grid-cols-9 md:grid-cols-3 items-center px-8 bg-[rgba(246,246,246,0.95)] transition-all duration-300 ease-in-out z-[1000] shadow-md', 
      scrolled ? 'h-[50px] bg-[rgba(246,246,246,0.98)] shadow-lg text-sm' : 'h-[80px]']">
      
      <!-- Mobile Menu Button -->
      <div class="lg:hidden justify-start">
        <Button 
          icon="pi pi-bars" 
          @click="toggleMobileMenu" 
          class="p-button-text p-button-rounded"
          aria-label="Menu" 
          :dt="mobileButtonTheme"
        />
      </div>
      
      <!-- Mobile Brand -->
      <div class="lg:hidden ps-7 col-start-2 col-span-6">
        <NuxtLink to="/" class="block">
          <h1 class="font-[TrajanBold]">The Law Offices of<br />Owen Hathaway</h1>
        </NuxtLink>
      </div>

      <!-- Mobile Logo -->
      <div class="lg:hidden ps-4 col-start-8 col-span-2">
        <NuxtLink to="/" class="block">
          <img 
            src="/img/ohlaw_icon_circle_gray.svg" 
            alt="OH Law Colorado" 
            class="rounded-full shadow-md" 
              
          />
        </NuxtLink>
      </div>

      <!-- Left Menu -->
      <div class="lg:block hidden justify-self-end pr-4">
        <Menubar class="lg:block hidden" :model="leftMenuItems">
          <template #item="{ item, props, hasSubmenu }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
              <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                  <span :class="item.icon" />
                  <span>{{ item.label }}</span>
              </a>
            </router-link>
            <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
              <span :class="item.icon" />
              <span>{{ item.label }}</span>
              <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down" />
            </a>
          </template>
        </Menubar>
      </div>
      
      <!-- Center Column (for logo) -->
      <div class="flex justify-center">
        <!-- Intentionally empty - logo is positioned outside the grid -->
      </div>
      
      <!-- Right Column -->
      <div class="flex justify-between">
        <!-- Right Menu -->
        <div class="lg:block hidden pl-4">
          <Menubar :model="rightMenuItems" />
        </div>
      </div>
    </header>
    
    <!-- Logo (positioned absolutely relative to the viewport) -->
    <div class="fixed left-1/2 z-[1001] transition-all duration-300 ease-in-out hidden lg:block"
         :class="scrolled ? 'top-[-10px] -translate-x-1/2' : 'lg:top-[-40px] -translate-x-1/2'">
      <NuxtLink to="/" class="block">
        <img 
          src="/img/ohlaw_icon_circle_gray.svg" 
          alt="OH Law Colorado" 
          :class="['rounded-full shadow-md transition-all duration-300 ease-in-out bg-white', 
            scrolled ? 'w-[70px] h-[70px] bottom-[500px]' : 'lg:w-[140px] lg:h-[140px] md:w-[120px] md:h-[120px] w-[100px] h-[100px]']" 
        />
      </NuxtLink>
    </div>
    
    <!-- Mobile Menu Sidebar -->
    <MobileMenuSidebar
      v-model:visible="mobileMenuVisible"
      position="left"
      sidebarClass="lg:hidden"
      logoSrc="/img/ohlaw_icon_circle_gray.svg"
      logoAlt="OH Law Colorado"
      :menuItems="allMenuItems"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import MobileMenuSidebar from './MobileMenuSidebar.vue'

// Menu items for left side of logo
const leftMenuItems = ref([
  {
    label: 'Services',
    items: [
      { label: 'Estate Planning', route: '/services/estate-planning' },
      { label: 'Bankruptcy', route: '/services/bankruptcy' },
      { label: 'Small Business', route: '/services/small-business' },
      { label: 'Nonprofits', route: '/services/nonprofits' }
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