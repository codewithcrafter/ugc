/**
 * AURA Studio — Content & Production Configuration
 * -------------------------------------------------
 * Premium UGC content creation and product photography studio based in Delhi.
 * Core services: UGC video production, product photoshoots, lifestyle and beauty content,
 * creator casting, and creative advertising content.
 */

export const productConfig = {
  brand: {
    name: 'UGC Studio',
    shortName: 'UGC',
    tagline: 'MAKE YOUR BRAND ICONIC',
    category: 'CREATIVE UGC CONTENT CREATION · PRODUCT PHOTOSHOOT AND CREATOR CASTING',
    location: 'Delhi, India',
    logoText: 'UGC',
    logoSubtext: 'STUDIO',
  },

  contact: {
    whatsappRaw: '15557294820',
    whatsappDisplay: '+1 (555) 729-4820',
    whatsappPrefill: "Hi, I'm interested in working with UGC Studio.",

    phoneRaw: '+15557294820',
    phoneDisplay: '+1 (555) 729-4820',

    email: 'production@ugcstudio.design',
    hours: 'Mon – Sat, 10am – 7pm IST',
    address: 'Delhi, India',
  },

  contactWidget: {
    whatsapp: {
      number: '15557294820',
      displayNumber: '+1 (555) 729-4820',
      prefilledMessage: "Hi, I'm interested in working with UGC Studio.",
      tooltip: 'WhatsApp',
      ariaLabel: 'Chat with our studio team on WhatsApp (opens in new tab)',
    },

    phone: {
      number: '+15557294820',
      displayNumber: '+1 (555) 729-4820',
      tooltip: 'Call Us',
      ariaLabel: 'Call our Delhi studio line directly',
    },

    chatbot: {
      tooltip: 'Chat with Us',
      ariaLabel: 'Open concierge chatbot assistant',
      headerTitle: 'UGC Studio Concierge',
      headerSubtitle: 'UGC & Product Photography Consultation',
      welcomeMessage:
        "Welcome to UGC Studio! 👋 At UGC Studio, we provide you with the best user-generated content in Delhi. How can we help your brand today?",
      typingDelayMs: 650,
      quickReplies: [
        {
          id: 'services',
          label: 'Services Offered',
          reply:
            'We provide ugc video , product photoshoot  , lifestyle and beauty content , creative advertisement content . we customise plan according to every project.',
        },
        {
          id: 'turnaround',
          label: 'Project Timelines',
          reply:
            'Exact timeline can be decided after finalising the  project . it depends upon the project type           , size and project requirements.',
        },
        {
          id: 'who-can-work',
          label: 'Who can work with us',
          reply:
            'Brands wants a photoshoot ,  lifestyle, content creator, e commerce can contact us . we help them in creating suitable content according to their need .',
        },
        {
          id: 'custom-quote',
          label: 'Pricing & Quotation',
          reply:
            'Pricing depends upon brands content needs , content type, and delivery time . you can share your requirements.  we will discuss a suitable package and quotation according to your needs',
          showActionButtons: true,
        },
      ],
      fallbackReply:
        "Thank you for contacting UGC Studio! Connect with our team on WhatsApp or submit an inquiry.",
    },

    welcomePopup: {
      enabled: true,
      delayMs: 4000,
      sessionStorageKey: 'ugc_welcome_popup_dismissed',
      badge: 'UGC Studio',
      message: 'Looking for the best UGC video services or photoshoot in Delhi? Let’s talk.',
      acceptText: 'Inquire Now',
      dismissText: 'Maybe Later',
    },
  },

  ugcIntro: {
    enabled: true,
    metaScene: 'UGC STUDIO // 4K CINE',
    fpsTag: '4K · 24 FPS · 50MM F/1.2 CINE',
    headline: 'MAKE YOUR BRAND ICONIC',
    subtitle: 'UGC Studio Where Your Brand Becomes Iconic.',
    scrollPrompt: 'SCROLL TO EXPLORE',
    videoCaption: 'UGC STUDIO',
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
    transitionCue: 'Explore Work & Inquiries',
  },

  hero: {
    eyebrow: 'CREATIVE UGC  CONTENT CREATION  · PRODUCT PHOTOSHOOT  AND CREATOR CASTING',
    title: 'MAKE YOUR BRAND ICONIC',
    supporting: ' UGC Studio Where Your Brand Becomes Iconic.',
    description:
      'At UGC Studio, we provide you with the best user-generated content in Delhi that will make your brand unforgettable. From eye-catching photoshoot  to stop-scrolling content, as a UGC content creation agency,  we can create everything personalized  for your brand , that your brand needs to reach quality audience.We can customize everything according to what you need and what your brand needs .',
    primaryCta: {
      text: 'Book a Photoshoot',
      action: '#lead-form',
    },
    secondaryCta: {
      text: 'Explore Our Work',
      action: '#product-slider',
    },
    highlights: [
      { label: 'CREATIVE UGC', value: 'CONTENT CREATION' },
      { label: 'PRODUCT PHOTOSHOOT', value: 'AND CREATOR CASTING' },
    ],
  },

  ugcReels: [
    {
      id: 'reel-1',
      creator: 'UGC Studio',
      handle: '@ugcstudio.delhi',
      avatar: 'U',
      role: 'UGC Content Creation Agency',
      title: 'Authentic & Scroll-Stopping Content',
      caption: '“Our team will provide you  authentic and engaging UGC  video content that grabs attention and makes people stop scrolling.”',
      productTag: 'UGC Video',
      duration: '0:34',
      poster: '/images/ugc_beauty_macro.jpg',
      videoSrc: '/videos/reel_1.mp4',
      alt: 'Macro beauty and skincare product photoshoot',
    },
    {
      id: 'reel-2',
      creator: 'Expert team',
      handle: '@ugcstudio.delhi',
      avatar: 'E',
      role: 'Lighting, Camera Angle, Background & Editing',
      title: 'Professional Photoshoot in Delhi',
      caption: '“We create photoshoots that  improve their appearance. Our team is well trained in lighting , camera angle , background and editing .”',
      productTag: 'Photoshoot',
      duration: '0:42',
      poster: '/images/ugc_creator_bts.jpg',
      videoSrc: '/videos/reel_2.mp4',
      alt: 'Creator filming product demonstration on vertical camera rig',
    },
    {
      id: 'reel-3',
      creator: 'campaign creative',
      handle: '@ugcstudio.delhi',
      avatar: 'C',
      role: 'Creative Ad Visuals',
      title: 'Consistent & Attention Grabbing',
      caption: '“We create engaging ugc content , professional photos, creative ad visuals. Everything is created according to brand identity and needs .”',
      productTag: 'Campaign Creative',
      duration: '0:28',
      poster: '/images/ugc_fashion_lifestyle.jpg',
      videoSrc: '/videos/reel_3.mp4',
      alt: 'Fashion and lifestyle creator photoshoot on set',
    },
    {
      id: 'reel-4',
      creator: 'natural   aesthetics',
      handle: '@ugcstudio.delhi',
      avatar: 'N',
      role: 'Soft Lighting & Better Angles',
      title: 'Aesthetic and Highlighted',
      caption: '“We use soft lighting at better angles so that your product look aesthetic and highlighted . At UGC studio , our team understand the beauty of natural aesthetic .”',
      productTag: 'Natural Aesthetics',
      duration: '0:55',
      poster: '/images/ugc_creator_gear.jpg',
      videoSrc: '/videos/reel_4.mp4',
      alt: 'Studio camera setup with professional lighting equipment',
    },
    {
      id: 'reel-5',
      creator: 'PHOTOSHOOT THAT LOOK LUXURIOUS',
      handle: '@ugcstudio.delhi',
      avatar: 'P',
      role: 'Visuals that create impact',
      title: 'High Quality Product Photoshoot',
      caption: '“We create high quality  product photoshoot  that looks stunning. UGC studio is a well known ugc agency in delhi .”',
      productTag: 'Luxury Photoshoot',
      duration: '0:36',
      poster: '/images/ugc_studio_shoot.jpg',
      videoSrc: '/videos/reel_5.mp4',
      alt: 'Dark photography studio with model and softbox lighting',
    },
    {
      id: 'reel-6',
      creator: 'Life captured naturally',
      handle: '@ugcstudio.delhi',
      avatar: 'L',
      role: 'Everyday Activity Into Memorable Stories',
      title: 'Aesthetically Authentic',
      caption: '“We convert simple everyday activity into memorable stories. From morning ritual to gardening. Our team makes sure that everything look aesthetically authentic.”',
      productTag: 'Lifestyle',
      duration: '0:31',
      poster: '/images/ugc_morning.jpg',
      videoSrc: '/videos/reel_6.mp4',
      alt: 'Morning lifestyle routine and product showcase',
    },
  ],

  slider: [],

  about: {
    headline: 'luxury in every frame',
    paragraphs: [
      'We  create creative visuals for your that enhance your product features that help you to get more leads. From professional photoshoot to ugc video content . We focus on engaging video editing , and brand identity .',
      'We are not limited to taking good pictures. We focus on every single detail that makes your brand different from others; we provide you best photoshoot . we create visual that feel premium and luxurious',
    ],
    specs: [
      {
        num: '1',
        title: 'natural   aesthetics',
        desc: 'We use soft lighting at better angles so that your product look aesthetic and highlighted . At UGC studio , our team understand the beauty of natural aesthetic . We create the photoshoot and content that makes  your product look premium . ',
      },
      {
        num: '2',
        title: 'Expert team',
        desc: 'We create photoshoots that  improve their appearance. Our team is well trained in lighting , camera angle , background and editing .  we  provide you best ugc  photoshoot  in Delhi so that you can reach to  quality customers',
      },
      {
        num: '3',
        title: 'campaign creative',
        desc: 'We create engaging ugc content , professional photos, creative ad visuals. Everything is created according to brand identity and needs , so that it looks visually consistent and attention grabbing.',
      },
      {
        num: '4',
        title: 'authentic ugc story telling',
        desc: 'We create unique content for ugc , so that your product keep recognizable and remarkable. our team understand that every content has its own importance . so we create the best ugc content that help your brand to reach quality customers',
      },
    ],
    cta: 'Discuss Your Project',
    images: [
      {
        src: '/images/ugc_studio_shoot.jpg',
        alt: 'Professional studio photoshoot set with softbox lighting and camera rig',
        title: 'Studio Production',
        badge: 'Cinema Lighting Setup',
      },
      {
        src: '/images/ugc_creator_bts.jpg',
        alt: 'Behind the scenes creator filming vertical video',
        title: 'Creator Casting & Filming',
        badge: 'Authentic UGC',
      },
      {
        src: '/images/ugc_beauty_macro.jpg',
        alt: 'Macro skincare product photoshoot with dewy lighting',
        title: 'Macro Beauty & Skincare',
        badge: 'Detail & Lighting',
      },
      {
        src: '/images/ugc_fashion_lifestyle.jpg',
        alt: 'Editorial fashion and lifestyle photoshoot',
        title: 'Fashion & Lifestyle UGC',
        badge: 'Natural Context',
      },
      {
        src: '/images/ugc_creator_gear.jpg',
        alt: 'Cinema camera and studio lighting workstation',
        title: 'Camera & Studio Gear',
        badge: 'Professional Output',
      },
    ],
  },

  brandWall: {
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

  ugcShowcase: [
    {
      id: 'ugc-1',
      storyNumber: '1',
      title: 'experience 1',
      caption: 'I love how my morning ritual became my most favourite part of the day.from coffee to gardening. its  all about enjoying every  movement',
      image: '/images/ugc_morning.jpg',
      alt: 'experience 1',
      type: 'experience',
      categoryPill: '1',
      duration: '0:34',
    },
    {
      id: 'ugc-2',
      storyNumber: '2',
      title: 'experience 2',
      caption: 'I have learned that taking care of myself, enjoying every movement, and following my skincare routine. These small habits make me feel more balanced,  refreshed and connected to myself.',
      image: '/images/ugc_beauty_macro.jpg',
      alt: 'experience 2',
      type: 'experience',
      categoryPill: '2',
      duration: '0:48',
    },
    {
      id: 'ugc-3',
      storyNumber: '3',
      title: 'experience 3',
      caption: 'For me, personal styling is all about looking stylish and feeling confident. i like discovering new outfits that fits effortlessly in my everyday life and make my look more special',
      image: '/images/ugc_fashion_lifestyle.jpg',
      alt: 'experience 3',
      type: 'experience',
      categoryPill: '3',
      duration: '0:26',
    },
  ],

  gallery: {
    eyebrow: 'Visuals that create impact',
    headline: 'PHOTOSHOOT THAT LOOK LUXURIOUS',
    lead: 'We create high quality  product photoshoot  that looks stunning. UGC studio is a well known ugc agency in delhi .from camera angles to background, our team know everything. Our professional team can handle everything so that your product looks premium and recognisable  ',
    cta: 'Book a Photoshoot',
    images: [
      {
        id: 'gallery-1',
        title: '1 High Image Quality',
        description: 'Sharp Focus , clear image , high resolution ,proper exposure and many more . ugc content creation agency has the best team for photoshoot.',
        src: '/images/ugc_studio_shoot.jpg',
        alt: '1 High Image Quality',
        tag: 'High Image Quality',
        ratio: 'portrait',
      },
      {
        id: 'gallery-2',
        title: '2 Proper lighting',
        description: 'We know very well that proper lighting can enhance product details and features . Our team use right lighting techniques so that your product look more attractive and stunning',
        src: '/images/ugc_beauty_macro.jpg',
        alt: '2 Proper lighting',
        tag: 'Proper lighting',
        ratio: 'landscape',
      },
      {
        id: 'gallery-3',
        title: '3 Professional Editing –',
        description: 'Editing can make or break an image , but we just retouch the image without making the product look unrealistic . ugc studio can understand this very well that a good  editing can enhance the beauty of image while poor editing can take its natural beauty away.',
        src: '/images/ugc_creator_bts.jpg',
        alt: '3 Professional Editing –',
        tag: 'Professional Editing',
        ratio: 'square',
      },
      {
        id: 'gallery-4',
        title: '4 Creative Composition',
        description: 'Well-planned arrangement of lighting, background , camera angles, clear edge ,sharp focus,clear details that make every frame unique and picture perfect because we believe that  every frame has a different story.',
        src: '/images/ugc_fashion_lifestyle.jpg',
        alt: '4 Creative Composition',
        tag: 'Creative Composition',
        ratio: 'portrait',
      },
      {
        id: 'gallery-5',
        title: '5 best angles',
        description: 'The right camera angle can enhance the quality of a photo and highlight product features. Our agency will provide you the best photoshoot in Delhi . As we have a  highly qualified team for photoshoot ',
        src: '/images/ugc_creator_gear.jpg',
        alt: '5 best angles',
        tag: 'best angles',
        ratio: 'landscape',
      },
      {
        id: 'gallery-6',
        title: '6 visual storytelling',
        description: 'every product has its own story and we use perfect background , creative , editing so that your brand\'s story gets highlighted and connects with customers\' emotions and interest.',
        src: '/images/ugc_outdoor.jpg',
        alt: '6 visual storytelling',
        tag: 'visual storytelling',
        ratio: 'landscape',
      },
      {
        id: 'gallery-7',
        title: '7 clean background',
        description: 'A clear background can complement your product and draw attention to the product.We understand this very well  . We use a background that enhance the beauty of your product and increases sales . Either it can be a solid colour or any contrast we only use what suits your product',
        src: '/images/ugc_workspace.jpg',
        alt: '7 clean background',
        tag: 'clean background',
        ratio: 'square',
      },
      {
        id: 'gallery-8',
        title: '8 product styling',
        description: 'product styling is not just arranging the product , its more about beautiful and creative presentation of product . UGC studio style the product that make it more attractive, stunning and grab customers\' attention',
        src: '/images/ugc_morning.jpg',
        alt: '8 product styling',
        tag: 'product styling',
        ratio: 'portrait',
      },
      {
        id: 'gallery-9',
        title: '9 brand focus photoshoot',
        description: 'Every brand has its own identity and we understand that . We make sure that every photo should reflect brand identity .Every photo is according to your brand colour , style, value and identity . This makes your brand more memorable.',
        src: '/images/ugc_reel_1.jpg',
        alt: '9 brand focus photoshoot',
        tag: 'brand focus photoshoot',
        ratio: 'landscape',
      },
    ],
  },

  testimonials: [
    {
      id: 'testimonial-1',
      name: 'Client 1',
      initials: 'C1',
      quote:
        'Working with ugc Studio was a great experience. They work according to our vision and turned our ideas into creative content that matched our brand perfectly.',
    },
    {
      id: 'testimonial-2',
      name: 'Client 2',
      initials: 'C2',
      quote:
        'We loved how carefully the team approached our product photoshoot  From the lighting to the final visuals, everything felt well thought out.',
    },
    {
      id: 'testimonial-3',
      name: 'Client 3',
      initials: 'C3',
      quote:
        'The best part about working with them  was the communication and creativity. They listened to our ideas, welcomed our feedback, and made the entire process smooth and comfortable. We appreciated their dedication to our project.',
    },
  ],

  faqs: [
    {
      id: 'faq-1',
      question: 'How long does it take to complete a project ?',
      answer:
        'Exact timeline can be decided after finalising the  project . it depends upon the project type           , size and project requirements.',
    },
    {
      id: 'faq-2',
      question: 'What services do you offer ?',
      answer:
        'We provide ugc video , product photoshoot  , lifestyle and beauty content , creative advertisement content . we customise plan according to every project.',
    },
    {
      id: 'faq-3',
      question: 'who can work with our agency ?',
      answer:
        'Brands wants a photoshoot ,  lifestyle, content creator, e commerce can contact us . we help them in creating suitable content according to their need .',
    },
    {
      id: 'faq-4',
      question: 'Can you create content according to our brand identity ?',
      answer:
        'Yes  according to project requirements, content idea, video concept, and scriptwriting our team can customise everything according to your  brand identity',
    },
    {
      id: 'faq-5',
      question: 'how much does your service cost ?',
      answer:
        'Pricing depends upon brands content needs , content type, and delivery time . you can share your requirements.  we will discuss a suitable package and quotation according to your needs',
    },
  ],
};
