import * as React from "react";
import { AppToolbar } from "../toolbar/toolbar";
import { Sidebar } from "../sidebar/sidebar";
import { ContentArea } from "../content-area/content-area";
import { useStyles } from "../styles";
import useSidebar from "@hooks/use-sidebar";

import { NavigationSection, BreadcrumbItemType } from "../types";

interface LayoutProps {
    children: React.ReactNode;
    navigationSections: NavigationSection[];
    navIcons: Record<string, React.ElementType>;
    breadcrumbs: BreadcrumbItemType[];
    userName: string;
    userRole: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, navigationSections, navIcons, breadcrumbs, userName, userRole }) => {
    const styles = useStyles();
    const { isMobile, isTablet, isOpen, toggle, setIsOpen } = useSidebar();

    const sectionClass = `${styles.section} ${!(isMobile || isTablet) && isOpen ? styles.sectionWithGap : ''}`;

    return (
        <section className={sectionClass}>
            <Sidebar
                isMobile={isMobile}
                isTablet={isTablet}
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                styles={styles}
                navigationSections={navigationSections}
                navIcons={navIcons}
            />
            <main className={styles.main}>
                <AppToolbar
                    isOpen={isOpen}
                    onToggle={toggle}
                    styles={styles}
                    isMobile={isMobile}
                    isTablet={isTablet}
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