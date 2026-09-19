'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cmsService } from '@/lib/cmsService';
import { AdmissionInfo, MadrasaInfo } from '@/lib/types';

export default function AdmissionPage() {
  const [admission, setAdmission] = useState<AdmissionInfo | null>(null);
  const [madrasa, setMadrasa] = useState<MadrasaInfo | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [phone, setPhone] = useState('');
  const [program, setProgram] = useState('Hifz-ul-Quran');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function load() {
      const [a, m] = await Promise.all([
        cmsService.getAdmission(),
        cmsService.getMadrasaInfo(),
      ]);
      setAdmission(a);
      setMadrasa(m);
    }
    load();
  }, []);

  const contactPhone = admission?.contactPhone || madrasa?.phone || '+91 8828290721';

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Build WhatsApp message text
    const text = encodeURIComponent(
      `*Admission Inquiry - Darul Uloom Siddiqia*\n\nApplicant: ${applicantName}\nGuardian: ${guardianName}\nPhone: ${phone}\nDesired Program: ${program}\nMessage: ${message || 'None'}`
    );
    window.open(`https://wa.me/${contactPhone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
    setFormSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Banner */}
        <section className="bg-[#022c22] text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-2">
            <span className="text-xs font-bold tracking-widest text-amber-300 uppercase">
              Enrollment Portal
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold">
              Admission Guidelines & Application
            </h1>
            <p className="text-amber-200 font-serif text-sm sm:text-base">
              Academic Session {admission?.academicYear || '2026–2027'} • 100% Free Education & Boarding
            </p>
          </div>
        </section>

        {/* Content & Steps */}
        <section className="py-16 px-4 max-w-6xl mx-auto space-y-12">
          {/* Status Alert */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-600 animate-ping"></span>
              <div>
                <h3 className="font-serif font-bold text-emerald-950 text-base">
                  Admissions Status: {admission?.isOpen ? 'Currently Open' : 'Closed for Session'}
                </h3>
                <p className="text-xs text-emerald-800">
                  Applications are accepted from {admission?.startDate || '1st Shawwal'} to {admission?.endDate || '30th Dhu al-Qadah'}.
                </p>
              </div>
            </div>
            <a
              href={`tel:${contactPhone}`}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-medium rounded-lg transition-colors shrink-0"
            >
              📞 Call Admissions: {contactPhone}
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Requirements & Process */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-serif font-bold text-stone-900 mb-3">
                  Eligibility & Criteria
                </h2>
                <ul className="space-y-2 text-xs sm:text-sm text-stone-600">
                  {admission?.eligibilityRequirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-white p-3 rounded-xl border border-stone-200">
                      <span className="text-emerald-700 font-bold">✓</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-serif font-bold text-stone-900 mb-3">
                  Required Documentation
                </h2>
                <ul className="space-y-2 text-xs sm:text-sm text-stone-600">
                  {admission?.requiredDocuments.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-white p-3 rounded-xl border border-stone-200">
                      <span className="text-amber-700 font-bold">📄</span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-serif font-bold text-stone-900 mb-3">
                  Application Steps
                </h2>
                <div className="space-y-3">
                  {admission?.applicationSteps.map((step) => (
                    <div key={step.step} className="flex gap-4 p-4 bg-white border border-stone-200 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-[#064e3b] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {step.step}
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">{step.title}</h4>
                        <p className="text-xs text-stone-600 mt-1">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Direct Inquiry Form */}
            <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-xs space-y-6 h-fit">
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  Online Admission Inquiry
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Submit applicant details to initiate direct contact with our admission department via WhatsApp and phone.
                </p>
              </div>

              {formSubmitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                  <div className="text-2xl">✅</div>
                  <h4 className="font-bold text-emerald-950 text-sm">Inquiry Initiated!</h4>
                  <p className="text-xs text-emerald-800">
                    Your details have been routed to WhatsApp. Our admission coordinators will guide you with the official form and verification dates.
                  </p>
                  <button
                    type="button"
                    onClick={() => setFormSubmitted(false)}
                    className="mt-3 text-xs text-emerald-900 underline font-semibold"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="font-semibold text-stone-800 block mb-1">
                      Applicant Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Muhammad Zayd"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-stone-800 block mb-1">
                      Father’s / Guardian’s Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maulana Tariq Ahmad"
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-stone-800 block mb-1">
                      Guardian Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-stone-800 block mb-1">
                      Department of Interest
                    </label>
                    <select
                      value={program}
                      onChange={(e) => setProgram(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white"
                    >
                      <option value="Hifz-ul-Quran">Hifz-ul-Quran & Tajweed</option>
                      <option value="Dars-e-Nizami (Alimiyyah)">Dars-e-Nizami (Alimiyyah)</option>
                      <option value="Dawrah-e-Hadith (Fazilat)">Dawrah-e-Hadith (Fazilat)</option>
                      <option value="Primary Islamic Maktab">Primary Islamic Maktab</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-stone-800 block mb-1">
                      Additional Notes / Prior Education
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Mention any previous Quranic study or current grade..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#064e3b] hover:bg-[#022c22] text-white font-medium rounded-lg transition-colors cursor-pointer text-xs"
                  >
                    Submit Inquiry & Open WhatsApp ➔
                  </button>

                  <p className="text-[11px] text-stone-500 text-center">
                    Direct Assistance Hotline: <strong className="text-stone-800">{contactPhone}</strong>
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
