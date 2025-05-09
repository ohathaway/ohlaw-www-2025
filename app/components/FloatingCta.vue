<template>
  <Teleport to="body">
    <div 
      v-show="isVisible" 
      ref="ctaElement"
      :class="['floating-cta', {'is-dragging': isDragging, 'is-mobile': isMobile}]"
      :style="ctaStyle"
      @mousedown="startDrag"
      @touchstart="startDrag"
    >
      <Button 
        class="cta-button" 
        @click="handleButtonClick"
        raised
      >
        <i class="bi bi-calendar-check me-4"></i>
        <span v-if="!isMobile">Schedule a Consultation</span>
        <span v-else>Book Now</span>
        <i @click="dismiss" class="pi pi-times-circle btn-close text-gray-300 absolute top-[20px] right-[20px]"></i>
      </Button>
    </div>
  </Teleport>
</template>

<script setup>
const { bookingDialogVisible } = storeToRefs(useMainStore())

// Props with defaults
const props = defineProps({
  scrollThreshold: {
    type: Number,
    default: 300
  },
  dismissible: {
    type: Boolean,
    default: true
  },
  initialPosition: {
    type: Object,
    default: () => ({ bottom: '30px', right: '30px' })
  },
  visible: {
    type: Boolean,
    default: false
  }

})

// State
const isVisible = ref(props.visible)
const isDismissed = ref(false)
const isDragging = ref(false)
const isMobile = ref(false)
const position = ref({ ...props.initialPosition })
const startPos = ref({ x: 0, y: 0 })
const ctaElement = ref(null)
const wasMoved = ref(false)
const dragStartTime = ref(0)

// Computed style for positioning
const ctaStyle = computed(() => {
  return {
    ...position.value,
    cursor: isDragging.value ? 'grabbing' : 'grab'
  }
})

// Check if mobile based on screen width
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

// Show/hide based on scroll position
const handleScroll = () => {
  console.debug('isDismissed.value:', isDismissed.value)
  if (isDismissed.value) return
  console.debug('not dismissed')
  isVisible.value = window.scrollY > props.scrollThreshold || props.visible
}

// Handle button click - only open the modal if not coming from a drag operation
const handleButtonClick = (event) => {
  // Check if this click follows a drag operation
  if (isDragging.value || wasMoved.value) {
    // Prevent the click from opening the modal
    event.preventDefault()
    event.stopPropagation()
    return
  }

  // If not from a drag operation, open the booking modal
  bookingDialogVisible.value = true
}

// Allow user to dismiss the CTA
const dismiss = () => {
  if (props.dismissible) {
    isVisible.value = false
    isDismissed.value = true
    
    // Store in session storage so it stays dismissed during this visit
    try {
      sessionStorage.setItem('floatingCtaDismissed', 'true')
    } catch (e) {
      console.warn('Unable to store CTA state in session storage', e)
    }
  }
}

// Drag handling
const startDrag = (event) => {
  // Prevent on mobile in horizontal orientation to avoid interfering with scrolling
  if (isMobile.value && window.innerWidth > window.innerHeight) return

  // Use touch coordinates if available, otherwise use mouse coordinates
  const clientX = event.touches ? event.touches[0].clientX : event.clientX
  const clientY = event.touches ? event.touches[0].clientY : event.clientY
  
  isDragging.value = true
  wasMoved.value = false
  dragStartTime.value = Date.now()
  
  // Save the starting position
  startPos.value = {
    x: clientX,
    y: clientY,
    left: ctaElement.value.offsetLeft,
    top: ctaElement.value.offsetTop
  }
  
  // Add event listeners for drag and end
  if (event.touches) {
    document.addEventListener('touchmove', handleDrag, { passive: false })
    document.addEventListener('touchend', endDrag)
  } else {
    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('mouseup', endDrag)
  }
  
  // Prevent default to avoid text selection during drag
  event.preventDefault()
}

const handleDrag = (event) => {
  if (!isDragging.value) return
  
  // Use touch coordinates if available, otherwise use mouse coordinates
  const clientX = event.touches ? event.touches[0].clientX : event.clientX
  const clientY = event.touches ? event.touches[0].clientY : event.clientY
  
  // Calculate the new position
  const offsetX = clientX - startPos.value.x
  const offsetY = clientY - startPos.value.y
  
  // Check if we've moved at least 5px in any direction
  // This helps differentiate between a click and a drag
  if (Math.abs(offsetX) > 5 || Math.abs(offsetY) > 5) {
    wasMoved.value = true
  }
  
  // Calculate new left/top positions
  let newLeft = startPos.value.left + offsetX
  let newTop = startPos.value.top + offsetY
  
  // Constrain to window bounds
  const maxLeft = window.innerWidth - ctaElement.value.offsetWidth
  const maxTop = window.innerHeight - ctaElement.value.offsetHeight
  
  newLeft = Math.max(0, Math.min(newLeft, maxLeft))
  newTop = Math.max(0, Math.min(newTop, maxTop))
  
  // Update position to be based on corners instead of left/top
  // This maintains the same visual position when window resizes
  position.value = {
    left: `${newLeft}px`,
    top: `${newTop}px`,
    right: 'auto',
    bottom: 'auto'
  }
  
  // Prevent default to stop page scrolling during drag on touch devices
  event.preventDefault()
}

const endDrag = (event) => {
  // Calculate drag duration
  const dragDuration = Date.now() - dragStartTime.value
  
  // Clean up drag state
  isDragging.value = false
  
  // Remove event listeners
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', endDrag)
  document.removeEventListener('touchmove', handleDrag)
  document.removeEventListener('touchend', endDrag)
  
  // Save position to localStorage if the component was actually moved
  if (wasMoved.value) {
    try {
      localStorage.setItem('floatingCtaPosition', JSON.stringify(position.value))
    } catch (e) {
      console.warn('Unable to store CTA position in local storage', e)
    }
    
    // Prevent click events from firing after drag
    if (event && event.type === 'mouseup' && event.target) {
      // Create and dispatch a custom event to cancel the upcoming click
      const preventClickEvent = new CustomEvent('preventClick', { bubbles: true })
      event.target.dispatchEvent(preventClickEvent)
    }
  }
}

// Lifecycle hooks
onMounted(() => {
  // Check for saved position
  try {
    // Listen for the custom preventClick event
    ctaElement.value?.addEventListener('preventClick', (e) => {
      wasMoved.value = true
      // Reset the flag after a short delay to allow normal clicks again
      setTimeout(() => {
        wasMoved.value = false
      }, 300)
    })

    const savedPosition = localStorage.getItem('floatingCtaPosition')
    if (savedPosition) {
      position.value = JSON.parse(savedPosition)
    }
    
    // Check if previously dismissed in this session
    const wasDismissed = sessionStorage.getItem('floatingCtaDismissed') === 'true'
    isDismissed.value = wasDismissed
  } catch (e) {
    console.warn('Error accessing storage', e)
  }
  
  // Add scroll listener
  window.addEventListener('scroll', handleScroll)
  
  // Check initial mobile state and listen for resize
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  // Initial check for scroll position
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', checkMobile)
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', endDrag)
  document.removeEventListener('touchmove', handleDrag)
  document.removeEventListener('touchend', endDrag)
})
</script>

<style lang="scss" scoped>
.floating-cta {
  position: fixed;
  z-index: 1050; // Higher than Bootstrap's default modal backdrop
  transition: opacity 0.3s ease;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  user-select: none;
  touch-action: none;
  
  &.is-dragging {
    opacity: 0.8;
    transition: none;
  }
  
  .cta-button {
    padding: 12px 20px;
    font-weight: 600;
    border-radius: 8px;
    background-color: --var(primary-900); // Matching your site's primary color
    border: none;
    display: flex;
    align-items: center;
    white-space: nowrap;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    
    &:hover {
      background-color: color-mix(in srgb, --var(primary-600), black 10%);
    }
    
    i {
      font-size: 1.2rem;
    }
  }
  
  .btn-close {
    opacity: 0;
    transition: opacity 0.2s ease;
    transform: translate(50%, -50%);
  }
  
  &:hover .btn-close {
    opacity: 1;
  }
  
  &.is-mobile {
    .cta-button {
      padding: 10px 16px;
      font-size: 0.9rem;
    }
    
    // Adjust position to stay out of the way on mobile
    bottom: 70px !important;
    right: 15px !important;
    left: auto !important;
    top: auto !important;
  }
}

// Increase size of the touch area for mobile
@media (max-width: 767px) {
  .floating-cta {
    .btn-close {
      width: 24px;
      height: 24px;
      opacity: 1;
    }
    
    .cta-button {
      i {
        margin-right: 0 !important;
      }
    }
  }
}
</style>
