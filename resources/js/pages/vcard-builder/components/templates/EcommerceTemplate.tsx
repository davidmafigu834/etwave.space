import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  ShoppingBag,
  Star,
  ChevronRight,
  Heart,
  Search,
  Filter,
  MapPin,
  Phone,
  Mail,
  Clock,
  Truck,
  Shield,
  Headphones,
  Award,
  Play,
  User,
  Youtube,
  Facebook,
  Instagram,
  Twitter,
  QrCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QRShareModal } from '@/components/QRShareModal';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';

// Types for our CRM data
interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  sale_price?: number;
  has_discount: boolean;
  display_price: number;
  sku: string;
  stock_quantity: number;
  is_featured: boolean;
  short_description?: string;
  description?: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  images: Array<{
    id: number;
    url: string;
    alt_text?: string;
    is_primary: boolean;
  }>;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  product_count: number;
  image?: {
    id: number;
    url: string;
    alt_text?: string;
  };
}

interface TemplateProps {
  data: any;
  template: any;
}

const formatPrice = (value: number | string | undefined | null, fallback = '0.00') => {
  if (value === null || value === undefined) return fallback;
  const numericValue = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(numericValue)) {
    return fallback;
  }
  return numericValue.toFixed(2);
};

function EcommerceTemplate({ data, template }: TemplateProps) {
  const { t } = useTranslation();

  // Template configuration from our enhanced template
  const templateConfig = template?.sections || [];
  const configSections = data?.config_sections || {};
  const colors = configSections.colors || template?.defaultColors || {
    primary: '#4A6CF7',
    secondary: '#6E82FE',
    accent: '#EEF1FF',
    background: '#FFFFFF',
    text: '#333333',
    cardBg: '#F9F9F9',
    borderColor: '#EEEEEE',
    buttonText: '#FFFFFF',
    saleColor: '#E53935',
    starColor: '#FFC107'
  };
  const font = configSections.font || template?.defaultFont || 'Inter, sans-serif';

  const onboardingProfile = data?.onboarding_profile || data?.onboardingProfile;
  const contactSectionData = {
    ...template?.defaultData?.contact,
    ...(configSections.contact || {})
  };

  const resolvedEmail = onboardingProfile?.contact_email?.trim?.()
    ? onboardingProfile.contact_email
    : contactSectionData.email;

  const resolvedPhone = onboardingProfile?.contact_phone?.trim?.()
    ? onboardingProfile.contact_phone
    : contactSectionData.phone;

  const resolvedAddress = (() => {
    if (onboardingProfile) {
      const parts = [
        onboardingProfile.address_line1,
        onboardingProfile.address_line2,
        onboardingProfile.city,
        onboardingProfile.country
      ].filter((value) => typeof value === 'string' && value.trim().length > 0);

      if (parts.length > 0) {
        return parts.join(', ');
      }
    }

    return contactSectionData.address || contactSectionData.location;
  })();

  const rawWhatsAppNumber = contactSectionData.whatsapp?.trim?.() || onboardingProfile?.whatsapp?.trim?.() || '';
  const sanitizedWhatsAppNumber = rawWhatsAppNumber.replace(/\D+/g, '');
  const hasWhatsAppNumber = sanitizedWhatsAppNumber.length > 0;

  // State for CRM data
  const initialProducts = (data.config_sections?.products?.items || []) as Product[];
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(Boolean(data?.id));
  const [crmLoaded, setCrmLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Business ID for API calls
  const businessId = data?.id;

  // Load CRM data on component mount
  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    loadCRMData();
  }, [businessId]);

  const fetchProducts = async (params: Record<string, any>) => {
    const response = await axios.get(`/api/v1/ecommerce-template/business/${businessId}/products`, {
      params,
    });
    return response.data.data.products || [];
  };

  const loadCRMData = async () => {
    try {
      setLoading(true);

      const productsSettings = data.config_sections?.products || template?.defaultData?.products || {};
      const productParams: Record<string, any> = {
        display_mode: productsSettings.display_mode || 'all',
        limit: productsSettings.max_products || 12,
      };

      if (productParams.display_mode === 'category' && productsSettings.selected_category) {
        productParams.category_id = productsSettings.selected_category;
      }

      // Load products with graceful fallback when filtered results are empty
      let crmProducts = await fetchProducts(productParams);

      if (crmProducts.length === 0 && productParams.display_mode !== 'all') {
        crmProducts = await fetchProducts({
          ...productParams,
          display_mode: 'all',
          category_id: undefined,
        });
      }

      setProducts(crmProducts.length > 0 ? crmProducts : initialProducts);

      // Load categories
      const categoriesSettings = data.config_sections?.categories || template?.defaultData?.categories || {};
      const categoriesResponse = await axios.get(`/api/v1/ecommerce-template/business/${businessId}/categories`, {
        params: {
          limit: categoriesSettings.max_categories || 8,
        }
      });
      setCategories(categoriesResponse.data.data.categories || []);
      setCrmLoaded(true);

    } catch (error) {
      console.error('Failed to load CRM data:', error);
      // Fallback to empty arrays
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || product.category?.id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Template section configurations
  const heroConfig = templateConfig.find((s: any) => s.key === 'hero');
  const productsConfig = templateConfig.find((s: any) => s.key === 'products');
  const categoriesConfig = templateConfig.find((s: any) => s.key === 'categories');
  const aboutConfig = templateConfig.find((s: any) => s.key === 'about');
  const testimonialsConfig = templateConfig.find((s: any) => s.key === 'testimonials');
  const contactConfig = templateConfig.find((s: any) => s.key === 'contact');
  const footerConfig = templateConfig.find((s: any) => s.key === 'footer');

  // Render functions for each section

  const getWhatsAppLinkForProduct = (product: Product) => {
    if (!hasWhatsAppNumber) return null;
    const priceValue = product.display_price ?? product.price;
    const message = encodeURIComponent(
      `Hi ${data?.name || 'there'}! I'm interested in "${product.name}"${product.sku ? ` (SKU ${product.sku})` : ''}. Price: $${formatPrice(priceValue)}. Please let me know how to order.`
    );
    return `https://wa.me/${sanitizedWhatsAppNumber}?text=${message}`;
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setSelectedImageIndex(0);
    setProductModalOpen(true);
  };

  const closeProductModal = () => {
    setProductModalOpen(false);
    setSelectedProduct(null);
    setSelectedImageIndex(0);
  };

  const renderHeroSection = () => {
    const heroData = data.config_sections?.hero || template?.defaultData?.hero || {};
    const shouldRenderHero = heroConfig || Object.keys(heroData).length > 0;
    if (!shouldRenderHero) return null;

    return (
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundColor: heroData.background_image ? 'transparent' : colors.primary,
          fontFamily: font
        }}
      >
        {/* Background Image/Video */}
        {heroData.background_image && (
          <div className="absolute inset-0">
            <img
              src={heroData.background_image}
              alt="Hero background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
            {heroData.title}
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-white drop-shadow-md max-w-2xl mx-auto">
            {heroData.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 py-3"
              style={{
                backgroundColor: colors.secondary,
                color: colors.buttonText,
                fontFamily: font
              }}
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {heroData.primary_button_text}
              <ChevronRight className="ml-2" size={20} />
            </Button>

            {heroData.secondary_button_text && (
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 border-2"
                style={{
                  borderColor: colors.text,
                  color: colors.text,
                  fontFamily: font
                }}
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {heroData.secondary_button_text}
              </Button>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  };

  const renderNavigation = () => {
    return null; // Navigation removed - this is a single-page vCard template
  };

  const renderProductsSection = () => {
    const productsData = data.config_sections?.products || template?.defaultData?.products || {};
    const shouldRenderProducts = productsConfig || Object.keys(productsData).length > 0;
    if (!shouldRenderProducts) return null;

    return (
      <section
        id="products"
        className="py-16 px-6"
        style={{ backgroundColor: colors.background, fontFamily: font }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text }}>
              {productsData.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {productsData.subtitle}
            </p>
          </div>

          {/* Search and Filters */}
          {(productsData.show_search || productsData.show_filters) && (
            <div className="mb-8 space-y-4">
              {productsData.show_search && (
                <div className="relative max-w-md mx-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      borderColor: colors.borderColor,
                      fontFamily: font
                    }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}

              {productsData.show_filters && categories.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === null ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={{
                      backgroundColor: selectedCategory === null ? colors.primary : undefined,
                      color: selectedCategory === null ? colors.buttonText : undefined,
                      fontFamily: font
                    }}
                    onClick={() => setSelectedCategory(null)}
                  >
                    All Products
                  </button>
                  {categories.slice(0, 5).map((category) => (
                    <button
                      key={category.id}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      style={{
                        backgroundColor: selectedCategory === category.id ? colors.primary : undefined,
                        color: selectedCategory === category.id ? colors.buttonText : undefined,
                        fontFamily: font
                      }}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name} ({category.product_count})
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Products Grid */}
          {loading && products.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: colors.primary }}></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {productsData.empty_state_title || 'No Products Found'}
              </h3>
              <p className="text-gray-600">
                {productsData.empty_state_message || 'Check back later for new products.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredProducts.map((product) => {
                const isOutOfStock = product.stock_quantity <= 0;
                const productImage = product.images[0];

                return (
                  <div
                    key={product.id}
                    className="rounded-2xl border bg-white shadow-sm hover:shadow-lg transition cursor-pointer"
                    style={{ borderColor: colors.borderColor }}
                    onClick={() => openProductModal(product)}
                  >
                    <div className="relative overflow-hidden rounded-2xl rounded-b-none aspect-[4/3]"
                         style={{ backgroundColor: colors.cardBg || '#f3f4f6' }}>
                      {productImage ? (
                        <img
                          src={productImage.url}
                          alt={productImage.alt_text || product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag size={32} className="text-gray-400" />
                        </div>
                      )}

                      {product.is_featured && (
                        <span
                          className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: colors.primary, color: colors.buttonText }}
                        >
                          Featured
                        </span>
                      )}

                      {isOutOfStock && (
                        <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-gray-900 text-white">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold" style={{ color: colors.text }}>
                            {product.name}
                          </h3>
                          {product.category && (
                            <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                              {product.category.name}
                            </span>
                          )}
                        </div>
                        {product.sku && (
                          <span className="text-xs text-gray-500">SKU: {product.sku}</span>
                        )}
                      </div>

                      {product.short_description && (
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {product.short_description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-baseline gap-2">
                          {product.has_discount ? (
                            <>
                              <span className="text-2xl font-semibold" style={{ color: colors.saleColor }}>
                                ${formatPrice(product.display_price)}
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                ${formatPrice(product.price)}
                              </span>
                            </>
                          ) : (
                            <span className="text-2xl font-semibold" style={{ color: colors.text }}>
                              ${formatPrice(product.price)}
                            </span>
                          )}
                        </div>

                        <span className="text-xs tracking-wide uppercase text-gray-500">
                          {isOutOfStock ? 'Currently unavailable' : `${product.stock_quantity} in stock`}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            openProductModal(product);
                          }}
                          style={{
                            backgroundColor: colors.primary,
                            color: colors.buttonText,
                            fontFamily: font
                          }}
                        >
                          View Details
                        </Button>

                        {productsData.show_add_to_cart && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => e.stopPropagation()}
                            className="w-12 h-10"
                          >
                            <Heart size={16} />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderCategoriesSection = () => {
    if (!categoriesConfig || categories.length === 0) return null;

    const categoriesData = data.config_sections?.categories || template?.defaultData?.categories || {};

    return (
      <section
        id="categories"
        className="py-16 px-6"
        style={{ backgroundColor: colors.accent, fontFamily: font }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text }}>
              {categoriesData.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {categoriesData.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            {categories.map((category) => (
              <button
                type="button"
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="group rounded-3xl overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-transform hover:-translate-y-1 w-full"
                style={{ borderColor: colors.borderColor }}
              >
                <div className="relative h-56 sm:h-64 lg:h-72">
                  {category.image ? (
                    <img
                      src={category.image.url}
                      alt={category.image.alt_text || category.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: `linear-gradient(45deg, ${colors.primary}22, ${colors.secondary || colors.primary}22)` }}
                    >
                      <ShoppingBag size={40} style={{ color: colors.primary }} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <p className="text-sm uppercase tracking-wide opacity-90">{categoriesData.title || 'Category'}</p>
                    <h3 className="text-2xl font-semibold mt-1">{category.name}</h3>

                    <div className="flex items-center justify-between text-xs mt-3">
                      {categoriesData.show_product_count && (
                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                          {category.product_count} products
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-white/90 text-sm">
                        Shop
                        <ChevronRight size={16} />
                      </span>
                    </div>
                  </div>
                </div>

                {category.description && (
                  <div className="px-5 py-4 bg-white" style={{ color: colors.text }}>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderAboutSection = () => {
    if (!aboutConfig) return null;

    const aboutData = data.config_sections?.about || template?.defaultData?.about || {};

    return (
      <section
        id="about"
        className="py-16 px-6"
        style={{ backgroundColor: colors.background, fontFamily: font }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text }}>
              {aboutData.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {aboutData.subtitle}
            </p>
          </div>

          {(() => {
            const hasAboutImage = Boolean(aboutData.image);

            const contentBlock = (
              <div className="flex flex-col items-center text-center" style={{ color: colors.text }}>
                {aboutData.content && (
                  <p className="mb-6 max-w-3xl mx-auto">
                    {aboutData.content}
                  </p>
                )}

                {aboutData.show_mission && aboutData.mission_text && (
                  <div className="mb-6 max-w-3xl mx-auto">
                    <h3 className="text-2xl font-bold mb-3" style={{ color: colors.text }}>
                      {aboutData.mission_title}
                    </h3>
                    <p>{aboutData.mission_text}</p>
                  </div>
                )}

                {aboutData.show_values && aboutData.values && aboutData.values.length > 0 && (
                  <div className="w-full max-w-3xl mx-auto">
                    <h3 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>
                      {aboutData.values_title}
                    </h3>
                    <div className="space-y-4">
                      {aboutData.values.map((value: any, index: number) => (
                        <div key={index} className="flex flex-col items-center gap-4">
                          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                            <Award size={24} style={{ color: colors.buttonText }} />
                          </div>
                          <div className="max-w-2xl">
                            <h4 className="font-semibold mb-1" style={{ color: colors.text }}>
                              {value.title}
                            </h4>
                            <p className="text-gray-600">{value.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );

            if (!hasAboutImage) {
              return (
                <div className="flex justify-center">
                  <div className="w-full max-w-4xl px-4">
                    {contentBlock}
                  </div>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {contentBlock}
                <div className="lg:order-first">
                  <img
                    src={aboutData.image}
                    alt="About us"
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
              </div>
            );
          })()}
          
        </div>
      </section>
    );
  };

  const renderContactSection = () => {
    if (!contactConfig) return null;

    const contactData = contactSectionData;

    return (
      <section
        id="contact"
        className="py-16 px-6"
        style={{ backgroundColor: colors.accent, fontFamily: font }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text }}>
              {contactData.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {contactData.subtitle}
            </p>
          </div>

          <div className="flex flex-col gap-12">
            {/* Contact Form */}
            {contactData.show_contact_form && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h3 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>
                  {contactData.contact_form_title}
                </h3>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                        First Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                        style={{ borderColor: colors.borderColor }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                        style={{ borderColor: colors.borderColor }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                      style={{ borderColor: colors.borderColor }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                      Message
                    </label>
                    <textarea
                      rows={5}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                      style={{ borderColor: colors.borderColor }}
                    ></textarea>
                  </div>

                  <Button
                    className="w-full py-3"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.buttonText,
                      fontFamily: font
                    }}
                  >
                    Send Message
                  </Button>
                </form>
              </div>
            )}

            {/* Store Information */}
            {contactData.show_store_info && (
              <div className="space-y-8 text-center">
                <div>
                  <h3 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>
                    {contactData.store_info_title}
                  </h3>

                  <div className="space-y-4">
                    {resolvedEmail && (
                      <div className="flex items-center justify-center gap-3">
                        <Mail size={20} style={{ color: colors.primary }} />
                        <span style={{ color: colors.text }}>{resolvedEmail}</span>
                      </div>
                    )}

                    {resolvedPhone && (
                      <div className="flex items-center justify-center gap-3">
                        <Phone size={20} style={{ color: colors.primary }} />
                        <span style={{ color: colors.text }}>{resolvedPhone}</span>
                      </div>
                    )}

                    {resolvedAddress && (
                      <div className="flex items-start justify-center gap-3">
                        <MapPin size={20} style={{ color: colors.primary }} className="mt-1" />
                        <span style={{ color: colors.text }} className="text-center">{resolvedAddress}</span>
                      </div>
                    )}
                  </div>
                </div>

                {contactData.business_hours && (
                  <div>
                    <h4 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2" style={{ color: colors.text }}>
                      <Clock size={20} style={{ color: colors.primary }} />
                      {contactData.business_hours_title}
                    </h4>
                    <div className="text-gray-600 whitespace-pre-line text-center">
                      {contactData.business_hours}
                    </div>
                  </div>
                )}

                {contactData.show_social_links && (
                  <div>
                    <h4 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
                      Follow Us
                    </h4>
                    <div className="flex justify-center gap-4">
                      <Facebook size={24} style={{ color: colors.primary }} className="cursor-pointer" />
                      <Instagram size={24} style={{ color: colors.primary }} className="cursor-pointer" />
                      <Twitter size={24} style={{ color: colors.primary }} className="cursor-pointer" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  };

  const renderFooterSection = () => {
    if (!footerConfig) return null;

    const footerData = data.config_sections?.footer || template?.defaultData?.footer || {};

    return (
      <footer
        className="py-12 px-6 border-t"
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.borderColor,
          fontFamily: font
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <ShoppingBag size={32} style={{ color: colors.primary }} className="mr-3" />
              <span className="text-2xl font-bold" style={{ color: colors.text }}>
                {data?.name || 'Store'}
              </span>
            </div>

            {footerData.footer_text && (
              <p className="text-gray-600 mb-4 text-center">
                {footerData.footer_text}
              </p>
            )}

            {footerData.show_social_links && (
              <div className="flex justify-center gap-4">
                <Facebook size={20} style={{ color: colors.primary }} className="cursor-pointer" />
                <Instagram size={20} style={{ color: colors.primary }} className="cursor-pointer" />
                <Twitter size={20} style={{ color: colors.primary }} className="cursor-pointer" />
              </div>
            )}
          </div>

          {/* Bottom */}
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center"
               style={{ borderColor: colors.borderColor }}>
            <p className="text-gray-600 text-sm">
              {footerData.copyright_text}
            </p>

            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowQrModal(true)}
                style={{
                  borderColor: colors.primary,
                  color: colors.primary
                }}
              >
                <QrCode size={16} className="mr-2" />
                Share
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  // VCF download logic
                  const vcfData = {
                    name: data?.name || 'Store',
                    email: data?.email || '',
                    phone: data?.phone || '',
                    website: window.location.href
                  };
                  // Implement VCF download
                }}
                style={{
                  backgroundColor: colors.primary,
                  color: colors.buttonText
                }}
              >
                <User size={16} className="mr-2" />
                Save Contact
              </Button>
            </div>
          </div>
        </div>

        {/* QR Modal */}
        <QRShareModal
          isOpen={showQrModal}
          onClose={() => setShowQrModal(false)}
          url={typeof window !== 'undefined' ? window.location.href : ''}
          colors={colors}
          font={font}
          socialLinks={[]}
        />
      </footer>
    );
  };

  const renderProductDetailModal = () => (
    <Dialog
      open={productModalOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeProductModal();
        } else {
          setProductModalOpen(open);
        }
      }}
    >
      <DialogContent className="max-w-2xl w-full md:max-w-3xl p-0 overflow-hidden">
        {selectedProduct ? (
          <div style={{ fontFamily: font }}>
            <div className="relative bg-gray-100" style={{ backgroundColor: colors.cardBg }}>
              {(() => {
                const images = selectedProduct.images || [];
                const hasImages = images.length > 0;
                const safeIndex = hasImages
                  ? Math.min(selectedImageIndex, images.length - 1)
                  : 0;
                const currentImage = hasImages ? images[safeIndex] : null;

                if (currentImage) {
                  return (
                    <img
                      src={currentImage.url}
                      alt={currentImage.alt_text || selectedProduct.name}
                      className="w-full h-72 object-cover"
                    />
                  );
                }

                return (
                  <div className="w-full h-72 flex items-center justify-center">
                    <ShoppingBag size={48} className="text-gray-400" />
                  </div>
                );
              })()}

              {selectedProduct.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-white/70 backdrop-blur rounded-full px-3 py-1">
                  {selectedProduct.images.slice(0, 4).map((image, index) => (
                    <span
                      key={image.id}
                      className={`w-2 h-2 rounded-full ${index === selectedImageIndex ? '' : 'opacity-60'}`}
                      style={{ backgroundColor: colors.primary }}
                    />
                  ))}
                </div>
              )}
            </div>

            {selectedProduct.images.length > 1 && (
              <div className="px-4 pt-3 pb-4 bg-white border-b border-gray-100">
                <div className="flex gap-2 overflow-x-auto">
                  {selectedProduct.images.map((image, index) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative flex-shrink-0 rounded-md overflow-hidden border ${
                        index === selectedImageIndex ? 'ring-2 ring-offset-2 ring-blue-500' : 'border-gray-200'
                      }`}
                      style={{ width: 72, height: 72 }}
                    >
                      <img
                        src={image.url}
                        alt={image.alt_text || selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6 space-y-4">
              <DialogHeader className="space-y-1">
                <DialogTitle className="text-2xl" style={{ color: colors.text }}>
                  {selectedProduct.name}
                </DialogTitle>
                {selectedProduct.category?.name && (
                  <DialogDescription className="text-gray-600">
                    {selectedProduct.category.name}
                  </DialogDescription>
                )}
              </DialogHeader>

              <div className="flex flex-wrap items-center gap-3 text-lg font-semibold">
                {selectedProduct.has_discount ? (
                  <>
                    <span style={{ color: colors.saleColor }}>
                      ${formatPrice(selectedProduct.display_price)}
                    </span>
                    <span className="text-base text-gray-400 line-through">
                      ${formatPrice(selectedProduct.price)}
                    </span>
                  </>
                ) : (
                  <span style={{ color: colors.text }}>
                    ${formatPrice(selectedProduct.price)}
                  </span>
                )}

                {selectedProduct.stock_quantity > 0 ? (
                  <span className="text-sm text-gray-500">
                    {selectedProduct.stock_quantity} in stock
                  </span>
                ) : (
                  <span className="text-sm text-red-500">Out of stock</span>
                )}
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                {selectedProduct.sku && <p>SKU: {selectedProduct.sku}</p>}
                {selectedProduct.short_description && (
                  <p>{selectedProduct.short_description}</p>
                )}
              </div>

              {selectedProduct.description && (
                <div className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
                  {selectedProduct.description}
                </div>
              )}

              <DialogFooter className="pt-2">
                <Button variant="outline" className="w-full sm:w-auto" onClick={closeProductModal}>
                  Close
                </Button>
                <Button
                  className="w-full sm:w-auto"
                  style={{
                    backgroundColor: hasWhatsAppNumber ? colors.primary : '#ccc',
                    color: colors.buttonText
                  }}
                  disabled={!hasWhatsAppNumber}
                  onClick={() => {
                    if (!selectedProduct) return;
                    const link = getWhatsAppLinkForProduct(selectedProduct);
                    if (!link) return;
                    window.open(link, '_blank');
                  }}
                >
                  {hasWhatsAppNumber ? 'Chat on WhatsApp' : 'Add WhatsApp Number to Enable'}
                </Button>
              </DialogFooter>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600 py-6">No product selected.</div>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {renderNavigation()}
      {renderHeroSection()}
      {renderProductsSection()}
      {renderCategoriesSection()}
      {renderAboutSection()}
      {renderContactSection()}
      {renderFooterSection()}
      {renderProductDetailModal()}
    </div>
  );
}

export default EcommerceTemplate;
