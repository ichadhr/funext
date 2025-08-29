import { makeStyles, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
    controlWrapper: {
        display: "flex",
        alignItems: "center",
        gap: tokens.spacingHorizontalM,
        paddingBottom: tokens.spacingHorizontalS,
        paddingTop: tokens.spacingHorizontalS
    },
    paginationWrapper: {
        display: "flex",
        gap: tokens.spacingHorizontalM,
        paddingBottom: tokens.spacingHorizontalS,
        paddingTop: tokens.spacingHorizontalS
    },
    searchSize: {
        minWidth: "100px !important"
    },
    forceUnderlineBorder: {
        minWidth: "80px  !important", // Set a fixed width for the dropdown
        borderBottomColor: `${tokens.colorNeutralStrokeAccessible} !important`
    },
    stripedRows: {
        "& tr:nth-child(odd)": {
            boxShadow: `inset 0 0 0 9999px color-mix(in srgb, ${tokens.colorNeutralBackgroundInverted} 2.5%, transparent)`,
        },
    },
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
    paginationToolbarGroup: {
        display: 'flex',
        alignItems: 'center',
    },
    paginationToolbarDivider: {
        display: 'flex',
        alignItems: 'center',
    },
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
});