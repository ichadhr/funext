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
    AppItem
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
    PersonCircle32Regular
} from "@fluentui/react-icons";

import {
    Toolbar,
    ToolbarDivider,
    ToolbarButton,
    Tooltip,
    useRestoreFocusTarget
} from "@fluentui/react-components";

// import type { ToolbarProps } from "@fluentui/react-components";



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
    }

});

const path = "#";
const CloseSidebar = bundleIcon(ArrowExportRtlFilled, GridDotsFilled);
const OpenSidebar = bundleIcon(ArrowExportFilled, GridDotsFilled);
const Dashboard = bundleIcon(Board20Filled, Board20Regular);

export default function Page() {
    const styles = useStyles();

    const [isSidebarVisible, setIsSidebarVisible] = React.useState(true);

    // Tabster prop used to restore focus to the navigation trigger for overlay nav drawers
    const restoreFocusTargetAttributes = useRestoreFocusTarget();
    console.log(tokens.spacingHorizontalXXL);
    return (
        <section
            className={mergeClasses(
                styles.flex,
                styles.fullHeight,
                styles.padVerticalSection,
                styles.bgBody,
                isSidebarVisible ? styles.gap1 : styles.gap0
            )}
        >
            {/* Sidebar */}
            <aside
                className={mergeClasses(
                    styles.flex,
                    styles.flexDirection,
                    styles.sidebar,
                    isSidebarVisible ? 'expanded' : 'collapsed',
                    // 'shrink-0' // prevent content from affecting width
                )}
            >
                <NavDrawer
                    defaultSelectedValue="1"
                    open={isSidebarVisible}
                    type="inline"
                >
                    <NavDrawerHeader>
                        <AppItem
                            icon={<PersonCircle32Regular />}
                            as="a"
                            href="#"
                        >
                            Acme Inc
                        </AppItem>
                    </NavDrawerHeader>

                    <NavDrawerBody>
                        <NavItem href="#" icon={<Dashboard />} value="1">
                            Dashboard
                        </NavItem>
                        <NavItem href="#" value="2">
                            Announcements
                        </NavItem>
                        <NavCategory value="3">
                            <NavCategoryItem>
                                Employee Management
                            </NavCategoryItem>
                            <NavSubItemGroup>
                                <NavSubItem href="#" value="4">
                                    Profile
                                </NavSubItem>
                                <NavSubItem href="#" value="5">
                                    Settings
                                </NavSubItem>
                            </NavSubItemGroup>
                        </NavCategory>
                        <NavDivider />
                        <div className="p-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-sidebar-accent rounded-full flex items-center justify-center">
                                    <span className="text-xs font-medium text-sidebar-accent-foreground">CN</span>
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm text-sidebar-foreground">shadcn</div>
                                    <div className="text-xs text-sidebar-foreground/60">m@example.com</div>
                                </div>
                            </div>
                        </div>
                    </NavDrawerBody>
                </NavDrawer>
            </aside>

            {/* Main Content */}
            <main
                className={mergeClasses(
                    styles.flex,
                    styles.flex1,
                    styles.flexDirection,
                    styles.bgContent,
                    styles.main,
                    styles.marRHorizontalMain,
                    isSidebarVisible ? 'expanded' : 'collapsed'
                )}
            >
                {/* Toolbar & Breadcrumb */}
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
                                    onClick={() => setIsSidebarVisible(!isSidebarVisible)}
                                    {...restoreFocusTargetAttributes}
                                />
                            </Tooltip>
                            <ToolbarDivider />
                            <Breadcrumb aria-label="Breadcrumb default example">
                                <BreadcrumbItem>
                                    <BreadcrumbButton href={path}>Item 1</BreadcrumbButton>
                                </BreadcrumbItem>
                                <BreadcrumbDivider />
                                <BreadcrumbItem>
                                    <BreadcrumbButton href={path}>Item 2</BreadcrumbButton>
                                </BreadcrumbItem>
                                <BreadcrumbDivider />
                                <BreadcrumbItem>
                                    <BreadcrumbButton href={path}>Item 3</BreadcrumbButton>
                                </BreadcrumbItem>
                                <BreadcrumbDivider />
                                <BreadcrumbItem>
                                    <BreadcrumbButton href={path} current>Item 4</BreadcrumbButton>
                                </BreadcrumbItem>
                            </Breadcrumb>
                        </Toolbar></div>
                    <div className={mergeClasses(styles.flex, styles.itemsCenter, styles.gap1, styles.breadcrumbRight)}>Lorem ipsum (right section)</div>
                </div>

                {/* Content Area */}
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
            </main>
        </section>

    )
}
