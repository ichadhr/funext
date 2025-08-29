import * as React from "react";
import {
    AppItem,
    NavDrawer,
    NavDrawerBody,
    NavDrawerHeader,
    OnNavItemSelectData, // Import OnNavItemSelectData
} from "@fluentui/react-components";
import Image from "next/image";
import { SidebarProps } from "../types";
import { useStyles } from "../styles";
import { Navigation } from "../navigation/navigation";
import { useRouter, usePathname } from "next/navigation"; // Import useRouter and usePathname
import { NAVIGATION_SECTIONS } from "@/contexts/nav-items"; // Import NAVIGATION_SECTIONS

export const Sidebar: React.FC<SidebarProps> = ({
    isMobile,
    isTablet,
    isOpen,
    onOpenChange,
    navIcons,
    multiple, // Add multiple to destructuring
}) => {
    const styles = useStyles();
    const router = useRouter();
    const pathname = usePathname();

    // Determine the currently selected value and its parent category based on the pathname
    const { currentSelectedValue, currentSelectedCategoryValue } = React.useMemo(() => {
        let selectedValue: string | undefined = undefined;
        let selectedCategoryValue: string | undefined = undefined;

        for (const section of NAVIGATION_SECTIONS) { // Use NAVIGATION_SECTIONS directly
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
                            break;
                        }
                    }
                }
                if (selectedValue) break;
            }
            if (selectedValue) break;
        }
        return { currentSelectedValue: selectedValue, currentSelectedCategoryValue: selectedCategoryValue };
    }, [pathname]);

    const [activeNavId, setActiveNavId] = React.useState<string>(currentSelectedValue || "");
    const [openCategories, setOpenCategories] = React.useState<string[]>([]);

    // Function to find the href from NAVIGATION_SECTIONS based on the selectedValue (id)
    const findHrefById = React.useCallback((id: string): { href?: string; target?: string } => {
        for (const section of NAVIGATION_SECTIONS) {
            for (const item of section.items) {
                if (item.id === id) {
                    return { href: item.href, target: item.target };
                }
                if (item.subItems) {
                    for (const subItem of item.subItems) {
                        if (subItem.id === id) {
                            return { href: subItem.href };
                        }
                    }
                }
            }
        }
        return {};
    }, []);

    const handleNavItemSelect = React.useCallback(
        (event: Event | React.SyntheticEvent<Element, Event>, data: { value: string; categoryValue?: string }) => {
            setActiveNavId(data.value);

            const { href, target } = findHrefById(data.value);
            if (href && href !== "#") {
                if (target === "_blank") {
                    window.open(href, "_blank");
                } else {
                    router.push(href);
                }
            }
        }, [router, findHrefById]
    );

    const handleNavCategoryItemToggle = React.useCallback(
        (event: Event | React.SyntheticEvent<Element, Event>, data: OnNavItemSelectData) => {
            if (data.categoryValue) {
                setOpenCategories(prev => {
                    const isOpen = prev.includes(data.categoryValue as string);
                    if (isOpen) {
                        return prev.filter(category => category !== data.categoryValue);
                    } else {
                        return multiple ? [...prev, data.categoryValue as string] : [data.categoryValue as string];
                    }
                });
            }
        }, [multiple]
    );

    // Update activeNavId and openCategories when pathname changes (on page refresh or direct URL navigation)
    React.useEffect(() => {
        setActiveNavId(currentSelectedValue || "");
        if (currentSelectedCategoryValue) {
            setOpenCategories(prev => {
                if (multiple) {
                    // Add the new active category to the existing open categories
                    if (!prev.includes(currentSelectedCategoryValue as string)) {
                        return [...prev, currentSelectedCategoryValue as string];
                    }
                    return prev;
                } else {
                    // Only keep the active category open
                    return [currentSelectedCategoryValue as string];
                }
            });
        } else if (!multiple) {
            // If not multiple and no active category, close all
            setOpenCategories([]);
        }
    }, [currentSelectedValue, currentSelectedCategoryValue, pathname, multiple]);

    const sidebarClass = `${styles.sidebar} ${!(isMobile || isTablet) ? (isOpen ? styles.sidebarExpanded : styles.sidebarCollapsed) : ''
        }`;

    return (
        <aside className={sidebarClass}>
            <NavDrawer
                open={isOpen}
                type={isMobile || isTablet ? "overlay" : "inline"}
                multiple={multiple} // Pass the multiple prop dynamically
                className={!(isMobile || isTablet) ? styles.navDrawer : ''}
                onOpenChange={(_, data) => onOpenChange(data.open)}
                onNavItemSelect={handleNavItemSelect}
                selectedValue={activeNavId} // Use activeNavId to control selected value
                openCategories={openCategories} // Control open categories
                onNavCategoryItemToggle={handleNavCategoryItemToggle} // Handle category toggles
            >
                <NavDrawerHeader className={isMobile || isTablet ? styles.navHeader : ''}>
                    <AppItem as="a" href="/" aria-label="Fluent UI Logo">
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
                        navigationSections={NAVIGATION_SECTIONS} // Pass NAVIGATION_SECTIONS directly
                        navIcons={navIcons} // Pass navIcons received by Sidebar
                    />
                </NavDrawerBody>
            </NavDrawer>
        </aside>
    );
};
