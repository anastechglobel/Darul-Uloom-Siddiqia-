export type Language = 'en' | 'hi' | 'ur' | 'ar';

export interface MultilingualText {
  en: string;
  hi?: string;
  ur?: string;
  ar?: string;
}

export type SectionType =
  | 'hero'
  | 'rich_text'
  | 'image'
  | 'image_text'
  | 'statistics'
  | 'cards'
  | 'features'
  | 'programs'
  | 'staff'
  | 'gallery'
  | 'video'
  | 'notices'
  | 'events'
  | 'faq'
  | 'cta'
  | 'donation'
  | 'contact'
  | 'map'
  | 'quote'
  | 'custom';

export interface SectionItem {
  id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  icon?: string;
  linkUrl?: string;
  linkLabel?: string;
  badge?: string;
  meta?: Record<string, any>;
}

export interface PageSection {
  id: string;
  type: SectionType;
  title: string;
  subtitle?: string;
  description?: string;
  contentHtml?: string;
  imageUrl?: string;
  imageAlt?: string;
  imagePosition?: 'left' | 'right' | 'top' | 'center';
  videoUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  backgroundColor?: 'default' | 'emerald' | 'ivory' | 'charcoal' | 'gold';
  order: number;
  published: boolean;
  items?: SectionItem[];
  customStyles?: string;
}

export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  description: string;
  contentHtml?: string;
  featuredImageUrl?: string;
  isInNavigation?: boolean;
  showInNav?: boolean;
  navLabel?: string;
  order: number;
  status?: 'published' | 'draft' | 'archived' | 'hidden';
  published?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  isSystemPage?: boolean;
  sections?: PageSection[];
  createdAt: string;
  updatedAt: string;
}

export interface MadrasaInfo {
  name: string;
  arabicName: string;
  urduName?: string;
  hindiName?: string;
  tagline: string;
  taglineUrdu: string;
  taglineArabic: string;
  taglineHindi: string;
  establishedYear: string | number;
  registrationNo?: string;
  registrationNumber?: string;
  affiliatedWith?: string;
  address: string;
  city: string;
  district: string;
  state: string;
  country: string;
  pincode: string;
  phone: string;
  whatsapp: string;
  email: string;
  logoUrl?: string;
  bannerUrl?: string;
  description: string;
  mission: string;
  vision: string;
}

export interface Leadership {
  nazimName: string;
  nazimTitle: string;
  designation: string;
  biography: string;
  message: string;
  quote: string;
  imageUrl?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  officeHours?: string;
  visibility: boolean;
}

export interface StudentStats {
  totalStudents: number;
  residentialStudents: number;
  dayScholarStudents: number;
  hifzStudents: number;
  alimiyahStudents: number;
  maktabStudents: number;
  graduatedScholars: number;
  totalHuffazProduced?: number;
  provincesRepresented: number;
  freeEducationPercent: number;
  lastUpdatedYear: string;
  notes?: string;
}

export interface Program {
  id: string;
  title: string;
  slug?: string;
  titleUrdu?: string;
  titleArabic?: string;
  duration: string;
  eligibility: string;
  description: string;
  curriculumOverview?: string[];
  schedule?: string;
  admissionStatus?: 'open' | 'closed' | 'ongoing' | string;
  feesType: 'Free / Waqf Sponsored' | 'Nominal' | 'Subsidized' | string;
  featuredImageUrl?: string;
  order: number;
  published: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  nameUrdu?: string;
  designation: string;
  department: string;
  qualification: string;
  biography: string;
  imageUrl?: string;
  order: number;
  published: boolean;
  contactEmail?: string;
  phone?: string;
}

export interface Facility {
  id: string;
  title: string;
  category: 'Spiritual' | 'Academic' | 'Residential' | 'Library' | 'Campus' | string;
  description: string;
  capacity?: string;
  features?: string[];
  imageUrl?: string;
  order: number;
  published: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  category: 'Campus' | 'Dastarbandi' | 'Classes' | 'Events' | 'Masjid' | 'Students' | string;
  imageUrl: string;
  thumbnailUrl?: string;
  altText: string;
  source?: 'imgbb' | 'external' | string;
  order: number;
  published: boolean;
  createdAt?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  category: 'Sermon' | 'Tilawat' | 'Dastarbandi' | 'Campus Tour' | 'Lecture' | string;
  description?: string;
  thumbnailUrl?: string;
  order: number;
  published: boolean;
  createdAt?: string;
}

export interface Notice {
  id: string;
  title: string;
  titleUrdu?: string;
  content: string;
  priority: 'urgent' | 'high' | 'normal' | string;
  category: 'Academic' | 'Admission' | 'General' | 'Examination' | 'Holiday' | string;
  publishedDate: string;
  expiryDate?: string;
  externalLink?: string;
  linkText?: string;
  published: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  titleUrdu?: string;
  date: string;
  endDate?: string;
  time?: string;
  location?: string;
  venue?: string;
  chiefGuest?: string;
  description: string;
  imageUrl?: string;
  registrationUrl?: string;
  registrationRequired?: boolean;
  isPast?: boolean;
  published: boolean;
}

export interface AdmissionInfo {
  isOpen: boolean;
  academicYear: string;
  startDate: string;
  endDate: string;
  instructions: string;
  eligibilityRequirements: string[];
  requiredDocuments: string[];
  applicationSteps: { step: number; title: string; description: string }[];
  contactPhone: string;
  contactEmail: string;
  downloadableFormUrl?: string;
}

export interface DonationInfo {
  appealTitle: string;
  appealDescription: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  upiId: string;
  qrCodeImageUrl?: string;
  noteForDonors: string;
  taxExemptionInfo?: string;
  whatsappConfirmation: string;
  purposes: { title: string; description: string; targetAmount?: string }[];
}

export interface ContactInfo {
  institutionName: string;
  addressLine1: string;
  addressLine2: string;
  village: string;
  postOffice: string;
  policeStation?: string;
  district: string;
  state: string;
  country: string;
  pincode: string;
  primaryPhone: string;
  secondaryPhone?: string;
  whatsapp: string;
  email: string;
  officeHours: string;
  visitingGuidelines?: string;
  googleMapsEmbedUrl?: string;
}

export interface SocialLink {
  id: string;
  platform: 'youtube' | 'instagram' | 'telegram' | 'whatsapp' | 'facebook' | 'twitter' | 'other';
  label: string;
  url: string;
  icon: string;
  order: number;
  enabled: boolean;
}

export interface SeoSettings {
  siteTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  keywords: string[];
  canonicalBaseUrl: string;
  ogImageUrl?: string;
  twitterHandle?: string;
  organizationSchema: {
    name: string;
    url: string;
    logo: string;
    foundingDate: string;
    founder: string;
    addressCountry: string;
  };
}

export interface ImageRecord {
  id: string;
  provider?: 'imgbb' | 'external' | string;
  source?: 'upload' | 'url' | string;
  imageUrl?: string;
  url?: string;
  title?: string;
  displayUrl?: string;
  thumbnailUrl?: string;
  deleteUrl?: string;
  filename?: string;
  mimeType?: string;
  size?: number;
  createdAt?: string;
  uploadedAt?: string;
  associatedContent?: string;
}

export type StoredImage = ImageRecord;

export interface SystemSettings {
  defaultLanguage: Language;
  enableMultiLanguage: boolean;
  maintenanceMode: boolean;
  announcementTicker?: string;
  enableTicker: boolean;
  lastBackupDate?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  questionUrdu?: string;
  answer: string;
  category: string;
  order: number;
  published: boolean;
}
