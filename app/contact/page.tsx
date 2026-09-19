'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cmsService } from '@/lib/cmsService';
import { MadrasaInfo, Leadership } from '@/lib/types';

export default function ContactPage() {
  const [madrasa, setMadrasa] = useState<MadrasaInfo | null>(null);
  const [leadership, setLeadership] = useState<Leadership | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    async function load() {
      const [m, l] = await Promise.all([
        cmsService.getMadrasaInfo(),
        cmsService.getLeadership(),
      ]);
      setMadrasa(m);
      setLeadership(l);
    }
    load();
  }, []);

  const contactPhone = madrasa?.phone || '+91 8828290721';
  const address = `${madrasa?.address || 'Village Aurahi East, PO Simraha'}, District ${madrasa?.district || 'Araria'}, ${madrasa?.state || 'Bihar'}, ${madrasa?.country || 'India'} - ${madrasa?.pincode || '854318'}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `*General Contact Inquiry - Darul Uloom Siddiqia*\n\nFrom: ${name}\nPhone: ${phone}\nEmail: ${email || 'N/A'}\nSubject: ${subject}\n\nMessage: ${message}`
    );
    window.open(`https://wa.me/${contactPhone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
    setSent(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Banner */}
        <section className="bg-[#022c22] text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-2">
            <span className="text-xs font-bold tracking-widest text-amber-300 uppercase">
              Get in Touch & Visit
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold">
              Contact & Location
            </h1>
            <p className="text-amber-200 font-serif text-sm sm:text-base">
              Aurahi East, Simraha, Araria, Bihar, India
            </p>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="py-16 px-4 max-w-6xl mx-auto space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Addresses and directions */}
            <div className="space-y-6">
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Institutional Headquarters
                </h3>

                <div className="space-y-3 text-xs sm:text-sm text-stone-600">
                  <div className="flex items-start gap-3">
                    <span className="text-base text-amber-700">📍</span>
                    <div>
                      <strong className="text-stone-900 block">Postal Address:</strong>
                      <p>{address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-base text-amber-700">📞</span>
                    <div>
                      <strong className="text-stone-900 block">Phone & WhatsApp:</strong>
                      <a href={`tel:${contactPhone}`} className="hover:underline text-emerald-800">
                        {contactPhone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-base text-amber-700">✉️</span>
                    <div>
                      <strong className="text-stone-900 block">Official Email:</strong>
                      <p>{madrasa?.email || 'info@darululoomsiddiqia.edu'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-base text-amber-700">⏰</span>
                    <div>
                      <strong className="text-stone-900 block">Administrative Office Hours:</strong>
                      <p>Saturday to Thursday: 8:30 AM – 1:00 PM & 3:00 PM – 5:30 PM (Friday Closed)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* How to Reach */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-3">
                <h4 className="font-serif font-bold text-stone-900 text-base">
                  How to Reach the Campus
                </h4>
                <div className="space-y-2 text-xs text-stone-600 leading-relaxed">
                  <p>
                    🚆 <strong>By Train:</strong> Simraha Railway Station (SMH) is approximately 3 km away. Major railway stations nearby include Araria Court (ARQ) and Forbesganj Junction (FBG).
                  </p>
                  <p>
                    🛣️ <strong>By Road:</strong> Located just off the National Highway (NH-57 / NH-27) connecting Purnia and Forbesganj. Local auto-rickshaws and transport run continuously to Aurahi East.
                  </p>
                  <p>
                    ✈️ <strong>By Air:</strong> Darbhanga Airport (DIB) and Bagdogra Airport (IXB) are the nearest domestic airports with regular highway connectivity.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Message Form */}
            <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  Send a Direct Message
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Have an administrative, theological, or general question? Reach our rectorate directly.
                </p>
              </div>

              {sent ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                  <div className="text-2xl">✅</div>
                  <h4 className="font-bold text-emerald-950 text-sm">Message Prepared!</h4>
                  <p className="text-xs text-emerald-800">
                    Your inquiry has been forwarded to the rectorate WhatsApp hotline.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-3 text-xs text-emerald-900 underline font-semibold"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="font-semibold text-stone-800 block mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ahmad Raza"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-stone-800 block mb-1">
                        Phone / WhatsApp *
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
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="you@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-stone-800 block mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Campus Visit / Verification / Donation Query"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-stone-800 block mb-1">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Write your detailed query or message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#064e3b] hover:bg-[#022c22] text-white font-medium rounded-lg transition-colors cursor-pointer text-xs"
                  >
                    Send Inquiry via WhatsApp / Portal ➔
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Embedded Map Section */}
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-stone-900 text-sm">
                  Geographic Location: Simraha & Aurahi East, Araria
                </h4>
                <p className="text-[11px] text-stone-500">
                  Latitude: 26.17° N | Longitude: 87.41° E | Bihar, India
                </p>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=Simraha+Araria+Bihar`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#064e3b] hover:underline"
              >
                Open in Google Maps ↗
              </a>
            </div>
            <div className="w-full h-80 bg-stone-200">
              <iframe
                title="Location Map"
                src="https://maps.google.com/maps?q=Simraha,%20Araria,%20Bihar&t=&z=13&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
