'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cmsService } from '@/lib/cmsService';
import { Leadership, MadrasaInfo } from '@/lib/types';

export default function NazimPage() {
  const [leadership, setLeadership] = useState<Leadership | null>(null);
  const [madrasa, setMadrasa] = useState<MadrasaInfo | null>(null);

  useEffect(() => {
    async function load() {
      const [l, m] = await Promise.all([
        cmsService.getLeadership(),
        cmsService.getMadrasaInfo(),
      ]);
      setLeadership(l);
      setMadrasa(m);
    }
    load();
  }, []);

  const phone = leadership?.phone || madrasa?.phone || '+91 8828290721';
  const name = leadership?.nazimName || 'Maulana Abdus Subhan';
  const designation = leadership?.designation || 'Nazim';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Banner */}
        <section className="bg-[#022c22] text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-2">
            <span className="text-xs font-bold tracking-widest text-amber-300 uppercase">
              Seminary Leadership & Rectory
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold">
              {name}
            </h1>
            <p className="text-amber-200 font-serif text-sm sm:text-base">
              {designation}, Darul Uloom Siddiqia
            </p>
          </div>
        </section>

        {/* Profile Card & Message */}
        <section className="py-16 px-4 max-w-5xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Left: Rector Photo & Contacts */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs text-center space-y-4">
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-amber-600/30 shadow-md">
                <img
                  src={
                    leadership?.imageUrl ||
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-lg font-serif font-bold text-stone-900">{name}</h2>
                <p className="text-xs font-medium text-amber-800">{designation}</p>
                <p className="text-xs text-stone-500 mt-1">Darul Uloom Siddiqia</p>
              </div>

              <div className="pt-4 border-t border-stone-100 text-left space-y-2.5 text-xs text-stone-600">
                <div>
                  <span className="font-semibold block text-stone-800">Direct Phone:</span>
                  <a href={`tel:${phone}`} className="text-emerald-800 hover:underline">
                    {phone}
                  </a>
                </div>
                <div>
                  <span className="font-semibold block text-stone-800">WhatsApp Communication:</span>
                  <a
                    href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:underline"
                  >
                    +91 8828290721 (Click to Chat)
                  </a>
                </div>
                <div>
                  <span className="font-semibold block text-stone-800">Office Hours:</span>
                  <span>{leadership?.officeHours || '9:00 AM – 1:00 PM & 3:00 PM – 5:00 PM'}</span>
                </div>
              </div>
            </div>

            {/* Right: Biography & Message */}
            <div className="md:col-span-2 space-y-8">
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-8 space-y-4">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  Rector’s Official Message
                </span>
                <blockquote className="text-stone-800 text-sm sm:text-base leading-relaxed italic font-serif">
                  “{leadership?.message}”
                </blockquote>
              </div>

              <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed">
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  Biography & Institutional Dedication
                </h3>
                <p>{leadership?.biography}</p>
                <p>
                  Maulana Abdus Subhan’s steadfast vision ensures that all students at Darul Uloom Siddiqia receive not only rigorous academic and theological instruction but also complete moral mentoring, ensuring they graduate as pillars of upright character, compassion, and communal harmony.
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
