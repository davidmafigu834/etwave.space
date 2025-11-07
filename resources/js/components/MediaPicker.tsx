import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import MediaLibraryModal from './MediaLibraryModal';
import { Image as ImageIcon, X } from 'lucide-react';

interface MediaPickerProps {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  multiple?: boolean;
  placeholder?: string;
  showPreview?: boolean;
}

export default function MediaPicker({ 
  label, 
  value = '', 
  onChange, 
  multiple = false,
  placeholder = 'Select image...',
  showPreview = true
}: MediaPickerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getBaseUrl = () => {
    if (window.appSettings?.imageUrl) return window.appSettings.imageUrl;
    const origin = window.location.origin;
    const parts = window.location.pathname.split('/').filter(Boolean);
    const sub = parts.slice(0, 2).join('/'); // include first two segments (e.g., main-file/public)
    return sub ? `${origin}/${sub}` : origin;
  };

  const makeAbsolute = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const b = getBaseUrl();
    if (url.startsWith('/')) return `${b}${url}`;
    return `${b}/${url}`;
  };

  const handleSelect = (selectedUrl: string) => {
    onChange(makeAbsolute(selectedUrl));
  };

  const handleClear = () => {
    onChange('');
  };
  
  // Ensure value is always a string, never null
  const safeValue = value || '';
  
  // Base for preview and paths
  const base = getBaseUrl();
  // Process the image URL for preview
    const getDisplayUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return `${base}${url}`;
    return `${base}/${url}`;
  };
  
  const imageUrls = safeValue ? [getDisplayUrl(safeValue)] : [];

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      
      <div className="flex gap-2">
        <Input
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={multiple}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsModalOpen(true)}
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Browse
        </Button>
        {safeValue && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Preview */}
      {showPreview && imageUrls.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-20 object-cover rounded border"
              />
            </div>
          ))}
        </div>
      )}

      <MediaLibraryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelect}
        multiple={multiple}
      />
    </div>
  );
}