'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { cmsService } from '@/lib/cmsService';
import { StudentStats } from '@/lib/types';

export default function AdminStudentsPage() {
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const s = await cmsService.getStudentStats();
        setStats(s);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (field: keyof StudentStats, val: any) => {
    if (!stats) return;
    setStats({ ...stats, [field]: val });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stats) return;
    setSaving(true);
    setSavedSuccess(false);
    try {
      await cmsService.updateStudentStats(stats);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Error saving student statistics: ' + String(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading || !stats) {
    return (
      <AdminLayout title="Student Statistics">
        <div className="p-8 text-center text-xs text-stone-500">Loading student data...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Student Demographics & Statistics"
      subtitle="Update aggregate numbers for active students, residential boarders, and alumni"
    >
      <form onSubmit={handleSave} className="space-y-6">
        {savedSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <span>✅</span>
            <span>Student statistics updated and synced to live website!</span>
          </div>
        )}

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
          <strong className="block">🔒 Student Privacy & Aggregate Policy:</strong>
          <p>
            In adherence to strict institutional privacy mandates and Child Protection best practices, only aggregate enrollment counts and demographic totals are published publicly. Individual student identification is maintained strictly within internal administrative registers.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6 text-xs">
          <h3 className="font-serif font-bold text-stone-900 text-base border-b border-stone-100 pb-3">
            Enrollment Counts
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <label className="font-semibold text-stone-800 block">
                Total Enrolled Students *
              </label>
              <input
                type="number"
                required
                value={stats.totalStudents}
                onChange={(e) => handleChange('totalStudents', Number(e.target.value))}
                className="w-full px-3 py-2 text-base font-bold text-[#064e3b] border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 bg-white"
              />
              <span className="text-[11px] text-stone-500">All registered active students</span>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <label className="font-semibold text-stone-800 block">
                Residential Boarders (Dar-ul-Iqama) *
              </label>
              <input
                type="number"
                required
                value={stats.residentialStudents}
                onChange={(e) => handleChange('residentialStudents', Number(e.target.value))}
                className="w-full px-3 py-2 text-base font-bold text-[#064e3b] border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 bg-white"
              />
              <span className="text-[11px] text-stone-500">Living full-time in student hostel</span>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <label className="font-semibold text-stone-800 block">
                Day Scholars (Commuters) *
              </label>
              <input
                type="number"
                required
                value={stats.dayScholarStudents}
                onChange={(e) => handleChange('dayScholarStudents', Number(e.target.value))}
                className="w-full px-3 py-2 text-base font-bold text-[#064e3b] border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 bg-white"
              />
              <span className="text-[11px] text-stone-500">From Aurahi, Simraha & nearby</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <label className="font-semibold text-stone-800 block">
                Total Graduated Scholars (Alumni)
              </label>
              <input
                type="number"
                value={stats.graduatedScholars || 0}
                onChange={(e) => handleChange('graduatedScholars', Number(e.target.value))}
                className="w-full px-3 py-2 text-base font-bold text-amber-700 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 bg-white"
              />
              <span className="text-[11px] text-stone-500">Since establishment in 1998</span>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <label className="font-semibold text-stone-800 block">
                Total Huffaz-ul-Quran Produced
              </label>
              <input
                type="number"
                value={stats.totalHuffazProduced || 0}
                onChange={(e) => handleChange('totalHuffazProduced', Number(e.target.value))}
                className="w-full px-3 py-2 text-base font-bold text-amber-700 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 bg-white"
              />
              <span className="text-[11px] text-stone-500">Scholars who completed Hifz</span>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <label className="font-semibold text-stone-800 block">
                Academic Session Year
              </label>
              <input
                type="text"
                value={stats.lastUpdatedYear}
                onChange={(e) => handleChange('lastUpdatedYear', e.target.value)}
                placeholder="2026-2027"
                className="w-full px-3 py-2 text-base font-bold text-stone-900 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 bg-white"
              />
              <span className="text-[11px] text-stone-500">Reporting year</span>
            </div>
          </div>

          <div className="pt-2">
            <label className="font-semibold text-stone-800 block mb-1">
              Public Note / Details on Boarding Welfare
            </label>
            <textarea
              rows={3}
              value={stats.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Notes about student dietary care, medical assistance, and waqf sponsorship..."
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
            {saving ? 'Saving...' : 'Save Student Demographics ➔'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
