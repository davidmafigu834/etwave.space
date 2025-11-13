import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Business, Order } from '@/types';

interface OrdersShowProps {
  business: Business;
  order: Order;
}

const OrdersShow: React.FC<OrdersShowProps> = ({ business, order }) => {
  const { data, setData, put, processing, errors } = useForm({
    status: order.status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' || 'pending',
  });
  
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('ecommerce.orders.update-status', [business.id, order.id]));
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <AppSidebarLayout>
      <Head title={`Order #${order.order_number}`} />

      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Order Details - {business.name}</h2>
          <Link 
            href={route('ecommerce.orders.index', business.id)}
            className="text-blue-500 hover:text-blue-700 font-medium"
          >
            ← Back to Orders
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Order #{order.order_number}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Items</h4>
                <div className="space-y-4">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.product_name}</div>
                            <div className="text-sm text-gray-500">SKU: {item.product_sku || 'N/A'}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-900">{item.quantity} × ${item.unit_price.toFixed(2)}</div>
                          <div className="text-sm font-medium text-gray-900 mt-1">${item.total_price.toFixed(2)}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No items found</p>
                  )}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Customer Information</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Name:</span>
                        <span className="ml-2 text-gray-900">{order.customer_name}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Email:</span>
                        <span className="ml-2 text-gray-900">{order.customer_email}</span>
                      </div>
                      {order.customer_phone && (
                        <div>
                          <span className="font-medium text-gray-700">Phone:</span>
                          <span className="ml-2 text-gray-900">{order.customer_phone}</span>
                        </div>
                      )}
                      {order.customer_address && (
                        <div>
                          <span className="font-medium text-gray-700">Address:</span>
                          <span className="ml-2 text-gray-900">{order.customer_address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Subtotal:</span>
                        <span className="text-gray-900">${order.subtotal.toFixed(2)}</span>
                      </div>
                      {order.tax_amount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-700">Tax:</span>
                          <span className="text-gray-900">${order.tax_amount.toFixed(2)}</span>
                        </div>
                      )}
                      {order.shipping_amount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-700">Shipping:</span>
                          <span className="text-gray-900">${order.shipping_amount.toFixed(2)}</span>
                        </div>
                      )}
                      {order.discount_amount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span className="font-medium">Discount:</span>
                          <span className="font-medium">-${order.discount_amount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                        <span className="text-gray-900 font-medium">Total:</span>
                        <span className="text-gray-900 font-medium">${order.total_amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Update Order Status</h3>
              
              <form onSubmit={submit}>
                <div className="mb-4">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded')}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                  {errors.status && <div className="text-red-500 text-sm mt-1">{errors.status}</div>}
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                  disabled={processing}
                >
                  {processing ? 'Updating...' : 'Update Status'}
                </button>
                
                <div className="mt-4 text-xs text-gray-500">
                  Current status: <span className="font-medium">{order.status}</span>
                </div>
              </form>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order Information</h3>
              
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Order ID:</span>
                  <span className="ml-2 text-gray-900">{order.id}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Payment Method:</span>
                  <span className="ml-2 text-gray-900">{order.payment_method || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Payment Status:</span>
                  <span className="ml-2 text-gray-900">{order.payment_status || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Currency:</span>
                  <span className="ml-2 text-gray-900">{order.currency}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Last Updated:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(order.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              {order.notes && (
                <div className="mt-4">
                  <h4 className="text-md font-medium text-gray-900 mb-2">Notes</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {order.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppSidebarLayout>
  );
};

export default OrdersShow;
