import { usePathname } from "next/navigation";
import { BreadcrumbItemType } from "@/components/ui/types";
import { useMemo } from "react";

interface PathToTitleMap {
    [key: string]: string;
}

const PATH_TO_TITLE_MAP: PathToTitleMap = {
    "/dashboard": "Dashboard",
    // Add other paths and their titles here as needed
};

export const useBreadcrumbs = (currentPageTitle: string): BreadcrumbItemType[] => {
    const pathname = usePathname();

    const breadcrumbs = useMemo(() => {
        const pathSegments = pathname.split('/').filter(segment => segment !== '');
        const generatedBreadcrumbs: BreadcrumbItemType[] = [];

        let currentPath = '';
        pathSegments.forEach((segment) => {
            currentPath += `/${segment}`;
            const title = PATH_TO_TITLE_MAP[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
            generatedBreadcrumbs.push({
                label: title,
                href: currentPath,
                current: false,
            });
        });

        // Update the last breadcrumb item to reflect the current page title and set current to true
        if (generatedBreadcrumbs.length > 0) {
            generatedBreadcrumbs[generatedBreadcrumbs.length - 1].label = currentPageTitle;
            generatedBreadcrumbs[generatedBreadcrumbs.length - 1].current = true;
        }

        return generatedBreadcrumbs;
    }, [pathname, currentPageTitle]);

    return breadcrumbs;
};