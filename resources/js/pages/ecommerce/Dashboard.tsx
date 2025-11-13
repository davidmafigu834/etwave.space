import React from 'react';
import { Head } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Business } from '@/types';

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

      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">E-commerce Dashboard - {business.name}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600">{stats.total_products}</div>
            <div className="text-gray-600 mt-2">Total Products</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">{stats.total_categories}</div>
            <div className="text-gray-600 mt-2">Categories</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-yellow-600">{stats.total_orders}</div>
            <div className="text-gray-600 mt-2">Total Orders</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-purple-600">${stats.total_revenue.toFixed(2)}</div>
            <div className="text-gray-600 mt-2">Total Revenue</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <a 
                href={route('ecommerce.products.create', business.id)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg text-center transition duration-200"
              >
                Add Product
              </a>
              <a 
                href={route('ecommerce.categories.create', business.id)}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg text-center transition duration-200"
              >
                Add Category
              </a>
              <a 
                href={route('ecommerce.products.index', business.id)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg text-center transition duration-200"
              >
                Manage Products
              </a>
              <a 
                href={route('ecommerce.categories.index', business.id)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg text-center transition duration-200"
              >
                Manage Categories
              </a>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              {stats.recent_orders.length > 0 ? (
                <ul className="space-y-3">
                  {stats.recent_orders.map((order: any) => (
                    <li key={order.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <div className="font-medium">Order #{order.order_number}</div>
                        <div className="text-sm text-gray-600">{order.customer_name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${order.total_amount.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded-full text-xs ${
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
                <p className="text-gray-500 text-center py-4">No recent orders</p>
              )}
              <div className="mt-4 text-center">
                <a 
                  href={route('ecommerce.orders.index', business.id)}
                  className="text-blue-500 hover:text-blue-700 font-medium"
                >
                  View All Orders
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppSidebarLayout>
  );
};

export default Dashboard;
