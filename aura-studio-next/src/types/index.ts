export interface BrandInfo {
  name: string;
  shortName: string;
  tagline: string;
  category: string;
  logoText: string;
  logoSubtext: string;
}

export interface ContactInfo {
  whatsappRaw: string;
  whatsappDisplay: string;
  whatsappPrefill: string;
  phoneRaw: string;
  phoneDisplay: string;
  email: string;
  hours: string;
  address: string;
}

export interface QuickReply {
  id: string;
  label: string;
  reply: string;
  showActionButtons?: boolean;
}

export interface ContactWidgetConfig {
  whatsapp: {
    number: string;
    displayNumber: string;
    prefilledMessage: string;
    tooltip: string;
    ariaLabel: string;
  };
  phone: {
    number: string;
    displayNumber: string;
    tooltip: string;
    ariaLabel: string;
  };
  chatbot: {
    tooltip: string;
    ariaLabel: string;
    headerTitle: string;
    headerSubtitle: string;
    welcomeMessage: string;
    typingDelayMs: number;
    quickReplies: QuickReply[];
    fallbackReply: string;
  };
  welcomePopup: {
    enabled: boolean;
    delayMs: number;
    sessionStorageKey: string;
    badge: string;
    message: string;
    acceptText: string;
    dismissText: string;
  };
}

export interface HeroConfig {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: {
    text: string;
    action: string;
  };
  secondaryCta: {
    text: string;
    action: string;
  };
  highlights: Array<{
    label: string;
    value: string;
  }>;
}

export interface UgcReel {
  id: string;
  creator: string;
  handle: string;
  avatar: string;
  role: string;
  title: string;
  caption: string;
  productTag: string;
  duration: string;
  poster: string;
  videoSrc?: string;
  alt: string;
}

export interface AboutImage {
  src: string;
  alt: string;
  title: string;
  badge: string;
}

export interface AboutConfig {
  badge: string;
  headline: string;
  lead: string;
  paragraphs: string[];
  specs: Array<{
    label: string;
    value: string;
  }>;
  images: AboutImage[];
}

export interface BrandLogo {
  name: string;
  logoSrc: string;
}

export interface BrandWallConfig {
  eyebrow: string;
  headline: string;
  lead: string;
  logos: BrandLogo[];
}

export interface UgcShowcaseItem {
  id: string;
  creator: string;
  handle: string;
  role: string;
  caption: string;
  image: string;
  alt: string;
  type: string;
  duration: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  src: string;
  alt: string;
  tag: string;
  ratio: 'portrait' | 'landscape' | 'square';
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  location: string;
  edition: string;
  initials: string;
  quote: string;
  rating: number;
  date: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProductConfig {
  brand: BrandInfo;
  contact: ContactInfo;
  contactWidget: ContactWidgetConfig;
  hero: HeroConfig;
  ugcReels: UgcReel[];
  about: AboutConfig;
  brandWall: BrandWallConfig;
  ugcShowcase: UgcShowcaseItem[];
  gallery: {
    eyebrow: string;
    headline: string;
    lead: string;
    images: GalleryItem[];
  };
  testimonials: TestimonialItem[];
  faqs: FaqItem[];
}

export interface LeadFormData {
  fullName: string;
  email: string;
  phone: string;
  editionPreference: string;
  consent: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof LeadFormData, string>>;
}

export interface SubmissionResult {
  success: boolean;
  leadId?: string;
  error?: string;
  fieldErrors?: Partial<Record<keyof LeadFormData, string>>;
  data?: LeadFormData & { submittedAt: string };
  isLocalSimulation?: boolean;
}
