import * as React from "react";
import {
    BreadcrumbItem,
    BreadcrumbButton,
    BreadcrumbDivider
} from "@fluentui/react-components";
import { BreadcrumbItemType } from "../types";
interface BreadcrumbContentProps {
    items: BreadcrumbItemType[];
    isMobile: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbContentProps> = ({ items, isMobile }) => {
    const itemsToRender = (items && items.length > 0) ? (isMobile ? [items[items.length - 1]] : items) : [];

    return (
        <>
            {itemsToRender.map((item: BreadcrumbItemType, index: number) => (
                <React.Fragment key={item.href}>
                    <BreadcrumbItem>
                        <BreadcrumbButton href={item.href} current={item.current}>
                            {item.label}
                        </BreadcrumbButton>
                    </BreadcrumbItem>
                    {index < itemsToRender.length - 1 && <BreadcrumbDivider />}
                </React.Fragment>
            ))}
        </>
    );
};