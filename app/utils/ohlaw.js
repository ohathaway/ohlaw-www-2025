export const openNewWindow = (link) => {
  window.open(link, '_blank', 'noopener,noreferrer')
}

export const stripCountry = (address) => {
  return address.replace(/\,\sUnited\sStates.*/, '')
}

export const relType = input =>
  (input === 'Client' && '')
  || `rel_${input.toLowerCase().replace(/ /g, '_')}|`

/**
   * Parses the Font Awesome icon string into the format expected by the font-awesome-icon component
   */
export const parseFontAwesomeIcon = (icon) => {
  if (!icon) return ''

  // If the icon is already in the correct format, return it as is
  if (Array.isArray(icon) || typeof icon === 'object') {
    return icon
  }

  // If it's a string in the format "fas fa-phone"
  const parts = icon.trim().split(' ')

  // Handle different formats
  if (parts.length >= 2) {
    // Format: "fas fa-phone" -> ["fas", "phone"]
    const prefix = parts[0]
    const iconName = parts[parts.length - 1].replace('fa-', '')
    return [prefix, iconName]
  }
  else if (icon.includes('fa-')) {
    // Format: "fa-phone" -> ["fas", "phone"]
    return ['fas', icon.replace('fa-', '')]
  }

  // Default: assume it's a Font Awesome icon name and use "fas" prefix
  return ['fas', icon]
}
