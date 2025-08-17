"use client"

import * as React from "react";
import Image from "next/image";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbDivider, BreadcrumbButton,
    NavDrawer, NavDrawerBody, NavDrawerHeader, NavItem, NavCategory,
    NavCategoryItem, NavSubItemGroup, NavSubItem, NavDivider, AppItem,
    NavSectionHeader, Menu, MenuTrigger, Button, MenuItem, MenuList,
    MenuPopover, Persona, Toolbar, ToolbarDivider, ToolbarButton, Tooltip
} from "@fluentui/react-components";
import { tokens, makeStyles } from "@fluentui/react-components";
import {
    bundleIcon, GridDotsFilled, ArrowExportFilled, ArrowExportRtlFilled,
    Board20Filled, Board20Regular, ChevronDownRegular
} from "@fluentui/react-icons";

// ========================
// Constants
// ========================
const MOBILE_BREAKPOINT = 1024;
const NAV_WIDTH = "260px";
const PATH = "#";

// ========================
// Types
// ========================
interface NavigationSubItem {
    id: string;
    label: string;
    href: string;
}

interface NavigationItem {
    id: string;
    label: string;
    icon: string;
    href?: string;
    target?: string;
    subItems?: NavigationSubItem[];
}

interface NavigationSection {
    title?: string;
    items: NavigationItem[];
    hasDivider?: boolean;
}

// ========================
// Icons
// ========================
const ICONS = {
    closeSidebar: bundleIcon(ArrowExportRtlFilled, GridDotsFilled),
    openSidebar: bundleIcon(ArrowExportFilled, GridDotsFilled),
    dashboard: bundleIcon(Board20Filled, Board20Regular)
} as const;

// ========================
// Configuration
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
    section: {
        display: 'flex',
        height: '100vh',
        paddingTop: tokens.spacingVerticalXXL,
        paddingBottom: tokens.spacingVerticalXXL,
        backgroundColor: tokens.colorNeutralBackground4,
        overflow: 'hidden',
        '@media (max-width: 768px)': {
            paddingTop: tokens.spacingVerticalL,
            paddingBottom: tokens.spacingVerticalL,
        }
    },
    
    sectionWithGap: {
        gap: tokens.spacingHorizontalXS,
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
        width: NAV_WIDTH
    },

    sidebarCollapsed: {
        width: tokens.spacingHorizontalXXL
    },

    navDrawer: {
        width: NAV_WIDTH
    },

    navHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: tokens.spacingHorizontalS,
        paddingTop: tokens.spacingVerticalS,
        paddingBottom: tokens.spacingVerticalS,
        [`@media (max-width: ${MOBILE_BREAKPOINT}px)`]: {
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
        borderRadius: tokens.borderRadiusLarge,
        boxShadow: tokens.shadow2,
        border: tokens.colorTransparentStroke,
        marginRight: tokens.spacingHorizontalXXL,
        [`@media (max-width: ${MOBILE_BREAKPOINT}px)`]: {
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
        paddingRight: tokens.spacingHorizontalL,
        marginLeft: 'auto',
    },

    content: {
        flex: 1,
        padding: tokens.spacingHorizontalXL,
        paddingTop: tokens.spacingVerticalS
    },

    contentWrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacingVerticalXL,
        minHeight: '100%'
    },

    grid: {
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

    gridItem: {
        backgroundColor: tokens.colorNeutralBackground4,
        aspectRatio: '16 / 9',
        borderRadius: tokens.borderRadiusLarge,
    },

    fullContainer: {
        flex: 1,
        backgroundColor: tokens.colorNeutralBackground4,
        borderRadius: tokens.borderRadiusLarge,
        minHeight: '200px'
    }
});

// ========================
// Helper Functions
// ========================
const getIconComponent = () => {
    return <ICONS.dashboard />;
};

// ========================
// Hook for responsive sidebar management
// ========================
const useSidebar = () => {
    const [isMobile, setIsMobile] = React.useState(false); // Initialize to false on server
    const [isOpen, setIsOpen] = React.useState(true); // Initialize to true on server

    // Use a ref to store the latest isOpen value without making it a dependency
    const isOpenRef = React.useRef(isOpen);
    React.useEffect(() => {
        isOpenRef.current = isOpen;
    }, [isOpen]);

    React.useEffect(() => {
        // This effect runs only on the client after hydration
        const handleResize = () => {
            const currentIsMobile = window.innerWidth < MOBILE_BREAKPOINT;
            setIsMobile(currentIsMobile);
            // If resizing from large to small, collapse the sidebar
            if (currentIsMobile && isOpenRef.current) { // Use ref here
                setIsOpen(false);
            }
        };

        // Set initial mobile state on client mount
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        // Set initial sidebar visibility based on mobile state
        if (window.innerWidth < MOBILE_BREAKPOINT) {
            setIsOpen(false); // Collapsed on small screens initially on client
        } else {
            setIsOpen(true); // Use initial state for large screens
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // No dependencies like the original

    const toggle = React.useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    return { isMobile, isOpen, toggle, setIsOpen };
};

// ========================
// Components
// ========================
const NavigationContent = () => (
    <>
        {NAVIGATION_SECTIONS.map((section, sectionIndex) => (
            <React.Fragment key={sectionIndex}>
                {section.hasDivider && <NavDivider />}
                {section.title && <NavSectionHeader>{section.title}</NavSectionHeader>}
                {section.items.map((item) => (
                    item.subItems ? (
                        <NavCategory key={item.id} value={item.id}>
                            <NavCategoryItem icon={getIconComponent()}>
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
                            icon={getIconComponent()}
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
);

const BreadcrumbContent = () => (
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
);

interface SidebarProps {
    isMobile: boolean;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    styles: ReturnType<typeof useStyles>;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile, isOpen, onOpenChange, styles }) => {
    const sidebarClass = `${styles.sidebar} ${
        !isMobile ? (isOpen ? styles.sidebarExpanded : styles.sidebarCollapsed) : ''
    }`;

    return (
        <aside className={sidebarClass}>
            <NavDrawer
                defaultSelectedValue="1"
                open={isOpen}
                type={isMobile ? "overlay" : "inline"}
                className={!isMobile ? styles.navDrawer : ''}
                onOpenChange={(_, data) => onOpenChange(data.open)}
            >
                <NavDrawerHeader className={isMobile ? styles.navHeader : ''}>
                    <AppItem as="a" href="#" aria-label="Fluent UI Logo">
                        <Image
                            priority
                            src="/fluent.svg"
                            alt="Fluent Logo"
                            width={163}
                            height={29}
                        />
                    </AppItem>
                </NavDrawerHeader>

                <div className={styles.navHeaderSpacing} />

                <NavDrawerBody>
                    <NavigationContent />
                </NavDrawerBody>
            </NavDrawer>
        </aside>
    );
};

interface AppToolbarProps {
    isOpen: boolean;
    onToggle: () => void;
    styles: ReturnType<typeof useStyles>;
}

const AppToolbar: React.FC<AppToolbarProps> = ({ isOpen, onToggle, styles }) => {
    const tooltipContent = isOpen ? "Close Navigation" : "Open Navigation";

    return (
        <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
                <Toolbar>
                    <Tooltip content={tooltipContent} relationship="description" withArrow>
                        <ToolbarButton
                            aria-label={tooltipContent}
                            icon={isOpen ? <ICONS.closeSidebar /> : <ICONS.openSidebar />}
                            onClick={onToggle}
                        />
                    </Tooltip>
                    <ToolbarDivider />
                    <Breadcrumb aria-label="Current page navigation">
                        <BreadcrumbContent />
                    </Breadcrumb>
                </Toolbar>
            </div>
            <div className={styles.toolbarRight}>
                <Menu positioning={{ autoSize: true }}>
                    <MenuTrigger disableButtonEnhancement>
                        <Button appearance="subtle" aria-label="User menu">
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
    );
};

const ContentArea: React.FC<{ styles: ReturnType<typeof useStyles> }> = ({ styles }) => (
    <div className={styles.content}>
        <div className={styles.contentWrapper}>
            <div className={styles.grid}>
                <div className={styles.gridItem} />
                <div className={styles.gridItem} />
                <div className={styles.gridItem} />
            </div>
            <div className={styles.fullContainer} />
        </div>
    </div>
);

// ========================
// Main Component
// ========================
export default function Page() {
    const styles = useStyles();
    const { isMobile, isOpen, toggle, setIsOpen } = useSidebar();

    const sectionClass = `${styles.section} ${
        !isMobile && isOpen ? styles.sectionWithGap : ''
    }`;

    return (
        <section className={sectionClass}>
            <Sidebar
                isMobile={isMobile}
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                styles={styles}
            />
            <main className={styles.main}>
                <AppToolbar
                    isOpen={isOpen}
                    onToggle={toggle}
                    styles={styles}
                />
                <ContentArea styles={styles} />
            </main>
        </section>
    );
}