import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Business, ProductCategory } from '@/types';

interface ProductsCreateProps {
  business: Business;
  categories: ProductCategory[];
}

const ProductsCreate: React.FC<ProductsCreateProps> = ({ business, categories }) => {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    short_description: '',
    category_id: '',
    price: '',
    sale_price: '',
    sku: '',
    stock_quantity: '',
    is_featured: false as boolean,
    is_active: true as boolean,
  });
  
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('ecommerce.products.store', business.id));
  };
  
  return (
    <AppSidebarLayout>
      <Head title="Add Product" />

      <div className="py-4 sm:py-6">
        <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Add Product</h2>
              <p className="text-sm text-gray-500">{business.name}</p>
            </div>
            <Link 
              href={route('ecommerce.products.index', business.id)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              ← Back to Products
            </Link>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-6">
          <form onSubmit={submit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                />
                {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
              </div>
              
              <div>
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                  SKU *
                </label>
                <input
                  id="sku"
                  type="text"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm"
                  value={data.sku}
                  onChange={(e) => setData('sku', e.target.value)}
                />
                {errors.sku && <div className="text-red-500 text-sm mt-1">{errors.sku}</div>}
                <div className="text-xs text-gray-500 mt-1">Unique identifier for this product</div>
              </div>
              
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category_id"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm"
                  value={data.category_id}
                  onChange={(e) => setData('category_id', e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && <div className="text-red-500 text-sm mt-1">{errors.category_id}</div>}
              </div>
              
              <div>
                <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity *
                </label>
                <input
                  id="stock_quantity"
                  type="number"
                  min="0"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm"
                  value={data.stock_quantity}
                  onChange={(e) => setData('stock_quantity', e.target.value)}
                />
                {errors.stock_quantity && <div className="text-red-500 text-sm mt-1">{errors.stock_quantity}</div>}
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    className="pl-8 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm"
                    value={data.price}
                    onChange={(e) => setData('price', e.target.value)}
                  />
                </div>
                {errors.price && <div className="text-red-500 text-sm mt-1">{errors.price}</div>}
              </div>
              
              <div>
                <label htmlFor="sale_price" className="block text-sm font-medium text-gray-700 mb-1">
                  Sale Price
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    id="sale_price"
                    type="number"
                    step="0.01"
                    min="0"
                    className="pl-8 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm"
                    value={data.sale_price}
                    onChange={(e) => setData('sale_price', e.target.value)}
                  />
                </div>
                {errors.sale_price && <div className="text-red-500 text-sm mt-1">{errors.sale_price}</div>}
                <div className="text-xs text-gray-500 mt-1">Leave blank if not on sale</div>
              </div>
            </div>
            
            <div className="mt-6">
              <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 mb-1">
                Short Description
              </label>
              <textarea
                id="short_description"
                rows={2}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm"
                value={data.short_description}
                onChange={(e) => setData('short_description', e.target.value)}
              />
              {errors.short_description && <div className="text-red-500 text-sm mt-1">{errors.short_description}</div>}
              <div className="text-xs text-gray-500 mt-1">Brief description shown in product listings</div>
            </div>
            
            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Full Description
              </label>
              <textarea
                id="description"
                rows={6}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
              />
              {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
            </div>
            
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  id="is_featured"
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  checked={data.is_featured}
                  onChange={(e) => setData('is_featured', e.target.checked as boolean)}
                />
                <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
                  Featured Product
                </label>
              </div>
              <div className="flex items-center">
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
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-end gap-3">
              <Link 
                href={route('ecommerce.products.index', business.id)}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors w-full sm:w-auto"
                disabled={processing}
              >
                {processing ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AppSidebarLayout>
  );
};

export default ProductsCreate;
