import {
  ref,
  get,
  set,
  update,
  remove,
  onValue,
  off,
} from 'firebase/database';
import { database, isFirebaseConfigured } from './firebase';
import {
  CMSPage,
  MadrasaInfo,
  Leadership,
  StudentStats,
  Program,
  StaffMember,
  Facility,
  GalleryItem,
  VideoItem,
  Notice,
  EventItem,
  AdmissionInfo,
  DonationInfo,
  ContactInfo,
  SocialLink,
  SeoSettings,
  SystemSettings,
  ImageRecord,
  FAQItem,
} from './types';
import {
  initialMadrasaInfo,
  initialLeadership,
  initialStudentStats,
  initialPrograms,
  initialStaff,
  initialFacilities,
  initialGallery,
  initialVideos,
  initialNotices,
  initialEvents,
  initialAdmissionInfo,
  initialDonationInfo,
  initialContactInfo,
  initialSocialLinks,
  initialSeoSettings,
  initialSystemSettings,
  initialPages,
  initialFaqList,
} from './defaultData';

const LOCAL_STORAGE_PREFIX = 'dus_cms_';

function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }
}

// Generic CRUD helper
export const cmsService = {
  // --- MADRASA INFO ---
  async getMadrasaInfo(): Promise<MadrasaInfo> {
    if (isFirebaseConfigured && database) {
      try {
        const snap = await get(ref(database, 'madrasa'));
        if (snap.exists()) return snap.val();
      } catch (e) {
        console.warn('Firebase read failed, using local storage/default:', e);
      }
    }
    return getLocal<MadrasaInfo>('madrasa', initialMadrasaInfo);
  },

  async updateMadrasaInfo(data: Partial<MadrasaInfo>): Promise<MadrasaInfo> {
    const current = await this.getMadrasaInfo();
    const updated = { ...current, ...data };
    if (isFirebaseConfigured && database) {
      await set(ref(database, 'madrasa'), updated);
    }
    setLocal('madrasa', updated);
    return updated;
  },

  // --- LEADERSHIP / NAZIM ---
  async getLeadership(): Promise<Leadership> {
    if (isFirebaseConfigured && database) {
      try {
        const snap = await get(ref(database, 'leadership'));
        if (snap.exists()) return snap.val();
      } catch (e) {
        console.warn('Firebase read failed, using fallback:', e);
      }
    }
    return getLocal<Leadership>('leadership', initialLeadership);
  },

  async updateLeadership(data: Partial<Leadership>): Promise<Leadership> {
    const current = await this.getLeadership();
    const updated = { ...current, ...data };
    if (isFirebaseConfigured && database) {
      await set(ref(database, 'leadership'), updated);
    }
    setLocal('leadership', updated);
    return updated;
  },

  // --- STUDENTS STATS ---
  async getStudentStats(): Promise<StudentStats> {
    if (isFirebaseConfigured && database) {
      try {
        const snap = await get(ref(database, 'students'));
        if (snap.exists()) return snap.val();
      } catch (e) {
        console.warn('Firebase read failed, using fallback:', e);
      }
    }
    return getLocal<StudentStats>('students', initialStudentStats);
  },

  async updateStudentStats(data: Partial<StudentStats>): Promise<StudentStats> {
    const current = await this.getStudentStats();
    const updated = { ...current, ...data };
    if (isFirebaseConfigured && database) {
      await set(ref(database, 'students'), updated);
    }
    setLocal('students', updated);
    return updated;
  },

  // --- PAGES & SECTIONS ---
  async getPages(): Promise<CMSPage[]> {
    if (isFirebaseConfigured && database) {
      try {
        const snap = await get(ref(database, 'pages'));
        if (snap.exists()) {
          const val = snap.val();
          if (Array.isArray(val)) return val.filter(Boolean);
          if (typeof val === 'object') return Object.values(val);
        }
      } catch (e) {
        console.warn('Firebase read pages failed, using fallback:', e);
      }
    }
    return getLocal<CMSPage[]>('pages', initialPages);
  },

  async getPageBySlug(slug: string): Promise<CMSPage | null> {
    const pages = await this.getPages();
    const cleanSlug = slug.toLowerCase().replace(/^\/+/, '');
    const found = pages.find(
      (p) => p.slug.toLowerCase().replace(/^\/+/, '') === cleanSlug
    );
    return found || null;
  },

  async savePage(page: CMSPage): Promise<CMSPage> {
    const pages = await this.getPages();
    const index = pages.findIndex((p) => p.id === page.id);
    let updatedPages: CMSPage[];
    if (index >= 0) {
      updatedPages = [...pages];
      updatedPages[index] = { ...page, updatedAt: new Date().toISOString() };
    } else {
      updatedPages = [
        ...pages,
        {
          ...page,
          createdAt: page.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
    }
    if (isFirebaseConfigured && database) {
      await set(ref(database, `pages/${page.id}`), page);
    }
    setLocal('pages', updatedPages);
    return page;
  },

  async deletePage(pageId: string): Promise<boolean> {
    const pages = await this.getPages();
    const filtered = pages.filter((p) => p.id !== pageId);
    if (isFirebaseConfigured && database) {
      await remove(ref(database, `pages/${pageId}`));
    }
    setLocal('pages', filtered);
    return true;
  },

  // --- PROGRAMS ---
  async getPrograms(): Promise<Program[]> {
    if (isFirebaseConfigured && database) {
      try {
        const snap = await get(ref(database, 'programs'));
        if (snap.exists()) {
          const val = snap.val();
          return Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
        }
      } catch (e) {
        console.warn('Firebase read failed, using fallback:', e);
      }
    }
    return getLocal<Program[]>('programs', initialPrograms);
  },

  async saveProgram(program: Program): Promise<Program> {
    const programs = await this.getPrograms();
    const index = programs.findIndex((p) => p.id === program.id);
    let updated: Program[];
    if (index >= 0) {
      updated = [...programs];
      updated[index] = program;
    } else {
      updated = [...programs, program];
    }
    if (isFirebaseConfigured && database) {
      await set(ref(database, `programs/${program.id}`), program);
    }
    setLocal('programs', updated);
    return program;
  },

  async deleteProgram(id: string): Promise<boolean> {
    const programs = await this.getPrograms();
    const updated = programs.filter((p) => p.id !== id);
    if (isFirebaseConfigured && database) {
      await remove(ref(database, `programs/${id}`));
    }
    setLocal('programs', updated);
    return true;
  },

  // --- STAFF ---
  async getStaff(): Promise<StaffMember[]> {
    if (isFirebaseConfigured && database) {
      try {
        const snap = await get(ref(database, 'staff'));
        if (snap.exists()) {
          const val = snap.val();
          return Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
        }
      } catch (e) {
        console.warn('Firebase read failed, using fallback:', e);
      }
    }
    return getLocal<StaffMember[]>('staff', initialStaff);
  },

  async saveStaff(staff: StaffMember): Promise<StaffMember> {
    const list = await this.getStaff();
    const index = list.findIndex((s) => s.id === staff.id);
    let updated: StaffMember[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = staff;
    } else {
      updated = [...list, staff];
    }
    if (isFirebaseConfigured && database) {
      await set(ref(database, `staff/${staff.id}`), staff);
    }
    setLocal('staff', updated);
    return staff;
  },

  async deleteStaff(id: string): Promise<boolean> {
    const list = await this.getStaff();
    const updated = list.filter((s) => s.id !== id);
    if (isFirebaseConfigured && database) {
      await remove(ref(database, `staff/${id}`));
    }
    setLocal('staff', updated);
    return true;
  },

  // --- FACILITIES ---
  async getFacilities(): Promise<Facility[]> {
    if (isFirebaseConfigured && database) {
      try {
        const snap = await get(ref(database, 'facilities'));
        if (snap.exists()) {
          const val = snap.val();
          return Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
        }
      } catch (e) {
        console.warn('Firebase read failed, using fallback:', e);
      }
    }
    return getLocal<Facility[]>('facilities', initialFacilities);
  },

  async saveFacility(facility: Facility): Promise<Facility> {
    const list = await this.getFacilities();
    const index = list.findIndex((f) => f.id === facility.id);
    let updated: Facility[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = facility;
    } else {
      updated = [...list, facility];
    }
    if (isFirebaseConfigured && database) {
      await set(ref(database, `facilities/${facility.id}`), facility);
    }
    setLocal('facilities', updated);
    return facility;
  },

  async deleteFacility(id: string): Promise<boolean> {
    const list = await this.getFacilities();
    const updated = list.filter((f) => f.id !== id);
    if (isFirebaseConfigured && database) {
      await remove(ref(database, `facilities/${id}`));
    }
    setLocal('facilities', updated);
    return true;
  },

  // --- GALLERY ---
  async getGallery(): Promise<GalleryItem[]> {
    if (isFirebaseConfigured && database) {
      try {
        const snap = await get(ref(database, 'gallery'));
        if (snap.exists()) {
          const val = snap.val();
          return Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
        }
      } catch (e) {
        console.warn('Firebase read failed, using fallback:', e);
      }
    }
    return getLocal<GalleryItem[]>('gallery', initialGallery);
  },

  async saveGalleryItem(item: GalleryItem): Promise<GalleryItem> {
    const list = await this.getGallery();
    const index = list.findIndex((g) => g.id === item.id);
    let updated: GalleryItem[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = item;
    } else {
      updated = [...list, item];
    }
    if (isFirebaseConfigured && database) {
      await set(ref(database, `gallery/${item.id}`), item);
    }
    setLocal('gallery', updated);
    return item;
  },

  async deleteGalleryItem(id: string): Promise<boolean> {
    const list = await this.getGallery();
    const updated = list.filter((g) => g.id !== id);
    if (isFirebaseConfigured && database) {
      await remove(ref(database, `gallery/${id}`));
    }
    setLocal('gallery', updated);
    return true;
  },

  // --- VIDEOS ---
  async getVideos(): Promise<VideoItem[]> {
    if (isFirebaseConfigured && database) {
      try {
        const snap = await get(ref(database, 'videos'));
        if (snap.exists()) {
          const val = snap.val();
          return Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
        }
      } catch (e) {
        console.warn('Firebase read failed, using fallback:', e);
      }
    }
    return getLocal<VideoItem[]>('videos', initialVideos);
  },

  async saveVideo(video: VideoItem): Promise<VideoItem> {
    const list = await this.getVideos();
    const index = list.findIndex((v) => v.id === video.id);
    let updated: VideoItem[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = video;
    } else {
      updated = [...list, video];
    }
    if (isFirebaseConfigured && database) {
      await set(ref(database, `videos/${video.id}`), video);
    }
    setLocal('videos', updated);
    return video;
  },

  async deleteVideo(id: string): Promise<boolean> {
    const list = await this.getVideos();
    const updated = list.filter((v) => v.id !== id);
    if (isFirebaseConfigured && database) {
      await remove(ref(database, `videos/${id}`));
    }
    setLocal('videos', updated);
    return true;
  },

  // --- NOTICES ---
  async getNotices(): Promise<Notice[]> {
    if (isFirebaseConfigured && database) {
      try {
        const snap = await get(ref(database, 'notices'));
        if (snap.exists()) {
          const val = snap.val();
          return Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
        }
      } catch (e) {
        console.warn('Firebase read failed, using fallback:', e);
      }
    }
    return getLocal<Notice[]>('notices', initialNotices);
  },

  async saveNotice(notice: Notice): Promise<Notice> {
    const list = await this.getNotices();
    const index = list.findIndex((n) => n.id === notice.id);
    let updated: Notice[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = notice;
    } else {
      updated = [...list, notice];
    }
    if (isFirebaseConfigured && database) {
      await set(ref(database, `notices/${notice.id}`), notice);
    }
    setLocal('notices', updated);
    return notice;
  },

  async deleteNotice(id: string): Promise<boolean> {
    const list = await this.getNotices();
    const updated = list.filter((n) => n.id !== id);
    if (isFirebaseConfigured && database) {
      await remove(ref(database, `notices/${id}`));
    }
    setLocal('notices', updated);
    return true;
  },

  // --- EVENTS ---
  async getEvents(): Promise<EventItem[]> {
    if (isFirebaseConfigured && database) {
      try {
        const snap = await get(ref(database, 'events'));
        if (snap.exists()) {
          const val = snap.val();
          return Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
        }
      } catch (e) {
        console.warn('Firebase read failed, using fallback:', e);
      }
    }
    return getLocal<EventItem[]>('events', initialEvents);
  },

  async saveEvent(event: EventItem): Promise<EventItem> {
    const list = await this.getEvents();
    const index = list.findIndex((e) => e.id === event.id);
    let updated: EventItem[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = event;
    } else {
      updated = [...list, event];
    }
    if (isFirebaseConfigured && database) {
      await set(ref(database, `events/${event.id}`), event);
    }
    setLocal('events', updated);
    return event;
  },

  async deleteEvent(id: string): Promise<boolean> {
    const list = await this.getEvents();
    const updated = list.filter((e) => e.id !== id);
    if (isFirebaseConfigured && database) {
      await remove(ref(database, `events/${id}`));
    }
    setLocal('events', updated);
    return true;
  },

  // --- ADMISSION ---
  async getAdmission(): Promise<AdmissionInfo> {
    if (isFirebaseConfigured && database) {
      try {
        const snap = await get(ref(database, 'admission'));
        if (snap.exists()) return snap.val();
      } catch (e) {
        console.warn('Firebase read failed, using fallback:', e);
      }
    }
    return getLocal<AdmissionInfo>('admission', initialAdmissionInfo);
  },

  async updateAdmission(data: Partial<AdmissionInfo>): Promise<AdmissionInfo> {
    const current = await this.getAdmission();
    const updated = { ...current, ...data };
    if (isFirebaseConfigured && database) {
      await set(ref(database, 'admission'), updated);
    }
    setLocal('admission', updated);
    return updated;
  },

  async getAdmissionInfo(): Promise<AdmissionInfo> {
    return this.getAdmission();
  },

  async updateAdmissionInfo(data: Partial<AdmissionInfo>): Promise<AdmissionInfo> {
    return this.updateAdmission(data);
  },

  // --- DONATION ---
  async getDonation(): Promise<DonationInfo> {
    if (isFirebaseConfigured && database) {
      try {
        const snap = await get(ref(database, 'donation'));
        if (snap.exists()) return snap.val();
      } catch (e) {
        console.warn('Firebase read failed, using fallback:', e);
      }
    }
    return getLocal<DonationInfo>('donation', initialDonationInfo);
  },

  async updateDonation(data: Partial<DonationInfo>): Promise<DonationInfo> {
    const current = await this.getDonation();
    const updated = { ...current, ...data };
    if (isFirebaseConfigured && database) {
      await set(ref(database, 'donation'), updated);
    }
    setLocal('donation', updated);
    return updated;
  },

  async getDonationInfo(): Promise<DonationInfo> {
    return this.getDonation();
  },

  async updateDonationInfo(data: Partial<DonationInfo>): Promise<DonationInfo> {
    return this.updateDonation(data);
  },

  // --- CONTACT ---
  async getContact(): Promise<ContactInfo> {
    if (isFirebaseConfigured && database) {
      try {
        const snap = await get(ref(database, 'contact'));
        if (snap.exists()) return snap.val();
      } catch (e) {
        console.warn('Firebase read failed, using fallback:', e);
      }
    }
    return getLocal<ContactInfo>('contact', initialContactInfo);
  },

  async updateContact(data: Partial<ContactInfo>): Promise<ContactInfo> {
    const current = await this.getContact();
    const updated = { ...current, ...data };
    if (isFirebaseConfigured && database) {
      await set(ref(database, 'contact'), updated);
    }
    setLocal('contact', updated);
    return updated;
  },

  async getContactInfo(): Promise<ContactInfo> {
    return this.getContact();
  },

  async updateContactInfo(data: Partial<ContactInfo>): Promise<ContactInfo> {
    return this.updateContact(data);
  },

  // --- FAQ ---
  async getFAQs(): Promise<FAQItem[]> {
    if (isFirebaseConfigured && database) {
      try {
        const snap = await get(ref(database, 'faq'));
        if (snap.exists()) {
          const val = snap.val();
          return Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
        }
      } catch (e) {
        console.warn('Firebase read failed, using fallback:', e);
      }
    }
    return getLocal<FAQItem[]>('faq', initialFaqList);
  },

  async getFaqList(): Promise<FAQItem[]> {
    return this.getFAQs();
  },

  async saveFAQ(faq: FAQItem): Promise<FAQItem> {
    const list = await this.getFAQs();
    const index = list.findIndex((f) => f.id === faq.id);
    let updated: FAQItem[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = faq;
    } else {
      updated = [...list, faq];
    }
    if (isFirebaseConfigured && database) {
      await set(ref(database, `faq/${faq.id}`), faq);
    }
    setLocal('faq', updated);
    return faq;
  },

  async saveFaq(faq: FAQItem): Promise<FAQItem> {
    return this.saveFAQ(faq);
  },

  async deleteFAQ(id: string): Promise<boolean> {
    const list = await this.getFAQs();
    const updated = list.filter((f) => f.id !== id);
    if (isFirebaseConfigured && database) {
      await remove(ref(database, `faq/${id}`));
    }
    setLocal('faq', updated);
    return true;
  },

  async deleteFaq(id: string): Promise<boolean> {
    return this.deleteFAQ(id);
  },

  // --- SOCIAL LINKS ---
  async getSocialLinks(): Promise<SocialLink[]> {
    if (isFirebaseConfigured && database) {
      try {
        const snap = await get(ref(database, 'social'));
        if (snap.exists()) {
          const val = snap.val();
          return Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
        }
      } catch (e) {
        console.warn('Firebase read failed, using fallback:', e);
      }
    }
    return getLocal<SocialLink[]>('social', initialSocialLinks);
  },

  async saveSocialLink(link: SocialLink): Promise<SocialLink> {
    const list = await this.getSocialLinks();
    const index = list.findIndex((s) => s.id === link.id);
    let updated: SocialLink[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = link;
    } else {
      updated = [...list, link];
    }
    if (isFirebaseConfigured && database) {
      await set(ref(database, `social/${link.id}`), link);
    }
    setLocal('social', updated);
    return link;
  },

  async deleteSocialLink(id: string): Promise<boolean> {
    const list = await this.getSocialLinks();
    const updated = list.filter((s) => s.id !== id);
    if (isFirebaseConfigured && database) {
      await remove(ref(database, `social/${id}`));
    }
    setLocal('social', updated);
    return true;
  },

  async updateSocialLinks(links: SocialLink[]): Promise<SocialLink[]> {
    if (isFirebaseConfigured && database) {
      const obj: Record<string, SocialLink> = {};
      links.forEach((l) => {
        obj[l.id] = l;
      });
      await set(ref(database, 'social'), obj);
    }
    setLocal('social', links);
    return links;
  },

  // --- SEO SETTINGS ---
  async getSeo(): Promise<SeoSettings> {
    if (isFirebaseConfigured && database) {
      try {
        const snap = await get(ref(database, 'seo'));
        if (snap.exists()) return snap.val();
      } catch (e) {
        console.warn('Firebase read failed, using fallback:', e);
      }
    }
    return getLocal<SeoSettings>('seo', initialSeoSettings);
  },

  async updateSeo(data: Partial<SeoSettings>): Promise<SeoSettings> {
    const current = await this.getSeo();
    const updated = { ...current, ...data };
    if (isFirebaseConfigured && database) {
      await set(ref(database, 'seo'), updated);
    }
    setLocal('seo', updated);
    return updated;
  },

  // --- SYSTEM SETTINGS ---
  async getSettings(): Promise<SystemSettings> {
    if (isFirebaseConfigured && database) {
      try {
        const snap = await get(ref(database, 'settings'));
        if (snap.exists()) return snap.val();
      } catch (e) {
        console.warn('Firebase read failed, using fallback:', e);
      }
    }
    return getLocal<SystemSettings>('settings', initialSystemSettings);
  },

  async updateSettings(data: Partial<SystemSettings>): Promise<SystemSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...data };
    if (isFirebaseConfigured && database) {
      await set(ref(database, 'settings'), updated);
    }
    setLocal('settings', updated);
    return updated;
  },

  // --- IMAGE LIBRARY METADATA RECORDS ---
  async getImages(): Promise<ImageRecord[]> {
    if (isFirebaseConfigured && database) {
      try {
        const snap = await get(ref(database, 'images'));
        if (snap.exists()) {
          const val = snap.val();
          return Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
        }
      } catch (e) {
        console.warn('Firebase read images failed, using fallback:', e);
      }
    }
    return getLocal<ImageRecord[]>('images', []);
  },

  async saveImageRecord(img: ImageRecord): Promise<ImageRecord> {
    const list = await this.getImages();
    const index = list.findIndex((i) => i.id === img.id);
    let updated: ImageRecord[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = img;
    } else {
      updated = [img, ...list];
    }
    if (isFirebaseConfigured && database) {
      await set(ref(database, `images/${img.id}`), img);
    }
    setLocal('images', updated);
    return img;
  },

  async deleteImageRecord(id: string): Promise<boolean> {
    const list = await this.getImages();
    const updated = list.filter((i) => i.id !== id);
    if (isFirebaseConfigured && database) {
      await remove(ref(database, `images/${id}`));
    }
    setLocal('images', updated);
    return true;
  },

  // --- BACKUP & RESTORE ---
  async exportFullBackup(): Promise<Record<string, any>> {
    const [
      madrasa,
      leadership,
      students,
      programs,
      staff,
      facilities,
      gallery,
      videos,
      notices,
      events,
      admission,
      donation,
      faq,
      contact,
      social,
      seo,
      settings,
      pages,
      images,
    ] = await Promise.all([
      this.getMadrasaInfo(),
      this.getLeadership(),
      this.getStudentStats(),
      this.getPrograms(),
      this.getStaff(),
      this.getFacilities(),
      this.getGallery(),
      this.getVideos(),
      this.getNotices(),
      this.getEvents(),
      this.getAdmissionInfo(),
      this.getDonationInfo(),
      this.getFaqList(),
      this.getContactInfo(),
      this.getSocialLinks(),
      this.getSeo(),
      this.getSettings(),
      this.getPages(),
      this.getImages(),
    ]);

    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      institution: 'Darul Uloom Siddiqia',
      data: {
        madrasa,
        leadership,
        students,
        programs,
        staff,
        facilities,
        gallery,
        videos,
        notices,
        events,
        admission,
        donation,
        faq,
        contact,
        social,
        seo,
        settings,
        pages,
        images,
      },
    };
  },

  async importFullBackup(backup: any): Promise<boolean> {
    if (!backup || !backup.data) {
      throw new Error('Invalid backup format');
    }
    const d = backup.data;
    if (d.madrasa) await this.updateMadrasaInfo(d.madrasa);
    if (d.leadership) await this.updateLeadership(d.leadership);
    if (d.students) await this.updateStudentStats(d.students);
    if (d.admission) await this.updateAdmissionInfo(d.admission);
    if (d.donation) await this.updateDonationInfo(d.donation);
    if (d.contact) await this.updateContactInfo(d.contact);
    if (d.social) await this.updateSocialLinks(d.social);
    if (d.seo) await this.updateSeo(d.seo);
    if (d.settings) await this.updateSettings(d.settings);

    if (Array.isArray(d.programs)) {
      for (const item of d.programs) await this.saveProgram(item);
    }
    if (Array.isArray(d.staff)) {
      for (const item of d.staff) await this.saveStaff(item);
    }
    if (Array.isArray(d.facilities)) {
      for (const item of d.facilities) await this.saveFacility(item);
    }
    if (Array.isArray(d.gallery)) {
      for (const item of d.gallery) await this.saveGalleryItem(item);
    }
    if (Array.isArray(d.videos)) {
      for (const item of d.videos) await this.saveVideo(item);
    }
    if (Array.isArray(d.notices)) {
      for (const item of d.notices) await this.saveNotice(item);
    }
    if (Array.isArray(d.events)) {
      for (const item of d.events) await this.saveEvent(item);
    }
    if (Array.isArray(d.faq)) {
      for (const item of d.faq) await this.saveFaq(item);
    }
    if (Array.isArray(d.pages)) {
      for (const item of d.pages) await this.savePage(item);
    }
    if (Array.isArray(d.images)) {
      for (const item of d.images) await this.saveImageRecord(item);
    }
    return true;
  },

  // Reset to institutional defaults if desired by admin
  resetToDefaults(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'madrasa');
      localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'leadership');
      localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'students');
      localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'programs');
      localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'staff');
      localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'facilities');
      localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'gallery');
      localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'videos');
      localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'notices');
      localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'events');
      localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'admission');
      localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'donation');
      localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'contact');
      localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'social');
      localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'seo');
      localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'settings');
      localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'pages');
    }
  },
};
