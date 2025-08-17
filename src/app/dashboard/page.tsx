"use client"

// ========================
// TypeScript Interfaces & Types
// ========================
interface NavigationItem {
    id: string;
    label: string;
    icon: string;
    href?: string;
    target?: string;
    subItems?: NavigationSubItem[];
}

interface NavigationSubItem {
    id: string;
    label: string;
    href: string;
}

interface NavigationSection {
    title?: string;
    items: NavigationItem[];
    hasDivider?: boolean;
}

interface StyleClasses {
    [key: string]: string;
}

interface SidebarProps {
    isSidebarVisible: boolean;
    styles: StyleClasses;
}

interface AppToolbarProps {
    isSidebarVisible: boolean;
    onToggleSidebar: () => void;
    styles: StyleClasses;
}

interface ContentAreaProps {
    styles: StyleClasses;
}

// ========================
// Imports
// ========================
import * as React from "react";
import Image from "next/image";

// Fluent UI imports
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbDivider, BreadcrumbButton,
    NavDrawer, NavDrawerBody, NavDrawerHeader, NavItem, NavCategory,
    NavCategoryItem, NavSubItemGroup, NavSubItem, NavDivider, AppItem,
    NavSectionHeader, Menu, MenuTrigger, Button, MenuItem, MenuList,
    MenuPopover, Persona, Toolbar, ToolbarDivider, ToolbarButton, Tooltip
} from "@fluentui/react-components";
import { tokens, makeStyles, mergeClasses } from "@fluentui/react-components";
import {
    bundleIcon, GridDotsFilled, ArrowExportFilled, ArrowExportRtlFilled,
    Board20Filled, Board20Regular, ChevronDownRegular
} from "@fluentui/react-icons";

// ========================
// Constants & Configuration
// ========================
const NAV_WIDTH = "260px";
const NAV_COLLAPSED_WIDTH = tokens.spacingHorizontalXXL;
const PATH = "#";

const TRANSITION_CONFIG = {
    property: 'all',
    duration: '300ms',
    timing: 'ease'
} as const;

// ========================
// Icons (Created Once)
// ========================
const ICONS = {
    closeSidebar: bundleIcon(ArrowExportRtlFilled, GridDotsFilled),
    openSidebar: bundleIcon(ArrowExportFilled, GridDotsFilled),
    dashboard: bundleIcon(Board20Filled, Board20Regular)
} as const;

// ========================
// Navigation Configuration
// ========================
const NAVIGATION_SECTIONS: NavigationSection[] = [
    {
        items: [
            { id: "1", label: "Dashboard", icon: "dashboard", href: PATH },
            { id: "2", label: "Announcements", icon: "dashboard", href: PATH },
            { id: "3", label: "Employee Spotlight", icon: "dashboard", href: PATH },
            { id: "4", label: "Profile Search", icon: "dashboard", href: PATH },
            { id: "5", label: "Performance Reviews", icon: "dashboard", href: PATH }
        ]
    },
    {
        title: "Employee Management",
        items: [
            {
                id: "6",
                label: "Job Postings",
                icon: "dashboard",
                subItems: [
                    { id: "7", label: "Openings", href: PATH },
                    { id: "8", label: "Submissions", href: PATH }
                ]
            },
            { id: "9", label: "Interviews", icon: "dashboard" }
        ]
    },
    {
        title: "Benefits",
        items: [
            { id: "10", label: "Health Plans", icon: "dashboard" },
            {
                id: "11",
                label: "Retirement",
                icon: "dashboard",
                subItems: [
                    { id: "13", label: "Plan Information", href: PATH },
                    { id: "14", label: "Fund Performance", href: PATH }
                ]
            }
        ]
    },
    {
        title: "Learning",
        items: [
            { id: "15", label: "Training Programs", icon: "dashboard" },
            {
                id: "16",
                label: "Career Development",
                icon: "dashboard",
                subItems: [
                    { id: "17", label: "Career Paths", href: PATH },
                    { id: "18", label: "Planning", href: PATH }
                ]
            }
        ]
    },
    {
        items: [
            { id: "19", label: "Workforce Data", icon: "dashboard", target: "_blank" },
            { id: "20", label: "Reports", icon: "dashboard", href: PATH }
        ],
        hasDivider: true
    }
];

const BREADCRUMB_ITEMS = [
    { label: "Item 1", href: PATH, current: false },
    { label: "Item 2", href: PATH, current: false },
    { label: "Item 3", href: PATH, current: false },
    { label: "Item 4", href: PATH, current: true }
] as const;

// ========================
// Styles
// ========================
const useStyles = makeStyles({
    // Navigation styles
    navSize: { width: NAV_WIDTH },
    navHeaderSpacing: { marginBottom: tokens.spacingVerticalL },
    navExpanded: { width: NAV_WIDTH },
    navCollapsed: { width: NAV_COLLAPSED_WIDTH },
    gap1: { gap: tokens.spacingHorizontalXS },
    gap0: { gap: tokens.spacingHorizontalNone },

    wrapperSection: {
        display: 'flex',
        height: '100vh',
        paddingTop: tokens.spacingVerticalXXL,
        paddingBottom: tokens.spacingVerticalXXL,
        backgroundColor: tokens.colorNeutralBackground4,
        overflow: 'hidden'
    },

    wrapperSidebar: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: tokens.colorNeutralBackground4,
        transitionProperty: TRANSITION_CONFIG.property,
        transitionDuration: TRANSITION_CONFIG.duration,
        transitionTimingFunction: TRANSITION_CONFIG.timing,
        overflow: 'hidden',
        flexShrink: 0
    },

    wrapperSidebarExpanded: {
        width: NAV_WIDTH
    },

    wrapperSidebarCollapsed: {
        width: tokens.spacingHorizontalXXL
    },

    wrapperMain: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        backgroundColor: tokens.colorNeutralBackground1,
        width: '100%',
        borderRadius: tokens.borderRadiusLarge,
        boxShadow: tokens.shadow2,
        border: tokens.colorTransparentStroke,
        marginRight: tokens.spacingHorizontalXXL,
        transitionProperty: 'width',
        transitionDuration: TRANSITION_CONFIG.duration,
        transitionTimingFunction: TRANSITION_CONFIG.timing
    },

    wrapperMainExpanded: {
        width: NAV_WIDTH
    },

    wrapperMainCollapsed: {
        width: tokens.spacingHorizontalXXL
    },

    breadcrumb: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: tokens.spacingVerticalS,
        paddingBottom: tokens.spacingVerticalS
    },

    wrapperBreadcrumb: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalXS
    },

    breadcrumbLeft: {
        padding: tokens.spacingHorizontalS
    },

    breadcrumbRight: {
        display: 'flex',
        alignItems: 'center',
        paddingRight: tokens.spacingHorizontalL,
        marginLeft: 'auto',
    },

    rowContentArea: {
        flex: 1,
        paddingLeft: tokens.spacingHorizontalXL,
        paddingRight: tokens.spacingHorizontalXL,
        paddingBottom: tokens.spacingVerticalXL,
        paddingTop: tokens.spacingVerticalS
    },

    wrapperContentArea: {
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacingVerticalXL,
        minHeight: '100%'
    },

    gridContainer: {
        display: 'grid',
        gridAutoRows: 'min-content',
        gap: tokens.spacingHorizontalXL,
        '@media (min-width: 768px)': {
            gridTemplateColumns: 'repeat(3, 1fr)',
        },
        '@media (max-width: 767px)': {
            gridTemplateColumns: '1fr',
        }
    },

    content3Container: {
        backgroundColor: tokens.colorNeutralBackground4,
        aspectRatio: '16 / 9',
        borderRadius: tokens.borderRadiusLarge,
    },

    contentFullContainer: {
        flex: 1,
        backgroundColor: tokens.colorNeutralBackground4,
        borderRadius: tokens.borderRadiusLarge,
        minHeight: '200px'
    },

    // Responsive adjustments
    responsiveSection: {
        '@media (max-width: 768px)': {
            paddingTop: tokens.spacingVerticalL,
            paddingBottom: tokens.spacingVerticalL,
        }
    },

    responsiveMain: {
        '@media (max-width: 768px)': {
            marginRight: tokens.spacingHorizontalL,
        }
    }
});

// ========================
// Helper Functions
// ========================
const getIconComponent = (iconName: string) => {
    switch (iconName) {
        case 'dashboard':
            return <ICONS.dashboard />;
        default:
            return <ICONS.dashboard />;
    }
};

// ========================
// Navigation Renderer
// ========================
const NavigationRenderer = React.memo<{ sections: NavigationSection[] }>(({ sections }) => (
    <>
        {sections.map((section, sectionIndex) => (
            <React.Fragment key={sectionIndex}>
                {section.hasDivider && <NavDivider />}
                {section.title && <NavSectionHeader>{section.title}</NavSectionHeader>}
                {section.items.map((item) => (
                    item.subItems ? (
                        <NavCategory key={item.id} value={item.id}>
                            <NavCategoryItem icon={getIconComponent(item.icon)}>
                                {item.label}
                            </NavCategoryItem>
                            <NavSubItemGroup>
                                {item.subItems.map((subItem) => (
                                    <NavSubItem key={subItem.id} href={subItem.href} value={subItem.id}>
                                        {subItem.label}
                                    </NavSubItem>
                                ))}
                            </NavSubItemGroup>
                        </NavCategory>
                    ) : (
                        <NavItem
                            key={item.id}
                            href={item.href}
                            icon={getIconComponent(item.icon)}
                            value={item.id}
                            target={item.target}
                        >
                            {item.label}
                        </NavItem>
                    )
                ))}
            </React.Fragment>
        ))}
    </>
));

NavigationRenderer.displayName = 'NavigationRenderer';

// ========================
// Breadcrumb Items Component
// ========================
const BreadcrumbItems = React.memo(() => (
    <>
        {BREADCRUMB_ITEMS.map((item, index) => (
            <React.Fragment key={index}>
                <BreadcrumbItem>
                    <BreadcrumbButton href={item.href} current={item.current}>
                        {item.label}
                    </BreadcrumbButton>
                </BreadcrumbItem>
                {index < BREADCRUMB_ITEMS.length - 1 && <BreadcrumbDivider />}
            </React.Fragment>
        ))}
    </>
));

BreadcrumbItems.displayName = 'BreadcrumbItems';

// ========================
// Sidebar Component
// ========================
const Sidebar = React.memo<SidebarProps>(({ isSidebarVisible, styles }) => {
    const sidebarClasses = React.useMemo(() => mergeClasses(
        styles.wrapperSidebar,
        isSidebarVisible ? styles.wrapperSidebarExpanded : styles.wrapperSidebarCollapsed
    ), [styles, isSidebarVisible]);

    return (
        <aside className={sidebarClasses}>
            <NavDrawer
                defaultSelectedValue="1"
                defaultSelectedCategoryValue=""
                open={isSidebarVisible}
                type="inline"
                className={styles.navSize}
                multiple={false}
            >
                <NavDrawerHeader>
                    <AppItem as="a" href="#" aria-label="Fluent UI Logo">
                        <Image
                            priority={true}
                            loading="eager"
                            src="/fluent.svg"
                            alt="Fluent Logo"
                            width={163}
                            height={29}
                        />
                    </AppItem>
                </NavDrawerHeader>

                <div className={styles.navHeaderSpacing}></div>

                <NavDrawerBody>
                    <NavigationRenderer sections={NAVIGATION_SECTIONS} />
                </NavDrawerBody>
            </NavDrawer>
        </aside>
    );
});

Sidebar.displayName = 'Sidebar';

// ========================
// App Toolbar Component
// ========================
const AppToolbar = React.memo<AppToolbarProps>(({ isSidebarVisible, onToggleSidebar, styles }) => {
    // Track if we're in the middle of a transition
    const [isTransitioning, setIsTransitioning] = React.useState(false);

    // Tooltip content - immediate for hover, delayed for transition
    const getTooltipContent = () => {
        if (isTransitioning) {
            // During transition, keep the old text until animation completes
            return !isSidebarVisible ? "Close Navigation" : "Open Navigation";
        }
        // Normal state - immediate update for hover
        return isSidebarVisible ? "Close Navigation" : "Open Navigation";
    };

    const handleToggleSidebar = React.useCallback(() => {
        setIsTransitioning(true);
        onToggleSidebar();

        // Clear transition state after animation completes
        setTimeout(() => {
            setIsTransitioning(false);
        }, 300); // Match CSS transition duration
    }, [onToggleSidebar]);

    const tooltipContent = getTooltipContent();

    return (
        <div className={styles.breadcrumb}>
            <div className={styles.wrapperBreadcrumb}>
                <div className={styles.breadcrumbLeft}>
                    <Toolbar>
                        <Tooltip
                            content={tooltipContent}
                            relationship="description"
                            withArrow
                        >
                            <ToolbarButton
                                aria-label={tooltipContent}
                                icon={isSidebarVisible ? <ICONS.closeSidebar /> : <ICONS.openSidebar />}
                                onClick={handleToggleSidebar}
                            />
                        </Tooltip>
                        <ToolbarDivider />
                        <Breadcrumb aria-label="Current page navigation">
                            <BreadcrumbItems />
                        </Breadcrumb>
                    </Toolbar>
                </div>
                <div className={styles.breadcrumbRight}>
                    <Menu positioning={{ autoSize: true }}>
                        <MenuTrigger disableButtonEnhancement>
                            <Button
                                appearance="subtle"
                                aria-label="User menu"
                            >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Persona
                                        name="Kevin Sturgis"
                                        secondaryText="Administrator"
                                    />
                                    <ChevronDownRegular style={{ marginLeft: '10px' }} />
                                </div>
                            </Button>
                        </MenuTrigger>

                        <MenuPopover>
                            <MenuList>
                                <MenuItem>Profile</MenuItem>
                                <MenuItem>Logout</MenuItem>
                                <MenuItem disabled>Statistics</MenuItem>
                            </MenuList>
                        </MenuPopover>
                    </Menu>
                </div>
            </div>
        </div>
    );
});

AppToolbar.displayName = 'AppToolbar';

// ========================
// Content Area Component
// ========================
const ContentArea = React.memo<ContentAreaProps>(({ styles }) => (
    <div className={styles.rowContentArea}>
        <div className={styles.wrapperContentArea}>
            <div className={styles.gridContainer}>
                <div className={styles.content3Container}></div>
                <div className={styles.content3Container}></div>
                <div className={styles.content3Container}></div>
            </div>
            <div className={styles.contentFullContainer}></div>
        </div>
    </div>
));

ContentArea.displayName = 'ContentArea';

// ========================
// Custom Hooks
// ========================
const useSidebarState = (initialState: boolean = true) => {
    const [isSidebarVisible, setIsSidebarVisible] = React.useState(() => {
        // Could be enhanced to read from localStorage or user preferences
        return initialState;
    });

    const toggleSidebar = React.useCallback(() => {
        setIsSidebarVisible(prev => !prev);
    }, []);

    return { isSidebarVisible, toggleSidebar };
};

// ========================
// Main Component
// ========================
export default function Page() {
    const styles = useStyles();
    const { isSidebarVisible, toggleSidebar } = useSidebarState(true);

    // Memoized class names
    const sectionClasses = React.useMemo(() => mergeClasses(
        styles.wrapperSection,
        styles.responsiveSection,
        isSidebarVisible ? styles.gap1 : styles.gap0
    ), [styles, isSidebarVisible]);

    const mainClasses = React.useMemo(() => mergeClasses(
        styles.wrapperMain,
        styles.responsiveMain,
        isSidebarVisible ? styles.wrapperMainExpanded : styles.wrapperMainCollapsed
    ), [styles, isSidebarVisible]);

    return (
        <section className={sectionClasses}>
            <Sidebar
                isSidebarVisible={isSidebarVisible}
                styles={styles}
            />

            <main className={mainClasses}>
                <AppToolbar
                    isSidebarVisible={isSidebarVisible}
                    onToggleSidebar={toggleSidebar}
                    styles={styles}
                />
                <ContentArea
                    styles={styles}
                />
            </main>
        </section>
    );
}