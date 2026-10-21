/**
 * AURA Studio — Photography & UGC Production Agency Configuration
 * -----------------------------------------------------------------
 * Full-service dark creative studio crafting bespoke photography,
 * vertical UGC videos, and high-converting social campaigns.
 */

export const productConfig = {
  brand: {
    name: 'AURA Studio',
    shortName: 'AURA',
    tagline: 'Photography & UGC Production Agency',
    category: 'Creator-Led Production & Editorial Shoots',
    logoText: 'AURA',
    logoSubtext: 'STUDIO',
  },

  contact: {
    whatsappRaw: '15557294820',
    whatsappDisplay: '+1 (555) 729-4820',
    whatsappPrefill: "Hi, I'm interested in booking a UGC photoshoot or production batch with AURA Studio.",

    phoneRaw: '+15557294820',
    phoneDisplay: '+1 (555) 729-4820',

    email: 'production@aurastudio.design',
    hours: 'Mon – Fri, 9am – 6pm EST',
    address: '142 Mercer Street, Soho, New York, NY 10012',
  },

  contactWidget: {
    whatsapp: {
      number: '15557294820',
      displayNumber: '+1 (555) 729-4820',
      prefilledMessage: "Hi, I'm interested in booking a UGC photoshoot or production batch with AURA Studio.",
      tooltip: 'WhatsApp',
      ariaLabel: 'Chat with our production director on WhatsApp (opens in new tab)',
    },

    phone: {
      number: '+15557294820',
      displayNumber: '+1 (555) 729-4820',
      tooltip: 'Call Us',
      ariaLabel: 'Call our studio production line directly at +1 (555) 729-4820',
    },

    chatbot: {
      tooltip: 'Chat with Us',
      ariaLabel: 'Open concierge chatbot assistant',
      headerTitle: 'AURA Studio Concierge',
      headerSubtitle: 'Production & UGC Consultation',
      welcomeMessage:
        "Welcome to AURA Studio! 👋 We are a dark creative studio specializing in macro photography and vertical UGC video production. How can we assist your brand today?",
      typingDelayMs: 650,
      quickReplies: [
        {
          id: 'pricing-packages',
          label: 'Production Packages',
          reply:
            'We offer Starter UGC Batches (5 vertical videos + 10 macro photos), Scale Campaigns (10–15 videos + full studio sets), and Monthly Retainers with dedicated creator rosters and continuous testing.',
        },
        {
          id: 'turnaround',
          label: 'Turnaround Timeline',
          reply:
            'Standard delivery is 7–10 business days from the date your products arrive at our Soho studio. We also provide a 72-hour express dispatch for urgent launches.',
        },
        {
          id: 'creator-roster',
          label: 'Creator Casting',
          reply:
            'We manage a vetted roster of over 150 on-camera creators across beauty, skincare, fashion, design, and wellness. We match talent directly based on your target demographic.',
        },
        {
          id: 'talk-director',
          label: 'Talk to Production Director',
          reply:
            'Our creative director is available for project inquiries, custom moodboard reviews, and rate quotes. Connect directly via WhatsApp or call our studio line below.',
          showActionButtons: true,
        },
      ],
      fallbackReply:
        "Thank you for your inquiry! You can connect directly with our studio specialists via WhatsApp or call our line below for immediate custom production proposals.",
    },

    welcomePopup: {
      enabled: true,
      delayMs: 4000,
      sessionStorageKey: 'aura_welcome_popup_dismissed',
      badge: 'AURA Production Concierge',
      message: 'Planning a product shoot or UGC campaign? Let’s build your production deck.',
      acceptText: 'Inquire Now',
      dismissText: 'Maybe Later',
    },
  },

  ugcIntro: {
    enabled: true,
    metaScene: '[SCENE 00] PROLOGUE // CREATOR SHOWREEL',
    fpsTag: '4K · 24 FPS · 50MM F/1.2 CINE',
    headline: 'AUTHENTIC CREATORS. HIGH-IMPACT SHOOTS.',
    subtitle: 'AURA Studio — Where scroll-stopping brand content comes to life.',
    scrollPrompt: 'SCROLL TO EXPLORE',
    videoCaption: 'ENGINEERED TO CONVERT.',
    videoSrc: '/videos/intro_ugc.mp4',
    poster: '/images/ugc_studio_shoot.jpg',
    floatingFrames: [
      {
        id: 'frame-1',
        image: '/images/ugc_creator_bts.jpg',
        alt: 'Creator filming vertical video on set',
        label: 'Moment 01 // Vertical BTS',
      },
      {
        id: 'frame-2',
        image: '/images/ugc_beauty_macro.jpg',
        alt: 'Macro beauty and skincare product demonstration',
        label: 'Moment 02 // Macro Beauty',
      },
    ],
    transitionCue: 'Explore Overview & Inquiries',
  },

  hero: {
    eyebrow: 'CREATIVE STUDIO & UGC PRODUCTION',
    title: 'High-Impact Visuals. Crafted for Cult Brands.',
    description:
      'A full-service dark creative studio crafting bespoke photography, vertical UGC videos, and high-converting social campaigns. Macro beauty, creator sets, and editorial studio production.',
    primaryCta: {
      text: 'Book a Photoshoot',
      action: '#lead-form',
    },
    secondaryCta: {
      text: 'Explore Showreel',
      action: '#product-slider',
    },
    highlights: [
      { label: 'Vertical Video', value: '4K / 9:16 First' },
      { label: 'Studio & Set', value: 'Cinema Lighting' },
      { label: 'Turnkey Roster', value: 'Vetted UGC Talent' },
    ],
  },

  ugcReels: [
    {
      id: 'reel-1',
      creator: 'Elena Rostova',
      handle: '@elena.ugc',
      avatar: 'E',
      role: 'Beauty & Skincare Creator Director',
      title: 'Macro Skincare Routine & Dewy Glow',
      caption: '“Close-up texture and macro product application that stops the thumb in the first 2 seconds.”',
      productTag: 'Macro Beauty Shoot',
      duration: '0:34',
      poster: '/images/ugc_beauty_macro.jpg',
      videoSrc: '/videos/reel_1.mp4',
      alt: 'Macro beauty and skincare photoshoot with studio lighting',
    },
    {
      id: 'reel-2',
      creator: 'Alex Morgan',
      handle: '@alex.shoots',
      avatar: 'A',
      role: 'Creator BTS & Vertical Specialist',
      title: 'Behind-The-Scenes Studio Filming',
      caption: '“Filming on set with 9:16 phone rigs and diffused key lights for genuine creator authenticity.”',
      productTag: 'Vertical Smartphone Cam',
      duration: '0:42',
      poster: '/images/ugc_creator_bts.jpg',
      videoSrc: '/videos/reel_2.mp4',
      alt: 'Creator filming vertical video with smartphone and studio lighting',
    },
    {
      id: 'reel-3',
      creator: 'Sophia Lindqvist',
      handle: '@sophia.lifestyle',
      avatar: 'S',
      role: 'Fashion & Lifestyle Creator',
      title: 'Editorial Lifestyle & Apparel UGC',
      caption: '“Natural movement and lifestyle context that feels like organic editorial rather than a paid ad.”',
      productTag: 'Fashion & Lifestyle',
      duration: '0:28',
      poster: '/images/ugc_fashion_lifestyle.jpg',
      videoSrc: '/videos/reel_3.mp4',
      alt: 'Fashion and lifestyle creator photoshoot with natural studio lighting',
    },
    {
      id: 'reel-4',
      creator: 'Sarah Jenkins',
      handle: '@sarah.tech',
      avatar: 'S',
      role: 'Production Tech & Gear Specialist',
      title: 'Cinema Rigs & Studio Setup',
      caption: '“Cinema cameras, wireless audio monitoring, and calibrated RGB tubes for consistent color fidelity.”',
      productTag: 'Creator Gear Setup',
      duration: '0:55',
      poster: '/images/ugc_creator_gear.jpg',
      videoSrc: '/videos/reel_4.mp4',
      alt: 'Cinema camera setup with RGB tube lights and microphone',
    },
    {
      id: 'reel-5',
      creator: 'Marcus Vance',
      handle: '@marcus.visuals',
      avatar: 'M',
      role: 'Studio Photoshoot Director',
      title: 'Dark Studio Softbox & Lighting Rig',
      caption: '“Diffused overhead softboxes and rim lighting sculpt dramatic shadows and natural skin tones.”',
      productTag: 'Commercial Studio Set',
      duration: '0:36',
      poster: '/images/ugc_studio_shoot.jpg',
      videoSrc: '/videos/reel_5.mp4',
      alt: 'Dark photography studio with softboxes and model photoshoot',
    },
    {
      id: 'reel-6',
      creator: 'Freja Holm',
      handle: '@freja.minimal',
      avatar: 'F',
      role: 'Minimalist Lifestyle Creator',
      title: 'Nordic Aesthetic Daily Routine',
      caption: '“Clean minimalist framing, calm natural pacing, and organic daily ritual integration.”',
      productTag: 'Lifestyle Routine',
      duration: '0:31',
      poster: '/images/ugc_morning.jpg',
      videoSrc: '/videos/reel_6.mp4',
      alt: 'Creator morning ritual and product demonstration',
    },
  ],
  slider: [],

  about: {
    badge: 'THE STUDIO PHILOSOPHY',
    headline: 'Creator-Led Content Engineered to Stop the Scroll',
    lead: 'Most social advertising feels generic, corporate, and instantly forgettable. AURA Studio crafts the exact opposite: authentic UGC photoshoots, vertical videos, and tactile product demonstrations that feel organically integrated into creator feeds.',
    paragraphs: [
      'From specialized macro beauty lighting to full-scale on-location lifestyle productions, we bridge the gap between polished commercial production value and genuine creator intimacy.',
      'Every photoshoot is carefully storyboarded, cast with charismatic vetted creators, and color-graded to match your brand’s unique editorial aesthetic.',
    ],
    specs: [
      { label: 'Production Format', value: '4K Ultra-HD & 9:16 Vertical Video' },
      { label: 'Creative Direction', value: 'Full Scripting, Storyboarding & Hook Testing' },
      { label: 'Creator Roster', value: 'Vetted UGC Directors & On-Camera Talent' },
      { label: 'Turnaround', value: '7–10 Business Days from Product Arrival' },
    ],
    images: [
      {
        src: '/images/ugc_studio_shoot.jpg',
        alt: 'Dark photography studio with softbox lighting and camera rig',
        title: 'Studio Production',
        badge: 'Cinema Lighting Setup',
      },
      {
        src: '/images/ugc_creator_bts.jpg',
        alt: 'Behind the scenes creator filming vertical video',
        title: 'Vertical Smartphone Filming',
        badge: '9:16 Vertical First',
      },
      {
        src: '/images/ugc_beauty_macro.jpg',
        alt: 'Macro skincare product photoshoot with dewy lighting',
        title: 'Macro Beauty & Skincare',
        badge: 'Editorial Precision',
      },
      {
        src: '/images/ugc_fashion_lifestyle.jpg',
        alt: 'Editorial fashion and lifestyle photoshoot',
        title: 'Fashion & Lifestyle UGC',
        badge: 'Authentic Creator Roster',
      },
      {
        src: '/images/ugc_creator_gear.jpg',
        alt: 'Cinema camera, RGB tube lights, and studio workstation',
        title: 'Camera & Studio Gear',
        badge: 'Turnkey Studio Hardware',
      },
    ],
  },

  brandWall: {
    eyebrow: 'TRUSTED BY LEADING BRANDS',
    headline: 'Trusted by High-Growth DTC & Global Brands',
    lead: 'Creating high-converting visual campaigns for brands scaling across TikTok, Instagram, and global ecommerce.',
    logos: [
      { name: 'Spotify', logoSrc: '/logos/spotify.svg' },
      { name: 'Apple', logoSrc: '/logos/apple.svg' },
      { name: 'Vite', logoSrc: '/logos/vite.svg' },
      { name: 'Figma', logoSrc: '/logos/figma.svg' },
      { name: 'GitHub', logoSrc: '/logos/github.svg' },
      { name: 'Google', logoSrc: '/logos/google.svg' },
      { name: 'JavaScript', logoSrc: '/logos/javascript.svg' },
      { name: 'Discord', logoSrc: '/logos/discord.svg' },
      { name: 'Bluesky', logoSrc: '/logos/bluesky.svg' },
      { name: 'X', logoSrc: '/logos/x.svg' },
    ],
  },

  trust: {
    headline: 'Trusted by High-Growth DTC & Global Brands',
    subheadline: 'Creating high-converting visual campaigns for brands scaling across TikTok, Instagram, and global ecommerce.',
  },

  ugcShowcase: [
    {
      id: 'ugc-1',
      creator: 'Elena Rostova',
      handle: '@elena.ugc',
      role: 'Beauty & Skincare Creator Director',
      caption: '“We tested 4 hook variations for this skincare launch. The macro texture shots drove an immediate 3.4x ROAS on TikTok Ads.”',
      image: '/images/ugc_beauty_macro.jpg',
      alt: 'Elena demonstrating skincare serum application in macro beauty studio',
      type: 'Macro Beauty Shoot',
      duration: '0:34',
    },
    {
      id: 'ugc-2',
      creator: 'Alex Morgan',
      handle: '@alex.shoots',
      role: 'Commercial UGC Producer',
      caption: '“Filming on set with vertical phone rigs combined with studio softboxes gives that perfect balance of native authenticity and high-end aesthetics.”',
      image: '/images/ugc_creator_bts.jpg',
      alt: 'Alex filming vertical video behind the scenes in studio',
      type: 'Studio Filming BTS',
      duration: '0:48',
    },
    {
      id: 'ugc-3',
      creator: 'Sophia Lindqvist',
      handle: '@sophia.lifestyle',
      role: 'Fashion & Lifestyle Stylist',
      caption: '“The lighting in the AURA studio brings out the subtle textures and silhouettes in lifestyle content without looking overly staged.”',
      image: '/images/ugc_fashion_lifestyle.jpg',
      alt: 'Sophia posing in natural daylight for lifestyle apparel campaign',
      type: 'Editorial Lifestyle',
      duration: '0:26',
    },
  ],

  gallery: {
    eyebrow: 'CURATED PORTFOLIO',
    headline: 'Editorial Photoshoots & Visual Production',
    lead: 'An archive of high-resolution studio captures, macro product photography, and vertical creator campaigns crafted for innovative modern brands.',
    images: [
      {
        id: 'gallery-1',
        title: 'Dark Studio Set // Softbox Rig',
        description: 'Professional darkroom photography studio with diffused overhead softboxes and cinema camera setup.',
        src: '/images/ugc_studio_shoot.jpg',
        alt: 'Dark photography studio with softboxes and camera rig',
        tag: 'Studio Production',
        ratio: 'portrait',
      },
      {
        id: 'gallery-2',
        title: 'Macro Beauty & Skincare Texture',
        description: 'Micro-droplets and rich cosmetic textures captured under high-CRI continuous studio illumination.',
        src: '/images/ugc_beauty_macro.jpg',
        alt: 'Macro skincare product photoshoot with dewy lighting',
        tag: 'Macro Beauty',
        ratio: 'landscape',
      },
      {
        id: 'gallery-3',
        title: 'Vertical Smartphone Creator Filming',
        description: 'Native 9:16 vertical smartphone camera rig capturing authentic creator-led demonstrations.',
        src: '/images/ugc_creator_bts.jpg',
        alt: 'Behind the scenes creator filming vertical video',
        tag: 'Creator BTS',
        ratio: 'square',
      },
      {
        id: 'gallery-4',
        title: 'Editorial Lifestyle & Fashion UGC',
        description: 'Natural poses and modern minimalist styling showcasing apparel and accessories in real settings.',
        src: '/images/ugc_fashion_lifestyle.jpg',
        alt: 'Editorial fashion and lifestyle photoshoot',
        tag: 'Fashion & Lifestyle',
        ratio: 'portrait',
      },
      {
        id: 'gallery-5',
        title: 'Cinema Cameras & RGB Studio Gear',
        description: 'High-speed cinema optics, calibrated RGB tube lights, and studio audio engineering.',
        src: '/images/ugc_creator_gear.jpg',
        alt: 'Cinema camera, RGB tube lights, and studio workstation',
        tag: 'Production Hardware',
        ratio: 'landscape',
      },
      {
        id: 'gallery-6',
        title: 'Golden Hour Outdoor Lifestyle Shoot',
        description: 'Natural golden hour lighting on location capturing organic brand interactions and storytelling.',
        src: '/images/ugc_outdoor.jpg',
        alt: 'Outdoor golden hour lifestyle photoshoot',
        tag: 'On Location',
        ratio: 'landscape',
      },
      {
        id: 'gallery-7',
        title: 'Tactile Creator Workspace Interaction',
        description: 'Focusing on tactile hand interactions, materials, and genuine creator unboxing rituals.',
        src: '/images/ugc_workspace.jpg',
        alt: 'Creator hand interacting with product on clean desk',
        tag: 'Product Demonstration',
        ratio: 'square',
      },
      {
        id: 'gallery-8',
        title: 'Morning Routine Social Narrative',
        description: 'Soft morning light setting the scene for daily rituals and lifestyle brand integration.',
        src: '/images/ugc_morning.jpg',
        alt: 'Morning lifestyle routine creator shoot',
        tag: 'Daily Rituals',
        ratio: 'portrait',
      },
      {
        id: 'gallery-9',
        title: 'High-Impact 9:16 Vertical Reel Suite',
        description: 'Complete suites of TikTok and Instagram Reel videos engineered for maximum watch time.',
        src: '/images/ugc_reel_1.jpg',
        alt: 'Vertical smartphone reel capture',
        tag: 'Social First',
        ratio: 'landscape',
      },
    ],
  },

  testimonials: [
    {
      id: 'testimonial-1',
      name: 'Julian Campbell',
      role: 'Head of Growth, Solene Skincare',
      location: 'New York',
      edition: 'Full-Service UGC Batch',
      initials: 'JC',
      quote:
        'AURA Studio delivered 12 vertical UGC assets and 20 macro product photos that outperformed our previous agency assets by 240% in our paid media pipeline.',
      rating: 5,
      date: 'Verified client • 2 weeks ago',
    },
    {
      id: 'testimonial-2',
      name: 'Claire Dupont',
      role: 'Creative Director, Maison Vesper',
      location: 'Paris',
      edition: 'Macro Beauty Production',
      initials: 'CD',
      quote:
        'The dark studio lighting and attention to organic textures is unmatched. They do not just churn out cookie-cutter UGC; they craft authentic visual editorial.',
      rating: 5,
      date: 'Verified client • 1 month ago',
    },
    {
      id: 'testimonial-3',
      name: 'Mateo Rossi',
      role: 'Founder, Forma Objects',
      location: 'Milan',
      edition: 'Monthly UGC Retainer',
      initials: 'MR',
      quote:
        'Fast turnaround, exceptional creator casting, and turnkey delivery. From storyboard to finalized 4K ad cutdowns took under 9 business days.',
      rating: 5,
      date: 'Verified client • 2 months ago',
    },
  ],

  faqs: [
    {
      id: 'faq-1',
      question: 'How does AURA Studio select and match creators for shoots?',
      answer:
        'We maintain a curated, vetted roster of over 150 on-camera creators across beauty, fashion, lifestyle, tech, and wellness. We cast creators based on audience demographic match, authentic product affinity, on-camera charisma, and natural lighting setups.',
    },
    {
      id: 'faq-2',
      question: 'What types of media deliverables are included?',
      answer:
        'Every production package includes full-resolution 4K source footage, master 9:16 vertical videos with hooks and subtitles, high-resolution editorial product photography, and cutdowns formatted for TikTok, Instagram Reels, and YouTube Shorts.',
    },
    {
      id: 'faq-3',
      question: 'What is your typical production turnaround timeline?',
      answer:
        'From the date your products arrive at our New York studio, standard delivery is 7 to 10 business days. We also offer an expedited 72-hour fast-track for urgent product launches.',
    },
    {
      id: 'faq-4',
      question: 'Do we receive full commercial usage rights?',
      answer:
        'Yes. All delivered assets include 100% full commercial rights in perpetuity for paid digital ads (Meta, TikTok, Google, YouTube), organic social channels, websites, email campaigns, and Amazon listings.',
    },
    {
      id: 'faq-5',
      question: 'Can we provide custom scripts and creative moodboards?',
      answer:
        'Absolutely. We welcome brand-provided briefs and storyboards. Alternatively, our in-house creative directors can develop full scripts, hook variations, and visual concepts tailored to your brand goals.',
    },
  ],
};
