import { makeStyles, tokens } from "@fluentui/react-components";

const gap5 = tokens.spacingHorizontalM;
const gap3 = tokens.spacingHorizontalS;
const margin2 = '.2em';
const buttonWidth = '34px';

const useDataTableStyles = makeStyles({
    paginationContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: gap5,
        '@media (max-width: 576px)': {
            flexDirection: 'column',
            gap: gap3,
            '& .toolbarGroup': {
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
            },
            '& .toolbarDivider': {
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
        minWidth: buttonWidth,
        padding: '.3em .4em',
        // marginLeft: '5px',
        // Responsive styles
        marginLeft: margin2,
        marginRight: margin2,
        '@media (min-width: 577px) and (max-width: 768px)': {
            padding: '.2em .3em',
            // fontSize: '14px',
        },
        '@media (max-width: 576px)': {
            padding: '.1em .2em',
            // fontSize: '12px',
        },
    },
    paginationEllipsis: {
        minWidth: buttonWidth,
        // padding: '.3em .4em',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Responsive styles
        marginLeft: margin2,
        marginRight: margin2,
        '@media (max-width: 576px)': {
            // fontSize: '12px',
        },
        '@media (min-width: 577px) and (max-width: 768px)': {
            // fontSize: '14px',
        },
    },
    paginationPageButtonLast: {
        minWidth: '34px',
        padding: '.3em .4em',
        // marginLeft: '5px',
        // Responsive styles
        marginLeft: margin2,
        marginRight: '0 !important',
        '@media (min-width: 577px) and (max-width: 768px)': {
            padding: '.2em .3em',
            // fontSize: '14px',
        },
        '@media (max-width: 576px)': {
            padding: '.1em .2em',
            // fontSize: '12px',
        },
    },
    
    searchContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: gap5,
        margin: 0,
        padding: 0,
        '@media (max-width: 576px)': {
            gap: gap3,
        },
    },
    searchLabel: {
        margin: 0,
        padding: 0,
        '@media (max-width: 576px)': {
            // fontSize: '12px',
        },
    },
    searchInput: {
        flex: 1,
        '@media (max-width: 576px)': {
            // fontSize: '12px',
        },
    },
    lengthSelectContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: gap5,
        margin: 0,
        padding: 0,
        '@media (max-width: 576px)': {
            gap: gap3,
            width: '100%',
        },
    },
    lengthSelectLabel: {
        margin: 0,
        padding: 0,
        '@media (max-width: 576px)': {
            // fontSize: '12px',
        },
    },
    lengthSelectInput: {
        width: 'auto',
        minWidth: '60px',
        '@media (max-width: 576px)': {
            // fontSize: '12px',
            flex: 1,
        },
    }
    ,
    dtLoadingOverlay: {
        position: 'absolute',
        backgroundColor: tokens.colorNeutralBackgroundAlpha2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20, // Ensure it's above the table
    },
});

export { useDataTableStyles };