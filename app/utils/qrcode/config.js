/**
 * QR Code Configuration with OH Law Branding
 * Provides styled QR code generation with consistent branding
 * Compatible with both client and server environments
 */

/**
 * OH Law brand color palette for QR codes
 * Based on the primevue.ohlaw.ts theme configuration
 */
export const OHLawColors = {
  primary: {
    chambray: {
      50: '#f5f7fa',
      100: '#e9edf5',
      200: '#cfd9e8',
      300: '#a4b7d5',
      400: '#7391bd',
      500: '#5173a6',
      600: '#3f5c8a',
      700: '#38507a',
      800: '#2e3f5e',
      900: '#2a3750',
      950: '#1c2435',
    },
    apple: {
      50: '#f1fcf2',
      100: '#dff9e4',
      200: '#c1f1cb',
      300: '#90e5a3',
      400: '#58d073',
      500: '#32b550',
      600: '#28a745',
      700: '#1f7634',
      800: '#1e5d2d',
      900: '#1a4d27',
      950: '#092a12',
    },
    redRibbon: {
      50: '#fef2f2',
      100: '#fee6e5',
      200: '#fccfcf',
      300: '#f9a8a8',
      400: '#f57779',
      500: '#ec474f',
      600: '#dc3545',
      700: '#b7192c',
      800: '#99182c',
      900: '#83182c',
      950: '#490812',
    },
  },
  semantic: {
    success: '#10b981',
    info: '#0ea5e9',
    warning: '#f59e0b',
    danger: '#ef4444',
  },
}

/**
 * QR code styling presets based on OH Law brand
 */
export const QRStylePresets = {
  // Professional blue theme - primary brand color
  professional: {
    dotsOptions: {
      color: OHLawColors.primary.chambray[700],
      type: 'rounded',
    },
    backgroundOptions: {
      color: '#ffffff',
    },
    cornersSquareOptions: {
      color: OHLawColors.primary.chambray[800],
      type: 'extra-rounded',
    },
    cornersDotOptions: {
      color: OHLawColors.primary.chambray[900],
      type: 'dot',
    },
  },

  // Success/positive theme - green
  success: {
    dotsOptions: {
      color: OHLawColors.primary.apple[700],
      type: 'rounded',
    },
    backgroundOptions: {
      color: '#ffffff',
    },
    cornersSquareOptions: {
      color: OHLawColors.primary.apple[800],
      type: 'extra-rounded',
    },
    cornersDotOptions: {
      color: OHLawColors.primary.apple[900],
      type: 'dot',
    },
  },

  // Warning/attention theme - orange
  warning: {
    dotsOptions: {
      color: OHLawColors.semantic.warning,
      type: 'rounded',
    },
    backgroundOptions: {
      color: '#ffffff',
    },
    cornersSquareOptions: {
      color: '#d97706',
      type: 'extra-rounded',
    },
    cornersDotOptions: {
      color: '#92400e',
      type: 'dot',
    },
  },

  // High contrast for accessibility
  highContrast: {
    dotsOptions: {
      color: '#000000',
      type: 'square',
    },
    backgroundOptions: {
      color: '#ffffff',
    },
    cornersSquareOptions: {
      color: '#000000',
      type: 'square',
    },
    cornersDotOptions: {
      color: '#000000',
      type: 'square',
    },
  },

  // Minimal/clean theme
  minimal: {
    dotsOptions: {
      color: OHLawColors.primary.chambray[600],
      type: 'dots',
    },
    backgroundOptions: {
      color: '#ffffff',
    },
    cornersSquareOptions: {
      color: OHLawColors.primary.chambray[700],
      type: 'square',
    },
    cornersDotOptions: {
      color: OHLawColors.primary.chambray[800],
      type: 'square',
    },
  },
}

/**
 * Default QR code configuration
 */
export const DefaultQRConfig = {
  width: 300,
  height: 300,
  margin: 0,
  qrOptions: {
    typeNumber: 0,
    mode: 'Byte',
    errorCorrectionLevel: 'M',
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 5,
    crossOrigin: 'anonymous',
  },
  ...QRStylePresets.professional,
}

/**
 * Configuration for different output formats
 */
export const OutputFormats = {
  SVG: 'svg',
  PNG: 'png',
  JPEG: 'jpeg',
  WEBP: 'webp',
}

/**
 * Size presets for different use cases
 */
export const SizePresets = {
  small: { width: 150, height: 150 },
  medium: { width: 300, height: 300 },
  large: { width: 600, height: 600 },
  print: { width: 1000, height: 1000 },
  thumbnail: { width: 100, height: 100 },
}

/**
 * Error correction levels
 */
export const ErrorCorrectionLevels = {
  L: 'L', // Low (~7%)
  M: 'M', // Medium (~15%)
  Q: 'Q', // Quartile (~25%)
  H: 'H', // High (~30%)
}
