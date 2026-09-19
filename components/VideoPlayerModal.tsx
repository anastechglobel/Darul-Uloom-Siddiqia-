'use client';

import React from 'react';
import { VideoItem } from '@/lib/types';
import { extractYouTubeId } from '@/lib/utils';

interface VideoModalProps {
  video: VideoItem | null;
  onClose: () => void;
}

export default function VideoPlayerModal({ video, onClose }: VideoModalProps) {
  if (!video) return null;

  const ytid = video.youtubeVideoId || extractYouTubeId(video.youtubeUrl);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-stone-950 rounded-2xl overflow-hidden shadow-2xl border border-stone-800">
        <div className="flex items-center justify-between p-4 border-b border-stone-800 bg-stone-900">
          <div>
            <h3 className="text-white font-serif font-bold text-sm sm:text-base truncate max-w-xl">
              {video.title}
            </h3>
            <span className="text-xs text-amber-400">{video.category}</span>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 text-xl focus:outline-none"
            aria-label="Close video player"
          >
            ✕
          </button>
        </div>

        <div className="aspect-video w-full bg-black">
          {ytid ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${ytid}?autoplay=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-400 text-sm">
              Invalid or unavailable YouTube link.
            </div>
          )}
        </div>

        {video.description && (
          <div className="p-4 bg-stone-900 text-stone-300 text-xs sm:text-sm">
            {video.description}
          </div>
        )}
      </div>
    </div>
  );
}
