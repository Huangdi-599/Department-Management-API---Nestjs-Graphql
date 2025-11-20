import { graphqlRequest } from '../api-client';

const GET_DEPARTMENTS_QUERY = `
  query GetDepartments {
    getDepartments {
      id
      name
      subDepartments {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

const CREATE_DEPARTMENT_MUTATION = `
  mutation CreateDepartment($input: CreateDepartmentInput!) {
    createDepartment(input: $input) {
      id
      name
      subDepartments {
        id
        name
      }
    }
  }
`;

const UPDATE_DEPARTMENT_MUTATION = `
  mutation UpdateDepartment($input: UpdateDepartmentInput!) {
    updateDepartment(input: $input) {
      id
      name
      subDepartments {
        id
        name
      }
    }
  }
`;

const DELETE_DEPARTMENT_MUTATION = `
  mutation DeleteDepartment($id: ID!) {
    deleteDepartment(id: $id)
  }
`;

export const departmentsApi = {
  getDepartments: async () => {
    const result = await graphqlRequest(GET_DEPARTMENTS_QUERY);
    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'Failed to fetch departments');
    }
    return result.data.getDepartments;
  },

  createDepartment: async (input: { name: string; subDepartments?: { name: string }[] | null }) => {
    const result = await graphqlRequest(CREATE_DEPARTMENT_MUTATION, { input });
    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'Failed to create department');
    }
    return result.data.createDepartment;
  },

  updateDepartment: async (input: { 
    id: number; 
    name: string; 
    subDepartments?: { id?: number; name: string }[] 
  }) => {
    const result = await graphqlRequest(UPDATE_DEPARTMENT_MUTATION, { input });
    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'Failed to update department');
    }
    return result.data.updateDepartment;
  },

  deleteDepartment: async (id: number) => {
    const result = await graphqlRequest(DELETE_DEPARTMENT_MUTATION, { id });
    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'Failed to delete department');
    }
    return result.data.deleteDepartment;
  },
};

