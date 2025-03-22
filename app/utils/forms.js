export const getSectionStatusClasses = (complete) => {
  return complete
    ? ['fa-regular', 'fa-square-check', 'text-success']
    : ['fa-regular', 'fa-square', 'text-warning']
}
