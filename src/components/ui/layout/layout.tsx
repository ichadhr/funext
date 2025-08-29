import * as React from "react";
import { AppToolbar } from "../toolbar/toolbar";
import { Sidebar } from "../sidebar/sidebar";
import { ContentArea } from "../content-area/content-area";
import { useStyles } from "../styles";
import useSidebar from "../hooks/use-sidebar";

import { BreadcrumbItemType } from "../types";

interface LayoutProps {
    children: React.ReactNode;
    multiple?: boolean; // Make multiple optional
    // Re-adding props for AppToolbar
    breadcrumbs: BreadcrumbItemType[];
    userName: string;
    userRole: string;
    navIcons: Record<string, React.ElementType>; // Add navIcons
}

export const Layout: React.FC<LayoutProps> = ({ children, multiple = true, breadcrumbs, userName, userRole, navIcons }) => {
    const styles = useStyles();
    const { isMobile, isTablet, isOpen, toggle, setIsOpen } = useSidebar();

    const sectionClass = `${styles.section} ${!(isMobile || isTablet) && isOpen ? styles.sectionWithGap : ''}`;

    return (
        <section className={sectionClass}>
            <Sidebar
                key="main-sidebar" // Add a static key to force persistence
                isMobile={isMobile}
                isTablet={isTablet}
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                styles={styles}
                navIcons={navIcons}
                multiple={multiple} // Pass multiple to Sidebar
            />
            <main className={styles.main}>
                <AppToolbar
                    isOpen={isOpen}
                    onToggle={toggle}
                    styles={styles}
                    isMobile={isMobile}
                    isTablet={isTablet}
                    // Re-passing props to AppToolbar
                    breadcrumbs={breadcrumbs}
                    userName={userName}
                    userRole={userRole}
                />
                <ContentArea styles={styles} isMobile={isMobile}>
                    {children}
                </ContentArea>
            </main>
        </section>
    );
};