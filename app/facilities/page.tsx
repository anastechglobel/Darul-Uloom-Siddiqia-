'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cmsService } from '@/lib/cmsService';
import { Facility } from '@/lib/types';

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const list = await cmsService.getFacilities();
        setFacilities(list.filter((f) => f.published).sort((a, b) => a.order - b.order));
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
              Infrastructure & Environment
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold">
              Campus & Facilities
            </h1>
            <p className="text-amber-200 font-serif text-sm sm:text-base">
              A Serene Educational Sanctuary in Aurahi East, Simraha, Araria
            </p>
          </div>
        </section>

        {/* Facilities Grid */}
        <section className="py-16 px-4 max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Campus Amenities & Buildings
            </h2>
            <p className="text-stone-600 text-sm">
              Designed for spiritual reflection, rigorous intellectual research, and hygienic residential living.
            </p>
          </div>

          <div className="space-y-10">
            {facilities.map((fac, idx) => {
              const isEven = idx % 2 === 1;
              return (
                <div
                  key={fac.id}
                  className={`bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                    isEven ? 'lg:grid-flow-col-dense' : ''
                  }`}
                >
                  <div className={`p-8 space-y-4 ${isEven ? 'lg:col-start-2' : ''}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded">
                        {fac.category}
                      </span>
                      {fac.capacity && (
                        <span className="text-[11px] font-semibold text-stone-500">
                          Capacity: {fac.capacity}
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-serif font-bold text-stone-900">
                      {fac.title}
                    </h3>

                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                      {fac.description}
                    </p>

                    {fac.features && fac.features.length > 0 && (
                      <div className="pt-3 border-t border-stone-100">
                        <p className="text-xs font-semibold text-stone-900 mb-2">
                          Key Amenities & Highlights:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {fac.features.map((feat, fidx) => (
                            <div key={fidx} className="flex items-center gap-2 text-xs text-stone-600">
                              <span className="text-emerald-700 font-bold">✓</span>
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {fac.imageUrl && (
                    <div className={`h-80 w-full overflow-hidden bg-stone-100 ${isEven ? 'lg:col-start-1' : ''}`}>
                      <img
                        src={fac.imageUrl}
                        alt={fac.title}
                        className="w-full h-full object-cover"
                      />
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
