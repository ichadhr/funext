"use client"

import * as React from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbDivider,
    BreadcrumbButton,
    NavDrawer,
    NavDrawerBody,
    NavDrawerHeader,
    NavItem,
    NavCategory,
    NavCategoryItem,
    NavSubItemGroup,
    NavSubItem,
    NavDivider,
    AppItem,
    NavSectionHeader,
    Menu,
    MenuTrigger,
    Button,
    MenuItem,
    MenuList,
    MenuPopover,
    Persona
} from "@fluentui/react-components";

import {
    tokens,
    makeStyles,
    mergeClasses
} from "@fluentui/react-components"

import {
    bundleIcon,
    GridDotsFilled,
    ArrowExportFilled,
    ArrowExportRtlFilled,
    Board20Filled,
    Board20Regular,
    ChevronDownRegular,
} from "@fluentui/react-icons";

import {
    Toolbar,
    ToolbarDivider,
    ToolbarButton,
    Tooltip
} from "@fluentui/react-components";

import Image from "next/image";

// TypeScript interfaces
interface SidebarProps {
    isSidebarVisible: boolean;
    styles: ReturnType<ReturnType<typeof makeStyles>>;
}

interface AppToolbarProps {
    isSidebarVisible: boolean;
    onToggleSidebar: () => void;
    styles: ReturnType<ReturnType<typeof makeStyles>>;
}

const useStyles = makeStyles({
    bgBody: {
        backgroundColor: tokens.colorNeutralBackground4
    },
    bgContent: {
        backgroundColor: tokens.colorNeutralBackground1
    },
    sidebar: {
        backgroundColor: tokens.colorNeutralBackground4,
        transitionProperty: 'all',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease',
        overflow: 'hidden',
        '&.expanded': {
            width: '260px'
        },
        '&.collapsed': {
            width: tokens.spacingHorizontalXXL
        }
    },
    flex: {
        display: "flex"
    },
    flex1: {
        flex: 1
    },
    flexDirection: {
        flexDirection: "column"
    },
    main: {
        width: '100%',
        borderRadius: tokens.borderRadiusLarge,
        boxShadow: tokens.shadow2,
        border: tokens.colorTransparentStroke,
        transition: 'width 0.3s ease',
        '&.expanded': {
            width: '260px'
        },
        '&.collapsed': {
            width: tokens.spacingHorizontalXXL
        }
    },
    nav: {
        width: "260px",
    },
    gap1: {
        gap: tokens.spacingHorizontalXS
    },
    gap0: {
        gap: tokens.spacingHorizontalNone
    },
    padVerticalSection: {
        paddingTop: tokens.spacingVerticalXXL,
        paddingBottom: tokens.spacingVerticalXXL
    },
    marRHorizontalMain: {
        marginRight: tokens.spacingHorizontalXXL
    },
    fullHeight: {
        minHeight: '100vh'
    },
    itemsCenter: {
        alignItems: 'center'
    },
    breadcrumb: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalS}`
    },
    breadcrumbLeft: {
        padding: tokens.spacingHorizontalXXL
    },
    breadcrumbRight: {
        paddingRight: tokens.spacingHorizontalL
    },
    navHeaderSpacing: {
        marginBottom: tokens.spacingVerticalL
    }
});

// Memoized constants and icons
const PATH = "#";
const CloseSidebar = bundleIcon(ArrowExportRtlFilled, GridDotsFilled);
const OpenSidebar = bundleIcon(ArrowExportFilled, GridDotsFilled);
const Dashboard = bundleIcon(Board20Filled, Board20Regular);

// Memoized Sidebar Component
const Sidebar = React.memo<SidebarProps>(({ isSidebarVisible, styles }) => {
    return (
        <aside
            className={mergeClasses(
                styles.flex,
                styles.flexDirection,
                styles.sidebar,
                isSidebarVisible ? 'expanded' : 'collapsed',
                'shrink-0'
            )}
        >
            <NavDrawer
                defaultSelectedValue="1"
                defaultSelectedCategoryValue=""
                open={isSidebarVisible}
                type="inline"
                className={styles.nav}
                multiple={false}
            >
                <NavDrawerHeader>
                    <AppItem
                        as="a"
                        href="#"
                    >
                        <Image src="/fluent.svg" alt="Fluent Logo" width={163} height={29} />
                    </AppItem>
                </NavDrawerHeader>

                <div className={styles.navHeaderSpacing}></div>

                <NavDrawerBody>
                    <NavItem href={PATH} icon={<Dashboard />} value="1">
                        Dashboard
                    </NavItem>
                    <NavItem href={PATH} icon={<Dashboard />} value="2">
                        Announcements
                    </NavItem>
                    <NavItem href={PATH} icon={<Dashboard />} value="3">
                        Employee Spotlight
                    </NavItem>
                    <NavItem icon={<Dashboard />} href={PATH} value="4">
                        Profile Search
                    </NavItem>
                    <NavItem icon={<Dashboard />} href={PATH} value="5">
                        Performance Reviews
                    </NavItem>

                    <NavSectionHeader>Employee Management</NavSectionHeader>
                    <NavCategory value="6">
                        <NavCategoryItem icon={<Dashboard />}>
                            Job Postings
                        </NavCategoryItem>
                        <NavSubItemGroup>
                            <NavSubItem href={PATH} value="7">
                                Openings
                            </NavSubItem>
                            <NavSubItem href={PATH} value="8">
                                Submissions
                            </NavSubItem>
                        </NavSubItemGroup>
                    </NavCategory>
                    <NavItem icon={<Dashboard />} value="9">
                        Interviews
                    </NavItem>

                    <NavSectionHeader>Benefits</NavSectionHeader>
                    <NavItem icon={<Dashboard />} value="10">
                        Health Plans
                    </NavItem>
                    <NavCategory value="11">
                        <NavCategoryItem icon={<Dashboard />} value="12">
                            Retirement
                        </NavCategoryItem>
                        <NavSubItemGroup>
                            <NavSubItem href={PATH} value="13">
                                Plan Information
                            </NavSubItem>
                            <NavSubItem href={PATH} value="14">
                                Fund Performance
                            </NavSubItem>
                        </NavSubItemGroup>
                    </NavCategory>

                    <NavSectionHeader>Learning</NavSectionHeader>
                    <NavItem icon={<Dashboard />} value="15">
                        Training Programs
                    </NavItem>
                    <NavCategory value="16">
                        <NavCategoryItem icon={<Dashboard />}>
                            Career Development
                        </NavCategoryItem>
                        <NavSubItemGroup>
                            <NavSubItem href={PATH} value="17">
                                Career Paths
                            </NavSubItem>
                            <NavSubItem href={PATH} value="18">
                                Planning
                            </NavSubItem>
                        </NavSubItemGroup>
                    </NavCategory>
                    <NavDivider />
                    <NavItem target="_blank" icon={<Dashboard />} value="19">
                        Workforce Data
                    </NavItem>
                    <NavItem href={PATH} icon={<Dashboard />} value="20">
                        Reports
                    </NavItem>
                </NavDrawerBody>
            </NavDrawer>
        </aside>
    );
});

Sidebar.displayName = 'Sidebar';

// Memoized Breadcrumb Items
const BreadcrumbItems = React.memo(() => (
    <>
        <BreadcrumbItem>
            <BreadcrumbButton href={PATH}>Item 1</BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbDivider />
        <BreadcrumbItem>
            <BreadcrumbButton href={PATH}>Item 2</BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbDivider />
        <BreadcrumbItem>
            <BreadcrumbButton href={PATH}>Item 3</BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbDivider />
        <BreadcrumbItem>
            <BreadcrumbButton href={PATH} current>Item 4</BreadcrumbButton>
        </BreadcrumbItem>
    </>
));

BreadcrumbItems.displayName = 'BreadcrumbItems';

// Memoized Toolbar Component
const AppToolbar = React.memo<AppToolbarProps>(({
    isSidebarVisible,
    onToggleSidebar,
    styles
}) => (
    <div className={styles.breadcrumb}>
        <div className={mergeClasses(styles.flex, styles.itemsCenter, styles.gap1)}>
            <Toolbar>
                <Tooltip
                    content={isSidebarVisible ? "Close Navigation" : "Open Navigation"}
                    relationship="description"
                    withArrow
                >
                    <ToolbarButton
                        aria-label="toggle sidebar"
                        icon={isSidebarVisible ? <CloseSidebar /> : <OpenSidebar />}
                        onClick={onToggleSidebar}
                    />
                </Tooltip>
                <ToolbarDivider />
                <Breadcrumb aria-label="Breadcrumb default example">
                    <BreadcrumbItems />
                </Breadcrumb>
            </Toolbar>
        </div>
        <div className={mergeClasses(styles.flex, styles.itemsCenter, styles.breadcrumbRight)}>
            <Menu positioning={{ autoSize: true }}>
                <MenuTrigger disableButtonEnhancement>
                    <Button appearance="subtle">
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
                        <MenuItem>New </MenuItem>
                        <MenuItem>New Window</MenuItem>
                        <MenuItem disabled>Open File</MenuItem>
                        <MenuItem>Open Folder</MenuItem>
                    </MenuList>
                </MenuPopover>
            </Menu>

        </div>
    </div>
));

AppToolbar.displayName = 'AppToolbar';

// Memoized Content Component
const ContentArea = React.memo(() => (
    <div className="px-5 pt-1 pb-5 flex-1">
        <div className="flex flex-col gap-4 h-full">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="bg-muted/50 aspect-video rounded-lg"></div>
                <div className="bg-muted/50 aspect-video rounded-lg"></div>
                <div className="bg-muted/50 aspect-video rounded-lg"></div>
            </div>
            <div className="bg-muted/50 flex-1 rounded-lg"></div>
        </div>
    </div>
));

ContentArea.displayName = 'ContentArea';

// Main Component
export default function Page() {
    const styles = useStyles();
    const [isSidebarVisible, setIsSidebarVisible] = React.useState(true);

    // Memoized toggle handler
    const handleToggleSidebar = React.useCallback(() => {
        setIsSidebarVisible(prev => !prev);
    }, []);

    // Memoized class names
    const sectionClasses = React.useMemo(() => mergeClasses(
        styles.flex,
        styles.fullHeight,
        styles.padVerticalSection,
        styles.bgBody,
        isSidebarVisible ? styles.gap1 : styles.gap0
    ), [styles, isSidebarVisible]);

    const mainClasses = React.useMemo(() => mergeClasses(
        styles.flex,
        styles.flex1,
        styles.flexDirection,
        styles.bgContent,
        styles.main,
        styles.marRHorizontalMain,
        isSidebarVisible ? 'expanded' : 'collapsed'
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
                    onToggleSidebar={handleToggleSidebar}
                    styles={styles}
                />
                <ContentArea />
            </main>
        </section>
    );
}