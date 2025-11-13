import React, { useState } from 'react';
import { Bell, X, Check, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useAnnouncements } from '../../contexts/AnnouncementContext';

export default function AnnouncementWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    announcements,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    isEnabled
  } = useAnnouncements();

  const getTypeIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'important':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  if (!isEnabled || isLoading || error) {
    return null;
  }

  const handleMarkAsRead = async (id) => {
    const success = await markAsRead(id);
    if (!success) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAll = async () => {
    const success = await markAllAsRead();
    if (success) {
      toast.success('All announcements marked as read');
    } else {
      toast.error('Failed to mark all as read');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
        aria-label="Announcements"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-3 w-80 bg-white rounded-lg shadow-xl overflow-hidden transform transition-all duration-200 ease-in-out">
          <div className="p-4 bg-gray-800 text-white flex justify-between items-center">
            <h3 className="font-semibold text-lg">Announcements</h3>
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAll}
                  className="text-xs px-2 py-1 bg-white/10 hover:bg-white/20 rounded"
                >
                  Mark all as read
                </button>
              )}
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {announcements.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500 space-y-2">
                <Info className="mx-auto h-5 w-5 text-gray-400" />
                <div>No announcements yet. Check back soon.</div>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {announcements.map((announcement) => (
                  <li 
                    key={announcement.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !announcement.is_read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getTypeIcon(announcement.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-900">
                            {announcement.title}
                          </h4>
                          {!announcement.is_read && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              New
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          {announcement.message}
                        </p>
                        <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                          <span>
                            {new Date(announcement.created_at).toLocaleDateString()}
                          </span>
                          {!announcement.is_read && (
                            <button
                              onClick={() => handleMarkAsRead(announcement.id)}
                              className="inline-flex items-center text-blue-600 hover:text-blue-800 text-xs font-medium"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
