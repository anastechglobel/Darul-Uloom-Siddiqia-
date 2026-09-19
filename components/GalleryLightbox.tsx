'use client';

import React from 'react';
import { GalleryItem } from '@/lib/types';

interface LightboxProps {
  item: GalleryItem | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function GalleryLightbox({ item, onClose, onNext, onPrev }: LightboxProps) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white/80 hover:text-white p-2 text-2xl z-50 focus:outline-none"
        aria-label="Close Lightbox"
      >
        ✕
      </button>

      {onPrev && (
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 text-3xl z-50 bg-stone-900/50 rounded-full"
          aria-label="Previous Image"
        >
          ‹
        </button>
      )}

      {onNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 text-3xl z-50 bg-stone-900/50 rounded-full"
          aria-label="Next Image"
        >
          ›
        </button>
      )}

      <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
        <img
          src={item.imageUrl}
          alt={item.altText || item.title}
          className="max-h-[72vh] max-w-full object-contain rounded-lg shadow-2xl"
        />
        <div className="mt-4 text-center text-white space-y-1">
          <h3 className="text-base sm:text-lg font-serif font-bold">{item.title}</h3>
          {item.description && (
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl">{item.description}</p>
          )}
          <span className="inline-block text-[11px] text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-full mt-1 border border-amber-800/40">
            {item.category}
          </span>
        </div>
      </div>
    </div>
  );
}
