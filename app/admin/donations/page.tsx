'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploader from '@/components/ImageUploader';
import { cmsService } from '@/lib/cmsService';
import { DonationInfo } from '@/lib/types';

export default function AdminDonationsPage() {
  const [donationInfo, setDonationInfo] = useState<DonationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const d = await cmsService.getDonation();
        setDonationInfo(d);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleFieldChange = (field: keyof DonationInfo, val: any) => {
    if (!donationInfo) return;
    setDonationInfo({
      ...donationInfo,
      [field]: val,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donationInfo) return;
    setSaving(true);
    setSavedSuccess(false);
    try {
      await cmsService.updateDonation(donationInfo);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Error updating donation setup: ' + String(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading || !donationInfo) {
    return (
      <AdminLayout title="Donations & Banking Configuration">
        <div className="p-8 text-center text-xs text-stone-500">Loading banking settings...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Donations & Bank Accounts"
      subtitle="Configure official Madrasa bank credentials, UPI VPA, QR code, and donation causes"
    >
      <form onSubmit={handleSave} className="space-y-6">
        {savedSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <span>✅</span>
            <span>Bank details and donation causes updated successfully!</span>
          </div>
        )}

        {/* Bank Credentials */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6 text-xs">
          <h3 className="font-serif font-bold text-stone-900 text-base border-b border-stone-100 pb-3">
            Official Madrasa Bank Account Credentials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Account Holder Name (Beneficiary) *
              </label>
              <input
                type="text"
                required
                value={donationInfo.accountHolder}
                onChange={(e) => handleFieldChange('accountHolder', e.target.value)}
                placeholder="DARUL ULOOM SIDDIQIA"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 font-semibold"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Bank Name *
              </label>
              <input
                type="text"
                required
                value={donationInfo.bankName}
                onChange={(e) => handleFieldChange('bankName', e.target.value)}
                placeholder="State Bank of India (SBI)"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Bank Account Number *
              </label>
              <input
                type="text"
                required
                value={donationInfo.accountNumber}
                onChange={(e) => handleFieldChange('accountNumber', e.target.value)}
                placeholder="39482910543"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 font-mono text-sm font-bold text-[#064e3b]"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                IFSC Code *
              </label>
              <input
                type="text"
                required
                value={donationInfo.ifscCode}
                onChange={(e) => handleFieldChange('ifscCode', e.target.value)}
                placeholder="SBIN0003214"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 font-mono font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-stone-800 block mb-1">
                Branch Name & District
              </label>
              <input
                type="text"
                value={donationInfo.branchName}
                onChange={(e) => handleFieldChange('branchName', e.target.value)}
                placeholder="Simraha Branch, Araria, Bihar"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>
        </div>

        {/* UPI & Digital QR */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6 text-xs">
          <h3 className="font-serif font-bold text-stone-900 text-base border-b border-stone-100 pb-3">
            UPI & Digital Payment QR
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Official UPI ID (VPA) *
              </label>
              <input
                type="text"
                required
                value={donationInfo.upiId}
                onChange={(e) => handleFieldChange('upiId', e.target.value)}
                placeholder="darululoomsiddiqia@sbi"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 font-mono font-bold text-emerald-800"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                WhatsApp for Screenshot Confirmation
              </label>
              <input
                type="text"
                value={donationInfo.whatsappConfirmation || ''}
                onChange={(e) => handleFieldChange('whatsappConfirmation', e.target.value)}
                placeholder="+91 8828290721"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 font-mono"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100">
            <ImageUploader
              label="UPI / Bank QR Code Image (Hosted on ImgBB)"
              value={donationInfo.qrCodeImageUrl || ''}
              onChange={(url) => handleFieldChange('qrCodeImageUrl', url)}
            />
          </div>
        </div>

        {/* Appeals Overview */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-serif font-bold text-stone-900 text-base border-b border-stone-100 pb-3">
            Appeal Text & Guidelines for Donors
          </h3>

          <div>
            <label className="font-semibold text-stone-800 block mb-1">
              Main Appeal Title
            </label>
            <input
              type="text"
              value={donationInfo.appealTitle}
              onChange={(e) => handleFieldChange('appealTitle', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 font-semibold"
            />
          </div>

          <div>
            <label className="font-semibold text-stone-800 block mb-1">
              Institutional Appeal & Trust Notice
            </label>
            <textarea
              rows={3}
              value={donationInfo.appealDescription}
              onChange={(e) => handleFieldChange('appealDescription', e.target.value)}
              placeholder="Your Zakat, Sadaqah, and Atiyyat sustain noble Talib-e-Ilm..."
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label className="font-semibold text-stone-800 block mb-1">
              Note for Donors (Receipt & Transfer Instructions)
            </label>
            <textarea
              rows={2}
              value={donationInfo.noteForDonors}
              onChange={(e) => handleFieldChange('noteForDonors', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label className="font-semibold text-stone-800 block mb-1">
              Tax Exemption / Trust Status Info
            </label>
            <input
              type="text"
              value={donationInfo.taxExemptionInfo || ''}
              onChange={(e) => handleFieldChange('taxExemptionInfo', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#064e3b] hover:bg-[#022c22] text-white font-medium rounded-lg shadow-xs transition-colors text-xs cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Bank & Donation Setup ➔'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
