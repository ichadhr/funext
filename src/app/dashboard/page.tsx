"use client"

// ========================
// TypeScript Interfaces
// ========================
interface SidebarProps {
    isSidebarVisible: boolean;
    styles: ReturnType<ReturnType<typeof makeStyles>>;
}

interface AppToolbarProps {
    isSidebarVisible: boolean;
    onToggleSidebar: () => void;
    styles: ReturnType<ReturnType<typeof makeStyles>>;
}

interface ContentArea {
    styles: ReturnType<ReturnType<typeof makeStyles>>;
}

// ========================
// Imports
// ========================
// React and Next.js imports
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


const NAV_WIDTH = "260px";
const NAV_COLLAPSED_WIDTH = tokens.spacingHorizontalXXL;

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
        transitionProperty: 'all',
        transitionDuration: '300ms',
        transitionTimingFunction: 'ease',
        overflow: 'hidden',
        flexShrink: 0,
        '&.expanded': { width: NAV_WIDTH },
        '&.collapsed': { width: tokens.spacingHorizontalXXL }
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
        transition: 'width 0.3s ease',
        '&.expanded': { width: NAV_WIDTH },
        '&.collapsed': { width: tokens.spacingHorizontalXXL }
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
    },

});

// ========================
// Memoized Constants and Icons
// ========================
const PATH = "#";
const CloseSidebar = bundleIcon(ArrowExportRtlFilled, GridDotsFilled);
const OpenSidebar = bundleIcon(ArrowExportFilled, GridDotsFilled);
const Dashboard = bundleIcon(Board20Filled, Board20Regular);

// ========================
// Sidebar Component
// ========================
const Sidebar = React.memo<SidebarProps>(({ isSidebarVisible, styles }) => {
    return (
        <aside
            className={mergeClasses(
                styles.wrapperSidebar,
                isSidebarVisible ? styles.navExpanded : styles.navCollapsed
            )}
        >
            <NavDrawer
                defaultSelectedValue="1"
                defaultSelectedCategoryValue=""
                open={isSidebarVisible}
                type="inline"
                className={styles.navSize}
                multiple={false}
            >
                <NavDrawerHeader>
                    <AppItem
                        as="a"
                        href="#"
                    >
                        <Image priority={true} loading="eager" src="/fluent.svg" alt="Fluent Logo" width={163} height={29} />
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

// ========================
// Breadcrumb Items
// ========================
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

// ========================
// App Toolbar
// ========================
const AppToolbar = React.memo<AppToolbarProps>(({ isSidebarVisible, onToggleSidebar, styles }) => (
    <div className={styles.breadcrumb}>
        <div className={styles.wrapperBreadcrumb}>
            <div className={styles.breadcrumbLeft}>
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
            <div className={styles.breadcrumbRight}>
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
                            <MenuItem>Profile </MenuItem>
                            <MenuItem>Logout</MenuItem>
                            <MenuItem disabled>Statistic</MenuItem>
                        </MenuList>
                    </MenuPopover>
                </Menu>
            </div>
        </div>
    </div>
));

AppToolbar.displayName = 'AppToolbar';

// ========================
// Content Area
// ========================
const ContentArea = React.memo<ContentArea>(({ styles }) => (
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
// Main Component
// ========================
export default function Page() {
    const styles = useStyles();
    const [isSidebarVisible, setIsSidebarVisible] = React.useState(true);

    // Memoized toggle handler
    const handleToggleSidebar = React.useCallback(() => {
        setIsSidebarVisible(prev => !prev);
    }, []);

    // Memoized class names
    const sectionClasses = React.useMemo(() => mergeClasses(
        styles.wrapperSection,
        isSidebarVisible ? styles.gap1 : styles.gap0
    ), [styles, isSidebarVisible]);

    const mainClasses = React.useMemo(() => mergeClasses(
        styles.wrapperMain,
        isSidebarVisible ? styles.navExpanded : styles.navCollapsed
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
                <ContentArea
                    styles={styles}
                />
            </main>
        </section>
    );
}