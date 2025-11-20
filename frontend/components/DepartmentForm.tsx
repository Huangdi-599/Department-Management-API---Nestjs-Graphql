'use client';

import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentsApi } from '@/lib/api/departments';

const departmentSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Department name must be at least 2 characters')
    .required('Department name is required'),
  subDepartments: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.number().optional(),
        name: Yup.string()
          .min(2, 'Sub-department name must be at least 2 characters')
          .required('Sub-department name is required'),
      })
    )
    .optional(),
});

interface Department {
  id: number;
  name: string;
  subDepartments?: { id: number; name: string }[];
}

interface DepartmentFormProps {
  department?: Department | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function DepartmentForm({ department, onSuccess, onCancel }: DepartmentFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!department;

  const createMutation = useMutation({
    mutationFn: departmentsApi.createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      onSuccess();
    },
  });

  const updateMutation = useMutation({
    mutationFn: departmentsApi.updateDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      onSuccess();
    },
  });

  const initialValues = {
    name: department?.name || '',
    subDepartments: department?.subDepartments?.map((sd) => ({ id: sd.id, name: sd.name })) || [],
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: department.id,
          name: values.name,
          subDepartments: values.subDepartments && values.subDepartments.length > 0 
            ? values.subDepartments.map((sd) => ({
                id: sd.id,
                name: sd.name,
              }))
            : [],
        });
      } else {
        await createMutation.mutateAsync({
          name: values.name,
          subDepartments: values.subDepartments && values.subDepartments.length > 0 
            ? values.subDepartments.map((sd) => ({ name: sd.name }))
            : null,
        });
      }
    } catch (err) {
      console.error('Form submission error:', err);
      alert('Failed to save department. Please try again.');
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={departmentSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values }) => (
        <Form className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isEditing ? 'Edit Department' : 'Create New Department'}
            </h3>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Department Name *
            </label>
            <Field
              name="name"
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              placeholder="Enter department name"
            />
            <ErrorMessage name="name" component="p" className="mt-1 text-sm text-red-600" />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Sub-Departments (Optional)
              </label>
            </div>

            {values.subDepartments.length === 0 && (
              <p className="text-sm text-gray-500 mb-2">No sub-departments. Click below to add one.</p>
            )}

            <FieldArray name="subDepartments">
              {({ remove, push }) => (
                <>
                  <div className="space-y-2">
                    {values.subDepartments.map((_, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="flex-1">
                          <Field
                            name={`subDepartments.${index}.name`}
                            type="text"
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                            placeholder="Sub-department name"
                          />
                          <ErrorMessage
                            name={`subDepartments.${index}.name`}
                            component="p"
                            className="mt-1 text-sm text-red-600"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="rounded-md bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => push({ name: '' })}
                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    + Add Sub-Department
                  </button>
                </>
              )}
            </FieldArray>
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
      )}
    </Formik>
  );
}
