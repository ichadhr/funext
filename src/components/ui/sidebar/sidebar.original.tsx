import * as React from "react";
import {
    AppItem,
    NavDrawer,
    NavDrawerBody,
    NavDrawerHeader,
} from "@fluentui/react-components";
import Image from "next/image";
import { SidebarProps } from "../types";
import { useStyles } from "../styles";
import { Navigation } from "../navigation/navigation";

export const Sidebar: React.FC<SidebarProps> = ({ isMobile, isTablet, isOpen, onOpenChange, navigationSections, navIcons }) => {
    const styles = useStyles();
    const sidebarClass = `${styles.sidebar} ${!(isMobile || isTablet) ? (isOpen ? styles.sidebarExpanded : styles.sidebarCollapsed) : ''
        }`;

    return (
        <aside className={sidebarClass}>
            <NavDrawer
                defaultSelectedValue="1"
                open={isOpen}
                type={isMobile || isTablet ? "overlay" : "inline"}
                multiple={false}
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
                    <Navigation
                        navigationSections={navigationSections}
                        navIcons={navIcons}
                        onNavCategoryItemToggle={() => {}} // Dummy function to satisfy type
                        openCategories={[]} // Empty array to satisfy type
                    />
                </NavDrawerBody>
            </NavDrawer>
        </aside>
    );
};