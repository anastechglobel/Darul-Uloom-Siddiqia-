'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAdmin } = useAuth();
  const [email, setEmail] = useState('scholarsjourneyedu@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in
  if (isAdmin) {
    router.push('/admin');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res && res.success) {
        router.push('/admin');
      } else {
        setError(res?.error || 'Authentication failed. Please check credentials.');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setEmail('admin@darululoomsiddiqia.edu');
    setPassword('siddiqia1998');
    setLoading(true);
    setError(null);
    try {
      const res = await login('admin@darululoomsiddiqia.edu', 'siddiqia1998');
      if (res && res.success) {
        router.push('/admin');
      } else {
        setError(res?.error || 'Authentication error.');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#022c22] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-emerald-800 border-2 border-amber-500/50 flex items-center justify-center text-amber-300 font-serif font-bold text-3xl mx-auto shadow-lg">
          ص
        </div>
        <h2 className="text-2xl font-serif font-bold text-white tracking-tight">
          Darul Uloom Siddiqia
        </h2>
        <p className="text-xs text-amber-300 font-serif uppercase tracking-widest">
          Administrative Content Management System
        </p>

        {/* Live Firebase Cloud Status */}
        <div className="inline-flex items-center gap-1.5 py-1 px-3 bg-emerald-950/80 text-emerald-300 rounded-full text-[11px] font-medium border border-emerald-500/40">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Cloud Database & Auth: darul-uloom-siddiqia</span>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-stone-200 space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Firebase Administrator Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="scholarsjourneyedu@gmail.com"
                className="w-full px-3 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none text-stone-900"
              />
              <p className="text-[10px] text-stone-500 mt-1">
                Enter the email registered in your Firebase Authentication console.
              </p>
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Administrator Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none text-stone-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#064e3b] hover:bg-[#022c22] text-white font-medium rounded-lg shadow-sm transition-colors text-xs cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating with Firebase...' : 'Sign In with Firebase ➔'}
            </button>
          </form>

          {/* Quick Institutional Access */}
          <div className="pt-4 border-t border-stone-200 text-center space-y-3">
            <p className="text-[11px] text-stone-500">
              Institutional emergency master login:
            </p>
            <button
              type="button"
              onClick={handleQuickDemo}
              disabled={loading}
              className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              ⚡ Instant Master Admin Sign-In
            </button>
            <div className="pt-2">
              <Link href="/" className="text-xs text-stone-500 hover:text-stone-800">
                ← Return to Public Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
