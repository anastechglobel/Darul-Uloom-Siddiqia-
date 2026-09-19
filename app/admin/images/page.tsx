'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploader from '@/components/ImageUploader';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { cmsService } from '@/lib/cmsService';
import { StoredImage } from '@/lib/types';
import { formatBytes } from '@/lib/utils';

export default function AdminImagesPage() {
  const [images, setImages] = useState<StoredImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StoredImage | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    setLoading(true);
    try {
      const list = await cmsService.getImages();
      setImages(
        list.sort((a, b) => {
          const dateB = new Date(b.uploadedAt || b.createdAt || 0).getTime();
          const dateA = new Date(a.uploadedAt || a.createdAt || 0).getTime();
          return dateB - dateA;
        })
      );
    } finally {
      setLoading(false);
    }
  }

  const handleUploaded = async (url: string) => {
    const newImg: StoredImage = {
      id: `img_${Date.now()}`,
      url,
      imageUrl: url,
      provider: 'imgbb',
      source: 'upload',
      title: 'Uploaded Institutional Image',
      createdAt: new Date().toISOString(),
      uploadedAt: new Date().toISOString(),
    };
    await cmsService.saveImageRecord(newImg);
    await loadImages();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await cmsService.deleteImageRecord(deleteTarget.id);
      setDeleteTarget(null);
      await loadImages();
    } catch (e) {
      alert('Error deleting image: ' + String(e));
    }
  };

  return (
    <AdminLayout
      title="Image Library & ImgBB Integration"
      subtitle="Directly upload, host, and retrieve perpetual image links for banners, staff, and campus"
    >
      <div className="space-y-6">
        {/* Upload Box */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-stone-900 text-base">
            Upload Image to Permanent ImgBB Cloud
          </h3>
          <p className="text-xs text-stone-500">
            Upload JPEG, PNG, or WebP files up to 10MB. Images are instantly deployed onto global CDN servers and can be used anywhere in pages, staff, or banners.
          </p>

          <div className="pt-2">
            <ImageUploader
              label="Drop or Select Any Campus / Academic Image"
              onImageUploaded={handleUploaded}
            />
          </div>
        </div>

        {/* Existing Images Grid */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-stone-900 text-base">
              Image Assets Archive ({images.length})
            </h3>
            <span className="text-xs text-stone-500">
              Click &quot;Copy URL&quot; to insert into any page section or profile
            </span>
          </div>

          {images.length === 0 ? (
            <div className="p-12 text-center text-xs text-stone-500">
              No images uploaded yet. Use the uploader above to add your first asset!
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img) => {
                const imgUrl = img.imageUrl || img.url || '';
                return (
                  <div
                    key={img.id}
                    className="bg-stone-50 rounded-xl overflow-hidden border border-stone-200 shadow-xs flex flex-col justify-between group hover:border-emerald-700 transition-all"
                  >
                    <div className="aspect-video bg-stone-200 relative overflow-hidden">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={img.title || img.filename || 'Institutional Asset'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                          No URL
                        </div>
                      )}
                    </div>

                    <div className="p-3 space-y-2 text-xs">
                      <p className="font-semibold text-stone-800 text-[11px] truncate">
                        {img.title || img.filename || 'Image Asset'}
                      </p>
                      <p className="text-[10px] text-stone-400 font-mono truncate">
                        {imgUrl}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-[11px]">
                        <button
                          onClick={() => copyUrl(imgUrl)}
                          className="text-emerald-800 hover:text-emerald-950 font-bold cursor-pointer"
                        >
                          {copiedUrl === imgUrl ? '✓ Copied!' : 'Copy URL'}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(img)}
                          className="text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Image Record"
        message="Are you sure you want to remove this image from the library?"
        confirmLabel="Remove Image"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
