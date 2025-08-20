import { bundleIcon, ArrowExportFilled, ArrowExportRtlFilled, GridDotsFilled } from "@fluentui/react-icons";

export const LAYOUT = {
    NAV_WIDTH: "260px"
} as const;

export const BREAKPOINTS = {
    TABLET_MAX_WIDTH: 1024,
    TABLET_MIN_WIDTH: 768,
    MOBILE_MAX_WIDTH: 767,
} as const;


export const ICONS = {
    TOOLBAR: {
        closeSidebar: bundleIcon(ArrowExportRtlFilled, GridDotsFilled),
        openSidebar: bundleIcon(ArrowExportFilled, GridDotsFilled),
    }
} as const;