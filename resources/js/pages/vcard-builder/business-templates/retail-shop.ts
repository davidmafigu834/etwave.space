import { socialPlatformsConfig } from '../social-platforms-config';
import languageData from '@/../../resources/lang/language.json';

export const retailShopTemplate = {
  name: 'Trusted Retail Shop',
  sections: [
    {
      key: 'header',
      name: 'Hero Header',
      fields: [
        { name: 'store_logo', type: 'file', label: 'Store Logo' },
        { name: 'store_name', type: 'text', label: 'Store Name' },
        { name: 'tagline', type: 'textarea', label: 'Headline / Promise' },
        { name: 'hero_background', type: 'file', label: 'Hero Background Image' },
        {
          name: 'trust_badges',
          type: 'repeater',
          label: 'Trust Badges',
          fields: [
            { name: 'label', type: 'text', label: 'Badge Label' },
            { name: 'icon', type: 'text', label: 'Icon (emoji or short text)' }
          ]
        },
        { name: 'sales_rep_cta_label', type: 'text', label: 'Sales Rep Button Label' },
        { name: 'sales_rep_cta_url', type: 'url', label: 'Sales Rep Button URL' }
      ],
      required: true
    },
    {
      key: 'about',
      name: 'About Our Shop',
      fields: [
        { name: 'headline', type: 'text', label: 'Section Title' },
        { name: 'intro', type: 'textarea', label: 'Short Introduction' },
        { name: 'story', type: 'textarea', label: 'Our Story' },
        {
          name: 'gallery',
          type: 'repeater',
          label: 'Shop Gallery Images',
          fields: [
            { name: 'image', type: 'file', label: 'Image' },
            { name: 'caption', type: 'text', label: 'Caption' }
          ]
        }
      ],
      required: true
    },
    {
      key: 'store_gallery',
      name: 'Store Gallery',
      fields: [
        {
          name: 'items',
          type: 'repeater',
          label: 'Gallery Items',
          fields: [
            { name: 'image', type: 'file', label: 'Image' },
            { name: 'caption', type: 'text', label: 'Caption' },
            { name: 'description', type: 'textarea', label: 'Short Description' }
          ]
        }
      ],
      required: false
    },
    {
      key: 'staff_spotlight',
      name: 'Who is Serving You Today',
      fields: [
        { name: 'name', type: 'text', label: 'Staff Name' },
        { name: 'role', type: 'text', label: 'Role / Title' },
        { name: 'bio', type: 'textarea', label: 'Short Bio' },
        { name: 'photo', type: 'file', label: 'Photo' },
        {
          name: 'contact',
          type: 'object',
          label: 'Contact CTA',
          fields: [
            { name: 'label', type: 'text', label: 'Button Label' },
            { name: 'url', type: 'url', label: 'Button URL' }
          ]
        }
      ],
      required: false
    },
    {
      key: 'inventory',
      name: 'Products In Shop Today',
      fields: [
        {
          name: 'products',
          type: 'repeater',
          label: 'Products',
          fields: [
            { name: 'name', type: 'text', label: 'Product Name' },
            { name: 'description', type: 'textarea', label: 'Description' },
            { name: 'price', type: 'text', label: 'Price' },
            { name: 'status', type: 'text', label: 'Stock Status' },
            { name: 'image', type: 'file', label: 'Product Image' },
            { name: 'tags', type: 'tags', label: 'Tags' },
            { name: 'cta_label', type: 'text', label: 'Button Label' },
            { name: 'cta_url', type: 'url', label: 'Button URL' }
          ]
        }
      ],
      required: false
    },
    {
      key: 'promotions',
      name: 'Promotions',
      fields: [
        {
          name: 'items',
          type: 'repeater',
          label: 'Promotion Items',
          fields: [
            { name: 'title', type: 'text', label: 'Title' },
            { name: 'description', type: 'textarea', label: 'Description' },
            { name: 'discount', type: 'text', label: 'Discount / Offer' },
            { name: 'image', type: 'file', label: 'Image' },
            { name: 'tagline', type: 'text', label: 'Tagline' },
            { name: 'cta_label', type: 'text', label: 'CTA Label' },
            { name: 'cta_url', type: 'url', label: 'CTA URL' }
          ]
        }
      ],
      required: false
    },
    {
      key: 'customer_promises',
      name: 'Customer Promises',
      fields: [
        {
          name: 'promises',
          type: 'repeater',
          label: 'Promises',
          fields: [
            { name: 'title', type: 'text', label: 'Promise Title' },
            { name: 'description', type: 'textarea', label: 'Promise Description' }
          ]
        }
      ],
      required: false
    },
    {
      key: 'reviews',
      name: 'Reviews & Social Proof',
      fields: [
        {
          name: 'testimonials',
          type: 'repeater',
          label: 'Testimonials',
          fields: [
            { name: 'customer_name', type: 'text', label: 'Customer Name' },
            { name: 'rating', type: 'number', label: 'Rating (1-5)' },
            { name: 'quote', type: 'textarea', label: 'Quote' }
          ]
        }
      ],
      required: false
    },
    {
      key: 'contact',
      name: 'Contact Information',
      fields: [
        { name: 'phone', type: 'tel', label: 'Phone Number' },
        { name: 'email', type: 'email', label: 'Email Address' },
        { name: 'address', type: 'text', label: 'Store Address' },
        { name: 'map_url', type: 'url', label: 'Map URL' }
      ],
      required: true
    },
    {
      key: 'business_hours',
      name: 'Business Hours',
      fields: [
        {
          name: 'hours',
          type: 'repeater',
          label: 'Hours by Day',
          fields: [
            { name: 'day', type: 'select', label: 'Day', options: [
              { value: 'monday', label: 'Monday' },
              { value: 'tuesday', label: 'Tuesday' },
              { value: 'wednesday', label: 'Wednesday' },
              { value: 'thursday', label: 'Thursday' },
              { value: 'friday', label: 'Friday' },
              { value: 'saturday', label: 'Saturday' },
              { value: 'sunday', label: 'Sunday' }
            ]},
            { name: 'open_time', type: 'time', label: 'Open Time' },
            { name: 'close_time', type: 'time', label: 'Close Time' },
            { name: 'is_closed', type: 'checkbox', label: 'Closed' }
          ]
        }
      ],
      required: false
    },
    {
      key: 'social',
      name: 'Social Media',
      fields: [
        {
          name: 'social_links',
          type: 'repeater',
          label: 'Social Links',
          fields: [
            { name: 'platform', type: 'select', label: 'Platform', options: socialPlatformsConfig.map(platform => ({ value: platform.value, label: platform.label })) },
            { name: 'url', type: 'url', label: 'Profile URL' },
            { name: 'username', type: 'text', label: 'Username or Handle' }
          ]
        }
      ],
      required: false
    },
    {
      key: 'language',
      name: 'Language Settings',
      fields: [
        { name: 'template_language', type: 'select', label: 'Template Language', options: languageData.map(lang => {
          const flag = lang.countryCode
            ? String.fromCodePoint(...lang.countryCode.toUpperCase().split('').map((char: string) => 127397 + char.charCodeAt(0)))
            : '';
          return { value: lang.code, label: `${flag} ${lang.name}`.trim() };
        }) }
      ],
      required: false
    }
  ],
  colorPresets: [
    { name: 'Fresh Mint', primary: '#0E9384', secondary: '#2AD3C0', accent: '#F6FFF9', background: '#F8FAFC', text: '#1F2937', cardBg: '#FFFFFF', borderColor: '#D1FAE5' },
    { name: 'Trust Blue', primary: '#1D4ED8', secondary: '#3B82F6', accent: '#E0ECFF', background: '#F9FBFF', text: '#1E293B', cardBg: '#FFFFFF', borderColor: '#C7D2FE' },
    { name: 'Comfort Sand', primary: '#B45309', secondary: '#F59E0B', accent: '#FEF3C7', background: '#FFF8ED', text: '#3F2D20', cardBg: '#FFFFFF', borderColor: '#FCD9B6' }
  ],
  fontOptions: [
    { name: 'Manrope', value: 'Manrope, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,600,700' },
    { name: 'DM Sans', value: 'DM Sans, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,600,700' },
    { name: 'Nunito', value: 'Nunito, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,600,700' },
    { name: 'Inter', value: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,600,700' },
    { name: 'Montserrat', value: 'Montserrat, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,600,700' },
    { name: 'Poppins', value: 'Poppins, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,600,700' },
    { name: 'Work Sans', value: 'Work Sans, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,600,700' }
  ],
  defaultColors: {
    primary: '#1D4ED8',
    secondary: '#3B82F6',
    accent: '#E0ECFF',
    background: '#F9FBFF',
    text: '#1F2937',
    cardBg: '#FFFFFF',
    borderColor: '#CBD5F5',
    buttonText: '#FFFFFF'
  },
  defaultFont: 'Manrope, -apple-system, BlinkMacSystemFont, sans-serif',
  themeStyle: {
    layout: 'retail-trust',
    headerStyle: 'split',
    cardStyle: 'bordered',
    buttonStyle: 'solid',
    iconStyle: 'outlined',
    spacing: 'comfortable',
    shadows: 'subtle'
  },
  defaultData: {
    header: {
      store_logo: '',
      store_name: 'Neighbourhood Goods',
      tagline: 'A family-owned mini-market that guarantees fresh products and honest prices.',
      hero_background: '',
      trust_badges: [
        { label: 'Serving the community since 2012', icon: '🏪' },
        { label: 'Secure mobile payments', icon: '🔒' },
        { label: 'Verified local suppliers', icon: '✅' }
      ],
      sales_rep_cta_label: 'Contact Our Sales Rep',
      sales_rep_cta_url: 'https://wa.me/1234567890'
    },
    about: {
      headline: 'A Store You Can Rely On',
      intro: 'Neighbourhood Goods is a trusted corner shop known for genuine smiles, authentic goods, and swift deliveries in under 30 minutes.',
      story: 'We started as a pop-up grocery stand and grew into a full retail shop because our neighbours believed in us. Our team carefully selects every brand we stock, ensuring freshness, transparency, and fair pricing.',
      gallery: []
    },
    store_gallery: {
      items: [
        {
          image: '/images/templates/retail/storefront.jpg',
          caption: 'Our friendly storefront',
          description: 'A welcoming entrance that showcases seasonal specials and best-sellers.'
        },
        {
          image: '/images/templates/retail/interior-aisles.jpg',
          caption: 'A look inside the shop',
          description: 'Bright aisles with neatly curated shelves featuring local favourites.'
        },
        {
          image: '/images/templates/retail/checkout-team.jpg',
          caption: 'Checkout counter and staff',
          description: 'Friendly staff ready to help you find the right products and check out quickly.'
        }
      ]
    },
    staff_spotlight: {
      name: 'Tandi Mokoena',
      role: 'Customer Care & Sales Lead',
      bio: 'Tandi knows every product on the shelf. She is ready to walk you through new arrivals and reserve daily essentials before you arrive.',
      photo: '',
      contact: {
        label: 'Message Tandi',
        url: 'tel:+11234567890'
      }
    },
    inventory: {
      products: [
        {
          name: 'Artisan Sourdough Bread',
          description: 'Baked this morning by Rise & Shine Bakery, limited to 20 loaves daily.',
          price: '$4.50',
          status: 'In stock • Fresh today',
          image: '',
          tags: ['fresh', 'bakery'],
          cta_label: 'Reserve loaf',
          cta_url: '#order'
        },
        {
          name: 'Locally Roasted Coffee Beans',
          description: 'Medium roast beans sourced from certified farms in Rwanda.',
          price: '$12.00',
          status: 'Limited stock',
          image: '',
          tags: ['coffee', 'local'],
          cta_label: 'Order now',
          cta_url: '#order'
        },
        {
          name: 'Organic Veggie Box',
          description: 'Curated seasonal vegetables from neighbourhood growers.',
          price: '$18.00',
          status: 'Pre-order for next day',
          image: '',
          tags: ['organic', 'produce'],
          cta_label: 'Pre-order',
          cta_url: '#order'
        }
      ]
    },
    promotions: {
      items: [
        {
          title: 'Weekend Breakfast Bundle',
          description: 'Get coffee beans, croissants, and fresh orange juice for two.',
          discount: 'Save 15%',
          image: '',
          tagline: 'Limited to first 30 customers',
          cta_label: 'Claim bundle',
          cta_url: '#order'
        },
        {
          title: 'Neighbour Reward',
          description: 'Bring a new customer and both receive R40 off your shop.',
          discount: 'R40 off',
          image: '',
          tagline: 'Valid through this month',
          cta_label: 'Refer a friend',
          cta_url: '#refer'
        }
      ]
    },
    customer_promises: {
      promises: [
        { title: 'Transparent Pricing', description: 'No hidden costs. What you see online is what you pay in store.' },
        { title: 'Verified Suppliers', description: 'Every product is sourced from partners with proven quality and delivery history.' },
        { title: 'Community-first Service', description: 'We prioritise neighbourhood customers with personal WhatsApp updates on stock.' }
      ]
    },
    reviews: {
      testimonials: [
        { customer_name: 'Lerato N.', rating: 5, quote: 'I trust their produce more than the bigger supermarkets. They always reserve my essentials.' },
        { customer_name: 'Dineo K.', rating: 5, quote: 'Friendly people, fast service, and the WhatsApp ordering is so convenient.' }
      ]
    },
    contact: {
      phone: '+27 82 123 4567',
      email: 'hello@neighbourhoodgoods.co.za',
      address: '12 Market Street, Maboneng, Johannesburg',
      map_url: 'https://maps.google.com/?q=Neighbourhood+Goods'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '08:00', close_time: '18:00', is_closed: false },
        { day: 'tuesday', open_time: '08:00', close_time: '18:00', is_closed: false },
        { day: 'wednesday', open_time: '08:00', close_time: '18:00', is_closed: false },
        { day: 'thursday', open_time: '08:00', close_time: '18:00', is_closed: false },
        { day: 'friday', open_time: '08:00', close_time: '19:00', is_closed: false },
        { day: 'saturday', open_time: '09:00', close_time: '17:00', is_closed: false },
        { day: 'sunday', open_time: '', close_time: '', is_closed: true }
      ]
    },
    social: {
      social_links: [
        { platform: 'instagram', url: 'https://instagram.com/neighbourhoodgoods', username: '@neighbourhoodgoods' },
        { platform: 'facebook', url: 'https://facebook.com/neighbourhoodgoods', username: 'Neighbourhood Goods' }
      ]
    },
    language: {
      template_language: 'en'
    }
  }
};
