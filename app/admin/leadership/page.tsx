'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploader from '@/components/ImageUploader';
import { cmsService } from '@/lib/cmsService';
import { Leadership } from '@/lib/types';

export default function AdminLeadershipPage() {
  const [leadership, setLeadership] = useState<Leadership | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const l = await cmsService.getLeadership();
        setLeadership(l);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (field: keyof Leadership, val: any) => {
    if (!leadership) return;
    setLeadership({ ...leadership, [field]: val });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadership) return;
    setSaving(true);
    setSavedSuccess(false);
    try {
      await cmsService.updateLeadership(leadership);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Error saving leadership: ' + String(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading || !leadership) {
    return (
      <AdminLayout title="Nazim & Leadership">
        <div className="p-8 text-center text-xs text-stone-500">Loading leadership details...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Nazim / Leadership Management"
      subtitle="Edit rector details, biography, pastoral message, and direct contact numbers"
    >
      <form onSubmit={handleSave} className="space-y-6">
        {savedSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <span>✅</span>
            <span>Nazim details updated and saved successfully!</span>
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
          <h3 className="font-serif font-bold text-stone-900 text-base border-b border-stone-100 pb-3">
            Rector Identification & Office
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Rector / Nazim Full Name *
              </label>
              <input
                type="text"
                required
                value={leadership.nazimName}
                onChange={(e) => handleChange('nazimName', e.target.value)}
                placeholder="Maulana Abdus Subhan"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Official Designation *
              </label>
              <input
                type="text"
                required
                value={leadership.designation}
                onChange={(e) => handleChange('designation', e.target.value)}
                placeholder="Nazim"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Direct Contact Phone / WhatsApp *
              </label>
              <input
                type="text"
                required
                value={leadership.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+91 8828290721"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Official Office Hours
              </label>
              <input
                type="text"
                value={leadership.officeHours || ''}
                onChange={(e) => handleChange('officeHours', e.target.value)}
                placeholder="9:00 AM – 1:00 PM & 3:00 PM – 5:00 PM"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Personal / Rectorate Email
              </label>
              <input
                type="email"
                value={leadership.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="rector@darululoomsiddiqia.edu"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100">
            <ImageUploader
              label="Nazim Official Photograph"
              currentImageUrl={leadership.imageUrl || ''}
              onImageUploaded={(url) => handleChange('imageUrl', url)}
            />
          </div>
        </div>

        {/* Narrative, Message & Bio */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6 text-xs">
          <h3 className="font-serif font-bold text-stone-900 text-base border-b border-stone-100 pb-3">
            Rector’s Pastoral Message & Biography
          </h3>

          <div>
            <label className="font-semibold text-stone-800 block mb-1">
              Rector’s Official Message (Displayed on Home & Nazim Pages)
            </label>
            <textarea
              rows={4}
              value={leadership.message}
              onChange={(e) => handleChange('message', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-stone-800 block mb-1">
              Comprehensive Biography & Institutional Legacy
            </label>
            <textarea
              rows={5}
              value={leadership.biography}
              onChange={(e) => handleChange('biography', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#064e3b] hover:bg-[#022c22] text-white font-medium rounded-lg shadow-sm transition-colors text-xs cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Nazim / Leadership Profile ➔'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
