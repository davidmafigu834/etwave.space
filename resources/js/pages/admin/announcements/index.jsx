import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Bell, Plus } from 'lucide-react';

function AnnouncementsPage() {
  const location = useLocation();
  const isRoot = location.pathname === '/admin/announcements';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
            <Bell className="h-8 w-8 text-blue-500 inline-block mr-3 -mt-1" />
            Announcements
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage system-wide announcements and notifications
          </p>
        </div>
        {isRoot && (
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              to="new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              New Announcement
            </Link>
          </div>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <Outlet />
      </div>
    </div>
  );
}

export default AnnouncementsPage;
