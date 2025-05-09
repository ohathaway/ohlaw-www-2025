// composables/useAutoLayout.ts - Composable for layout selection
import { useAppConfig } from '#app'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

export const useAutoLayout = () => {
  const appConfig = useAppConfig()
  const route = useRoute()
  
  /**
   * Determines if a route matches a pattern
   * Supports simple path prefixes and '*' wildcard at the end
   */
  const matchesPattern = (routePath: string, pattern: string): boolean => {
    // If pattern ends with '/*', it's a wildcard match
    if (pattern.endsWith('/*')) {
      const prefix = pattern.slice(0, -2) // Remove the '/*'
      return routePath.startsWith(prefix)
    }
    
    // Otherwise, it's a simple prefix match
    return routePath.startsWith(pattern)
  }
  
  /**
   * Auto-selects layout based on the current route and config mapping
   */
  const autoLayout = computed(() => {
    // Get the layout mapping from app config
    const layoutMappings = appConfig.layoutMapping || {}
    
    // Check the current path against each pattern
    for (const { pattern, layout } of layoutMappings) {
      // if (matchesPattern(route.path, pattern)) {
      if (advancedMatchesPattern(route.path, pattern)) {
        return layout
      }
    }
    
    // If no matches, use the default layout
    return 'default'
  })
  
  return {
    autoLayout
  }
}

// Enhanced pattern matching (add this to useAutoLayout.ts)
const advancedMatchesPattern = (routePath: string, pattern: string): boolean => {
  // If pattern is exact (starts with '^'), it must match exactly
  if (pattern.startsWith('^')) {
    return routePath === pattern.slice(1)
  }
  
  // If pattern ends with '/**', it matches the path and all sub-paths
  if (pattern.endsWith('/**')) {
    const prefix = pattern.slice(0, -3)
    return routePath === prefix || routePath.startsWith(prefix + '/')
  }
  
  // If pattern ends with '/*', it matches any direct children only
  if (pattern.endsWith('/*')) {
    const prefix = pattern.slice(0, -2)
    
    // If the path is exactly the prefix without trailing slash, it doesn't match
    if (routePath === prefix) {
      return false
    }
    
    // Check if path is a direct child (has only one more segment)
    if (routePath.startsWith(prefix + '/')) {
      const remaining = routePath.slice(prefix.length + 1)
      return !remaining.includes('/')
    }
    
    return false
  }
  
  // Default to simple prefix match
  return routePath.startsWith(pattern)
}