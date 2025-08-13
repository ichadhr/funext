"use client";

import {
  Button,
  Card,
  Title1,
  Body1,
  Input,
  Label,
  Slider,
  Avatar,
  Tag,
  TagGroup,
  ProgressBar,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
  TableHeaderCell,
  TableColumnDefinition,
  createTableColumn,
  useTableFeatures,
  useTableSort
} from "@fluentui/react-components";
import {
  BookmarkRegular,
  PersonRegular,
  PresenceAvailable12Filled
} from "@fluentui/react-icons";
import dynamic from 'next/dynamic';

const FluentDataTable = dynamic(() => import('@/components/datatables').then(mod => mod.FluentDataTable), { ssr: false });

// Define the employee data structure
type Employee = {
  id: number;
  name: string;
  department: string;
  salary: number;
  startDate: string;
  active: boolean;
};

// Sample employee data
const employees: Employee[] = [
  { id: 1, name: "John Doe", department: "Engineering", salary: 85000, startDate: "2020-05-15", active: true },
  { id: 2, name: "Jane Smith", department: "Marketing", salary: 78000, startDate: "2019-11-22", active: true },
  { id: 3, name: "Mike Johnson", department: "Sales", salary: 92000, startDate: "2021-03-10", active: false },
  { id: 4, name: "Sarah Williams", department: "HR", salary: 75000, startDate: "2018-07-30", active: true },
  { id: 5, name: "David Brown", department: "Engineering", salary: 95000, startDate: "2022-01-05", active: true }
];

// Define columns for the Table
const columns: TableColumnDefinition<Employee>[] = [
  createTableColumn<Employee>({
    columnId: "id",
    compare: (a, b) => a.id - b.id,
    renderHeaderCell: () => "ID",
    renderCell: (item) => item.id.toString()
  }),
  createTableColumn<Employee>({
    columnId: "name",
    compare: (a, b) => a.name.localeCompare(b.name),
    renderHeaderCell: () => "Name",
    renderCell: (item) => item.name
  }),
  createTableColumn<Employee>({
    columnId: "department",
    compare: (a, b) => a.department.localeCompare(b.department),
    renderHeaderCell: () => "Department",
    renderCell: (item) => item.department
  }),
  createTableColumn<Employee>({
    columnId: "salary",
    compare: (a, b) => a.salary - b.salary,
    renderHeaderCell: () => "Salary",
    renderCell: (item) => `$${item.salary.toLocaleString()}`
  }),
  createTableColumn<Employee>({
    columnId: "startDate",
    compare: (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    renderHeaderCell: () => "Start Date",
    renderCell: (item) => item.startDate
  }),
  createTableColumn<Employee>({
    columnId: "active",
    compare: (a, b) => Number(a.active) - Number(b.active),
    renderHeaderCell: () => "Active",
    renderCell: (item) => item.active ? "Yes" : "No"
  })
];

export default function Index() {
  const {
    getRows,
    sort: { getSortDirection, toggleColumnSort, sort }
  } = useTableFeatures(
    {
      columns,
      items: employees,
    },
    [
      useTableSort({ defaultSortState: { sortColumn: "id", sortDirection: "ascending" } }),
    ],
  );

  const rows = sort(getRows());

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px", padding: "20px" }}>
      <Card style={{ padding: "20px" }}>
        <Title1>Fluent UI + Next.js 15 & React 19</Title1>
        <Body1>Welcome to your new app!</Body1>
        <Button appearance="primary" icon={<BookmarkRegular />} onClick={() => alert('It works!')}>
          Click me
        </Button>
      </Card>

      {/* Fluent UI Table component */}
      <Card style={{ padding: "20px" }}>
        <h2>Employee Data (Fluent UI Table)</h2>
        <Table aria-label="Employee data table">
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHeaderCell
                  key={column.columnId as string}
                  onClick={(e: React.MouseEvent) => toggleColumnSort(e, column.columnId)}
                  sortDirection={getSortDirection(column.columnId)}
                >
                  {column.renderHeaderCell?.()}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ item }) => (
              <TableRow key={item.id}>
                {columns.map(column => (
                  <TableCell key={column.columnId as string}>
                    {column.renderCell?.(item)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* DataTables component with AJAX */}
      <Card style={{ padding: "20px" }}>
        <h2>Album Data (DataTables with AJAX)</h2>
        <FluentDataTable
          columns={[
            { title: "Album ID" },
            { title: "Album Title" },
            { title: "Artist Name" },
            { title: "Track Count" },
            { title: "Genres" },
            { title: "Min Price" },
            { title: "Max Price" },
            { title: "Avg Price" }
          ]}
          options={{
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <Card style={{ padding: "20px" }}>
          <Label htmlFor="input-field">Name</Label>
          <Input id="input-field" placeholder="Enter your name" />
        </Card>

        <Card style={{ padding: "20px" }}>
          <Label htmlFor="slider">Volume</Label>
          <Slider id="slider" defaultValue={50} />
        </Card>

        <Card style={{ padding: "20px" }}>
          <Avatar
            name="John Doe"
            icon={<PersonRegular />}
            badge={{ status: "available", icon: <PresenceAvailable12Filled /> }}
          />
        </Card>

        <Card style={{ padding: "20px" }}>
          <TagGroup>
            <Tag>Important</Tag>
            <Tag>Urgent</Tag>
            <Tag>Completed</Tag>
          </TagGroup>
        </Card>

        <Card style={{ padding: "20px" }}>
          <Label>Progress</Label>
          <ProgressBar value={75} max={100} />
        </Card>
      </div>
    </div>
  );
}

