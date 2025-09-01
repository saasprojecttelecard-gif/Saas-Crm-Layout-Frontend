/**
 * Theme Utilities for Shared CRM Components
 * Compatible with both Ant Design (shared) and shadcn/Tailwind (microservices)
 */

/**
 * Get current theme from localStorage or system preference
 * @returns {'light' | 'dark'} Current theme
 */
export const getCurrentTheme = () => {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
};

/**
 * Set theme and update document attribute
 * @param {'light' | 'dark'} theme - Theme to set
 */
export const setTheme = (theme) => {
  localStorage.setItem('theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
  
  // Dispatch custom event for other components to listen
  window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme } }));
};

/**
 * Toggle between light and dark theme
 * @returns {'light' | 'dark'} New theme
 */
export const toggleTheme = () => {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  return newTheme;
};

/**
 * Get CSS custom property value
 * @param {string} property - CSS custom property name (without --)
 * @returns {string} Property value
 */
export const getCSSVariable = (property) => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--${property}`)
    .trim();
};

/**
 * Set CSS custom property value
 * @param {string} property - CSS custom property name (without --)
 * @param {string} value - Property value
 */
export const setCSSVariable = (property, value) => {
  document.documentElement.style.setProperty(`--${property}`, value);
};

/**
 * Get theme colors object for use in JavaScript
 * @returns {Object} Theme colors
 */
export const getThemeColors = () => {
  return {
    primary: getCSSVariable('color-primary'),
    secondary: getCSSVariable('color-secondary'),
    accent: getCSSVariable('color-accent'),
    destructive: getCSSVariable('color-destructive'),
    background: getCSSVariable('color-background'),
    foreground: getCSSVariable('color-foreground'),
    card: getCSSVariable('color-card'),
    cardForeground: getCSSVariable('color-card-foreground'),
    muted: getCSSVariable('color-muted'),
    mutedForeground: getCSSVariable('color-muted-foreground'),
    border: getCSSVariable('color-border'),
    sidebar: getCSSVariable('color-sidebar'),
    sidebarForeground: getCSSVariable('color-sidebar-foreground'),
    sidebarAccent: getCSSVariable('color-sidebar-accent'),
    header: getCSSVariable('color-header'),
    headerForeground: getCSSVariable('color-header-foreground'),
  };
};

/**
 * Initialize theme on app startup
 * Call this in your main app component
 */
export const initializeTheme = () => {
  const theme = getCurrentTheme();
  setTheme(theme);
  
  // Listen for system theme changes
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually set a theme
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
};

/**
 * Hook for React components to listen to theme changes
 * @param {Function} callback - Callback function to call on theme change
 * @returns {Function} Cleanup function
 */
export const useThemeListener = (callback) => {
  const handleThemeChange = (event) => {
    callback(event.detail.theme);
  };
  
  window.addEventListener('themeChange', handleThemeChange);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('themeChange', handleThemeChange);
  };
};

/**
 * Ant Design theme configuration generator
 * @param {boolean} isDarkMode - Whether dark mode is active
 * @returns {Object} Ant Design theme config
 */
export const getAntDesignThemeConfig = (isDarkMode) => {
  return {
    algorithm: isDarkMode ? 'dark' : 'default',
    token: {
      colorPrimary: isDarkMode ? '#F39C12' : '#E67E22',
      colorSuccess: isDarkMode ? '#2ECC71' : '#27AE60',
      colorWarning: '#F39C12',
      colorError: isDarkMode ? '#E53E3E' : '#E74C3C',
      colorInfo: '#3498DB',
      colorBgContainer: isDarkMode ? '#2D3748' : '#FFFFFF',
      colorBgElevated: isDarkMode ? '#2D3748' : '#FFFFFF',
      colorBgLayout: isDarkMode ? '#1A202C' : '#FAF3E0',
      colorBgBase: isDarkMode ? '#1A202C' : '#FFFFFF',
      colorTextBase: isDarkMode ? '#F7FAFC' : '#2B2D42',
      borderRadius: 12,
      borderRadiusLG: 16,
    },
  };
};

/**
 * Tailwind CSS class generator for consistent theming
 * Useful for microservices using Tailwind
 * @param {string} variant - Color variant (primary, secondary, accent, destructive)
 * @returns {Object} Tailwind classes
 */
export const getTailwindClasses = (variant = 'primary') => {
  const baseClasses = {
    primary: {
      bg: 'bg-orange-500 hover:bg-orange-600',
      text: 'text-orange-500',
      border: 'border-orange-500',
      button: 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500',
    },
    secondary: {
      bg: 'bg-blue-500 hover:bg-blue-600',
      text: 'text-blue-500',
      border: 'border-blue-500',
      button: 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500',
    },
    accent: {
      bg: 'bg-green-500 hover:bg-green-600',
      text: 'text-green-500',
      border: 'border-green-500',
      button: 'bg-green-500 hover:bg-green-600 text-white border-green-500',
    },
    destructive: {
      bg: 'bg-red-500 hover:bg-red-600',
      text: 'text-red-500',
      border: 'border-red-500',
      button: 'bg-red-500 hover:bg-red-600 text-white border-red-500',
    },
  };
  
  return baseClasses[variant] || baseClasses.primary;
};

export default {
  getCurrentTheme,
  setTheme,
  toggleTheme,
  getCSSVariable,
  setCSSVariable,
  getThemeColors,
  initializeTheme,
  useThemeListener,
  getAntDesignThemeConfig,
  getTailwindClasses,
};
