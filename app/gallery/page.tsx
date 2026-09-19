'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GalleryLightbox from '@/components/GalleryLightbox';
import { cmsService } from '@/lib/cmsService';
import { GalleryItem } from '@/lib/types';

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const list = await cmsService.getGallery();
        setItems(list.filter((g) => g.published).sort((a, b) => a.order - b.order));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = ['All', 'Students', 'Dastarbandi', 'Masjid', 'Classes', 'Campus', 'Events'];

  const filtered =
    selectedCategory === 'All'
      ? items
      : items.filter((item) => item.category.toLowerCase() === selectedCategory.toLowerCase());

  const currentIndex = activeItem ? filtered.findIndex((i) => i.id === activeItem.id) : -1;

  const handleNext = () => {
    if (currentIndex >= 0 && currentIndex < filtered.length - 1) {
      setActiveItem(filtered[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setActiveItem(filtered[currentIndex - 1]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Banner */}
        <section className="bg-[#022c22] text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-2">
            <span className="text-xs font-bold tracking-widest text-amber-300 uppercase">
              Visual Archives
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold">
              Institutional Photo Gallery
            </h1>
            <p className="text-amber-200 font-serif text-sm sm:text-base">
              Moments of Learning, Quranic Recitation, and Campus Assemblies
            </p>
          </div>
        </section>

        {/* Gallery Content */}
        <section className="py-14 px-4 max-w-7xl mx-auto space-y-8">
          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#064e3b] text-white shadow-xs'
                    : 'bg-stone-200/80 text-stone-700 hover:bg-stone-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-stone-500 text-sm">
              No gallery items in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  className="group relative rounded-xl overflow-hidden bg-stone-100 border border-stone-200 aspect-4/3 cursor-pointer shadow-xs hover:shadow-lg transition-all"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.altText || item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                    <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="font-serif font-bold text-sm leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <GalleryLightbox
        item={activeItem}
        onClose={() => setActiveItem(null)}
        onNext={currentIndex < filtered.length - 1 ? handleNext : undefined}
        onPrev={currentIndex > 0 ? handlePrev : undefined}
      />

      <Footer />
    </div>
  );
}
