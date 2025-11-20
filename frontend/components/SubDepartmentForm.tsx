'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subDepartmentsApi } from '@/lib/api/sub-departments';
import { departmentsApi } from '@/lib/api/departments';
import { useQuery } from '@tanstack/react-query';

const subDepartmentSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Sub-department name must be at least 2 characters')
    .required('Sub-department name is required'),
  departmentId: Yup.number()
    .required('Department is required')
    .positive('Please select a department'),
});

interface Department {
  id: number;
  name: string;
}

interface SubDepartment {
  id: number;
  name: string;
  departmentId: number;
  department?: Department;
}

interface SubDepartmentFormProps {
  subDepartment?: SubDepartment | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function SubDepartmentForm({ subDepartment, onSuccess, onCancel }: SubDepartmentFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!subDepartment;

  const { data: departments } = useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: departmentsApi.getDepartments,
  });

  const createMutation = useMutation({
    mutationFn: subDepartmentsApi.createSubDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sub-departments'] });
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      onSuccess();
    },
  });

  const updateMutation = useMutation({
    mutationFn: subDepartmentsApi.updateSubDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sub-departments'] });
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      onSuccess();
    },
  });

  const initialValues = {
    name: subDepartment?.name || '',
    departmentId: subDepartment?.departmentId || 0,
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: subDepartment.id,
          name: values.name,
        });
      } else {
        await createMutation.mutateAsync({
          name: values.name,
          departmentId: values.departmentId,
        });
      }
    } catch (err) {
      console.error('Form submission error:', err);
      alert('Failed to save sub-department. Please try again.');
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={subDepartmentSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      <Form className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Edit Sub-Department' : 'Create New Sub-Department'}
          </h3>
        </div>

        {!isEditing && (
          <div>
            <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700">
              Department *
            </label>
            <Field
              as="select"
              name="departmentId"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            >
              <option value={0}>Select a department</option>
              {departments?.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </Field>
            <ErrorMessage name="departmentId" component="p" className="mt-1 text-sm text-red-600" />
          </div>
        )}

        {isEditing && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <div className="mt-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700">
              {subDepartment?.department?.name || 'N/A'}
            </div>
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Sub-Department Name *
          </label>
          <Field
            name="name"
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            placeholder="Enter sub-department name"
          />
          <ErrorMessage name="name" component="p" className="mt-1 text-sm text-red-600" />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
          </button>
        </div>
      </Form>
    </Formik>
  );
}

