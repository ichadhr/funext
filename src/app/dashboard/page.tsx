"use client"

import * as React from "react";
import Image from "next/image";
import {
    tokens,
    makeStyles,
    NavDivider,
    NavSectionHeader,
    NavCategory,
    NavCategoryItem,
    NavSubItemGroup,
    NavSubItem,
    NavItem,
    NavDrawer,
    NavDrawerHeader,
    AppItem,
    NavDrawerBody,
    BreadcrumbItem,
    BreadcrumbButton,
    BreadcrumbDivider,
    Toolbar,
    Tooltip,
    ToolbarButton,
    ToolbarDivider,
    Breadcrumb,
    Menu,
    MenuTrigger,
    Button,
    Avatar,
    Persona,
    MenuPopover,
    MenuList,
    MenuItem
} from "@fluentui/react-components";
import {
    ArrowExportFilled,
    ArrowExportRtlFilled,
    Board20Filled,
    Board20Regular,
    bundleIcon,
    ChevronDownRegular,
    GridDotsFilled
} from "@fluentui/react-icons";

// ====================================
// TYPES & INTERFACES
// ====================================

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

interface SidebarProps {
    isMobile: boolean;
    isTablet: boolean;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    styles: ReturnType<typeof useStyles>;
}

interface ContentAreaProps {
    styles: ReturnType<typeof useStyles>;
    isMobile: boolean;
}

interface BreadcrumbItemType {
    label: string;
    href: string;
    current: boolean;
}

interface BreadcrumbContentProps {
    isMobile: boolean;
}

interface AppToolbarProps {
    isOpen: boolean;
    onToggle: () => void;
    styles: ReturnType<typeof useStyles>;
    isMobile: boolean;
    isTablet: boolean;
}

// ====================================
// CONSTANTS & CONFIGURATION
// ====================================

const BREAKPOINTS = {
    TABLET_MAX_WIDTH: 1024,
    TABLET_MIN_WIDTH: 768,
    MOBILE_MAX_WIDTH: 767,
} as const;

const LAYOUT = {
    NAV_WIDTH: "260px"
} as const;

const PATH = "#";

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

const BREADCRUMB_ITEMS: BreadcrumbItemType[] = [
    { label: "Item 1", href: PATH, current: false },
    { label: "Item 2", href: PATH, current: false },
    { label: "Item 3", href: PATH, current: false },
    { label: "Item 4", href: PATH, current: true }
];

const ICONS = {
    NAV: {
        dashboard: bundleIcon(Board20Filled, Board20Regular)
    },
    TOOLBAR: {
        closeSidebar: bundleIcon(ArrowExportRtlFilled, GridDotsFilled),
        openSidebar: bundleIcon(ArrowExportFilled, GridDotsFilled),
    }
} as const;

// ====================================
// STYLES
// ====================================

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

    contentWrapperMobile: {
        height: '100%',
        overflowY: 'auto',
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
        borderRadius: tokens.borderRadiusLarge,
        boxShadow: tokens.shadow2,
        border: tokens.colorTransparentStroke,
        marginRight: tokens.spacingHorizontalXXL,
        minHeight: '0',
        overflowY: 'auto',
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
        paddingLeft: tokens.spacingHorizontalXL,
        paddingRight: tokens.spacingHorizontalXL,
        paddingBottom: tokens.spacingHorizontalXL,
        paddingTop: 0
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
    },

    personaName: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        minWidth: '0px',
    }
});

// ====================================
// CUSTOM HOOKS
// ====================================

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

// ====================================
// UTILITY COMPONENTS
// ====================================

const BreadcrumbContent: React.FC<BreadcrumbContentProps> = ({ isMobile }) => {
    const itemsToRender = isMobile ? [BREADCRUMB_ITEMS[BREADCRUMB_ITEMS.length - 1]] : BREADCRUMB_ITEMS;

    return (
        <>
            {itemsToRender.map((item: BreadcrumbItemType, index: number) => (
                <React.Fragment key={index}>
                    <BreadcrumbItem>
                        <BreadcrumbButton href={item.href} current={item.current}>
                            {item.label}
                        </BreadcrumbButton>
                    </BreadcrumbItem>
                    {index < itemsToRender.length - 1 && <BreadcrumbDivider />}
                </React.Fragment>
            ))}
        </>
    );
};

const NavigationContent: React.FC = () => (
    <>
        {NAVIGATION_SECTIONS.map((section: NavigationSection, sectionIndex: number) => (
            <React.Fragment key={sectionIndex}>
                {section.hasDivider && <NavDivider />}
                {section.title && <NavSectionHeader>{section.title}</NavSectionHeader>}
                {section.items.map((item: NavigationItem) => (
                    item.subItems ? (
                        <NavCategory key={item.id} value={item.id}>
                            <NavCategoryItem icon={<ICONS.NAV.dashboard />}>
                                {item.label}
                            </NavCategoryItem>
                            <NavSubItemGroup>
                                {item.subItems.map((subItem: NavigationSubItem) => (
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
                            icon={<ICONS.NAV.dashboard />}
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

// ====================================
// MAIN COMPONENTS
// ====================================

const AppToolbar: React.FC<AppToolbarProps> = ({ isOpen, onToggle, styles, isMobile, isTablet }) => {
    const tooltipContent = isOpen ? "Close Navigation" : "Open Navigation";

    return (
        <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
                <Toolbar>
                    <Tooltip content={tooltipContent} relationship="description" withArrow>
                        <ToolbarButton
                            aria-label={tooltipContent}
                            icon={isOpen ? <ICONS.TOOLBAR.closeSidebar /> : <ICONS.TOOLBAR.openSidebar />}
                            onClick={onToggle}
                        />
                    </Tooltip>
                    <ToolbarDivider />
                    <Breadcrumb aria-label="Current page navigation">
                        <BreadcrumbContent isMobile={isMobile} />
                    </Breadcrumb>
                </Toolbar>
            </div>
            <div className={styles.toolbarRight}>
                <Menu positioning={{ autoSize: true }}>
                    <MenuTrigger disableButtonEnhancement>
                        <Button
                            appearance="subtle"
                            aria-label="User menu"
                            style={{
                                marginRight: isMobile ? '0' : '0',
                                marginLeft: isMobile ? '100px' : '0',
                                padding: isMobile ? '0' : undefined,
                                minWidth: isMobile ? '0' : undefined,
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {isMobile ? (
                                    <Avatar name="Kevin Sturgis" />
                                ) : (isTablet ? (
                                    <Persona
                                        className={styles.personaName}
                                        name="Kevin Sturgis"
                                        secondaryText="Administrator"
                                    />
                                ) : (
                                    <Persona
                                        className={styles.personaName}
                                        name="Kevin Sturgis"
                                        secondaryText="Administrator"
                                    />
                                ))}
                                <ChevronDownRegular style={{ marginLeft: isMobile ? '5px' : '10px' }} />
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

const Sidebar: React.FC<SidebarProps> = ({ isMobile, isTablet, isOpen, onOpenChange, styles }) => {
    const sidebarClass = `${styles.sidebar} ${!(isMobile || isTablet) ? (isOpen ? styles.sidebarExpanded : styles.sidebarCollapsed) : ''
        }`;

    return (
        <aside className={sidebarClass}>
            <NavDrawer
                defaultSelectedValue="1"
                open={isOpen}
                type={isMobile || isTablet ? "overlay" : "inline"}
                className={!(isMobile || isTablet) ? styles.navDrawer : ''}
                onOpenChange={(_, data) => onOpenChange(data.open)}
            >
                <NavDrawerHeader className={isMobile || isTablet ? styles.navHeader : ''}>
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

const ContentArea: React.FC<ContentAreaProps> = ({ styles, isMobile }) => (
    <div className={styles.content}>
        <div className={`${styles.contentWrapper} ${isMobile ? styles.contentWrapperMobile : ''}`}>
            <div className={styles.grid}>
                <div className={styles.gridItem} />
                <div className={styles.gridItem} />
                <div className={styles.gridItem} />
            </div>
            <div className={styles.fullContainer} />
        </div>
    </div>
);

// ====================================
// MAIN PAGE COMPONENT
// ====================================

export default function Page() {
    const styles = useStyles();
    const { isMobile, isTablet, isOpen, toggle, setIsOpen } = useSidebar();

    const sectionClass = `${styles.section} ${!(isMobile || isTablet) && isOpen ? styles.sectionWithGap : ''
        }`;

    return (
        <section className={sectionClass}>
            <Sidebar
                isMobile={isMobile}
                isTablet={isTablet}
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                styles={styles}
            />
            <main className={styles.main}>
                <AppToolbar
                    isOpen={isOpen}
                    onToggle={toggle}
                    styles={styles}
                    isMobile={isMobile}
                    isTablet={isTablet}
                />
                <ContentArea styles={styles} isMobile={isMobile} />
            </main>
        </section>
    );
}