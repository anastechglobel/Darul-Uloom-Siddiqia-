'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploader from '@/components/ImageUploader';
import { cmsService } from '@/lib/cmsService';
import { MadrasaInfo } from '@/lib/types';

export default function AdminMadrasaPage() {
  const [madrasa, setMadrasa] = useState<MadrasaInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const m = await cmsService.getMadrasaInfo();
        setMadrasa(m);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (field: keyof MadrasaInfo, val: any) => {
    if (!madrasa) return;
    setMadrasa({ ...madrasa, [field]: val });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!madrasa) return;
    setSaving(true);
    setSavedSuccess(false);
    try {
      await cmsService.updateMadrasaInfo(madrasa);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Error saving institutional info: ' + String(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading || !madrasa) {
    return (
      <AdminLayout title="Madrasa Information">
        <div className="p-8 text-center text-xs text-stone-500">Loading information...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Madrasa Information"
      subtitle="Configure core identity, multilingual titles, registration numbers, and campus location"
    >
      <form onSubmit={handleSave} className="space-y-6">
        {savedSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <span>✅</span>
            <span>Madrasa information updated and synced to database!</span>
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
          <h3 className="font-serif font-bold text-stone-900 text-base border-b border-stone-100 pb-3">
            Institutional Names & Multilingual Branding
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Official English Name *
              </label>
              <input
                type="text"
                required
                value={madrasa.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Arabic Name (العربية)
              </label>
              <input
                type="text"
                dir="rtl"
                value={madrasa.arabicName || ''}
                onChange={(e) => handleChange('arabicName', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none font-arabic"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Urdu Name (اردو)
              </label>
              <input
                type="text"
                dir="rtl"
                value={madrasa.urduName || ''}
                onChange={(e) => handleChange('urduName', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none font-arabic"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Hindi Name (हिंदी)
              </label>
              <input
                type="text"
                value={madrasa.hindiName || ''}
                onChange={(e) => handleChange('hindiName', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
            <div className="sm:col-span-2">
              <label className="font-semibold text-stone-800 block mb-1">
                Institutional Tagline / Motto
              </label>
              <input
                type="text"
                value={madrasa.tagline || ''}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Established Year
              </label>
              <input
                type="number"
                value={madrasa.establishedYear}
                onChange={(e) => handleChange('establishedYear', Number(e.target.value))}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="font-semibold text-stone-800 block mb-1">
              Official Registration / Trust Number
            </label>
            <input
              type="text"
              value={madrasa.registrationNumber || ''}
              onChange={(e) => handleChange('registrationNumber', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Location & Contacts */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-serif font-bold text-stone-900 text-base border-b border-stone-100 pb-3">
            Location, Geographic Coordinates & Direct Contacts
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Village / Street Address *
              </label>
              <input
                type="text"
                required
                value={madrasa.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">District *</label>
              <input
                type="text"
                required
                value={madrasa.district}
                onChange={(e) => handleChange('district', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">State *</label>
              <input
                type="text"
                required
                value={madrasa.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">Country *</label>
              <input
                type="text"
                required
                value={madrasa.country}
                onChange={(e) => handleChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">PIN / Postal Code *</label>
              <input
                type="text"
                required
                value={madrasa.pincode}
                onChange={(e) => handleChange('pincode', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Official Phone / WhatsApp Number *
              </label>
              <input
                type="text"
                required
                value={madrasa.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-stone-800 block mb-1">
                Official Email Address
              </label>
              <input
                type="email"
                value={madrasa.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Narrative & Visual Assets */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6 text-xs">
          <h3 className="font-serif font-bold text-stone-900 text-base border-b border-stone-100 pb-3">
            Mission, Vision & Visual Media
          </h3>

          <div>
            <label className="font-semibold text-stone-800 block mb-1">Description / Summary</label>
            <textarea
              rows={3}
              value={madrasa.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-stone-800 block mb-1">Sacred Mission Statement</label>
              <textarea
                rows={3}
                value={madrasa.mission || ''}
                onChange={(e) => handleChange('mission', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-800 block mb-1">Institutional Vision</label>
              <textarea
                rows={3}
                value={madrasa.vision || ''}
                onChange={(e) => handleChange('vision', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <ImageUploader
              label="Institutional Campus Banner Image"
              currentImageUrl={madrasa.bannerUrl || ''}
              onImageUploaded={(url) => handleChange('bannerUrl', url)}
            />
            <ImageUploader
              label="Official Logo Image"
              currentImageUrl={madrasa.logoUrl || ''}
              onImageUploaded={(url) => handleChange('logoUrl', url)}
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#064e3b] hover:bg-[#022c22] text-white font-medium rounded-lg shadow-sm transition-colors text-xs cursor-pointer"
          >
            {saving ? 'Saving Information...' : 'Save Madrasa Information ➔'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
