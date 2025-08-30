'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Providers } from './providers';
import { Layout } from '../components/ui/layout/layout';
import { NAV_ICONS } from '../contexts/nav-items';

import { useBreadcrumbs } from '../components/ui/hooks/use-breadcrumbs';

interface PersistentLayoutClientProps {
    children: React.ReactNode;
    multiple?: boolean;
    initialTheme: string; // Add initialTheme prop
}

export default function PersistentLayoutClient({ children, multiple = false, initialTheme }: PersistentLayoutClientProps) {
    const pathname = usePathname();
    const breadcrumbs = useBreadcrumbs();

    return (
        <Providers themeName={initialTheme}>
            <Layout
                breadcrumbs={breadcrumbs}
                userName="User Name" // Placeholder
                userRole="User Role" // Placeholder
                navIcons={NAV_ICONS as Record<string, React.ElementType>} // Pass NAV_ICONS directly
                multiple={multiple} // Pass the multiple prop
            >
                {children}
            </Layout>
        </Providers>
    );
}