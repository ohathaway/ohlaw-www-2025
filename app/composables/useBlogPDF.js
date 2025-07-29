/**
 * Blog PDF Management Composable
 * Handles PDF generation and retrieval for blog posts
 */

export const useBlogPDF = () => {
  /**
   * Generates a PDF for a blog post
   * @param {string} slug - Blog post slug
   * @param {Object} options - Generation options
   * @returns {Promise<Object>} Generation result
   */
  const generatePDF = async (slug, options = {}) => {
    const { regenerate = false } = options

    try {
      const result = await $fetch('/api/blog/generate-pdf', {
        method: 'POST',
        body: {
          slug,
          regenerate,
        },
      })

      return result
    }
    catch (error) {
      console.error('PDF generation failed:', error)
      throw error
    }
  }

  /**
   * Gets PDF URL for a blog post
   * @param {string} slug - Blog post slug
   * @returns {Promise<string|null>} PDF URL or null
   */
  const getPDFUrl = async (slug) => {
    try {
      const result = await $fetch('/api/blog/get-pdf-url', {
        method: 'POST',
        body: { slug },
      })

      return result.pdf
    }
    catch (error) {
      console.error('Failed to get PDF URL:', error)
      return null
    }
  }

  /**
   * Checks if PDF exists for a blog post
   * @param {string} slug - Blog post slug
   * @returns {Promise<boolean>} Whether PDF exists
   */
  const pdfExists = async (slug) => {
    try {
      const url = await getPDFUrl(slug)
      return !!url
    }
    catch (error) {
      return false
    }
  }

  /**
   * Downloads PDF for a blog post
   * @param {string} slug - Blog post slug
   * @param {string} title - Blog post title (for filename)
   */
  const downloadPDF = async (slug, title) => {
    try {
      const url = await getPDFUrl(slug)
      if (!url) {
        throw new Error('PDF not found')
      }

      // Create download link
      const link = document.createElement('a')
      link.href = url
      link.download = `${title.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`
      link.target = '_blank'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    catch (error) {
      console.error('PDF download failed:', error)
      throw error
    }
  }

  return {
    generatePDF,
    getPDFUrl,
    pdfExists,
    downloadPDF,
  }
}
