import * as React from "react";

export const BREAKPOINTS = {
    TABLET_MAX_WIDTH: 1024,
    TABLET_MIN_WIDTH: 768,
    MOBILE_MAX_WIDTH: 767,
}

const useSidebar = () => {
    const [isMobile, setIsMobile] = React.useState(false);
    const [isTablet, setIsTablet] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(true);

    const isOpenRef = React.useRef(isOpen);
    React.useEffect(() => {
        isOpenRef.current = isOpen;
    }, [isOpen]);

    React.useEffect(() => {
        const handleResize = () => {
            const currentIsMobile = window.innerWidth <= BREAKPOINTS.MOBILE_MAX_WIDTH;
            const currentIsTablet = window.innerWidth >= BREAKPOINTS.TABLET_MIN_WIDTH && window.innerWidth <= BREAKPOINTS.TABLET_MAX_WIDTH;
            setIsMobile(currentIsMobile);
            setIsTablet(currentIsTablet);

            if ((currentIsMobile || currentIsTablet) && isOpenRef.current) {
                setIsOpen(false);
            }
        };

        const initialIsMobile = window.innerWidth <= BREAKPOINTS.MOBILE_MAX_WIDTH;
        const initialIsTablet = window.innerWidth >= BREAKPOINTS.TABLET_MIN_WIDTH && window.innerWidth <= BREAKPOINTS.TABLET_MAX_WIDTH;
        setIsMobile(initialIsMobile);
        setIsTablet(initialIsTablet);

        if (initialIsMobile || initialIsTablet) {
            setIsOpen(false);
        } else {
            setIsOpen(true);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggle = React.useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    return { isMobile, isTablet, isOpen, toggle, setIsOpen };
};

export default useSidebar;