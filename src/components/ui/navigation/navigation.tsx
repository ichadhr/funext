import * as React from "react";
import {
    NavDivider,
    NavSectionHeader,
    NavCategory,
    NavCategoryItem,
    NavSubItemGroup,
    NavSubItem,
    NavItem
} from "@fluentui/react-components";
import { NavigationSection, NavigationItem, NavigationSubItem } from "../types";

interface NavigationProps {
    navigationSections: NavigationSection[];
    navIcons: Record<string, React.ElementType>;
}

export const Navigation: React.FC<NavigationProps> = ({ navigationSections, navIcons }) => {
    return (
        <>
            {navigationSections.map((section: NavigationSection, sectionIndex: number) => (
                <React.Fragment key={sectionIndex}>
                    {section.hasDivider && <NavDivider />}
                    {section.title && <NavSectionHeader>{section.title}</NavSectionHeader>}
                    {section.items.map((item: NavigationItem) => {
                        const IconComponent = navIcons[item.icon];

                        return item.subItems ? (
                            <NavCategory key={item.id} value={item.id}>
                                <NavCategoryItem icon={<IconComponent />}>
                                    {item.label}
                                </NavCategoryItem>
                                <NavSubItemGroup>
                                    {item.subItems.map((subItem: NavigationSubItem) => (
                                        <NavSubItem key={subItem.id} value={subItem.id}>
                                            {subItem.label}
                                        </NavSubItem>
                                    ))}
                                </NavSubItemGroup>
                            </NavCategory>
                        ) : (
                            <NavItem
                                key={item.id}
                                icon={<IconComponent />}
                                value={item.id}
                            >
                                {item.label}
                            </NavItem>
                        );
                    })}
                </React.Fragment>
            ))}
        </>
    );
};