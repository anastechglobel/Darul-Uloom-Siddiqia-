'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cmsService } from '@/lib/cmsService';
import { StaffMember } from '@/lib/types';

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const list = await cmsService.getStaff();
        setStaff(list.filter((s) => s.published).sort((a, b) => a.order - b.order));
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
              Scholarly Faculty & Mentors
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold">
              Teachers & Staff
            </h1>
            <p className="text-amber-200 font-serif text-sm sm:text-base">
              Certified Ulama, Huffaz, and Dedicated Administrative Staff
            </p>
          </div>
        </section>

        {/* Staff Directory */}
        <section className="py-16 px-4 max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Our Distinguished Educators
            </h2>
            <p className="text-stone-600 text-sm">
              Mentoring students with sacred knowledge, prophetic kindness, and strict pedagogical discipline.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {staff.map((member) => (
              <div
                key={member.id}
                className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                <div className="h-64 bg-stone-100 relative">
                  <img
                    src={
                      member.imageUrl ||
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80'
                    }
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-0.5 rounded font-medium">
                    {member.department}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-serif font-bold text-stone-900 text-lg">
                      {member.name}
                    </h3>
                    {member.nameUrdu && (
                      <p className="text-xs text-stone-500 font-arabic mt-0.5" dir="rtl">
                        {member.nameUrdu}
                      </p>
                    )}
                    <p className="text-xs font-semibold text-amber-800 mt-1">
                      {member.designation}
                    </p>
                    <p className="text-xs text-emerald-900 bg-emerald-50 px-2 py-1 rounded inline-block mt-2 font-medium">
                      🎓 {member.qualification}
                    </p>
                    <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                      {member.biography}
                    </p>
                  </div>

                  {member.contactEmail && (
                    <div className="pt-3 border-t border-stone-100 text-xs text-stone-500">
                      ✉️ {member.contactEmail}
                    </div>
                  )}
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
