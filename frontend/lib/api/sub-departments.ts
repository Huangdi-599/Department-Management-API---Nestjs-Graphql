import { graphqlRequest } from '../api-client';

const GET_SUB_DEPARTMENTS_QUERY = `
  query GetSubDepartments {
    getSubDepartments {
      id
      name
      departmentId
      department {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

const GET_SUB_DEPARTMENT_QUERY = `
  query GetSubDepartment($id: ID!) {
    getSubDepartment(id: $id) {
      id
      name
      departmentId
      department {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

const CREATE_SUB_DEPARTMENT_MUTATION = `
  mutation CreateSubDepartment($input: CreateSubDepartmentInput!) {
    createSubDepartment(input: $input) {
      id
      name
      departmentId
      department {
        id
        name
      }
    }
  }
`;

const UPDATE_SUB_DEPARTMENT_MUTATION = `
  mutation UpdateSubDepartment($input: UpdateSubDepartmentInput!) {
    updateSubDepartment(input: $input) {
      id
      name
      departmentId
      department {
        id
        name
      }
    }
  }
`;

const DELETE_SUB_DEPARTMENT_MUTATION = `
  mutation DeleteSubDepartment($id: ID!) {
    deleteSubDepartment(id: $id)
  }
`;

export const subDepartmentsApi = {
  getSubDepartments: async () => {
    const result = await graphqlRequest(GET_SUB_DEPARTMENTS_QUERY);
    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'Failed to fetch sub-departments');
    }
    return result.data.getSubDepartments;
  },

  getSubDepartment: async (id: number) => {
    const result = await graphqlRequest(GET_SUB_DEPARTMENT_QUERY, { id });
    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'Failed to fetch sub-department');
    }
    return result.data.getSubDepartment;
  },

  createSubDepartment: async (input: { name: string; departmentId: number }) => {
    const result = await graphqlRequest(CREATE_SUB_DEPARTMENT_MUTATION, { input });
    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'Failed to create sub-department');
    }
    return result.data.createSubDepartment;
  },

  updateSubDepartment: async (input: { id: number; name: string }) => {
    const result = await graphqlRequest(UPDATE_SUB_DEPARTMENT_MUTATION, { input });
    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'Failed to update sub-department');
    }
    return result.data.updateSubDepartment;
  },

  deleteSubDepartment: async (id: number) => {
    const result = await graphqlRequest(DELETE_SUB_DEPARTMENT_MUTATION, { id });
    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'Failed to delete sub-department');
    }
    return result.data.deleteSubDepartment;
  },
};

