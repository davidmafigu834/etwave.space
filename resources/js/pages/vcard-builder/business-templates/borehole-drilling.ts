import { socialPlatformsConfig } from '../social-platforms-config';
import languageData from '@/../../resources/lang/language.json';

export const boreholeDrillingTemplate = {
  name: 'Borehole Drilling Company',
  sections: [
    {
      key: 'header',
      name: 'Hero Section',
      fields: [
        { name: 'company_name', type: 'text', label: 'Company Name' },
        { name: 'headline', type: 'text', label: 'Headline' },
        { name: 'subheadline', type: 'textarea', label: 'Subheadline' },
        { name: 'trust_tag', type: 'text', label: 'Trust Tagline' },
        { name: 'badge_logo', type: 'file', label: 'Badge Logo (optional)' },
        { name: 'background_image', type: 'file', label: 'Background Image or Video Cover' },
        { name: 'background_video', type: 'url', label: 'Background Video URL' },
        { name: 'overlay_opacity', type: 'number', label: 'Overlay Opacity (0 - 0.9)', min: 0, max: 0.9, step: 0.05 },
        {
          name: 'cta_button',
          type: 'object',
          label: 'Primary CTA Button',
          fields: [
            { name: 'label', type: 'text', label: 'Button Label' },
            { name: 'url', type: 'text', label: 'Button URL or Anchor' }
          ]
        },
        {
          name: 'secondary_cta',
          type: 'object',
          label: 'Secondary CTA Button',
          fields: [
            { name: 'label', type: 'text', label: 'Button Label' },
            { name: 'url', type: 'text', label: 'Button URL or Anchor' }
          ]
        },
        {
          name: 'badges',
          type: 'repeater',
          label: 'Trust Badges',
          fields: [
            { name: 'label', type: 'text', label: 'Badge Label' },
            { name: 'icon', type: 'text', label: 'Icon (emoji or short text)' }
          ]
        },
        {
          name: 'highlight_stats',
          type: 'repeater',
          label: 'Highlight Metrics',
          fields: [
            { name: 'value', type: 'text', label: 'Value' },
            { name: 'label', type: 'text', label: 'Label' }
          ]
        }
      ],
      required: true
    },
    {
      key: 'about',
      name: 'About Section',
      fields: [
        { name: 'heading', type: 'text', label: 'Heading' },
        { name: 'description', type: 'textarea', label: 'Description' },
        {
          name: 'highlights',
          type: 'repeater',
          label: 'Key Highlights',
          fields: [
            { name: 'title', type: 'text', label: 'Highlight Title' },
            { name: 'description', type: 'textarea', label: 'Highlight Description' }
          ]
        }
      ],
      required: true
    },
    {
      key: 'services',
      name: 'Our Services',
      fields: [
        { name: 'heading', type: 'text', label: 'Section Heading' },
        { name: 'description', type: 'textarea', label: 'Intro Description' },
        {
          name: 'service_list',
          type: 'repeater',
          label: 'Services',
          fields: [
            { name: 'title', type: 'text', label: 'Service Title' },
            { name: 'description', type: 'textarea', label: 'Service Description' },
            { name: 'icon', type: 'text', label: 'Icon (optional emoji)' }
          ]
        }
      ],
      required: true
    },
    {
      key: 'packages',
      name: 'Packages & Pricing',
      fields: [
        { name: 'heading', type: 'text', label: 'Section Heading' },
        { name: 'description', type: 'textarea', label: 'Intro Description' },
        {
          name: 'package_list',
          type: 'repeater',
          label: 'Packages',
          fields: [
            { name: 'name', type: 'text', label: 'Package Name' },
            { name: 'audience', type: 'text', label: 'Ideal For' },
            { name: 'includes', type: 'textarea', label: 'What\'s Included (one per line)' },
            { name: 'price', type: 'text', label: 'Starting Price' },
            { name: 'cta_label', type: 'text', label: 'CTA Label' },
            { name: 'cta_anchor', type: 'text', label: 'CTA Anchor or URL' }
          ]
        }
      ],
      required: true
    },
    {
      key: 'why_choose_us',
      name: 'Why Choose Us',
      fields: [
        { name: 'heading', type: 'text', label: 'Section Heading' },
        {
          name: 'reasons',
          type: 'repeater',
          label: 'Reasons',
          fields: [
            { name: 'icon', type: 'text', label: 'Icon (emoji or short text)' },
            { name: 'title', type: 'text', label: 'Title' },
            { name: 'description', type: 'textarea', label: 'Description' }
          ]
        }
      ],
      required: true
    },
    {
      key: 'testimonials',
      name: 'Testimonials',
      fields: [
        { name: 'heading', type: 'text', label: 'Section Heading' },
        {
          name: 'reviews',
          type: 'repeater',
          label: 'Client Reviews',
          fields: [
            { name: 'quote', type: 'textarea', label: 'Quote' },
            { name: 'name', type: 'text', label: 'Client Name' },
            { name: 'location', type: 'text', label: 'Location' }
          ]
        }
      ],
      required: false
    },
    {
      key: 'gallery',
      name: 'Project Gallery',
      fields: [
        { name: 'heading', type: 'text', label: 'Section Heading' },
        {
          name: 'images',
          type: 'repeater',
          label: 'Gallery Images',
          fields: [
            { name: 'image', type: 'file', label: 'Image' },
            { name: 'caption', type: 'text', label: 'Caption' },
            { name: 'description', type: 'textarea', label: 'Description' }
          ]
        }
      ],
      required: false
    },
    {
      key: 'contact',
      name: 'Contact Information',
      fields: [
        { name: 'heading', type: 'text', label: 'Section Heading' },
        { name: 'description', type: 'textarea', label: 'Short Description' },
        { name: 'phone', type: 'tel', label: 'Primary Phone Number' },
        { name: 'whatsapp', type: 'tel', label: 'WhatsApp Number' },
        { name: 'email', type: 'email', label: 'Email Address' },
        { name: 'location', type: 'text', label: 'Service Locations' },
        { name: 'service_hours', type: 'text', label: 'Service Hours' },
        { name: 'call_to_action', type: 'textarea', label: 'Call-to-Action Message' },
        { name: 'hotline_label', type: 'text', label: 'Alternate Contact Label' },
        { name: 'hotline_value', type: 'text', label: 'Alternate Contact Value' }
      ],
      required: true
    },
    {
      key: 'contact_form',
      name: 'Quote Request Form',
      fields: [
        { name: 'form_title', type: 'text', label: 'Form Title' },
        { name: 'form_description', type: 'textarea', label: 'Intro Description' },
        {
          name: 'form_fields',
          type: 'repeater',
          label: 'Form Fields',
          fields: [
            { name: 'field_label', type: 'text', label: 'Field Label' },
            { name: 'placeholder', type: 'text', label: 'Placeholder' },
            { name: 'field_name', type: 'text', label: 'Field Name' },
            {
              name: 'type',
              type: 'select',
              label: 'Field Type',
              options: [
                { value: 'text', label: 'Text' },
                { value: 'tel', label: 'Phone' },
                { value: 'email', label: 'Email' },
                { value: 'select', label: 'Dropdown' },
                { value: 'textarea', label: 'Textarea' }
              ]
            },
            { name: 'required', type: 'checkbox', label: 'Required Field' },
            { name: 'options', type: 'textarea', label: 'Dropdown Options (comma separated)' }
          ]
        },
        { name: 'submit_label', type: 'text', label: 'Submit Button Label' },
        { name: 'success_message', type: 'textarea', label: 'Success Message' },
        { name: 'disclaimer', type: 'textarea', label: 'Privacy or Response Disclaimer' },
        { name: 'alternate_contact_label', type: 'text', label: 'Alternate Contact Label' },
        { name: 'alternate_contact_value', type: 'text', label: 'Alternate Contact Value' }
      ],
      required: true
    },
    {
      key: 'faq',
      name: 'Frequently Asked Questions',
      fields: [
        { name: 'heading', type: 'text', label: 'Section Heading' },
        {
          name: 'items',
          type: 'repeater',
          label: 'FAQ Items',
          fields: [
            { name: 'question', type: 'text', label: 'Question' },
            { name: 'answer', type: 'textarea', label: 'Answer' }
          ]
        }
      ],
      required: false
    },
    {
      key: 'social',
      name: 'Social & Messaging',
      fields: [
        {
          name: 'social_links',
          type: 'repeater',
          label: 'Social Links',
          fields: [
            {
              name: 'platform',
              type: 'select',
              label: 'Platform',
              options: socialPlatformsConfig.map(platform => ({ value: platform.value, label: platform.label }))
            },
            { name: 'url', type: 'url', label: 'Profile URL' },
            { name: 'username', type: 'text', label: 'Username / Handle' }
          ]
        },
        {
          name: 'featured_contacts',
          type: 'repeater',
          label: 'Featured Contact Chips',
          fields: [
            { name: 'label', type: 'text', label: 'Label' },
            { name: 'value', type: 'text', label: 'Value' },
            { name: 'icon', type: 'text', label: 'Icon (emoji or short text)' }
          ]
        }
      ],
      required: false
    },
    {
      key: 'footer',
      name: 'Footer Section',
      fields: [
        { name: 'company_name', type: 'text', label: 'Company Name' },
        { name: 'tagline', type: 'textarea', label: 'Footer Tagline' },
        {
          name: 'quick_links',
          type: 'repeater',
          label: 'Quick Links',
          fields: [
            { name: 'label', type: 'text', label: 'Link Label' },
            { name: 'url', type: 'text', label: 'Link URL or Anchor' }
          ]
        },
        { name: 'legal_line', type: 'text', label: 'Legal Line' }
      ],
      required: true
    },
    {
      key: 'copyright',
      name: 'Copyright',
      fields: [
        { name: 'text', type: 'text', label: 'Copyright Text' }
      ],
      required: false
    },
    {
      key: 'language',
      name: 'Language Settings',
      fields: [
        {
          name: 'template_language',
          type: 'select',
          label: 'Template Language',
          options: languageData.map(lang => {
            const flag = lang.countryCode
              ? String.fromCodePoint(...lang.countryCode.toUpperCase().split('').map((char: string) => 127397 + char.charCodeAt(0)))
              : '';
            return { value: lang.code, label: `${flag} ${lang.name}`.trim() };
          })
        }
      ],
      required: false
    },
    {
      key: 'seo',
      name: 'SEO Settings',
      fields: [
        { name: 'meta_title', type: 'text', label: 'Meta Title' },
        { name: 'meta_description', type: 'textarea', label: 'Meta Description' },
        { name: 'keywords', type: 'text', label: 'Keywords' },
        { name: 'og_image', type: 'url', label: 'Open Graph Image URL' }
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
    }
  ],
  colorPresets: [
    { name: 'Deep Aquifer', primary: '#0B4F6C', secondary: '#145DA0', accent: '#2EC4B6', background: '#F1FAFF', text: '#082F49', cardBg: '#FFFFFF', borderColor: '#B3E5FC', buttonText: '#FFFFFF' },
    { name: 'Crystal Blue', primary: '#1F7A8C', secondary: '#39A0CA', accent: '#A2E8FF', background: '#F0FBFF', text: '#0B1F33', cardBg: '#FFFFFF', borderColor: '#8BD3F7', buttonText: '#FFFFFF' },
    { name: 'Lagoon Teal', primary: '#006D77', secondary: '#00A6A6', accent: '#83E0C4', background: '#ECFBF8', text: '#053742', cardBg: '#FFFFFF', borderColor: '#9CEBD9', buttonText: '#FFFFFF' },
    { name: 'Riverstone Blue', primary: '#1C5D99', secondary: '#639FAB', accent: '#B5EAEA', background: '#F5FAFF', text: '#102A43', cardBg: '#FFFFFF', borderColor: '#C7E6FF', buttonText: '#FFFFFF' },
    { name: 'Ocean Mist', primary: '#136F63', secondary: '#1BA098', accent: '#BBF7D0', background: '#E6FFFA', text: '#064E3B', cardBg: '#FFFFFF', borderColor: '#9DE2D0', buttonText: '#FFFFFF' },
    { name: 'Skyline Waters', primary: '#0A67A3', secondary: '#48B3F7', accent: '#94E2FF', background: '#F2FAFF', text: '#0B2741', cardBg: '#FFFFFF', borderColor: '#B5E4FF', buttonText: '#FFFFFF' },
    { name: 'Sunrise Reef', primary: '#0077B6', secondary: '#00B4D8', accent: '#FFB703', background: '#F6FBFF', text: '#081C2D', cardBg: '#FFFFFF', borderColor: '#9AD9F0', buttonText: '#FFFFFF' },
    { name: 'Artesian Indigo', primary: '#2C5282', secondary: '#2B6CB0', accent: '#90CDF4', background: '#EBF8FF', text: '#1A365D', cardBg: '#FFFFFF', borderColor: '#BEE3F8', buttonText: '#FFFFFF' }
  ],
  fontOptions: [
    { name: 'Poppins', value: 'Poppins, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Nunito Sans', value: '"Nunito Sans", sans-serif', weight: '300,400,600,700' },
    { name: 'Roboto', value: 'Roboto, sans-serif', weight: '300,400,500,700' },
    { name: 'Open Sans', value: '"Open Sans", sans-serif', weight: '300,400,600,700' },
    { name: 'Source Sans Pro', value: '"Source Sans Pro", sans-serif', weight: '300,400,600,700' },
    { name: 'Lato', value: 'Lato, sans-serif', weight: '300,400,700,900' },
    { name: 'Merriweather', value: 'Merriweather, serif', weight: '300,400,700' },
    { name: 'Playfair Display', value: '"Playfair Display", serif', weight: '400,500,600,700' },
    { name: 'Raleway', value: 'Raleway, sans-serif', weight: '300,400,500,600,700' }
  ],
  defaultColors: {
    primary: '#0B4F6C',
    secondary: '#145DA0',
    accent: '#2EC4B6',
    background: '#F1FAFF',
    text: '#082F49',
    cardBg: '#FFFFFF',
    borderColor: '#B3E5FC',
    buttonText: '#FFFFFF'
  },
  defaultFont: 'Poppins, sans-serif',
  themeStyle: {
    layout: 'borehole-waterflow',
    headerStyle: 'immersive-hero',
    cardStyle: 'soft-shadow',
    buttonStyle: 'rounded-pill',
    iconStyle: 'outlined',
    spacing: 'comfortable',
    backgroundPattern: 'water-ripples',
    shadows: 'medium'
  },
  defaultData: {
    header: {
      company_name: 'Mvura Borehole Drilling Services',
      headline: 'Get Reliable Borehole Drilling Services in Zimbabwe — Guaranteed Water Access!',
      subheadline: 'Professional, affordable, and fast borehole drilling for homes, farms, and businesses.',
      trust_tag: 'Serving Communities Across Zimbabwe for Over 10 Years.',
      badge_logo: '',
      background_image: '',
      background_video: '',
      overlay_opacity: 0.55,
      cta_button: { label: 'Get a Free Quote Today', url: '#quote-request' },
      secondary_cta: { label: 'See Packages Below', url: '#packages' },
      badges: [
        { label: '500+ Boreholes Completed', icon: '💧' },
        { label: 'Nationwide Coverage', icon: '📍' },
        { label: 'Certified Engineers', icon: '🛠️' }
      ],
      highlight_stats: [
        { value: '500+', label: 'Successful Boreholes' },
        { value: '10+', label: 'Years Experience' },
        { value: '24 hrs', label: 'Average Response Time' }
      ]
    },
    about: {
      heading: 'About Mvura Borehole Drilling Services',
      description: 'Mvura Borehole Drilling Services provides reliable water solutions across Zimbabwe. With state-of-the-art drilling rigs and experienced engineers, we make borehole drilling simple, fast, and stress-free.',
      highlights: [
        { title: 'Over 500+ successful boreholes drilled', description: 'Residential, agricultural, and commercial clients across every province.' },
        { title: 'Affordable packages for homes and farms', description: 'Transparent pricing with flexible payment options tailored to your needs.' },
        { title: 'Licensed and certified team', description: 'Government-approved drilling experts with full safety and compliance certifications.' },
        { title: 'Guaranteed clean water access', description: 'Quality borehole siting, casing, and pump installation that lasts.' }
      ]
    },
    services: {
      heading: 'Our Borehole Drilling Services Include:',
      description: 'Choose the water solution you need and our team will handle the rest — from siting to installation and maintenance.',
      service_list: [
        { title: 'Borehole Siting & Survey', description: 'Hydrological surveys and siting to identify the most productive water points.', icon: '🧭' },
        { title: 'Borehole Drilling', description: 'Modern rotary drilling rigs for urban, rural, and rocky terrains.', icon: '🛠️' },
        { title: 'Casing & Installation', description: 'Durable steel or PVC casing to protect your borehole for decades.', icon: '🧱' },
        { title: 'Pump Installation & Testing', description: 'Submersible pumps, tank stands, and pressure systems calibrated on-site.', icon: '⚙️' },
        { title: 'Borehole Maintenance & Rehabilitation', description: 'Flushing, yield testing, borehole deepening, and pump servicing.', icon: '🔧' }
      ]
    },
    packages: {
      heading: 'Choose the Package That Fits You Best',
      description: 'Transparent pricing designed for households, farms, and businesses. Custom solutions available on request.',
      package_list: [
        {
          name: 'Home Starter Package',
          audience: 'Ideal for households.',
          includes: 'Hydrological siting\nDrilling up to 40m\nStandard casing and grouting\nGrundfos or Pedrollo pump\nOn-site water quality test',
          price: 'Starting from $850',
          cta_label: 'Get Quote',
          cta_anchor: '#quote-request'
        },
        {
          name: 'Farm Package',
          audience: 'Perfect for small to medium farms.',
          includes: 'Drilling up to 80m\nHeavy-duty pump installation\n2x 5000L tank setup\nSolar or generator integration\nYield testing & commissioning',
          price: 'Starting from $1,200',
          cta_label: 'Get Quote',
          cta_anchor: '#quote-request'
        },
        {
          name: 'Commercial Package',
          audience: 'For companies, schools, or institutions.',
          includes: 'Deep drilling up to 150m\nIndustrial pump & control panel\nSite-specific engineering report\nWater purification optional\nCustom SLA & maintenance',
          price: 'Custom pricing',
          cta_label: 'Request Quote',
          cta_anchor: '#quote-request'
        }
      ]
    },
    why_choose_us: {
      heading: 'Why Zimbabweans Choose Mvura Borehole Drilling Services',
      reasons: [
        { icon: '✅', title: 'Fast project turnaround time', description: 'From survey to water flow in as little as 72 hours.' },
        { icon: '✅', title: 'Modern drilling equipment', description: 'Top-tier rigs and tools maintained for precision drilling.' },
        { icon: '✅', title: 'Skilled, experienced team', description: 'Geologists, engineers, and rig operators with local expertise.' },
        { icon: '✅', title: 'Affordable and transparent pricing', description: 'Clear quotations with no hidden costs.' },
        { icon: '✅', title: 'Nationwide coverage', description: 'Serving Harare, Bulawayo, Gweru, Mutare, Masvingo, and beyond.' },
        { icon: '✅', title: '100% satisfaction guarantee', description: 'We stand by every borehole we install and maintain.' }
      ]
    },
    testimonials: {
      heading: 'What Our Clients Say',
      reviews: [
        { quote: 'Mvura drilled our borehole in 2 days! Very professional service.', name: 'Tendai M.', location: 'Harare' },
        { quote: 'Affordable and efficient! Highly recommend Mvura.', name: 'Rudo N.', location: 'Marondera' },
        { quote: 'We finally have clean water on our farm thanks to Mvura.', name: 'Mr. Dube', location: 'Masvingo' }
      ]
    },
    gallery: {
      heading: 'Our Recent Projects',
      images: [
        { image: '', caption: 'Rural homestead borehole completion', description: 'Fully cased borehole with 5000L tank setup in Mashonaland East.' },
        { image: '', caption: 'Commercial drilling in Harare', description: 'Rig mobilised for high-yield borehole at a logistics depot.' },
        { image: '', caption: 'Farm irrigation system', description: 'Solar-powered pump and mainline installation for a tomato farm.' }
      ]
    },
    contact: {
      heading: 'Talk to Zimbabwe’s Trusted Borehole Experts',
      description: 'Ready to secure reliable water access? Reach out and our response team will call you back in minutes.',
      phone: '+263 77 000 0000',
      whatsapp: '+263 78 123 4567',
      email: 'info@mvuradrilling.co.zw',
      location: 'Harare • Bulawayo • Mutare • Masvingo',
      service_hours: 'Mon-Sat 7am – 6pm | Emergency support 24/7',
      call_to_action: 'Need water fast? We dispatch drilling crews within 48 hours.',
      hotline_label: 'Emergency Line',
      hotline_value: '+263 71 555 8888'
    },
    contact_form: {
      form_title: 'Request a Free Borehole Quote Today',
      form_description: 'Fill in your details below and our team will call you back within minutes.',
      form_fields: [
        { field_label: 'Full Name', placeholder: 'Enter your full name', field_name: 'full_name', type: 'text', required: true, options: '' },
        { field_label: 'Phone Number (WhatsApp optional)', placeholder: 'e.g. +263 77 123 4567', field_name: 'phone', type: 'tel', required: true, options: '' },
        { field_label: 'Location', placeholder: 'City or Area in Zimbabwe', field_name: 'location', type: 'text', required: true, options: '' },
        { field_label: 'Service Needed', placeholder: 'Select an option', field_name: 'service_needed', type: 'select', required: true, options: 'Borehole Drilling,Pump Installation,Other' }
      ],
      submit_label: 'Get My Free Quote',
      success_message: 'Thank you! Our borehole experts will reach out within 15 minutes during business hours.',
      disclaimer: 'We respect your privacy. Your information stays with Mvura Borehole Drilling.',
      alternate_contact_label: 'Prefer to talk now?',
      alternate_contact_value: 'Call/WhatsApp: +263 77 000 0000'
    },
    faq: {
      heading: 'Frequently Asked Questions',
      items: [
        { question: 'How long does drilling take?', answer: 'Usually 1–3 days depending on location and ground conditions.' },
        { question: 'Do you handle pump installation?', answer: 'Yes, we supply and install submersible pumps, tank stands, and complete plumbing.' },
        { question: 'Do you offer payment plans?', answer: 'Yes, flexible plans are available for qualifying customers. Ask our team for details.' }
      ]
    },
    social: {
      social_links: [
        { platform: 'facebook', url: 'https://facebook.com/mvuradrilling', username: 'Mvura Drilling' },
        { platform: 'instagram', url: 'https://instagram.com/mvuradrilling', username: '@mvuradrilling' }
      ],
      featured_contacts: [
        { label: 'Call Centre', value: '+263 77 000 0000', icon: '📞' },
        { label: 'WhatsApp', value: '+263 78 123 4567', icon: '💬' }
      ]
    },
    footer: {
      company_name: 'Mvura Borehole Drilling Services',
      tagline: 'Reliable Water Solutions for Every Zimbabwean Home.',
      quick_links: [
        { label: 'Services', url: '#services' },
        { label: 'Get Quote', url: '#quote-request' },
        { label: 'Contact', url: '#contact' },
        { label: 'WhatsApp', url: 'https://wa.me/263781234567' }
      ],
      legal_line: '© 2025 Mvura Borehole Drilling Services | All Rights Reserved'
    },
    copyright: {
      text: '© 2025 Mvura Borehole Drilling Services | All Rights Reserved'
    },
    whatsapp: {
      phone_number: '+263 78 123 4567',
      cta_text: 'Chat with our drilling experts now.',
      prefilled_message: 'Hi Mvura team, I\'d like a borehole quotation for my property in...',
      button_label: 'Chat on WhatsApp',
      show_icon: true
    },
    language: {
      template_language: 'en'
    },
    seo: {
      meta_title: 'Mvura Borehole Drilling Zimbabwe | Reliable Borehole & Water Solutions',
      meta_description: 'Mvura Borehole Drilling offers fast, affordable borehole drilling, pump installation, and maintenance across Zimbabwe. Book your free site assessment today.',
      keywords: 'borehole drilling Zimbabwe, water solutions, pump installation, Mvura drilling',
      og_image: ''
    },
    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    }
  }
};
