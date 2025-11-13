import { socialPlatformsConfig } from '../social-platforms-config';
import languageData from '@/../../resources/lang/language.json';

export const solarInstallationTemplate = {
  name: 'Solar Installation Company',
  sections: [
    {
      key: 'header',
      name: 'Hero Header',
      fields: [
        { name: 'company_name', type: 'text', label: 'Company Name' },
        { name: 'headline', type: 'text', label: 'Headline' },
        { name: 'subheadline', type: 'textarea', label: 'Subheadline' },
        { name: 'profile_image', type: 'file', label: 'Logo' },
        { name: 'hero_background', type: 'file', label: 'Hero Background Image' },
        { name: 'hero_overlay_opacity', type: 'number', label: 'Hero Overlay Opacity (0 - 0.9)', min: 0, max: 0.9, step: 0.05, helpText: 'Controls how dark the overlay is on the hero image.' },
        { name: 'cta_button', type: 'object', label: 'Primary CTA Button', fields: [
          { name: 'label', type: 'text', label: 'Button Label' },
          { name: 'url', type: 'url', label: 'Button URL' }
        ]},
        { name: 'cta_button_display', type: 'text', label: 'Primary CTA Text Override', conditional: { field: 'cta_button', operator: 'exists' }, hidden: true },
        { name: 'secondary_cta', type: 'object', label: 'Secondary CTA Button', fields: [
          { name: 'label', type: 'text', label: 'Button Label' },
          { name: 'url', type: 'url', label: 'Button URL' }
        ]},
        { name: 'secondary_cta_display', type: 'text', label: 'Secondary CTA Text Override', conditional: { field: 'secondary_cta', operator: 'exists' }, hidden: true },
        { name: 'badges', type: 'repeater', label: 'Certification Badges', fields: [
          { name: 'label', type: 'text', label: 'Badge Label' },
          { name: 'icon', type: 'text', label: 'Icon (emoji or text)' }
        ]},
        { name: 'whatsapp_phone_number', type: 'tel', label: 'WhatsApp Number' },
        { name: 'whatsapp_cta_text', type: 'text', label: 'CTA Text' },
        { name: 'whatsapp_prefilled_message', type: 'textarea', label: 'Prefilled Message' },
        { name: 'whatsapp_button_label', type: 'text', label: 'Button Label' },
        { name: 'whatsapp_show_icon', type: 'checkbox', label: 'Show Icon' }
      ],
      required: true
    },
    {
      key: 'metrics',
      name: 'Impact Metrics',
      fields: [
        { name: 'section_heading', type: 'text', label: 'Section Heading' },
        { name: 'section_description', type: 'textarea', label: 'Section Description' },
        { name: 'total_kw_installed_label', type: 'text', label: 'Metric 1 Heading' },
        { name: 'total_kw_installed', type: 'text', label: 'Metric 1 Value' },
        { name: 'homes_powered_label', type: 'text', label: 'Metric 2 Heading' },
        { name: 'homes_powered', type: 'text', label: 'Metric 2 Value' },
        { name: 'co2_offset_label', type: 'text', label: 'Metric 3 Heading' },
        { name: 'co2_offset', type: 'text', label: 'Metric 3 Value' },
        { name: 'trees_saved_label', type: 'text', label: 'Metric 4 Heading' },
        { name: 'trees_saved', type: 'text', label: 'Metric 4 Value' }
      ],
      required: false
    },
    {
      key: 'about',
      name: 'About Company',
      fields: [
        { name: 'mission_statement', type: 'textarea', label: 'Mission Statement' },
        { name: 'experience_years', type: 'number', label: 'Years in Business' },
        { name: 'license_numbers', type: 'text', label: 'License Numbers' },
        { name: 'service_regions', type: 'text', label: 'Service Regions' },
        { name: 'value_props', type: 'repeater', label: 'Key Value Propositions', fields: [
          { name: 'title', type: 'text', label: 'Title' },
          { name: 'description', type: 'textarea', label: 'Description' }
        ]}
      ],
      required: false
    },
    {
      key: 'service_highlights',
      name: 'Our Services',
      fields: [
        { name: 'heading', type: 'text', label: 'Section Heading' },
        { name: 'subheading', type: 'textarea', label: 'Section Subheading' },
        {
          name: 'services',
          type: 'repeater',
          label: 'Services',
          fields: [
            { name: 'icon', type: 'text', label: 'Icon (emoji or short text)' },
            { name: 'title', type: 'text', label: 'Title' },
            { name: 'description', type: 'textarea', label: 'Short Description' }
          ]
        },
        { name: 'cta_label', type: 'text', label: 'CTA Label' },
        { name: 'cta_link', type: 'url', label: 'CTA Link' }
      ],
      required: false
    },
    {
      key: 'gallery',
      name: 'Project Gallery',
      fields: [
        { name: 'heading', type: 'text', label: 'Section Heading' },
        { name: 'subheading', type: 'textarea', label: 'Section Subheading' }
      ],
      required: false
    },
    {
      key: 'copyright',
      name: 'Footer',
      fields: [
        { name: 'text', type: 'text', label: 'Footer Text' }
      ],
      required: false
    },
    {
      key: 'packages',
      name: 'Our Packages',
      fields: [
        { name: 'heading', type: 'text', label: 'Section Heading' },
        { name: 'subheading', type: 'textarea', label: 'Introductory Text' },
        {
          name: 'package_list',
          type: 'repeater',
          label: 'Packages',
          fields: [
            { name: 'name', type: 'text', label: 'Package Name' },
            { name: 'description', type: 'textarea', label: 'Short Description' },
            { name: 'price', type: 'text', label: 'Starting Price' },
            { name: 'timeline', type: 'text', label: 'Typical Timeline' },
            { name: 'features', type: 'textarea', label: 'Key Features (one per line)' },
            { name: 'cta_label', type: 'text', label: 'CTA Label' },
            { name: 'cta_link', type: 'url', label: 'CTA Link' }
          ]
        }
      ],
      required: false
    },
    {
      key: 'financing',
      name: 'Financing & Incentives',
      fields: [
        {
          name: 'options',
          type: 'repeater',
          label: 'Financing Options',
          fields: [
            { name: 'name', type: 'text', label: 'Option Name' },
            { name: 'type', type: 'select', label: 'Option Type', options: [
              { value: 'loan', label: 'Loan' },
              { value: 'lease', label: 'Lease' },
              { value: 'ppa', label: 'Power Purchase Agreement (PPA)' },
              { value: 'cash', label: 'Cash Purchase' }
            ]},
            { name: 'interest_rate', type: 'text', label: 'Interest Rate / Terms' },
            { name: 'down_payment', type: 'text', label: 'Down Payment' },
            { name: 'cta_label', type: 'text', label: 'CTA Label' },
            { name: 'cta_url', type: 'url', label: 'CTA URL' }
          ]
        },
        {
          name: 'incentives',
          type: 'repeater',
          label: 'Available Incentives',
          fields: [
            { name: 'title', type: 'text', label: 'Incentive Title' },
            { name: 'type', type: 'select', label: 'Incentive Type', options: [
              { value: 'federal', label: 'Federal' },
              { value: 'state', label: 'State' },
              { value: 'local', label: 'Local/Utility' },
              { value: 'tax_credit', label: 'Tax Credit' }
            ]},
            { name: 'amount', type: 'text', label: 'Savings Amount or Percentage' },
            { name: 'requirements', type: 'textarea', label: 'Eligibility Requirements' },
            { name: 'expires_on', type: 'text', label: 'Expiration / Deadline' }
          ]
        }
      ],
      required: false
    },
    {
      key: 'featured_projects',
      name: 'Featured Projects',
      fields: [
        {
          name: 'heading',
          type: 'text', 
          label: 'Section Heading'
        },
        {
          name: 'subheading',
          type: 'textarea',
          label: 'Section Subheading'
        }
      ],
      required: false
    },
    {
      key: 'testimonials',
      name: 'Customer Testimonials',
      fields: [
        {
          name: 'reviews',
          type: 'repeater',
          label: 'Testimonials',
          fields: [
            { name: 'client_name', type: 'text', label: 'Client Name' },
            { name: 'location', type: 'text', label: 'Location' },
            { name: 'system_type', type: 'text', label: 'System Type' },
            { name: 'quote', type: 'textarea', label: 'Quote' },
            { name: 'rating', type: 'number', label: 'Rating (1-5)' }
          ]
        }
      ],
      required: false
    },
    {
      key: 'faq',
      name: 'Frequently Asked Questions',
      fields: [
        {
          name: 'items',
          type: 'repeater',
          label: 'FAQ Items',
          fields: [
            { name: 'question', type: 'text', label: 'Question' },
            { name: 'answer', type: 'textarea', label: 'Answer' },
            { name: 'category', type: 'select', label: 'Category', options: [
              { value: 'installation', label: 'Installation' },
              { value: 'maintenance', label: 'Maintenance' },
              { value: 'financing', label: 'Financing' },
              { value: 'incentives', label: 'Incentives' }
            ]}
          ]
        }
      ],
      required: false
    },
    {
      key: 'contact_form',
      name: 'Lead Form',
      fields: [
        { name: 'form_title', type: 'text', label: 'Form Title' },
        { name: 'form_description', type: 'textarea', label: 'Description' },
        { name: 'success_message', type: 'textarea', label: 'Success Message' }
      ],
      required: true
    },
    {
      key: 'contact',
      name: 'Contact Information',
      fields: [
        { name: 'email', type: 'email', label: 'Email Address' },
        { name: 'phone', type: 'tel', label: 'Phone Number' },
        { name: 'website', type: 'url', label: 'Website URL' },
        { name: 'office_address', type: 'text', label: 'Office Address' },
        { name: 'service_hours', type: 'text', label: 'Service Hours Summary' }
      ],
      required: true
    },
    {
      key: 'social',
      name: 'Social & Communication',
      fields: [
        {
          name: 'social_links',
          type: 'repeater',
          label: 'Social Links',
          fields: [
            { name: 'platform', type: 'select', label: 'Platform', options: socialPlatformsConfig.map(platform => ({ value: platform.value, label: platform.label })) },
            { name: 'url', type: 'url', label: 'URL' },
            { name: 'username', type: 'text', label: 'Username / Handle' }
          ]
        }
      ],
      required: false
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
    },
    {
      key: 'pixels',
      name: 'Tracking & Analytics',
      fields: [
        { name: 'google_analytics', type: 'text', label: 'Google Analytics ID' },
        { name: 'facebook_pixel', type: 'text', label: 'Facebook Pixel ID' },
        { name: 'gtm_id', type: 'text', label: 'Google Tag Manager ID' },
        { name: 'custom_head', type: 'textarea', label: 'Custom Head Code' },
        { name: 'custom_body', type: 'textarea', label: 'Custom Body Code' }
      ],
      required: false
    },
    {
      key: 'seo',
      name: 'SEO Metadata',
      fields: [
        { name: 'meta_title', type: 'text', label: 'Meta Title' },
        { name: 'meta_description', type: 'textarea', label: 'Meta Description' },
        { name: 'keywords', type: 'text', label: 'Keywords' },
        { name: 'og_image', type: 'url', label: 'Open Graph Image URL' }
      ],
      required: false
    }
  ],
  colorPresets: [
    { name: 'Solar Sunrise', primary: '#F59E0B', secondary: '#FBBF24', accent: '#22D3EE', background: '#FFF7ED', text: '#0F172A', cardBg: '#FFFFFF', borderColor: '#FCD34D' },
    { name: 'Eco Green', primary: '#16A34A', secondary: '#22C55E', accent: '#0EA5E9', background: '#F0FDF4', text: '#064E3B', cardBg: '#FFFFFF', borderColor: '#BBF7D0' },
    { name: 'Sky Blue', primary: '#0284C7', secondary: '#38BDF8', accent: '#F59E0B', background: '#F0F9FF', text: '#0C4A6E', cardBg: '#FFFFFF', borderColor: '#BAE6FD' },
    { name: 'Desert Dusk', primary: '#F97316', secondary: '#EA580C', accent: '#FDBA74', background: '#FFF4E6', text: '#431407', cardBg: '#FFFFFF', borderColor: '#FED7AA' },
    { name: 'Aurora Green', primary: '#0F766E', secondary: '#14B8A6', accent: '#F7BE38', background: '#E6FFFA', text: '#0B3D37', cardBg: '#FFFFFF', borderColor: '#A7F3D0' },
    { name: 'Midnight Solar', primary: '#1E3A8A', secondary: '#312E81', accent: '#F59E0B', background: '#EEF2FF', text: '#0B1120', cardBg: '#FFFFFF', borderColor: '#C7D2FE' },
    { name: 'Terracotta Glow', primary: '#B45309', secondary: '#D97706', accent: '#F2C078', background: '#FFF8ED', text: '#3F2D20', cardBg: '#FFFFFF', borderColor: '#FCCD9B' },
    { name: 'Sunset Coral', primary: '#FB7185', secondary: '#F973AC', accent: '#FBBF24', background: '#FFF1F2', text: '#831843', cardBg: '#FFFFFF', borderColor: '#FECDD3' }
  ],
  fontOptions: [
    { name: 'Montserrat', value: 'Montserrat, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Poppins', value: 'Poppins, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Nunito', value: 'Nunito, sans-serif', weight: '300,400,600,700' }
  ],
  defaultColors: {
    primary: '#F59E0B',
    secondary: '#FBBF24',
    accent: '#22D3EE',
    background: '#FFF7ED',
    text: '#0F172A',
    cardBg: '#FFFFFF',
    borderColor: '#FCD34D',
    buttonText: '#FFFFFF'
  },
  defaultFont: 'Montserrat, sans-serif',
  themeStyle: {
    layout: 'solar-installation-layout',
    headerStyle: 'hero-split',
    cardStyle: 'bordered',
    buttonStyle: 'rounded',
    iconStyle: 'line',
    spacing: 'comfortable',
    shadows: 'soft',
    backgroundPattern: 'subtle-grid'
  },
  defaultData: {
    header: {
      company_name: 'BrightPath Solar',
      headline: 'Power Your Future with Clean Energy',
      subheadline: 'Custom residential and commercial solar solutions that lower your bills and reduce your carbon footprint.',
      profile_image: '',
      hero_background: '',
      hero_overlay_opacity: 0.45,
      cta_button: { label: 'Request a Free Assessment', url: '#appointments' },
      secondary_cta: { label: 'See Recent Projects', url: '#portfolio' },
      badges: [
        { label: 'NABCEP Certified', icon: '🔆' },
        { label: '25-Year Warranty', icon: '🛡️' },
        { label: 'Tesla Powerwall Partner', icon: '⚡' }
      ],
      whatsapp_phone_number: '+1234567890',
      whatsapp_cta_text: 'Chat with our energy consultants instantly.',
      whatsapp_prefilled_message: 'Hi! I would like to schedule a solar site assessment.',
      whatsapp_button_label: 'Message on WhatsApp',
      whatsapp_show_icon: true,
      whatsapp: {
        phone_number: '+1234567890',
        cta_text: 'Chat with our energy consultants instantly.',
        prefilled_message: 'Hi! I would like to schedule a solar site assessment.',
        button_label: 'Message on WhatsApp',
        show_icon: true
      }
    },
    metrics: {
      section_heading: 'Impact at a Glance',
      section_description: 'Key performance metrics that demonstrate our solar installations delivering reliable, sustainable energy.',
      total_kw_installed_label: 'Solar Systems Installed',
      total_kw_installed: '320 off-grid & hybrid systems delivered',
      homes_powered_label: 'Households Powered Daily',
      homes_powered: 'Over 180 households powered daily',
      co2_offset_label: 'Hours Of Backup During Outages',
      co2_offset: '1,400+ backup hours provided each month',
      trees_saved_label: 'Community & Farm Installs',
      trees_saved: '35 irrigation & cold-room installs across Mashonaland'
    },
    about: {
      mission_statement: 'BrightPath Solar designs, installs, and maintains high-efficiency solar systems tailored to each property. Our licensed professionals handle everything from permitting and incentives to ongoing monitoring.',
      experience_years: '12',
      license_numbers: 'CA CSLB #123456 | NABCEP PV-01234',
      service_regions: 'Serving California: Los Angeles, Orange County, San Diego, Inland Empire',
      value_props: [
        { title: 'End-to-End Service', description: 'From consultation to maintenance, we handle every step of the solar journey.' },
        { title: 'Top Tier Equipment', description: 'We install Tier-1 panels, Enphase microinverters, and sleek racking systems built to last.' },
        { title: 'Performance Guarantee', description: 'Production monitoring and performance guarantees for peace of mind.' }
      ]
    },
    service_highlights: {
      heading: 'Our Solar Services',
      subheading: 'Comprehensive solar solutions tailored to your energy needs.',
      services: [
        { icon: '☀️', title: 'Residential Solar', description: 'Custom solar installations for homes with battery backup options.' },
        { icon: '🏢', title: 'Commercial Solar', description: 'Scalable solar solutions for businesses to reduce operating costs.' },
        { icon: '🔋', title: 'Energy Storage', description: 'Battery systems for backup power and energy independence.' },
        { icon: '🔧', title: 'Maintenance & Monitoring', description: 'Ongoing system care and performance optimization.' }
      ],
      cta_label: 'Learn More',
      cta_link: '#services'
    },
    packages: {
      heading: 'Solar Packages',
      subheading: 'Flexible solar solutions designed for every need and budget.',
      package_list: [
        {
          name: 'Starter Package',
          description: 'Perfect for small homes and first-time solar adopters.',
          price: 'From $8,500',
          timeline: '4-6 weeks',
          features: '6 kW Solar System\nStandard Inverter\n1-Year Monitoring',
          cta_label: 'Get Quote',
          cta_link: 'https://calendly.com/solar-assessment'
        },
        {
          name: 'Premium Package',
          description: 'For larger homes with battery backup and smart home integration.',
          price: 'From $25,000',
          timeline: '8-12 weeks',
          features: '10 kW Solar System\nPremium Inverter\nBattery Storage\nSmart Home Integration\n24/7 Monitoring',
          cta_label: 'Book Consultation',
          cta_link: 'https://calendly.com/solar-assessment-premium'
        }
      ]
    },
    financing: {
      options: [
        { name: 'Solar Advantage Loan', type: 'loan', interest_rate: '3.49% APR up to 15 years', down_payment: 'As low as 0%', cta_label: 'Pre-Qualify', cta_url: '#' },
        { name: 'Commercial PPA', type: 'ppa', interest_rate: 'Locked-in kWh rate below utility prices', down_payment: 'No upfront cost', cta_label: 'Request Proposal', cta_url: '#' }
      ],
      incentives: [
        { title: 'Federal Investment Tax Credit (ITC)', type: 'federal', amount: '30% credit on system cost', requirements: 'Must own the system', expires_on: '2032' },
        { title: 'Net Energy Metering 3.0', type: 'state', amount: 'Export credits for excess production', requirements: 'Utility interconnection approval', expires_on: 'Subject to utility policy' }
      ]
    },
    featured_projects: {
      heading: 'Our Featured Projects',
      subheading: 'Explore our successful solar installations and energy projects that showcase our expertise and commitment to quality.',
    },
    gallery: {
      heading: 'Project Gallery',
      subheading: 'Showcase recent solar installations and system upgrades to build trust with new clients.'
    },
    testimonials: {
      reviews: [
        { client_name: 'Maria Alvarez', location: 'San Diego, CA', system_type: 'Residential 8 kW + Battery', quote: 'BrightPath handled everything and our bill dropped from $240 to $32 per month.', rating: 5 },
        { client_name: 'Harbor Logistics', location: 'Long Beach, CA', system_type: 'Commercial 110 kW', quote: 'Professional crew, on-time delivery, and the monitoring dashboard is outstanding.', rating: 5 }
      ]
    },
    faq: {
      items: [
        { question: 'How long does installation take?', answer: 'Most residential projects are completed within 4-6 weeks from contract to activation.', category: 'installation' },
        { question: 'Do I still receive a utility bill?', answer: 'Yes, but it will typically only include any net usage beyond what your system generates.', category: 'financing' }
      ]
    },
    contact_form: {
      form_title: 'Get a Free Solar Quote',
      form_description: 'Fill out this form and our solar experts will contact you with a customized quote.',
      success_message: 'Thank you! We\'ll contact you within 24 hours to discuss your solar project.'
    },
    contact: {
      email: 'hello@brightpathsolar.com',
      phone: '(555) 987-6543',
      website: 'https://brightpathsolar.com',
      office_address: '2450 Solar Way, Irvine, CA 92614',
      service_hours: 'Mon-Fri 8am-6pm | Sat 9am-3pm'
    },
    social: {
      social_links: [
        { platform: 'facebook', url: 'https://facebook.com/brightpathsolar', username: 'brightpathsolar' },
        { platform: 'instagram', url: 'https://instagram.com/brightpathsolar', username: '@brightpathsolar' },
        { platform: 'linkedin', url: 'https://linkedin.com/company/brightpathsolar', username: 'BrightPath Solar' }
      ]
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '08:00', close_time: '18:00', is_closed: false },
        { day: 'tuesday', open_time: '08:00', close_time: '18:00', is_closed: false },
        { day: 'wednesday', open_time: '08:00', close_time: '18:00', is_closed: false },
        { day: 'thursday', open_time: '08:00', close_time: '18:00', is_closed: false },
        { day: 'friday', open_time: '08:00', close_time: '18:00', is_closed: false },
        { day: 'saturday', open_time: '09:00', close_time: '15:00', is_closed: false },
        { day: 'sunday', open_time: '', close_time: '', is_closed: true }
      ]
    },
    copyright: {
      text: '© ' + new Date().getFullYear() + ' BrightPath Solar. All rights reserved.'
    },
    language: {
      template_language: 'en'
    },
    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    seo: {
      meta_title: 'BrightPath Solar | Residential & Commercial Solar Installations',
      meta_description: 'BrightPath Solar delivers turnkey solar and battery solutions for homes and businesses across Southern California. Schedule your free assessment today.',
      keywords: 'solar installation, solar panels, commercial solar, residential solar, solar incentives',
      og_image: ''
    }
  }
};
