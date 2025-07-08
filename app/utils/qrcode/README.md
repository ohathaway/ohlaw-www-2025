# QR Code Generation System

Universal QR code generation system for Nuxt 4.0 with OH Law branding integration. Works seamlessly across client and server environments with consistent styling and professional appearance.

## Features

- ✅ **Universal Compatibility**: Works in both browser and Node.js environments
- ✅ **OH Law Branding**: Professional color schemes matching your brand identity
- ✅ **Nuxt 4.0 Auto-Import**: No manual imports needed - just use the functions
- ✅ **Multiple Output Formats**: SVG, PNG, JPEG, WebP support
- ✅ **PDF Integration**: Compatible with existing PDF generation system
- ✅ **Content Validation**: Automatic content type detection and validation
- ✅ **Reactive Composables**: Vue 3 composables for seamless integration
- ✅ **Server-Side Ready**: Optimized for PDF reports and file generation

## Quick Start

### Client-Side Usage (Vue Components)

```vue
<template>
  <div>
    <img v-if="qr.qrDataURL.value" :src="qr.qrDataURL.value" alt="QR Code" />
    <p v-if="qr.error.value">Error: {{ qr.error.value }}</p>
    <button @click="qr.download('my-qr-code')">Download QR</button>
  </div>
</template>

<script setup>
// Quick QR code generation
const qr = useQuickQR('https://ohlawcolorado.com')

// Or with full control
const customQR = useQrCode({
  content: 'Your content here',
  preset: 'professional',
  size: 'medium',
  format: 'png'
})
</script>
```

### Server-Side Usage (PDF Reports)

```javascript
// In your server API route
import { addQRToPDF, createQRBlock } from '~/server/utils/qrcode'

// Add QR directly to PDF
await addQRToPDF(doc, 'https://ohlawcolorado.com', {
  x: 50,
  y: 50,
  width: 100,
  height: 100,
  align: 'center'
})

// Or create QR block for rich text rendering
const qrBlock = createQRBlock('Contact information', {
  size: 'medium',
  preset: 'professional',
  caption: 'Scan to contact us',
  align: 'center'
})
```

## Available Composables

### `useQrCode(options)`

Main composable for full QR code control.

```javascript
const qr = useQrCode({
  content: 'https://ohlawcolorado.com',
  preset: 'professional',
  size: 'medium',
  format: 'png',
  errorCorrectionLevel: 'M',
  autoGenerate: true
})

// Reactive properties
qr.qrDataURL.value      // Generated QR code as data URL
qr.isLoading.value      // Loading state
qr.error.value          // Error message if any
qr.isValid.value        // Content validation result
qr.contentType.value    // Detected content type

// Methods
await qr.generate()           // Generate QR code
await qr.download('filename') // Download QR code
await qr.copyToClipboard()   // Copy to clipboard
qr.setContent('new content') // Update content
qr.setPreset('success')      // Change style preset
qr.reset()                   // Reset state
```

### `useQuickQR(content)`

Simple QR generation with OH Law defaults.

```javascript
const qr = useQuickQR('https://ohlawcolorado.com')
// Auto-generates with professional styling
```

### `useOHLawContactQR()`

Specialized composable for OH Law contact information.

```javascript
const contactQR = useOHLawContactQR()

// Generate with default OH Law contact info
await contactQR.generateContact()

// Or with custom contact info
await contactQR.generateContact({
  name: 'Custom Name',
  phone: '555-123-4567',
  email: 'custom@email.com'
})
```

### `useOHLawLocationQR()`

Specialized composable for OH Law office location.

```javascript
const locationQR = useOHLawLocationQR()
await locationQR.generateLocation()
// Generates QR for OH Law office location
```

## Style Presets

### Professional (Default)
- **Colors**: Chambray blue theme
- **Use Case**: Default business QR codes
- **Appearance**: Rounded dots, professional look

### Success
- **Colors**: Apple green theme
- **Use Case**: Positive actions, confirmations
- **Appearance**: Green palette, friendly feel

### Warning
- **Colors**: Semantic orange theme
- **Use Case**: Attention-grabbing, important info
- **Appearance**: Orange/amber palette

### High Contrast
- **Colors**: Black and white only
- **Use Case**: PDF printing, accessibility
- **Appearance**: Maximum contrast, square dots

### Minimal
- **Colors**: Light chambray
- **Use Case**: Subtle integration, backgrounds
- **Appearance**: Clean dots, minimal styling

## Content Types & Validation

The system automatically detects and validates different content types:

```javascript
// URL
'https://ohlawcolorado.com'
'www.ohlawcolorado.com'

// Email
'contact@ohlawcolorado.com'
'mailto:contact@ohlawcolorado.com'

// Phone
'970-818-3052'
'tel:+19708183052'

// SMS
'sms:+19708183052'

// WiFi
'WIFI:T:WPA;S:NetworkName;P:password;;'

// vCard (Contact)
'BEGIN:VCARD\nVERSION:3.0\nFN:Owen Hathaway\n...'

// Location
'geo:40.5853,-105.0844'
'https://maps.google.com/maps?q=OH+Law+Office'
```

## Server-Side Functions

### PDF Integration

```javascript
import { 
  addQRToPDF, 
  createQRBlock, 
  renderQRBlock,
  generateQRForPDF 
} from '~/server/utils/qrcode'

// Add QR to existing PDF
await addQRToPDF(doc, 'content', {
  x: 50, y: 50, width: 100, height: 100,
  align: 'center', // 'left', 'center', 'right'
  valign: 'top',   // 'top', 'middle', 'bottom'
  preset: 'professional'
})

// Create QR block for rich text system
const qrBlock = createQRBlock('https://ohlawcolorado.com', {
  size: 'medium',
  preset: 'professional',
  caption: 'Visit our website',
  align: 'center'
})

// Generate QR buffer for custom use
const buffer = await generateQRForPDF('content', {
  preset: 'highContrast',
  size: 'large'
})
```

### OH Law Branded QR Codes

```javascript
// Contact QR with OH Law defaults
const contactBuffer = await generateOHLawContactQRForServer({
  name: 'Custom Name' // Optional overrides
})

// Location QR for OH Law office
const locationBuffer = await generateOHLawLocationQRForServer()

// Batch generation
const results = await batchGenerateQRForServer([
  { content: 'https://ohlawcolorado.com', options: { preset: 'professional' } },
  { content: 'contact@ohlawcolorado.com', options: { preset: 'success' } }
])
```

## Configuration Options

### Size Presets
- `thumbnail`: 100x100px
- `small`: 150x150px
- `medium`: 300x300px (default)
- `large`: 600x600px
- `print`: 1000x1000px

### Output Formats
- `svg`: Scalable Vector Graphics
- `png`: Portable Network Graphics (default)
- `jpeg`: JPEG image
- `webp`: WebP image

### Error Correction Levels
- `L`: Low (~7% recovery)
- `M`: Medium (~15% recovery) - default
- `Q`: Quartile (~25% recovery)
- `H`: High (~30% recovery) - recommended for PDF

## Advanced Usage

### Custom Styling

```javascript
const qr = useQrCode({
  content: 'https://ohlawcolorado.com',
  customStyle: {
    dotsOptions: {
      color: '#custom-color',
      type: 'rounded' // 'square', 'dots', 'rounded', 'extra-rounded'
    },
    backgroundOptions: {
      color: '#ffffff'
    },
    cornersSquareOptions: {
      color: '#corner-color',
      type: 'extra-rounded'
    }
  }
})
```

### With Logo

```javascript
const qr = useQrCode({
  content: 'https://ohlawcolorado.com',
  logo: '/img/ohlaw_icon.svg', // Path to logo
  preset: 'professional'
})
```

### Trackable URLs

```javascript
import { generateTrackableURL } from '~/utils/qrcode'

const trackableUrl = generateTrackableURL('https://ohlawcolorado.com', {
  source: 'business-card',
  medium: 'qr',
  campaign: 'networking-event',
  content: 'front-card'
})

const qr = useQuickQR(trackableUrl)
```

## Error Handling

```javascript
const qr = useQrCode()

// Set content and handle validation
qr.setContent('invalid-content')

if (!qr.isValid.value) {
  console.log('Validation error:', qr.validationResult.value.error)
  console.log('Warnings:', qr.validationResult.value.warnings)
}

// Handle generation errors
try {
  await qr.generate()
} catch (error) {
  console.error('Generation failed:', error.message)
}
```

## Performance Tips

1. **Use appropriate sizes**: Don't use `print` size for web display
2. **Choose right format**: SVG for scalability, PNG for compatibility
3. **Cache results**: Store generated QR codes when possible
4. **Batch operations**: Use batch functions for multiple QR codes
5. **Error correction**: Use `L` or `M` for web, `H` for print

## Integration with Existing Systems

### Quiz Reports
```javascript
// In quiz report generation
const reportQR = createQRBlock(`https://ohlawcolorado.com/quiz-results/${resultId}`, {
  size: 'medium',
  caption: 'View results online',
  align: 'center'
})

// Add to rich text blocks
const blocks = [
  // ... other content blocks
  reportQR
]

await renderRichTextToPdf(doc, blocks)
```

### Email Signatures
```javascript
// Generate QR for email signature
const signatureQR = await generateQRDataURL('https://ohlawcolorado.com', {
  preset: 'minimal',
  size: 'small'
})
```

### Business Cards
```javascript
// Contact QR for business cards
const businessCardQR = await generateOHLawContactQRForServer()
// Use buffer in design software or PDF generation
```

## Troubleshooting

### Common Issues

**"window is not defined"**
- Use server-side functions for Node.js environments
- Use client-side composables only in Vue components

**QR code not scanning**
- Check error correction level (use `H` for damaged codes)
- Ensure sufficient contrast (use `highContrast` preset)
- Verify content is not too long

**PDF generation errors**
- Use `generateQRForPDF` instead of regular generation
- Set `errorCorrectionLevel: 'H'` for print quality
- Use `highContrast` preset for better printing

**Styling not applied**
- Check preset names (case sensitive)
- Verify custom colors are valid hex codes
- Ensure OH Law brand colors are imported

### Debug Mode

```javascript
const qr = useQrCode({
  content: 'test content'
})

// Check validation results
console.log('Validation:', qr.validationResult.value)
console.log('Content type:', qr.contentType.value)
console.log('Warnings:', qr.warnings.value)
```

## API Reference

See the inline documentation in each file for complete API details:
- `config.js` - Configuration constants and presets
- `generator.js` - Core generation functions
- `validation.js` - Content validation utilities
- `index.js` - Main exports and convenience functions

## OH Law Brand Guidelines

When using QR codes in OH Law materials:
1. **Default to 'professional' preset** for consistency
2. **Use 'success' for positive actions** (contact forms, confirmations)
3. **Use 'warning' for important information** (deadlines, urgent notices)
4. **Use 'highContrast' for printed materials** (business cards, flyers)
5. **Include descriptive captions** for accessibility
6. **Test scanning** before finalizing designs

---

**Need help?** Check the inline documentation or contact the development team.