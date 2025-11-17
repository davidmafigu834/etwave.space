import { socialPlatformsConfig } from '../social-platforms-config';
import languageData from '@/../../resources/lang/language.json';

export const ecommerceTemplate = {
  name: 'E-commerce Store',
  description: 'Modern vertical-flow ecommerce template with CRM integration',
  layout: 'vertical-flow', // No grids, everything stacks vertically
  mobileFirst: true,
  sections: [
    {
      key: 'hero',
      name: 'Hero Section',
      type: 'full-width',
      required: true,
      fields: [
        { name: 'title', type: 'text', label: 'Hero Title' },
        { name: 'subtitle', type: 'textarea', label: 'Hero Subtitle' },
        { name: 'background_image', type: 'file', label: 'Background Image' },
        { name: 'background_video', type: 'file', label: 'Background Video (optional)' },
        { name: 'primary_button_text', type: 'text', label: 'Primary Button Text' },
        { name: 'primary_button_link', type: 'text', label: 'Primary Button Link' },
        { name: 'secondary_button_text', type: 'text', label: 'Secondary Button Text' },
        { name: 'secondary_button_link', type: 'text', label: 'Secondary Button Link' },
        { name: 'height', type: 'select', label: 'Section Height', options: [
          { value: 'full-screen', label: 'Full Screen (100vh)' },
          { value: 'large', label: 'Large (80vh)' },
          { value: 'medium', label: 'Medium (60vh)' },
          { value: 'small', label: 'Small (40vh)' }
        ], default: 'full-screen' }
      ],
      responsive: {
        mobile: { height: 'auto', padding: '2rem 1rem' },
        tablet: { height: 'auto', padding: '3rem 2rem' },
        desktop: { height: '100vh', padding: '4rem 2rem' }
      }
    },
    {
      key: 'products',
      name: 'Products Showcase',
      type: 'data-driven',
      dataSource: 'crm.products', // Integrates with CRM
      required: true,
      fields: [
        { name: 'title', type: 'text', label: 'Section Title', default: 'Our Products' },
        { name: 'subtitle', type: 'textarea', label: 'Section Description' },
        { name: 'display_mode', type: 'select', label: 'Display Mode', options: [
          { value: 'featured', label: 'Featured Products Only' },
          { value: 'all', label: 'All Active Products' },
          { value: 'category', label: 'Products by Category' }
        ], default: 'featured' },
        { name: 'selected_category', type: 'select', label: 'Category Filter', dependsOn: 'display_mode', showWhen: 'category' },
        { name: 'max_products', type: 'number', label: 'Maximum Products to Show', default: 12, min: 1, max: 50 },
        { name: 'show_filters', type: 'checkbox', label: 'Show Filter Options', default: true },
        { name: 'show_search', type: 'checkbox', label: 'Show Search Bar', default: true },
        { name: 'product_card_style', type: 'select', label: 'Product Card Style', options: [
          { value: 'modern', label: 'Modern Cards' },
          { value: 'minimal', label: 'Minimal Cards' },
          { value: 'classic', label: 'Classic Cards' }
        ], default: 'modern' },
        { name: 'show_price', type: 'checkbox', label: 'Show Prices', default: true },
        { name: 'show_add_to_cart', type: 'checkbox', label: 'Show Add to Cart Button', default: true },
        { name: 'empty_state_title', type: 'text', label: 'Empty State Title', default: 'Coming Soon' },
        { name: 'empty_state_message', type: 'textarea', label: 'Empty State Message', default: 'We\'re working on bringing you amazing products. Check back soon!' }
      ],
      responsive: {
        mobile: { columns: 1, gap: '1rem', padding: '2rem 1rem' },
        tablet: { columns: 1, gap: '1.5rem', padding: '3rem 2rem' },
        desktop: { columns: 1, gap: '2rem', padding: '4rem 2rem' }
      },
      dynamic: true // Shows/hides based on CRM data availability
    },
    {
      key: 'categories',
      name: 'Shop by Category',
      type: 'data-driven',
      dataSource: 'crm.categories', // Integrates with CRM
      required: false,
      fields: [
        { name: 'title', type: 'text', label: 'Section Title', default: 'Shop by Category' },
        { name: 'subtitle', type: 'textarea', label: 'Section Description' },
        { name: 'display_style', type: 'select', label: 'Display Style', options: [
          { value: 'grid', label: 'Grid Layout' },
          { value: 'horizontal-scroll', label: 'Horizontal Scroll' },
          { value: 'vertical-list', label: 'Vertical List' }
        ], default: 'horizontal-scroll' },
        { name: 'show_product_count', type: 'checkbox', label: 'Show Product Count', default: true },
        { name: 'max_categories', type: 'number', label: 'Maximum Categories to Show', default: 8, min: 1, max: 20 },
        { name: 'empty_state_title', type: 'text', label: 'Empty State Title', default: 'Categories Coming Soon' },
        { name: 'empty_state_message', type: 'textarea', label: 'Empty State Message', default: 'We\'re organizing our products into categories. Stay tuned!' }
      ],
      responsive: {
        mobile: { columns: 2, gap: '1rem', padding: '2rem 1rem' },
        tablet: { columns: 3, gap: '1.5rem', padding: '3rem 2rem' },
        desktop: { columns: 4, gap: '2rem', padding: '4rem 2rem' }
      },
      dynamic: true
    },
    {
      key: 'about',
      name: 'About the Store',
      type: 'content',
      required: true,
      fields: [
        { name: 'title', type: 'text', label: 'Section Title', default: 'About Our Store' },
        { name: 'subtitle', type: 'textarea', label: 'Section Subtitle' },
        { name: 'content', type: 'textarea', label: 'About Content' },
        { name: 'image', type: 'file', label: 'About Image' },
        { name: 'image_position', type: 'select', label: 'Image Position', options: [
          { value: 'left', label: 'Left of Text' },
          { value: 'right', label: 'Right of Text' },
          { value: 'top', label: 'Above Text' },
          { value: 'background', label: 'Background Image' }
        ], default: 'right' },
        { name: 'show_mission', type: 'checkbox', label: 'Show Mission Statement', default: true },
        { name: 'mission_title', type: 'text', label: 'Mission Title', default: 'Our Mission' },
        { name: 'mission_text', type: 'textarea', label: 'Mission Statement' },
        { name: 'show_values', type: 'checkbox', label: 'Show Core Values', default: true },
        { name: 'values_title', type: 'text', label: 'Values Title', default: 'Our Values' },
        { name: 'values', type: 'repeater', label: 'Core Values', fields: [
          { name: 'title', type: 'text', label: 'Value Title' },
          { name: 'description', type: 'textarea', label: 'Value Description' },
          { name: 'icon', type: 'text', label: 'Icon Class (optional)' }
        ]}
      ],
      responsive: {
        mobile: { layout: 'stacked', padding: '2rem 1rem' },
        tablet: { layout: 'side-by-side', padding: '3rem 2rem' },
        desktop: { layout: 'side-by-side', padding: '4rem 2rem' }
      }
    },
    {
      key: 'testimonials',
      name: 'Customer Reviews',
      type: 'data-driven',
      dataSource: 'crm.testimonials', // Could be from orders/reviews system
      required: false,
      fields: [
        { name: 'title', type: 'text', label: 'Section Title', default: 'What Our Customers Say' },
        { name: 'subtitle', type: 'textarea', label: 'Section Description' },
        { name: 'display_style', type: 'select', label: 'Display Style', options: [
          { value: 'carousel', label: 'Carousel/Slider' },
          { value: 'grid', label: 'Grid Layout' },
          { value: 'stacked', label: 'Stacked Cards' }
        ], default: 'carousel' },
        { name: 'max_testimonials', type: 'number', label: 'Maximum Testimonials to Show', default: 6, min: 1, max: 12 },
        { name: 'show_rating', type: 'checkbox', label: 'Show Star Ratings', default: true },
        { name: 'show_product_name', type: 'checkbox', label: 'Show Product Name', default: true },
        { name: 'empty_state_title', type: 'text', label: 'Empty State Title', default: 'Reviews Coming Soon' },
        { name: 'empty_state_message', type: 'textarea', label: 'Empty State Message', default: 'We\'re collecting customer feedback. Check back for reviews!' }
      ],
      responsive: {
        mobile: { columns: 1, padding: '2rem 1rem' },
        tablet: { columns: 2, padding: '3rem 2rem' },
        desktop: { columns: 3, padding: '4rem 2rem' }
      },
      dynamic: true
    },
    {
      key: 'contact',
      name: 'Contact & Support',
      type: 'contact',
      required: true,
      fields: [
        { name: 'title', type: 'text', label: 'Section Title', default: 'Get in Touch' },
        { name: 'subtitle', type: 'textarea', label: 'Section Description' },
        { name: 'show_contact_form', type: 'checkbox', label: 'Show Contact Form', default: true },
        { name: 'contact_form_title', type: 'text', label: 'Form Title', default: 'Send us a Message' },
        { name: 'show_store_info', type: 'checkbox', label: 'Show Store Information', default: true },
        { name: 'store_info_title', type: 'text', label: 'Store Info Title', default: 'Store Information' },
        { name: 'email', type: 'email', label: 'Email Address' },
        { name: 'phone', type: 'tel', label: 'Phone Number' },
        { name: 'address', type: 'textarea', label: 'Store Address' },
        { name: 'business_hours_title', type: 'text', label: 'Business Hours Title', default: 'Business Hours' },
        { name: 'business_hours', type: 'textarea', label: 'Business Hours' },
        { name: 'show_map', type: 'checkbox', label: 'Show Map', default: true },
        { name: 'map_embed', type: 'textarea', label: 'Map Embed Code' },
        { name: 'show_social_links', type: 'checkbox', label: 'Show Social Links', default: true }
      ],
      responsive: {
        mobile: { layout: 'stacked', padding: '2rem 1rem' },
        tablet: { layout: 'side-by-side', padding: '3rem 2rem' },
        desktop: { layout: 'side-by-side', padding: '4rem 2rem' }
      }
    },
    {
      key: 'footer',
      name: 'Footer',
      type: 'footer',
      required: true,
      fields: [
        { name: 'show_footer', type: 'checkbox', label: 'Show Footer', default: true },
        { name: 'footer_text', type: 'textarea', label: 'Footer Text' },
        { name: 'copyright_text', type: 'text', label: 'Copyright Text' },
        { name: 'show_social_links', type: 'checkbox', label: 'Show Social Links', default: true },
        { name: 'show_newsletter', type: 'checkbox', label: 'Show Newsletter Signup', default: true },
        { name: 'newsletter_title', type: 'text', label: 'Newsletter Title', default: 'Stay Updated' },
        { name: 'newsletter_description', type: 'textarea', label: 'Newsletter Description' },
        { name: 'show_quick_links', type: 'checkbox', label: 'Show Quick Links', default: true },
        { name: 'quick_links_title', type: 'text', label: 'Quick Links Title', default: 'Quick Links' },
        { name: 'quick_links', type: 'repeater', label: 'Quick Links', fields: [
          { name: 'text', type: 'text', label: 'Link Text' },
          { name: 'url', type: 'url', label: 'Link URL' }
        ]}
      ],
      responsive: {
        mobile: { padding: '2rem 1rem' },
        tablet: { padding: '3rem 2rem' },
        desktop: { padding: '4rem 2rem' }
      }
    }
  ],
  colorPresets: [
    { name: 'Modern Blue', primary: '#4A6CF7', secondary: '#6E82FE', accent: '#EEF1FF', background: '#FFFFFF', text: '#333333' },
    { name: 'Shopping Green', primary: '#10B981', secondary: '#34D399', accent: '#D1FAE5', background: '#FFFFFF', text: '#333333' },
    { name: 'Luxury Purple', primary: '#8B5CF6', secondary: '#A78BFA', accent: '#EDE9FE', background: '#FFFFFF', text: '#333333' },
    { name: 'Vibrant Orange', primary: '#F59E0B', secondary: '#FBBF24', accent: '#FEF3C7', background: '#FFFFFF', text: '#333333' },
    { name: 'Classic Black', primary: '#1F2937', secondary: '#374151', accent: '#F3F4F6', background: '#FFFFFF', text: '#333333' },
    { name: 'Rose Gold', primary: '#EC4899', secondary: '#F472B6', accent: '#FCE7F3', background: '#FFFFFF', text: '#333333' },
    { name: 'Teal Fresh', primary: '#0D9488', secondary: '#14B8A6', accent: '#CCFBF1', background: '#FFFFFF', text: '#333333' },
    { name: 'Coral Bright', primary: '#EF4444', secondary: '#F87171', accent: '#FEE2E2', background: '#FFFFFF', text: '#333333' }
  ],
  fontOptions: [
    { name: 'Inter', value: 'Inter, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Poppins', value: 'Poppins, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Roboto', value: 'Roboto, sans-serif', weight: '300,400,500,700' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Open Sans', value: 'Open Sans, sans-serif', weight: '300,400,600,700' },
    { name: 'Playfair Display', value: 'Playfair Display, serif', weight: '400,500,600,700' },
    { name: 'Lato', value: 'Lato, sans-serif', weight: '300,400,700,900' }
  ],
  defaultColors: {
    primary: '#4A6CF7',
    secondary: '#6E82FE',
    accent: '#EEF1FF',
    background: '#FFFFFF',
    text: '#333333',
    cardBg: '#F9F9F9',
    borderColor: '#EEEEEE',
    buttonText: '#FFFFFF',
    saleColor: '#E53935',
    starColor: '#FFC107',
    successColor: '#10B981',
    errorColor: '#EF4444',
    warningColor: '#F59E0B',
    mutedText: '#6B7280'
  },
  defaultFont: 'Inter, sans-serif',
  themeStyle: {
    layout: 'vertical-flow',
    headerStyle: 'sticky-modern',
    cardStyle: 'shadow-rounded',
    buttonStyle: 'filled-rounded',
    iconStyle: 'line',
    spacing: 'generous',
    borderRadius: 'medium',
    shadowStyle: 'soft'
  },
  navigation: {
    type: 'sticky-scroll',
    mobileMenu: 'slide-out',
    showCart: true,
    showSearch: true,
    showUserAccount: false,
    sections: [
      { name: 'Home', anchor: '#hero', icon: 'home' },
      { name: 'Products', anchor: '#products', icon: 'shopping-bag' },
      { name: 'About', anchor: '#about', icon: 'info' },
      { name: 'Contact', anchor: '#contact', icon: 'mail' }
    ]
  },
  defaultData: {
    hero: {
      title: 'Welcome to Our Store',
      subtitle: 'Discover unique products curated just for you. Quality, style, and sustainability in every item.',
      background_image: '',
      background_video: '',
      primary_button_text: 'Shop Now',
      primary_button_link: '#products',
      secondary_button_text: 'Learn More',
      secondary_button_link: '#about',
      height: 'full-screen'
    },
    products: {
      title: 'Our Products',
      subtitle: 'Explore our carefully curated collection of quality products',
      display_mode: 'featured',
      selected_category: '',
      max_products: 12,
      show_filters: true,
      show_search: true,
      product_card_style: 'modern',
      show_price: true,
      show_add_to_cart: true,
      empty_state_title: 'Coming Soon',
      empty_state_message: 'We\'re working on bringing you amazing products. Check back soon!'
    },
    categories: {
      title: 'Shop by Category',
      subtitle: 'Find exactly what you need with our organized product categories',
      display_style: 'horizontal-scroll',
      show_product_count: true,
      max_categories: 8,
      empty_state_title: 'Categories Coming Soon',
      empty_state_message: 'We\'re organizing our products into categories. Stay tuned!'
    },
    about: {
      title: 'About Our Store',
      subtitle: 'Crafting quality products with care and passion',
      content: 'We believe in creating products that not only look beautiful but also serve a purpose. Every item in our store is carefully selected or crafted with attention to detail, sustainability, and customer satisfaction.',
      image: '',
      image_position: 'right',
      show_mission: true,
      mission_title: 'Our Mission',
      mission_text: 'To provide exceptional products that enhance your daily life while maintaining our commitment to sustainability and ethical practices.',
      show_values: true,
      values_title: 'Our Values',
      values: [
        {
          title: 'Quality',
          description: 'We source only the finest materials and work with skilled artisans to ensure every product meets our high standards.',
          icon: 'star'
        },
        {
          title: 'Sustainability',
          description: 'Our products are designed to last, reducing waste and our environmental impact.',
          icon: 'leaf'
        },
        {
          title: 'Ethical Practices',
          description: 'We partner with manufacturers who treat their workers fairly and maintain safe working conditions.',
          icon: 'heart'
        }
      ]
    },
    testimonials: {
      title: 'What Our Customers Say',
      subtitle: 'Don\'t just take our word for it - hear from our satisfied customers',
      display_style: 'carousel',
      max_testimonials: 6,
      show_rating: true,
      show_product_name: true,
      empty_state_title: 'Reviews Coming Soon',
      empty_state_message: 'We\'re collecting customer feedback. Check back for reviews!'
    },
    contact: {
      title: 'Get in Touch',
      subtitle: 'Have questions? Our team is here to help you find exactly what you need.',
      show_contact_form: true,
      contact_form_title: 'Send us a Message',
      show_store_info: true,
      store_info_title: 'Store Information',
      email: 'hello@yourstore.com',
      phone: '(555) 123-4567',
      address: '123 Main Street\nSuite 100\nYour City, ST 12345',
      business_hours_title: 'Business Hours',
      business_hours: 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed',
      show_map: true,
      map_embed: '',
      show_social_links: true
    },
    footer: {
      show_footer: true,
      footer_text: 'Thank you for choosing our store. We\'re committed to providing you with the best products and service.',
      copyright_text: `© ${new Date().getFullYear()} Your Store Name. All rights reserved.`,
      show_social_links: true,
      show_newsletter: true,
      newsletter_title: 'Stay Updated',
      newsletter_description: 'Subscribe to our newsletter for the latest updates and exclusive offers.',
      show_quick_links: true,
      quick_links_title: 'Quick Links',
      quick_links: [
        { text: 'About Us', url: '#about' },
        { text: 'Contact', url: '#contact' },
        { text: 'Shipping Info', url: '#' },
        { text: 'Return Policy', url: '#' },
        { text: 'Privacy Policy', url: '#' },
        { text: 'Terms of Service', url: '#' }
      ]
    }
  },
  // Data integration configuration
  dataIntegration: {
    crm: {
      products: {
        endpoint: '/api/business/{business}/products',
        filters: ['active', 'featured', 'category'],
        includes: ['category', 'media'],
        pagination: { default: 12, max: 50 }
      },
      categories: {
        endpoint: '/api/business/{business}/categories',
        filters: ['active', 'has_products'],
        includes: ['media', 'products_count'],
        hierarchy: true
      },
      testimonials: {
        endpoint: '/api/business/{business}/reviews',
        filters: ['published', 'featured'],
        fallback: 'static'
      }
    }
  },
  // Feature flags for future enhancements
  features: {
    shopping_cart: true,
    product_filters: true,
    search_functionality: true,
    wishlist: false,
    product_comparison: false,
    multi_currency: false,
    inventory_tracking: true,
    abandoned_cart_recovery: false,
    product_reviews: false,
    loyalty_program: false
  }
};