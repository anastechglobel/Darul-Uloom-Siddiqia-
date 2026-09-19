'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cmsService } from '@/lib/cmsService';
import { StudentStats } from '@/lib/types';

export default function StudentsPage() {
  const [stats, setStats] = useState<StudentStats | null>(null);

  useEffect(() => {
    async function load() {
      const s = await cmsService.getStudentStats();
      setStats(s);
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
              Student Life & Demographics
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold">
              Students of Siddiqia
            </h1>
            <p className="text-amber-200 font-serif text-sm sm:text-base">
              Nurturing Upright Scholars & Memorizers of the Quran
            </p>
          </div>
        </section>

        {/* Aggregate Stats Cards */}
        <section className="py-16 px-4 max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Aggregate Student Body (Academic Year {stats?.lastUpdatedYear || '2026'})
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              All students receive 100% waqf-sponsored boarding, food, and tuition supported by donors.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 bg-white border border-stone-200 rounded-2xl text-center shadow-xs">
              <span className="text-3xl sm:text-4xl font-serif font-extrabold text-[#064e3b]">
                {stats?.totalStudents || 550}+
              </span>
              <p className="text-sm font-semibold text-stone-800 mt-2">Total Enrolled</p>
              <p className="text-xs text-stone-500 mt-0.5">Active students</p>
            </div>

            <div className="p-6 bg-white border border-stone-200 rounded-2xl text-center shadow-xs">
              <span className="text-3xl sm:text-4xl font-serif font-extrabold text-[#064e3b]">
                {stats?.residentialStudents || 340}+
              </span>
              <p className="text-sm font-semibold text-stone-800 mt-2">Residential Boarders</p>
              <p className="text-xs text-stone-500 mt-0.5">Living in Dar-ul-Iqama</p>
            </div>

            <div className="p-6 bg-white border border-stone-200 rounded-2xl text-center shadow-xs">
              <span className="text-3xl sm:text-4xl font-serif font-extrabold text-[#064e3b]">
                {stats?.dayScholarStudents || 210}+
              </span>
              <p className="text-sm font-semibold text-stone-800 mt-2">Day Scholars</p>
              <p className="text-xs text-stone-500 mt-0.5">From surrounding villages</p>
            </div>

            <div className="p-6 bg-white border border-stone-200 rounded-2xl text-center shadow-xs">
              <span className="text-3xl sm:text-4xl font-serif font-extrabold text-amber-600">
                {stats?.graduatedScholars || 740}+
              </span>
              <p className="text-sm font-semibold text-stone-800 mt-2">Graduated Alumni</p>
              <p className="text-xs text-stone-500 mt-0.5">Serving across India</p>
            </div>
          </div>

          {/* Daily Schedule & Life */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-8 space-y-6">
            <h3 className="text-xl font-serif font-bold text-stone-900">
              A Day in the Life of a Residential Student
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1.5">
                <span className="text-xs font-bold text-emerald-800 uppercase">Dawn Session</span>
                <h4 className="font-bold text-stone-900">Fajr to Ishraq</h4>
                <p className="text-stone-600 leading-relaxed">
                  Congregational prayer in Jamea Masjid followed by the prime Quranic memorization (Sabak) halaqah when the mind is clearest.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1.5">
                <span className="text-xs font-bold text-amber-800 uppercase">Day Session</span>
                <h4 className="font-bold text-stone-900">Morning & Afternoon</h4>
                <p className="text-stone-600 leading-relaxed">
                  Breakfast followed by rigorous Dars-e-Nizami theological classes, Arabic grammar, hadith lectures, and foundational language literacy.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1.5">
                <span className="text-xs font-bold text-stone-800 uppercase">Evening Session</span>
                <h4 className="font-bold text-stone-900">Asr to Night Rest</h4>
                <p className="text-stone-600 leading-relaxed">
                  Physical recreation, Asr prayer, Sabki & Manzil revisions, dinner in Matbakh, night revision halaqah, and peaceful rest at 10:00 PM.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
