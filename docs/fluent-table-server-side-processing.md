# FluentTable Server-Side Processing Documentation

## Overview

This document specifies the **server-side processing extension** for the FluentTable component, implemented as a **separate extension** in the `src/components/fluent-table/ext/` folder. The main `FluentTable` component remains **minimal and unchanged**, ensuring full backward compatibility with existing client-side data processing.

## Architecture Principles

### 🏗️ **Extension-Based Design**
- **Main Component**: `src/components/fluent-table/fluent-table.tsx` (remains minimal)
- **Server Extension**: `src/components/fluent-table/ext/server-side/server-side.tsx`
- **Format Handlers**: `api.ts`, `graphql.ts`, `datatables.ts` (in server-side folder)
- **Server Hook**: `src/components/fluent-table/hooks/use-server-side-table.ts`
- **Clean Separation**: Server-side logic is completely separate from client-side logic

### 🔄 **Full Backward Compatibility**
- **Existing Usage**: All current FluentTable implementations continue to work unchanged
- **Optional Enhancement**: Server-side processing is opt-in via `serverSide` prop
- **Zero Breaking Changes**: No modifications to existing API or behavior

### 📦 **Modular Implementation**
- **Independent Deployment**: Server-side features can be added/removed without affecting core functionality
- **Selective Import**: Only load server-side code when needed
- **Clean Dependencies**: Server-side extension manages its own dependencies (TanStack Query)

## Table of Contents

1. [Implementation Phases](#implementation-phases)
2. [Phase 1: Core Server-Side Processing](#phase-1-core-server-side-processing)
3. [Phase 2: Enhanced Features](#phase-2-enhanced-features)
4. [Phase 3: Production-Ready Features](#phase-3-production-ready-features)
5. [Migration Guide](#migration-guide)

## Server-Side Processing Flow

```mermaid
graph TD
    A[User Interaction] --> B{Table State Change}
    B --> C[FluentTable Component]
    C --> D{serverSide prop present?}

    D -->|No| E[Client-Side Processing]
    E --> F[useReactTable]
    F --> G[getCoreRowModel]
    G --> H[Local Data Processing]
    H --> I[Render Table]

    D -->|Yes| J[Server-Side Extension]
    J --> K[ext/server-side/server-side.tsx]
    K --> L[useServerSideTable Hook]
    L --> M[ext/server-side/api.ts]
    L --> N[ext/server-side/graphql.ts]
    L --> O[ext/server-side/datatables.ts]
    L --> M[TanStack Query useQuery]
    L --> M{Query State}

    M -->|Loading| N[onInitializing(true)]
    M -->|Fetching| O[onProcessing(true)]
    M -->|Success| P[Data Transformation]
    M -->|Error| Q[onError/ServerError]

    P --> R{Response Format}
    R -->|REST API| S[Direct Object Mapping]
    R -->|GraphQL| T[Extract from data.items]
    R -->|DataTables| U[Array to Object Transform]

    S --> V[Update Table Data]
    T --> V
    U --> V

    V --> W[Render Table with Data]
    W --> X[onDraw Event]
    X --> Y[onProcessing(false)]

    N --> Z[Loading UI]
    O --> Z
    Q --> AA[Error UI]

    style A fill:#e1f5fe
    style C fill:#f3e5f5
    style J fill:#e8f5e8
    style L fill:#fff3e0
    style W fill:#e8f5e8
    style Q fill:#ffebee
```

### Flow Explanation

1. **User Interaction** → Sorting, pagination, search, or filtering
2. **State Change** → Table parameters update (pageIndex, sorting, globalFilter)
3. **Component Detection** → FluentTable checks for `serverSide` prop
4. **Processing Mode** → Routes to client-side or server-side processing
5. **Query Execution** → TanStack Query manages server requests
6. **Loading States** → Triggers appropriate events (`onInitializing`, `onProcessing`)
7. **Data Fetching** → Server request with current table parameters
8. **Response Processing** → Transform response based on format (REST/GraphQL/DataTables)
9. **UI Update** → Render table with new data
10. **Event Completion** → Trigger `onDraw` and complete processing events

### Key Integration Points

- **Event System**: Maintains full compatibility with existing FluentTable events
- **Loading States**: TanStack Query states map to FluentTable events
- **Error Handling**: Server errors integrate with existing error system
- **Data Transformation**: Automatic format detection and conversion
- **State Management**: Seamless integration with TanStack Table state

## Implementation Phases

### Phase 1: Core Server-Side Processing (MVP) 🚀
**Goal:** Get basic server-side processing working with essential features

**Features to Implement:**
- ✅ TanStack Query integration
- ✅ Basic server-side pagination, sorting, and global search
- ✅ REST API and GraphQL support
- ✅ DataTables.net array format support
- ✅ Event compatibility (`onDraw`, `onSearch`, `onOrder`, etc.)
- ✅ Basic error handling
- ✅ Loading states
- ✅ Migration from client-side processing

**Estimated Effort:** 2-3 days
**Business Value:** 80% - Covers most common use cases

**Deliverables:**
- Working server-side table with pagination, sorting, and search
- Compatible with existing FluentTable events
- Support for REST API and GraphQL backends
- Basic error handling and loading states

---

### Phase 2: Enhanced Features 📈
**Goal:** Add advanced functionality for better user experience

**Features to Implement:**
- 🔄 Column-specific filtering
- 🔐 Authentication & custom headers
- 📡 Real-time updates (polling)
- 💾 Server state persistence (URL state)
- 📤 Export functionality (CSV, Excel)
- 🎯 Bulk operations
- ⚡ Request cancellation
- 🔄 Advanced error handling with retry logic

**Estimated Effort:** 3-4 days
**Business Value:** 15% - Enhanced user experience

**Deliverables:**
- Individual column filters
- URL-based state management
- Data export capabilities
- Bulk row operations
- Automatic request cancellation
- Robust error handling with retries

---

### Phase 3: Production-Ready Features 🏭
**Goal:** Enterprise-grade features for production deployment

**Features to Implement:**
- 🔌 WebSocket real-time updates
- 📱 Mobile optimization
- 🌐 Internationalization (i18n)
- 📊 Analytics and monitoring
- 🔍 Advanced search (fuzzy search, regex)
- 🎨 Customizable themes
- ♿ Enhanced accessibility
- 🧪 Comprehensive testing suite

**Estimated Effort:** 4-5 days
**Business Value:** 5% - Production readiness

**Deliverables:**
- Real-time WebSocket integration
- Mobile-optimized interface
- Multi-language support
- Usage analytics
- Advanced search capabilities
- Accessibility compliance
- Full test coverage

---

### Phase 4: Future Enhancements 🔮
**Goal:** Cutting-edge features for advanced use cases

**Features to Consider:**
- 🤖 AI-powered search and suggestions
- 📊 Advanced data visualization
- 🔗 Data relationships and linking
- 🎮 Virtual scrolling for millions of rows
- 💾 Offline support with service workers
- 🔄 Data synchronization
- 📱 Progressive Web App (PWA) features

**Estimated Effort:** Variable
**Business Value:** Future-proofing

---

## Phase 3: Production-Ready Features 🏭

**Goal:** Enterprise-grade features for production deployment

**Features to Implement:**
- 🔌 WebSocket real-time updates
- 📱 Mobile optimization
- 🌐 Internationalization (i18n)
- 📊 Analytics and monitoring
- 🔍 Advanced search (fuzzy search, regex)
- 🎨 Customizable themes
- ♿ Enhanced accessibility
- 🧪 Comprehensive testing suite

**Estimated Effort:** 4-5 days
**Business Value:** 5% - Production readiness

**Deliverables:**
- Real-time WebSocket integration
- Mobile-optimized interface
- Multi-language support
- Usage analytics
- Advanced search capabilities
- Accessibility compliance
- Full test coverage

---

## Phase 1: Core Server-Side Processing

### Server Response Formats

### Standard Object Format (REST API / GraphQL)

```typescript
interface ServerResponse {
  data: TData[];              // Array of data objects
  recordsFiltered: number;    // Total records after filtering (for pagination)
  recordsTotal?: number;      // Optional: Total records without filtering
}
```

**Example Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Tiger Nixon",
      "position": "System Architect",
      "office": "Edinburgh",
      "extn": "5421",
      "startDate": "2011/04/25",
      "salary": "$3,120"
    }
  ],
  "recordsFiltered": 57,
  "recordsTotal": 150
}
```

### DataTables.net Array Format

```typescript
interface DataTablesResponse {
  recordsTotal: number;      // Total records without filtering
  recordsFiltered: number;   // Total records after filtering
  data: any[][];             // Array of arrays (rows as arrays)
  draw?: number;             // Request sequence number (echoed back)
}
```

**Example Response:**
```json
{
  "recordsTotal": 150,
  "recordsFiltered": 57,
  "data": [
    [
      "Tiger Nixon",
      "System Architect",
      "Edinburgh",
      "5421",
      "2011/04/25",
      "$3,120"
    ],
    [
      "Garrett Winters",
      "Accountant",
      "Tokyo",
      "8422",
      "2011/07/25",
      "$170,750"
    ]
  ],
  "draw": 1
}
```

### GraphQL Response Format

```typescript
interface GraphQLResponse {
  data: {
    tableData: {
      items: TData[];
      recordsFiltered: number;
      recordsTotal?: number;
    }
  };
}
```

**Example Response:**
```json
{
  "data": {
    "tableData": {
      "items": [
        {
          "id": 1,
          "name": "Tiger Nixon",
          "position": "System Architect"
        }
      ],
      "recordsFiltered": 57,
      "recordsTotal": 150
    }
  }
}
```

### Client Request Formats

### Standard Request Parameters

```typescript
interface ServerSideParams {
  pageIndex: number;        // Current page (0-based)
  pageSize: number;         // Items per page
  sorting: Array<{
    id: string;            // Column ID (accessorKey)
    desc: boolean;         // Sort direction
  }>;
  globalFilter: string;     // Search/filter text
}
```

### REST API Request (POST)

**Endpoint:** `POST /api/table-data`

**Request Body:**
```json
{
  "pageIndex": 0,
  "pageSize": 10,
  "sorting": [
    {
      "id": "author.label",
      "desc": false
    }
  ],
  "globalFilter": "john"
}
```

### GraphQL Request

**Query:**
```graphql
query GetTableData(
  $pageIndex: Int!
  $pageSize: Int!
  $sorting: [SortInput!]!
  $globalFilter: String
) {
  tableData(
    pageIndex: $pageIndex
    pageSize: $pageSize
    sorting: $sorting
    globalFilter: $globalFilter
  ) {
    items {
      id
      name
      position
      office
      startDate
      salary
    }
    recordsFiltered
    recordsTotal
  }
}
```

**Variables:**
```json
{
  "pageIndex": 0,
  "pageSize": 10,
  "sorting": [
    {
      "id": "author.label",
      "desc": false
    }
  ],
  "globalFilter": "john"
}
```

### DataTables.net Request

**Endpoint:** `POST /api/datatables`

**Request Body:**
```json
{
  "draw": 1,
  "start": 0,
  "length": 10,
  "search": {
    "value": "john",
    "regex": false
  },
  "order": [
    {
      "column": 1,
      "dir": "asc"
    }
  ],
  "columns": [
    {
      "data": "name",
      "name": "name",
      "searchable": true,
      "orderable": true
    },
    {
      "data": "author.label",
      "name": "author.label",
      "searchable": true,
      "orderable": true
    }
  ]
}
```

### Event Compatibility

The server-side implementation maintains full compatibility with existing FluentTable events:

### Current Events (Preserved)

```typescript
interface FluentTableEventHandlers {
  onInitializing?: (initializing: boolean) => void;
  onPreInit?: () => void;
  onInit?: () => void;
  onPreDraw?: () => void;
  onDraw?: () => void;           // Called after data is fetched and processed
  onSearch?: (filterValue: string) => void;
  onOrder?: (sorting: SortingState) => void;
  onPageChange?: (pageIndex: number, pageSize: number) => void;
  onPageLengthChange?: (pageSize: number) => void;
  onProcessing?: (processing: boolean) => void;
  onError?: (error: Error) => void;
  // Server-side specific events
  onServerRequest?: (params: ServerSideParams) => void;
  onServerResponse?: (response: ServerResponse) => void;
  onServerError?: (error: ServerError) => void;
}
```

### Event Trigger Sequence

1. **User Interaction** → Table state changes
2. **`onPreDraw`** → Before server request
3. **`onServerRequest`** → Server request parameters (server-side only)
4. **`onProcessing(true)`** → Request starts
5. **Server Request** → Data fetching
6. **`onServerResponse`** → Server response received (server-side only)
7. **`onDraw`** → After successful response and data processing
8. **`onProcessing(false)`** → Request completes
9. **Table Updates** → UI refreshes

### Server-Side Error Types

```typescript
interface ServerError extends Error {
  type: 'network' | 'server' | 'validation' | 'auth' | 'timeout';
  statusCode?: number;    // HTTP status code (e.g., 401, 500, 422)
  retryable: boolean;     // Whether this error can be retried
  details?: any;          // Additional error details from server
}
```

## Phase 2: Enhanced Features

### Column-Specific Filtering

In addition to global search, TanStack Table supports individual column filters:

```typescript
interface ServerSideParams {
  pageIndex: number;
  pageSize: number;
  sorting: Array<{ id: string; desc: boolean }>;
  globalFilter: string;
  columnFilters?: Record<string, any>; // Column-specific filters
}
```

**Example with column filters:**
```json
{
  "pageIndex": 0,
  "pageSize": 10,
  "sorting": [{"id": "name", "desc": false}],
  "globalFilter": "",
  "columnFilters": {
    "status": "active",
    "department": "engineering"
  }
}
```

### Authentication & Request Headers

Include authentication tokens and custom headers in server requests:

```typescript
<FluentTable
  data={data}
  columns={columns}
  serverSide={{
    queryKey: (params) => ['table-data', params],
    queryFn: async (params) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/table-data', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-API-Key': 'your-api-key'
        },
        body: JSON.stringify(params)
      });
      return response.json();
    }
  }}
/>
```

### Request Cancellation

TanStack Query automatically cancels previous requests when new ones are made with the same `queryKey`:

```typescript
// Automatic cancellation - no additional code needed
serverSide: {
  queryKey: (params) => ['table-data', params.pageIndex, params.pageSize, params.sorting, params.globalFilter],
  queryFn: async (params) => { /* ... */ }
}
```

### Server State Persistence

Integrate with URL state management for bookmarkable table states:

```typescript
// Using 'nuqs' library for URL state management
import { useQueryState } from 'nuqs';

function ServerSideTable() {
  const [pageIndex, setPageIndex] = useQueryState('page', { defaultValue: 0 });
  const [pageSize, setPageSize] = useQueryState('size', { defaultValue: 10 });
  const [sorting, setSorting] = useQueryState('sort', { defaultValue: [] });
  const [globalFilter, setGlobalFilter] = useQueryState('search', { defaultValue: '' });

  return (
    <FluentTable
      data={data}
      columns={columns}
      serverSide={{
        queryKey: (params) => ['table-data', params],
        queryFn: async (params) => { /* ... */ }
      }}
      // Table will automatically sync with URL state
    />
  );
}
```

### Advanced Error Handling

Server-side processing provides enhanced error handling with granular error types and automatic retry logic:

```typescript
<FluentTable
  data={data}
  columns={columns}
  serverSide={{
    queryKey: (params) => ['table-data', params],
    queryFn: async (params) => { /* ... */ },
    retry: (failureCount, error: ServerError) => {
      // Custom retry logic based on error type
      if (error?.type === 'auth') return false; // Don't retry auth errors
      if (error?.type === 'validation') return false; // Don't retry validation errors
      return failureCount < 3; // Retry up to 3 times for other errors
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  }}
  event={{
    onServerError: (error: ServerError) => {
      // Handle server-specific errors with detailed information
      console.error('Server error:', error.type, error.message, error.statusCode);

      // Log to analytics or monitoring service
      analytics.track('server_error', {
        type: error.type,
        statusCode: error.statusCode,
        retryable: error.retryable
      });
    },
    onError: (error: Error | ServerError) => {
      // Handle all errors (both client and server)
      if ('type' in error) {
        // Server-side error with type information
        switch (error.type) {
          case 'auth':
            // Redirect to login or refresh token
            window.location.href = '/login';
            break;
          case 'network':
            // Show offline message with retry option
            showToast('Network error. Please check your connection.', {
              action: { label: 'Retry', onClick: () => window.location.reload() }
            });
            break;
          case 'validation':
            // Show validation error with details
            showToast(`Validation error: ${error.message}`);
            break;
          case 'timeout':
            // Show timeout message
            showToast('Request timed out. Please try again.');
            break;
          default:
            // Generic server error
            showToast(`Server error: ${error.message}`);
        }
      } else {
        // Client-side error
        showToast(`Client error: ${error.message}`);
      }
    }
  }}
/>
```

**Error Types and Handling:**

- **`auth`**: Authentication errors (don't retry, redirect to login)
- **`network`**: Network connectivity issues (retry with backoff)
- **`validation`**: Input validation errors (don't retry, show message)
- **`timeout`**: Request timeout errors (retry with backoff)
- **`server`**: Generic server errors (retry with backoff)

**Automatic Retry Behavior:**
- Network and timeout errors: Retry up to 3 times with exponential backoff
- Auth and validation errors: Don't retry (handled by application logic)
- Custom retry delays: 1s, 2s, 4s, 8s, 16s, 30s max

### Loading States Integration

TanStack Query loading states are automatically integrated with the existing `onProcessing` event:

```typescript
<FluentTable
  data={data}
  columns={columns}
  serverSide={{
    queryKey: (params) => ['table-data', params],
    queryFn: async (params) => {
      // This will automatically trigger onProcessing events
      const response = await fetch('/api/table-data', {
        method: 'POST',
        body: JSON.stringify(params)
      });
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000 // 10 minutes
  }}
  event={{
    onProcessing: (processing: boolean) => {
      // Automatically called by TanStack Query loading states
      if (processing) {
        showLoadingSpinner();
      } else {
        hideLoadingSpinner();
      }
    }
  }}
/>
```

**Loading State Mapping:**
- `isLoading` (first/initial load) → `onInitializing(true/false)`
- `isFetching` (any request) → `onProcessing(true)`
- `isRefetching` (background updates) → `onProcessing(true)`
- Request complete → `onProcessing(false)`

**Refetching Behavior:**
- `isRefetching` maintains **current table state** (sorting, pagination, search)
- Uses the **same query parameters** as the last successful request
- Automatically preserves user's current view and filters
- Triggered by: window focus, network reconnect, manual refresh

**Benefits:**
- ✅ **Consistent API**: Uses existing `onProcessing` event
- ✅ **Automatic Integration**: No manual state management needed
- ✅ **Backward Compatible**: Works with existing FluentTable implementations
- ✅ **Granular Control**: Different loading states trigger the same event

### Real-Time Updates

Enable automatic data refresh or integrate with WebSockets:

```typescript
<FluentTable
  data={data}
  columns={columns}
  serverSide={{
    queryKey: (params) => ['table-data', params],
    queryFn: async (params) => { /* ... */ },
    refetchInterval: 30000, // Poll every 30 seconds
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnReconnect: true // Refetch when network reconnects
  }}
/>
```

**WebSocket Integration:**
```typescript
// Listen for real-time updates
useEffect(() => {
  const ws = new WebSocket('ws://localhost:8080');
  ws.onmessage = (event) => {
    const update = JSON.parse(event.data);
    if (update.type === 'table-update') {
      // Invalidate and refetch data
      queryClient.invalidateQueries(['table-data']);
    }
  };
  return () => ws.close();
}, []);
```

### Export Functionality

Server-side data export with current filters and sorting:

```typescript
function exportData(format: 'csv' | 'excel' | 'pdf') {
  const params = {
    pageIndex: 0,
    pageSize: -1, // Export all filtered records
    sorting: currentSorting,
    globalFilter: currentFilter,
    exportFormat: format
  };

  window.open(`/api/export?${new URLSearchParams(params)}`);
}
```

### Request Timeout Configuration

Configure request timeouts and network behavior for server-side operations:

```typescript
interface ServerSideOptions<TData> {
  serverSide: {
    queryKey: (params: ServerSideParams) => QueryKey;
    queryFn: (params: ServerSideParams) => Promise<ServerResponse>;
    dataFormat?: 'rest' | 'datatables' | 'graphql';
    // Timeout and network options
    timeout?: number;              // Request timeout in milliseconds (default: browser default)
    networkMode?: 'online' | 'always' | 'offlineFirst'; // Network behavior
    // Other TanStack Query options
    staleTime?: number;
    cacheTime?: number;
    refetchOnWindowFocus?: boolean;
  };
}
```

**Timeout Configuration Examples:**

```typescript
<FluentTable
  data={data}
  columns={columns}
  serverSide={{
    queryKey: (params) => ['table-data', params],
    queryFn: async (params) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      try {
        const response = await fetch('/api/table-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response.json();
      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new ServerError('timeout', 'Request timed out after 10 seconds', 408, false);
        }
        throw error;
      }
    },
    timeout: 10000, // 10 seconds
    networkMode: 'online' // Only fetch when online
  }}
/>
```

**Timeout Options:**
- **`timeout`**: Maximum time to wait for a response (in milliseconds)
- **`networkMode`**:
  - `'online'`: Only fetch when navigator.onLine is true
  - `'always'`: Always attempt to fetch (default)
  - `'offlineFirst'`: Try cache first, then network

### Bulk Operations

Handle bulk actions on selected rows:

```typescript
const { selectedRowModel } = table.getState();

async function bulkAction(action: string, selectedIds: string[]) {
  await fetch('/api/bulk-action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ids: selectedIds })
  });

  // Invalidate and refetch data
  queryClient.invalidateQueries(['table-data']);
}
```

### Phase 1 Implementation Examples

### REST API Server Implementation

```typescript
// Express.js route
app.post('/api/table-data', async (req, res) => {
  const { pageIndex, pageSize, sorting, globalFilter } = req.body;

  try {
    // Build sort object
    const sortObj = {};
    sorting.forEach(sort => {
      sortObj[sort.id.replace('.', '.')] = sort.desc ? -1 : 1;
    });

    // Build filter
    const filter = globalFilter ? {
      $or: [
        { name: new RegExp(globalFilter, 'i') },
        { 'author.label': new RegExp(globalFilter, 'i') }
      ]
    } : {};

    // Execute query
    const items = await YourModel
      .find(filter)
      .sort(sortObj)
      .skip(pageIndex * pageSize)
      .limit(pageSize);

    const recordsFiltered = await YourModel.countDocuments(filter);
    const recordsTotal = await YourModel.countDocuments();

    res.json({
      data: items,
      recordsFiltered,
      recordsTotal
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### GraphQL Server Implementation

```typescript
// GraphQL Resolver
const resolvers = {
  Query: {
    tableData: async (
      _: any,
      { pageIndex, pageSize, sorting, globalFilter }: ServerSideParams
    ) => {
      const sortObj = {};
      sorting.forEach(sort => {
        sortObj[sort.id.replace('.', '__')] = sort.desc ? -1 : 1;
      });

      const filter = globalFilter ? {
        $or: [
          { name: new RegExp(globalFilter, 'i') },
          { 'author__label': new RegExp(globalFilter, 'i') }
        ]
      } : {};

      const items = await YourModel
        .find(filter)
        .sort(sortObj)
        .skip(pageIndex * pageSize)
        .limit(pageSize);

      const recordsFiltered = await YourModel.countDocuments(filter);
      const recordsTotal = await YourModel.countDocuments();

      return {
        items,
        recordsFiltered,
        recordsTotal
      };
    }
  }
};
```

### DataTables.net Server Implementation

```typescript
app.post('/api/datatables', async (req, res) => {
  const { start, length, search, order, columns } = req.body;

  // Convert DataTables format to standard format
  const pageIndex = Math.floor(start / length);
  const pageSize = length;

  const sorting = order.map(o => ({
    id: columns[o.column].data,
    desc: o.dir === 'desc'
  }));

  const globalFilter = search.value;

  // Same query logic as REST API...
  const items = await YourModel.find(filter).sort(sortObj).skip(start).limit(length);
  const recordsFiltered = await YourModel.countDocuments(filter);
  const recordsTotal = await YourModel.countDocuments();

  // Return in DataTables format
  res.json({
    draw: req.body.draw,
    recordsTotal,
    recordsFiltered,
    data: items.map(item => [
      item.name,
      item.author.label,
      item.lastUpdated.label,
      item.lastUpdate.label
    ])
  });
});
```

### Phase 1 Migration Guide

### From Client-Side to Server-Side

1. **Add TanStack Query dependency:**
   ```bash
   npm install @tanstack/react-query
   ```

2. **Wrap your app with QueryClientProvider:**
   ```tsx
   import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

   const queryClient = new QueryClient();

   function App() {
     return (
       <QueryClientProvider client={queryClient}>
         {/* Your app */}
       </QueryClientProvider>
     );
   }
   ```

3. **Update FluentTable usage:**
   ```tsx
   // Before (Client-side)
   <FluentTable
     data={data}
     columns={columns}
   />

   // After (Server-side)
   <FluentTable
     data={data}
     columns={columns}
     serverSide={{
       queryKey: (params) => ['table-data', params],
       queryFn: async (params) => {
         const response = await fetch('/api/table-data', {
           method: 'POST',
           body: JSON.stringify(params)
         });
         return response.json();
       }
     }}
   />
   ```

4. **Update server endpoint** to handle the new parameter format

5. **Test all interactions** (sorting, pagination, searching)

### Backward Compatibility

- All existing props and events remain functional
- Client-side processing still works when `serverSide` prop is not provided
- Existing event handlers continue to work unchanged
- No breaking changes to the public API

## Performance Considerations

### Network Optimization

1. **Array Format**: Use DataTables.net format for 30-50% smaller payloads
2. **Pagination**: Always implement server-side pagination for large datasets
3. **Caching**: TanStack Query provides automatic caching and deduplication
4. **Debouncing**: Search requests are automatically debounced

### Server Optimization

1. **Database Indexing**: Ensure proper indexes on sortable/searchable columns
2. **Query Optimization**: Use efficient database queries with proper limits
3. **Response Compression**: Enable gzip compression for JSON responses
4. **Caching**: Implement server-side caching for frequently accessed data

## Error Handling

### Client-Side Errors

```typescript
<FluentTable
  data={data}
  columns={columns}
  serverSide={{
    queryKey: (params) => ['table-data', params],
    queryFn: async (params) => {
      try {
        const response = await fetch('/api/table-data', {
          method: 'POST',
          body: JSON.stringify(params)
        });
        return response.json();
      } catch (error) {
        throw new Error('Failed to fetch table data');
      }
    }
  }}
  event={{
    onError: (error) => {
      console.error('Table error:', error);
      // Handle error (show toast, etc.)
    }
  }}
/>
```

### Server-Side Errors

```json
{
  "error": "Database connection failed",
  "code": "DB_ERROR",
  "details": "Connection timeout after 30 seconds"
}
```

## Testing

### Unit Tests

```typescript
describe('Server-Side Processing', () => {
  it('should handle sorting parameters correctly', () => {
    const params = {
      pageIndex: 0,
      pageSize: 10,
      sorting: [{ id: 'name', desc: false }],
      globalFilter: ''
    };

    // Test parameter transformation
    expect(transformParams(params)).toEqual(expectedServerParams);
  });

  it('should transform array responses to objects', () => {
    const arrayResponse = {
      recordsTotal: 150,
      recordsFiltered: 57,
      data: [['John', 'Doe'], ['Jane', 'Smith']]
    };

    const objectResponse = transformArrayResponse(arrayResponse, columns);
    expect(objectResponse.data[0]).toEqual({ name: 'John', surname: 'Doe' });
  });
});
```

### Integration Tests

```typescript
describe('FluentTable Server Integration', () => {
  it('should fetch and display server-side data', async () => {
    render(
      <FluentTable
        data={[]}
        columns={columns}
        serverSide={{
          queryKey: () => ['test-data'],
          queryFn: () => Promise.resolve(mockResponse)
        }}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});
```

This documentation provides a complete specification for implementing server-side processing with the FluentTable component while maintaining full compatibility with existing functionality.