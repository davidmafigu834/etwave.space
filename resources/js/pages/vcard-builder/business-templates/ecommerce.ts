import { socialPlatformsConfig } from '../social-platforms-config';
import languageData from '@/../../resources/lang/language.json';

export const ecommerceTemplate = {
  name: 'E-commerce Store',
  sections: [
    {
      key: 'hero',
      name: 'Hero Section',
      fields: [
        { name: 'title', type: 'text', label: 'Hero Title' },
        { name: 'subtitle', type: 'textarea', label: 'Hero Subtitle' },
        { name: 'image', type: 'file', label: 'Hero Background Image' },
        { name: 'button_text', type: 'text', label: 'Primary Button Text' },
        { name: 'button_url', type: 'url', label: 'Primary Button URL' },
        { name: 'secondary_button_text', type: 'text', label: 'Secondary Button Text' },
        { name: 'secondary_button_url', type: 'url', label: 'Secondary Button URL' }
      ],
      required: true
    },
    {
      key: 'about',
      name: 'About the Shop',
      fields: [
        { name: 'title', type: 'text', label: 'Section Title' },
        { name: 'description', type: 'textarea', label: 'About Description' },
        { name: 'image', type: 'file', label: 'About Image' },
        { name: 'mission', type: 'textarea', label: 'Our Mission' },
        { name: 'values', type: 'repeater', label: 'Core Values', fields: [
          { name: 'title', type: 'text', label: 'Value Title' },
          { name: 'description', type: 'textarea', label: 'Value Description' }
        ]}
      ],
      required: true
    },
    {
      key: 'products',
      name: 'Products Section',
      fields: [
        { name: 'title', type: 'text', label: 'Section Title' },
        { name: 'description', type: 'textarea', label: 'Section Description' },
        { name: 'show_featured_only', type: 'checkbox', label: 'Show Featured Products Only' },
        { name: 'show_category_filter', type: 'checkbox', label: 'Show Category Filter' }
      ],
      required: true
    },
    {
      key: 'categories',
      name: 'Shop by Category',
      fields: [
        { name: 'title', type: 'text', label: 'Section Title' },
        { name: 'description', type: 'textarea', label: 'Section Description' },
        {
          name: 'category_list',
          type: 'repeater',
          label: 'Categories',
          fields: [
            { name: 'title', type: 'text', label: 'Category Name' },
            { name: 'description', type: 'textarea', label: 'Category Description' },
            { name: 'image', type: 'file', label: 'Category Image' },
            { name: 'url', type: 'url', label: 'Category URL' }
          ]
        }
      ],
      required: false
    },
    {
      key: 'testimonials',
      name: 'Customer Testimonials',
      fields: [
        { name: 'title', type: 'text', label: 'Section Title' },
        { name: 'description', type: 'textarea', label: 'Section Description' },
        {
          name: 'reviews',
          type: 'repeater',
          label: 'Customer Reviews',
          fields: [
            { name: 'customer_name', type: 'text', label: 'Customer Name' },
            { name: 'review', type: 'textarea', label: 'Review Text' },
            { name: 'rating', type: 'number', label: 'Rating (1-5)' },
            { name: 'product_purchased', type: 'text', label: 'Product Purchased' },
            { name: 'customer_image', type: 'file', label: 'Customer Image' }
          ]
        }
      ],
      required: false
    },
    {
      key: 'contact',
      name: 'Contact Us Widget',
      fields: [
        { name: 'title', type: 'text', label: 'Widget Title' },
        { name: 'description', type: 'textarea', label: 'Widget Description' },
        { name: 'email', type: 'email', label: 'Email Address' },
        { name: 'phone', type: 'tel', label: 'Phone Number' },
        { name: 'address', type: 'text', label: 'Address' },
        { name: 'show_map', type: 'checkbox', label: 'Show Map' },
        { name: 'map_embed', type: 'textarea', label: 'Map Embed Code' }
      ],
      required: true
    },
    {
      key: 'footer',
      name: 'Footer',
      fields: [
        { name: 'show_footer', type: 'checkbox', label: 'Show Footer' },
        { name: 'footer_text', type: 'textarea', label: 'Footer Text' },
        { name: 'copyright_text', type: 'text', label: 'Copyright Text' },
        { name: 'show_social_links', type: 'checkbox', label: 'Show Social Links' },
        { name: 'newsletter_title', type: 'text', label: 'Newsletter Title' },
        { name: 'newsletter_description', type: 'textarea', label: 'Newsletter Description' }
      ],
      required: true
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
    { name: 'Open Sans', value: 'Open Sans, sans-serif', weight: '300,400,600,700' }
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
    starColor: '#FFC107'
  },
  defaultFont: 'Inter, sans-serif',
  themeStyle: {
    layout: 'ecommerce-layout',
    headerStyle: 'modern',
    cardStyle: 'shadow',
    buttonStyle: 'rounded',
    iconStyle: 'simple',
    spacing: 'comfortable'
  },
  defaultData: {
    hero: {
      title: 'Welcome to StyleHub',
      subtitle: 'Discover our curated collection of quality products for your lifestyle',
      image: '',
      button_text: 'Shop Now',
      button_url: '#products',
      secondary_button_text: 'View Categories',
      secondary_button_url: '#categories'
    },
    about: {
      title: 'About Our Shop',
      description: 'StyleHub offers a curated selection of high-quality products for your everyday needs. We focus on sustainable materials, ethical manufacturing, and timeless designs that will last for years to come.',
      image: '',
      mission: 'Our mission is to provide exceptional products that enhance your daily life while maintaining our commitment to sustainability and ethical practices.',
      values: [
        { title: 'Quality', description: 'We source only the finest materials and work with skilled artisans to ensure every product meets our high standards.' },
        { title: 'Sustainability', description: 'Our products are designed to last, reducing waste and our environmental impact.' },
        { title: 'Ethical Practices', description: 'We partner with manufacturers who treat their workers fairly and maintain safe working conditions.' }
      ]
    },
    products: {
      title: 'Featured Products',
      description: 'Explore our most popular items, carefully selected for quality and style.',
      show_featured_only: true,
      show_category_filter: true
    },
    categories: {
      title: 'Shop by Category',
      description: 'Find exactly what you need with our organized product categories.',
      category_list: [
        { title: 'Clothing', description: 'Premium apparel for men and women', image: '', url: '#clothing' },
        { title: 'Accessories', description: 'Stylish accessories to complement your look', image: '', url: '#accessories' },
        { title: 'Home Decor', description: 'Beautiful items to enhance your living space', image: '', url: '#home-decor' },
        { title: 'Beauty', description: 'Natural and effective skincare and beauty products', image: '', url: '#beauty' }
      ]
    },
    testimonials: {
      title: 'What Our Customers Say',
      description: 'Don\'t just take our word for it - hear from our satisfied customers.',
      reviews: [
        { customer_name: 'Emily R.', review: 'The quality of the clothing is exceptional. I have ordered multiple times and have always been impressed with both the products and customer service.', rating: 5, product_purchased: 'Classic White T-Shirt', customer_image: '' },
        { customer_name: 'Michael T.', review: 'Fast shipping and the minimalist watch exceeded my expectations. Will definitely shop here again!', rating: 5, product_purchased: 'Minimalist Watch', customer_image: '' },
        { customer_name: 'Sarah L.', review: 'Love my new ceramic plant pot. It is exactly as described and looks perfect in my living room.', rating: 4, product_purchased: 'Ceramic Plant Pot', customer_image: '' }
      ]
    },
    contact: {
      title: 'Get in Touch',
      description: 'Have questions? Our team is here to help.',
      email: 'hello@stylehub.com',
      phone: '(555) 123-4567',
      address: '123 Fashion Street, Suite 100, New York, NY 10001',
      show_map: false,
      map_embed: ''
    },
    footer: {
      show_footer: true,
      footer_text: 'StyleHub - Quality products for your lifestyle. Committed to sustainability and ethical practices.',
      copyright_text: '© 2025 StyleHub. All rights reserved.',
      show_social_links: true,
      newsletter_title: 'Stay Updated',
      newsletter_description: 'Subscribe to our newsletter for the latest updates and exclusive offers.'
    }
  }
};