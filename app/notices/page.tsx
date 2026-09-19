'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cmsService } from '@/lib/cmsService';
import { Notice } from '@/lib/types';

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const list = await cmsService.getNotices();
        setNotices(list.filter((n) => n.published));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = ['All', 'Academic', 'Admission', 'General', 'Examination', 'Holiday'];

  const filtered = notices.filter((n) => {
    const matchesCat =
      selectedCategory === 'All' ||
      n.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Banner */}
        <section className="bg-[#022c22] text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-2">
            <span className="text-xs font-bold tracking-widest text-amber-300 uppercase">
              Official Bulletins & Circulars
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold">
              Notice Board
            </h1>
            <p className="text-amber-200 font-serif text-sm sm:text-base">
              Verified Institutional Announcements, Exam Dates, and Admissions
            </p>
          </div>
        </section>

        {/* Notices Section */}
        <section className="py-14 px-4 max-w-5xl mx-auto space-y-8">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#064e3b] text-white font-semibold'
                      : 'bg-stone-200/80 text-stone-700 hover:bg-stone-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="Search notices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 text-stone-500 text-sm">
              No matching notices found.
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((n) => (
                <div
                  key={n.id}
                  className={`bg-white rounded-2xl p-6 border shadow-xs transition-all space-y-3 ${
                    n.priority === 'urgent'
                      ? 'border-rose-300 bg-rose-50/20'
                      : n.priority === 'high'
                      ? 'border-amber-300'
                      : 'border-stone-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded ${
                          n.priority === 'urgent'
                            ? 'bg-rose-100 text-rose-800'
                            : n.priority === 'high'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        {n.priority}
                      </span>
                      <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                        {n.category}
                      </span>
                    </div>

                    <div className="text-xs text-stone-400">
                      Date: <strong className="text-stone-700">{n.publishedDate}</strong>
                      {n.expiryDate && (
                        <span className="ml-2 text-stone-400">
                          (Valid until {n.expiryDate})
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-stone-900 leading-snug">
                    {n.title}
                  </h3>
                  {n.titleUrdu && (
                    <p className="text-xs text-stone-500 font-arabic" dir="rtl">
                      {n.titleUrdu}
                    </p>
                  )}

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                    {n.content}
                  </p>

                  {n.externalLink && (
                    <div className="pt-2">
                      <Link
                        href={n.externalLink}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#064e3b] hover:text-emerald-800"
                      >
                        <span>{n.linkText || 'Read more details'}</span> ➔
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
