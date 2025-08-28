"use client"

import * as React from "react";
import { Layout } from "@components/ui/layout/layout";
import { NAVIGATION_SECTIONS, NAV_ICONS } from "../nav-items";
import { useBreadcrumbs } from "@components/ui/hooks/use-breadcrumbs";
import { CardGrid } from "@/components/grids";
import { Card } from "@fluentui/react-components";

const PAGE_TITLE = "Template";
const USER_NAME = "Kevin Sturgis";
const USER_ROLE = "Administrator";

export default function Page() {
    const breadcrumbs = useBreadcrumbs(PAGE_TITLE);

    return (
        <Layout
            navigationSections={NAVIGATION_SECTIONS}
            navIcons={NAV_ICONS}
            breadcrumbs={breadcrumbs}
            userName={USER_NAME}
            userRole={USER_ROLE}
        >
            <CardGrid type="fluid">
                <Card appearance="subtle"></Card>
            </CardGrid>
        </Layout>
    );
}
