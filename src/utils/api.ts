import { GraphQLClient } from 'graphql-request';
import { loginUser } from './auth'; // Import loginUser

const API_ENDPOINT = 'http://localhost:8000/graphql';

interface GraphQLError {
    response?: {
        errors?: Array<{ message: string }>;
        status?: number; // Add status property
    };
}

export async function authenticatedQuery(query: string, variables?: object, retryCount = 0) {
    const MAX_RETRIES = 1; // Allow one retry after re-authentication

    let token = localStorage.getItem('jwt_token');
    if (!token) {
        console.warn('No authentication token found. Attempting to re-authenticate.');
        try {
            // User has indicated they will hardcode credentials here for re-authentication
            const loginResult = await loginUser("admin", "admin"); // Hardcoded as per user's instruction
            token = loginResult.token;
        } catch (loginError) {
            console.error('Failed to re-authenticate:', loginError);
            throw new Error('Authentication required. Please log in.');
        }
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
        console.error('Full error object:', JSON.stringify(error, null, 2)); // Log the entire error object
        if (error instanceof Error) {
            const graphqlError = error as GraphQLError;
            if (graphqlError.response) { // Check if response exists
                const responseErrors = graphqlError.response.errors;
                console.log('GraphQL errors:', responseErrors); // Log all GraphQL errors
                // Check for 401 status code in the response
                if (graphqlError.response.status === 401) { // Removed redundant check for graphqlError.response
                    console.warn('401 Unauthorized error. Attempting to re-authenticate and retry...');
                    if (retryCount < MAX_RETRIES) {
                        localStorage.removeItem('jwt_token'); // Clear invalid token
                        console.log('Attempting re-authentication...');
                        try {
                            const loginResult = await loginUser("admin", "admin");
                            console.log('Re-authentication successful. New token:', loginResult.token);
                            return authenticatedQuery(query, variables, retryCount + 1); // Retry the query
                        } catch (loginError) {
                            console.error('Re-authentication failed:', loginError);
                            localStorage.removeItem('jwt_token');
                            throw new Error('Re-authentication failed. Please log in again.');
                        }
                    } else {
                        console.error('Max retries reached. Authentication failed.');
                        localStorage.removeItem('jwt_token'); // Ensure token is removed
                        throw new Error('Authentication failed. Please log in again.');
                    }
                }
            }
        }
        throw error;
    }
}