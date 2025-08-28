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
import { useRouter, usePathname } from "next/navigation"; // Import useRouter and usePathname

export const Sidebar: React.FC<SidebarProps> = ({ isMobile, isTablet, isOpen, onOpenChange, navigationSections, navIcons }) => {
    const styles = useStyles();
    const router = useRouter();
    const pathname = usePathname();

    const [localSelectedValue, setLocalSelectedValue] = React.useState<string | undefined>(undefined);

    // Function to find the href from navigationSections based on the selectedValue (id)
    const findHrefById = React.useCallback((id: string): { href?: string; target?: string } => {
        for (const section of navigationSections) {
            for (const item of section.items) {
                if (item.id === id) {
                    return { href: item.href, target: item.target };
                }
                if (item.subItems) {
                    for (const subItem of item.subItems) {
                        if (subItem.id === id) {
                            return { href: subItem.href }; // SubItems don't have target
                        }
                    }
                }
            }
        }
        return {};
    }, [navigationSections]);

    const handleNavItemSelect = React.useCallback(
        (event: Event | React.SyntheticEvent<Element, Event>, data: { value: string; categoryValue?: string }) => {
            setLocalSelectedValue(data.value); // Always update local selected value
            const { href, target } = findHrefById(data.value);
            if (href && href !== "#") { // Only navigate if href is not "#"
                if (target === "_blank") {
                    window.open(href, "_blank");
                } else {
                    router.push(href);
                }
            }
        },
        [router, findHrefById, setLocalSelectedValue]
    );

    // Determine the currently selected value and its parent category based on the pathname
    const { currentSelectedValue, currentSelectedCategoryValue, currentOpenCategories } = React.useMemo(() => {
        let selectedValue: string | undefined = undefined;
        let selectedCategoryValue: string | undefined = undefined;
        const openCategories: string[] = [];

        for (const section of navigationSections) {
            for (const item of section.items) {
                if (item.href === pathname) {
                    selectedValue = item.id;
                    break;
                }
                if (item.subItems) {
                    for (const subItem of item.subItems) {
                        if (subItem.href === pathname) {
                            selectedValue = subItem.id;
                            selectedCategoryValue = item.id; // Parent category ID
                            openCategories.push(item.id); // Open the parent category
                            break;
                        }
                    }
                }
                if (selectedValue) break;
            }
            if (selectedValue) break;
        }
        return { currentSelectedValue: selectedValue, currentSelectedCategoryValue: selectedCategoryValue, currentOpenCategories: openCategories };
    }, [pathname, navigationSections]);

    const [localOpenCategories, setLocalOpenCategories] = React.useState<string[]>([]);
    const [localClosedCategories, setLocalClosedCategories] = React.useState<string[]>([]);

    const handleNavCategoryItemToggle = React.useCallback(
        (event: Event | React.SyntheticEvent<Element, Event>, data: { value: string; categoryValue?: string }) => {
            let toggledValue = data.value;

            if (!toggledValue && event.currentTarget instanceof HTMLElement) {
                toggledValue = event.currentTarget.dataset.value || '';
            }


            if (toggledValue) {
                const isCurrentlyOpenByPath = currentOpenCategories.includes(toggledValue);
                const isLocallyOpen = localOpenCategories.includes(toggledValue);
                const isLocallyClosed = localClosedCategories.includes(toggledValue);

                let nextLocalOpen = [...localOpenCategories];
                let nextLocalClosed = [...localClosedCategories];

                if (isCurrentlyOpenByPath) {
                    // Category is open because of active path
                    if (isLocallyClosed) {
                        // User previously closed it, now wants to open it again
                        nextLocalClosed = nextLocalClosed.filter(id => id !== toggledValue);
                    } else {
                        // User wants to close it
                        nextLocalClosed = [...nextLocalClosed, toggledValue];
                    }
                    // Ensure it's not in localOpenCategories if it's forced open by path
                    nextLocalOpen = nextLocalOpen.filter(id => id !== toggledValue);
                } else {
                    // Category is not forced open by path
                    if (isLocallyOpen) {
                        // User wants to close it
                        nextLocalOpen = nextLocalOpen.filter(id => id !== toggledValue);
                        // Ensure it's not in localClosedCategories
                        nextLocalClosed = nextLocalClosed.filter(id => id !== toggledValue);
                    } else {
                        // User wants to open it
                        nextLocalOpen = [...nextLocalOpen, toggledValue];
                        // Ensure it's not in localClosedCategories
                        nextLocalClosed = nextLocalClosed.filter(id => id !== toggledValue);
                    }
                }

                setLocalOpenCategories(nextLocalOpen);
                setLocalClosedCategories(nextLocalClosed);
            }
        },
        [currentOpenCategories, localOpenCategories, localClosedCategories]
    );

    const combinedOpenCategories = React.useMemo(() => {
        const finalOpenCategories = new Set<string>();

        // Add categories that are explicitly opened by user
        localOpenCategories.forEach(id => finalOpenCategories.add(id));

        // Add categories that are open due to active path, but not explicitly closed by user
        currentOpenCategories.forEach(id => {
            if (!localClosedCategories.includes(id)) {
                finalOpenCategories.add(id);
            }
        });

        return Array.from(finalOpenCategories);
    }, [currentOpenCategories, localOpenCategories, localClosedCategories]);

    const sidebarClass = `${styles.sidebar} ${!(isMobile || isTablet) ? (isOpen ? styles.sidebarExpanded : styles.sidebarCollapsed) : ''
        }`;

    return (
        <aside className={sidebarClass}>
            <NavDrawer
                open={isOpen}
                type={isMobile || isTablet ? "overlay" : "inline"}
                multiple={true}
                className={!(isMobile || isTablet) ? styles.navDrawer : ''}
                onOpenChange={(_, data) => onOpenChange(data.open)}
                onNavItemSelect={handleNavItemSelect}
                onNavCategoryItemToggle={handleNavCategoryItemToggle}
                selectedValue={localSelectedValue || currentSelectedValue}
                selectedCategoryValue={currentSelectedCategoryValue}
                openCategories={combinedOpenCategories} // Use combinedOpenCategories
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
                        openCategories={combinedOpenCategories} // Pass openCategories to Navigation
                        onNavCategoryItemToggle={handleNavCategoryItemToggle} // Pass the handler
                    />
                </NavDrawerBody>
            </NavDrawer>
        </aside>
    );
};
