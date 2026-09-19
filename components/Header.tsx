'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from './LanguageContext';
import { cmsService } from '@/lib/cmsService';
import { CMSPage, MadrasaInfo } from '@/lib/types';
import { Language } from '@/lib/types';

export default function Header() {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [customPages, setCustomPages] = useState<CMSPage[]>([]);
  const [pagesDropdownOpen, setPagesDropdownOpen] = useState(false);
  const [madrasa, setMadrasa] = useState<MadrasaInfo | null>(null);

  useEffect(() => {
    async function loadNavData() {
      try {
        const [pagesData, madrasaData] = await Promise.all([
          cmsService.getPages(),
          cmsService.getMadrasaInfo(),
        ]);
        setCustomPages(
          pagesData.filter(
            (p) => p.status === 'published' && p.isInNavigation && !p.isSystemPage
          )
        );
        setMadrasa(madrasaData);
      } catch (err) {
        console.warn('Failed loading navigation items:', err);
      }
    }
    loadNavData();
  }, []);

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'ur', label: 'Urdu', native: 'اردو' },
    { code: 'ar', label: 'Arabic', native: 'العربية' },
  ];

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/about', label: t.nav.about },
    { href: '/nazim', label: t.nav.nazim },
    { href: '/education', label: t.nav.education },
    { href: '/students', label: t.nav.students },
    { href: '/staff', label: t.nav.staff },
    { href: '/facilities', label: t.nav.facilities },
    { href: '/gallery', label: t.nav.gallery },
    { href: '/videos', label: t.nav.videos },
    { href: '/notices', label: t.nav.notices },
    { href: '/events', label: t.nav.events },
    { href: '/admission', label: t.nav.admission },
    { href: '/contact', label: t.nav.contact },
  ];

  const phone = madrasa?.phone || '+91 8828290721';
  const location = madrasa?.address || 'Aurahi East, Simraha, Araria, Bihar';

  return (
    <header className="w-full sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-xs border-b border-stone-200">
      {/* Top Notification / Contact Bar */}
      <div className="bg-[#022c22] text-stone-200 text-xs py-2 px-4 border-b border-[#064e3b]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 font-medium text-emerald-200">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {location}
            </span>
            <span className="hidden sm:inline-block text-stone-500">•</span>
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <span>📞</span> {phone}
            </a>
            <span className="hidden sm:inline-block text-stone-500">•</span>
            <a
              href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1 text-emerald-300 hover:text-white transition-colors"
            >
              <span>💬 WhatsApp:</span> {phone}
            </a>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-[#064e3b]/80 px-2 py-0.5 rounded-md text-[11px]">
              <span className="text-emerald-300 mr-1">🌐</span>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-1.5 py-0.5 rounded font-medium transition-all ${
                    language === lang.code
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-2xs'
                      : 'text-stone-300 hover:text-white'
                  }`}
                  title={lang.label}
                >
                  {lang.native}
                </button>
              ))}
            </div>

            <Link
              href="/admin"
              className="text-[11px] bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 px-2.5 py-0.5 rounded border border-emerald-700/50 font-medium transition-colors"
            >
              {t.nav.admin}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Branding Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#064e3b] to-[#022c22] border border-amber-600/40 shadow-xs flex items-center justify-center text-amber-300 font-serif font-bold text-2xl group-hover:scale-105 transition-transform">
            <span>ص</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-serif font-extrabold tracking-tight text-[#022c22] leading-none">
              {madrasa?.name || 'DARUL ULOOM SIDDIQIA'}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold text-amber-700 tracking-wider font-serif">
                {language === 'ur'
                  ? madrasa?.taglineUrdu || 'دین میں گہری جڑیں، علم کے ساتھ سربلندی'
                  : language === 'ar'
                  ? madrasa?.taglineArabic || 'جذور في الدين، وسمو بالمعرفة'
                  : language === 'hi'
                  ? madrasa?.taglineHindi || 'दीन में जड़ें, ज्ञान के साथ प्रगति'
                  : madrasa?.tagline || 'Rooted in Deen, Rising with Knowledge'}
              </span>
              <span className="text-xs text-stone-400 hidden lg:inline">|</span>
              <span className="text-xs font-medium text-stone-500 font-arabic hidden lg:inline" dir="rtl">
                دار العلوم الصديقية
              </span>
            </div>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/donation"
            className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium text-sm rounded-lg shadow-xs transition-all flex items-center gap-2"
          >
            <span>🤲</span> {t.common.donateNow}
          </Link>
          <Link
            href="/admission"
            className="px-4 py-2.5 bg-[#064e3b] hover:bg-[#022c22] text-white font-medium text-sm rounded-lg transition-colors"
          >
            {t.common.applyNow}
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-100 focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Desktop Main Navigation Bar */}
      <nav className="hidden lg:block bg-stone-50 border-t border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-1 overflow-x-auto py-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-[#064e3b] text-white'
                      : 'text-stone-700 hover:text-[#064e3b] hover:bg-stone-200/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Custom Dynamic Pages Dropdown */}
            {customPages.length > 0 && (
              <div className="relative inline-block text-left">
                <button
                  type="button"
                  onClick={() => setPagesDropdownOpen(!pagesDropdownOpen)}
                  className="px-3 py-2 text-xs font-semibold rounded-md text-stone-700 hover:text-[#064e3b] hover:bg-stone-200/60 flex items-center gap-1"
                >
                  <span>{t.nav.pages}</span>
                  <span className="text-[10px]">▼</span>
                </button>
                {pagesDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 py-1">
                    {customPages.map((page) => (
                      <Link
                        key={page.id}
                        href={`/${page.slug}`}
                        onClick={() => setPagesDropdownOpen(false)}
                        className="block px-4 py-2 text-xs text-stone-700 hover:bg-emerald-50 hover:text-emerald-900"
                      >
                        {page.navLabel || page.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-stone-200 px-4 pt-3 pb-6 space-y-2 max-h-[80vh] overflow-y-auto shadow-xl">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Link
              href="/donation"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 bg-amber-600 text-white text-center font-medium text-xs rounded-lg flex items-center justify-center gap-1.5"
            >
              <span>🤲</span> {t.common.donateNow}
            </Link>
            <Link
              href="/admission"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 bg-[#064e3b] text-white text-center font-medium text-xs rounded-lg"
            >
              {t.common.applyNow}
            </Link>
          </div>

          <div className="divide-y divide-stone-100">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2.5 px-2 text-sm font-medium rounded-md ${
                  pathname === link.href
                    ? 'bg-emerald-50 text-emerald-900 font-semibold'
                    : 'text-stone-700 hover:text-[#064e3b]'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {customPages.map((page) => (
              <Link
                key={page.id}
                href={`/${page.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-2 text-sm text-stone-700 hover:text-[#064e3b]"
              >
                {page.navLabel || page.title}
              </Link>
            ))}

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-2 text-sm font-bold text-amber-800 hover:bg-amber-50 rounded-md"
            >
              🔐 {t.nav.admin}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
