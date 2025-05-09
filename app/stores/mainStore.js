import { defineStore } from 'pinia'
import { ref } from 'vue'
// import { useToast } from 'vue-toastification'

// const toast = useToast()

export const useMainStore = defineStore('main', () => {
  /*
   * Booking Dialog
   */
  const bookingDialogVisible = ref(false)

  /*
   * Toast Notifications
   */
  // const toastError = notification => {
    // toast.error(notification.message, { timeout: 5000 })
  // }

  // const toastSuccess = notification => {
    // toast.success(notification.message, { timeout: 5000 })
  // }

  return {
    // booking dialog
    bookingDialogVisible,
    
    // toasts
    // toastError,
    // toastSuccess
  }
})
