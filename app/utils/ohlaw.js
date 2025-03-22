export const openNewWindow = link => {
  window.open(link, '_blank', 'noopener,noreferrer')
}

export const stripCountry = address => {
  return address.replace(/\,\sUnited\sStates.*/, '')
}

export const relType = input => 
  (input === 'Client' && '') || 
  `rel_${input.toLowerCase().replace(/ /g, '_')}|`