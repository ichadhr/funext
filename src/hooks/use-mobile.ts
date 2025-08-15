import * as React from "react";

const MOBILE_BREAKPOINT = 576; // Changed to 576px breakpoint

export function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

    React.useEffect(() => {
        // Initialize and listen for viewport changes
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
        const handleChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

        // Set initial value
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        mql.addEventListener("change", handleChange);

        return () => mql.removeEventListener("change", handleChange);
    }, []);

    return !!isMobile;
}


