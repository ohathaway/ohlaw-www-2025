// app/composables/useBackgroundStyle.js
import { computed } from 'vue'

/**
 * Composable for generating background styles with optional overlay gradients
 * @param {Object} options - Configuration options
 * @param {Ref|String} options.image - Image URL (can be a ref or a static string)
 * @param {String} options.overlay - Optional overlay gradient (default: primary blue gradient)
 * @param {String} options.size - Background size property (default: 'cover')
 * @param {String} options.position - Background position property (default: 'center')
 * @param {Boolean} options.noOverlay - If true, skips the overlay gradient
 * @returns {Object} Computed style object for background
 */
export function useBackgroundStyle(options = {}) {
  // Default overlay is the primary blue gradient
  const defaultOverlay = 'rgba(38, 70, 124, 0.85), rgba(27, 53, 97, 0.9)'

  return computed(() => {
    // Handle both ref and direct string values for image
    const imageUrl = typeof options.image === 'function'
      ? options.image.value
      : options.image

    // If no image is provided, return empty object or fallback
    if (!imageUrl) return options.fallback || {}

    // Build the background image with or without gradient overlay
    const backgroundImage = options.noOverlay
      ? `url('${imageUrl}')`
      : `linear-gradient(${options.overlay || defaultOverlay}), url('${imageUrl}')`

    return {
      backgroundImage,
      backgroundSize: options.size || 'cover',
      backgroundPosition: options.position || 'center',
      backgroundRepeat: options.repeat || 'no-repeat',
    }
  })
}

// Example usage:
// Basic usage with a ref from the page content
// const heroBackground = useBackgroundStyle({
//   image: computed(() => pageContent.value.image)
// })

// Usage with custom overlay
// const customBackground = useBackgroundStyle({
//   image: '/images/hero.jpg',
//   overlay: 'rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)'
// })

// Usage without overlay
// const plainBackground = useBackgroundStyle({
//   image: bannerImage,
//   noOverlay: true,
//   position: 'top center'
// })
