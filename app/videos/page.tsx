'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VideoPlayerModal from '@/components/VideoPlayerModal';
import { cmsService } from '@/lib/cmsService';
import { VideoItem } from '@/lib/types';
import { extractYouTubeId } from '@/lib/utils';

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const list = await cmsService.getVideos();
        setVideos(list.filter((v) => v.published).sort((a, b) => a.order - b.order));
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
              Audio-Visual Media
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold">
              Lectures & Videos
            </h1>
            <p className="text-amber-200 font-serif text-sm sm:text-base">
              Conferences, Quranic Recitations, and Institutional Discourses
            </p>
          </div>
        </section>

        {/* Video Grid */}
        <section className="py-16 px-4 max-w-7xl mx-auto space-y-8">
          {videos.length === 0 ? (
            <div className="text-center py-16 text-stone-500 text-sm">
              No videos currently published.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((vid) => {
                const ytid = vid.youtubeVideoId || extractYouTubeId(vid.youtubeUrl);
                const thumb =
                  vid.thumbnailUrl ||
                  (ytid ? `https://img.youtube.com/vi/${ytid}/hqdefault.jpg` : '');

                return (
                  <div
                    key={vid.id}
                    onClick={() => setActiveVideo(vid)}
                    className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col group"
                  >
                    <div className="aspect-video bg-stone-900 relative overflow-hidden">
                      {thumb && (
                        <img
                          src={thumb}
                          alt={vid.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform">
                          ▶
                        </div>
                      </div>
                      <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded">
                        {vid.category}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                      <h3 className="font-serif font-bold text-stone-900 text-base leading-snug group-hover:text-emerald-800 transition-colors line-clamp-2">
                        {vid.title}
                      </h3>
                      {vid.description && (
                        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                          {vid.description}
                        </p>
                      )}
                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                        <span>YouTube Stream</span>
                        <span className="text-emerald-800 font-semibold group-hover:underline">
                          Watch Video ➔
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <VideoPlayerModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      <Footer />
    </div>
  );
}
