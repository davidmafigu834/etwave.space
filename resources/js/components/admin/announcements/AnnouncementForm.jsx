import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, X, AlertTriangle, Info, AlertCircle, Calendar, Clock } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function AnnouncementForm() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    start_date: '',
    end_date: '',
    target_roles: [],
    is_active: true
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableRoles, setAvailableRoles] = useState([
    'admin', 'user', 'manager', 'support'
  ]);

  useEffect(() => {
    if (isEditMode) {
      fetchAnnouncement();
    }
    
    // In a real app, you might fetch available roles from your API
    // fetchRoles();
  }, [id]);

  const fetchAnnouncement = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/v1/announcements/${id}`);
      const data = response.data;
      
      setFormData({
        title: data.title,
        message: data.message,
        type: data.type,
        start_date: data.start_date ? format(new Date(data.start_date), "yyyy-MM-dd'T'HH:mm") : '',
        end_date: data.end_date ? format(new Date(data.end_date), "yyyy-MM-dd'T'HH:mm") : '',
        target_roles: data.target_roles || [],
        is_active: data.is_active
      });
    } catch (error) {
      console.error('Error fetching announcement:', error);
      toast.error('Failed to load announcement');
      navigate('/admin/announcements');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRoleToggle = (role) => {
    setFormData(prev => {
      const roles = [...(prev.target_roles || [])];
      const roleIndex = roles.indexOf(role);
      
      if (roleIndex === -1) {
        roles.push(role);
      } else {
        roles.splice(roleIndex, 1);
      }
      
      return {
        ...prev,
        target_roles: roles
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      const payload = {
        ...formData,
        // Convert empty strings to null for dates
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        // Ensure target_roles is an array
        target_roles: formData.target_roles || []
      };
      
      if (isEditMode) {
        await axios.put(`/api/v1/announcements/${id}`, payload);
        toast.success('Announcement updated successfully');
      } else {
        await axios.post('/api/v1/announcements', payload);
        toast.success('Announcement created successfully');
      }
      
      navigate('/admin/announcements');
    } catch (error) {
      console.error('Error saving announcement:', error);
      
      let errorMessage = 'Failed to save announcement';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors).flat().join('\n');
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <Link
            to="/admin/announcements"
            className="mr-4 p-1 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <h2 className="text-lg font-medium text-gray-900">
            {isEditMode ? 'Edit Announcement' : 'Create New Announcement'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              The announcement message that will be displayed to users.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <div className="space-y-2">
                {['info', 'warning', 'important'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={formData.type === type}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 flex items-center">
                      {getTypeIcon(type)}
                      <span className="ml-1 capitalize">{type}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Roles
              </label>
              <div className="space-y-2">
                {availableRoles.map((role) => (
                  <div key={role} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`role-${role}`}
                      checked={formData.target_roles?.includes(role) || false}
                      onChange={() => handleRoleToggle(role)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`role-${role}`}
                      className="ml-2 block text-sm text-gray-700 capitalize"
                    >
                      {role}
                    </label>
                  </div>
                ))}
                <p className="mt-1 text-xs text-gray-500">
                  Leave empty to show to all users
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                Start Date & Time
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                When the announcement should start showing (leave empty for immediate)
              </p>
            </div>

            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                End Date & Time
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  min={formData.start_date || undefined}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                When the announcement should stop showing (leave empty for no end date)
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
              Active
            </label>
            <p className="ml-3 text-xs text-gray-500">
              {formData.is_active ? 'This announcement is currently visible to users.' : 'This announcement is hidden from users.'}
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <Link
            to="/admin/announcements"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <X className="-ml-1 mr-2 h-5 w-5" />
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="-ml-1 mr-2 h-5 w-5" />
            {isSubmitting ? 'Saving...' : 'Save Announcement'}
          </button>
        </div>
      </form>
    </div>
  );
}
