// API utilities for server-side table processing

// REST API exports
export type { RestResponse } from './rest';
export {
  transformRestResponse,
  isRestFormat,
  createRestResponse,
  formatRestRequest,
  makeRestRequest,
  createRestQueryFn
} from './rest';

// DataTables exports
export type { DataTablesResponse } from './datatables';
export {
    transformDataTablesResponse,
    isDataTablesFormat,
    createDataTablesResponse,
    transformToDataTablesArray,
    formatDataTablesRequest,
    makeDataTablesRequest,
    createDataTablesQueryFn
} from './datatables';

// GraphQL exports
export type { GraphQLResponse } from './graphql';
export {
    transformGraphQLResponse,
    isGraphQLFormat,
    createGraphQLResponse,
    extractTableDataFromGraphQL,
    TABLE_DATA_QUERY,
    formatGraphQLRequest,
    makeGraphQLRequest,
    createGraphQLQueryFn
} from './graphql';