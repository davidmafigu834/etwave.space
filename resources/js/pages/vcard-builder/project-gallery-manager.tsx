import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { PageTemplate } from '@/components/page-template';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import MediaPicker from '@/components/MediaPicker';
import { toast } from '@/components/custom-toast';
import { cn } from '@/lib/utils';
import { Image as ImageIcon, Video as VideoIcon, Trash2, Pencil, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';

interface GalleryItemResource {
  id: number;
  media_id?: string | null;
  media_type: 'image' | 'video';
  media_url: string;
  thumbnail_url?: string | null;
  title?: string | null;
  description?: string | null;
  order_index?: number | null;
  meta?: Record<string, any> | null;
}

interface ProjectGalleryManagerProps {
  business: {
    id: number;
    name: string;
  };
  gallery: {
    id: number;
    title?: string | null;
    description?: string | null;
  };
  items: GalleryItemResource[];
}

interface FormState {
  media_type: 'image' | 'video';
  media_url: string;
  thumbnail_url: string;
  title: string;
  description: string;
  order_index: string;
}

const defaultFormState: FormState = {
  media_type: 'image',
  media_url: '',
  thumbnail_url: '',
  title: '',
  description: '',
  order_index: '',
};

const ProjectGalleryManagerPage: React.FC<ProjectGalleryManagerProps> = ({ business, gallery, items: initialItems }) => {
  const { t } = useTranslation();
  const [items, setItems] = useState<GalleryItemResource[]>(() => initialItems ?? []);
  const [form, setForm] = useState<FormState>(defaultFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<GalleryItemResource | null>(null);
  const [useCustomOrder, setUseCustomOrder] = useState<boolean>(true);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)),
    [items]
  );

  const resetForm = () => {
    setForm(defaultFormState);
    setEditingItem(null);
    setUseCustomOrder(true);
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectMedia = (url: string, target: 'media_url' | 'thumbnail_url') => {
    setForm((prev) => ({ ...prev, [target]: url }));
  };

  const handleEdit = (item: GalleryItemResource) => {
    setEditingItem(item);
    setForm({
      media_type: item.media_type,
      media_url: item.media_url || '',
      thumbnail_url: item.thumbnail_url || '',
      title: item.title || '',
      description: item.description || '',
      order_index: String(item.order_index ?? ''),
    });
    setUseCustomOrder(item.order_index !== null && item.order_index !== undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.media_url) {
      toast.error(form.media_type === 'image' ? t('Please select an image.') : t('Please provide a video URL.'));
      return;
    }

    setIsSubmitting(true);

    const payload = {
      media_type: form.media_type,
      media_url: form.media_url.trim(),
      thumbnail_url: form.thumbnail_url.trim() || null,
      title: form.title.trim() || null,
      description: form.description.trim() || null,
      order_index:
        useCustomOrder && form.order_index.trim() !== '' ? Number(form.order_index.trim()) : null,
    };

    if (Number.isNaN(payload.order_index as number)) {
      payload.order_index = null;
    }

    try {
      const url = editingItem
        ? route('vcard-builder.gallery.items.update', [business.id, gallery.id, editingItem.id])
        : route('vcard-builder.gallery.items.store', [business.id, gallery.id]);

      const method = editingItem ? 'put' : 'post';

      const response = await axios({
        method,
        url,
        data: payload,
        headers: {
          Accept: 'application/json',
        },
      });

      const nextItems: GalleryItemResource[] = response.data?.items ?? [];
      setItems(nextItems);

      toast.success(response.data?.message || t('Gallery saved successfully.'));
      window.dispatchEvent(
        new CustomEvent('catalog:updated', { detail: { businessId: business.id } })
      );

      resetForm();
    } catch (error: any) {
      const message = error?.response?.data?.message || t('Failed to save gallery item.');
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (item: GalleryItemResource) => {
    if (!confirm(t('Remove this gallery item?'))) {
      return;
    }

    setIsDeleting(item.id);
    try {
      const url = route('vcard-builder.gallery.items.destroy', [business.id, gallery.id, item.id]);
      const response = await axios.delete(url, {
        headers: {
          Accept: 'application/json',
        },
      });
      setItems(response.data?.items ?? []);
      toast.success(response.data?.message || t('Gallery item removed successfully.'));
      window.dispatchEvent(
        new CustomEvent('catalog:updated', { detail: { businessId: business.id } })
      );
      if (editingItem?.id === item.id) {
        resetForm();
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || t('Failed to remove gallery item.');
      toast.error(message);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleReorder = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sortedItems.length) {
      return;
    }

    const reordered = [...sortedItems];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    setItems(reordered);

    try {
      const response = await axios.post(
        route('vcard-builder.gallery.items.reorder', [business.id, gallery.id]),
        {
          order: reordered.map((item) => item.id),
        },
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      setItems(response.data?.items ?? reordered);
      toast.success(response.data?.message || t('Gallery order updated.'));
      window.dispatchEvent(
        new CustomEvent('catalog:updated', { detail: { businessId: business.id } })
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t('Failed to update order.'));
      // Revert to original order on failure
      setItems(sortedItems);
    }
  };

  return (
    <>
      <Head title={t('Project Gallery')} />
      <PageTemplate
        title={t('Media Gallery')}
        description={t('Manage the images and videos for your vCard.')}
        url={route('vcard-builder.gallery.manage', business.id)}
      >
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingItem ? t('Edit gallery item') : t('Add gallery item')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitForm} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="media_type">{t('Media type')}</Label>
                    <Select
                      value={form.media_type}
                      onValueChange={(value: 'image' | 'video') => handleChange('media_type', value)}
                    >
                      <SelectTrigger id="media_type">
                        <SelectValue placeholder={t('Select media type')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image">{t('Image')}</SelectItem>
                        <SelectItem value="video">{t('Video')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="order_index">{t('Custom order')}</Label>
                    <div className="flex items-center justify-between rounded border px-3 py-2">
                      <div>
                        <p className="text-sm font-medium">{t('Set custom display order')}</p>
                        <p className="text-xs text-muted-foreground">
                          {t('Disable to append automatically to the end.')}
                        </p>
                      </div>
                      <Switch
                        checked={useCustomOrder}
                        onCheckedChange={(checked) => setUseCustomOrder(checked)}
                      />
                    </div>
                    {useCustomOrder && (
                      <Input
                        id="order_index"
                        type="number"
                        min="0"
                        value={form.order_index}
                        onChange={(event) => handleChange('order_index', event.target.value)}
                        placeholder={t('e.g. 3')}
                      />
                    )}
                  </div>
                </div>

                {form.media_type === 'image' ? (
                  <div className="space-y-2">
                    <Label>{t('Image')}</Label>
                    <MediaPicker
                      value={form.media_url}
                      onChange={(value) => handleSelectMedia(value, 'media_url')}
                      placeholder={t('Select an image')}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="media_url">{t('Video URL')}</Label>
                    <Input
                      id="media_url"
                      value={form.media_url}
                      onChange={(event) => handleChange('media_url', event.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>{t('Thumbnail')}</Label>
                  <MediaPicker
                    value={form.thumbnail_url}
                    onChange={(value) => handleSelectMedia(value, 'thumbnail_url')}
                    placeholder={t('Thumbnail image (optional)')}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">{t('Title')}</Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(event) => handleChange('title', event.target.value)}
                      placeholder={t('Title (optional)')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">{t('Description')}</Label>
                    <Textarea
                      id="description"
                      value={form.description}
                      onChange={(event) => handleChange('description', event.target.value)}
                      placeholder={t('Description (optional)')}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingItem ? t('Update item') : t('Add item')}
                  </Button>
                  {editingItem && (
                    <Button type="button" variant="outline" onClick={resetForm} disabled={isSubmitting}>
                      {t('Cancel edit')}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {sortedItems.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  <p>{t('No media items yet. Add images or videos to showcase your work.')}</p>
                </CardContent>
              </Card>
            ) : (
              sortedItems.map((item, index) => (
                <Card key={item.id} className="overflow-hidden border border-dashed">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-40 bg-muted/40 flex items-center justify-center">
                      {item.media_type === 'image' && item.media_url ? (
                        <img
                          src={item.thumbnail_url || item.media_url}
                          alt={item.title || ''}
                          className="h-32 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-32 w-full flex-col items-center justify-center text-muted-foreground">
                          <VideoIcon className="h-6 w-6" />
                          <span className="text-xs mt-1">{t('Video')}</span>
                        </div>
                      )}
                    </div>

                    <CardContent className="flex-1 space-y-3 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <BadgeIcon type={item.media_type} />
                            <p className="text-sm font-semibold">
                              {item.title || t('Untitled item')}
                            </p>
                          </div>
                          {item.description && (
                            <p className="text-xs text-muted-foreground whitespace-pre-line">
                              {item.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => handleReorder(index, -1)}
                            disabled={index === 0}
                            title={t('Move up')}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => handleReorder(index, 1)}
                            disabled={index === sortedItems.length - 1}
                            title={t('Move down')}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                        <div>
                          <span className="font-medium">{t('Media URL')}:</span>
                          <p className="truncate" title={item.media_url}>
                            {item.media_url}
                          </p>
                        </div>
                        {item.thumbnail_url && (
                          <div>
                            <span className="font-medium">{t('Thumbnail')}:</span>
                            <p className="truncate" title={item.thumbnail_url}>
                              {item.thumbnail_url}
                            </p>
                          </div>
                        )}
                        <div>
                          <span className="font-medium">{t('Order')}:</span> {item.order_index ?? '—'}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 border-t pt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          {t('Edit')}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(item)}
                          disabled={isDeleting === item.id}
                        >
                          {isDeleting === item.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="mr-2 h-4 w-4" />
                          )}
                          {t('Delete')}
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </PageTemplate>
    </>
  );
};

const BadgeIcon: React.FC<{ type: 'image' | 'video' }> = ({ type }) => {
  const iconClass = 'h-3 w-3';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium uppercase',
        type === 'image' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
      )}
    >
      {type === 'image' ? <ImageIcon className={iconClass} /> : <VideoIcon className={iconClass} />}
      {type}
    </span>
  );
};

export default ProjectGalleryManagerPage;
