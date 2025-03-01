<template>
  <div class="header-container">
    <header :class="['site-header', { 'scrolled': scrolled }]">
      <div class="logo-wrapper">
        <NuxtLink to="/" class="logo-link">
          <img src="/img/ohlaw_icon_circle_gray.svg" alt="OH Law Colorado" class="logo-image" />
        </NuxtLink>
      </div>
      
      <div class="left-nav">
        <Menubar :model="leftMenuItems" />
      </div>
      
      <div class="right-nav">
        <Menubar :model="rightMenuItems" />
      </div>
      
      <!-- Mobile Title -->
      <div class="mobile-title">
        <h1>OH L<span style="font-size: x-large;">aw</span></h1>
      </div>

      <!-- Mobile Menu Button -->
      <Button 
        icon="pi pi-bars" 
        @click="toggleMobileMenu" 
        class="mobile-menu-button p-button-text p-button-rounded hidden"
        aria-label="Menu" 
        :dt="mobileButtonTheme"
      />
    </header>
    
    <!-- Mobile Menu Sidebar -->
    <Sidebar v-model:visible="mobileMenuVisible" position="right" class="mobile-menu">
      <div class="mobile-logo p-3">
        <img src="/img/ohlaw_icon_circle_gray.svg" alt="OH Law Colorado" class="mobile-logo-image" />
      </div>
      <Divider />
      <PanelMenu :model="allMenuItems" class="mobile-panel-menu" />
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
    className: 'p-button-primary schedule-button',
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
.header-container {
  position: relative;
}

.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  padding: 0 2rem;
  background-color: rgba(246, 246, 246, 0.95);
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  &.scrolled {
    height: 60px;
    background-color: rgba(246, 246, 246, 0.98);
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.15);
    
    .logo-image {
      width: 70px;
      height: 70px;
    }
  }
}

.logo-wrapper {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1001;
}

.logo-link {
  display: block;
}

.logo-image {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background-color: white;
}

.left-nav {
  margin-right: auto;
  padding-right: 120px; /* Space for logo */
}

.right-nav {
  margin-left: auto;
  padding-left: 120px; /* Space for logo */
}

/* Hide mobile elements on desktop */
.mobile-menu-button, .mobile-title {
  // display: none !important;
}

/* Styling for the Schedule button */
:deep(.schedule-button) {
  .p-menuitem-link {
    background-color: var(--primary-color);
    color: white;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    
    &:hover {
      background-color: var(--primary-600);
    }
  }
}

/* Mobile styles */
@media (max-width: 991px) {
  .left-nav, .right-nav {
    display: none;
  }
  
  .mobile-menu-button {
    display: block !important;
  }
  
  .site-header {
    padding: 0 1rem;
    justify-content: flex-end;
  }
  
  .logo-wrapper {
    left: 1rem;
    transform: none;
  }
  
  .logo-image {
    width: 70px;
    height: 70px;
  }
  
  .mobile-logo-image {
    width: 60px;
    height: 60px;
    display: block;
    margin: 0 auto;
  }

  .mobile-title {
    // display: flex !important;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    font-family: 'TrajanBold';
    pointer-events: none; /* Allow clicks to pass through to elements behind */
    z-index: 1000;
  }
  
  /* Ensure the h1 is properly centered */
  .mobile-title h1 {
    margin: 0;
    padding: 0;
    text-align: center;
  }
  
  .mobile-panel-menu {
    width: 100%;
  }
}
</style>