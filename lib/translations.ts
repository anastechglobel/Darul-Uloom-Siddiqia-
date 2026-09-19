import { Language } from './types';

export interface TranslationDictionary {
  siteTitle: string;
  tagline: string;
  location: string;
  nazimTitle: string;
  nazimName: string;
  nav: {
    home: string;
    about: string;
    nazim: string;
    education: string;
    programs: string;
    students: string;
    staff: string;
    facilities: string;
    gallery: string;
    videos: string;
    notices: string;
    events: string;
    admission: string;
    donation: string;
    faq: string;
    contact: string;
    admin: string;
    pages: string;
  };
  hero: {
    badge: string;
    welcome: string;
    ctaApply: string;
    ctaDonate: string;
    ctaExplore: string;
  };
  common: {
    readMore: string;
    viewAll: string;
    download: string;
    contactUs: string;
    donateNow: string;
    applyNow: string;
    search: string;
    filter: string;
    all: string;
    publishedOn: string;
    location: string;
    phone: string;
    email: string;
    whatsapp: string;
    officeHours: string;
    bankDetails: string;
    upiPayment: string;
    scanToPay: string;
    urgentNotice: string;
    upcoming: string;
    past: string;
    backToHome: string;
    pageNotFound: string;
    pageNotFoundDesc: string;
    language: string;
  };
  footer: {
    aboutText: string;
    quickLinks: string;
    academicWings: string;
    contactDetails: string;
    allRightsReserved: string;
    designedWithDevotion: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    siteTitle: 'Darul Uloom Siddiqia',
    tagline: 'Rooted in Deen, Rising with Knowledge',
    location: 'Aurahi East, Simraha, Araria, Bihar, India',
    nazimTitle: 'Nazim / Rector',
    nazimName: 'Maulana Abdus Subhan',
    nav: {
      home: 'Home',
      about: 'About',
      nazim: 'Leadership',
      education: 'Education',
      programs: 'Academic Programs',
      students: 'Students',
      staff: 'Teachers & Staff',
      facilities: 'Campus & Facilities',
      gallery: 'Gallery',
      videos: 'Lectures & Media',
      notices: 'Notices',
      events: 'Events',
      admission: 'Admission',
      donation: 'Donations & Sadaqah',
      faq: 'FAQ',
      contact: 'Contact',
      admin: 'Admin CMS',
      pages: 'More Pages',
    },
    hero: {
      badge: 'Premier Islamic Educational Institution',
      welcome: 'Welcome to Darul Uloom Siddiqia',
      ctaApply: 'Online Admission Inquiry',
      ctaDonate: 'Support the Madrasa',
      ctaExplore: 'Explore Programs',
    },
    common: {
      readMore: 'Read More',
      viewAll: 'View All',
      download: 'Download Form',
      contactUs: 'Get in Touch',
      donateNow: 'Donate Now',
      applyNow: 'Apply for Admission',
      search: 'Search...',
      filter: 'Filter by Category',
      all: 'All Categories',
      publishedOn: 'Published on',
      location: 'Location',
      phone: 'Phone',
      email: 'Email',
      whatsapp: 'WhatsApp',
      officeHours: 'Office Hours',
      bankDetails: 'Official Bank Account Details',
      upiPayment: 'Instant UPI Transfer',
      scanToPay: 'Scan QR Code to Donate',
      urgentNotice: 'Urgent Announcement',
      upcoming: 'Upcoming Events',
      past: 'Past Events',
      backToHome: 'Return to Homepage',
      pageNotFound: 'Page Not Found',
      pageNotFoundDesc: 'The page you are looking for may have been archived, moved, or unpublished by the administration.',
      language: 'Language',
    },
    footer: {
      aboutText: 'Darul Uloom Siddiqia is a distinguished center of classical Islamic sciences, Quranic preservation, and modern ethical education located in Aurahi East, Araria, Bihar.',
      quickLinks: 'Quick Links',
      academicWings: 'Academic Disciplines',
      contactDetails: 'Administrative Office',
      allRightsReserved: 'All Rights Reserved. Darul Uloom Siddiqia.',
      designedWithDevotion: 'Dedicated to the dissemination of authentic Islamic scholarship and humanitarian welfare.',
    },
  },
  hi: {
    siteTitle: 'दारुल उलूम सिद्दीकिया',
    tagline: 'दीन में जड़ें, ज्ञान के साथ प्रगति',
    location: 'औरही पूर्व, सिमराहा, अररिया, बिहार, भारत',
    nazimTitle: 'नाजिम / संचालक',
    nazimName: 'मौलाना अब्दुस सुभान',
    nav: {
      home: 'होम',
      about: 'परिचय',
      nazim: 'नेतृत्व / नाजिम',
      education: 'शिक्षा',
      programs: 'शैक्षणिक पाठ्यक्रम',
      students: 'विद्यार्थी',
      staff: 'अध्यापक एवं कर्मचारी',
      facilities: 'परिसर एवं सुविधाएं',
      gallery: 'चित्र दीर्घा',
      videos: 'वीडियो एवं व्याख्यान',
      notices: 'सूचनाएं',
      events: 'आयोजन',
      admission: 'प्रवेश',
      donation: 'दान एवं इमदाद',
      faq: 'प्रश्नोत्तरी',
      contact: 'संपर्क',
      admin: 'प्रशासन सीएमएस',
      pages: 'अन्य पृष्ठ',
    },
    hero: {
      badge: 'प्रतिष्ठित इस्लामी शिक्षण संस्थान',
      welcome: 'दारुल उलूम सिद्दीकिया में आपका स्वागत है',
      ctaApply: 'प्रवेश जानकारी',
      ctaDonate: 'मदरसा में सहयोग दें',
      ctaExplore: 'पाठ्यक्रम देखें',
    },
    common: {
      readMore: 'अधिक पढ़ें',
      viewAll: 'सभी देखें',
      download: 'फॉर्म डाउनलोड करें',
      contactUs: 'संपर्क करें',
      donateNow: 'दान दें',
      applyNow: 'प्रवेश आवेदन करें',
      search: 'खोजें...',
      filter: 'श्रेणी चुनें',
      all: 'सभी श्रेणियां',
      publishedOn: 'प्रकाशन तिथि',
      location: 'स्थान',
      phone: 'फोन',
      email: 'ईमेल',
      whatsapp: 'व्हाट्सएप',
      officeHours: 'कार्यालय समय',
      bankDetails: 'आधिकारिक बैंक खाता विवरण',
      upiPayment: 'तत्काल यूपीआई भुगतान',
      scanToPay: 'क्यूआर कोड स्कैन करें',
      urgentNotice: 'आवश्यक सूचना',
      upcoming: 'आगामी कार्यक्रम',
      past: 'विगत कार्यक्रम',
      backToHome: 'मुख्य पृष्ठ पर लौटें',
      pageNotFound: 'पृष्ठ उपलब्ध नहीं है',
      pageNotFoundDesc: 'जो पृष्ठ आप खोज रहे हैं वह प्रशासन द्वारा हटाया या अप्रकाशित किया जा चुका है।',
      language: 'भाषा',
    },
    footer: {
      aboutText: 'दारुल उलूम सिद्दीकिया औरही पूर्व, सिमराहा, अररिया, बिहार में स्थित पारंपरिक इस्लामी ज्ञान, हिफ्ज़-ए-कुरआन एवं चरित्र निर्माण का प्रतिष्ठित केंद्र है।',
      quickLinks: 'त्वरित लिंक',
      academicWings: 'शैक्षणिक विभाग',
      contactDetails: 'प्रशासनिक कार्यालय',
      allRightsReserved: 'सर्वाधिकार सुरक्षित। दारुल उलूम सिद्दीकिया।',
      designedWithDevotion: 'प्रमाणिक इस्लामी शिक्षा और सामाजिक कल्याण के लिए समर्पित।',
    },
  },
  ur: {
    siteTitle: 'دارالعلوم صدیقیہ',
    tagline: 'دین میں گہری جڑیں، علم کے ساتھ سربلندی',
    location: 'اورہی پورب، سمراہا، ارریہ، بہار، بھارت',
    nazimTitle: 'ناظم / مہتمم',
    nazimName: 'مولانا عبد السبحان',
    nav: {
      home: 'صفحہ اول',
      about: 'تعارف',
      nazim: 'قیادت و نظامت',
      education: 'تعلیم و تدریس',
      programs: 'تعلیمی شعبہ جات',
      students: 'طلبہ و تشکیلات',
      staff: 'اساتذہ و عملہ',
      facilities: 'عمارت و سہولیات',
      gallery: 'تصویری گیلری',
      videos: 'ویڈیوز و بیانات',
      notices: 'اعلانات و سرکلر',
      events: 'پروگرامز و تقریبات',
      admission: 'داخلہ',
      donation: 'تعاون و صدقات',
      faq: 'عام سوالات',
      contact: 'رابطہ',
      admin: 'انتظامی پینل',
      pages: 'دیگر صفحات',
    },
    hero: {
      badge: 'نمایاں اسلامی تعلیمی و تربیتی ادارہ',
      welcome: 'دارالعلوم صدیقیہ میں خوش آمدید',
      ctaApply: 'داخلے کی معلومات',
      ctaDonate: 'ادارے سے مالی تعاون',
      ctaExplore: 'شعبہ جات کا جائزہ لیں',
    },
    common: {
      readMore: 'مزید پڑھیں',
      viewAll: 'تمام دیکھیں',
      download: 'فارم ڈاؤنلوڈ کریں',
      contactUs: 'ہم سے رابطہ کریں',
      donateNow: 'تعاون پیش کریں',
      applyNow: 'داخلہ کی درخواست دیں',
      search: 'تلاش کریں...',
      filter: 'ترتیب بلحاظ قسم',
      all: 'تمام',
      publishedOn: 'تاریخِ اشاعت',
      location: 'مقام',
      phone: 'فون نمبر',
      email: 'ای میل',
      whatsapp: 'واٹس ایپ',
      officeHours: 'اوقاتِ دفتری',
      bankDetails: 'سرکاری بینک اکاؤنٹ کی تفصیلات',
      upiPayment: 'فوری یو پی آئی ادائیگی',
      scanToPay: 'تعاون کے لیے کیو آر کوڈ اسکین کریں',
      urgentNotice: 'ضروری اعلان',
      upcoming: 'آئندہ تقریبات',
      past: 'گزشتہ تقریبات',
      backToHome: 'مرکزی صفحہ پر جائیں',
      pageNotFound: 'صفحہ دستیاب نہیں ہے',
      pageNotFoundDesc: 'مطلوبہ صفحہ انتظامیہ کی جانب سے غیر شائع شدہ یا منتقل کر دیا گیا ہے۔',
      language: 'زبان',
    },
    footer: {
      aboutText: 'دارالعلوم صدیقیہ اورہی پورب، سمراہا، ارریہ، بہار میں علومِ نبویہ کی اشاعت، حفظِ قرآن مجید اور دینی و اخلاقی تربیت کا ایک باوقار اور مرکزِ رشد و ہدایت ہے۔',
      quickLinks: 'فوری روابط',
      academicWings: 'تعلیمی شعبے',
      contactDetails: 'دفتری رابطہ',
      allRightsReserved: 'جملہ حقوق محفوظ ہیں۔ دارالعلوم صدیقیہ۔',
      designedWithDevotion: 'علومِ نبویہ کی اشاعت اور نسلِ نو کی اسلامی تربیت کے لیے وقف۔',
    },
  },
  ar: {
    siteTitle: 'دار العلوم الصديقية',
    tagline: 'جذور في الدين، وسمو بالمعرفة',
    location: 'أوراهي الشرقية، سيمراها، أراريا، بيهار، الهند',
    nazimTitle: 'الناظم / المدير',
    nazimName: 'مولانا عبد السبحان',
    nav: {
      home: 'الرئيسية',
      about: 'عن المؤسسة',
      nazim: 'الإدارة والناظم',
      education: 'التعليم',
      programs: 'البرامج الأكاديمية',
      students: 'الطلاب',
      staff: 'هيئة التدريس والموظفين',
      facilities: 'المرافق والحرم',
      gallery: 'معرض الصور',
      videos: 'المحاضرات والمرئيات',
      notices: 'الإعلانات',
      events: 'الفعاليات والمناسبات',
      admission: 'القبول والتسجيل',
      donation: 'التبرعات والصدقات',
      faq: 'الأسئلة الشائعة',
      contact: 'اتصل بنا',
      admin: 'لوحة التحكم',
      pages: 'صفحات إضافية',
    },
    hero: {
      badge: 'صرح تعليمي ودعوي إسلامي متميز',
      welcome: 'مرحباً بكم في دار العلوم الصديقية',
      ctaApply: 'طلب القبول والتسجيل',
      ctaDonate: 'ادعم مسيرة التعليم',
      ctaExplore: 'استكشف البرامج الأكاديمية',
    },
    common: {
      readMore: 'اقرأ المزيد',
      viewAll: 'عرض الكل',
      download: 'تحميل النموذج',
      contactUs: 'تواصل معنا',
      donateNow: 'تبرع الآن',
      applyNow: 'التقديم للالتحاق',
      search: 'بحث...',
      filter: 'تصفية حسب الفئة',
      all: 'جميع الفئات',
      publishedOn: 'تاريخ النشر',
      location: 'الموقع',
      phone: 'الهاتف',
      email: 'البريد الإلكتروني',
      whatsapp: 'واتساب',
      officeHours: 'أوقات الدوام',
      bankDetails: 'تفاصيل الحساب البنكي الرسمي',
      upiPayment: 'التحويل المالي المباشر',
      scanToPay: 'امسح رمز الاستجابة السريعة للتبرع',
      urgentNotice: 'إعلان هام وعاجل',
      upcoming: 'الفعاليات القادمة',
      past: 'الفعاليات السابقة',
      backToHome: 'العودة إلى الصفحة الرئيسية',
      pageNotFound: 'الصفحة غير موجودة',
      pageNotFoundDesc: 'الصفحة التي تحاول الوصول إليها قد تكون ملغاة أو غير منشورة بواسطة الإدارة.',
      language: 'اللغة',
    },
    footer: {
      aboutText: 'دار العلوم الصديقية صرح علمي ودعوي مبارك يعنى بتدريس علوم الشريعة الإسلامية وحفظ القرآن الكريم والتربية الأخلاقية، في أوراهي الشرقية، أراريا، بيهار، الهند.',
      quickLinks: 'روابط سريعة',
      academicWings: 'الأقسام الأكاديمية',
      contactDetails: 'المكتب الإداري',
      allRightsReserved: 'جميع الحقوق محفوظة. دار العلوم الصديقية.',
      designedWithDevotion: 'وقف مبارك لنشر العلوم الإسلامية وتربية الأجيال.',
    },
  },
};

export function isRtl(lang: Language): boolean {
  return lang === 'ur' || lang === 'ar';
}
