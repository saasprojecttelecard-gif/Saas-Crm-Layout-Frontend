// Vite plugin for React 19 compatibility
export function react19CompatibilityPlugin() {
  return {
    name: 'react-19-compatibility',
    config(config) {
      // Ensure proper React 19 compatibility settings
      config.define = config.define || {};
      config.define['process.env.NODE_ENV'] = JSON.stringify(process.env.NODE_ENV || 'development');
      
      // Add React 19 specific optimizations
      config.optimizeDeps = config.optimizeDeps || {};
      config.optimizeDeps.include = config.optimizeDeps.include || [];
      
      // Ensure these packages are pre-bundled for compatibility
      const compatPackages = [
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',
        'react/jsx-dev-runtime'
      ];
      
      compatPackages.forEach(pkg => {
        if (!config.optimizeDeps.include.includes(pkg)) {
          config.optimizeDeps.include.push(pkg);
        }
      });
    },
    configureServer(server) {
      // Add middleware to handle React 19 compatibility issues
      server.middlewares.use('/node_modules', (req, res, next) => {
        // Handle react-is compatibility
        if (req.url.includes('react-is')) {
          res.setHeader('Cache-Control', 'no-cache');
        }
        next();
      });
    }
  };
}
