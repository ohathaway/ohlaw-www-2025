/**
 * Composable for smooth scrolling to elements with flexible targeting
 * Provides reusable scroll functionality with fallback options
 */
export const useScrollTo = () => {
  /**
   * Smoothly scroll to a target element with customizable positioning
   * @param {string} target - CSS selector or ID for scroll target
   * @param {Object} options - Scroll configuration options
   * @param {number} options.offset - Pixels to offset from element top (default: 100)
   * @param {string} options.behavior - Scroll behavior: 'smooth' or 'instant' (default: 'smooth')
   * @param {string} options.fallbackTarget - Fallback selector if primary target not found
   * @param {boolean} options.scrollToTop - If true and no targets found, scroll to page top (default: true)
   * @returns {Promise<boolean>} - Promise that resolves to true if scroll succeeded, false otherwise
   */
  const scrollToElement = async (target, options = {}) => {
    const {
      offset = 100,
      behavior = 'smooth',
      fallbackTarget = null,
      scrollToTop = true
    } = options

    return new Promise((resolve) => {
      nextTick(() => {
        // Try primary target
        let element = document.querySelector(target)
        let targetOffset = offset

        // Try fallback target if primary fails
        if (!element && fallbackTarget) {
          element = document.querySelector(fallbackTarget)
          targetOffset = offset / 2 // Less aggressive offset for fallback
        }

        if (element) {
          // Calculate position with offset
          const elementRect = element.getBoundingClientRect()
          const offsetTop = window.pageYOffset + elementRect.top - targetOffset

          window.scrollTo({
            top: Math.max(0, offsetTop),
            behavior
          })
          
          resolve(true)
        } else if (scrollToTop) {
          // Final fallback to page top
          window.scrollTo({
            top: 0,
            behavior
          })
          
          resolve(false) // Indicate fallback was used
        } else {
          resolve(false) // No action taken
        }
      })
    })
  }

  /**
   * Scroll to top of page
   * @param {string} behavior - Scroll behavior: 'smooth' or 'instant' (default: 'smooth')
   */
  const scrollToTop = (behavior = 'smooth') => {
    window.scrollTo({
      top: 0,
      behavior
    })
  }

  /**
   * Scroll to element with ID (convenience method)
   * @param {string} id - Element ID (without #)
   * @param {Object} options - Same options as scrollToElement
   */
  const scrollToId = (id, options = {}) => {
    return scrollToElement(`#${id}`, options)
  }

  /**
   * Scroll to element with class (convenience method)
   * @param {string} className - CSS class name (without .)
   * @param {Object} options - Same options as scrollToElement
   */
  const scrollToClass = (className, options = {}) => {
    return scrollToElement(`.${className}`, options)
  }

  return {
    scrollToElement,
    scrollToTop,
    scrollToId,
    scrollToClass
  }
}