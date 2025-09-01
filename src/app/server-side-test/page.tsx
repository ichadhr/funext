'use client';

import React from 'react';
import { FluentTable } from "@components/fluent-table/fluent-table";
import { ColumnDef } from '@tanstack/react-table';
import { ServerSideParams, ServerResponse } from '@components/fluent-table/types';
import { SortingState } from '@tanstack/react-table';
import { createRestApiQueryFn } from '@components/fluent-table/ext/server-side/api';
import { createDataTablesQueryFn } from '@components/fluent-table/ext/server-side/datatables';
import { createGraphQLQueryFn } from '@components/fluent-table/ext/server-side/graphql';

// Sample data for testing backward compatibility
const sampleData = [
    { id: 1, name: 'John Doe', position: 'Developer', office: 'New York', startDate: '2020-01-15', salary: 75000 },
    { id: 2, name: 'Jane Smith', position: 'Designer', office: 'San Francisco', startDate: '2019-03-22', salary: 65000 },
    { id: 3, name: 'Bob Johnson', position: 'Manager', office: 'London', startDate: '2018-07-10', salary: 85000 },
];

const columns: ColumnDef<typeof sampleData[0]>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'position',
        header: 'Position',
    },
    {
        accessorKey: 'office',
        header: 'Office',
    },
    {
        accessorKey: 'startDate',
        header: 'Start Date',
    },
    {
        accessorKey: 'salary',
        header: 'Salary',
    },
];

// DataTables format columns (using array indices as keys)
const dataTablesColumns: ColumnDef<Record<string, unknown>>[] = [
    {
        accessorKey: 'col_0',
        header: 'Album ID',
    },
    {
        accessorKey: 'col_1',
        header: 'Album Title',
    },
    {
        accessorKey: 'col_2',
        header: 'Artist Name',
    },
    {
        accessorKey: 'col_3',
        header: 'Track Count',
    },
    {
        accessorKey: 'col_4',
        header: 'Genres',
    },
    {
        accessorKey: 'col_5',
        header: 'Min Price',
    },
    {
        accessorKey: 'col_6',
        header: 'Max Price',
    },
    {
        accessorKey: 'col_7',
        header: 'Avg Price',
    },
];

// Note: API functions are now handled by the extension helpers
// - REST API: createRestApiQueryFn()
// - DataTables: createDataTablesQueryFn()
// - GraphQL: createGraphQLQueryFn()

// Note: DataTables API function is now handled by createDataTablesQueryFn() helper

export default function ServerSideTestPage() {
    const [testMode, setTestMode] = React.useState<'client' | 'server' | 'datatables' | 'graphql'>('client');

    return (
        <div style={{ padding: '20px' }}>
            <h1>FluentTable Server-Side Processing Test</h1>

            <div style={{ marginBottom: '20px' }}>
                <label>
                    <input
                        type="radio"
                        value="client"
                        checked={testMode === 'client'}
                        onChange={(e) => setTestMode(e.target.value as 'client')}
                    />
                    Client-Side Processing
                </label>
                <label style={{ marginLeft: '20px' }}>
                    <input
                        type="radio"
                        value="server"
                        checked={testMode === 'server'}
                        onChange={(e) => setTestMode(e.target.value as 'server')}
                    />
                    REST API Format (Mock API)
                </label>
                <label style={{ marginLeft: '20px' }}>
                    <input
                        type="radio"
                        value="datatables"
                        checked={testMode === 'datatables'}
                        onChange={(e) => setTestMode(e.target.value as 'datatables')}
                    />
                    DataTables Format (http://localhost:8080/dt_json)
                </label>
                <label style={{ marginLeft: '20px' }}>
                    <input
                        type="radio"
                        value="graphql"
                        checked={testMode === 'graphql'}
                        onChange={(e) => setTestMode(e.target.value as 'graphql')}
                    />
                    GraphQL Format (Mock API)
                </label>
            </div>

            <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                <strong>Current Mode:</strong> {
                    testMode === 'client' ? 'Client-Side' :
                    testMode === 'server' ? 'REST API Format (Mock API)' :
                    testMode === 'datatables' ? 'DataTables Format (Real API)' :
                    'GraphQL Format (Mock API)'
                }
                <br />
                <strong>Instructions:</strong> Try sorting, searching, and pagination to test functionality.
                {testMode === 'datatables' && (
                    <><br /><strong>Note:</strong> Requires DataTables server running at http://localhost:8080/dt_json</>
                )}
                {testMode === 'graphql' && (
                    <><br /><strong>Note:</strong> GraphQL mode uses mock API at /api/graphql for demonstration</>
                )}
            </div>

            <FluentTable
                data={testMode === 'client' ? sampleData : []}
                columns={testMode === 'datatables' ? dataTablesColumns : columns as ColumnDef<Record<string, unknown>>[]}
                layout={{
                    topStart: 'pageSize',
                    topEnd: 'search',
                    bottomStart: 'info',
                    bottomEnd: 'pagination',
                }}
                striped
                size="small"
                serverSide={testMode === 'server' ? {
                    url: '/api/table-data',
                    queryKey: (params: ServerSideParams) => ['rest-data', params],
                    queryFn: createRestApiQueryFn('/api/table-data'),
                    dataFormat: 'rest',
                } : testMode === 'datatables' ? {
                    url: 'http://localhost:8080/dt_json',
                    queryKey: (params: ServerSideParams) => ['datatables-data', params],
                    queryFn: createDataTablesQueryFn('http://localhost:8080/dt_json', dataTablesColumns as ColumnDef<unknown>[]),
                    dataFormat: 'datatables',
                } : testMode === 'graphql' ? {
                    url: '/api/graphql',
                    queryKey: (params: ServerSideParams) => ['graphql-data', params],
                    queryFn: createGraphQLQueryFn('/api/graphql'),
                    dataFormat: 'graphql',
                } : undefined}
                event={{
                    onInitializing: (initializing: boolean) => {
                        console.log('🔄 Initializing:', initializing);
                    },
                    onProcessing: (processing: boolean) => {
                        console.log(processing ? '⏳ Processing...' : '✅ Processing complete');
                    },
                    onDraw: () => {
                        console.log('🎨 Table drawn');
                    },
                    onSearch: (filter: string) => {
                        console.log('🔍 Search changed:', filter);
                    },
                    onOrder: (sorting: SortingState) => {
                        console.log('📊 Sorting changed:', sorting);
                    },
                    onPageChange: (pageIndex: number, pageSize: number) => {
                        console.log('📄 Page changed:', { pageIndex, pageSize });
                    },
                    onServerRequest: (params: ServerSideParams) => {
                        console.log('📡 Server request:', params);
                    },
                    onServerResponse: (response: ServerResponse<unknown>) => {
                        console.log('📥 Server response:', response);
                    },
                    onError: (error: Error) => {
                        console.error('❌ Error:', error);
                    },
                }}
            />

            <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
                <h3>✅ Test Results</h3>
                <ul>
                    <li>Check browser console for event logs</li>
                    <li>Verify sorting works in all modes</li>
                    <li>Verify search works in all modes</li>
                    <li>Verify pagination works in all modes</li>
                    <li>Verify server-side events fire only in server/datatable/graphql modes</li>
                    <li>Verify backward compatibility (client mode works)</li>
                    <li>Verify REST API sends JSON payload</li>
                    <li>Verify DataTables sends form-encoded payload</li>
                    <li>Verify GraphQL sends query with variables</li>
                    <li>Verify automatic response format detection</li>
                </ul>
                <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
                    <strong>🎯 DataTables Test:</strong> Make sure you have a DataTables server running at <code>http://localhost:8080/dt_json</code> to test the DataTables format integration.
                </div>
            </div>
        </div>
    );
}