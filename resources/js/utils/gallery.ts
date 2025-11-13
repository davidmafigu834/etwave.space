import { extractVideoUrl } from '@/components/VideoEmbed';

export interface NormalizedGalleryItem {
  key: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string | null;
  title?: string | null;
  description?: string | null;
  order: number;
  meta?: Record<string, any> | null;
  video?: {
    url: string;
    platform: string;
  } | null;
  legacyImage?: string | null;
  legacyCaption?: string | null;
}

export interface NormalizedGallerySection {
  heading: string | null;
  subheading: string | null;
  items: NormalizedGalleryItem[];
  isManaged: boolean;
  images: Array<{ image: string; caption?: string | null; title?: string | null; meta?: Record<string, any> | null }>;
  photos: Array<{ image: string; caption?: string | null; title?: string | null; meta?: Record<string, any> | null }>;
  video_list: Array<{
    type: 'video';
    url: string;
    platform: string;
    title?: string | null;
    description?: string | null;
    thumbnail?: string | null;
    meta?: Record<string, any> | null;
  }>;
}

const normalizeHeading = (gallery: any, fallback?: any): { heading: string | null; subheading: string | null } => {
  const heading = gallery?.heading ?? gallery?.title ?? fallback?.heading ?? fallback?.title ?? null;
  const subheading =
    gallery?.subheading ??
    gallery?.description ??
    fallback?.subheading ??
    fallback?.description ??
    (typeof fallback?.text === 'string' ? fallback.text : null) ??
    null;

  return {
    heading: typeof heading === 'string' && heading.trim().length > 0 ? heading.trim() : null,
    subheading: typeof subheading === 'string' && subheading.trim().length > 0 ? subheading.trim() : null,
  };
};

const coerceMediaType = (value: any, url: string): 'image' | 'video' => {
  const type = typeof value === 'string' ? value.toLowerCase() : '';
  if (type === 'video') {
    return 'video';
  }

  if (type === 'image') {
    return 'image';
  }

  if (url && url.match(/\.(mp4|mov|webm|ogg|avi)$/i)) {
    return 'video';
  }

  return 'image';
};

const normalizeManagedItem = (item: any, index: number): NormalizedGalleryItem | null => {
  const rawUrl =
    item?.media_url ??
    item?.url ??
    item?.image ??
    item?.src ??
    (typeof item?.meta === 'object' ? item.meta?.url : null) ??
    '';

  if (!rawUrl || typeof rawUrl !== 'string') {
    return null;
  }

  const order = typeof item?.order_index === 'number' ? item.order_index : index;
  const type = coerceMediaType(item?.media_type ?? item?.type ?? item?.meta?.type, rawUrl);
  const videoMeta = type === 'video' ? extractVideoUrl(rawUrl) : null;

  return {
    key: String(item?.id ?? item?.meta?.id ?? `managed-${index}`),
    type,
    url: rawUrl,
    thumbnail: item?.thumbnail_url ?? item?.thumbnail ?? item?.poster ?? null,
    title: typeof item?.title === 'string' ? item.title : item?.meta?.title ?? null,
    description: typeof item?.description === 'string' ? item.description : item?.meta?.description ?? null,
    order,
    meta: item?.meta ?? null,
    video: videoMeta ? { url: videoMeta.url, platform: videoMeta.platform } : null,
    legacyImage: type === 'image' ? (item?.thumbnail_url || item?.thumbnail || rawUrl) : null,
    legacyCaption: typeof item?.description === 'string' ? item.description : item?.meta?.caption ?? null,
  };
};

const normalizeLegacyItem = (item: any, index: number): NormalizedGalleryItem | null => {
  const rawUrl = item?.image ?? item?.url ?? item?.media_url ?? '';
  if (!rawUrl || typeof rawUrl !== 'string') {
    return null;
  }

  const fallbackTitle = typeof item?.title === 'string' ? item.title : item?.heading ?? null;
  const fallbackDescription =
    typeof item?.description === 'string'
      ? item.description
      : typeof item?.caption === 'string'
      ? item.caption
      : null;

  return {
    key: String(item?.id ?? item?.meta?.id ?? `legacy-${index}`),
    type: 'image',
    url: rawUrl,
    thumbnail: item?.thumbnail ?? item?.thumb ?? null,
    title: fallbackTitle,
    description: fallbackDescription,
    order: index,
    meta: item?.meta ?? null,
    video: null,
    legacyImage: rawUrl,
    legacyCaption: fallbackDescription,
  };
};

const collectLegacyItems = (gallery: any, fallback?: any): NormalizedGalleryItem[] => {
  const sources: any[][] = [];

  if (Array.isArray(gallery?.items)) {
    const items = gallery.items
      .map((item: any, index: number) => normalizeManagedItem(item, index))
      .filter(Boolean) as NormalizedGalleryItem[];
    if (items.length > 0) {
      return items;
    }
  }

  if (Array.isArray(gallery?.photos)) {
    sources.push(gallery.photos);
  }

  if (Array.isArray(gallery?.images)) {
    sources.push(gallery.images);
  }

  if (Array.isArray(fallback?.items)) {
    sources.push(fallback.items);
  }

  if (Array.isArray(fallback?.photos)) {
    sources.push(fallback.photos);
  }

  if (Array.isArray(fallback?.images)) {
    sources.push(fallback.images);
  }

  const normalized: NormalizedGalleryItem[] = [];
  sources.forEach((collection) => {
    collection.forEach((item, index) => {
      const normalizedItem = normalizeLegacyItem(item, normalized.length + index);
      if (normalizedItem) {
        normalized.push(normalizedItem);
      }
    });
  });

  return normalized;
};

export const normalizeGallerySection = (
  gallery: any,
  fallback?: any
): NormalizedGallerySection => {
  const isManaged = Boolean(gallery?.managed_by_gallery);
  const { heading, subheading } = normalizeHeading(gallery, fallback);

  let items: NormalizedGalleryItem[] = [];

  if (Array.isArray(gallery?.items) && gallery.items.length > 0) {
    items = gallery.items
      .map((item: any, index: number) => normalizeManagedItem(item, index))
      .filter(Boolean) as NormalizedGalleryItem[];

    items.sort((a, b) => {
      if (a.order === b.order) {
        return a.key.localeCompare(b.key);
      }
      return a.order - b.order;
    });
  } else {
    items = collectLegacyItems(gallery, fallback);
  }

  const images = items
    .filter((item) => item.type === 'image' && item.legacyImage)
    .map((item) => ({
      image: item.legacyImage as string,
      caption: item.legacyCaption ?? item.description ?? item.title ?? null,
      title: item.title ?? null,
      meta: item.meta ?? null,
    }));

  const videos = items
    .filter((item) => item.type === 'video' && item.video)
    .map((item) => ({
      type: 'video' as const,
      url: item.video!.url,
      platform: item.video!.platform,
      title: item.title ?? null,
      description: item.description ?? null,
      thumbnail: item.thumbnail ?? null,
      meta: item.meta ?? null,
    }));

  return {
    heading,
    subheading,
    items,
    isManaged,
    images,
    photos: images,
    video_list: videos,
  };
};
