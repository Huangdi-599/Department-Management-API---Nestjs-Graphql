'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subDepartmentsApi } from '@/lib/api/sub-departments';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import SubDepartmentForm from '@/components/SubDepartmentForm';
import Link from 'next/link';

interface Department {
  id: number;
  name: string;
}

interface SubDepartment {
  id: number;
  name: string;
  departmentId: number;
  department?: Department;
  createdAt: string;
  updatedAt: string;
}

export default function SubDepartmentsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<SubDepartment[]>({
    queryKey: ['sub-departments'],
    queryFn: subDepartmentsApi.getSubDepartments,
  });

  const deleteMutation = useMutation({
    mutationFn: subDepartmentsApi.deleteSubDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sub-departments'] });
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });

  const [editingSubDepartment, setEditingSubDepartment] = useState<SubDepartment | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { logout, username } = useAuth();

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this sub-department?')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete sub-department');
    }
  };

  const handleEdit = (subDepartment: SubDepartment) => {
    setEditingSubDepartment(subDepartment);
    setShowCreateForm(false);
  };

  const handleFormClose = () => {
    setEditingSubDepartment(null);
    setShowCreateForm(false);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['sub-departments'] });
    handleFormClose();
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-lg">Loading sub-departments...</p>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-red-600">Error loading sub-departments</p>
            <p className="text-sm text-gray-600">{(error as Error).message}</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-gray-900">Sub-Department Management</h1>
                <Link
                  href="/departments"
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  Departments
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Welcome, {username}</span>
                <button
                  onClick={logout}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Sub-Departments</h2>
            <button
              onClick={() => {
                setShowCreateForm(true);
                setEditingSubDepartment(null);
              }}
              className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Create Sub-Department
            </button>
          </div>

          {(showCreateForm || editingSubDepartment) && (
            <div className="mb-6 rounded-lg bg-white p-6 shadow">
              <SubDepartmentForm
                subDepartment={editingSubDepartment}
                onSuccess={handleFormSuccess}
                onCancel={handleFormClose}
              />
            </div>
          )}

          {data && data.length === 0 ? (
            <div className="rounded-lg bg-white p-8 text-center shadow">
              <p className="text-gray-600">No sub-departments found. Create your first sub-department!</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data?.map((subDept) => (
                    <tr key={subDept.id}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {subDept.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                        {subDept.department?.name || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(subDept.createdAt).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(subDept)}
                            className="rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(subDept.id)}
                            disabled={deleteMutation.isPending}
                            className="rounded-md bg-red-600 px-3 py-1 text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}

