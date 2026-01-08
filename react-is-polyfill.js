// React 19 compatibility polyfill for react-is
// This fixes the missing ForwardRef export that Ant Design depends on

import reactIsCompatibility from './react-19-compatibility.js';

// Patch global react-is if it exists
if (typeof window !== 'undefined' && window.require) {
    try {
        const Module = window.require.cache && window.require.cache['react-is'];
        if (Module && Module.exports) {
            Object.assign(Module.exports, reactIsCompatibility);
        }
    } catch (e) {
        // Ignore errors
    }
}

// Export all compatibility functions and constants
export const {
    Element,
    Portal,
    Fragment,
    StrictMode,
    Profiler,
    Provider,
    Consumer,
    Context,
    ForwardRef,
    Suspense,
    SuspenseList,
    Memo,
    Lazy,
    isValidElementType,
    isAsyncMode,
    isConcurrentMode,
    isContextConsumer,
    isContextProvider,
    isElement,
    isForwardRef,
    isFragment,
    isLazy,
    isMemo,
    isPortal,
    isProfiler,
    isStrictMode,
    isSuspense,
    isSuspenseList,
    typeOf
} = reactIsCompatibility;

// Export default
export default reactIsCompatibility;
