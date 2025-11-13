import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import MediaPicker from '@/components/MediaPicker';
import { 
  DragDropContext, 
  Droppable, 
  Draggable,
  DropResult 
} from '@hello-pangea/dnd';
import { 
  GripVertical, 
  Eye, 
  EyeOff, 
  Edit,
  Plus,
  Settings,
  Trash2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

type SectionData = Record<string, any>;

interface SectionConfig {
  key: string;
  name: string;
  enabled: boolean;
  order: number;
  fields: any[];
  required: boolean;
}

interface VCardSectionManagerProps {
  sections: any[];
  templateConfig: any;
  onUpdateSection: (sectionKey: string, field: string, value: any) => void;
  onToggleSection: (sectionKey: string, enabled: boolean) => void;
  onReorderSections: (sections: SectionConfig[]) => void;
  allowedSections?: string[] | null;
  isSuperAdmin?: boolean;
  catalogManagerUrl?: string;
}

export default function VCardSectionManager({
  sections,
  templateConfig,
  onUpdateSection,
  onToggleSection,
  onReorderSections,
  catalogManagerUrl
}: VCardSectionManagerProps) {
  const { t } = useTranslation();
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.log('[VCardSectionManager] sections', sections);
      // eslint-disable-next-line no-console
      console.log('[VCardSectionManager] templateConfig.sections', templateConfig.sections);
    }
  }, [sections, templateConfig.sections]);
  // Convert full URL to relative path for storage
  const convertToRelativePath = (url: string): string => {
    if (!url) return url;
    if (!url.startsWith('http')) return url;
    const storageIndex = url.indexOf('/storage/');
    if (storageIndex !== -1) {
      return url.substring(storageIndex);
    }
    return url;
  };
  
  // Convert relative path to full URL for display
  const getDisplayUrl = (path: string): string => {
    if (!path) return path;
    if (path.startsWith('http')) return path;
    if (path.startsWith('/storage/')) {
      // Use Laravel's base URL from window.appSettings or fallback to current origin
      const baseUrl = (window as any).appSettings?.baseUrl || window.location.origin;
      return `${baseUrl}${path}`;
    }
    return path.startsWith('/') ? `${window.appSettings.baseUrl}${path}` : path;
  };
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['header', 'contact']));

  const baseSectionConfigs = useMemo((): SectionConfig[] => {
    const configMap = (templateConfig.sections || {}) as Record<string, SectionData>;

    const configs: SectionConfig[] = sections.map((section: any, index: number) => {
      const configSection = configMap[section.key] || {};
      const rawEnabled = configSection.enabled;
      const enabled = typeof rawEnabled === 'boolean'
        ? rawEnabled
        : rawEnabled === undefined
          ? true
          : rawEnabled === '1' || rawEnabled === 1;

      return {
        key: section.key,
        name: section.name,
        enabled,
        order: typeof configSection.order === 'number' ? configSection.order : index,
        fields: section.fields,
        required: section.required
      };
    });

    const sorted = configs.sort((a, b) => a.order - b.order);

    if (!sorted.some((config) => config.enabled)) {
      return sorted.map((config) => ({ ...config, enabled: true }));
    }

    return sorted;
  }, [sections, templateConfig.sections]);

  const [sectionConfigs, setSectionConfigs] = useState<SectionConfig[]>(baseSectionConfigs);

  React.useEffect(() => {
    setSectionConfigs(baseSectionConfigs);
  }, [baseSectionConfigs]);

  const [activeSections, disabledSections] = useMemo(() => {
    const filtered = sectionConfigs.filter((config) => !['pixels', 'seo'].includes(config.key));
    const enabled = filtered.filter((config) => config.enabled);
    const disabled = filtered.filter((config) => !config.enabled);

    const active = enabled.length > 0 ? enabled : filtered;
    return [active, disabled];
  }, [sectionConfigs]);

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionKey)) {
        newSet.delete(sectionKey);
      } else {
        newSet.add(sectionKey);
      }
      return newSet;
    });
  };

  const handleSectionToggle = (sectionKey: string, enabled: boolean) => {
    setSectionConfigs(prev => 
      prev.map(config => 
        config.key === sectionKey ? { ...config, enabled } : config
      )
    );
    // Immediately call the parent callback
    onToggleSection(sectionKey, enabled);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(sectionConfigs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    setSectionConfigs(updatedItems);
    // Immediately call the parent callback
    onReorderSections(updatedItems);
  };

  const renderField = (sectionKey: string, field: any) => {
    const sectionData = templateConfig.sections?.[sectionKey] as SectionData | undefined;
    const value = sectionData?.[field.name] ?? '';
    
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            placeholder={`Enter ${field.label}`}
            value={value}
            onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
            className="min-h-[80px]"
          />
        );
      case 'tags':
        return (
          <Input
            placeholder={`Enter ${field.label} (comma separated)`}
            value={value}
            onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
          />
        );
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={value || false}
              onCheckedChange={(checked) => onUpdateSection(sectionKey, field.name, checked)}
            />
            <span className="text-sm">{field.label}</span>
          </div>
        );
      case 'select':
        let selectOptions = field.options;
        if (field.options === 'dynamic_categories') {
          const categories = templateConfig.sections?.[sectionKey]?.categories || [];
          selectOptions = categories.map((cat: any) => ({ value: cat.value, label: cat.label }));
        }
        return (
          <select
            value={value || ''}
            onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
            className="w-full p-2 border rounded-md bg-background"
          >
            <option value="">Select {field.label}</option>
            {selectOptions?.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'repeater':
        return (
          <div className="space-y-3">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {Array.isArray(value) && (value as SectionData[]).map((item, index) => (
                <Card key={index} className="p-3">
                  <div className="space-y-3">
                    {field.fields?.map((subField: any) => (
                      <div key={subField.name} className={`space-y-1 ${field.type === 'repeater' ? 'col-span-full' : ''}`}>
                        <Label className="text-xs font-medium">{subField.label}</Label>
                        {subField.type === 'textarea' ? (
                        <Textarea
                          value={(item as SectionData)[subField.name] || ''}
                          onChange={(e) => {
                            const newItems: SectionData[] = Array.isArray(value) ? value.map((entry) => ({ ...entry })) : [];
                            if (!newItems[index]) newItems[index] = {};
                            newItems[index][subField.name] = e.target.value;
                            onUpdateSection(sectionKey, field.name, newItems as unknown as SectionData[]);
                          }}
                          className="min-h-[60px]"
                        />
                      ) : subField.type === 'select' ? (
                        <select
                          value={(item as SectionData)[subField.name] || ''}
                          onChange={(e) => {
                            const newItems: SectionData[] = Array.isArray(value) ? [...(value as SectionData[])] : [];
                            if (!newItems[index]) newItems[index] = {};
                            newItems[index][subField.name] = e.target.value;
                            onUpdateSection(sectionKey, field.name, newItems as unknown as SectionData[]);
                          }}
                          className="w-full p-2 border rounded-md bg-background"
                        >
                          <option value="">Select {subField.label}</option>
                          {(() => {
                            let options = subField.options;
                            if (subField.options === 'dynamic_categories') {
                              const categories = sectionData?.categories || [];
                              options = categories.map((cat: SectionData) => ({ value: cat.value, label: cat.label }));
                            }
                            return options?.map((option: any) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ));
                          })()}
                        </select>
                      ) : subField.type === 'checkbox' ? (
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={Boolean((item as SectionData)[subField.name])}
                            onCheckedChange={(checked) => {
                              const newItems: SectionData[] = Array.isArray(value) ? value.map((entry) => ({ ...entry })) : [];
                              if (!newItems[index]) newItems[index] = {};
                              newItems[index][subField.name] = checked;
                              onUpdateSection(sectionKey, field.name, newItems as unknown as SectionData[]);
                            }}
                          />
                          <span className="text-sm">{subField.label}</span>
                        </div>
                      ) : subField.type === 'file' ? (
                        <MediaPicker
                          value={getDisplayUrl((item as SectionData)[subField.name] || '')}
                          onChange={(url) => {
                            const newItems: SectionData[] = Array.isArray(value) ? [...(value as SectionData[])] : [];
                            if (!newItems[index]) newItems[index] = {};
                            newItems[index][subField.name] = convertToRelativePath(url);
                            onUpdateSection(sectionKey, field.name, newItems as unknown as SectionData[]);
                          }}
                          placeholder={`Select ${subField.label}...`}
                          showPreview={true}
                        />
                      ) : (
                        <Input
                          type={subField.type}
                          value={(item as SectionData)[subField.name] || ''}
                          onChange={(e) => {
                            const newItems: SectionData[] = Array.isArray(value) ? [...(value as SectionData[])] : [];
                            if (!newItems[index]) newItems[index] = {};
                            newItems[index][subField.name] = e.target.value;
                            onUpdateSection(sectionKey, field.name, newItems as unknown as SectionData[]);
                          }}
                        />
                      )}
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      onClick={() => {
                        const newItems = Array.isArray(value) ? value.filter((_, i) => i !== index) : [];
                        onUpdateSection(sectionKey, field.name, newItems);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            <Button 
              type="button"
              className="w-full"
              onClick={() => {
                const items: SectionData[] = Array.isArray(value) ? value.map((entry) => ({ ...entry })) : [];
                const newItem: SectionData = {};
                field.fields?.forEach((f: any) => {
                  newItem[f.name] = '';
                });
                onUpdateSection(sectionKey, field.name, [...items, newItem]);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("Add")} {field.label}
            </Button>
          </div>
        );
      case 'object': {
        const objectValue: SectionData = (value && typeof value === 'object' && !Array.isArray(value))
          ? { ...value as SectionData }
          : {};

        const updateObjectField = (fieldName: string, fieldValue: any) => {
          onUpdateSection(sectionKey, field.name, {
            ...objectValue,
            [fieldName]: fieldValue
          });
        };

        return (
          <div className="space-y-3">
            {field.fields?.map((subField: any) => {
              const subValue = objectValue[subField.name] ?? '';

              const renderSubField = () => {
                switch (subField.type) {
                  case 'textarea':
                    return (
                      <Textarea
                        value={subValue}
                        onChange={(e) => updateObjectField(subField.name, e.target.value)}
                        placeholder={`Enter ${subField.label}`}
                        className="min-h-[80px]"
                      />
                    );
                  case 'checkbox':
                    return (
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={Boolean(subValue)}
                          onCheckedChange={(checked) => updateObjectField(subField.name, checked)}
                        />
                        <span className="text-sm">{subField.label}</span>
                      </div>
                    );
                  case 'select':
                    return (
                      <select
                        value={subValue || ''}
                        onChange={(e) => updateObjectField(subField.name, e.target.value)}
                        className="w-full p-2 border rounded-md bg-background"
                      >
                        <option value="">Select {subField.label}</option>
                        {subField.options?.map((option: any) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    );
                  case 'file':
                    return (
                      <MediaPicker
                        value={getDisplayUrl(subValue)}
                        onChange={(url) => updateObjectField(subField.name, convertToRelativePath(url))}
                        placeholder={`Select ${subField.label}...`}
                        showPreview={true}
                      />
                    );
                  default:
                    return (
                      <Input
                        type={subField.type || 'text'}
                        value={subValue || ''}
                        onChange={(e) => updateObjectField(subField.name, e.target.value)}
                        placeholder={`Enter ${subField.label}`}
                      />
                    );
                }
              };

              return (
                <div key={subField.name} className="space-y-1">
                  <Label className="text-xs font-medium">{subField.label}</Label>
                  {renderSubField()}
                  {subField.helpText && (
                    <p className="text-xs text-muted-foreground">{subField.helpText}</p>
                  )}
                </div>
              );
            })}
          </div>
        );
      }
      case 'multiselect':
        return (
          <div className="space-y-2">
            <div className="text-xs text-gray-600 mb-2">{t("Select multiple options (comma-separated values will be stored)")}</div>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {field.options?.map((option: any) => {
                const rawValue = typeof value === 'string' ? value : '';
                const selectedValues = rawValue.split(',').map((v) => v.trim()).filter(Boolean);
                const isSelected = selectedValues.includes(option.value);
                return (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Switch
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        let newValues = selectedValues.filter((v) => v !== option.value);
                        if (checked) {
                          newValues.push(option.value);
                        }
                        onUpdateSection(sectionKey, field.name, newValues.filter((v) => v).join(','));
                      }}
                    />
                    <span className="text-xs">{option.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'file':
        return (
          <MediaPicker
            value={getDisplayUrl(value)}
            onChange={(url) => onUpdateSection(sectionKey, field.name, convertToRelativePath(url))}
            placeholder={`Select ${field.label}...`}
            showPreview={true}
          />
        );
      case 'time':
        return (
          <Input
            type="time"
            value={value}
            onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            placeholder={`Enter ${field.label}`}
            value={value}
            onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
          />
        );
      case 'email':
        return (
          <Input
            type="email"
            placeholder={`Enter ${field.label}`}
            value={value}
            onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
          />
        );
      case 'tel':
        return (
          <Input
            type="tel"
            placeholder={`Enter ${field.label}`}
            value={value}
            onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
          />
        );
      case 'url':
        return (
          <Input
            type="url"
            placeholder={`Enter ${field.label}`}
            value={value}
            onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
          />
        );
      case 'color':
        return (
          <div className="flex space-x-2">
            <Input
              type="color"
              value={value || '#000000'}
              onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
              className="w-16 h-8"
            />
            <Input
              type="text"
              value={value || ''}
              onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
              placeholder="#000000"
            />
          </div>
        );
      case 'range':
        return (
          <div className="space-y-2">
            <input
              type="range"
              min={field.min || 0}
              max={field.max || 100}
              value={value || field.min || 0}
              onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
              className="w-full"
            />
            <div className="text-xs text-gray-500 text-center">{value || field.min || 0}</div>
          </div>
        );
      default:
        return (
          <Input
            type={field.type || 'text'}
            placeholder={`Enter ${field.label}`}
            value={value}
            onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {/* Draggable Active Sections */}
              {activeSections.map((config, index) => {
                const isExpanded = expandedSections.has(config.key);

                return (
                  <Draggable key={config.key} draggableId={config.key} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`border rounded-md ${snapshot.isDragging ? 'shadow-md' : ''}`}
                      >
                        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50">
                          <div className="flex items-center">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab hover:cursor-grabbing p-1 mr-1"
                            >
                              <GripVertical className="h-3 w-3 text-gray-400" />
                            </div>
                            <span className="text-sm font-medium">{config.name}</span>
                            {config.required && (
                              <span className="text-xs text-red-500 ml-1">*</span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0" 
                              onClick={() => toggleSection(config.key)}
                            >
                              <Edit className="h-3 w-3 text-blue-500" />
                            </Button>
                            
                            {!config.required && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0" 
                                onClick={() => handleSectionToggle(config.key, false)}
                              >
                                <Trash2 className="h-3 w-3 text-red-500" />
                              </Button>
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="p-2 space-y-2 border-t">
                            <div className="space-y-3">
                              {config.fields.map((field: any) => (
                                <div key={field.name} className={`space-y-1 ${field.type === 'repeater' ? 'col-span-full' : ''}`}>
                                  <div className="flex items-center">
                                    <Label htmlFor={field.name} className="text-sm font-medium">
                                      {field.label}
                                    </Label>
                                    {field.required && (
                                      <span className="text-xs text-red-500 ml-1">*</span>
                                    )}
                                  </div>
                                  {renderField(config.key, field)}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {disabledSections.length > 0 && (
        <div className="mt-4 space-y-2">
          <Separator />
          <div className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
            {t('Hidden Sections')}
          </div>
          <div className="grid gap-2">
            {disabledSections.map((config) => (
              <div key={config.key} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                <span>{config.name}</span>
                <Button size="sm" variant="outline" onClick={() => handleSectionToggle(config.key, true)}>
                  {t('Add back')}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fixed Sections (pixels, seo) - Always at the end */}
      {sectionConfigs.filter(c => c.enabled && ['pixels', 'seo'].includes(c.key)).map((config) => {
        const isExpanded = expandedSections.has(config.key);

        return (
          <div key={config.key} className="border rounded-md">
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center">
                <div className="p-1 mr-1">
                  <GripVertical className="h-3 w-3 text-gray-300 opacity-50" />
                </div>
                <span className="text-sm font-medium">{config.name}</span>
                {config.required && (
                  <span className="text-xs text-red-500 ml-1">*</span>
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0" 
                  onClick={() => toggleSection(config.key)}
                >
                  <Edit className="h-3 w-3 text-blue-500" />
                </Button>
                
                {!config.required && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0" 
                    onClick={() => handleSectionToggle(config.key, false)}
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </Button>
                )}
              </div>
            </div>

            {isExpanded && (
              <div className="p-2 space-y-2 border-t">
                {['service_highlights', 'packages'].includes(config.key) ? (
                  <div className="rounded-md border border-dashed bg-muted/40 p-3 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">
                      {config.key === 'service_highlights'
                        ? t('Services are now managed in the Services & Packages catalog.')
                        : t('Packages are now managed in the Services & Packages catalog.')}
                    </p>
                    <p className="mt-1">
                      {t('Use the Services & Packages page to add, edit, or delete entries. Updates will sync here automatically.')}
                    </p>
                    {catalogManagerUrl && (
                      <a
                        href={catalogManagerUrl}
                        className="mt-2 inline-flex items-center text-sm font-medium text-primary hover:underline"
                      >
                        {t('Open Services & Packages')}
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {config.fields.map((field: any) => (
                      <div key={field.name} className={`space-y-1 ${field.type === 'repeater' ? 'col-span-full' : ''}`}>
                        <div className="flex items-center">
                          <Label htmlFor={field.name} className="text-sm font-medium">
                            {field.label}
                          </Label>
                          {field.required && (
                            <span className="text-xs text-red-500 ml-1">*</span>
                          )}
                        </div>
                        {renderField(config.key, field)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Disabled Sections */}
      {sectionConfigs.filter(c => !c.enabled).length > 0 && (
        <div className="mt-3">
          <div className="flex items-center mb-1">
            <Badge variant="outline" className="text-xs py-0 px-1 h-5 mr-2">
              {sectionConfigs.filter(c => !c.enabled).length}
            </Badge>
            <span className="text-sm text-gray-500">{t("Disabled sections")}</span>
          </div>
          <div className="flex flex-wrap gap-1 border-t pt-2">
            {sectionConfigs.filter(c => !c.enabled).map((config) => (
              <Button
                key={config.key}
                variant="outline"
                size="sm"
                className="h-7 text-sm flex items-center gap-1 px-2"
                onClick={() => handleSectionToggle(config.key, true)}
              >
                <Plus className="h-3 w-3" />
                {config.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}