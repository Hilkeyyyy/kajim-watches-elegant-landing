import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Safe matchMedia usage with cross-browser listeners (iOS/Safari fallback)
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const onChange = (e?: MediaQueryListEvent) => {
      // Prefer event.matches when available, fallback to window.innerWidth
      const matches = typeof e?.matches === 'boolean' ? e.matches : window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(matches);
    };

    // Initialize immediately
    setIsMobile(mql.matches);

    try {
      if (typeof mql.addEventListener === 'function') {
        mql.addEventListener('change', onChange);
        return () => mql.removeEventListener('change', onChange);
      }
      // Fallback for older Safari/iOS
      if (typeof (mql as any).addListener === 'function') {
        (mql as any).addListener(onChange);
        return () => (mql as any).removeListener(onChange);
      }
    } catch (_) {
      // No-op: final fallback using resize listener
    }

    // Ultimate fallback: window resize listener
    const resizeHandler = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, [])

  return !!isMobile
}
