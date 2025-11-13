import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/custom-toast';
import { cn } from '@/lib/utils';
import {
  Building2,
  Compass,
  MapPin,
  PencilLine,
  PlusCircle,
  Rocket,
  Sparkles,
  Trash2,
} from 'lucide-react';

interface ProjectResource {
  id: number;
  title: string;
  slug: string | null;
  category: string | null;
  location: string | null;
  summary: string | null;
  description: string | null;
  cta_label: string | null;
  cta_link: string | null;
  is_featured: boolean;
  order_index: number | null;
  meta?: Record<string, any> | null;
}

interface ProjectsManagerProps {
  business: {
    id: number;
    name: string;
    business_type?: string | null;
  };
  projects: ProjectResource[];
}

interface ProjectFormData {
  title: string;
  slug: string;
  category: string;
  location: string;
  summary: string;
  description: string;
  cta_label: string;
  cta_link: string;
  is_featured: boolean;
  order_index: number | '' | null;
  meta?: Record<string, any> | null;
}

const defaultProjectFormData = (orderIndex: number): ProjectFormData => ({
  title: '',
  slug: '',
  category: '',
  location: '',
  summary: '',
  description: '',
  cta_label: '',
  cta_link: '',
  is_featured: true,
  order_index: orderIndex,
  meta: undefined,
});

const normalizeNumber = (value: string | number | null | undefined): number | null => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const ProjectFormCard: React.FC<{
  businessId: number;
  project?: ProjectResource;
  defaultOrder: number;
  onFinish?: () => void;
}> = ({ businessId, project, defaultOrder, onFinish }) => {
  const { t } = useTranslation();
  const isEdit = Boolean(project);

  const emitProjectsUpdate = React.useCallback(
    (action: 'create' | 'update') => {
      if (typeof window === 'undefined') return;

      const detail = {
        businessId,
        entity: 'project' as const,
        action,
      };

      window.dispatchEvent(
        new CustomEvent('projects:updated', {
          detail,
        })
      );

      window.dispatchEvent(
        new CustomEvent('catalog:updated', {
          detail,
        })
      );
    },
    [businessId]
  );

  const form = useForm<ProjectFormData>(
    project
      ? {
          title: project.title ?? '',
          slug: project.slug ?? '',
          category: project.category ?? '',
          location: project.location ?? '',
          summary: project.summary ?? '',
          description: project.description ?? '',
          cta_label: project.cta_label ?? '',
          cta_link: project.cta_link ?? '',
          is_featured: Boolean(project.is_featured),
          order_index: project.order_index ?? '',
          meta: project.meta ?? undefined,
        }
      : defaultProjectFormData(defaultOrder)
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    form.transform((data) => ({
      ...data,
      order_index: normalizeNumber(data.order_index),
      slug: data.slug?.trim() ?? '',
    }));

    const options = {
      preserveScroll: true,
      onSuccess: () => {
        toast.success(
          isEdit ? t('Project updated successfully.') : t('Project created successfully.')
        );

        if (!isEdit) {
          form.reset();
          form.setData(defaultProjectFormData(defaultOrder));
          emitProjectsUpdate('create');
        } else {
          emitProjectsUpdate('update');
          onFinish?.();
        }
      },
    };

    if (isEdit && project) {
      form.put(route('vcard-builder.projects.update', [businessId, project.id]), options);
      return;
    }

    form.post(route('vcard-builder.projects.store', businessId), options);
  };

  const descriptionHelper = isEdit
    ? t('Bring existing projects to life with vivid storytelling and proof points.')
    : t('Add your standout builds so every visitor sees the expertise behind your brand.');

  return (
    <Card className={cn('border border-slate-200 shadow-lg shadow-blue-100/40')}> 
      <form onSubmit={handleSubmit} className="space-y-6">
        <CardHeader className="space-y-2 border-b bg-slate-900/5">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            {isEdit ? <PencilLine className="h-5 w-5 text-sky-600" /> : <PlusCircle className="h-5 w-5 text-sky-600" />}
            {isEdit ? t('Update project showcase') : t('Add a new featured project')}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{descriptionHelper}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`title-${project?.id ?? 'new'}`}>{t('Project title')}</Label>
              <Input
                id={`title-${project?.id ?? 'new'}`}
                placeholder={t('Project Title')}
                value={form.data.title}
                onChange={(event) => form.setData('title', event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`category-${project?.id ?? 'new'}`}>{t('Category')}</Label>
              <Input
                id={`category-${project?.id ?? 'new'}`}
                placeholder={t('Project category or type')}
                value={form.data.category}
                onChange={(event) => form.setData('category', event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`location-${project?.id ?? 'new'}`}>{t('Location')}</Label>
              <Input
                id={`location-${project?.id ?? 'new'}`}
                placeholder={t('Project location')}
                value={form.data.location}
                onChange={(event) => form.setData('location', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`slug-${project?.id ?? 'new'}`}>{t('Slug (optional)')}</Label>
              <Input
                id={`slug-${project?.id ?? 'new'}`}
                placeholder={t('url-friendly-identifier')}
                value={form.data.slug}
                onChange={(event) => form.setData('slug', event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`summary-${project?.id ?? 'new'}`}>{t('Summary highlight')}</Label>
            <Input
              id={`summary-${project?.id ?? 'new'}`}
              placeholder={t('Brief project summary')}
              value={form.data.summary}
              onChange={(event) => form.setData('summary', event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`description-${project?.id ?? 'new'}`}>{t('Detailed description')}</Label>
            <Textarea
              id={`description-${project?.id ?? 'new'}`}
              placeholder={t('Detailed project description, challenges, and outcomes.')}
              minRows={4}
              value={form.data.description}
              onChange={(event) => form.setData('description', event.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`cta_label-${project?.id ?? 'new'}`}>{t('CTA label')}</Label>
              <Input
                id={`cta_label-${project?.id ?? 'new'}`}
                placeholder={t('Call to action text')}
                value={form.data.cta_label}
                onChange={(event) => form.setData('cta_label', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`cta_link-${project?.id ?? 'new'}`}>{t('CTA link')}</Label>
              <Input
                id={`cta_link-${project?.id ?? 'new'}`}
                placeholder="https://"
                type="url"
                value={form.data.cta_link}
                onChange={(event) => form.setData('cta_link', event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border border-dashed border-sky-200/80 bg-sky-50/60 px-3 py-3">
              <div>
                <p className="text-sm font-medium text-slate-900">{t('Spotlight this project')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('Featured projects will be highlighted in the preview.')}
                </p>
              </div>
              <Switch
                checked={form.data.is_featured}
                onCheckedChange={(checked) => form.setData('is_featured', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`order_index-${project?.id ?? 'new'}`}>{t('Display order')}</Label>
              <Input
                id={`order_index-${project?.id ?? 'new'}`}
                type="number"
                min="0"
                value={form.data.order_index ?? ''}
                onChange={(event) => {
                  const value = event.target.value;
                  form.setData('order_index', value === '' ? '' : Number(value));
                }}
              />
            </div>
          </div>
        </CardContent>

        <div className="flex items-center justify-end gap-3 border-t bg-slate-50 px-6 py-4">
          {isEdit && (
            <Button type="button" variant="ghost" onClick={onFinish} disabled={form.processing}>
              {t('Cancel')}
            </Button>
          )}
          <Button type="submit" disabled={form.processing}>
            {isEdit ? t('Save project') : t('Publish project showcase')}
          </Button>
        </div>
      </form>
    </Card>
  );
};

const ProjectListItem: React.FC<{
  project: ProjectResource;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ project, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <Card className="relative overflow-hidden border border-slate-200/80 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400" />
      <CardContent className="space-y-4 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-1 border-sky-200 bg-sky-50 text-sky-800">
              <Building2 className="h-3.5 w-3.5" />
              {project.category || t('No category')}
            </Badge>
            {project.is_featured && (
              <Badge className="bg-gradient-to-r from-violet-500 to-sky-500 text-white">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                {t('Featured')}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Compass className="h-4 w-4" />
            {t('Order')}: {project.order_index ?? '—'}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <h3 className="text-xl font-semibold text-slate-900">{project.title}</h3>
          </div>
          {project.location && (
            <p className="flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="h-4 w-4" /> {project.location}
            </p>
          )}
          {project.summary && <p className="text-sm font-medium text-slate-700">{project.summary}</p>}
          {project.description && (
            <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">
              {project.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
          <div className="text-sm text-muted-foreground">
            {project.cta_label && project.cta_link ? (
              <span>
                {project.cta_label} ·{' '}
                <a
                  href={project.cta_link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-600 underline-offset-4 hover:underline"
                >
                  {project.cta_link}
                </a>
              </span>
            ) : (
              <span>{t('No CTA configured yet.')}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <PencilLine className="mr-1 h-4 w-4" />
              {t('Edit')}
            </Button>
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="mr-1 h-4 w-4" />
              {t('Remove')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProjectsManagerPage: React.FC<ProjectsManagerProps> = ({ business, projects }) => {
  const { t } = useTranslation();
  const [editingProjectId, setEditingProjectId] = React.useState<number | null>(null);

  const handleDeleteProject = (project: ProjectResource) => {
    if (!window.confirm(t('Remove “:title” from your featured projects?', { title: project.title }))) {
      return;
    }

    router.delete(route('vcard-builder.projects.destroy', [business.id, project.id]), {
      preserveScroll: true,
      onSuccess: () => {
        if (typeof window !== 'undefined') {
          const detail = {
            businessId: business.id,
            entity: 'project' as const,
            action: 'delete' as const,
          };

          window.dispatchEvent(new CustomEvent('projects:updated', { detail }));
          window.dispatchEvent(new CustomEvent('catalog:updated', { detail }));
        }

        toast.success(t('Project removed.'));
      },
    });
  };

  const editingProject = React.useMemo(
    () => (editingProjectId ? projects.find((item) => item.id === editingProjectId) ?? null : null),
    [editingProjectId, projects]
  );

  return (
    <PageTemplate>
      <Head title={t('Featured Projects Manager')} />

      <div className="space-y-10">
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 via-sky-900 to-slate-800 p-8 text-white shadow-xl">
          <div className="absolute inset-y-0 right-0 hidden w-1/2 skew-x-[-12deg] bg-white/10 blur-3xl lg:block" />
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1.4fr,1fr] lg:items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm">
                <Rocket className="h-4 w-4" />
                {t('Position your builds front and centre')}
              </div>
              <h1 className="text-3xl font-semibold leading-tight lg:text-4xl">
                {t('Featured Projects')}{' '}
                <span className="font-light text-sky-200">{t('curated for your vCard')}</span>
              </h1>
              <p className="max-w-2xl text-base text-slate-200">
                {t('Transform your projects into powerful proof. Capture a project, add its impact, and watch the preview update instantly—no design work required.')}
              </p>
            </div>

            <Card className="bg-white/95 text-slate-900 shadow-2xl">
              <CardContent className="flex h-full flex-col justify-between gap-4 p-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-sky-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">{t('Projects showcased')}</p>
                    <p className="text-2xl font-semibold text-slate-900">{projects.length}</p>
                  </div>
                </div>
                <div className="grid gap-2 text-sm text-slate-500">
                  <p className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-sky-500" />
                    {t('Business')}: {business.name}
                  </p>
                  <p className="flex items-center gap-2">
                    <Compass className="h-4 w-4 text-sky-500" />
                    {t('Category')}: {business.business_type || t('Not specified')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="grid gap-8 xl:grid-cols-[1.1fr,1fr] xl:items-start">
          <div className="space-y-6">
            {editingProject ? (
              <ProjectFormCard
                key={editingProject.id}
                businessId={business.id}
                project={editingProject}
                defaultOrder={projects.length}
                onFinish={() => setEditingProjectId(null)}
              />
            ) : (
              <ProjectFormCard businessId={business.id} defaultOrder={projects.length} />
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{t('Project library')}</h2>
                  <p className="text-sm text-muted-foreground">
                    {t('These projects will appear in the Featured Projects section of your vCard.')}
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                {projects.length === 0 && (
                  <Card className="border border-dashed border-sky-200 bg-sky-50/80">
                    <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
                      <Sparkles className="h-8 w-8 text-sky-500" />
                      <div className="space-y-2">
                        <p className="text-base font-semibold text-slate-800">{t('Showcase your first project')}</p>
                        <p className="text-sm text-slate-600">
                          {t('Add your first project to get started.')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {projects.map((project) =>
                  editingProjectId === project.id ? null : (
                    <ProjectListItem
                      key={project.id}
                      project={project}
                      onEdit={() => setEditingProjectId(project.id)}
                      onDelete={() => handleDeleteProject(project)}
                    />
                  )
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <Card className="border border-slate-200/80 bg-white/70 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Sparkles className="h-5 w-5 text-sky-500" />
                  {t('Helpful prompts')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-600">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="font-medium text-slate-800">{t('Tell the story')}</p>
                  <p>{t('Explain the project, its impact, and the results.')}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="font-medium text-slate-800">{t('Add proof')}</p>
                  <p>
                    {t('Include metrics, results, or testimonials that demonstrate value.')}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="font-medium text-slate-800">{t('Link to more')}</p>
                  <p>{t('Add a call-to-action to guide visitors to more information.')}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200/80 bg-gradient-to-br from-sky-500 via-sky-400 to-cyan-400 text-white">
              <CardContent className="space-y-3 p-6">
                <h3 className="text-lg font-semibold">{t('Need visuals?')}</h3>
                <p className="text-sm text-sky-50">
                  {t('Add images to make your projects more engaging.')}
                </p>
                <Button variant="secondary" className="w-full bg-white text-sky-600 hover:bg-slate-100">
                  {t('Open media library')}
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </PageTemplate>
  );
};

export default ProjectsManagerPage;
