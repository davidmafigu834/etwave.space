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
      name: 'Quick Benefits Snapshot',
      fields: [
        { name: 'section_heading', type: 'text', label: 'Section Heading' },
        { name: 'section_description', type: 'textarea', label: 'Section Description' },
        { name: 'total_kw_installed_label', type: 'text', label: 'Benefit 1 Heading' },
        { name: 'total_kw_installed', type: 'text', label: 'Benefit 1 Description' },
        { name: 'homes_powered_label', type: 'text', label: 'Benefit 2 Heading' },
        { name: 'homes_powered', type: 'text', label: 'Benefit 2 Description' },
        { name: 'co2_offset_label', type: 'text', label: 'Benefit 3 Heading' },
        { name: 'co2_offset', type: 'text', label: 'Benefit 3 Description' },
        { name: 'trees_saved_label', type: 'text', label: 'Benefit 4 Heading' },
        { name: 'trees_saved', type: 'text', label: 'Benefit 4 Description' }
      ],
      required: false
    },
    {
      key: 'how_it_works',
      name: 'How It Works',
      fields: [
        { name: 'heading', type: 'text', label: 'Section Heading' },
        { name: 'subheading', type: 'textarea', label: 'Section Subheading' },
        {
          name: 'steps',
          type: 'repeater',
          label: 'Process Steps',
          fields: [
            { name: 'title', type: 'text', label: 'Step Title' },
            { name: 'description', type: 'textarea', label: 'Step Description' }
          ]
        },
        { name: 'cta_label', type: 'text', label: 'Button Label' }
      ],
      required: false
    },
    {
      key: 'why_us',
      name: 'Why Choose Us',
      fields: [
        { name: 'heading', type: 'text', label: 'Section Heading' },
        { name: 'subheading', type: 'textarea', label: 'Section Subheading' },
        {
          name: 'reasons',
          type: 'repeater',
          label: 'Reasons',
          fields: [
            { name: 'title', type: 'text', label: 'Reason Title' },
            { name: 'description', type: 'textarea', label: 'Reason Description' }
          ]
        }
      ],
      required: false
    },
    {
      key: 'savings_calculator',
      name: 'Savings Calculator',
      fields: [
        { name: 'heading', type: 'text', label: 'Section Heading' },
        { name: 'description', type: 'textarea', label: 'Short Description' },
        { name: 'bill_label', type: 'text', label: 'Current Bill Label' },
        { name: 'savings_label', type: 'text', label: 'Estimated Savings Label' },
        { name: 'cta_label', type: 'text', label: 'Calculator Button Label' },
        { name: 'name_label', type: 'text', label: 'Name Field Label' },
        { name: 'phone_label', type: 'text', label: 'Phone Field Label' },
        { name: 'location_label', type: 'text', label: 'Location Field Label' },
        { name: 'success_message', type: 'textarea', label: 'Success Message' }
      ],
      required: false
    },
    {
      key: 'final_cta',
      name: 'Final Call to Action',
      fields: [
        { name: 'headline', type: 'text', label: 'Headline' },
        { name: 'subheadline', type: 'textarea', label: 'Subheadline' },
        { name: 'primary_cta_label', type: 'text', label: 'Primary Button Label' },
        { name: 'secondary_cta_label', type: 'text', label: 'Secondary Button Label' },
        { name: 'whatsapp_button_label', type: 'text', label: 'WhatsApp Button Label' },
        { name: 'phone_label', type: 'text', label: 'Phone Label' },
        { name: 'email_label', type: 'text', label: 'Email Label' }
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
          name: 'note',
          type: 'textarea',
          label: 'Configuration Note',
          helpText: 'Packages shown on this section are loaded from your Packages page. Configure them there. This section only controls the heading and intro text.'
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
        },
        {
          name: 'note',
          type: 'textarea',
          label: 'Configuration Note',
          helpText: 'Projects shown in this section come from your Featured Projects page. Manage them there. This section only controls the heading and description.'
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
            { name: 'rating', type: 'number', label: 'Rating (1-5)' },
            { name: 'photo', type: 'file', label: 'Customer Photo' },
            { name: 'before_image', type: 'file', label: 'Before Installation Image' },
            { name: 'after_image', type: 'file', label: 'After Installation Image' }
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
        { name: 'heading', type: 'text', label: 'Section Heading' },
        { name: 'subheading', type: 'textarea', label: 'Section Subheading' },
        {
          name: 'note',
          type: 'textarea',
          label: 'Configuration Note',
          helpText: 'Contact details (phone, email, address) are loaded from your saved profile/onboarding. Update them from your profile or onboarding settings. This section only controls the heading and helper text.'
        }
      ],
      required: false
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
      headline: 'Cut Your Power Costs With Reliable Solar Energy',
      subheadline: 'Custom solar systems designed for homes & businesses.',
      profile_image: '',
      hero_background: '',
      hero_overlay_opacity: 0.45,
      cta_button: { label: 'Get a Free Quote', url: '#contact-form' },
      secondary_cta: { label: 'Book Your Assessment', url: '#appointments' },
      badges: [
        { label: 'Save up to 60% on power', icon: '💡' },
        { label: 'Up to 25-Year Warranty', icon: '🛡️' },
        { label: 'Certified Solar Installers', icon: '✅' }
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
      section_heading: 'Why Switch to Solar Now?',
      section_description: 'See the key benefits you get before you even scroll too far.',
      total_kw_installed_label: 'Save on Electricity Bills',
      total_kw_installed: 'Cut your monthly power costs by up to 60% with a properly sized system.',
      homes_powered_label: 'Guaranteed Installation Timeline',
      homes_powered: 'From site assessment to switch-on, we keep your project on a clear schedule.',
      co2_offset_label: 'Long-Term Warranties',
      co2_offset: 'Panels and inverters backed by strong manufacturer and installer warranties.',
      trees_saved_label: 'Free Site Assessment',
      trees_saved: 'We evaluate your roof, usage and budget before recommending any solution.'
    },
    how_it_works: {
      heading: 'How It Works',
      subheading: 'We keep the process simple, transparent, and focused on your savings.',
      steps: [
        {
          title: '1. Schedule Your Assessment',
          description: 'Book a free on-site or virtual assessment so we can understand your roof, usage, and goals.'
        },
        {
          title: '2. Get a Custom Solar Proposal',
          description: 'We design a tailored solar system with projected savings, equipment list, and installation timeline.'
        },
        {
          title: '3. Professional Installation',
          description: 'Our certified solar team handles installation, wiring, permits, and inspections from start to finish.'
        },
        {
          title: '4. Enjoy Lower Power Bills',
          description: 'Once switched on, you start generating clean power and see the difference on your monthly bill.'
        }
      ],
      cta_label: 'Book Your Assessment'
    },
    why_us: {
      heading: 'Why Choose Us',
      subheading: 'Trust a solar partner that focuses on long-term performance, not just panels.',
      reasons: [
        {
          title: 'Certified & Experienced Installers',
          description: 'Your system is installed and commissioned by certified professionals with years of hands-on experience.'
        },
        {
          title: 'Only High-Grade Panels & Inverters',
          description: 'We carefully select Tier-1 modules and reputable inverters built for reliability and output.'
        },
        {
          title: 'Fast Installation Guarantee',
          description: 'Once your design is approved, we commit to a clear and realistic installation timeline.'
        },
        {
          title: 'Local Support & Maintenance',
          description: 'Our team is local, reachable, and available for maintenance, inspections, and system checks.'
        },
        {
          title: '100+ Successful Installations',
          description: 'Residential, commercial, and agricultural clients already rely on our systems every day.'
        }
      ]
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
      subheading: 'Three clear options to help you quickly choose the right system for your home or business.',
      note: 'Package cards on your vCard are loaded from your Packages page. Use that page to create packages such as Home Solar Starter, Home Backup + Solar System, and Full Commercial Solar Setup with kW size, ideal usage, inclusions, and monthly savings estimates.'
    },
    featured_projects: {
      heading: 'Our Featured Projects',
      subheading: 'Explore real solar installations we have completed for homes, businesses, and farms.',
      note: 'Featured projects on your vCard are loaded from your Featured Projects page. Use that page to manage project cards. This section only controls the heading and description.'
    },
    gallery: {
      heading: 'Project Gallery',
      subheading: 'Showcase recent solar installations and system upgrades to build trust with new clients.'
    },
    testimonials: {
      reviews: [
        {
          client_name: 'Maria Alvarez',
          location: 'San Diego, CA',
          system_type: 'Residential 8 kW + Battery',
          quote: 'The team handled everything from assessment to installation. Our bill dropped from $240 to about $35 per month.',
          rating: 5,
          photo: '',
          before_image: '',
          after_image: ''
        },
        {
          client_name: 'Harbor Logistics',
          location: 'Long Beach, CA',
          system_type: 'Commercial 110 kW Rooftop System',
          quote: 'Professional crew, on-time delivery, and the monitoring dashboard makes it easy to track savings.',
          rating: 5,
          photo: '',
          before_image: '',
          after_image: ''
        }
      ]
    },
    faq: {
      items: [
        {
          question: 'How much does solar cost?',
          answer: 'The cost depends on your roof size, usage, and system type. Most homeowners recover the investment within 3–7 years through lower electricity bills.',
          category: 'financing'
        },
        {
          question: 'Do you offer payment plans?',
          answer: 'Yes. We work with financing partners so you can spread the cost over time, often with low or no upfront payment.',
          category: 'financing'
        },
        {
          question: 'How long does installation take?',
          answer: 'Once approvals are in place, a typical residential installation takes 1–3 days on-site, plus a short waiting period for inspection and grid connection.',
          category: 'installation'
        },
        {
          question: 'What warranties do you offer?',
          answer: 'Most systems include panel warranties up to 25 years and inverter warranties from 5–15 years, plus our own workmanship warranty.',
          category: 'maintenance'
        },
        {
          question: 'Can I go completely off-grid?',
          answer: 'In many cases yes, but it requires careful design and adequate battery storage. We can design both grid-tied and off-grid systems depending on your needs.',
          category: 'installation'
        }
      ]
    },
    savings_calculator: {
      heading: 'See How Much You Can Save',
      description: 'Enter your current monthly electricity spend and we’ll estimate your potential solar savings.',
      bill_label: 'Your Current Monthly Bill',
      savings_label: 'Estimated Monthly Savings',
      cta_label: 'Calculate My Savings',
      name_label: 'Full Name',
      phone_label: 'Phone Number',
      location_label: 'Location / Area',
      success_message: 'Thank you! We’ve received your details. A solar consultant will contact you shortly with a personalized savings estimate.'
    },
    final_cta: {
      headline: 'Ready to Start Saving on Power?',
      subheadline: 'Take the next step toward reliable, affordable solar energy for your home or business.',
      primary_cta_label: 'Get a Free Quote',
      secondary_cta_label: 'Book Consultation',
      whatsapp_button_label: 'Chat on WhatsApp',
      phone_label: 'Call Us',
      email_label: 'Email Us'
    },
    contact_form: {
      form_title: 'Get a Free Solar Quote',
      form_description: 'Fill out this form and our solar experts will contact you with a customized quote.',
      success_message: 'Thank you! We\'ll contact you within 24 hours to discuss your solar project.'
    },
    contact: {
      heading: 'Need to Talk to a Solar Expert?',
      subheading: 'Your phone, email, and address are pulled automatically from your saved profile details.',
      note: 'Update your contact information from your profile/onboarding settings. This section only manages the heading and helper text displayed above your contact details.'
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
