'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { cmsService } from '@/lib/cmsService';
import {
  MadrasaInfo,
  Leadership,
  StudentStats,
  CMSPage,
  Program,
  StaffMember,
  Facility,
  GalleryItem,
  Notice,
  VideoItem,
} from '@/lib/types';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [madrasa, setMadrasa] = useState<MadrasaInfo | null>(null);
  const [leadership, setLeadership] = useState<Leadership | null>(null);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [m, l, s, pgs, progs, stf, fac, gal, nots, vids] = await Promise.all([
          cmsService.getMadrasaInfo(),
          cmsService.getLeadership(),
          cmsService.getStudentStats(),
          cmsService.getPages(),
          cmsService.getPrograms(),
          cmsService.getStaff(),
          cmsService.getFacilities(),
          cmsService.getGallery(),
          cmsService.getNotices(),
          cmsService.getVideos(),
        ]);
        setMadrasa(m);
        setLeadership(l);
        setStats(s);
        setPages(pgs);
        setPrograms(progs);
        setStaff(stf);
        setFacilities(fac);
        setGallery(gal);
        setNotices(nots);
        setVideos(vids);
      } catch (e) {
        console.error('Failed loading admin dashboard data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalSections = pages.reduce((acc, p) => acc + (p.sections?.length || 0), 0);

  return (
    <AdminLayout
      title="Administrative CMS Dashboard"
      subtitle="Complete content management for Darul Uloom Siddiqia, Aurahi East, Simraha, Araria"
      actions={
        <Link
          href="/admin/pages"
          className="px-3 py-1.5 bg-[#064e3b] hover:bg-[#022c22] text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
        >
          <span>+ Create New Page</span>
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Rector & Institutional Banner */}
        <div className="bg-gradient-to-r from-[#022c22] to-[#064e3b] text-white p-6 rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 bg-emerald-950">
              <img
                src={
                  leadership?.imageUrl ||
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
                }
                alt="Maulana Abdus Subhan"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest block">
                Rectorate & Leadership
              </span>
              <h2 className="text-xl font-serif font-bold text-white">
                {leadership?.nazimName || 'Maulana Abdus Subhan'}
              </h2>
              <p className="text-xs text-stone-200">
                Nazim / Rector • Contact: {leadership?.phone || '+91 8828290721'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <Link
              href="/admin/leadership"
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
            >
              Edit Nazim Profile & Message
            </Link>
            <Link
              href="/admin/madrasa"
              className="px-3.5 py-2 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 rounded-lg font-medium transition-colors"
            >
              Institutional Info
            </Link>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <Link
            href="/admin/pages"
            className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs hover:border-emerald-700 transition-all text-center"
          >
            <span className="text-2xl font-serif font-bold text-stone-900 block">
              {pages.length}
            </span>
            <span className="text-[11px] font-medium text-stone-500 block mt-1">
              CMS Pages
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
              {totalSections} Sections
            </span>
          </Link>

          <Link
            href="/admin/students"
            className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs hover:border-emerald-700 transition-all text-center"
          >
            <span className="text-2xl font-serif font-bold text-[#064e3b] block">
              {stats?.totalStudents || 550}+
            </span>
            <span className="text-[11px] font-medium text-stone-500 block mt-1">
              Total Students
            </span>
            <span className="text-[10px] text-stone-400 block mt-0.5">
              {stats?.residentialStudents || 340} Boarders
            </span>
          </Link>

          <Link
            href="/admin/programs"
            className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs hover:border-emerald-700 transition-all text-center"
          >
            <span className="text-2xl font-serif font-bold text-stone-900 block">
              {programs.length}
            </span>
            <span className="text-[11px] font-medium text-stone-500 block mt-1">
              Academic Courses
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
              Hifz & Alimiyyah
            </span>
          </Link>

          <Link
            href="/admin/staff"
            className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs hover:border-emerald-700 transition-all text-center"
          >
            <span className="text-2xl font-serif font-bold text-stone-900 block">
              {staff.length}
            </span>
            <span className="text-[11px] font-medium text-stone-500 block mt-1">
              Teachers & Staff
            </span>
            <span className="text-[10px] text-stone-400 block mt-0.5">Faculty Members</span>
          </Link>

          <Link
            href="/admin/gallery"
            className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs hover:border-emerald-700 transition-all text-center"
          >
            <span className="text-2xl font-serif font-bold text-stone-900 block">
              {gallery.length}
            </span>
            <span className="text-[11px] font-medium text-stone-500 block mt-1">
              Gallery Photos
            </span>
            <span className="text-[10px] text-amber-700 font-semibold mt-0.5 block">
              ImgBB Hosted
            </span>
          </Link>

          <Link
            href="/admin/notices"
            className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs hover:border-emerald-700 transition-all text-center"
          >
            <span className="text-2xl font-serif font-bold text-stone-900 block">
              {notices.length}
            </span>
            <span className="text-[11px] font-medium text-stone-500 block mt-1">
              Active Notices
            </span>
            <span className="text-[10px] text-stone-400 block mt-0.5">
              {videos.length} Videos
            </span>
          </Link>
        </div>

        {/* Quick Operations Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 cols: Quick Content Management Actions */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-stone-900 text-base">
              Quick Administrative Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <Link
                href="/admin/images"
                className="p-3.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 flex items-center gap-3 transition-colors"
              >
                <span className="text-2xl">☁️</span>
                <div>
                  <strong className="text-stone-900 block">Upload to ImgBB Library</strong>
                  <p className="text-stone-500 text-[11px]">Upload images & copy permanent URLs</p>
                </div>
              </Link>

              <Link
                href="/admin/notices"
                className="p-3.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 flex items-center gap-3 transition-colors"
              >
                <span className="text-2xl">📢</span>
                <div>
                  <strong className="text-stone-900 block">Post New Notice</strong>
                  <p className="text-stone-500 text-[11px]">Announce examinations or holidays</p>
                </div>
              </Link>

              <Link
                href="/admin/donation"
                className="p-3.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 flex items-center gap-3 transition-colors"
              >
                <span className="text-2xl">🤲</span>
                <div>
                  <strong className="text-stone-900 block">Update Bank & UPI QR</strong>
                  <p className="text-stone-500 text-[11px]">Change account number, IFSC, or UPI</p>
                </div>
              </Link>

              <Link
                href="/admin/admission"
                className="p-3.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 flex items-center gap-3 transition-colors"
              >
                <span className="text-2xl">📝</span>
                <div>
                  <strong className="text-stone-900 block">Manage Admission Status</strong>
                  <p className="text-stone-500 text-[11px]">Toggle Open/Closed, set dates</p>
                </div>
              </Link>

              <Link
                href="/admin/sections"
                className="p-3.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 flex items-center gap-3 transition-colors"
              >
                <span className="text-2xl">📑</span>
                <div>
                  <strong className="text-stone-900 block">Modular Page Sections</strong>
                  <p className="text-stone-500 text-[11px]">Reorder and customize hero, cards, stats</p>
                </div>
              </Link>

              <Link
                href="/admin/seo"
                className="p-3.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 flex items-center gap-3 transition-colors"
              >
                <span className="text-2xl">🔍</span>
                <div>
                  <strong className="text-stone-900 block">SEO & Google Search Meta</strong>
                  <p className="text-stone-500 text-[11px]">Keywords, social cards, schema</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Right 1 col: System Status & Persistence */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-stone-900 text-base">
              System Health & Storage
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-emerald-950 block">Database Sync</span>
                  <span className="text-emerald-800 text-[11px]">Firebase Realtime Database & Local Cache</span>
                </div>
                <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                  Active
                </span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="font-semibold text-stone-900 block">Image Storage Provider</span>
                <p className="text-stone-600 text-[11px]">
                  ImgBB API Integration for perpetual, fast CDN image hosting.
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="font-semibold text-stone-900 block">Supported Languages</span>
                <p className="text-stone-600 text-[11px]">
                  English, Hindi (हिंदी), Urdu (اردو), Arabic (العربية) with RTL support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
