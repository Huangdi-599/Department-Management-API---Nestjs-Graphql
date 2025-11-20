'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentsApi } from '@/lib/api/departments';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import DepartmentForm from '@/components/DepartmentForm';
import Link from 'next/link';

interface SubDepartment {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
  subDepartments: SubDepartment[];
  createdAt: string;
  updatedAt: string;
}

export default function DepartmentsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: departmentsApi.getDepartments,
  });

  const deleteMutation = useMutation({
    mutationFn: departmentsApi.deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });

  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { logout, username } = useAuth();

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this department and all its sub-departments?')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete department');
    }
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setShowCreateForm(false);
  };

  const handleFormClose = () => {
    setEditingDepartment(null);
    setShowCreateForm(false);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['departments'] });
    handleFormClose();
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-lg">Loading departments...</p>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-red-600">Error loading departments</p>
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
                <h1 className="text-xl font-semibold text-gray-900">Department Management</h1>
                <Link
                  href="/sub-departments"
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  Sub-Departments
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
            <h2 className="text-2xl font-bold text-gray-900">Departments</h2>
            <button
              onClick={() => {
                setShowCreateForm(true);
                setEditingDepartment(null);
              }}
              className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Create Department
            </button>
          </div>

          {(showCreateForm || editingDepartment) && (
            <div className="mb-6 rounded-lg bg-white p-6 shadow">
              <DepartmentForm
                department={editingDepartment}
                onSuccess={handleFormSuccess}
                onCancel={handleFormClose}
              />
            </div>
          )}

          {data && data.length === 0 ? (
            <div className="rounded-lg bg-white p-8 text-center shadow">
              <p className="text-gray-600">No departments found. Create your first department!</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data?.map((department) => (
                <div key={department.id} className="rounded-lg bg-white p-6 shadow">
                  <div className="mb-4 flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(department)}
                        className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(department.id)}
                        disabled={deleteMutation.isPending}
                        className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>

                  {department.subDepartments && department.subDepartments.length > 0 ? (
                    <div className="mt-4">
                      <h4 className="mb-2 text-sm font-medium text-gray-700">Sub-Departments:</h4>
                      <ul className="space-y-1">
                        {department.subDepartments.map((subDept) => (
                          <li key={subDept.id} className="text-sm text-gray-600">
                            • {subDept.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-gray-500">No sub-departments</p>
                  )}

                  <div className="mt-4 text-xs text-gray-500">
                    Created: {new Date(department.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
