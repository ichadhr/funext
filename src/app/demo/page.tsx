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
import { Card, CardHeader, Text } from "@fluentui/react-components";
import {
    ArrowExportFilled,
    ArrowExportRtlFilled,
    Board20Filled,
    Board20Regular,
    bundleIcon,
    ChevronDownRegular,
    GridDotsFilled
} from "@fluentui/react-icons";
import { CardGrid, CardGridRow, CardGridColumn } from "@components/grids";
import useSidebar, { BREAKPOINTS } from "@hooks/use-sidebar";

// ====================================
// TYPES & INTERFACES
// ====================================


interface PageStyles {
    section: string;
    sectionWithGap: string;
    contentWrapperMobile: string;
    sidebar: string;
    sidebarExpanded: string;
    sidebarCollapsed: string;
    navDrawer: string;
    navHeader: string;
    navHeaderSpacing: string;
    main: string;
    toolbar: string;
    toolbarLeft: string;
    toolbarRight: string;
    content: string;
    contentWrapper: string;
    personaName: string;
}

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
    styles: PageStyles;
}

interface ContentAreaProps {
    styles: PageStyles;
    isMobile: boolean;
    children: React.ReactNode; // Add children prop
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
    styles: PageStyles;
    isMobile: boolean;
    isTablet: boolean;
}

// ====================================
// CONSTANTS & CONFIGURATION
// ====================================


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


// ====================================
// CUSTOM HOOKS
// ====================================


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
                            appearance="transparent"
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

const ContentArea: React.FC<ContentAreaProps> = ({ styles, isMobile, children }) => ( // Accept children
    <div className={styles.content}>
        <div className={`${styles.contentWrapper} ${isMobile ? styles.contentWrapperMobile : ''}`}>
            {children}
        </div>
    </div>
);

// ====================================
// MAIN PAGE COMPONENT
// ====================================

export default function Page() {
    const { isMobile, isTablet, isOpen, toggle, setIsOpen } = useSidebar();

    const useStyles = makeStyles({
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
            boxShadow: tokens.shadow2,
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

    const styles = useStyles();

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
                <ContentArea styles={styles} isMobile={isMobile}>
                    <CardGrid type="fluid">
                        <Card appearance="subtle">
                            <CardHeader header={<Text weight="semibold">CardGrid with `fluid` container type</Text>} />
                            <Text>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </Text>
                        </Card>
                        <Text>This is text content for the fluid CardGrid.</Text>
                    </CardGrid>
                    
                    <CardGrid>
                        <Card appearance="subtle">
                            <CardHeader header={<Text weight="semibold">Default CardGrid (no specific type, behaves like container-fluid)</Text>} />
                            <Text>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </Text>
                        </Card>
                        <Text>This is text content for the default CardGrid.</Text>
                    </CardGrid>

                    <CardGrid type="sm">
                        <Card appearance="subtle">
                            <CardHeader header={<Text weight="semibold">CardGrid with `sm` container type</Text>} />
                            <Text>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </Text>
                        </Card>
                        <Text>This is text content for the sm CardGrid.</Text>
                    </CardGrid>

                    <CardGrid type="md">
                        <Card appearance="subtle">
                            <CardHeader header={<Text weight="semibold">CardGrid with `md` container type</Text>} />
                            <Text>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </Text>
                        </Card>
                        <Text>This is text content for the md CardGrid.</Text>
                    </CardGrid>

                    <CardGrid type="lg">
                        <Card appearance="subtle">
                            <CardHeader header={<Text weight="semibold">CardGrid with `lg` container type</Text>} />
                            <Text>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </Text>
                        </Card>
                        <Text>This is text content for the lg CardGrid.</Text>
                    </CardGrid>
                    
                    <CardGrid type="xl">
                        <Card appearance="subtle">
                            <CardHeader header={<Text weight="semibold">CardGrid with `xl` container type</Text>} />
                            <Text>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </Text>
                        </Card>
                        <Text>This is text content for the xl CardGrid.</Text>
                    </CardGrid>
                    
                    <CardGrid type="xxl">
                        <Card appearance="subtle">
                            <CardHeader header={<Text weight="semibold">CardGrid with `xxl` container type</Text>} />
                            <Text>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </Text>
                        </Card>
                        <Text>This is text content for the xxl CardGrid.</Text>
                    </CardGrid>

                    <h3>CardGridRow Test</h3>
                    <CardGridRow>
                        <CardGridColumn xs={6}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">1 of 2 (xs=6)</Text>} />
                                <Text>Content for 1 of 2</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn xs={6}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">2 of 2 (xs=6)</Text>} />
                                <Text>Content for 2 of 2</Text>
                            </Card>
                        </CardGridColumn>
                    </CardGridRow>

                    {/* Bootstrap-like example 1: justify-content-md-center with col-lg-2 and col-md-auto */}
                    <CardGridRow justifyContentMd="center">
                        <CardGridColumn lg={2}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">1 of 3 (lg=2)</Text>} />
                                <Text>Content for 1 of 3</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn mdAuto>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">Variable width content (mdAuto)</Text>} />
                                <Text>This column will take up only its content width on medium and larger screens.</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn lg={2}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">3 of 3 (lg=2)</Text>} />
                                <Text>Content for 3 of 3</Text>
                            </Card>
                        </CardGridColumn>
                    </CardGridRow>

                    {/* Bootstrap-like example 2: Stack the columns on mobile by making one full-width and the other half-width */}
                    <CardGridRow>
                        <CardGridColumn md={8}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">.col-md-8</Text>} />
                                <Text>This column is 8/12 on medium+ screens, full width on smaller.</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn xs={6} md={4}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">.col-6 .col-md-4</Text>} />
                                <Text>This column is 6/12 on extra small, 4/12 on medium+ screens.</Text>
                            </Card>
                        </CardGridColumn>
                    </CardGridRow>

                    {/* Bootstrap-like example 3: Columns start at 50% wide on mobile and bump up to 33.3% wide on desktop */}
                    <CardGridRow>
                        <CardGridColumn xs={6} md={4}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">.col-6 .col-md-4</Text>} />
                                <Text>Column 1</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn xs={6} md={4}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">.col-6 .col-md-4</Text>} />
                                <Text>Column 2</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn xs={6} md={4}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">.col-6 .col-md-4</Text>} />
                                <Text>Column 3</Text>
                            </Card>
                        </CardGridColumn>
                    </CardGridRow>

                    {/* Bootstrap-like example 4: Columns are always 50% wide, on mobile and desktop */}
                    <CardGridRow>
                        <CardGridColumn xs={6}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">.col-6</Text>} />
                                <Text>Column 1</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn xs={6}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">.col-6</Text>} />
                                <Text>Column 2</Text>
                            </Card>
                        </CardGridColumn>
                    </CardGridRow>

                    {/* Bootstrap-like example 5: row-cols-2 */}
                    <CardGridRow rowCols={2}>
                        <CardGridColumn>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">Column (rowCols=2)</Text>} />
                                <Text>Column 1</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">Column (rowCols=2)</Text>} />
                                <Text>Column 2</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">Column (rowCols=2)</Text>} />
                                <Text>Column 3</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">Column (rowCols=2)</Text>} />
                                <Text>Column 4</Text>
                            </Card>
                        </CardGridColumn>
                    </CardGridRow>

                    {/* Bootstrap-like example 6: row-cols-4 with a col-6 override */}
                    <CardGridRow rowCols={4}>
                        <CardGridColumn>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">Column (rowCols=4)</Text>} />
                                <Text>Column 1</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">Column (rowCols=4)</Text>} />
                                <Text>Column 2</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn xs={6}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">Column (xs=6 override)</Text>} />
                                <Text>Column 3 (50% width)</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">Column (rowCols=4)</Text>} />
                                <Text>Column 4</Text>
                            </Card>
                        </CardGridColumn>
                    </CardGridRow>

                    {/* Bootstrap-like example 7: Nested Grid */}
                    <CardGridRow>
                        <CardGridColumn sm={3}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">Level 1: .col-sm-3</Text>} />
                                <Text>This is the first level 1 column.</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn sm={9}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">Level 1: .col-sm-9</Text>} />
                                <Text>This is the second level 1 column, containing a nested row.</Text>
                                <CardGridRow>
                                    <CardGridColumn xs={8} sm={6}>
                                        <Card appearance="filled-alternative">
                                            <CardHeader header={<Text weight="semibold">Level 2: .col-8 .col-sm-6</Text>} />
                                            <Text>This is the first nested column.</Text>
                                        </Card>
                                    </CardGridColumn>
                                    <CardGridColumn xs={4} sm={6}>
                                        <Card appearance="filled-alternative">
                                            <CardHeader header={<Text weight="semibold">Level 2: .col-4 .col-sm-6</Text>} />
                                            <Text>This is the second nested column.</Text>
                                        </Card>
                                    </CardGridColumn>
                                </CardGridRow>
                            </Card>
                        </CardGridColumn>
                    </CardGridRow>

                    {/* Bootstrap-like example 8: Vertical alignment - align-items-center */}
                    <CardGridRow alignItems="center" style={{ minHeight: '150px', border: '1px solid #ccc' }}> {/* Added minHeight for visual effect */}
                        <CardGridColumn col>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">One of three columns</Text>} />
                                <Text>Content 1</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn col>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">One of three columns</Text>} />
                                <Text>Content 2<br />with more<br />lines</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn col>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">One of three columns</Text>} />
                                <Text>Content 3</Text>
                            </Card>
                        </CardGridColumn>
                    </CardGridRow>

                    {/* Bootstrap-like example 9: Vertical alignment - align-items-start */}
                    <CardGridRow alignItems="start" style={{ minHeight: '150px', border: '1px solid #ccc', marginTop: '20px' }}>
                        <CardGridColumn col>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">One of three columns</Text>} />
                                <Text>Content 1</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn col>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">One of three columns</Text>} />
                                <Text>Content 2<br />with more<br />lines</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn col>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">One of three columns</Text>} />
                                <Text>Content 3</Text>
                            </Card>
                        </CardGridColumn>
                    </CardGridRow>

                    {/* Bootstrap-like example 10: Vertical alignment - align-items-end */}
                    <CardGridRow alignItems="end" style={{ minHeight: '150px', border: '1px solid #ccc', marginTop: '20px' }}>
                        <CardGridColumn col>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">One of three columns</Text>} />
                                <Text>Content 1</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn col>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">One of three columns</Text>} />
                                <Text>Content 2<br />with more<br />lines</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn col>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">One of three columns</Text>} />
                                <Text>Content 3</Text>
                            </Card>
                        </CardGridColumn>
                    </CardGridRow>

                    {/* Bootstrap-like example 11: Individual column vertical alignment */}
                    <CardGridRow style={{ minHeight: '150px', border: '1px solid #ccc', marginTop: '20px' }}>
                        <CardGridColumn col alignSelf="start">
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">One of three columns</Text>} />
                                <Text>Align self start</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn col alignSelf="center">
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">One of three columns</Text>} />
                                <Text>Align self center<br />with more<br />lines</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn col alignSelf="end">
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">One of three columns</Text>} />
                                <Text>Align self end</Text>
                            </Card>
                        </CardGridColumn>
                    </CardGridRow>

                    {/* Bootstrap-like example 12: Horizontal alignment - justify-content-start */}
                    <CardGridRow justifyContent="start" style={{ border: '1px solid #ccc', marginTop: '20px' }}>
                        <CardGridColumn xs={4}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">One of two columns</Text>} />
                                <Text>justify-content-start</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn xs={4}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">One of two columns</Text>} />
                                <Text>justify-content-start</Text>
                            </Card>
                        </CardGridColumn>
                    </CardGridRow>

                    {/* Bootstrap-like example 13: Horizontal alignment - justify-content-center */}
                    <CardGridRow justifyContent="center" style={{ border: '1px solid #ccc', marginTop: '20px' }}>
                        <CardGridColumn xs={4}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">One of two columns</Text>} />
                                <Text>justify-content-center</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn xs={4}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">One of two columns</Text>} />
                                <Text>justify-content-center</Text>
                            </Card>
                        </CardGridColumn>
                    </CardGridRow>

                    {/* Bootstrap-like example 14: Horizontal alignment - justify-content-end */}
                    <CardGridRow justifyContent="end" style={{ border: '1px solid #ccc', marginTop: '20px' }}>
                        <CardGridColumn xs={4}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">One of two columns</Text>} />
                                <Text>justify-content-end</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn xs={4}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">One of two columns</Text>} />
                                <Text>justify-content-end</Text>
                            </Card>
                        </CardGridColumn>
                    </CardGridRow>

                    {/* Bootstrap-like example 15: Horizontal alignment - justify-content-around */}
                    <CardGridRow justifyContent="around" style={{ border: '1px solid #ccc', marginTop: '20px' }}>
                        <CardGridColumn xs={4}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">One of two columns</Text>} />
                                <Text>justify-content-around</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn xs={4}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">One of two columns</Text>} />
                                <Text>justify-content-around</Text>
                            </Card>
                        </CardGridColumn>
                    </CardGridRow>

                    {/* Bootstrap-like example 16: Horizontal alignment - justify-content-between */}
                    <CardGridRow justifyContent="between" style={{ border: '1px solid #ccc', marginTop: '20px' }}>
                        <CardGridColumn xs={4}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">One of two columns</Text>} />
                                <Text>justify-content-between</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn xs={4}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">One of two columns</Text>} />
                                <Text>justify-content-between</Text>
                            </Card>
                        </CardGridColumn>
                    </CardGridRow>

                    {/* Bootstrap-like example 17: Horizontal alignment - justify-content-evenly */}
                    <CardGridRow justifyContent="evenly" style={{ border: '1px solid #ccc', marginTop: '20px' }}>
                        <CardGridColumn xs={4}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">One of two columns</Text>} />
                                <Text>justify-content-evenly</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn xs={4}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">One of two columns</Text>} />
                                <Text>justify-content-evenly</Text>
                            </Card>
                        </CardGridColumn>
                    </CardGridRow>

                    {/* Bootstrap-like example 18: Column offsets - offset-md-4 */}
                    <CardGridRow style={{ border: '1px solid #ccc', marginTop: '20px' }}>
                        <CardGridColumn md={4}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">.col-md-4</Text>} />
                                <Text>Column 1</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn md={4} offsetMd={4}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">.col-md-4 .offset-md-4</Text>} />
                                <Text>Column 2 with offset</Text>
                            </Card>
                        </CardGridColumn>
                    </CardGridRow>

                    {/* Bootstrap-like example 19: Column offsets - offset-md-3 */}
                    <CardGridRow style={{ border: '1px solid #ccc', marginTop: '20px' }}>
                        <CardGridColumn md={3} offsetMd={3}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">.col-md-3 .offset-md-3</Text>} />
                                <Text>Column 1 with offset</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn md={3} offsetMd={3}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">.col-md-3 .offset-md-3</Text>} />
                                <Text>Column 2 with offset</Text>
                            </Card>
                        </CardGridColumn>
                    </CardGridRow>

                    {/* Bootstrap-like example 20: Column offsets - offset-md-3 (single column) */}
                    <CardGridRow style={{ border: '1px solid #ccc', marginTop: '20px' }}>
                        <CardGridColumn md={6} offsetMd={3}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">.col-md-6 .offset-md-3</Text>} />
                                <Text>Single column with offset</Text>
                            </Card>
                        </CardGridColumn>
                    </CardGridRow>

                    {/* Bootstrap-like example 21: Margin-left auto */}
                    <CardGridRow style={{ border: '1px solid #ccc', marginTop: '20px' }}>
                        <CardGridColumn md={4}>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">.col-md-4</Text>} />
                                <Text>Column 1</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn md={4} msAuto>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">.col-md-4 .ms-auto</Text>} />
                                <Text>Column 2 with margin-left auto</Text>
                            </Card>
                        </CardGridColumn>
                    </CardGridRow>

                    {/* Bootstrap-like example 22: Margin-left auto with breakpoint */}
                    <CardGridRow style={{ border: '1px solid #ccc', marginTop: '20px' }}>
                        <CardGridColumn md={3} mdMsAuto>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">.col-md-3 .ms-md-auto</Text>} />
                                <Text>Column 1 with margin-left auto on md breakpoint</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn md={3} mdMsAuto>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">.col-md-3 .ms-md-auto</Text>} />
                                <Text>Column 2 with margin-left auto on md breakpoint</Text>
                            </Card>
                        </CardGridColumn>
                    </CardGridRow>

                    {/* Bootstrap-like example 23: Margin-right auto */}
                    <CardGridRow style={{ border: '1px solid #ccc', marginTop: '20px' }}>
                        <CardGridColumn col meAuto>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">.col-auto .me-auto</Text>} />
                                <Text>Column 1 with margin-right auto</Text>
                            </Card>
                        </CardGridColumn>
                        <CardGridColumn col>
                            <Card appearance="filled-alternative">
                                <CardHeader header={<Text weight="semibold">.col-auto</Text>} />
                                <Text>Column 2</Text>
                            </Card>
                        </CardGridColumn>
                    </CardGridRow>
                </ContentArea>
            </main>
        </section>
    );
}
