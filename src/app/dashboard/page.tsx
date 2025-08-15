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
        backgroundColor: tokens.colorNeutralBackground4
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
        borderRadius: tokens.borderRadiusLarge,
        boxShadow: tokens.shadow2,
        border: tokens.colorTransparentStroke
    },

    nav: {
        minWidth: "260px",
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

    return (
        <section className={`${mergeClasses(styles.flex, isSidebarVisible ? 'gap-1' : 'gap-0', 'h-screen', 'py-7', styles.sidebar)}`}>
            {/* Sidebar with Fluent UI Nav */}
            <aside className={`${mergeClasses(styles.flex, styles.flexDirection)}`}>
                <NavDrawer
                    defaultSelectedValue="1"
                    open={isSidebarVisible}
                    type="inline"
                    className={styles.nav}
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

            {/* Main Content Area - Rounded and floating */}
            <main className={`${mergeClasses(isSidebarVisible ? 'mr-7' : 'mx-7', styles.flex, styles.flex1, styles.flexDirection, styles.bgContent, styles.main)}`}>
                {/* Breadcrumb */}
                <div className="px-5 pt-3">
                    <Toolbar className="flex items-center gap-2">
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
                                <BreadcrumbButton href={path}>
                                    Item 1
                                </BreadcrumbButton>
                            </BreadcrumbItem>
                            <BreadcrumbDivider />
                            <BreadcrumbItem>
                                <BreadcrumbButton href={path}>
                                    Item 2
                                </BreadcrumbButton>
                            </BreadcrumbItem>
                            <BreadcrumbDivider />
                            <BreadcrumbItem>
                                <BreadcrumbButton href={path}>
                                    Item 3
                                </BreadcrumbButton>
                            </BreadcrumbItem>
                            <BreadcrumbDivider />
                            <BreadcrumbItem>
                                <BreadcrumbButton href={path} current>
                                    Item 4
                                </BreadcrumbButton>
                            </BreadcrumbItem>
                        </Breadcrumb>
                    </Toolbar>
                </div>

                {/* Content Area */}
                <div className="p-5 flex-1">
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
