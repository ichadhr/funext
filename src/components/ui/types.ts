export interface NavigationSubItem {
    id: string;
    label: string;
    href: string;
}

export interface NavigationItem {
    id: string;
    label: string;
    icon: string;
    href?: string;
    target?: string;
    subItems?: NavigationSubItem[];
}

export interface NavigationSection {
    title?: string;
    items: NavigationItem[];
    hasDivider?: boolean;
}

export interface SidebarProps {
    isMobile: boolean;
    isTablet: boolean;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    styles: Record<string, string>;
    navigationSections: NavigationSection[];
    navIcons: Record<string, React.ElementType>;
}

export interface ContentAreaProps {
    styles: Record<string, string>;
    isMobile: boolean;
    children: React.ReactNode;
}

export interface BreadcrumbItemType {
    label: string;
    href: string;
    current: boolean;
}

export interface BreadcrumbContentProps {
    isMobile: boolean;
}

export interface AppToolbarProps {
    isOpen: boolean;
    onToggle: () => void;
    styles: Record<string, string>;
    isMobile: boolean;
    isTablet: boolean;
    breadcrumbs: BreadcrumbItemType[];
    userName: string;
    userRole: string;
}