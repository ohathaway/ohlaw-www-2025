// utils/scheduling.js
/**
 * Opens a scheduling link in a new tab
 * @param {string} type - The type of scheduling link to open (matches keys in schedulingLinks config)
 * @returns {Function} - Function that opens the specified scheduling link
 */
export const useScheduling = () => {
  const { schedulingLinks } = useAppConfig()

  /**
   * Opens the specified scheduling link in a new tab
   * @param {string} type - Type of scheduling link (defaults to 'newClient')
   */
  const openSchedulingLink = (type = 'newClient') => {
    // Validate that the requested link type exists
    if (!schedulingLinks[type]) {
      console.warn(`Scheduling link type "${type}" not found in app config. Using "newClient" instead.`)
      window.open(schedulingLinks.newClient, '_blank')
      return
    }

    window.open(schedulingLinks[type], '_blank')
  }

  /**
   * Gets the URL for the specified scheduling link type
   * @param {string} type - Type of scheduling link (defaults to 'newClient')
   * @returns {string} The URL for the specified link type
   */
  const getSchedulingUrl = (type = 'newClient') => {
    return schedulingLinks[type] || schedulingLinks.newClient
  }

  return {
    getSchedulingUrl,
    openSchedulingLink,
  }
}
