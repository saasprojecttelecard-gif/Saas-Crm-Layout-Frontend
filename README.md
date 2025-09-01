# Shared CRM Components

This package contains shared components and utilities for the CRM system, optimized for **Ant Design** but compatible with **shadcn/Tailwind** microservices.

## 🏗️ Architecture

- **Shared Folder**: Uses Ant Design + CSS Variables
- **Microservices**: Use shadcn + Tailwind 4
- **Design System**: Consistent colors and theming across all

## 📦 Components

### AdminLayout

Main layout component with:

- Responsive sidebar with scrollable menu
- Fixed header with theme switching
- Scrollable content area only
- Fixed footer
- Cross-module navigation
- Dark/Light theme support

```jsx
import { AdminLayout } from "@saas-crm/shared";

function App() {
  return (
    <AdminLayout>
      <YourContent />
    </AdminLayout>
  );
}
```

### Theme Utilities

Utilities for consistent theming across frameworks:

```jsx
import { themeUtils } from "@saas-crm/shared";

// Initialize theme system
themeUtils.initializeTheme();

// Get current theme
const theme = themeUtils.getCurrentTheme(); // 'light' | 'dark'

// Toggle theme
themeUtils.toggleTheme();

// Get theme colors for JavaScript use
const colors = themeUtils.getThemeColors();

// Get Ant Design theme config
const antConfig = themeUtils.getAntDesignThemeConfig(isDarkMode);

// Get Tailwind classes for microservices
const classes = themeUtils.getTailwindClasses("primary");
```

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--color-primary: #E67E22 (Orange)
--color-secondary: #3498DB (Blue)
--color-accent: #27AE60 (Green)
--color-destructive: #E74C3C (Red)

/* Backgrounds */
--color-background: #FAF3E0 (Light Sand)
--color-card: #FFFFFF
--color-sidebar: #2C3E50 (Dark Blue-Gray)
--color-header: #34495E (Blue-Gray)
```

### Dark Theme

Automatically switches colors for dark mode using `[data-theme="dark"]`.

## 🔧 Usage in Different Frameworks

### Ant Design (Shared Components)

```jsx
import { AdminLayout, themeUtils } from "@saas-crm/shared";
import { ConfigProvider } from "antd";

function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <ConfigProvider theme={themeUtils.getAntDesignThemeConfig(isDark)}>
      <AdminLayout>
        <YourAntDesignComponents />
      </AdminLayout>
    </ConfigProvider>
  );
}
```

### shadcn/Tailwind (Microservices)

```jsx
import { themeUtils } from "@saas-crm/shared";

function MicroserviceComponent() {
  const classes = themeUtils.getTailwindClasses("primary");

  return <button className={classes.button}>Consistent Button</button>;
}
```

## 🎯 Features

### ✅ Modal System

- Full-screen overlay with blur effect
- Proper z-index management
- Theme-aware styling
- Mobile responsive

### ✅ Button System

- Consistent styling across all button types
- Proper danger/destructive button backgrounds
- Hover effects and animations
- Theme-aware colors

### ✅ Scrolling Behavior

- Fixed header and footer
- Scrollable content area only
- Scrollable sidebar menu when needed
- Custom scrollbar styling

### ✅ Cross-Framework Compatibility

- CSS variables for consistent theming
- Utility classes for common patterns
- Theme utilities for JavaScript integration
- Compatible with both Ant Design and Tailwind

## 🚀 Installation

```bash
# In your microservice
npm install @saas-crm/shared

# Import CSS (required)
import '@saas-crm/shared/index.css';
```

## 🔄 Navigation Between Microservices

The AdminLayout handles cross-module navigation automatically:

```javascript
// Navigation config in AdminLayout
const NAVIGATION_CONFIG = {
  "/dashboard": { url: "http://localhost:3002/dashboard", port: 3002 },
  "/users": { url: "http://localhost:3005/users", port: 3005 },
  "/sales": { url: "http://localhost:3004/sales", port: 3004 },
  // ... more routes
};
```

## 🎨 Customization

### CSS Variables

Override any color by setting CSS variables:

```css
:root {
  --color-primary: #your-color;
  --color-accent: #your-accent;
}
```

### Utility Classes

Use shared utility classes for consistency:

```html
<div class="crm-card">
  <button class="crm-button-primary">Primary Action</button>
  <button class="crm-button-destructive">Delete</button>
</div>
```

## 📱 Responsive Design

- Mobile-first approach
- Collapsible sidebar on mobile
- Responsive footer layout
- Touch-friendly interactions

## 🌙 Theme System

- Automatic system theme detection
- Manual theme switching
- Persistent theme preference
- Cross-component theme synchronization

---

**Note**: This shared package is specifically designed for Ant Design integration while maintaining compatibility with shadcn/Tailwind microservices through CSS variables and utility functions.
