import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

export const AnnouncementContext = createContext();

export const AnnouncementProvider = ({ children, user }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnnouncements = useCallback(async () => {
    if (!user) {
      setAnnouncements([]);
      setUnreadCount(0);
      setIsLoading(false);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get('/api/v1/announcements');
      setAnnouncements(response.data);
      const unread = response.data.filter(a => !a.is_read).length;
      setUnreadCount(unread);
      setError(null);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError('Failed to load announcements');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const markAsRead = async (id) => {
    if (!user) {
      return false;
    }

    try {
      await axios.post(`/api/v1/announcements/${id}/read`);
      setAnnouncements(prev => 
        prev.map(ann => 
          ann.id === id ? { ...ann, is_read: true } : ann
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      return true;
    } catch (err) {
      console.error('Error marking as read:', err);
      return false;
    }
  };

  const markAllAsRead = async () => {
    if (!user) {
      return false;
    }

    try {
      await axios.post('/api/v1/announcements/mark-all-read');
      setAnnouncements(prev => 
        prev.map(ann => ({ ...ann, is_read: true }))
      );
      setUnreadCount(0);
      return true;
    } catch (err) {
      console.error('Error marking all as read:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return (
    <AnnouncementContext.Provider
      value={{
        announcements,
        unreadCount,
        isLoading,
        error,
        refresh: fetchAnnouncements,
        markAsRead,
        markAllAsRead,
        isEnabled: Boolean(user)
      }}
    >
      {children}
    </AnnouncementContext.Provider>
  );
};

export const useAnnouncements = () => {
  const context = useContext(AnnouncementContext);
  if (!context) {
    throw new Error('useAnnouncements must be used within an AnnouncementProvider');
  }
  return context;
};
