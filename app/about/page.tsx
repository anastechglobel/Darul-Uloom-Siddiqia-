'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cmsService } from '@/lib/cmsService';
import { MadrasaInfo, Leadership } from '@/lib/types';

export default function AboutPage() {
  const [madrasa, setMadrasa] = useState<MadrasaInfo | null>(null);
  const [leadership, setLeadership] = useState<Leadership | null>(null);

  useEffect(() => {
    async function loadData() {
      const [m, l] = await Promise.all([
        cmsService.getMadrasaInfo(),
        cmsService.getLeadership(),
      ]);
      setMadrasa(m);
      setLeadership(l);
    }
    loadData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Banner */}
        <section className="bg-[#022c22] text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-3">
            <span className="text-xs font-bold tracking-widest text-amber-300 uppercase">
              About the Institution
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold">
              Darul Uloom Siddiqia
            </h1>
            <p className="text-amber-200 font-serif text-sm sm:text-base">
              Aurahi East, Simraha, Araria, Bihar, India
            </p>
          </div>
        </section>

        {/* Narrative & History */}
        <section className="py-16 px-4 max-w-5xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4 text-stone-700 leading-relaxed text-sm sm:text-base">
              <h2 className="text-2xl font-serif font-bold text-stone-900">
                Foundational Heritage & Origins
              </h2>
              <p>
                Darul Uloom Siddiqia was established in 1998 with the sacred aspiration of imparting authentic, classical Islamic scholarship, memorization of the Holy Quran, and prophetic moral rectitude to children and youths in northeastern Bihar.
              </p>
              <p>
                Located in the peaceful rural settlement of Aurahi East, Simraha in Araria district, the madrasa was founded by revered religious leaders under the executive stewardship of Nazim Maulana Abdus Subhan.
              </p>
              <p>
                From an initial humble gathering of local students studying on mats, the institution has blossomed into a premier residential Islamic seminary catering to over 550 students, with 340+ boarding scholars receiving 100% free lodging, sustenance, medical care, and education.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md border border-stone-200">
              <img
                src={madrasa?.bannerUrl || 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=800&q=80'}
                alt="Darul Uloom Siddiqia Campus"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>

          {/* Mission & Vision Bento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="p-8 bg-white border border-stone-200 rounded-2xl shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xl">
                ✦
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900">Our Sacred Mission</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                {madrasa?.mission ||
                  'To preserve and impart sacred Quranic sciences, authentic Hadith, and Islamic jurisprudence while equipping students with moral fortitude and civic responsibility to serve humanity.'}
              </p>
            </div>

            <div className="p-8 bg-white border border-stone-200 rounded-2xl shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-xl">
                ★
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900">Our Institutional Vision</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                {madrasa?.vision ||
                  'To nurture upright Huffaz, erudite scholars (Ulama), and conscientious leaders who synthesize timeless divine wisdom with compassion, integrity, and active community benefit.'}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
