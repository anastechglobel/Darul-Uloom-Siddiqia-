'use client';

import React, { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SectionRenderer from '@/components/SectionRenderer';
import { cmsService } from '@/lib/cmsService';
import { CMSPage } from '@/lib/types';

export default function DynamicCMSPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [page, setPage] = useState<CMSPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPage() {
      if (!slug) return;
      try {
        const p = await cmsService.getPageBySlug(slug);
        setPage(p);
      } catch (e) {
        console.error('Error fetching page:', e);
      } finally {
        setLoading(false);
      }
    }
    loadPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-8 h-8 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!page || page.status !== 'published') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-8 text-center">
          <div className="max-w-md space-y-4">
            <h1 className="text-4xl font-serif font-bold text-stone-900">404</h1>
            <p className="text-stone-600 text-sm">
              The page you are looking for does not exist or has not been published yet.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* If page has sections, render them */}
        {page.sections && page.sections.length > 0 ? (
          page.sections
            .sort((a, b) => a.order - b.order)
            .map((sec) => <SectionRenderer key={sec.id} section={sec} />)
        ) : (
          /* Basic page template if no modular sections defined */
          <div className="py-16 px-4 max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900">
              {page.title}
            </h1>
            {page.contentHtml ? (
              <div
                className="prose prose-stone max-w-none text-stone-700 leading-relaxed text-sm sm:text-base"
                dangerouslySetInnerHTML={{ __html: page.contentHtml }}
              />
            ) : (
              <p className="text-stone-600 whitespace-pre-line text-sm sm:text-base leading-relaxed">
                {page.description}
              </p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
