<template>
  <div :style="backgroundStyle" class="py-8">
    <div class="text-center mb-10 pt-5">
      <h1 class="text-3xl md:text-4xl font-semibold text-slate-100">
        Resources for <span class="italic font-medium">Life and Legacy Planning</span>
      </h1>
    </div>
    
    <!-- Desktop Categories Navigation -->
    <div class="hidden lg:block">
      <Menubar 
        :model="menuItems" 
        class="border-t-6 border-b border-white mx-auto w-3/4 justify-center"
      >
        <template #item="{ item, props, hasSubmenu, root }">
          <NuxtLink v-ripple class="flex items-center mx-5" :to="item.route">
            <span class="text-xl text-white hover:text-slate-500 font-quatrocento">{{ item.label }}</span>
          </NuxtLink>
        </template>
      </Menubar>
    </div>
    
    <!-- Mobile Categories Navigation -->
    <div class="lg:hidden border-t border-b border-slate-300 py-3 mx-auto w-3/4">
      <div class="flex justify-between items-center px-4">
        <h5 class="text-base font-medium">Categories</h5>
        <Button 
          icon="pi pi-bars" 
          @click="toggleMobileMenu" 
          class="p-button-text p-button-rounded"
          aria-label="Toggle Categories Menu"
        />
      </div>
      
      <!-- Mobile Dropdown Menu -->
      <Menu 
        v-model:visible="mobileMenuVisible"
        :model="menuItems" 
        :popup="true" 
        ref="mobileMenu"
        class="w-full"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const mobileMenuVisible = ref(false)
const mobileMenu = ref(null)

const backgroundImage = '/img/blog_header.webp'

const categories = [
  {
    slug: 'legacy-planning',
    name: 'Legacy Planning'
  },
  {
    slug: 'small-business',
    name: 'Small Business'
  },
  {
    slug: 'elder-care',
    name: 'Elder Care'
  },
  {
    slug: 'being-human',
    name: 'Being Human'
  }
]

// Check if a given category is active based on the current route
const isActiveCategory = (slug) => {
  return route.path.split('/').pop() === slug
}

// Generate menu items for PrimeVue components
const menuItems = computed(() => {
  const items = [
    {
      label: 'Home',
      route: '/blog',
      class: isActiveCategory('blog') ? 'active-category' : ''
    }
  ]
  
  // Add category items
  categories.forEach(category => {
    items.push({
      label: category.name,
      route: `/blog/categories/${category.slug}`,
      class: isActiveCategory(category.slug) ? 'active-category' : ''
    })
  })
  
  return items
})

// Toggle mobile menu visibility
const toggleMobileMenu = (event) => {
  mobileMenuVisible.value = !mobileMenuVisible.value
  if (mobileMenuVisible.value) {
    mobileMenu.value.toggle(event)
  }
}

const backgroundStyle = computed(() => {
  return {
    backgroundImage: `linear-gradient(rgba(81, 115, 166, 0.85), rgba(43, 63, 94, 0.9)), url('${backgroundImage}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
})
</script>