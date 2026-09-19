'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cmsService } from '@/lib/cmsService';
import { EventItem } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const list = await cmsService.getEvents();
        setEvents(list.filter((e) => e.published));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const upcoming = events.filter((e) => !e.isPast);
  const past = events.filter((e) => e.isPast);
  const displayed = tab === 'upcoming' ? upcoming : past;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Banner */}
        <section className="bg-[#022c22] text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-2">
            <span className="text-xs font-bold tracking-widest text-amber-300 uppercase">
              Seminary Assemblies & Convocations
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold">
              Events & Programs
            </h1>
            <p className="text-amber-200 font-serif text-sm sm:text-base">
              Annual Dastarbandi, Qirat Contests, and Spiritual Gatherings
            </p>
          </div>
        </section>

        {/* Tab Switcher */}
        <section className="py-14 px-4 max-w-5xl mx-auto space-y-8">
          <div className="flex justify-center">
            <div className="bg-stone-200 p-1 rounded-xl flex gap-1 text-xs font-semibold">
              <button
                onClick={() => setTab('upcoming')}
                className={`px-5 py-2 rounded-lg transition-all cursor-pointer ${
                  tab === 'upcoming'
                    ? 'bg-[#064e3b] text-white shadow-xs'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                Upcoming Events ({upcoming.length})
              </button>
              <button
                onClick={() => setTab('past')}
                className={`px-5 py-2 rounded-lg transition-all cursor-pointer ${
                  tab === 'past'
                    ? 'bg-[#064e3b] text-white shadow-xs'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                Past Events Archive ({past.length})
              </button>
            </div>
          </div>

          {/* List */}
          {displayed.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 text-stone-500 text-sm">
              No {tab} events currently scheduled.
            </div>
          ) : (
            <div className="space-y-6">
              {displayed.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 items-center"
                >
                  {evt.imageUrl && (
                    <div className="h-56 md:h-full w-full bg-stone-100 overflow-hidden">
                      <img
                        src={evt.imageUrl}
                        alt={evt.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className={`p-6 space-y-3 ${evt.imageUrl ? 'md:col-span-2' : 'col-span-3'}`}>
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded">
                        📅 {formatDate(evt.date)}
                      </span>
                      {evt.time && (
                        <span className="text-stone-500">⏰ {evt.time}</span>
                      )}
                      <span className="text-stone-500">📍 {evt.location}</span>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-stone-900 leading-snug">
                      {evt.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {evt.description}
                    </p>

                    {evt.registrationUrl && !evt.isPast && (
                      <div className="pt-2">
                        <Link
                          href={evt.registrationUrl}
                          className="inline-block px-4 py-2 bg-[#064e3b] hover:bg-[#022c22] text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          RSVP / Inquire About Attending ➔
                        </Link>
                      </div>
                    )}
                  </div>
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
