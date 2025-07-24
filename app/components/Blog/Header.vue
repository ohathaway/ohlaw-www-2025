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
        class="border-t-6 border-b border-white mx-auto w-[90%] justify-center"
      >
        <template #item="{ item, props, hasSubmenu, root }">
          <NuxtLink v-ripple class="flex items-center mx-4" :to="item.route">
            <span class="text-xl text-white hover:text-slate-500 font-benguiat">{{ item.label }}</span>
          </NuxtLink>
        </template>
        <template #end>
          <Button
            icon="pi pi-search"
            rounded
            raised
            severity="secondary"
            aria-label="Search Articles"
            @click="openSearch"
          />
          <Popover ref="searchPop">
            <Form @submit="handleSearch">
              <InputGroup>
                <InputText v-model="searchTerm" autofocus />
                <Button type="submit" label="Search" icon="pi pi-search" />
              </InputGroup>
            </Form>
          </Popover>
        </template>
      </Menubar>
    </div>

    <!-- Mobile Categories Navigation -->
    <div class="lg:hidden border-t border-b border-slate-300 py-3 mx-auto w-3/4">
      <div class="flex justify-between items-center px-4">
        <h5 class="text-white font-xl">
          Categories
        </h5>
        <Button
          icon="pi pi-bars"
          class="p-button-rounded"
          severity="secondary"
          aria-label="Toggle Categories Menu"
          @click="toggleMobileMenu"
        />
        <Button
          icon="pi pi-search"
          rounded
          raised
          severity="secondary"
          aria-label="Search Articles"
          @click="mobileSearchVisible = !mobileSearchVisible"
        />
      </div>

      <!-- Mobile Dropdown Menu -->
      <Menu
        ref="mobileMenu"
        v-model:visible="mobileMenuVisible"
        :model="menuItems"
        :popup="true"
        class="w-full"
      />
      <Drawer
        v-model:visible="mobileSearchVisible"
        header="Search for resources"
        position="top"
      >
        <Form @submit="handleSearch">
          <InputGroup>
            <InputText v-model="searchTerm" autofocus />
            <Button type="submit" label="Search" icon="pi pi-search" />
          </InputGroup>
        </Form>
      </Drawer>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const mobileMenuVisible = ref(false)
const mobileMenu = ref(null)
const searchPop = ref()
const mobileSearchVisible = ref(false)

const blogStore = useBlogStore()
const { searchTerm } = storeToRefs(blogStore)

const backgroundImage = '/img/blog_header.webp'

const categories = [
  {
    slug: 'legacy-planning',
    name: 'Legacy Planning',
  },
  {
    slug: 'small-business',
    name: 'Small Business',
  },
  {
    slug: 'elder-care',
    name: 'Elder Care',
  },
  {
    slug: 'being-human',
    name: 'Being Human',
  },
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
      class: isActiveCategory('blog') ? 'active-category' : '',
    },
  ]

  // Add category items
  categories.forEach((category) => {
    items.push({
      label: category.name,
      route: `/blog/categories/${category.slug}`,
      class: isActiveCategory(category.slug) ? 'active-category' : '',
    })
  })

  return convertRoutesToCommands(items)
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
    backgroundPosition: 'center',
  }
})

const openSearch = (event) => {
  searchPop.value.toggle(event)
}

const handleSearch = () => {
  blogStore.searchPosts()
  router.push({ path: '/blog/search', query: { search: searchTerm.value } })

  // Close mobile drawer
  mobileSearchVisible.value = false

  // Close desktop popover if it exists (use try/catch to handle any edge cases)
  try {
    if (searchPop.value) {
      searchPop.value.hide()
    }
  }
  catch (error) {
    // Silently handle popover errors (likely means we're on mobile)
    console.debug('Popover hide error (expected on mobile):', error)
  }
}
</script>

<style scoped>
.active-category {
  .p-menubar-item-content {
    color: var(--p-menubar-item-focus-color) !important;
    background: var(--p-menubar-item-focus-background) !important;
    border-radius: var(--p-menubar-base-item-border-radius) !important;
  }
}
</style>
