'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cmsService } from '@/lib/cmsService';
import { DonationInfo } from '@/lib/types';

export default function DonationPage() {
  const [donation, setDonation] = useState<DonationInfo | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const d = await cmsService.getDonation();
      setDonation(d);
    }
    load();
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const whatsappNumber = donation?.whatsappConfirmation || '+91 8828290721';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Banner */}
        <section className="bg-[#022c22] text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-2">
            <span className="text-xs font-bold tracking-widest text-amber-300 uppercase">
              Sadaqah Jariyah & Zakat
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold">
              Support Sacred Islamic Education
            </h1>
            <p className="text-amber-200 font-serif text-sm sm:text-base">
              Nurturing 340+ Residential Boarders & Memorizers of the Holy Quran
            </p>
          </div>
        </section>

        {/* Donation Details Section */}
        <section className="py-16 px-4 max-w-6xl mx-auto space-y-12">
          {/* Spiritual Appeal */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-8 space-y-3 text-stone-800">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-950">
              {donation?.appealTitle || 'Invest in Sacred Knowledge'}
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-stone-700">
              {donation?.appealDescription}
            </p>
            <p className="text-xs text-amber-900 font-medium pt-2 border-t border-amber-200/80">
              📌 {donation?.noteForDonors}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Bank Transfer Card */}
            <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  Official Bank Transfer (NEFT / RTGS / IMPS)
                </h3>
                <span className="text-xs bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded font-bold">
                  Verified Trust Account
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center">
                  <div>
                    <span className="text-[11px] text-stone-500 block">Bank Name</span>
                    <strong className="text-stone-900">{donation?.bankName}</strong>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center">
                  <div>
                    <span className="text-[11px] text-stone-500 block">Account Holder Name</span>
                    <strong className="text-stone-900">{donation?.accountHolder}</strong>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center">
                  <div>
                    <span className="text-[11px] text-stone-500 block">Account Number</span>
                    <strong className="text-stone-900 tracking-wider text-base">
                      {donation?.accountNumber}
                    </strong>
                  </div>
                  <button
                    onClick={() => copyToClipboard(donation?.accountNumber || '', 'acc')}
                    className="px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
                  >
                    {copiedField === 'acc' ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center">
                  <div>
                    <span className="text-[11px] text-stone-500 block">IFSC Code</span>
                    <strong className="text-stone-900 tracking-wider text-base">
                      {donation?.ifscCode}
                    </strong>
                  </div>
                  <button
                    onClick={() => copyToClipboard(donation?.ifscCode || '', 'ifsc')}
                    className="px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
                  >
                    {copiedField === 'ifsc' ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center">
                  <div>
                    <span className="text-[11px] text-stone-500 block">Branch Location</span>
                    <strong className="text-stone-900">{donation?.branchName}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* UPI & QR Code Card */}
            <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-xs space-y-6 text-center">
              <div className="space-y-1">
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  Instant UPI & QR Code
                </h3>
                <p className="text-xs text-stone-500">
                  Works with Google Pay, PhonePe, Paytm, BHIM, and all UPI mobile apps
                </p>
              </div>

              {donation?.qrCodeImageUrl && (
                <div className="w-56 h-56 mx-auto bg-stone-50 p-3 rounded-2xl border-2 border-stone-200 flex items-center justify-center">
                  <img
                    src={donation.qrCodeImageUrl}
                    alt="Donation UPI QR Code"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              )}

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between max-w-sm mx-auto">
                <div className="text-left">
                  <span className="text-[10px] text-emerald-800 uppercase font-bold block">
                    Official UPI ID
                  </span>
                  <strong className="text-stone-900 text-sm">{donation?.upiId}</strong>
                </div>
                <button
                  onClick={() => copyToClipboard(donation?.upiId || '', 'upi')}
                  className="px-3 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-semibold hover:bg-emerald-900 cursor-pointer"
                >
                  {copiedField === 'upi' ? 'Copied!' : 'Copy UPI'}
                </button>
              </div>

              <div className="pt-2 text-xs text-stone-600">
                <p className="font-semibold text-stone-800 mb-1">Receipt Confirmation via WhatsApp:</p>
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-700 font-bold hover:underline"
                >
                  <span>💬 Click to Send Screenshot to {whatsappNumber}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Causes / Purposes Bento */}
          {donation?.purposes && donation.purposes.length > 0 && (
            <div className="space-y-6 pt-6">
              <h3 className="text-xl font-serif font-bold text-stone-900 text-center">
                Dedicated Sponsorship Avenues
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {donation.purposes.map((p, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-3"
                  >
                    <div>
                      {p.targetAmount && (
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          {p.targetAmount}
                        </span>
                      )}
                      <h4 className="font-serif font-bold text-stone-900 text-base mt-2">
                        {p.title}
                      </h4>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
