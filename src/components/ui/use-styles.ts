import {
    tokens,
    makeStyles,
} from "@fluentui/react-components";
import { BREAKPOINTS } from "./constants";
import { LAYOUT } from "./constants";

export const useStyles = makeStyles({
    section: {
        display: 'flex',
        minHeight: '100vh',
        paddingTop: tokens.spacingVerticalXXL,
        paddingBottom: tokens.spacingVerticalXXL,
        backgroundColor: tokens.colorNeutralBackground4,
        overflow: 'auto',
        [`@media (max-width: ${BREAKPOINTS.MOBILE_MAX_WIDTH}px)`]: {
            paddingTop: tokens.spacingVerticalL,
            paddingBottom: tokens.spacingVerticalL,
        }
    },

    sectionWithGap: {
        gap: tokens.spacingHorizontalXS,
    },

    contentWrapperMobile: {
        height: '100%',
        [`@media (max-width: ${BREAKPOINTS.MOBILE_MAX_WIDTH}px)`]: {
            height: '100%',
            overflowY: 'auto',
        }
    },

    sidebar: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: tokens.colorNeutralBackground4,
        transitionProperty: 'width',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease',
        overflow: 'hidden',
        flexShrink: 0
    },

    sidebarExpanded: {
        width: LAYOUT.NAV_WIDTH
    },

    sidebarCollapsed: {
        width: tokens.spacingHorizontalXXL
    },

    navDrawer: {
        width: LAYOUT.NAV_WIDTH
    },

    navHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: tokens.spacingHorizontalS,
        paddingTop: tokens.spacingVerticalS,
        paddingBottom: tokens.spacingVerticalS,
        [`@media (max-width: ${BREAKPOINTS.TABLET_MAX_WIDTH}px)`]: {
            paddingTop: tokens.spacingVerticalL,
        },
    },

    navHeaderSpacing: {
        marginBottom: tokens.spacingVerticalL
    },

    main: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        backgroundColor: tokens.colorNeutralBackground1,
        width: '100%',
        minHeight: '100%',
        alignSelf: 'stretch',
        borderRadius: tokens.borderRadiusLarge,
        boxShadow: tokens.shadow4,
        border: tokens.colorTransparentStroke,
        marginRight: tokens.spacingHorizontalXXL,
        [`@media (max-width: ${BREAKPOINTS.TABLET_MAX_WIDTH}px)`]: {
            marginRight: tokens.spacingHorizontalL,
            marginLeft: tokens.spacingHorizontalL,
        }
    },

    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: tokens.spacingVerticalS,
        paddingBottom: tokens.spacingVerticalS
    },

    toolbarLeft: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalXS,
        padding: tokens.spacingHorizontalS
    },

    toolbarRight: {
        display: 'flex',
        alignItems: 'center',
        paddingRight: tokens.spacingHorizontalXL,
        [`@media (max-width: ${BREAKPOINTS.TABLET_MAX_WIDTH}px)`]: {
            paddingRight: tokens.spacingHorizontalXL,
        },
        [`@media (max-width: ${BREAKPOINTS.MOBILE_MAX_WIDTH}px)`]: {
            paddingRight: tokens.spacingHorizontalXL,
        },
        marginLeft: 'auto',
    },

    content: {
        flex: 1,
        paddingLeft: tokens.spacingHorizontalM,
        paddingRight: tokens.spacingHorizontalM,
        paddingBottom: tokens.spacingHorizontalM,
        paddingTop: 0
    },

    contentWrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacingVerticalXL,
    },

    personaName: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        minWidth: '0px',
        ':hover': {
            '& .fui-Persona__primaryText': {
                color: tokens.colorNeutralForeground2BrandHover,
            },
            '& .fui-Persona__secondaryText': {
                color: tokens.colorNeutralForeground2BrandHover,
            },
        },
    }
});