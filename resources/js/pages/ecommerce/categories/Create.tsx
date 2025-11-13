import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Business, ProductCategory } from '@/types';

interface CategoriesCreateProps {
  business: Business;
  parentCategories: ProductCategory[];
}

const CategoriesCreate: React.FC<CategoriesCreateProps> = ({ business, parentCategories }) => {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    parent_id: '',
    is_active: true as boolean,
  });
  
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('ecommerce.categories.store', business.id));
  };
  
  return (
    <AppSidebarLayout>
      <Head title="Add Product Category" />

      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add Product Category - {business.name}</h2>
          <Link 
            href={route('ecommerce.categories.index', business.id)}
            className="text-blue-500 hover:text-blue-700 font-medium"
          >
            ← Back to Categories
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto">
          <form onSubmit={submit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Category Name *
              </label>
              <input
                id="name"
                type="text"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
              />
              {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
              />
              {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
            </div>
            
            <div className="mb-6">
              <label htmlFor="parent_id" className="block text-sm font-medium text-gray-700 mb-1">
                Parent Category
              </label>
              <select
                id="parent_id"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                value={data.parent_id}
                onChange={(e) => setData('parent_id', e.target.value)}
              >
                <option value="">None (Root Category)</option>
                {parentCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.parent_id && <div className="text-red-500 text-sm mt-1">{errors.parent_id}</div>}
            </div>
            
            <div className="mb-6 flex items-center">
              <input
                id="is_active"
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                checked={data.is_active}
                onChange={(e) => setData('is_active', e.target.checked as true)}
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                Active
              </label>
            </div>
            
            <div className="flex items-center justify-end">
              <Link 
                href={route('ecommerce.categories.index', business.id)}
                className="mr-4 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
                disabled={processing}
              >
                {processing ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppSidebarLayout>
  );
};

export default CategoriesCreate;
