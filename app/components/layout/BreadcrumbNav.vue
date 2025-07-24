// components/layout/BreadcrumbNav.vue
<template>
  <Breadcrumb
    :model="breadcrumbItems"
    :home="homeItem"
    class="py-3 px-4 md:px-8 bg-white border-b border-slate-200 shadow-sm mb-0"
  >
    <template #item="{ item, props }">
      <!-- {{ item }} -->
      <!-- {{ props }} -->
      <NuxtLink
        v-if="item.route"
        v-slot="{ href, navigate }"
        :to="item.route"
      >
        <i :class="item.icon" />
        {{ item.label }}
      </NuxtLink>
      <a
        v-else
        :href="item.url"
        :target="item.target"
        v-bind="props.action"
      >
        {{ item.label }}
      </a>
    </template>
  </Breadcrumb>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Route and router instances
const route = useRoute()
const router = useRouter()

/**
 * Home item configuration for the breadcrumb
 */
const homeItem = {
  icon: 'pi pi-home',
  route: '/',
}

/**
 * Mapping of route segments to human-readable titles
 * Used as fallback when no meta title is available
 */
const { routeTitles: routeTitleMap } = useAppConfig()

/**
 * Gets the label for a route segment by checking route metadata first,
 * then the mapping, and finally formatting the segment as a fallback
 *
 * @param {string} segment - The route segment
 * @param {string} fullPath - The full path up to this segment
 * @returns {string} The human-readable label
 */
const getLabelForSegment = (segment, fullPath) => {
  // Try to get the title from route metadata first
  const matchedRoute = router.getRoutes().find(r => r.path === fullPath)

  // Check for meta title in the matched route
  if (matchedRoute?.meta?.title) {
    return matchedRoute.meta.title
  }

  // Check our predefined mapping
  if (routeTitleMap[segment]) {
    return routeTitleMap[segment]
  }

  // Format the segment as fallback (capitalize, replace hyphens with spaces)
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Creates a breadcrumb item from a route segment
 *
 * @param {string} segment - The route segment
 * @param {string} path - The current accumulated path
 * @param {boolean} isLast - Whether this is the last segment (current page)
 * @returns {Object} The breadcrumb item
 */
const createBreadcrumbItem = (segment, path, isLast) => {
  const label = getLabelForSegment(segment, path)

  // If it's the last segment (current page), don't make it a link
  if (isLast) {
    // console.debug('this one is last, returning { label }', label)
    return { label }
  }

  return {
    label,
    route: path,
  }
}

/**
 * Computes breadcrumb items based on the current route
 */
const breadcrumbItems = computed(() => {
  // Split the route path into segments, removing empty strings
  const pathSegments = route.path.split('/').filter(segment => segment)

  // Generate breadcrumb items for each segment
  return pathSegments.reduce((items, segment, index) => {
    // Build the path up to this segment
    const currentPath = '/' + pathSegments.slice(0, index + 1).join('/')

    // Check if this is the last segment
    const isLast = index === pathSegments.length - 1
    // console.debug('isLast:', isLast)

    // Create and add the breadcrumb item
    items.push(createBreadcrumbItem(segment, currentPath, isLast))

    return items
  }, [])
})
</script>
