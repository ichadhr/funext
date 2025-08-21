import { GraphQLClient } from 'graphql-request';

const API_ENDPOINT = 'http://localhost:8000/graphql';

export async function authenticatedQuery(query: string, variables?: object) {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
        // For demonstration purposes, we'll proceed without a token if not found.
        // In a real application, you would typically redirect to a login page.
        console.warn('No authentication token found. Proceeding with unauthenticated request.');
    }

    const headers: HeadersInit = {};
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    const client = new GraphQLClient(API_ENDPOINT, { headers });

    try {
        const data = await client.request(query, variables);
        return data;
    } catch (error) {
        console.error('Authenticated query failed:', error);
        throw error;
    }
}

// Example usage (from docs/nextjs_login.md)
/*
import { gql } from 'graphql-request';

const GET_USERS_QUERY = gql`
  query GetUsers {
    users {
      id
      username
      email
      role
    }
  }
`;

async function fetchUsers() {
  try {
    const data = await authenticatedQuery(GET_USERS_QUERY);
    console.log('Fetched users:', data.users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
}
*/