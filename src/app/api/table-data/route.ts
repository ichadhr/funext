import { NextRequest, NextResponse } from 'next/server';
import { ServerSideParams } from '@components/fluent-table/types';

// Mock data for demonstration
const mockData = [
    { id: 1, name: 'John Doe', position: 'Developer', office: 'New York', startDate: '2020-01-15', salary: 75000 },
    { id: 2, name: 'Jane Smith', position: 'Designer', office: 'San Francisco', startDate: '2019-03-22', salary: 65000 },
    { id: 3, name: 'Bob Johnson', position: 'Manager', office: 'London', startDate: '2018-07-10', salary: 85000 },
    { id: 4, name: 'Alice Brown', position: 'Developer', office: 'Berlin', startDate: '2021-02-08', salary: 70000 },
    { id: 5, name: 'Charlie Wilson', position: 'Designer', office: 'Tokyo', startDate: '2020-11-30', salary: 60000 },
    { id: 6, name: 'Diana Davis', position: 'Manager', office: 'Sydney', startDate: '2017-09-14', salary: 90000 },
    { id: 7, name: 'Edward Miller', position: 'Developer', office: 'Paris', startDate: '2021-05-20', salary: 72000 },
    { id: 8, name: 'Fiona Garcia', position: 'Designer', office: 'Madrid', startDate: '2019-12-05', salary: 68000 },
    { id: 9, name: 'George Taylor', position: 'Manager', office: 'Toronto', startDate: '2016-04-18', salary: 95000 },
    { id: 10, name: 'Helen Anderson', position: 'Developer', office: 'Amsterdam', startDate: '2022-01-12', salary: 78000 },
    { id: 11, name: 'Ian Thomas', position: 'Designer', office: 'Singapore', startDate: '2020-08-25', salary: 62000 },
    { id: 12, name: 'Julia Martinez', position: 'Manager', office: 'Mexico City', startDate: '2018-11-07', salary: 88000 },
    { id: 13, name: 'Kevin Lee', position: 'Developer', office: 'Seoul', startDate: '2021-09-03', salary: 76000 },
    { id: 14, name: 'Laura White', position: 'Designer', office: 'Stockholm', startDate: '2019-06-15', salary: 64000 },
    { id: 15, name: 'Michael Harris', position: 'Manager', office: 'Zurich', startDate: '2017-12-01', salary: 92000 },
];

export async function POST(request: NextRequest) {
    try {
        const params: ServerSideParams = await request.json();

        console.log('📡 REST API Request received:', params);

        let filteredData = [...mockData];

        // Apply global filter
        if (params.globalFilter) {
            const filter = params.globalFilter.toLowerCase();
            filteredData = filteredData.filter(item =>
                item.name.toLowerCase().includes(filter) ||
                item.position.toLowerCase().includes(filter) ||
                item.office.toLowerCase().includes(filter)
            );
        }

        // Apply sorting
        if (params.sorting && params.sorting.length > 0) {
            const { id, desc } = params.sorting[0];
            filteredData.sort((a, b) => {
                const aValue = (a as Record<string, unknown>)[id];
                const bValue = (b as Record<string, unknown>)[id];

                // Handle string comparison safely
                const aStr = String(aValue || '');
                const bStr = String(bValue || '');

                if (aStr < bStr) return desc ? 1 : -1;
                if (aStr > bStr) return desc ? -1 : 1;
                return 0;
            });
        }

        // Apply pagination
        const startIndex = params.pageIndex * params.pageSize;
        const endIndex = startIndex + params.pageSize;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        const response = {
            data: paginatedData,
            recordsFiltered: filteredData.length,
            recordsTotal: mockData.length,
        };

        console.log('📤 REST API Response:', response);

        return NextResponse.json(response);
    } catch (error) {
        console.error('❌ REST API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}