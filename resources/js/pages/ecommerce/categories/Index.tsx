import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Business, ProductCategory } from '@/types';

interface CategoriesIndexProps {
  business: Business;
  categories: ProductCategory[];
}

const CategoriesIndex: React.FC<CategoriesIndexProps> = ({ business, categories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const renderCategoryTree = (categories: ProductCategory[], level = 0) => {
    return categories.map(category => (
      <React.Fragment key={category.id}>
        <tr className="border-b hover:bg-gray-50">
          <td className="py-3 px-4">
            <div className="flex items-center" style={{ paddingLeft: `${level * 20}px` }}>
              {level > 0 && (
                <span className="mr-2 text-gray-400">↳</span>
              )}
              {category.name}
            </div>
          </td>
          <td className="py-3 px-4">
            {category.description && category.description.substring(0, 50)}
            {category.description && category.description.length > 50 ? '...' : ''}
          </td>
          <td className="py-3 px-4">
            <span className={`px-2 py-1 rounded-full text-xs ${category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {category.is_active ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td className="py-3 px-4">
            <div className="flex space-x-2">
              <Link 
                href={route('ecommerce.categories.edit', [business.id, category.id])}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </Link>
              <button 
                onClick={() => {
                  if (confirm('Are you sure you want to delete this category?')) {
                    // In a real implementation, we would make an Inertia delete request
                    alert('Delete functionality would be implemented here');
                  }
                }}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
        {category.children && category.children.length > 0 && renderCategoryTree(category.children, level + 1)}
      </React.Fragment>
    ));
  };
  
  return (
    <AppSidebarLayout>
      <Head title="Product Categories" />

      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Product Categories - {business.name}</h2>
          <Link 
            href={route('ecommerce.categories.create', business.id)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Add Category
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6 flex justify-between items-center">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search categories..."
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              Showing {filteredCategories.length} of {categories.length} categories
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.length > 0 ? (
                  renderCategoryTree(filteredCategories)
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                      No categories found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>Tip: You can organize your products into categories to make them easier for customers to browse.</p>
          </div>
        </div>
      </div>
    </AppSidebarLayout>
  );
};

export default CategoriesIndex;
