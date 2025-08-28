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

export const Sidebar: React.FC<SidebarProps> = ({ isMobile, isTablet, isOpen, onOpenChange, navigationSections, navIcons, multiple }) => {
    const styles = useStyles();
    const router = useRouter();
    const pathname = usePathname();

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

    const [activeNavId, setActiveNavId] = React.useState<string>(currentSelectedValue || "");
    const [activeNavCategoryId, setActiveNavCategoryId] = React.useState<string>(currentSelectedCategoryValue || "");

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

    const findCategoryById = React.useCallback((id: string): string => {
        for (const section of navigationSections) {
            for (const item of section.items) {
                if (item.id === id) {
                    return ""; // Top-level item has no category, return empty string
                }
                if (item.subItems) {
                    for (const subItem of item.subItems) {
                        if (subItem.id === id) {
                            return item.id; // Return parent category ID
                        }
                    }
                }
            }
        }
        return ""; // Not found, return empty string
    }, [navigationSections]);

    const [userOpenedCategories, setUserOpenedCategories] = React.useState<string[]>([]);
    const [localOpenCategory, setLocalOpenCategory] = React.useState<string>(""); // Initialize with empty string

    // Initialize userOpenedCategories based on currentOpenCategories only on initial mount
    React.useEffect(() => {
        if (multiple && currentSelectedCategoryValue && !userOpenedCategories.includes(currentSelectedCategoryValue)) {
            setUserOpenedCategories(prev => {
                const newOpenCategories = new Set(prev);
                newOpenCategories.add(currentSelectedCategoryValue);
                return Array.from(newOpenCategories);
            });
        }
    }, [multiple, currentSelectedCategoryValue]); // Removed userOpenedCategories from deps to prevent infinite loop

    const handleNavItemSelect = React.useCallback(
        (event: Event | React.SyntheticEvent<Element, Event>, data: { value: string; categoryValue?: string }) => {
            setActiveNavId(data.value);
            setActiveNavCategoryId(findCategoryById(data.value));

            const { href, target } = findHrefById(data.value);
            if (href && href !== "#") { // Only navigate if href is not "#"
                if (target === "_blank") {
                    window.open(href, "_blank");
                } else {
                    router.push(href);
                }
            } else if (href === "#") { // If href is "#"
                const categoryId = findCategoryById(data.value);
                if (categoryId === "") { // It's a top-level item with href="#"
                    if (multiple) {
                        // When multiple is true, clicking a top-level item with href="#" should not close other categories
                        // It should only clear the active selection if it's a category header.
                        // For now, we'll just prevent navigation.
                    } else {
                        setLocalOpenCategory("");
                    }
                }
                // If it's a sub-item with href="#", do nothing to category state,
                // as the parent should remain open due to activeNavCategoryId
            }
        }, [router, findHrefById, findCategoryById, multiple, setLocalOpenCategory]
    );

    // Reset local open category state when the active path changes
    React.useEffect(() => {
        if (currentSelectedCategoryValue) {
            setLocalOpenCategory(currentSelectedCategoryValue);
        } else {
            setLocalOpenCategory("");
        }
    }, [currentSelectedCategoryValue]);

    const handleNavCategoryItemToggle = React.useCallback(
        (event: Event | React.SyntheticEvent<Element, Event>, data: { value: string; categoryValue?: string }) => {
            let toggledValue = data.value;

            if (!toggledValue && event.currentTarget instanceof HTMLElement) {
                toggledValue = event.currentTarget.dataset.value || '';
            }

            if (toggledValue) {
                if (multiple) { // Logic for multiple={true}
                    setUserOpenedCategories(prev => {
                        if (prev.includes(toggledValue)) {
                            // If already open, close it
                            return prev.filter(id => id !== toggledValue);
                        } else {
                            // If closed, open it
                            return [...prev, toggledValue];
                        }
                    });
                } else { // Logic for multiple={false}
                    if (localOpenCategory === toggledValue) {
                        setLocalOpenCategory("");
                    } else {
                        setLocalOpenCategory(toggledValue);
                        // No need to set activeNavId/CategoryId here, as handleNavItemSelect handles it
                        // and active state should persist even if category is closed.
                    }
                }
            }
        }, [multiple, localOpenCategory, setLocalOpenCategory, setUserOpenedCategories]
    );

    const combinedOpenCategories = React.useMemo(() => {
        if (multiple) {
            const openCategories = new Set<string>(userOpenedCategories);
            // Ensure the parent of the currently active item is always open
            currentOpenCategories.forEach(catId => openCategories.add(catId));
            return Array.from(openCategories);
        } else {
            return localOpenCategory ? [localOpenCategory] : [];
        }
    }, [multiple, userOpenedCategories, localOpenCategory, currentOpenCategories]);

    const sidebarClass = `${styles.sidebar} ${!(isMobile || isTablet) ? (isOpen ? styles.sidebarExpanded : styles.sidebarCollapsed) : ''
        }`;

    return (
        <aside className={sidebarClass}>
            <NavDrawer
                open={isOpen}
                type={isMobile || isTablet ? "overlay" : "inline"}
                multiple={multiple}
                className={!(isMobile || isTablet) ? styles.navDrawer : ''}
                onOpenChange={(_, data) => onOpenChange(data.open)}
                onNavItemSelect={handleNavItemSelect}
                onNavCategoryItemToggle={handleNavCategoryItemToggle}
                selectedValue={activeNavId}
                selectedCategoryValue={activeNavCategoryId}
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

