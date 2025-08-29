"use client"

import * as React from "react";
import { CardGrid } from "@/components/grids";
import { Card } from "@fluentui/react-components";

export default function Page() {

    return (
            <CardGrid type="fluid">
                <Card appearance="subtle"></Card>
            </CardGrid>
    );
}
