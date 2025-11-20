import { graphqlRequest } from '../api-client';

const REGISTER_MUTATION = `
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      username
    }
  }
`;

const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      username
    }
  }
`;

export const authApi = {
  register: async (username: string, password: string) => {
    const result = await graphqlRequest(REGISTER_MUTATION, {
      input: { username, password },
    });
    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'Registration failed');
    }
    return result.data.register;
  },

  login: async (username: string, password: string) => {
    const result = await graphqlRequest(LOGIN_MUTATION, {
      input: { username, password },
    });
    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'Login failed');
    }
    return result.data.login;
  },
};

