#!/usr/bin/env node
const fs = require('fs')

// Read the FormKit theme file
const themeContent = fs.readFileSync('./formkit.theme.ts', 'utf8')

// Extract the classes object
const classesMatch = themeContent.match(/const classes: Record<string, Record<string, boolean>> = ({[\s\S]*?});/)
if (!classesMatch) {
  console.error('Could not find classes object in theme file')
  process.exit(1)
}

// Parse the classes object (simplified for example)
let classesString = classesMatch[1]
  .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/,\s*}/g, '}')

let classes
try {
  classes = JSON.parse(classesString)
}
catch (e) {
  console.error('Failed to parse classes object:', e)
  process.exit(1)
}

// Generate the CSS
let css = '/* FormKit Theme for Tailwind CSS v4 */\n\n'

// Add @theme block with custom properties
css += '@theme {\n'
css += '  /* FormKit theme variables */\n'
css += '  --formkit-input-bg: theme(colors.white);\n'
css += '  --formkit-input-border: theme(colors.neutral.400);\n'
css += '  --formkit-input-border-focus: theme(colors.blue.500);\n'
css += '  --formkit-input-radius: theme(borderRadius.DEFAULT);\n'
css += '  --formkit-text-color: theme(colors.neutral.700);\n'
css += '  --formkit-text-color-muted: theme(colors.neutral.500);\n'
css += '  --formkit-font-size-base: theme(fontSize.base);\n'
css += '  --formkit-shadow: theme(boxShadow.md);\n'
css += '  /* Add more variables as needed */\n'
css += '}\n\n'

// Convert utility classes to CSS
css += '/* FormKit element styles */\n'

// Process component families and sections
const processedComponents = new Set()

// Group utilities by component and section
const componentSections = {}

Object.entries(classes).forEach(([selector, utilities]) => {
  // Extract component and section from selector (e.g., "family:text__wrapper" -> "text", "wrapper")
  const selectorParts = selector.split('__')
  if (selectorParts.length !== 2) return

  const [componentPart, section] = selectorParts
  const component = componentPart.replace('family:', '')

  if (!componentSections[component]) {
    componentSections[component] = {}
  }

  if (!componentSections[component][section]) {
    componentSections[component][section] = {}
  }

  // Store utilities for this component section
  componentSections[component][section] = utilities
})

// Generate CSS for each component
Object.entries(componentSections).forEach(([component, sections]) => {
  css += `\n/* FormKit ${component} component */\n`

  Object.entries(sections).forEach(([section, utilities]) => {
    const selector = `.formkit-${section}`

    css += `${selector} {\n`

    // Convert utilities to CSS properties
    Object.keys(utilities).forEach((utility) => {
      // This is a simplified conversion - in a real implementation,
      // we'd need a comprehensive mapping of utilities to CSS properties
      if (utility.includes('text-')) {
        if (utility.includes('neutral-700')) {
          css += '  color: var(--formkit-text-color);\n'
        }
        else if (utility.includes('neutral-500')) {
          css += '  color: var(--formkit-text-color-muted);\n'
        }
      }
      else if (utility.includes('bg-white')) {
        css += '  background-color: var(--formkit-input-bg);\n'
      }
      else if (utility.includes('border-neutral-400')) {
        css += '  border-color: var(--formkit-input-border);\n'
      }
      else if (utility.includes('rounded')) {
        css += '  border-radius: var(--formkit-input-radius);\n'
      }
      else if (utility.includes('shadow-md')) {
        css += '  box-shadow: var(--formkit-shadow);\n'
      }
      else if (utility === 'block') {
        css += '  display: block;\n'
      }
      else if (utility === 'flex') {
        css += '  display: flex;\n'
      }
      else if (utility === 'grow') {
        css += '  flex-grow: 1;\n'
      }
      else if (utility === 'mb-1') {
        css += '  margin-bottom: 0.25rem;\n'
      }
      else if (utility === 'mb-1.5') {
        css += '  margin-bottom: 0.375rem;\n'
      }
      else if (utility === 'focus-within:ring-1') {
        css += '  &:focus-within {\n    outline-width: 1px;\n    outline-style: solid;\n  }\n'
      }
      // Add more conversions as needed
    })

    css += '}\n'

    // Add dark mode styles if needed
    if (Object.keys(utilities).some(util => util.includes('dark:'))) {
      css += `@media (prefers-color-scheme: dark) {\n  ${selector} {\n`
      // Convert dark mode utilities
      Object.keys(utilities)
        .filter(util => util.includes('dark:'))
        .forEach((utility) => {
          // Simplified conversion
          if (utility.includes('dark:text-neutral-300')) {
            css += '    color: theme(colors.neutral.300);\n'
          }
          else if (utility.includes('dark:bg-transparent')) {
            css += '    background-color: transparent;\n'
          }
          // Add more conversions as needed
        })
      css += '  }\n}\n'
    }
  })
})

// Write the CSS to a file
fs.writeFileSync('./formkit-theme.css', css)
console.log('FormKit theme CSS generated successfully!')
