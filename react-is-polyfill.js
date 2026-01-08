// React 19 compatibility polyfill for react-is
// This fixes the missing ForwardRef export that Ant Design depends on

import reactIsCompatibility from './react-19-compatibility.js';

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
