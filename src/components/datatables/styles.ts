import { makeStyles } from "@fluentui/react-components";

const useDataTableStyles = makeStyles({
    paginationPageButton: {
        minWidth: '34px',
        padding: '.3em .4em',
        marginLeft: '5px',
        // Responsive styles
        margin: '2px',
        '@media (max-width: 576px)': {
            padding: '.1em .2em',
            fontSize: '12px',
        },
        '@media (min-width: 577px) and (max-width: 768px)': {
            padding: '.2em .3em',
            fontSize: '14px',
        },
    },
    paginationEllipsis: {
        minWidth: '34px',
        // padding: '.3em .4em',
        marginLeft: '1px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Responsive styles
        margin: '2px',
        '@media (max-width: 576px)': {
            fontSize: '12px',
        },
        '@media (min-width: 577px) and (max-width: 768px)': {
            fontSize: '14px',
        },
    },
    paginationContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '5px',
        '@media (max-width: 576px)': {
            flexDirection: 'column',
            gap: '3px',
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
    searchContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        margin: 0,
        padding: 0,
        '@media (max-width: 576px)': {
            gap: '3px',
        },
    },
    searchLabel: {
        margin: 0,
        padding: 0,
        '@media (max-width: 576px)': {
            fontSize: '12px',
        },
    },
    searchInput: {
        flex: 1,
        '@media (max-width: 576px)': {
            fontSize: '12px',
        },
    },
    lengthSelectContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        margin: 0,
        padding: 0,
        '@media (max-width: 576px)': {
            gap: '3px',
            width: '100%',
        },
    },
    lengthSelectLabel: {
        margin: 0,
        padding: 0,
        '@media (max-width: 576px)': {
            fontSize: '12px',
        },
    },
    lengthSelectInput: {
        width: 'auto',
        minWidth: '60px',
        '@media (max-width: 576px)': {
            fontSize: '12px',
            flex: 1,
        },
    }
});

export { useDataTableStyles };