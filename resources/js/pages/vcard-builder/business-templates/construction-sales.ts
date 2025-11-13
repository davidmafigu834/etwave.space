import { socialPlatformsConfig } from '../social-platforms-config';
import languageData from '@/../../resources/lang/language.json';

export const constructionSalesTemplate = {
  name: 'Construction Company Sales Website',
  sections: [
    {
      key: 'hero',
      name: 'Hero Section',
      fields: [
        { name: 'headline', type: 'text', label: 'Headline' },
        { name: 'subheadline', type: 'textarea', label: 'Subheadline' },
        { name: 'primary_cta_label', type: 'text', label: 'Primary CTA Label' },
        { name: 'primary_cta_link', type: 'url', label: 'Primary CTA Link' },
        { name: 'secondary_cta_label', type: 'text', label: 'Secondary CTA Label' },
        { name: 'secondary_cta_link', type: 'url', label: 'Secondary CTA Link' },
        { name: 'background_media', type: 'file', label: 'Background Image or Video' },
        {
          name: 'trust_badges',
          type: 'repeater',
          label: 'Trust Badges',
          fields: [
            { name: 'icon', type: 'text', label: 'Icon (emoji or short text)' },
            { name: 'label', type: 'text', label: 'Badge Label' }
          ]
        },
        {
          name: 'metrics',
          type: 'repeater',
          label: 'Key Metrics',
          fields: [
            { name: 'label', type: 'text', label: 'Metric Label' },
            { name: 'value', type: 'text', label: 'Metric Value' }
          ]
        }
      ],
      required: true
    },
    {
      key: 'service_highlights',
      name: 'Service Highlights',
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
      required: true
    },
    {
      key: 'why_choose_us',
      name: 'Why Choose Us',
      fields: [
        { name: 'heading', type: 'text', label: 'Section Heading' },
        { name: 'subheading', type: 'textarea', label: 'Intro Text' },
        {
          name: 'points',
          type: 'repeater',
          label: 'Key Reasons',
          fields: [
            { name: 'icon', type: 'text', label: 'Icon (emoji or short text)' },
            { name: 'title', type: 'text', label: 'Title' },
            { name: 'description', type: 'textarea', label: 'Short Description' }
          ]
        },
        { name: 'testimonial_quote', type: 'textarea', label: 'Testimonial Quote' },
        { name: 'testimonial_author', type: 'text', label: 'Testimonial Author' },
        { name: 'testimonial_role', type: 'text', label: 'Author Role / Project' }
      ],
      required: true
    },
    {
      key: 'about',
      name: 'About the Company',
      fields: [
        { name: 'heading', type: 'text', label: 'Section Heading' },
        { name: 'story', type: 'textarea', label: 'Company Story' },
        { name: 'mission', type: 'textarea', label: 'Mission Statement' },
        { name: 'experience_years', type: 'text', label: 'Years of Experience' },
        { name: 'team_image', type: 'file', label: 'Team or Project Image' }
      ],
      required: true
    },
    {
      key: 'projects',
      name: 'Featured Projects',
      fields: [
        {
          name: 'project_list',
          type: 'repeater',
          label: 'Projects',
          fields: [
            { name: 'title', type: 'text', label: 'Project Title' },
            { name: 'description', type: 'textarea', label: 'Short Description' },
            { name: 'location', type: 'text', label: 'Location' },
            { name: 'image', type: 'file', label: 'Project Image' },
            { name: 'category', type: 'text', label: 'Project Type/Category' },
            { name: 'link_label', type: 'text', label: 'Project CTA Label' },
            { name: 'link', type: 'url', label: 'Project CTA Link' }
          ]
        }
      ],
      required: true
    },
    {
      key: 'testimonials',
      name: 'Customer Testimonials',
      fields: [
        { name: 'heading', type: 'text', label: 'Section Heading' },
        {
          name: 'reviews',
          type: 'repeater',
          label: 'Testimonials',
          fields: [
            { name: 'client_name', type: 'text', label: 'Client Name' },
            { name: 'quote', type: 'textarea', label: 'Quote' },
            { name: 'rating', type: 'number', label: 'Star Rating (1-5)' },
            { name: 'project_type', type: 'text', label: 'Project Type' }
          ]
        }
      ],
      required: true
    },
    {
      key: 'process',
      name: 'Our Process',
      fields: [
        { name: 'heading', type: 'text', label: 'Section Heading' },
        { name: 'subheading', type: 'textarea', label: 'Introductory Text' },
        {
          name: 'steps',
          type: 'repeater',
          label: 'Process Steps',
          fields: [
            { name: 'title', type: 'text', label: 'Step Title' },
            { name: 'description', type: 'textarea', label: 'Step Description' },
            { name: 'icon', type: 'text', label: 'Icon (emoji or short text)' }
          ]
        },
        { name: 'cta_label', type: 'text', label: 'CTA Label' },
        { name: 'cta_link', type: 'url', label: 'CTA Link' }
      ],
      required: true
    },
    {
      key: 'packages',
      name: 'Packages & Pricing',
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
      required: true
    },
    {
      key: 'cta_banner',
      name: 'Call to Action Banner',
      fields: [
        { name: 'heading', type: 'text', label: 'Heading' },
        { name: 'subheading', type: 'textarea', label: 'Subheading' },
        { name: 'primary_label', type: 'text', label: 'Primary Button Label' },
        { name: 'primary_link', type: 'url', label: 'Primary Button Link' },
        { name: 'secondary_label', type: 'text', label: 'Secondary Button Label' },
        { name: 'secondary_link', type: 'url', label: 'Secondary Button Link' }
      ],
      required: true
    },
    {
      key: 'appointments',
      name: 'Appointments',
      fields: [
        { name: 'booking_url', type: 'url', label: 'Booking URL' },
        { name: 'section_title', type: 'text', label: 'Section Title' },
        { name: 'section_description', type: 'textarea', label: 'Section Description' },
        { name: 'booking_text', type: 'text', label: 'Booking Button Text' },
        { name: 'estimate_text', type: 'text', label: 'Estimate Button Text' }
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
        { name: 'phone', type: 'tel', label: 'Phone Number' },
        { name: 'whatsapp', type: 'tel', label: 'WhatsApp Number' },
        { name: 'email', type: 'email', label: 'Email Address' },
        { name: 'address', type: 'text', label: 'Address' },
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
            { name: 'platform', type: 'select', label: 'Platform', options: socialPlatformsConfig.map((platform) => ({ value: platform.value, label: platform.label })) },
            { name: 'url', type: 'url', label: 'Profile URL' },
            { name: 'username', type: 'text', label: 'Handle / Username' }
          ]
        }
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
          options: languageData.map((lang) => ({
            value: lang.code,
            label: `${String.fromCodePoint(...lang.countryCode.toUpperCase().split('').map((char: string) => 127397 + char.charCodeAt(0)))} ${lang.name}`
          }))
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
        { name: 'keywords', type: 'text', label: 'Keywords (comma separated)' },
        { name: 'og_image', type: 'url', label: 'Open Graph Image URL' }
      ],
      required: false
    },
    {
      key: 'pixels',
      name: 'Pixel & Analytics',
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
      key: 'footer',
      name: 'Footer',
      fields: [
        { name: 'footer_text', type: 'textarea', label: 'Footer Text' },
        {
          name: 'footer_links',
          type: 'repeater',
          label: 'Footer Links',
          fields: [
            { name: 'title', type: 'text', label: 'Link Title' },
            { name: 'url', type: 'url', label: 'Link URL' }
          ]
        }
      ],
      required: false
    },
    {
      key: 'copyright',
      name: 'Copyright',
      fields: [
        { name: 'text', type: 'text', label: 'Copyright Text' }
      ],
      required: false
    }
  ],
  colorPresets: [
    { name: 'Blueprint', primary: '#1E3A8A', secondary: '#2563EB', accent: '#EFF6FF', background: '#F8FAFC', text: '#0F172A', cardBg: '#FFFFFF', borderColor: '#E2E8F0', buttonText: '#FFFFFF' },
    { name: 'Industrial', primary: '#F97316', secondary: '#FDBA74', accent: '#FFF7ED', background: '#111827', text: '#FFFFFF', cardBg: '#1F2937', borderColor: '#374151', buttonText: '#111827' },
    { name: 'Earth Tones', primary: '#334155', secondary: '#475569', accent: '#E2E8F0', background: '#F1F5F9', text: '#111827', cardBg: '#FFFFFF', borderColor: '#CBD5F5', buttonText: '#FFFFFF' },
    { name: 'Modern Green', primary: '#059669', secondary: '#10B981', accent: '#D1FAE5', background: '#F0FDF4', text: '#065F46', cardBg: '#FFFFFF', borderColor: '#A7F3D0', buttonText: '#FFFFFF' },
    { name: 'Professional Red', primary: '#DC2626', secondary: '#EF4444', accent: '#FEE2E2', background: '#FEF2F2', text: '#7F1D1D', cardBg: '#FFFFFF', borderColor: '#FECACA', buttonText: '#FFFFFF' },
    { name: 'Steel Gray', primary: '#4B5563', secondary: '#6B7280', accent: '#F3F4F6', background: '#F9FAFB', text: '#1F2937', cardBg: '#FFFFFF', borderColor: '#E5E7EB', buttonText: '#FFFFFF' },
    { name: 'Sunset Orange', primary: '#EA580C', secondary: '#F97316', accent: '#FFEDD5', background: '#FFF7ED', text: '#9A3412', cardBg: '#FFFFFF', borderColor: '#FED7AA', buttonText: '#FFFFFF' }
  ],
  fontOptions: [
    { name: 'Poppins', value: 'Poppins, sans-serif', weight: '400,500,600,700' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif', weight: '400,500,600,700,900' },
    { name: 'Manrope', value: 'Manrope, sans-serif', weight: '400,500,600,700' },
    { name: 'Work Sans', value: 'Work Sans, sans-serif', weight: '400,500,600,700' }
  ],
  defaultColors: {
    primary: '#059669',
    secondary: '#10B981',
    accent: '#D1FAE5',
    background: '#F0FDF4',
    text: '#065F46',
    cardBg: '#FFFFFF',
    borderColor: '#A7F3D0',
    buttonText: '#FFFFFF'
  },
  defaultFont: 'Poppins, sans-serif',
  themeStyle: {
    layout: 'construction-sales',
    headerStyle: 'bold',
    cardStyle: 'elevated',
    buttonStyle: 'rounded',
    iconStyle: 'solid',
    spacing: 'comfortable',
    shadows: 'medium'
  },
  defaultData: {
    hero: {
      headline: 'Building Quality You Can Trust',
      subheadline: 'From residential dream homes to large-scale commercial projects, we deliver exceptional craftsmanship with transparent pricing and on-time delivery.',
      primary_cta_label: 'Get a Free Quote',
      primary_cta_link: 'https://calendly.com/buildrightconstruction',
      secondary_cta_label: 'View Completed Projects',
      secondary_cta_link: '#featured-projects',
      background_media: '',
      trust_badges: [
        { icon: '🏆', label: '20+ Years Experience' },
        { icon: '🛠️', label: 'Licensed & Insured' },
        { icon: '⚡', label: 'Fast Turnaround' }
      ],
      metrics: [
        { label: 'Projects Delivered', value: '480+' },
        { label: 'Average Rating', value: '4.9/5' },
        { label: 'Qualified Engineers', value: '35+' }
      ]
    },
    service_highlights: {
      heading: 'Construction Solutions At A Glance',
      subheading: 'Tailored building services for homeowners, developers, and corporate teams who value precision and accountability.',
      services: [
        { icon: '🧱', title: 'Residential Construction', description: 'Energy-efficient family homes designed and delivered on time.' },
        { icon: '🏢', title: 'Commercial Projects', description: 'Modern business spaces built with lean project management.' },
        { icon: '⚡', title: 'Electrical & Plumbing', description: 'Certified teams providing safe, code-compliant installations.' },
        { icon: '🛠️', title: 'Renovations & Extensions', description: 'Refresh and expand your property without disrupting daily life.' }
      ],
      cta_label: 'See All Services',
      cta_link: '#services'
    },
    why_choose_us: {
      heading: 'Why Clients Choose BuildRight',
      subheading: 'We simplify complex builds with proactive communication and a detail-obsessed team.',
      points: [
        { icon: '✅', title: 'Transparent Pricing', description: 'No surprise costs—we provide line-item proposals and weekly progress updates.' },
        { icon: '🏗️', title: 'Experienced Engineers', description: 'Every project is led by veteran site managers and civil engineers.' },
        { icon: '⏱️', title: 'On-Time Completion', description: 'A dedicated project coordinator keeps milestones on track.' },
        { icon: '🧱', title: 'Quality Materials', description: 'We partner with vetted suppliers to guarantee long-lasting results.' }
      ],
      testimonial_quote: '“BuildRight transformed our undeveloped plot into a premium mixed-use complex ahead of schedule and under budget.”',
      testimonial_author: 'Ntombi Dube',
      testimonial_role: 'Property Developer, Harare'
    },
    about: {
      heading: 'From Concept to Handover, We Own Every Detail',
      story: 'Founded in 2004, BuildRight Construction has delivered 400+ residential and commercial projects across Southern Africa. Our integrated team handles architectural coordination, structural engineering, and finishing trades—all under one project lead.',
      mission: 'We exist to build safe, future-ready spaces where people can live, work, and thrive.',
      experience_years: '20+ Years',
      team_image: ''
    },
    projects: {
      project_list: [
        {
          title: 'Luxury Home – Borrowdale',
          description: '5-bedroom smart home with solar backup, climate control, and bespoke interiors.',
          location: 'Borrowdale, Harare',
          image: '',
          category: 'Residential',
          link_label: 'View Project',
          link: '#'
        },
        {
          title: 'Skyline Office Park',
          description: '12,000 m² commercial build featuring flexible office pods and rooftop lounges.',
          location: 'Sandton, Johannesburg',
          image: '',
          category: 'Commercial',
          link_label: 'View Project',
          link: '#'
        },
        {
          title: 'Evergreen Estates',
          description: 'Eco-friendly gated community with rainwater harvesting and EV-ready garages.',
          location: 'Centurion, Pretoria',
          image: '',
          category: 'Mixed-Use',
          link_label: 'View Project',
          link: '#'
        }
      ]
    },
    testimonials: {
      heading: 'See What Our Clients Say',
      reviews: [
        { client_name: 'Michael & Sarah Johnson', quote: 'Our site visit happened within 48 hours. Their project team kept us updated daily and delivered a flawless result.', rating: 5, project_type: 'Residential Remodel' },
        { client_name: 'Northside Medical Group', quote: 'BuildRight delivered our private clinic with zero downtime. Professional, responsive, and solutions-driven.', rating: 5, project_type: 'Commercial Build' },
        { client_name: 'David Wilson', quote: 'They hand-held us through the entire process—from council approvals to finishes. Outstanding service.', rating: 5, project_type: 'Custom Home' }
      ]
    },
    process: {
      heading: 'How We Work',
      subheading: 'A defined four-step workflow keeps your build organised and predictable.',
      steps: [
        { title: 'Consultation & Site Visit', description: 'We capture your goals, budget, and site conditions to outline scope and timelines.', icon: '1' },
        { title: 'Custom Project Plan', description: 'Our engineers produce detailed drawings, approvals, and procurement schedules.', icon: '2' },
        { title: 'Construction Phase', description: 'Site supervisors coordinate trades, quality checks, and weekly milestone reports.', icon: '3' },
        { title: 'Final Inspection & Handover', description: 'We complete snag lists, compliance sign-offs, and provide a maintenance manual.', icon: '4' }
      ],
      cta_label: 'Start Your Project',
      cta_link: '#contact'
    },
    packages: {
      heading: 'Choose the Right Plan for Your Project',
      subheading: 'Flexible engagement models designed for projects of every scale.',
      package_list: [
        {
          name: 'Basic Package',
          description: 'Ideal for small renovations and home improvements.',
          price: 'From $8,500',
          timeline: '4 – 6 weeks',
          features: 'On-site project manager\nCertified trade professionals\nQuality assurance checklist',
          cta_label: 'Get Quote',
          cta_link: 'https://calendly.com/buildrightconstruction'
        },
        {
          name: 'Standard Package',
          description: 'Perfect for new home builds and medium commercial spaces.',
          price: 'From $45,000',
          timeline: '10 – 16 weeks',
          features: 'Dedicated project coordinator\nWeekly progress reports\nInterior finishing guidance',
          cta_label: 'Book a Site Visit',
          cta_link: 'https://calendly.com/buildrightconstruction/site-visit'
        },
        {
          name: 'Premium Package',
          description: 'For full-scale developments with premium finishes & custom engineering.',
          price: 'From $120,000',
          timeline: '20+ weeks',
          features: 'Executive project oversight\nSupplier & compliance management\nPost-completion support',
          cta_label: 'Request Proposal',
          cta_link: 'mailto:projects@buildrightconstruction.com'
        }
      ]
    },
    cta_banner: {
      heading: 'Let’s Build Something Great Together',
      subheading: 'Request a free estimate today and get your project started within 7 days.',
      primary_label: 'Request a Quote Now',
      primary_link: 'https://calendly.com/buildrightconstruction',
      secondary_label: 'Download Company Profile',
      secondary_link: '#'
    },
    appointments: {
      booking_url: 'https://calendly.com/buildrightconstruction',
      section_title: 'Ready to Start Your Project?',
      section_description: 'Schedule a consultation or request a site visit in one click.',
      booking_text: 'Schedule Consultation',
      estimate_text: 'Request Free Estimate'
    },
    contact_form: {
      form_title: 'Talk to Our Experts',
      form_description: 'Share your project goals and we’ll respond with a tailored plan within 24 hours.',
      success_message: 'Thank you! Our project strategist will reach out shortly.'
    },
    contact: {
      phone: '+27 82 123 4567',
      whatsapp: '+27 82 123 4567',
      email: 'hello@buildrightconstruction.com',
      address: '45 Builders Avenue, Sandton, Johannesburg',
      map_url: 'https://maps.google.com/?q=BuildRight+Construction'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '07:30', close_time: '17:30', is_closed: false },
        { day: 'tuesday', open_time: '07:30', close_time: '17:30', is_closed: false },
        { day: 'wednesday', open_time: '07:30', close_time: '17:30', is_closed: false },
        { day: 'thursday', open_time: '07:30', close_time: '17:30', is_closed: false },
        { day: 'friday', open_time: '07:30', close_time: '17:30', is_closed: false },
        { day: 'saturday', open_time: '08:00', close_time: '13:00', is_closed: false },
        { day: 'sunday', open_time: '', close_time: '', is_closed: true }
      ]
    },
    social: {
      social_links: [
        { platform: 'facebook', url: 'https://facebook.com/buildrightconstruction', username: 'BuildRight Construction' },
        { platform: 'instagram', url: 'https://instagram.com/buildrightconstruction', username: '@buildrightconstruction' },
        { platform: 'linkedin', url: 'https://linkedin.com/company/buildrightconstruction', username: 'BuildRight Construction' }
      ]
    },
    language: {
      template_language: 'en'
    },
    seo: {
      meta_title: 'BuildRight Construction | Trusted Construction Company',
      meta_description: 'From residential homes to commercial complexes, BuildRight Construction delivers superior builds with transparent pricing and on-time delivery.',
      keywords: 'construction company, home builder, commercial construction, renovations',
      og_image: ''
    },
    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    footer: {
      footer_text: 'BuildRight Construction • Licensed, insured, and committed to safety on every site.',
      footer_links: [
        { title: 'About', url: '#about' },
        { title: 'Services', url: '#services' },
        { title: 'Contact', url: '#contact' }
      ]
    },
    copyright: {
      text: '© 2025 BuildRight Construction. All rights reserved.'
    }
  }
};
