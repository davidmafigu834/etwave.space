import React from 'react';
import { Head } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Business } from '@/types';
import { ShoppingBag, Tag, ShoppingCart, DollarSign } from 'lucide-react';

interface DashboardProps {
  business: Business;
  stats: {
    total_products: number;
    total_categories: number;
    total_orders: number;
    pending_orders: number;
    total_revenue: number;
    recent_orders: any[];
  };
}

const Dashboard: React.FC<DashboardProps> = ({ business, stats }) => {
  return (
    <AppSidebarLayout>
      <Head title="E-commerce Dashboard" />

      <div className="py-4 sm:py-6">
        <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                E-commerce Dashboard
              </h2>
              <p className="text-sm text-gray-500">{business.name}</p>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Products</p>
                <p className="mt-2 text-2xl font-semibold text-blue-600">{stats.total_products}</p>
              </div>
              <div className="ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Categories</p>
                <p className="mt-2 text-2xl font-semibold text-green-600">{stats.total_categories}</p>
              </div>
              <div className="ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600">
                <Tag className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Orders</p>
                <p className="mt-2 text-2xl font-semibold text-amber-600">{stats.total_orders}</p>
              </div>
              <div className="ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                <ShoppingCart className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Revenue</p>
                <p className="mt-2 text-2xl font-semibold text-purple-600">${stats.total_revenue.toFixed(2)}</p>
              </div>
              <div className="ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Quick actions */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a 
                  href={route('ecommerce.products.create', business.id)}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  Add Product
                </a>
                <a 
                  href={route('ecommerce.categories.create', business.id)}
                  className="inline-flex items-center justify-center rounded-lg bg-green-600 px-3 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-green-700 transition-colors"
                >
                  Add Category
                </a>
                <a 
                  href={route('ecommerce.products.index', business.id)}
                  className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-3 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-800 transition-colors"
                >
                  Manage Products
                </a>
                <a 
                  href={route('ecommerce.categories.index', business.id)}
                  className="inline-flex items-center justify-center rounded-lg bg-gray-800 px-3 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-900 transition-colors"
                >
                  Manage Categories
                </a>
              </div>
            </div>

            {/* Recent orders */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Orders</h3>
              <div className="rounded-lg bg-gray-50 p-3 sm:p-4">
                {stats.recent_orders.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {stats.recent_orders.map((order: any) => (
                      <li key={order.id} className="flex items-center justify-between py-2.5">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Order #{order.order_number}</div>
                          <div className="text-xs text-gray-500">{order.customer_name}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900">${order.total_amount.toFixed(2)}</div>
                          <div className="mt-1 text-xs">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium ${
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No recent orders</p>
                )}
                <div className="mt-3 sm:mt-4 text-center">
                  <a 
                    href={route('ecommerce.orders.index', business.id)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    View All Orders
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppSidebarLayout>
  );
};

export default Dashboard;
