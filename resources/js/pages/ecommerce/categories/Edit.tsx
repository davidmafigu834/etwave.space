import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Business, ProductCategory } from '@/types';

interface CategoriesEditProps {
  business: Business;
  category: ProductCategory;
  parentCategories: ProductCategory[];
}

const CategoriesEdit: React.FC<CategoriesEditProps> = ({ business, category, parentCategories }) => {
  const { data, setData, put, processing, errors } = useForm({
    name: category.name || '',
    description: category.description || '',
    parent_id: category.parent_id ? category.parent_id.toString() : '',
    is_active: category.is_active ?? true,
  });
  
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('ecommerce.categories.update', [business.id, category.id]));
  };
  
  return (
    <AppSidebarLayout>
      <Head title="Edit Product Category" />

      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Product Category - {business.name}</h2>
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
                {parentCategories
                  .filter(parent => parent.id !== category.id) // Prevent category from being its own parent
                  .map(parentCategory => (
                    <option key={parentCategory.id} value={parentCategory.id}>
                      {parentCategory.name}
                    </option>
                  ))
                }
              </select>
              {errors.parent_id && <div className="text-red-500 text-sm mt-1">{errors.parent_id}</div>}
              
              {category.parent && (
                <div className="mt-2 text-sm text-gray-500">
                  Current parent: {category.parent.name}
                </div>
              )}
            </div>
            
            <div className="mb-6 flex items-center">
              <input
                id="is_active"
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                checked={data.is_active}
                onChange={(e) => setData('is_active', e.target.checked as boolean)}
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
                {processing ? 'Saving...' : 'Update Category'}
              </button>
            </div>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Category Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">ID:</span>
                <span className="ml-2 text-gray-900">{category.id}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Slug:</span>
                <span className="ml-2 text-gray-900">{category.slug}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Products:</span>
                <span className="ml-2 text-gray-900">{category.products_count || 0}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Created:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(category.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppSidebarLayout>
  );
};

export default CategoriesEdit;
