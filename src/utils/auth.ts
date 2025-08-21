import { GraphQLClient, gql } from 'graphql-request';

const client = new GraphQLClient('http://localhost:8000/graphql');

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    usersMutation { # Add usersMutation wrapper
      login(input: { username: $username, password: $password }) {
        token
        user {
          id
          username
          email
          role
        }
      }
    }
  }
`;

export async function loginUser(username: string, password: string) {
  try {
interface LoginResponse {
  usersMutation: {
    login: {
      token: string;
      user: {
        id: string;
        username: string;
        email: string;
        role: string;
      };
    };
  };
}

    const data: LoginResponse = await client.request(LOGIN_MUTATION, { username, password });
    const { token, user } = data.usersMutation.login; // Corrected destructuring
    // Store the token (e.g., in localStorage or a state management solution)
    localStorage.setItem('jwt_token', token);
    console.log('Login successful, user:', user);
    return { token, user };
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}