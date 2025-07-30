/**
 * Converts menu items with route properties to command-based items for PrimeVue components
 * that don't support route navigation (like PanelMenu, TieredMenu, etc.)
 *
 * @param {Array} menuItems - Array of menu items with potential route properties
 * @param {Function} onNavigate - Optional callback to execute after navigation
 * @returns {Array} - Menu items with command functions instead of route properties
 */
export const convertRoutesToCommands = (menuItems, onNavigate = null) => {
  return menuItems.map(item => ({
    ...item,
    items: item.items?.map(subItem => ({
      ...subItem,
      command: subItem.route
        ? () => {
            navigateTo(subItem.route)
            onNavigate?.()
          }
        : undefined,
      route: undefined, // Remove route property
    })),
    command: item.route
      ? () => {
          navigateTo(item.route)
          onNavigate?.()
        }
      : undefined,
    route: undefined, // Remove route property
  }))
}
