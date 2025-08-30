import { usePathname } from "next/navigation";
import { BreadcrumbItemType, NavigationSection, NavigationItem, NavigationSubItem } from "@/components/ui/types";
import { useMemo } from "react";
import { NAVIGATION_SECTIONS } from "@/contexts/nav-items";

// Helper function to find label by path segment
interface NavLookupMap {
    [key: string]: NavigationItem | NavigationSubItem;
}

// Helper function to create a flattened lookup map from navigation sections
const createNavLookupMap = (sections: NavigationSection[]): NavLookupMap => {
    const map: NavLookupMap = {};

    const traverse = (items: (NavigationItem | NavigationSubItem)[]) => {
        items.forEach(item => {
            // Use formatted label as a key for lookup
            const formattedLabel = item.label.toLowerCase().replace(/\s/g, '-');
            map[formattedLabel] = item;

            // Use href segment as a key for lookup if available
            if (item.href) {
                const itemPathSegment = item.href.split('/').filter(s => s !== '').pop();
                if (itemPathSegment) {
                    map[itemPathSegment] = item;
                }
            }

            if ('subItems' in item && item.subItems) {
                traverse(item.subItems);
            }
        });
    };

    sections.forEach(section => {
        traverse(section.items);
    });

    return map;
};

// Create the lookup map once
const NAV_LOOKUP_MAP = createNavLookupMap(NAVIGATION_SECTIONS);

const findNavItemByPathSegment = (
    segment: string
): NavigationItem | NavigationSubItem | undefined => {
    // Look up directly in the pre-generated map
    return NAV_LOOKUP_MAP[segment];
};

export const useBreadcrumbs = (): BreadcrumbItemType[] => {
    const pathname = usePathname();

    const breadcrumbs = useMemo(() => {
        const generatedBreadcrumbs: BreadcrumbItemType[] = [];

        // Always add Dashboard as the first breadcrumb for non-root paths
        if (pathname !== '/') {
            generatedBreadcrumbs.push({
                label: "Dashboard",
                href: "/",
                current: false,
            });
        }

        const pathSegments = pathname.split('/').filter(segment => segment !== '');
        let currentPath = '';

        pathSegments.forEach((segment) => {
            currentPath += `/${segment}`;
            
            const navItem = findNavItemByPathSegment(segment); // Use the optimized lookup
            const title = navItem?.label || segment.charAt(0).toUpperCase() + segment.slice(1);
            let breadcrumbHref: string;

            if (navItem && navItem.href === undefined) {
                // If navItem exists but has no href, set breadcrumb href to '#'
                breadcrumbHref = '#';
            } else if (navItem && navItem.href) {
                // If navItem exists and has an href, use it
                breadcrumbHref = navItem.href;
            } else {
                // Fallback to currentPath if no navItem or href is found
                breadcrumbHref = currentPath;
            }

            generatedBreadcrumbs.push({
                label: title,
                href: breadcrumbHref,
                current: false,
            });
        });

        // Handle the root path as "Dashboard" if it's the only path
        if (pathname === '/') {
            generatedBreadcrumbs.push({
                label: "Dashboard",
                href: "/",
                current: true,
            });
        } else if (generatedBreadcrumbs.length > 0) { // Set the last breadcrumb to current if not root
            generatedBreadcrumbs[generatedBreadcrumbs.length - 1].current = true;
        }

        return generatedBreadcrumbs;
    }, [pathname]);

    return breadcrumbs;
};