'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cmsService } from '@/lib/cmsService';
import { FAQItem } from '@/lib/types';

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const list = await cmsService.getFAQs();
        setFaqs(list.filter((f) => f.published).sort((a, b) => a.order - b.order));
        if (list.length > 0) {
          setOpenId(list[0].id);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = ['All', 'Admission', 'Academic', 'Hostel', 'Donation', 'General'];

  const filtered =
    selectedCategory === 'All'
      ? faqs
      : faqs.filter((f) => f.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Banner */}
        <section className="bg-[#022c22] text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-2">
            <span className="text-xs font-bold tracking-widest text-amber-300 uppercase">
              Clarity & Common Inquiries
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold">
              Frequently Asked Questions
            </h1>
            <p className="text-amber-200 font-serif text-sm sm:text-base">
              Find answers regarding admissions, campus life, syllabus, and donations.
            </p>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 px-4 max-w-4xl mx-auto space-y-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#064e3b] text-white font-semibold'
                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filtered.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/50"
                  >
                    <span className="font-serif font-bold text-stone-900 text-base sm:text-lg">
                      {item.question}
                    </span>
                    <span className="text-stone-400 font-bold text-xl shrink-0">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 pt-0 text-stone-600 text-xs sm:text-sm leading-relaxed border-t border-stone-100 bg-stone-50/30">
                      <p className="pt-4 whitespace-pre-line">{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
