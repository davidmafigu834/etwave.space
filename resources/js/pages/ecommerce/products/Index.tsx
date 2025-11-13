import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Business, Product } from '@/types';

interface ProductsIndexProps {
  business: Business;
  products: {
    data: Product[];
    links: any;
    meta: any;
  };
}

const ProductsIndex: React.FC<ProductsIndexProps> = ({ business, products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    router.get(route('ecommerce.products.index', business.id), {
      search: searchTerm,
      category: selectedCategory,
      status: statusFilter,
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setStatusFilter('all');
    
    router.get(route('ecommerce.products.index', business.id), {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };
  
  const formatCurrency = (value: number | string | null | undefined) => {
    if (value === null || value === undefined || value === '') {
      return '$0.00';
    }

    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      return '$0.00';
    }

    return `$${numeric.toFixed(2)}`;
  };

  return (
    <AppSidebarLayout>
      <Head title="Products" />

      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Products - {business.name}</h2>
          <Link 
            href={route('ecommerce.products.create', business.id)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Add Product
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <select
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {/* In a real implementation, we would fetch categories from the backend */}
                  <option value="1">Electronics</option>
                  <option value="2">Clothing</option>
                  <option value="3">Home & Garden</option>
                </select>
              </div>
              
              <div>
                <select
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="featured">Featured</option>
                </select>
              </div>
              
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                >
                  Filter
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-200"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.data.length > 0 ? (
                  products.data.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          {product.media && product.media.length > 0 ? (
                            <img 
                              src={product.media[0].url} 
                              alt={product.name} 
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          ) : (
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {product.category ? product.category.name : 'Uncategorized'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {product.has_discount && product.sale_price ? (
                          <>
                            <span className="line-through text-red-500">{formatCurrency(product.price)}</span>
                            <span className="ml-2 text-green-600 font-medium">{formatCurrency(product.sale_price)}</span>
                          </>
                        ) : (
                          <span>{formatCurrency(product.price)}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <span className={product.stock_quantity === 0 ? 'text-red-600 font-medium' : ''}>
                          {product.stock_quantity}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className={`px-2 py-1 rounded-full text-xs w-fit ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {product.is_active ? 'Active' : 'Inactive'}
                          </span>
                          {product.is_featured && (
                            <span className="mt-1 px-2 py-1 rounded-full text-xs w-fit bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link 
                            href={route('ecommerce.products.edit', [business.id, product.id])}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Edit
                          </Link>
                          <button 
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this product?')) {
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {products.meta && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{products.meta.from || 0}</span> to <span className="font-medium">{products.meta.to || 0}</span> of{' '}
                <span className="font-medium">{products.meta.total || 0}</span> results
              </div>
              
              <div className="flex space-x-2">
                {products.links.map((link: any, index: number) => (
                  <Link
                    key={index}
                    href={link.url || '#'}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`px-3 py-1 rounded-md text-sm ${
                      link.active 
                        ? 'bg-blue-500 text-white' 
                        : link.url 
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    preserveScroll
                  />
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-6 text-sm text-gray-500">
            <p>Tip: Use the filters above to quickly find products. Featured products will be highlighted on your store's homepage.</p>
          </div>
        </div>
      </div>
    </AppSidebarLayout>
  );
};

export default ProductsIndex;
