'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';
import { cmsService } from '@/lib/cmsService';
import { MadrasaInfo, Leadership, SocialLink } from '@/lib/types';

export default function Footer() {
  const { t, language } = useLanguage();
  const [madrasa, setMadrasa] = useState<MadrasaInfo | null>(null);
  const [leadership, setLeadership] = useState<Leadership | null>(null);
  const [socials, setSocials] = useState<SocialLink[]>([]);

  useEffect(() => {
    async function loadFooterData() {
      try {
        const [m, l, s] = await Promise.all([
          cmsService.getMadrasaInfo(),
          cmsService.getLeadership(),
          cmsService.getSocialLinks(),
        ]);
        setMadrasa(m);
        setLeadership(l);
        setSocials(s.filter((item) => item.enabled));
      } catch (e) {
        console.warn('Footer data load error:', e);
      }
    }
    loadFooterData();
  }, []);

  const phone = madrasa?.phone || '+91 8828290721';
  const email = madrasa?.email || 'info@darululoomsiddiqia.edu';
  const nazim = leadership?.nazimName || 'Maulana Abdus Subhan';
  const address = `${madrasa?.address || 'Aurahi East, Simraha'}, District ${madrasa?.district || 'Araria'}, ${madrasa?.state || 'Bihar'}, ${madrasa?.country || 'India'} - ${madrasa?.pincode || '854318'}`;

  return (
    <footer className="bg-[#022c22] text-stone-300 pt-16 pb-12 border-t-4 border-amber-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-emerald-900/60">
          {/* Column 1: Institutional Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-800/80 border border-amber-500/40 flex items-center justify-center text-amber-300 font-serif font-bold text-xl">
                ص
              </div>
              <div>
                <h3 className="text-white font-serif font-bold text-lg tracking-tight">
                  {madrasa?.name || 'Darul Uloom Siddiqia'}
                </h3>
                <p className="text-xs text-amber-400 font-serif">
                  {madrasa?.arabicName || 'دار العلوم الصديقية'}
                </p>
              </div>
            </div>
            <p className="text-xs text-stone-300/80 leading-relaxed">
              {t.footer.aboutText}
            </p>
            <div className="pt-2 border-t border-emerald-900/40">
              <p className="text-xs text-amber-300/90 font-medium">
                {t.nazimTitle}: <span className="text-white font-semibold">{nazim}</span>
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Designation: Nazim / Rector
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-400 font-serif">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-amber-300 transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-300 transition-colors">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link href="/nazim" className="hover:text-amber-300 transition-colors">
                  {t.nav.nazim}
                </Link>
              </li>
              <li>
                <Link href="/students" className="hover:text-amber-300 transition-colors">
                  {t.nav.students}
                </Link>
              </li>
              <li>
                <Link href="/staff" className="hover:text-amber-300 transition-colors">
                  {t.nav.staff}
                </Link>
              </li>
              <li>
                <Link href="/facilities" className="hover:text-amber-300 transition-colors">
                  {t.nav.facilities}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-amber-300 transition-colors">
                  {t.nav.faq}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Academic Wings & Opportunities */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-400 font-serif">
              {t.footer.academicWings}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/education" className="hover:text-amber-300 transition-colors">
                  Hifz-ul-Quran & Tajweed
                </Link>
              </li>
              <li>
                <Link href="/education" className="hover:text-amber-300 transition-colors">
                  Dars-e-Nizami (Alimiyyah)
                </Link>
              </li>
              <li>
                <Link href="/education" className="hover:text-amber-300 transition-colors">
                  Dawrah-e-Hadith (Fazilat)
                </Link>
              </li>
              <li>
                <Link href="/education" className="hover:text-amber-300 transition-colors">
                  Primary Islamic Maktab
                </Link>
              </li>
              <li>
                <Link href="/admission" className="text-amber-300 hover:text-white font-medium transition-colors">
                  ➔ {t.common.applyNow}
                </Link>
              </li>
              <li>
                <Link href="/donation" className="text-amber-300 hover:text-white font-medium transition-colors">
                  ➔ {t.common.donateNow}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-400 font-serif">
              {t.footer.contactDetails}
            </h4>
            <p className="text-xs text-stone-300/90 leading-relaxed">
              📍 {address}
            </p>
            <p className="text-xs">
              <a href={`tel:${phone}`} className="hover:text-white transition-colors">
                📞 {phone}
              </a>
            </p>
            <p className="text-xs">
              <a
                href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-white transition-colors"
              >
                💬 WhatsApp: {phone}
              </a>
            </p>
            <p className="text-xs text-stone-400">
              ✉️ {email}
            </p>

            {/* Social Links */}
            {socials.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-semibold text-stone-300 mb-2">Connect with us:</p>
                <div className="flex flex-wrap gap-2">
                  {socials.map((soc) => (
                    <a
                      key={soc.id}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800/80 rounded text-xs text-stone-200 transition-colors"
                    >
                      {soc.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} {t.footer.allRightsReserved}</p>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-white transition-colors">
              {t.nav.contact}
            </Link>
            <span>•</span>
            <Link href="/admission" className="hover:text-white transition-colors">
              {t.nav.admission}
            </Link>
            <span>•</span>
            <Link href="/admin" className="text-stone-400 hover:text-amber-300 transition-colors">
              {t.nav.admin}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
