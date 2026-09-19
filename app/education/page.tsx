'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cmsService } from '@/lib/cmsService';
import { Program } from '@/lib/types';

export default function EducationPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const progs = await cmsService.getPrograms();
        setPrograms(progs.filter((p) => p.published).sort((a, b) => a.order - b.order));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Banner */}
        <section className="bg-[#022c22] text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-2">
            <span className="text-xs font-bold tracking-widest text-amber-300 uppercase">
              Academic Wings & Curriculum
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold">
              Education & Programs
            </h1>
            <p className="text-amber-200 font-serif text-sm sm:text-base">
              Classical Islamic Disciplines • Traditional Sanad • 100% Free Tuition
            </p>
          </div>
        </section>

        {/* Programs List */}
        <section className="py-16 px-4 max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Offered Academic Courses
            </h2>
            <p className="text-stone-600 text-sm">
              Our structured educational departments combine classical texts, meticulous phonetic recitation, and ethical mentoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((prog) => (
              <div
                key={prog.id}
                className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                {prog.featuredImageUrl && (
                  <div className="h-52 w-full overflow-hidden bg-stone-100">
                    <img
                      src={prog.featuredImageUrl}
                      alt={prog.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6 space-y-4 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded">
                      ⏱ Duration: {prog.duration}
                    </span>
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded">
                      {prog.feesType}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-serif font-bold text-stone-900 leading-snug">
                      {prog.title}
                    </h3>
                    {prog.titleUrdu && (
                      <p className="text-xs text-stone-500 font-arabic mt-1" dir="rtl">
                        {prog.titleUrdu}
                      </p>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {prog.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
                    <p className="text-stone-700">
                      <strong className="text-stone-900">Eligibility:</strong> {prog.eligibility}
                    </p>
                    {prog.schedule && (
                      <p className="text-stone-700">
                        <strong className="text-stone-900">Schedule:</strong> {prog.schedule}
                      </p>
                    )}
                  </div>

                  {prog.curriculumOverview && prog.curriculumOverview.length > 0 && (
                    <div className="pt-2">
                      <p className="text-xs font-semibold text-stone-900 mb-1.5">
                        Key Subjects & Curriculum:
                      </p>
                      <ul className="space-y-1 text-xs text-stone-600">
                        {prog.curriculumOverview.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-700 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href="/admission"
                    className="block w-full text-center py-2.5 bg-[#064e3b] hover:bg-[#022c22] text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    Inquire / Apply for this Program ➔
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
