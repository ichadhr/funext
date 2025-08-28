"use client";

import * as React from "react";
import { Layout } from "@components/ui/layout/layout";
import { NAVIGATION_SECTIONS, NAV_ICONS } from "@contexts/nav-items";
import { useBreadcrumbs } from "@components/ui/hooks/use-breadcrumbs";
import { CardGrid, CardGridColumn, CardGridRow } from "@/components/grids";
import { Card, CardHeader, Text } from "@fluentui/react-components";
import { FluentDataTable } from "@/components/datatables";

const PAGE_TITLE = "Dashboard";
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
            {/* DataTables component with AJAX */}
            <CardGrid type="fluid">
                <Card appearance="subtle">
                    <h2>Album Data (DataTables with AJAX)</h2>
                    <FluentDataTable
                        options={{
                            columns: [
                                { title: "Album ID" },
                                { title: "Album Title" },
                                { title: "Artist Name" },
                                { title: "Track Count" },
                                { title: "Genres" },
                                { title: "Min Price" },
                                { title: "Max Price" },
                                { title: "Avg Price" }
                            ],
                            processing: true,
                            serverSide: true,
                            responsive: true,
                            ordering: true,
                            pageLength: 10,
                            lengthChange: true,
                            ajax: {
                                url: "http://localhost:8080/dt_json",
                                type: "POST"
                            }
                        }}
                    />
                </Card>
            </CardGrid>
            <CardGrid type="fluid">
                <Card appearance="subtle">
                    <CardHeader header={<Text weight="semibold">CardGrid with `fluid` container type</Text>} />
                    <Text>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </Text>
                </Card>
                <Text>This is text content for the fluid CardGrid.</Text>
            </CardGrid>

            <CardGrid>
                <Card appearance="subtle">
                    <CardHeader header={<Text weight="semibold">Default CardGrid (no specific type, behaves like container-fluid)</Text>} />
                    <Text>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </Text>
                </Card>
                <Text>This is text content for the default CardGrid.</Text>
            </CardGrid>

            <CardGrid type="sm">
                <Card appearance="subtle">
                    <CardHeader header={<Text weight="semibold">CardGrid with `sm` container type</Text>} />
                    <Text>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </Text>
                </Card>
                <Text>This is text content for the sm CardGrid.</Text>
            </CardGrid>

            <CardGrid type="md">
                <Card appearance="subtle">
                    <CardHeader header={<Text weight="semibold">CardGrid with `md` container type</Text>} />
                    <Text>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </Text>
                </Card>
                <Text>This is text content for the md CardGrid.</Text>
            </CardGrid>

            <CardGrid type="lg">
                <Card appearance="subtle">
                    <CardHeader header={<Text weight="semibold">CardGrid with `lg` container type</Text>} />
                    <Text>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </Text>
                </Card>
                <Text>This is text content for the lg CardGrid.</Text>
            </CardGrid>

            <CardGrid type="xl">
                <Card appearance="subtle">
                    <CardHeader header={<Text weight="semibold">CardGrid with `xl` container type</Text>} />
                    <Text>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </Text>
                </Card>
                <Text>This is text content for the xl CardGrid.</Text>
            </CardGrid>

            <CardGrid type="xxl">
                <Card appearance="subtle">
                    <CardHeader header={<Text weight="semibold">CardGrid with `xxl` container type</Text>} />
                    <Text>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </Text>
                </Card>
                <Text>This is text content for the xxl CardGrid.</Text>
            </CardGrid>

            <h3>CardGridRow Test</h3>
            <CardGridRow>
                <CardGridColumn xs={6}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">1 of 2 (xs=6)</Text>} />
                        <Text>Content for 1 of 2</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn xs={6}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">2 of 2 (xs=6)</Text>} />
                        <Text>Content for 2 of 2</Text>
                    </Card>
                </CardGridColumn>
            </CardGridRow>

            {/* Bootstrap-like example 1: justify-content-md-center with col-lg-2 and col-md-auto */}
            <CardGridRow justifyContent={{ md: "center" }}>
                <CardGridColumn lg={2}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">1 of 3 (lg=2)</Text>} />
                        <Text>Content for 1 of 3</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn mdAuto>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">Variable width content (mdAuto)</Text>} />
                        <Text>This column will take up only its content width on medium and larger screens.</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn lg={2}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">3 of 3 (lg=2)</Text>} />
                        <Text>Content for 3 of 3</Text>
                    </Card>
                </CardGridColumn>
            </CardGridRow>

            {/* Bootstrap-like example 2: Stack the columns on mobile by making one full-width and the other half-width */}
            <CardGridRow>
                <CardGridColumn md={8}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">.col-md-8</Text>} />
                        <Text>This column is 8/12 on medium+ screens, full width on smaller.</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn xs={6} md={4}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">.col-6 .col-md-4</Text>} />
                        <Text>This column is 6/12 on extra small, 4/12 on medium+ screens.</Text>
                    </Card>
                </CardGridColumn>
            </CardGridRow>

            {/* Bootstrap-like example 3: Columns start at 50% wide on mobile and bump up to 33.3% wide on desktop */}
            <CardGridRow>
                <CardGridColumn xs={6} md={4}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">.col-6 .col-md-4</Text>} />
                        <Text>Column 1</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn xs={6} md={4}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">.col-6 .col-md-4</Text>} />
                        <Text>Column 2</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn xs={6} md={4}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">.col-6 .col-md-4</Text>} />
                        <Text>Column 3</Text>
                    </Card>
                </CardGridColumn>
            </CardGridRow>

            {/* Bootstrap-like example 4: Columns are always 50% wide, on mobile and desktop */}
            <CardGridRow>
                <CardGridColumn xs={6}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">.col-6</Text>} />
                        <Text>Column 1</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn xs={6}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">.col-6</Text>} />
                        <Text>Column 2</Text>
                    </Card>
                </CardGridColumn>
            </CardGridRow>

            {/* Bootstrap-like example 5: row-cols-2 */}
            <CardGridRow rowCols={2}>
                <CardGridColumn>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">Column (rowCols=2)</Text>} />
                        <Text>Column 1</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">Column (rowCols=2)</Text>} />
                        <Text>Column 2</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">Column (rowCols=2)</Text>} />
                        <Text>Column 3</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">Column (rowCols=2)</Text>} />
                        <Text>Column 4</Text>
                    </Card>
                </CardGridColumn>
            </CardGridRow>

            {/* Bootstrap-like example 6: row-cols-4 with a col-6 override */}
            <CardGridRow rowCols={4}>
                <CardGridColumn>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">Column (rowCols=4)</Text>} />
                        <Text>Column 1</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">Column (rowCols=4)</Text>} />
                        <Text>Column 2</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn xs={6}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">Column (xs=6 override)</Text>} />
                        <Text>Column 3 (50% width)</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">Column (rowCols=4)</Text>} />
                        <Text>Column 4</Text>
                    </Card>
                </CardGridColumn>
            </CardGridRow>

            {/* Bootstrap-like example 7: Nested Grid */}
            <CardGridRow>
                <CardGridColumn sm={3}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">Level 1: .col-sm-3</Text>} />
                        <Text>This is the first level 1 column.</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn sm={9}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">Level 1: .col-sm-9</Text>} />
                        <Text>This is the second level 1 column, containing a nested row.</Text>
                        <CardGridRow>
                            <CardGridColumn xs={8} sm={6}>
                                <Card appearance="filled-alternative">
                                    <CardHeader header={<Text weight="semibold">Level 2: .col-8 .col-sm-6</Text>} />
                                    <Text>This is the first nested column.</Text>
                                </Card>
                            </CardGridColumn>
                            <CardGridColumn xs={4} sm={6}>
                                <Card appearance="filled-alternative">
                                    <CardHeader header={<Text weight="semibold">Level 2: .col-4 .col-sm-6</Text>} />
                                    <Text>This is the second nested column.</Text>
                                </Card>
                            </CardGridColumn>
                        </CardGridRow>
                    </Card>
                </CardGridColumn>
            </CardGridRow>

            {/* Bootstrap-like example 8: Vertical alignment - align-items-center */}
            <CardGridRow alignItems="center" style={{ minHeight: '150px', border: '1px solid #ccc' }}> {/* Added minHeight for visual effect */}
                <CardGridColumn col>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">One of three columns</Text>} />
                        <Text>Content 1</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn col>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">One of three columns</Text>} />
                        <Text>Content 2<br />with more<br />lines</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn col>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">One of three columns</Text>} />
                        <Text>Content 3</Text>
                    </Card>
                </CardGridColumn>
            </CardGridRow>

            {/* Bootstrap-like example 9: Vertical alignment - align-items-start */}
            <CardGridRow alignItems="start" style={{ minHeight: '150px', border: '1px solid #ccc', marginTop: '20px' }}>
                <CardGridColumn col>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">One of three columns</Text>} />
                        <Text>Content 1</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn col>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">One of three columns</Text>} />
                        <Text>Content 2<br />with more<br />lines</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn col>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">One of three columns</Text>} />
                        <Text>Content 3</Text>
                    </Card>
                </CardGridColumn>
            </CardGridRow>

            {/* Bootstrap-like example 10: Vertical alignment - align-items-end */}
            <CardGridRow alignItems="end" style={{ minHeight: '150px', border: '1px solid #ccc', marginTop: '20px' }}>
                <CardGridColumn col>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">One of three columns</Text>} />
                        <Text>Content 1</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn col>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">One of three columns</Text>} />
                        <Text>Content 2<br />with more<br />lines</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn col>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">One of three columns</Text>} />
                        <Text>Content 3</Text>
                    </Card>
                </CardGridColumn>
            </CardGridRow>

            {/* Bootstrap-like example 11: Individual column vertical alignment */}
            <CardGridRow style={{ minHeight: '150px', border: '1px solid #ccc', marginTop: '20px' }}>
                <CardGridColumn col alignSelf="start">
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">One of three columns</Text>} />
                        <Text>Align self start</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn col alignSelf="center">
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">One of three columns</Text>} />
                        <Text>Align self center<br />with more<br />lines</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn col alignSelf="end">
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">One of three columns</Text>} />
                        <Text>Align self end</Text>
                    </Card>
                </CardGridColumn>
            </CardGridRow>

            {/* Bootstrap-like example 12: Horizontal alignment - justify-content-start */}
            <CardGridRow justifyContent="start" style={{ border: '1px solid #ccc', marginTop: '20px' }}>
                <CardGridColumn xs={4}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">One of two columns</Text>} />
                        <Text>justify-content-start</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn xs={4}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">One of two columns</Text>} />
                        <Text>justify-content-start</Text>
                    </Card>
                </CardGridColumn>
            </CardGridRow>

            {/* Bootstrap-like example 13: Horizontal alignment - justify-content-center */}
            <CardGridRow justifyContent="center" style={{ border: '1px solid #ccc', marginTop: '20px' }}>
                <CardGridColumn xs={4}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">One of two columns</Text>} />
                        <Text>justify-content-center</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn xs={4}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">One of two columns</Text>} />
                        <Text>justify-content-center</Text>
                    </Card>
                </CardGridColumn>
            </CardGridRow>

            {/* Bootstrap-like example 14: Horizontal alignment - justify-content-end */}
            <CardGridRow justifyContent="end" style={{ border: '1px solid #ccc', marginTop: '20px' }}>
                <CardGridColumn xs={4}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">One of two columns</Text>} />
                        <Text>justify-content-end</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn xs={4}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">One of two columns</Text>} />
                        <Text>justify-content-end</Text>
                    </Card>
                </CardGridColumn>
            </CardGridRow>

            {/* Bootstrap-like example 15: Horizontal alignment - justify-content-around */}
            <CardGridRow justifyContent="around" style={{ border: '1px solid #ccc', marginTop: '20px' }}>
                <CardGridColumn xs={4}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">One of two columns</Text>} />
                        <Text>justify-content-around</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn xs={4}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">One of two columns</Text>} />
                        <Text>justify-content-around</Text>
                    </Card>
                </CardGridColumn>
            </CardGridRow>

            {/* Bootstrap-like example 16: Horizontal alignment - justify-content-between */}
            <CardGridRow justifyContent="between" style={{ border: '1px solid #ccc', marginTop: '20px' }}>
                <CardGridColumn xs={4}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">One of two columns</Text>} />
                        <Text>justify-content-between</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn xs={4}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">One of two columns</Text>} />
                        <Text>justify-content-between</Text>
                    </Card>
                </CardGridColumn>
            </CardGridRow>

            {/* Bootstrap-like example 17: Horizontal alignment - justify-content-evenly */}
            <CardGridRow justifyContent="evenly" style={{ border: '1px solid #ccc', marginTop: '20px' }}>
                <CardGridColumn xs={4}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">One of two columns</Text>} />
                        <Text>justify-content-evenly</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn xs={4}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">One of two columns</Text>} />
                        <Text>justify-content-evenly</Text>
                    </Card>
                </CardGridColumn>
            </CardGridRow>

            {/* Bootstrap-like example 18: Column offsets - offset-md-4 */}
            <CardGridRow style={{ border: '1px solid #ccc', marginTop: '20px' }}>
                <CardGridColumn md={4}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">.col-md-4</Text>} />
                        <Text>Column 1</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn md={4} offsetMd={4}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">.col-md-4 .offset-md-4</Text>} />
                        <Text>Column 2 with offset</Text>
                    </Card>
                </CardGridColumn>
            </CardGridRow>

            {/* Bootstrap-like example 19: Column offsets - offset-md-3 */}
            <CardGridRow style={{ border: '1px solid #ccc', marginTop: '20px' }}>
                <CardGridColumn md={3} offsetMd={3}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">.col-md-3 .offset-md-3</Text>} />
                        <Text>Column 1 with offset</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn md={3} offsetMd={3}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">.col-md-3 .offset-md-3</Text>} />
                        <Text>Column 2 with offset</Text>
                    </Card>
                </CardGridColumn>
            </CardGridRow>

            {/* Bootstrap-like example 20: Column offsets - offset-md-3 (single column) */}
            <CardGridRow style={{ border: '1px solid #ccc', marginTop: '20px' }}>
                <CardGridColumn md={6} offsetMd={3}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">.col-md-6 .offset-md-3</Text>} />
                        <Text>Single column with offset</Text>
                    </Card>
                </CardGridColumn>
            </CardGridRow>

            {/* Bootstrap-like example 18: Column offsets - offset-md-4 */}
            <CardGridRow style={{ border: '1px solid #ccc', marginTop: '20px' }}>
                <CardGridColumn md={4}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">.col-md-4</Text>} />
                        <Text>Column 1</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn md={4} offsetMd={4}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">.col-md-4 .offset-md-4</Text>} />
                        <Text>Column 2 with offset</Text>
                    </Card>
                </CardGridColumn>
            </CardGridRow>

            {/* Bootstrap-like example 19: Column offsets - offset-md-3 */}
            <CardGridRow style={{ border: '1px solid #ccc', marginTop: '20px' }}>
                <CardGridColumn md={3} offsetMd={3}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">.col-md-3 .offset-md-3</Text>} />
                        <Text>Column 1 with offset</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn md={3} offsetMd={3}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">.col-md-3 .offset-md-3</Text>} />
                        <Text>Column 2 with offset</Text>
                    </Card>
                </CardGridColumn>
            </CardGridRow>

            {/* Bootstrap-like example 20: Column offsets - offset-md-3 (single column) */}
            <CardGridRow style={{ border: '1px solid #ccc', marginTop: '20px' }}>
                <CardGridColumn md={6} offsetMd={3}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">.col-md-6 .offset-md-3</Text>} />
                        <Text>Single column with offset</Text>
                    </Card>
                </CardGridColumn>
            </CardGridRow>

            {/* Bootstrap-like example 21: Margin-left auto */}
            <CardGridRow style={{ border: '1px solid #ccc', marginTop: '20px' }}>
                <CardGridColumn md={4}>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">.col-md-4</Text>} />
                        <Text>Column 1</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn md={4} msAuto>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">.col-md-4 .ms-auto</Text>} />
                        <Text>Column 2 with margin-left auto</Text>
                    </Card>
                </CardGridColumn>
            </CardGridRow>

            {/* Bootstrap-like example 22: Margin-left auto with breakpoint */}
            <CardGridRow style={{ border: '1px solid #ccc', marginTop: '20px' }}>
                <CardGridColumn md={3} mdMsAuto>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">.col-md-3 .ms-md-auto</Text>} />
                        <Text>Column 1 with margin-left auto on md breakpoint</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn md={3} mdMsAuto>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">.col-md-3 .ms-md-auto</Text>} />
                        <Text>Column 2 with margin-left auto on md breakpoint</Text>
                    </Card>
                </CardGridColumn>
            </CardGridRow>

            {/* Bootstrap-like example 23: Margin-right auto */}
            <CardGridRow style={{ border: '1px solid #ccc', marginTop: '20px' }}>
                <CardGridColumn col meAuto>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">.col-auto .me-auto</Text>} />
                        <Text>Column 1 with margin-right auto</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn col>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">.col-auto</Text>} />
                        <Text>Column 2</Text>
                    </Card>
                </CardGridColumn>
            </CardGridRow>

            {/* Custom Gutter Example: Horizontal Gutter (gx) */}
            <h3>Custom Gutter Example: Horizontal Gutter (gx)</h3>
            <CardGridRow gx={5} style={{ border: '1px solid #ccc' }}>
                <CardGridColumn col>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">Column with gx=5</Text>} />
                        <Text>Custom column padding</Text>
                    </Card>
                </CardGridColumn>
                <CardGridColumn col>
                    <Card appearance="filled-alternative">
                        <CardHeader header={<Text weight="semibold">Column with gx=5</Text>} />
                        <Text>Custom column padding</Text>
                    </Card>
                </CardGridColumn>
            </CardGridRow>
        </Layout>
    );
}
