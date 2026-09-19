'use client';

import React from 'react';
import Link from 'next/link';
import { PageSection } from '@/lib/types';
import { extractYouTubeId } from '@/lib/utils';

export default function SectionRenderer({
  section,
  programs = [],
  staff = [],
  facilities = [],
  gallery = [],
  notices = [],
  events = [],
}: {
  section: PageSection;
  programs?: any[];
  staff?: any[];
  facilities?: any[];
  gallery?: any[];
  notices?: any[];
  events?: any[];
}) {
  if (!section.published) return null;

  // Background style helper
  const bgClasses = {
    default: 'bg-white text-stone-900',
    emerald: 'bg-[#022c22] text-white',
    ivory: 'bg-[#faf8f5] text-stone-900 border-y border-stone-200',
    charcoal: 'bg-[#1c1f24] text-stone-100',
    gold: 'bg-amber-700 text-white',
  }[section.backgroundColor || 'default'];

  switch (section.type) {
    // 1. HERO SECTION
    case 'hero':
      return (
        <section className={`relative overflow-hidden py-20 lg:py-28 ${bgClasses}`}>
          {section.imageUrl && (
            <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay">
              <img
                src={section.imageUrl}
                alt={section.imageAlt || section.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
            {section.subtitle && (
              <div className="inline-block px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {section.subtitle}
              </div>
            )}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight leading-tight">
              {section.title}
            </h1>
            {section.description && (
              <p className="max-w-3xl mx-auto text-base sm:text-lg text-stone-200/90 leading-relaxed font-normal">
                {section.description}
              </p>
            )}
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              {section.ctaText && section.ctaUrl && (
                <Link
                  href={section.ctaUrl}
                  className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium rounded-lg shadow-sm transition-all text-sm"
                >
                  {section.ctaText}
                </Link>
              )}
              {section.secondaryCtaText && section.secondaryCtaUrl && (
                <Link
                  href={section.secondaryCtaUrl}
                  className="px-6 py-3 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 font-medium rounded-lg transition-all text-sm"
                >
                  {section.secondaryCtaText}
                </Link>
              )}
            </div>
          </div>
        </section>
      );

    // 2. STATISTICS
    case 'statistics':
      return (
        <section className={`py-14 sm:py-18 ${bgClasses}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {(section.title || section.subtitle) && (
              <div className="text-center max-w-2xl mx-auto mb-10">
                {section.subtitle && (
                  <span className="text-xs font-semibold text-amber-700 tracking-wider uppercase">
                    {section.subtitle}
                  </span>
                )}
                {section.title && (
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-stone-900 mt-1">
                    {section.title}
                  </h2>
                )}
                {section.description && (
                  <p className="text-sm text-stone-600 mt-2">{section.description}</p>
                )}
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {section.items?.map((item) => (
                <div
                  key={item.id}
                  className="p-6 bg-white border border-stone-200 rounded-xl text-center shadow-xs hover:border-amber-600/50 transition-all"
                >
                  <div className="text-3xl sm:text-4xl font-serif font-extrabold text-[#064e3b]">
                    {item.title}
                  </div>
                  <div className="text-sm font-semibold text-stone-800 mt-1.5">
                    {item.subtitle}
                  </div>
                  {item.description && (
                    <div className="text-xs text-stone-500 mt-1">
                      {item.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    // 3. RICH TEXT
    case 'rich_text':
      return (
        <section className={`py-14 ${bgClasses}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            {(section.title || section.subtitle) && (
              <div className="mb-8">
                {section.subtitle && (
                  <span className="text-xs font-semibold text-amber-700 tracking-wider uppercase">
                    {section.subtitle}
                  </span>
                )}
                {section.title && (
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
                    {section.title}
                  </h2>
                )}
              </div>
            )}
            {section.contentHtml ? (
              <div
                className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: section.contentHtml }}
              />
            ) : (
              <p className="text-stone-700 leading-relaxed whitespace-pre-line">
                {section.description}
              </p>
            )}
          </div>
        </section>
      );

    // 4. IMAGE + TEXT
    case 'image_text':
      const isRight = section.imagePosition === 'right';
      return (
        <section className={`py-16 ${bgClasses}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                isRight ? 'lg:grid-flow-col-dense' : ''
              }`}
            >
              <div className={isRight ? 'lg:col-start-1' : ''}>
                {section.subtitle && (
                  <span className="text-xs font-semibold text-amber-700 tracking-wider uppercase">
                    {section.subtitle}
                  </span>
                )}
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1 mb-4">
                  {section.title}
                </h2>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed mb-6 whitespace-pre-line">
                  {section.description}
                </p>
                {section.ctaText && section.ctaUrl && (
                  <Link
                    href={section.ctaUrl}
                    className="inline-block px-5 py-2.5 bg-[#064e3b] hover:bg-[#022c22] text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    {section.ctaText}
                  </Link>
                )}
              </div>
              {section.imageUrl && (
                <div className="rounded-2xl overflow-hidden shadow-md border border-stone-200">
                  <img
                    src={section.imageUrl}
                    alt={section.imageAlt || section.title}
                    className="w-full h-80 sm:h-96 object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      );

    // 5. FEATURES / PILLARS
    case 'features':
      return (
        <section className={`py-16 ${bgClasses}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {(section.title || section.subtitle) && (
              <div className="text-center max-w-2xl mx-auto mb-12">
                {section.subtitle && (
                  <span className="text-xs font-semibold text-amber-700 tracking-wider uppercase">
                    {section.subtitle}
                  </span>
                )}
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
                  {section.title}
                </h2>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {section.items?.map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-xl bg-white border border-stone-200 hover:shadow-md transition-all space-y-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#064e3b] font-bold flex items-center justify-center text-lg">
                    ✦
                  </div>
                  <h3 className="font-serif font-bold text-stone-900 text-base">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    // 6. QUOTE / LEADERSHIP
    case 'quote':
      return (
        <section className={`py-16 ${bgClasses}`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-8 sm:p-12 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {section.imageUrl && (
                <div className="md:col-span-1 text-center">
                  <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-amber-600/40 shadow-sm">
                    <img
                      src={section.imageUrl}
                      alt={section.imageAlt || section.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-serif font-bold text-stone-900 mt-3 text-sm">
                    {section.subtitle || 'Maulana Abdus Subhan'}
                  </h3>
                  <p className="text-xs text-amber-800 font-medium">Nazim / Rector</p>
                </div>
              )}
              <div className={section.imageUrl ? 'md:col-span-2' : 'col-span-3'}>
                <span className="text-4xl text-amber-600 font-serif leading-none block mb-2">
                  “
                </span>
                <blockquote className="text-base sm:text-lg text-stone-800 font-serif italic leading-relaxed mb-4">
                  {section.description}
                </blockquote>
                {section.ctaText && section.ctaUrl && (
                  <Link
                    href={section.ctaUrl}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#064e3b] hover:text-emerald-800"
                  >
                    <span>{section.ctaText}</span> ➔
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      );

    // 7. CALL TO ACTION (CTA)
    case 'cta':
      return (
        <section className={`py-14 sm:py-20 ${bgClasses}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            {section.subtitle && (
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
                {section.subtitle}
              </span>
            )}
            <h2 className="text-2xl sm:text-4xl font-serif font-extrabold tracking-tight">
              {section.title}
            </h2>
            {section.description && (
              <p className="text-sm sm:text-base text-stone-200 max-w-2xl mx-auto leading-relaxed">
                {section.description}
              </p>
            )}
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              {section.ctaText && section.ctaUrl && (
                <Link
                  href={section.ctaUrl}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shadow-sm text-sm"
                >
                  {section.ctaText}
                </Link>
              )}
              {section.secondaryCtaText && section.secondaryCtaUrl && (
                <a
                  href={section.secondaryCtaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-emerald-900 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 font-medium rounded-lg text-sm"
                >
                  {section.secondaryCtaText}
                </a>
              )}
            </div>
          </div>
        </section>
      );

    // 8. VIDEO
    case 'video':
      const ytid = section.videoUrl ? extractYouTubeId(section.videoUrl) : null;
      return (
        <section className={`py-16 ${bgClasses}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            {section.title && (
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-2">
                {section.title}
              </h2>
            )}
            {section.description && (
              <p className="text-sm text-stone-600 mb-6">{section.description}</p>
            )}
            {ytid ? (
              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-stone-200">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${ytid}`}
                  title={section.title || 'Institutional Video'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              <div className="p-8 bg-stone-100 rounded-xl text-stone-500 text-sm">
                No video URL configured.
              </div>
            )}
          </div>
        </section>
      );

    // DEFAULT FALLBACK FOR CUSTOM SECTIONS
    default:
      return (
        <section className={`py-12 ${bgClasses}`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            {section.title && (
              <h2 className="text-2xl font-serif font-bold mb-3">{section.title}</h2>
            )}
            {section.description && (
              <p className="text-sm leading-relaxed mb-4">{section.description}</p>
            )}
            {section.contentHtml && (
              <div
                className="prose max-w-none text-sm"
                dangerouslySetInnerHTML={{ __html: section.contentHtml }}
              />
            )}
          </div>
        </section>
      );
  }
}
