// React 19 Compatibility Layer
// This file provides comprehensive React 19 compatibility fixes

// 1. React-is polyfill with all missing exports
const REACT_ELEMENT_TYPE = Symbol.for('react.element');
const REACT_PORTAL_TYPE = Symbol.for('react.portal');
const REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');
const REACT_STRICT_MODE_TYPE = Symbol.for('react.strict_mode');
const REACT_PROFILER_TYPE = Symbol.for('react.profiler');
const REACT_PROVIDER_TYPE = Symbol.for('react.provider');
const REACT_CONTEXT_TYPE = Symbol.for('react.context');
const REACT_CONSUMER_TYPE = Symbol.for('react.consumer');
const REACT_FORWARD_REF_TYPE = Symbol.for('react.forward_ref');
const REACT_SUSPENSE_TYPE = Symbol.for('react.suspense');
const REACT_SUSPENSE_LIST_TYPE = Symbol.for('react.suspense_list');
const REACT_MEMO_TYPE = Symbol.for('react.memo');
const REACT_LAZY_TYPE = Symbol.for('react.lazy');

// 2. Global React compatibility patches
if (typeof window !== 'undefined') {
  // Ensure React global compatibility
  if (window.React) {
    // Patch React.version if missing
    if (!window.React.version) {
      window.React.version = '18.2.0';
    }
    
    // Patch forwardRef to ensure proper $$typeof
    const originalForwardRef = window.React.forwardRef;
    if (originalForwardRef) {
      window.React.forwardRef = function(render) {
        const result = originalForwardRef(render);
        if (result && !result.$$typeof) {
          result.$$typeof = REACT_FORWARD_REF_TYPE;
        }
        return result;
      };
    }
  }
  
  // Patch ReactDOM if available
  if (window.ReactDOM) {
    const originalCreateRoot = window.ReactDOM.createRoot;
    if (originalCreateRoot) {
      window.ReactDOM.createRoot = function(container, options) {
        const normalizedOptions = options || {};
        return originalCreateRoot.call(this, container, normalizedOptions);
      };
    }
  }
}

// 3. Create comprehensive react-is replacement
const reactIsPolyfill = {
  // Type constants
  Element: REACT_ELEMENT_TYPE,
  Portal: REACT_PORTAL_TYPE,
  Fragment: REACT_FRAGMENT_TYPE,
  StrictMode: REACT_STRICT_MODE_TYPE,
  Profiler: REACT_PROFILER_TYPE,
  Provider: REACT_PROVIDER_TYPE,
  Consumer: REACT_CONSUMER_TYPE,
  Context: REACT_CONTEXT_TYPE,
  ForwardRef: REACT_FORWARD_REF_TYPE,
  Suspense: REACT_SUSPENSE_TYPE,
  SuspenseList: REACT_SUSPENSE_LIST_TYPE,
  Memo: REACT_MEMO_TYPE,
  Lazy: REACT_LAZY_TYPE,

  // Type checking functions
  isValidElementType: (type) => {
    return typeof type === 'string' || 
           typeof type === 'function' || 
           (typeof type === 'object' && type !== null);
  },
  
  isElement: (object) => {
    return typeof object === 'object' && 
           object !== null && 
           object.$$typeof === REACT_ELEMENT_TYPE;
  },
  
  isForwardRef: (object) => {
    return typeof object === 'object' && 
           object !== null && 
           object.$$typeof === REACT_FORWARD_REF_TYPE;
  },
  
  isMemo: (object) => {
    return typeof object === 'object' && 
           object !== null && 
           object.$$typeof === REACT_MEMO_TYPE;
  },
  
  isLazy: (object) => {
    return typeof object === 'object' && 
           object !== null && 
           object.$$typeof === REACT_LAZY_TYPE;
  },
  
  isFragment: (object) => {
    return typeof object === 'object' && 
           object !== null && 
           object.$$typeof === REACT_FRAGMENT_TYPE;
  },
  
  isPortal: (object) => {
    return typeof object === 'object' && 
           object !== null && 
           object.$$typeof === REACT_PORTAL_TYPE;
  },
  
  isProfiler: (object) => {
    return typeof object === 'object' && 
           object !== null && 
           object.$$typeof === REACT_PROFILER_TYPE;
  },
  
  isStrictMode: (object) => {
    return typeof object === 'object' && 
           object !== null && 
           object.$$typeof === REACT_STRICT_MODE_TYPE;
  },
  
  isSuspense: (object) => {
    return typeof object === 'object' && 
           object !== null && 
           object.$$typeof === REACT_SUSPENSE_TYPE;
  },
  
  isSuspenseList: (object) => {
    return typeof object === 'object' && 
           object !== null && 
           object.$$typeof === REACT_SUSPENSE_LIST_TYPE;
  },
  
  isContextConsumer: (object) => {
    return typeof object === 'object' && 
           object !== null && 
           object.$$typeof === REACT_CONSUMER_TYPE;
  },
  
  isContextProvider: (object) => {
    return typeof object === 'object' && 
           object !== null && 
           object.$$typeof === REACT_PROVIDER_TYPE;
  },
  
  typeOf: (object) => {
    if (typeof object === 'object' && object !== null) {
      return object.$$typeof || null;
    }
    return null;
  },
  
  // Legacy compatibility
  isAsyncMode: () => false,
  isConcurrentMode: () => false
};

export default reactIsPolyfill;
