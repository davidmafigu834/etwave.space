import React, { useMemo, useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import AnnouncementList from '@/components/admin/announcements/AnnouncementList';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Announcement {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'important';
  start_date: string | null;
  end_date: string | null;
  target_roles: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface PaginatedAnnouncements {
  data: Announcement[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface PageProps {
  announcements: PaginatedAnnouncements;
}

const AVAILABLE_ROLES = ['admin', 'user', 'manager', 'support'];
const ANNOUNCEMENT_TYPES: Array<{ value: Announcement['type']; label: string }> = [
  { value: 'info', label: 'Info' },
  { value: 'warning', label: 'Warning' },
  { value: 'important', label: 'Important' }
];

const defaultFormState = {
  title: '',
  message: '',
  type: 'info' as Announcement['type'],
  start_date: '',
  end_date: '',
  target_roles: [] as string[],
  is_active: true
};

type FormState = typeof defaultFormState;

export default function SuperAdminAnnouncementsPage() {
  const { props } = usePage<PageProps>();
  const initialAnnouncements = useMemo(() => props.announcements?.data ?? [], [props.announcements]);

  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormState(defaultFormState);
    setEditingAnnouncement(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditModal = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormState({
      title: announcement.title,
      message: announcement.message,
      type: announcement.type,
      start_date: announcement.start_date ? format(new Date(announcement.start_date), "yyyy-MM-dd'T'HH:mm") : '',
      end_date: announcement.end_date ? format(new Date(announcement.end_date), "yyyy-MM-dd'T'HH:mm") : '',
      target_roles: announcement.target_roles ?? [],
      is_active: announcement.is_active
    });
    setIsFormOpen(true);
  };

  const handleFetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/v1/announcements/admin');
      setAnnouncements(response.data.data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to refresh announcements');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (announcement: Announcement) => {
    try {
      const response = await axios.post(`/api/v1/announcements/${announcement.id}/toggle-status`);
      const { is_active } = response.data;
      setAnnouncements((prev) =>
        prev.map((item) =>
          item.id === announcement.id
            ? { ...item, is_active }
            : item
        )
      );
      toast.success(`Announcement ${is_active ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling announcement status:', error);
      toast.error('Failed to update announcement status');
    }
  };

  const handleDeleteAnnouncement = async () => {
    if (!announcementToDelete) return;

    try {
      setIsSubmitting(true);
      await axios.delete(`/api/v1/announcements/${announcementToDelete.id}`);
      setAnnouncements((prev) => prev.filter((item) => item.id !== announcementToDelete.id));
      toast.success('Announcement deleted successfully');
      setIsDeleteOpen(false);
      setAnnouncementToDelete(null);
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('Failed to delete announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAnnouncement = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      ...formState,
      start_date: formState.start_date || null,
      end_date: formState.end_date || null,
      target_roles: formState.target_roles,
    };

    try {
      setIsSubmitting(true);
      if (editingAnnouncement) {
        await axios.put(`/api/v1/announcements/${editingAnnouncement.id}`, payload);
        toast.success('Announcement updated successfully');
      } else {
        await axios.post('/api/v1/announcements', payload);
        toast.success('Announcement created successfully');
      }

      setIsFormOpen(false);
      resetForm();
      await handleFetchAnnouncements();
    } catch (error: any) {
      console.error('Error saving announcement:', error);
      const message = error.response?.data?.message
        || (error.response?.data?.errors ? Object.values(error.response.data.errors).flat().join('\n') : null)
        || 'Failed to save announcement';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRole = (role: string) => {
    setFormState((prev) => {
      const roles = new Set(prev.target_roles);
      if (roles.has(role)) {
        roles.delete(role);
      } else {
        roles.add(role);
      }
      return {
        ...prev,
        target_roles: Array.from(roles)
      };
    });
  };

  return (
    <PageTemplate
      title="Announcements"
      description="Create and manage announcements for all users"
      url={route('superadmin.announcements.index')}
      actions={[{
        label: 'New Announcement',
        icon: <span className="mr-1">+</span>,
        variant: 'default',
        onClick: openCreateModal
      }]}
    >
      <AnnouncementList
        announcements={announcements}
        isLoading={isLoading}
        onCreate={openCreateModal}
        onEdit={openEditModal}
        onDelete={(announcement) => {
          setAnnouncementToDelete(announcement as Announcement);
          setIsDeleteOpen(true);
        }}
        onToggleStatus={handleToggleStatus}
        onRetry={handleFetchAnnouncements}
      />

      <Dialog open={isFormOpen} onOpenChange={(open) => {
        setIsFormOpen(open);
        if (!open) {
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl">
          <form onSubmit={handleSaveAnnouncement}>
            <DialogHeader>
              <DialogTitle>{editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formState.title}
                  onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={formState.message}
                  onChange={(event) => setFormState((prev) => ({ ...prev, message: event.target.value }))}
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label>Type</Label>
                <RadioGroup
                  value={formState.type}
                  onValueChange={(value: Announcement['type']) => setFormState((prev) => ({ ...prev, type: value }))}
                  className="flex flex-wrap gap-4"
                >
                  {ANNOUNCEMENT_TYPES.map((type) => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={type.value} id={`type-${type.value}`} />
                      <Label htmlFor={`type-${type.value}`} className="capitalize">
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start_date">Start date</Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    value={formState.start_date}
                    onChange={(event) => setFormState((prev) => ({ ...prev, start_date: event.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">Leave empty to start immediately.</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end_date">End date</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    min={formState.start_date || undefined}
                    value={formState.end_date}
                    onChange={(event) => setFormState((prev) => ({ ...prev, end_date: event.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">Leave empty for no end date.</p>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Target roles</Label>
                <div className="grid gap-2 md:grid-cols-2">
                  {AVAILABLE_ROLES.map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={`role-${role}`}
                        checked={formState.target_roles.includes(role)}
                        onCheckedChange={() => toggleRole(role)}
                      />
                      <Label htmlFor={`role-${role}`} className="capitalize">
                        {role}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Leave empty to show to all users.</p>
              </div>

              <div className="flex items-center space-x-3">
                <Switch
                  id="is_active"
                  checked={formState.is_active}
                  onCheckedChange={(checked) => setFormState((prev) => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving…' : 'Save Announcement'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={(open) => {
        setIsDeleteOpen(open);
        if (!open) {
          setAnnouncementToDelete(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete announcement</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete “{announcementToDelete?.title}”? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteAnnouncement} disabled={isSubmitting}>
              {isSubmitting ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
}
