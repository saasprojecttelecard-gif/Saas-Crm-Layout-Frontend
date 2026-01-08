// React 19 Compatibility Patch
// This patch fixes compatibility issues between React 18/19 and various libraries

// 1. Fix react-is ForwardRef issue
import * as ReactIs from 'react-is';

// Create missing symbols for React 19 compatibility
const REACT_FORWARD_REF_TYPE = Symbol.for('react.forward_ref');
const REACT_MEMO_TYPE = Symbol.for('react.memo');
const REACT_LAZY_TYPE = Symbol.for('react.lazy');

// Patch react-is exports
const patchedReactIs = {
  ...ReactIs,
  ForwardRef: REACT_FORWARD_REF_TYPE,
  Memo: REACT_MEMO_TYPE,
  Lazy: REACT_LAZY_TYPE,
};

// 2. Fix React DOM compatibility
if (typeof window !== 'undefined') {
  // Patch React DOM for compatibility
  const originalCreateRoot = window.ReactDOM?.createRoot;
  if (originalCreateRoot) {
    window.ReactDOM.createRoot = function(container, options) {
      // Handle React 19 createRoot options
      const normalizedOptions = options || {};
      return originalCreateRoot.call(this, container, normalizedOptions);
    };
  }
}

// 3. Fix global React compatibility
if (typeof window !== 'undefined' && window.React) {
  // Ensure React.version compatibility
  if (!window.React.version) {
    window.React.version = '18.2.0';
  }
  
  // Patch forwardRef for compatibility
  const originalForwardRef = window.React.forwardRef;
  if (originalForwardRef) {
    window.React.forwardRef = function(render) {
      const result = originalForwardRef(render);
      result.$$typeof = REACT_FORWARD_REF_TYPE;
      return result;
    };
  }
}

// Export patched react-is
export default patchedReactIs;
export * from 'react-is';
export { REACT_FORWARD_REF_TYPE as ForwardRef };
