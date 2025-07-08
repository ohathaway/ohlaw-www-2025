/**
 * QR Code Composable for Vue Components
 * Provides reactive QR code generation with OH Law branding
 * Compatible with Nuxt 4.0 auto-import system
 */

import { ref, computed, watch, nextTick } from 'vue'
import {
  generateQRDataURL,
  generateQRSVG,
  createStyledQRCode,
  validateQRContent,
  formatQRContent,
  detectContentType,
  QRStylePresets,
  SizePresets,
  OutputFormats,
  OHLawQRTypes,
} from '~/utils/qrcode'

/**
 * Main QR code composable
 * @param {Object} options - Configuration options
 * @returns {Object} Reactive QR code interface
 */
export const useQrCode = (options = {}) => {
  // Reactive state
  const content = ref(options.content || '')
  const preset = ref(options.preset || 'professional')
  const size = ref(options.size || 'medium')
  const format = ref(options.format || 'png')
  const errorCorrectionLevel = ref(options.errorCorrectionLevel || 'M')
  const customStyle = ref(options.customStyle || {})
  const logo = ref(options.logo || null)

  // Loading and error states
  const isLoading = ref(false)
  const error = ref(null)
  const validationResult = ref(null)

  // Generated QR code data
  const qrDataURL = ref('')
  const qrSVG = ref('')
  const qrInstance = ref(null)

  // Computed properties
  const isValid = computed(() => {
    return validationResult.value ? validationResult.value.isValid : false
  })

  const contentType = computed(() => {
    return validationResult.value ? validationResult.value.contentType : 'text'
  })

  const warnings = computed(() => {
    return validationResult.value ? validationResult.value.warnings : []
  })

  const estimatedSize = computed(() => {
    return validationResult.value ? validationResult.value.estimatedSize : 0
  })

  const availablePresets = computed(() => {
    return Object.keys(QRStylePresets)
  })

  const availableSizes = computed(() => {
    return Object.keys(SizePresets)
  })

  const availableFormats = computed(() => {
    return Object.values(OutputFormats)
  })

  const currentConfig = computed(() => {
    return {
      content: content.value,
      preset: preset.value,
      size: size.value,
      format: format.value,
      errorCorrectionLevel: errorCorrectionLevel.value,
      customStyle: customStyle.value,
      logo: logo.value,
    }
  })

  /**
   * Validates the current content
   */
  const validateContent = () => {
    if (!content.value) {
      validationResult.value = {
        isValid: false,
        error: 'Content is required',
        warnings: [],
        contentType: 'text',
        estimatedSize: 0,
      }
      return
    }

    validationResult.value = validateQRContent(content.value)
  }

  /**
   * Generates QR code with current settings
   */
  const generate = async () => {
    if (!content.value) {
      error.value = 'Content is required'
      return
    }

    isLoading.value = true
    error.value = null

    try {
      // Validate content first
      validateContent()

      if (!validationResult.value.isValid) {
        throw new Error(validationResult.value.error)
      }

      // Format content if needed
      const formattedContent = formatQRContent(content.value, contentType.value)

      // Generate QR code in requested format
      const qrOptions = {
        preset: preset.value,
        size: size.value,
        errorCorrectionLevel: errorCorrectionLevel.value,
        customStyle: customStyle.value,
        logo: logo.value,
      }

      // Generate data URL for immediate display
      if (format.value === 'svg') {
        qrSVG.value = await generateQRSVG(formattedContent, qrOptions)
        qrDataURL.value = `data:image/svg+xml;base64,${btoa(qrSVG.value)}`
      }
      else {
        qrDataURL.value = await generateQRDataURL(formattedContent, {
          ...qrOptions,
          format: format.value,
        })
      }

      // Create QR instance for advanced usage
      qrInstance.value = createStyledQRCode(formattedContent, qrOptions)
    }
    catch (err) {
      error.value = err.message
      qrDataURL.value = ''
      qrSVG.value = ''
    }
    finally {
      isLoading.value = false
    }
  }

  /**
   * Downloads the QR code as a file
   */
  const download = async (filename = 'qr-code') => {
    if (!qrInstance.value) {
      await generate()
    }

    if (!qrInstance.value) {
      throw new Error('No QR code generated')
    }

    try {
      const extension = format.value === 'svg' ? 'svg' : 'png'
      const fullFilename = `${filename}.${extension}`

      await qrInstance.value.download(fullFilename)
    }
    catch (err) {
      throw new Error(`Failed to download QR code: ${err.message}`)
    }
  }

  /**
   * Copies QR code to clipboard (data URL)
   */
  const copyToClipboard = async () => {
    if (!qrDataURL.value) {
      await generate()
    }

    try {
      await navigator.clipboard.writeText(qrDataURL.value)
      return true
    }
    catch (err) {
      throw new Error(`Failed to copy to clipboard: ${err.message}`)
    }
  }

  /**
   * Resets the QR code state
   */
  const reset = () => {
    content.value = ''
    error.value = null
    validationResult.value = null
    qrDataURL.value = ''
    qrSVG.value = ''
    qrInstance.value = null
    isLoading.value = false
  }

  /**
   * Sets content and auto-detects type
   */
  const setContent = (newContent) => {
    content.value = newContent
    validateContent()
  }

  /**
   * Updates styling preset
   */
  const setPreset = (newPreset) => {
    if (availablePresets.value.includes(newPreset)) {
      preset.value = newPreset
    }
  }

  /**
   * Updates size preset
   */
  const setSize = (newSize) => {
    if (availableSizes.value.includes(newSize)) {
      size.value = newSize
    }
  }

  /**
   * Updates output format
   */
  const setFormat = (newFormat) => {
    if (availableFormats.value.includes(newFormat)) {
      format.value = newFormat
    }
  }

  /**
   * Gets QR code as raw data for server-side use
   */
  const getRawData = async (outputFormat = format.value) => {
    if (!qrInstance.value) {
      await generate()
    }

    if (!qrInstance.value) {
      throw new Error('No QR code generated')
    }

    return await qrInstance.value.getRawData(outputFormat)
  }

  // Auto-generate when content changes (with debouncing)
  let debounceTimer = null
  watch(
    () => content.value,
    () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }

      debounceTimer = setTimeout(() => {
        if (content.value) {
          generate()
        }
      }, 300)
    },
    { immediate: false },
  )

  // Re-generate when settings change
  watch(
    [preset, size, format, errorCorrectionLevel, customStyle, logo],
    () => {
      if (content.value) {
        nextTick(() => {
          generate()
        })
      }
    },
    { deep: true },
  )

  // Initial validation if content is provided
  if (options.content) {
    validateContent()
    if (options.autoGenerate !== false) {
      nextTick(() => {
        generate()
      })
    }
  }

  return {
    // State
    content,
    preset,
    size,
    format,
    errorCorrectionLevel,
    customStyle,
    logo,
    isLoading,
    error,
    validationResult,
    qrDataURL,
    qrSVG,
    qrInstance,

    // Computed
    isValid,
    contentType,
    warnings,
    estimatedSize,
    availablePresets,
    availableSizes,
    availableFormats,
    currentConfig,

    // Methods
    generate,
    download,
    copyToClipboard,
    reset,
    setContent,
    setPreset,
    setSize,
    setFormat,
    getRawData,
    validateContent,
  }
}

/**
 * Specialized composable for OH Law contact QR codes
 */
export const useOHLawContactQR = (contactInfo = {}) => {
  const qr = useQrCode({
    preset: 'professional',
    size: 'medium',
    autoGenerate: false,
  })

  const generateContact = async (customContactInfo = {}) => {
    const contactQR = await OHLawQRTypes.contact(customContactInfo)
    qr.qrDataURL.value = contactQR
    return contactQR
  }

  return {
    ...qr,
    generateContact,
  }
}

/**
 * Specialized composable for OH Law location QR codes
 */
export const useOHLawLocationQR = () => {
  const qr = useQrCode({
    preset: 'professional',
    size: 'medium',
    autoGenerate: false,
  })

  const generateLocation = async () => {
    const locationQR = await OHLawQRTypes.location()
    qr.qrDataURL.value = locationQR
    return locationQR
  }

  return {
    ...qr,
    generateLocation,
  }
}

/**
 * Specialized composable for quick QR code generation
 */
export const useQuickQR = (initialContent = '') => {
  return useQrCode({
    content: initialContent,
    preset: 'professional',
    size: 'medium',
    format: 'png',
    autoGenerate: true,
  })
}
