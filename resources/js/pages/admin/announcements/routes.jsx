import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AnnouncementsPage from './index';
import AnnouncementList from '../../../components/admin/announcements/AnnouncementList';
import AnnouncementForm from '../../../components/admin/announcements/AnnouncementForm';

export default function AnnouncementRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AnnouncementsPage />}>
        <Route index element={<AnnouncementList />} />
        <Route path="new" element={<AnnouncementForm />} />
        <Route path=":id/edit" element={<AnnouncementForm />} />
      </Route>
    </Routes>
  );
}
