'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImageUploader from '@/components/ImageUploader';
import { cmsService } from '@/lib/cmsService';
import { GalleryItem } from '@/lib/types';

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Campus');
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState(1);
  const [published, setPublished] = useState(true);

  useEffect(() => {
    loadGallery();
  }, []);

  async function loadGallery() {
    setLoading(true);
    try {
      const list = await cmsService.getGallery();
      setGallery(list.sort((a, b) => a.order - b.order));
    } finally {
      setLoading(false);
    }
  }

  const handleStartCreate = () => {
    setEditingItem(null);
    setTitle('');
    setCategory('Campus');
    setImageUrl('');
    setAltText('');
    setDescription('');
    setOrder(gallery.length + 1);
    setPublished(true);
    setIsCreating(true);
  };

  const handleStartEdit = (item: GalleryItem) => {
    setIsCreating(false);
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setImageUrl(item.imageUrl);
    setAltText(item.altText || '');
    setDescription(item.description || '');
    setOrder(item.order);
    setPublished(item.published);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      alert('Please upload or enter an image URL.');
      return;
    }
    setSaving(true);
    try {
      const itemData: GalleryItem = {
        id: isCreating ? `gal_${Date.now()}` : editingItem!.id,
        title,
        category,
        imageUrl,
        altText: altText || title,
        description,
        order: Number(order) || 1,
        published,
      };

      await cmsService.saveGalleryItem(itemData);
      setIsCreating(false);
      setEditingItem(null);
      await loadGallery();
    } catch (err) {
      alert('Error saving gallery item: ' + String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await cmsService.deleteGalleryItem(deleteTarget.id);
      setDeleteTarget(null);
      await loadGallery();
    } catch (err) {
      alert('Failed deleting gallery item: ' + String(err));
    }
  };

  return (
    <AdminLayout
      title="Photo Gallery Management"
      subtitle="Upload institutional photographs via ImgBB and categorize into visual albums"
      actions={
        <button
          onClick={handleStartCreate}
          className="px-3.5 py-2 bg-[#064e3b] hover:bg-[#022c22] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>+ Add Photo</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Editor Form */}
        {(isCreating || editingItem) && (
          <div className="bg-white rounded-2xl p-6 border-2 border-emerald-800/40 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-serif font-bold text-stone-900 text-base">
                {isCreating ? 'Upload New Gallery Photo' : `Edit: ${editingItem?.title}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingItem(null);
                }}
                className="text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    Photo Title / Caption *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Annual Dastarbandi Ceremony"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white"
                  >
                    <option value="Students">Students & Halqas</option>
                    <option value="Dastarbandi">Dastarbandi & Convocation</option>
                    <option value="Masjid">Masjid & Worship</option>
                    <option value="Classes">Classes & Lectures</option>
                    <option value="Campus">Campus & Infrastructure</option>
                    <option value="Events">Special Events & Gatherings</option>
                  </select>
                </div>
              </div>

              <div>
                <ImageUploader
                  label="Upload or Link Photo (ImgBB)"
                  currentImageUrl={imageUrl}
                  onImageUploaded={(url) => setImageUrl(url)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    Accessibility Alt Text
                  </label>
                  <input
                    type="text"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Brief description for screen readers..."
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">
                  Description / Story Behind Photo
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Context, year, dignitaries present..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="galPub"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 text-emerald-800 rounded focus:ring-emerald-700"
                />
                <label htmlFor="galPub" className="text-xs font-medium text-stone-700">
                  Visible in Public Photo Gallery
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-medium hover:bg-stone-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#064e3b] hover:bg-[#022c22] text-white rounded-lg font-medium cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Gallery Photo ➔'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl overflow-hidden border border-stone-200 shadow-xs flex flex-col justify-between group hover:border-emerald-700 transition-all"
            >
              <div className="aspect-4/3 bg-stone-100 relative overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <span className="absolute top-2 left-2 bg-stone-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                  {item.category}
                </span>
              </div>

              <div className="p-3 space-y-1">
                <h4 className="font-serif font-bold text-stone-900 text-xs truncate">
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-[10px] text-stone-500 truncate">{item.description}</p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px]">
                  <button
                    onClick={() => handleStartEdit(item)}
                    className="text-emerald-800 hover:underline font-semibold cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="text-rose-600 hover:underline font-semibold cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Photo"
        message={`Are you sure you want to remove "${deleteTarget?.title}" from the gallery?`}
        confirmLabel="Delete Photo"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
