'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function AdminLayout({
  children,
  title,
  subtitle,
  actions,
}: AdminLayoutProps) {
  const { user, isAdmin, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If loading auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-stone-600">Verifying administrator access...</p>
        </div>
      </div>
    );
  }

  // If not logged in and not on login page
  if (!isAdmin && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-stone-200 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-2xl text-amber-700">
            🔒
          </div>
          <h2 className="text-xl font-serif font-bold text-stone-900">
            Administrator Authentication Required
          </h2>
          <p className="text-sm text-stone-600">
            You must be logged in with authorized administrator credentials to manage Darul Uloom Siddiqia website content.
          </p>
          <Link
            href="/admin/login"
            className="inline-block w-full py-3 bg-[#064e3b] hover:bg-[#022c22] text-white font-medium rounded-lg transition-colors text-sm"
          >
            Go to Admin Login Portal
          </Link>
        </div>
      </div>
    );
  }

  const navSections = [
    {
      heading: 'Content & Pages',
      items: [
        { href: '/admin', label: 'Dashboard', icon: '📊' },
        { href: '/admin/pages', label: 'Pages Management', icon: '📄' },
        { href: '/admin/sections', label: 'Sections Overview', icon: '📑' },
      ],
    },
    {
      heading: 'Institution & People',
      items: [
        { href: '/admin/madrasa', label: 'Madrasa Information', icon: '🏛️' },
        { href: '/admin/leadership', label: 'Nazim / Leadership', icon: '👳' },
        { href: '/admin/students', label: 'Student Statistics', icon: '🎓' },
        { href: '/admin/programs', label: 'Academic Programs', icon: '📚' },
        { href: '/admin/staff', label: 'Teachers & Staff', icon: '👨‍🏫' },
        { href: '/admin/facilities', label: 'Campus Facilities', icon: '🕌' },
      ],
    },
    {
      heading: 'Media & Announcements',
      items: [
        { href: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
        { href: '/admin/images', label: 'Image Library (ImgBB)', icon: '☁️' },
        { href: '/admin/videos', label: 'Videos & Media', icon: '📹' },
        { href: '/admin/notices', label: 'Notices Board', icon: '📢' },
        { href: '/admin/events', label: 'Events Calendar', icon: '🗓️' },
      ],
    },
    {
      heading: 'Services & Operations',
      items: [
        { href: '/admin/admission', label: 'Admission Portal', icon: '📝' },
        { href: '/admin/donation', label: 'Donation & Bank Accounts', icon: '🤲' },
        { href: '/admin/contact', label: 'Contact & Location', icon: '📍' },
        { href: '/admin/social', label: 'Social Media Links', icon: '🌐' },
        { href: '/admin/seo', label: 'SEO & Meta Tags', icon: '🔍' },
        { href: '/admin/settings', label: 'System Settings', icon: '⚙️' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex text-stone-800 antialiased">
      {/* Sidebar for Desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#022c22] text-stone-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 border-r border-[#064e3b] ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="p-4 border-b border-emerald-900 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 border border-amber-500/40 flex items-center justify-center text-amber-300 font-serif font-bold text-base">
              ص
            </div>
            <div>
              <h2 className="text-sm font-serif font-bold text-white tracking-tight leading-none">
                SIDDIQIA CMS
              </h2>
              <span className="text-[10px] text-amber-400 font-serif">Admin Portal</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-stone-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-400/80">
                {sec.heading}
              </h3>
              {sec.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                      active
                        ? 'bg-emerald-800 text-amber-300 font-semibold shadow-xs'
                        : 'text-stone-300 hover:bg-emerald-900/60 hover:text-white'
                    }`}
                  >
                    <span className="text-sm">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer info & live site link */}
        <div className="p-3 border-t border-emerald-900/80 bg-[#011e17] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 bg-emerald-900 hover:bg-emerald-800 text-xs text-emerald-100 rounded-md transition-colors"
          >
            <span>🌐 View Public Site</span> ↗
          </Link>
          <div className="flex items-center justify-between text-xs text-stone-400 px-1 pt-1">
            <span className="truncate max-w-[140px] text-[11px]">
              {user?.displayName || 'Administrator'}
            </span>
            <button
              onClick={logout}
              className="text-amber-400 hover:text-amber-300 text-xs font-medium cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-stone-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-100"
            >
              ☰
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-serif font-bold text-stone-900 leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {actions}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors font-medium"
            >
              Live Website ↗
            </Link>
          </div>
        </header>

        {/* Body Content */}
        <main className="p-4 sm:p-6 max-w-7xl w-full mx-auto flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
