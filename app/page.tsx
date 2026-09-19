'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SectionRenderer from '@/components/SectionRenderer';
import { useLanguage } from '@/components/LanguageContext';
import { cmsService } from '@/lib/cmsService';
import {
  CMSPage,
  MadrasaInfo,
  Leadership,
  StudentStats,
  Program,
  Notice,
  EventItem,
  SystemSettings,
} from '@/lib/types';

export default function HomePage() {
  const { t, language } = useLanguage();
  const [homePage, setHomePage] = useState<CMSPage | null>(null);
  const [madrasa, setMadrasa] = useState<MadrasaInfo | null>(null);
  const [leadership, setLeadership] = useState<Leadership | null>(null);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [p, m, l, s, progs, nots, evts, sett] = await Promise.all([
          cmsService.getPageBySlug('home'),
          cmsService.getMadrasaInfo(),
          cmsService.getLeadership(),
          cmsService.getStudentStats(),
          cmsService.getPrograms(),
          cmsService.getNotices(),
          cmsService.getEvents(),
          cmsService.getSettings(),
        ]);
        setHomePage(p);
        setMadrasa(m);
        setLeadership(l);
        setStats(s);
        setPrograms(progs.filter((item) => item.published));
        setNotices(nots.filter((item) => item.published).slice(0, 3));
        setEvents(evts.filter((item) => item.published).slice(0, 2));
        setSettings(sett);
      } catch (err) {
        console.warn('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Announcement Ticker if enabled */}
      {settings?.enableTicker && settings?.announcementTicker && (
        <div className="bg-amber-600 text-stone-950 text-xs font-semibold py-2 px-4 flex items-center border-b border-amber-700/50">
          <div className="max-w-7xl mx-auto w-full flex items-center gap-3">
            <span className="bg-stone-950 text-amber-300 uppercase px-2 py-0.5 rounded text-[10px] tracking-wider font-bold shrink-0">
              Notice
            </span>
            <div className="overflow-hidden whitespace-nowrap">
              <p className="animate-marquee inline-block">{settings.announcementTicker}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Dynamic Sections from CMS */}
      {homePage?.sections && homePage.sections.length > 0 ? (
        <main className="flex-1">
          {homePage.sections
            .sort((a, b) => a.order - b.order)
            .map((sec) => (
              <SectionRenderer
                key={sec.id}
                section={sec}
                programs={programs}
                notices={notices}
                events={events}
              />
            ))}
        </main>
      ) : (
        /* Fallback institutional hero & sections if sections are empty */
        <main className="flex-1">
          <section className="bg-gradient-to-b from-[#022c22] to-[#064e3b] text-white py-20 px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs uppercase font-bold tracking-widest">
                {t.hero.badge}
              </span>
              <h1 className="text-4xl sm:text-6xl font-serif font-extrabold tracking-tight">
                {madrasa?.name || 'DARUL ULOOM SIDDIQIA'}
              </h1>
              <p className="text-amber-300 text-lg sm:text-xl font-serif">
                {madrasa?.tagline || 'Rooted in Deen, Rising with Knowledge'}
              </p>
              <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                {madrasa?.description}
              </p>
              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <Link
                  href="/admission"
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg text-sm"
                >
                  {t.common.applyNow}
                </Link>
                <Link
                  href="/donation"
                  className="px-6 py-3 bg-emerald-900 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 font-medium rounded-lg text-sm"
                >
                  {t.common.donateNow}
                </Link>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Featured Notices & Events Highlight Bar */}
      {notices.length > 0 && (
        <section className="bg-stone-50 py-12 border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                  Important Communications
                </span>
                <h2 className="text-2xl font-serif font-bold text-stone-900">
                  Latest Notices & Announcements
                </h2>
              </div>
              <Link
                href="/notices"
                className="text-xs font-semibold text-[#064e3b] hover:text-emerald-900 flex items-center gap-1"
              >
                <span>{t.common.viewAll}</span> ➔
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {notices.map((n) => (
                <div
                  key={n.id}
                  className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs hover:border-amber-600/60 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          n.priority === 'urgent'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {n.category}
                      </span>
                      <span className="text-xs text-stone-400">{n.publishedDate}</span>
                    </div>
                    <h3 className="font-serif font-bold text-stone-900 text-base leading-snug mb-2">
                      {n.title}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                      {n.content}
                    </p>
                  </div>
                  {n.externalLink && (
                    <div className="mt-4 pt-3 border-t border-stone-100">
                      <Link
                        href={n.externalLink}
                        className="text-xs font-semibold text-[#064e3b] hover:underline"
                      >
                        {n.linkText || 'Read details'} ➔
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
