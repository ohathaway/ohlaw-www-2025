<template>
  <div class="relative">
    <!-- Header Bar -->
    <header :class="['fixed top-0 left-0 right-0 grid grid-cols-9 md:grid-cols-3 items-center px-4 xl:px-8 bg-[rgba(246,246,246,0.95)] transition-all duration-300 ease-in-out z-[1000] shadow-md', 
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
      <div
        class="lg:hidden ps-7 col-start-2 col-span-6"
      >
        <NuxtLink to="/" class="block">
          <h1 :class="['font-[TrajanBold] text-sm text-center font-trajan pt-2',
            scrolled ? 'hidden' : '']">
            The Law Offices<br />of<br />Owen Hathaway
          </h1>
          <h1 :class="['font-[TrajanBold] text-sm text-center font-trajan pt-2',
            scrolled ? '' : 'hidden']">
            <span class="md:hidden">OH Law</span>
            <span class="hidden md:block">The Law Offices of Owen Hathaway</span>
          </h1>
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
      <div class="lg:block hidden justify-self-end pr-2 xl:pr-4">
        <Menubar
          class="lg:block hidden"
          :model="leftMenuItems"
          :dt="menuItemTheme"
        >
          <template #item="{ item, props, hasSubmenu }">
            <router-link
              v-if="item.route"
              v-slot="{ href, navigate }"
              :to="item.route"
              custom
            >
              <a
                v-ripple
                v-tooltip.bottom="item.tooltip"
                :href="href"
                v-bind="props.action"
                @click="navigate"
              >
                <span :class="item.icon" />
                <span :class="(item.label === 'Contact' || item.label === 'About') ? 'max-[1540px]:hidden min-[1540px]:inline' : ''">{{ item.label }}</span>
              </a>
            </router-link>
            <a
              v-else
              v-ripple
              v-tooltip.bottom="item.tooltip"
              :href="item.url"
              :target="item.target"
              v-bind="props.action"
            >
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
        <div class="lg:block hidden pl-2 xl:pl-4">
          <Menubar
            :model="rightMenuItems"
            :dt="menuItemTheme"
          >
            <template #item="{ item, props, hasSubmenu }">
              <router-link
                v-if="item.route"
                v-slot="{ href, navigate }"
                :to="item.route"
                custom
              >
                <a
                  v-ripple
                  v-tooltip.bottom="item.tooltip"
                  :href="href"
                  v-bind="props.action"
                  @click="navigate"
                  :aria-label="item.ariaLabel || item.label"
                >
                  <span
                    :class="item.icon"
                  />
                  <span
                    v-if="!item.iconOnly"
                    class="max-[1333px]:hidden min-[1333px]:inline"
                  >
                    {{ item.label }}
                  </span>
                </a>
              </router-link>
              <a
                v-else
                v-ripple
                v-tooltip.bottom="item.tooltip"
                :href="item.url"
                :target="item.target"
                v-bind="props.action"
                :aria-label="item.ariaLabel || item.label"
              >
                <span :class="item.icon" />
                <span v-if="!item.iconOnly">{{ item.label }}</span>
                <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down" />
              </a>
            </template>
          </Menubar>
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
    tooltip: 'Learn more about the services we provide',
    items: [
      { label: 'Estate Planning', route: '/services/estate-planning' },
      { label: 'Bankruptcy', route: '/services/bankruptcy' },
      { label: 'Small Business', route: '/services/small-business' },
      { label: 'Nonprofits', route: '/services/nonprofits' }
    ]
  },
  {
    label: 'Contact',
    tooltip: 'Here are the many ways to get in touch with us',
    route: '/contact',
    icon: 'pi pi-phone',
    ariaLabel: 'Contact Us'
  },
  {
    label: 'About',
    tooltip: 'Learn about our firm and why we do what we do the way we do it',
    route: '/about',
    icon: 'pi pi-info-circle',
    ariaLabel: 'About Us'
  }
])

// Menu items for right side of logo
const rightMenuItems = ref([
  {
    label: 'Learning Resources',
    tooltip: 'We have tons of useful and entertaining articles on Life and Legacy and Being Human',
    icon: 'bi bi-book',
    route: '/blog'
  },
  {
    label: 'Make a Payment',
    tooltip: `Make a payment. You'll need your invoice number so we can credit it to your account`,
    route: '/make-a-payment',
    icon: 'bi bi-coin',
    iconOnly: true,
    ariaLabel: 'Make a Payment'
  },
  {
    label: 'Client Login',
    tooltip: 'Login to our client portal (third-party)',
    url: 'https://ohlaw.portal.lawmatics.com/login',
    icon: 'pi pi-user',
    iconOnly: true,
    ariaLabel: 'Client Login Portal'
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

const menuItemTheme = ref({
  itemFocusBackground: 'transparent',
  itemFocusColor: '{stone-400}'
})
</script>

<style scoped>
.p-menubar-item-content:hover {
  background: transparent !important;
}

.pi {
  font-size: inherit;
}
</style>