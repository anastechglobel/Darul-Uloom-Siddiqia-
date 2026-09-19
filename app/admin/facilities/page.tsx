'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImageUploader from '@/components/ImageUploader';
import { cmsService } from '@/lib/cmsService';
import { Facility } from '@/lib/types';

export default function AdminFacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingFac, setEditingFac] = useState<Facility | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Facility | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Prayer & Worship');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('500 Worshipers');
  const [featuresRaw, setFeaturesRaw] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [order, setOrder] = useState(1);
  const [published, setPublished] = useState(true);

  useEffect(() => {
    loadFacilities();
  }, []);

  async function loadFacilities() {
    setLoading(true);
    try {
      const list = await cmsService.getFacilities();
      setFacilities(list.sort((a, b) => a.order - b.order));
    } finally {
      setLoading(false);
    }
  }

  const handleStartCreate = () => {
    setEditingFac(null);
    setTitle('');
    setCategory('Academic Building');
    setDescription('');
    setCapacity('');
    setFeaturesRaw('Spacious hall\nNatural ventilation\nDedicated sound setup');
    setImageUrl('');
    setOrder(facilities.length + 1);
    setPublished(true);
    setIsCreating(true);
  };

  const handleStartEdit = (f: Facility) => {
    setIsCreating(false);
    setEditingFac(f);
    setTitle(f.title);
    setCategory(f.category);
    setDescription(f.description);
    setCapacity(f.capacity || '');
    setFeaturesRaw((f.features || []).join('\n'));
    setImageUrl(f.imageUrl || '');
    setOrder(f.order);
    setPublished(f.published);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const features = featuresRaw
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const facilityData: Facility = {
        id: isCreating ? `fac_${Date.now()}` : editingFac!.id,
        title,
        category,
        description,
        capacity,
        features,
        imageUrl,
        order: Number(order) || 1,
        published,
      };

      await cmsService.saveFacility(facilityData);
      setIsCreating(false);
      setEditingFac(null);
      await loadFacilities();
    } catch (err) {
      alert('Error saving facility: ' + String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await cmsService.deleteFacility(deleteTarget.id);
      setDeleteTarget(null);
      await loadFacilities();
    } catch (err) {
      alert('Failed deleting facility: ' + String(err));
    }
  };

  return (
    <AdminLayout
      title="Campus & Facilities"
      subtitle="Manage mosque, classrooms, hostel, library, and dining facilities"
      actions={
        <button
          onClick={handleStartCreate}
          className="px-3.5 py-2 bg-[#064e3b] hover:bg-[#022c22] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>+ Add Facility</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Editor Form */}
        {(isCreating || editingFac) && (
          <div className="bg-white rounded-2xl p-6 border-2 border-emerald-800/40 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-serif font-bold text-stone-900 text-base">
                {isCreating ? 'Add Campus Facility' : `Edit: ${editingFac?.title}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingFac(null);
                }}
                className="text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    Facility Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Dar-ul-Iqama (Boarding Hostel)"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white"
                  >
                    <option value="Prayer & Worship">Prayer & Worship (Masjid)</option>
                    <option value="Academic">Academic Classrooms</option>
                    <option value="Residential">Residential Hostel (Dar-ul-Iqama)</option>
                    <option value="Research & Library">Library (Kutub Khana)</option>
                    <option value="Dining & Kitchen">Kitchen & Dining (Matbakh)</option>
                    <option value="Medical & Health">Health & Sanitation</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    Capacity / Size
                  </label>
                  <input
                    type="text"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="e.g. 350 Boarders / 5,000 Volumes"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">
                  Facility Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Architectural notes, usage details..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">
                  Amenities & Features (One per line)
                </label>
                <textarea
                  rows={3}
                  value={featuresRaw}
                  onChange={(e) => setFeaturesRaw(e.target.value)}
                  placeholder="24/7 Water & Solar backup&#10;Hygienic living quarters&#10;Supervised by Nazir"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono"
                />
              </div>

              <div className="pt-2 border-t border-stone-100">
                <ImageUploader
                  label="Facility Photo (ImgBB Hosted)"
                  currentImageUrl={imageUrl}
                  onImageUploaded={(url) => setImageUrl(url)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Display Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="facPub"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4 text-emerald-800 rounded focus:ring-emerald-700"
                  />
                  <label htmlFor="facPub" className="text-xs font-medium text-stone-700">
                    Published on Campus Page
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingFac(null);
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
                  {saving ? 'Saving...' : 'Save Facility ➔'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Facilities List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {facilities.map((f) => (
            <div
              key={f.id}
              className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-3 hover:border-emerald-700 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {f.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      f.published
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {f.published ? 'Live' : 'Draft'}
                  </span>
                </div>

                <h4 className="text-base font-serif font-bold text-stone-900 leading-snug">
                  {f.title}
                </h4>
                {f.capacity && (
                  <p className="text-[11px] text-stone-500">Capacity: {f.capacity}</p>
                )}
                <p className="text-xs text-stone-600 line-clamp-2">{f.description}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
                <span className="text-[11px] text-stone-400">Order: {f.order}</span>
                <div className="space-x-3">
                  <button
                    onClick={() => handleStartEdit(f)}
                    className="text-emerald-800 hover:underline font-semibold cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(f)}
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
        title="Delete Facility"
        message={`Are you sure you want to remove "${deleteTarget?.title}" from campus facilities?`}
        confirmLabel="Delete Facility"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
