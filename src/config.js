/**
 * Centralized Product Campaign Configuration
 * -------------------------------------------
 * Customize this single configuration file to adapt the landing page
 * for any product, brand, phone number, or UGC campaign.
 */

export const productConfig = {
  brand: {
    name: 'AURA Studio',
    shortName: 'AURA',
    tagline: 'Ambient Acoustic Sanctuary',
    category: 'Lifestyle Acoustics & Design',
    logoText: 'AURA',
    logoSubtext: 'STUDIO',
  },

  contact: {
    // International WhatsApp number (country code + number without '+' or spaces for the wa.me link)
    // Placeholder default: '15557294820' (Replace with your actual verified business WhatsApp number)
    whatsappRaw: '15557294820',
    whatsappDisplay: '+1 (555) 729-4820',
    whatsappPrefill: "Hi, I'm interested in your products and would like more information.",

    // Direct voice phone number (with '+' for tel: protocol)
    // Placeholder default: '+15557294820' (Replace with your actual business telephone number)
    phoneRaw: '+15557294820',
    phoneDisplay: '+1 (555) 729-4820',

    email: 'inquiries@aurastudio.design',
    hours: 'Mon – Fri, 9am – 6pm EST',
    address: '142 Mercer Street, Soho, New York, NY 10012',
  },

  /**
   * Floating Contact Toolbar, Chatbot & Welcome Popup Configuration
   * -----------------------------------------------------------------
   * Configure the floating vertical toolbar, WhatsApp prefilled message,
   * phone call link, guided FAQ chatbot assistant, quick actions, and
   * the automatic 4-second welcome popup.
   */
  contactWidget: {
    // 1. WhatsApp Configuration
    whatsapp: {
      number: '15557294820', // Configurable WhatsApp phone number in international format
      displayNumber: '+1 (555) 729-4820',
      prefilledMessage: "Hi, I'm interested in your products and would like more information.",
      tooltip: 'WhatsApp',
      ariaLabel: 'Chat with us on WhatsApp (opens in new tab)',
    },

    // 2. Phone Call Integration
    phone: {
      number: '+15557294820', // Configurable telephone link (tel:)
      displayNumber: '+1 (555) 729-4820',
      tooltip: 'Call Us',
      ariaLabel: 'Call our team directly at +1 (555) 729-4820',
    },

    // 3. Guided FAQ Chatbot Assistant
    chatbot: {
      tooltip: 'Chat with Us',
      ariaLabel: 'Open concierge chatbot assistant',
      headerTitle: 'How can we help?',
      headerSubtitle: 'AURA Concierge • Guided FAQ Assistant',
      welcomeMessage:
        "Welcome to AURA Studio! 👋 I'm your guided product concierge. Select an inquiry below or type a question about our acoustic editions, materials, or private allocations.",
      typingDelayMs: 650,
      quickReplies: [
        {
          id: 'product-info',
          label: 'Product Information',
          reply:
            'AURA Studio is an ambient acoustic capsule crafted from high-density cast mineral composite and knurled solid brass. It features 360° omnidirectional acoustic dispersion, custom Neodymium full-range drivers, dual passive bass radiators, and up to 18 hours of playtime via USB-C.',
        },
        {
          id: 'pricing-availability',
          label: 'Pricing & Availability',
          reply:
            'Our standard Studio Travertine Edition is $389, and Matte Charcoal is $419. Each batch is hand-finished in numbered limited runs. Units are currently available for immediate dispatch within 2 business days with complimentary insured shipping.',
        },
        {
          id: 'talk-team',
          label: 'Talk to Our Team',
          reply:
            'Our studio concierge team is available Mon–Fri, 9am–6pm EST. You can connect with a specialist immediately via WhatsApp or call our studio line for bespoke orders, interior trade pricing, or private showroom viewings.',
          showActionButtons: true,
        },
        {
          id: 'shipping-warranty',
          label: 'Shipping & Warranty',
          reply:
            'We provide complimentary express courier dispatch in 100% plastic-free, impact-resistant moulded pulp packaging. Every capsule is protected by our 2-Year Craftsmanship Guarantee covering acoustic components, materials, and hardware.',
        },
      ],
      fallbackReply:
        "Thank you for your inquiry! While our concierge assistant is in guided FAQ mode, you can connect directly with our studio specialists via WhatsApp or call our direct line below for immediate personal assistance.",
    },

    // 4. Automatic Welcome Popup (appears after ~4 seconds)
    welcomePopup: {
      enabled: true,
      delayMs: 4000, // 4 seconds delay
      sessionStorageKey: 'aura_welcome_popup_dismissed',
      badge: 'AURA Concierge',
      message: 'Hi there! 👋 Need help choosing the right product?',
      acceptText: 'Chat with Us',
      dismissText: 'Maybe Later',
    },
  },

  hero: {
    eyebrow: 'MEET YOUR NEW FAVOURITE',
    title: 'Pure Acoustic Clarity. Crafted for Everyday Serenity.',
    description:
      'A warm, architectural acoustic capsule that blends 360° studio clarity with tactile minimalist design. Engineered for creative focus, morning rituals, and mindful living.',
    primaryCta: {
      text: 'Request Details',
      action: '#lead-form',
    },
    secondaryCta: {
      text: 'See It in Action',
      action: '#product-slider',
    },
    highlights: [
      { label: 'Battery Life', value: '18h Playtime' },
      { label: 'Acoustic Wave', value: '360° Omnidirectional' },
      { label: 'Materials', value: 'Cast Stone & Brass' },
    ],
  },

  // Premium UGC Video Carousel (Vertical 9:16 Cards)
  ugcReels: [
    {
      id: 'reel-1',
      creator: 'Elena Rostova',
      handle: '@elena.design',
      avatar: 'E',
      role: 'Interior Stylist',
      title: 'Morning Ritual & Acoustic Warmth',
      caption: '“Pour-over coffee paired with 360° sound from this stone speaker. Pure sculpture on my island.”',
      productTag: 'Studio Travertine Edition',
      duration: '0:34',
      poster: '/images/ugc_reel_1.jpg',
      videoSrc: '/videos/reel_1.mp4', // If present, plays real MP4 video; falls back smoothly to high-res poster
      alt: 'Elena pouring pour-over coffee on marble counter with AURA Studio speaker',
    },
    {
      id: 'reel-2',
      creator: 'Alex Morgan',
      handle: '@alex_creates',
      avatar: 'A',
      role: 'Architectural Designer',
      title: 'Drafting Desk & Tactile Dial',
      caption: '“The knurled solid brass volume dial is so satisfying. Calibrated resistance makes all the difference.”',
      productTag: 'Matte Charcoal & Brass',
      duration: '0:42',
      poster: '/images/ugc_reel_2.jpg',
      videoSrc: '/videos/reel_2.mp4',
      alt: 'Architect hand adjusting brass volume dial on speaker at sunlit drafting desk',
    },
    {
      id: 'reel-3',
      creator: 'Sophia Lindqvist',
      handle: '@sophia_reads',
      avatar: 'S',
      role: 'Author & Curator',
      title: 'Terrace Golden Hour Reading',
      caption: '“Took it outside for evening reading. The acoustic clarity in open air is stunning and full.”',
      productTag: 'All-Weather Mineral Core',
      duration: '0:28',
      poster: '/images/ugc_reel_3.jpg',
      videoSrc: '/videos/reel_3.mp4',
      alt: 'Sophia reading on outdoor sunlit terrace patio with AURA speaker',
    },
    {
      id: 'reel-4',
      creator: 'Sarah Jenkins',
      handle: '@sarah.reviews',
      avatar: 'S',
      role: 'Design Reviewer',
      title: 'Travertine Cast Unboxing',
      caption: '“The substantial weight of this real mineral composite eliminates all cabinet vibration.”',
      productTag: 'Plastic-Free Craft Box',
      duration: '0:55',
      poster: '/images/ugc_reel_4.jpg',
      videoSrc: '/videos/reel_4.mp4',
      alt: 'Hands unboxing textured travertine stone speaker from eco-friendly packaging',
    },
    {
      id: 'reel-5',
      creator: 'Marcus Vance',
      handle: '@marcus.sound',
      avatar: 'M',
      role: 'Music Producer',
      title: 'Evening Vinyl & Ambient Glow',
      caption: '“Tuned for warm mids and clean resonance without synthetic bass boost. Perfect for night listening.”',
      productTag: 'Hi-Res Lossless Audio',
      duration: '0:36',
      poster: '/images/ugc_reel_5.jpg',
      videoSrc: '/videos/reel_5.mp4',
      alt: 'Evening cozy living room with mushroom lamp, record player and acoustic sound capsule',
    },
    {
      id: 'reel-6',
      creator: 'Freja Holm',
      handle: '@nordic_minimal',
      avatar: 'F',
      role: 'Nordic Living Stylist',
      title: 'Scandinavian Shelf Styling',
      caption: '“A speaker that looks like an intentional ceramic art object rather than disposable plastic tech.”',
      productTag: 'Cast Stone Composite',
      duration: '0:31',
      poster: '/images/ugc_reel_6.jpg',
      videoSrc: '/videos/reel_6.mp4',
      alt: 'Stylist placing acoustic speaker on floating timber shelf beside ceramic vases',
    },
  ],
  // Retain alias for backward compatibility
  slider: [],


  about: {
    badge: 'THE CRAFT & PHILOSOPHY',
    headline: 'Sound That Feels Like Part of Your Architecture',
    lead: 'Most portable audio is loud, glossy, and visually distracting. We designed AURA Studio to be the opposite: an acoustic presence that calms the senses before you even press play.',
    paragraphs: [
      'Engineered for those who value quiet luxury, intentional spaces, and tactile simplicity. Hand-assembled with solid brushed brass dials, bespoke woven acoustic textiles, and high-density mineral enclosures that eliminate unwanted resonance.',
      'Whether filling a sun-drenched kitchen at dawn or providing gentle acoustic warmth during deep evening work, AURA delivers uncompressed acoustic fidelity without cluttering your environment.',
    ],
    specs: [
      { label: 'Drivers', value: '2 × 48mm Full-Range + Dual Passive Radiators' },
      { label: 'Frequency Response', value: '48Hz – 22,000Hz (Hi-Res Audio)' },
      { label: 'Connectivity', value: 'Bluetooth 5.4 + USB-C Lossless Audio' },
      { label: 'Craftsmanship', value: 'Solid Knurled Brass, Cast Mineral Core' },
    ],
    images: [
      {
        src: '/images/about_brand.jpg',
        alt: 'AURA Studio acoustic capsule speaker harmoniously placed on a timber shelf in a calm interior',
        title: 'Architectural Placement',
        badge: 'Cast Mineral Enclosure',
      },
      {
        src: '/images/hero_product.jpg',
        alt: 'Front profile of AURA Studio speaker resting on warm travertine stone plinth',
        title: 'Travertine Edition',
        badge: 'Zero Resonance Body',
      },
      {
        src: '/images/slider_craft.jpg',
        alt: 'Macro view of tactile knurled solid brass volume dial with damped analog resistance',
        title: 'Tactile Controls',
        badge: 'Solid Brass Knurling',
      },
      {
        src: '/images/slider_lifestyle.jpg',
        alt: 'AURA Studio sound capsule positioned alongside ceramic cup and notebook on oak desk',
        title: 'Studio Rituals',
        badge: '360° Omnidirectional Sound',
      },
      {
        src: '/images/ugc_workspace.jpg',
        alt: 'Architect drafting blueprints with hand resting smoothly on AURA speaker dial',
        title: 'Craft Focus',
        badge: 'Hi-Res Lossless Sync',
      },
    ],
  },

  brandWall: {
    eyebrow: 'TRUSTED BY LEADING BRANDS',
    headline: 'Recognized Across Design, Sound & Living',
    lead: 'Featured and celebrated by leading publications, architectural innovators, and acoustic connoisseurs worldwide.',
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

  // Backward compatibility alias
  trust: {
    headline: 'Trusted by Leading Brands',
    subheadline: 'Featured and celebrated by leading publications, architectural innovators, and acoustic connoisseurs worldwide.',
  },

  ugcShowcase: [
    {
      id: 'ugc-1',
      creator: 'Elena Rostova',
      handle: '@elena.design',
      role: 'Interior Stylist',
      caption: '“My morning pour-over ritual isn’t complete without this playing soft jazz in the background. The design is pure sculpture.”',
      image: '/images/ugc_morning.jpg',
      alt: 'Elena pouring morning coffee on a marble kitchen island with AURA Studio speaker',
      type: 'Morning Routine',
      duration: '0:34',
    },
    {
      id: 'ugc-2',
      creator: 'Marcus Vance',
      handle: '@marcus_arch',
      role: 'Architect & Creator',
      caption: '“The tactile brass dial is pure bliss. It feels like an instrument, not another disposable tech gadget. Sits on my drafting desk 24/7.”',
      image: '/images/ugc_workspace.jpg',
      alt: 'Marcus sketching architectural blueprints with hand on AURA speaker dial',
      type: 'Studio Desk Setup',
      duration: '0:48',
    },
    {
      id: 'ugc-3',
      creator: 'Sophia Lindqvist',
      handle: '@sophia_reads',
      role: 'Curator & Writer',
      caption: '“Took it out to the terrace for golden hour reading. The acoustic dispersion outdoors is astonishingly clear and rich.”',
      image: '/images/ugc_outdoor.jpg',
      alt: 'Sophia reading a book on a terrace patio at sunset with AURA Studio speaker',
      type: 'Terrace Living',
      duration: '0:26',
    },
  ],

  gallery: {
    eyebrow: 'CURATED PERSPECTIVES',
    headline: 'Form, Texture & Spatial Harmony',
    lead: 'An editorial visual archive exploring the architectural lines, cast-stone materiality, and tactile acoustics of AURA Studio.',
    images: [
      {
        id: 'gallery-1',
        title: 'AURA Capsule — Travertine Edition',
        description: 'Sculptural cast-stone acoustic enclosure engineered with zero cabinet resonance and organic tactile warmth.',
        src: '/images/hero_product.jpg',
        alt: 'AURA Studio acoustic sound capsule in travertine stone composite with brass control knob',
        tag: 'Architectural Form',
        ratio: 'portrait',
      },
      {
        id: 'gallery-2',
        title: 'Dual Transducer Acoustic Core',
        description: 'Custom 48mm neodymium drivers paired with balanced passive radiators for deep, uncompressed 360-degree bass.',
        src: '/images/slider_craft.jpg',
        alt: 'Exploded internal detail showing dual neodymium audio drivers and brass chassis',
        tag: 'Acoustic Engineering',
        ratio: 'landscape',
      },
      {
        id: 'gallery-3',
        title: 'Morning Ritual & Pour-Over Focus',
        description: 'Warm natural light reflecting off the stone texture in a calm, mindful kitchen environment.',
        src: '/images/ugc_morning.jpg',
        alt: 'AURA Studio speaker resting on stone kitchen island beside pour-over coffee carafe',
        tag: 'Daily Ritual',
        ratio: 'square',
      },
      {
        id: 'gallery-4',
        title: 'Architectural Drafting Studio',
        description: 'Harmoniously nestled among vellum blueprint rolls, lead drafting pencils, and natural walnut work surfaces.',
        src: '/images/ugc_workspace.jpg',
        alt: 'Architect hand turning the knurled brass volume dial on drafting table',
        tag: 'Studio Setup',
        ratio: 'portrait',
      },
      {
        id: 'gallery-5',
        title: 'Living Room Spatial Sanctuary',
        description: 'Omnidirectional dispersion creating an inviting, room-filling soundstage on timber shelving.',
        src: '/images/about_brand.jpg',
        alt: 'AURA Studio speaker placed on minimalist timber shelf in tranquil living space',
        tag: 'Interior Spatial',
        ratio: 'landscape',
      },
      {
        id: 'gallery-6',
        title: 'Golden Hour Terrace Gathering',
        description: '18-hour continuous battery reserve delivering rich, mellow acoustic dispersion in open outdoor air.',
        src: '/images/ugc_outdoor.jpg',
        alt: 'Evening patio setting with AURA speaker playing beside book and iced beverage',
        tag: 'Terrace Living',
        ratio: 'landscape',
      },
      {
        id: 'gallery-7',
        title: 'Machined Brass Tactile Dial',
        description: 'Weighted analog rotary dial machined from solid unlacquered brass with silky damped mechanical resistance.',
        src: '/images/slider_lifestyle.jpg',
        alt: 'Close-up macro of knurled solid brass rotary dial and textured stone casing',
        tag: 'Material Detail',
        ratio: 'square',
      },
      {
        id: 'gallery-8',
        title: 'Sustainable Unbleached Unboxing',
        description: 'Recycled molded paper pulp enclosure and custom woven linen USB-C audio interconnect cable.',
        src: '/images/ugc_reel_1.jpg',
        alt: 'AURA Studio unboxing presentation with molded paper casing and braided cable',
        tag: 'Packaging & Craft',
        ratio: 'portrait',
      },
      {
        id: 'gallery-9',
        title: 'Nighttime Ambient Harmony',
        description: 'Intimate frequency tuning balanced for low-volume evening reading, meditation, and quiet reflection.',
        src: '/images/ugc_reel_3.jpg',
        alt: 'Soft ambient desk lamp lighting illuminating AURA Studio speaker during evening focus session',
        tag: 'Evening Sanctuary',
        ratio: 'landscape',
      },
    ],
  },

  testimonials: [
    {
      id: 'testimonial-1',
      name: 'Julian Campbell',
      role: 'Interior Architect',
      location: 'New York',
      edition: 'Studio Travertine Edition',
      initials: 'JC',
      quote:
        'The acoustic clarity is breathtaking. Voices and acoustic instruments sound as if they are live in the room. Plus, it looks like a piece of art on my sideboard.',
      rating: 5,
      date: 'Verified order • 2 weeks ago',
    },
    {
      id: 'testimonial-2',
      name: 'Claire Dupont',
      role: 'Design Curator',
      location: 'Paris',
      edition: 'Architectural Edition',
      initials: 'CD',
      quote:
        'I appreciate that it doesn’t require an app or an account. Just turn the brass dial and enjoy. A rare product that values tactile quality over gimmicks.',
      rating: 5,
      date: 'Verified order • 1 month ago',
    },
    {
      id: 'testimonial-3',
      name: 'Mateo Rossi',
      role: 'Acoustic Sound Designer',
      location: 'Milan',
      edition: 'Dual-Sync Stereo Pair',
      initials: 'MR',
      quote:
        'The build quality exceeded all expectations. It has substantial weight, smooth weighted dial friction, and the battery easily lasts through days of focused work.',
      rating: 5,
      date: 'Verified order • 3 weeks ago',
    },
    {
      id: 'testimonial-4',
      name: 'Elena Kova',
      role: 'Minimalist Spatial Stylist',
      location: 'Copenhagen',
      edition: 'Studio Travertine Edition',
      initials: 'EK',
      quote:
        'Finally a speaker that respects interior architectural quietude. The cast stone enclosure has zero synthetic rattle, even with orchestral double bass.',
      rating: 5,
      date: 'Verified order • 1 month ago',
    },
    {
      id: 'testimonial-5',
      name: 'Arthur Lindqvist',
      role: 'Creative Director',
      location: 'London',
      edition: 'Solid Brass Studio Edition',
      initials: 'AL',
      quote:
        'The analog rotary dial gives tactile feedback that digital touchscreens simply cannot match. It has permanently replaced my desktop studio monitors.',
      rating: 5,
      date: 'Verified order • 5 days ago',
    },
    {
      id: 'testimonial-6',
      name: 'Shunji Nakata',
      role: 'Industrial Designer',
      location: 'Tokyo',
      edition: 'Dual-Sync Stereo Pair',
      initials: 'SN',
      quote:
        'Stereo pairing two units across our cedar wood dining table transformed our evenings. Warm, omnidirectional dispersion with sublime analog presence.',
      rating: 5,
      date: 'Verified order • 2 weeks ago',
    },
  ],

  faqs: [
    {
      question: 'What makes AURA Studio different from standard Bluetooth speakers?',
      answer:
        'Most modern portable speakers use lightweight molded plastics and aggressive digital processing that fatigue the ears. AURA Studio is constructed with high-density mineral composite and solid brass, reducing cabinet resonance and providing authentic, balanced 360° sound with warm acoustic depth.',
    },
    {
      question: 'What are the dimensions, weight, and battery performance?',
      answer:
        'AURA Studio measures 210mm × 115mm × 98mm and weighs 1.45 kg (giving it stable acoustic inertia). The internal high-capacity battery provides up to 18 hours of continuous playback at moderate listening levels on a single USB-C charge.',
    },
    {
      question: 'Can I connect multiple units for stereo sound?',
      answer:
        'Yes. With our Dual-Sync feature, you can press and hold the brass power toggle for 3 seconds to wirelessly link two AURA Studio capsules into a true left/right stereo pair with wide soundstage imaging.',
    },
    {
      question: 'How do I purchase or request private availability?',
      answer:
        'Because each edition is hand-finished in small production batches, you can request an allocation by submitting the lead form on this page or reaching out directly via WhatsApp. Our concierge team will confirm current availability and dispatch details.',
    },
    {
      question: 'What is the shipping timeline and warranty coverage?',
      answer:
        'Orders are dispatched within 2 business days in secure, plastic-free custom packaging. All units include a 2-Year Craftsmanship Guarantee covering materials, driver mechanics, and electronic components.',
    },
    {
      question: 'Can I contact the team with custom inquiries or gifting requests?',
      answer:
        'Absolutely. You can click the WhatsApp button on this page to chat directly with our team or call our direct line during studio hours (Mon–Fri, 9am–6pm EST).',
    },
  ],
};
