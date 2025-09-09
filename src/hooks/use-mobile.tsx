import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // For admin aesthetic parity, force desktop mode sidebar across breakpoints.
  // If you want responsive off-canvas back, revert to media query logic below.
  return false

  // Original responsive logic:
  // const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  // React.useEffect(() => {
  //   const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  //   const onChange = () => {
  //     setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
  //   }
  //   mql.addEventListener("change", onChange)
  //   setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
  //   return () => mql.removeEventListener("change", onChange)
  // }, [])
  // return !!isMobile
}
