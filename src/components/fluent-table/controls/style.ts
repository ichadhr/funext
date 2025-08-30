import { makeStyles, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
    // General control wrapper styles
    controlWrapper: {
        display: "flex",
        alignItems: "center",
        gap: tokens.spacingHorizontalM,
        paddingBottom: tokens.spacingHorizontalS,
        paddingTop: tokens.spacingHorizontalS,
        flexWrap: 'wrap', // Allow items to wrap to the next line
        "@media (max-width: 768px)": {
            gap: tokens.spacingVerticalS, // Adjust gap for vertical stacking
            flexShrink: 1, // Allow items to shrink
            minWidth: 0, // Allow flex item to shrink below its content size
        },
    },
    // Wrapper for controls where label should stack above the input on mobile
    stackedControlWrapper: {
        display: "flex",
        alignItems: "center",
        gap: tokens.spacingHorizontalM,
        paddingBottom: tokens.spacingHorizontalS,
        paddingTop: tokens.spacingHorizontalS,
        flexWrap: 'wrap',
        "@media (max-width: 768px)": {
            flexDirection: 'column', // Stack items vertically on small screens
            alignItems: 'flex-start', // Align items to the start when stacked
            gap: tokens.spacingVerticalS,
            flexShrink: 1,
            minWidth: 0,
        },
    },
    // Wrapper for pagination controls
    paginationWrapper: {
        display: "flex",
        gap: tokens.spacingHorizontalM,
        paddingBottom: tokens.spacingHorizontalS,
        paddingTop: tokens.spacingHorizontalS,
        flexWrap: 'wrap', // Allow items to wrap to the next line
        "@media (max-width: 768px)": {
            gap: tokens.spacingVerticalS, // Adjust gap for vertical stacking
            flexShrink: 1, // Allow items to shrink
            minWidth: 0, // Allow flex item to shrink below its content size
        },
    },
    // Specific width for search input on desktop
    searchSize: {
        minWidth: "100px !important"
    },
    // Specific width for search input on mobile
    mobileSearchBox: {
        "@media (max-width: 768px)": {
            width: '200px', // Adjust width as needed for mobile
        },
    },
    // Force underline border for dropdowns
    forceUnderlineBorder: {
        minWidth: "80px  !important", // Set a fixed width for the dropdown
        borderBottomColor: `${tokens.colorNeutralStrokeAccessible} !important`
    },
    // Striped row styling for tables
    stripedRows: {
        "& tr:nth-child(odd)": {
            boxShadow: `inset 0 0 0 9999px color-mix(in srgb, ${tokens.colorNeutralBackgroundInverted} 2.5%, transparent)`,
        },
    },
    stripedCards: {
        "& > div:nth-child(odd)": { // Target direct children (the mobile cards)
            boxShadow: `inset 0 0 0 9999px color-mix(in srgb, ${tokens.colorNeutralBackgroundInverted} 2.5%, transparent)`,
        },
    },
    // Container for horizontal table scrolling
    tableScrollContainer: {
        overflowX: "auto",
        overflowY: "hidden",
        width: "100%",
    },
    // Container for pagination controls
    paginationContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: tokens.spacingHorizontalM, // gap5
        "@media (max-width: 576px)": {
            flexDirection: 'column',
            gap: tokens.spacingHorizontalS, // gap3
            "& .toolbarGroup": {
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
            },
            "& .toolbarDivider": {
                display: 'none',
            },
        },
    },
    // Styles for pagination toolbar groups
    paginationToolbarGroup: {
        display: 'flex',
        alignItems: 'center',
    },
    // Styles for pagination toolbar dividers
    paginationToolbarDivider: {
        display: 'flex',
        alignItems: 'center',
    },
    // Styles for pagination page buttons
    paginationPageButton: {
        minWidth: "32px", // buttonWidth
        padding: '.3em .4em',
        marginLeft: tokens.spacingHorizontalXS, // margin2
        marginRight: tokens.spacingHorizontalXS, // margin2
        "@media (min-width: 577px) and (max-width: 768px)": {
            padding: '.2em .3em',
        },
        "@media (max-width: 576px)": {
            padding: '.1em .2em',
        },
    },
    // Styles for pagination ellipsis
    paginationEllipsis: {
        minWidth: "32px", // buttonWidth
        padding: '.3em .4em', // Added padding to match button
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: tokens.spacingHorizontalXS, // margin2
        marginRight: tokens.spacingHorizontalXS, // margin2
        "@media (max-width: 576px)": {
            // fontSize: '12px', // Commented out as per original
        },
        "@media (min-width: 577px) and (max-width: 768px)": {
            // fontSize: '14px', // Commented out as per original
        },
    },
    // Styles for the last pagination page button
    paginationPageButtonLast: {
        minWidth: '34px',
        padding: '.3em .4em',
        marginLeft: tokens.spacingHorizontalXS, // margin2
        marginRight: '0 !important',
        "@media (min-width: 577px) and (max-width: 768px)": {
            padding: '.2em .3em',
        },
        "@media (max-width: 576px)": {
            padding: '.1em .2em',
        },
    },
    // Mobile Card View Styles
    mobileCardViewContainer: {
        "@media (max-width: 768px)": {
            display: "block",
        },
        "@media (min-width: 769px)": {
            display: "none", // Hide on larger screens
        },
    },
    mobileCard: {
        border: `${tokens.strokeWidthThick} solid ${tokens.colorNeutralStrokeAlpha}`, // Apply border to the row
        display: "flex",
        flexDirection: "column",
        paddingRight: tokens.spacingHorizontalS,
        paddingLeft: tokens.spacingHorizontalS,
        "&:not(:first-child)": {
            borderTop: "none", // Remove top border for all but the first card
        },
        "&:first-child": {
            borderTopLeftRadius: tokens.borderRadiusMedium,
            borderTopRightRadius: tokens.borderRadiusMedium,
        },
        "&:last-child": {
            borderBottomLeftRadius: tokens.borderRadiusMedium,
            borderBottomRightRadius: tokens.borderRadiusMedium,
        },
    },
    mobileCardItem: {
        display: "flex",
        justifyContent: "space-between",
        paddingTop: tokens.spacingVerticalS,
        paddingBottom: tokens.spacingVerticalS,
        alignItems: "center",
        borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke3}`,
        "&:last-child": {
            borderBottom: "none",
        },
    },
    mobileCardLabel: {
        fontWeight: tokens.fontWeightSemibold,
        color: tokens.colorNeutralForeground2,
        marginRight: tokens.spacingHorizontalS,
    },
    mobileCardValue: {
        textAlign: "right",
        color: tokens.colorNeutralForeground1,
    },
    // Wrappers for top and bottom control sections
    topControlsWrapper: {
        display: "flex",
        justifyContent: "space-between",
        "@media (max-width: 768px)": {
            flexWrap: 'wrap', // Allow items to wrap to the next line
            width: '100%', // Ensure it takes full width
        },
    },
    bottomControlsWrapper: {
        display: "flex",
        justifyContent: "space-between",
        "@media (max-width: 768px)": {
            flexDirection: 'column', // Stack items vertically on small screens
            gap: tokens.spacingVerticalM, // Adjust gap for vertical stacking
            alignItems: 'center', // Center items when stacked
        },
    },
});