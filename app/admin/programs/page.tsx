'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImageUploader from '@/components/ImageUploader';
import { cmsService } from '@/lib/cmsService';
import { Program } from '@/lib/types';
import { slugify } from '@/lib/utils';

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProg, setEditingProg] = useState<Program | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Program | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [titleUrdu, setTitleUrdu] = useState('');
  const [slug, setSlug] = useState('');
  const [duration, setDuration] = useState('3 Years');
  const [eligibility, setEligibility] = useState('');
  const [feesType, setFeesType] = useState('100% Free / Waqf Sponsored');
  const [schedule, setSchedule] = useState('Full Time (Boarding)');
  const [description, setDescription] = useState('');
  const [curriculumRaw, setCurriculumRaw] = useState('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [published, setPublished] = useState(true);
  const [order, setOrder] = useState(1);

  useEffect(() => {
    loadPrograms();
  }, []);

  async function loadPrograms() {
    setLoading(true);
    try {
      const list = await cmsService.getPrograms();
      setPrograms(list.sort((a, b) => a.order - b.order));
    } finally {
      setLoading(false);
    }
  }

  const handleStartCreate = () => {
    setEditingProg(null);
    setTitle('');
    setTitleUrdu('');
    setSlug('');
    setDuration('3 Years');
    setEligibility('Basic Nazira Quran proficiency');
    setFeesType('100% Free / Waqf Sponsored');
    setSchedule('Full Time (Residential Boarding)');
    setDescription('');
    setCurriculumRaw('Tajweed-ul-Quran\nMemorization of 30 Juz\nDaily revision (Daur)\nIslamic Adab & Sunnah');
    setFeaturedImageUrl('');
    setPublished(true);
    setOrder(programs.length + 1);
    setIsCreating(true);
  };

  const handleStartEdit = (p: Program) => {
    setIsCreating(false);
    setEditingProg(p);
    setTitle(p.title);
    setTitleUrdu(p.titleUrdu || '');
    setSlug(p.slug || slugify(p.title));
    setDuration(p.duration);
    setEligibility(p.eligibility);
    setFeesType(p.feesType);
    setSchedule(p.schedule || '');
    setDescription(p.description);
    setCurriculumRaw((p.curriculumOverview || []).join('\n'));
    setFeaturedImageUrl(p.featuredImageUrl || '');
    setPublished(p.published);
    setOrder(p.order);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const curriculum = curriculumRaw
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const progData: Program = {
        id: isCreating ? `prog_${Date.now()}` : editingProg!.id,
        title,
        titleUrdu,
        slug: slugify(slug || title),
        duration,
        eligibility,
        feesType,
        schedule,
        description,
        curriculumOverview: curriculum,
        featuredImageUrl,
        published,
        order: Number(order) || 1,
      };

      await cmsService.saveProgram(progData);
      setIsCreating(false);
      setEditingProg(null);
      await loadPrograms();
    } catch (err) {
      alert('Error saving program: ' + String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await cmsService.deleteProgram(deleteTarget.id);
      setDeleteTarget(null);
      await loadPrograms();
    } catch (e) {
      alert('Failed deleting program: ' + String(e));
    }
  };

  return (
    <AdminLayout
      title="Academic Programs & Courses"
      subtitle="Manage Hifz, Alimiyyah, Fazilat, and Maktab curricula and enrollment requirements"
      actions={
        <button
          onClick={handleStartCreate}
          className="px-3.5 py-2 bg-[#064e3b] hover:bg-[#022c22] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>+ Add Course</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Editor Form */}
        {(isCreating || editingProg) && (
          <div className="bg-white rounded-2xl p-6 border-2 border-emerald-800/40 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-serif font-bold text-stone-900 text-base">
                {isCreating ? 'Create Academic Program' : `Edit: ${editingProg?.title}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingProg(null);
                }}
                className="text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    Program Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (isCreating) setSlug(slugify(e.target.value));
                    }}
                    placeholder="e.g. Hifz-ul-Quran & Tajweed"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    Urdu / Arabic Title
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={titleUrdu}
                    onChange={(e) => setTitleUrdu(e.target.value)}
                    placeholder="حفظ القرآن والتجويد"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none font-arabic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    Course Duration *
                  </label>
                  <input
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 3 Years / 8 Years"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    Fees Policy
                  </label>
                  <input
                    type="text"
                    value={feesType}
                    onChange={(e) => setFeesType(e.target.value)}
                    placeholder="100% Free / Waqf Sponsored"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    Class Schedule
                  </label>
                  <input
                    type="text"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    placeholder="Residential Full Time / Day"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">
                  Eligibility Criteria *
                </label>
                <input
                  type="text"
                  required
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  placeholder="e.g. Minimum age 10 years, proficient Nazira reading"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">
                  Program Overview & Objectives
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed course description..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">
                  Curriculum Highlights (One item per line)
                </label>
                <textarea
                  rows={4}
                  value={curriculumRaw}
                  onChange={(e) => setCurriculumRaw(e.target.value)}
                  placeholder="Makharij & Tajweed rules&#10;Sabak (Daily lesson)&#10;Sabki (Recent revisions)&#10;Daur (Cumulative retention)"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono"
                />
              </div>

              <div className="pt-2 border-t border-stone-100">
                <ImageUploader
                  label="Featured Course Image"
                  currentImageUrl={featuredImageUrl}
                  onImageUploaded={(url) => setFeaturedImageUrl(url)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Display Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="progPub"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4 text-emerald-800 rounded focus:ring-emerald-700"
                  />
                  <label htmlFor="progPub" className="text-xs font-medium text-stone-700">
                    Published & Visible on Website
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingProg(null);
                  }}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-medium hover:bg-stone-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#064e3b] hover:bg-[#022c22] text-white rounded-lg font-medium cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Course ➔'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Programs List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs.map((p) => (
            <div
              key={p.id}
              className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-700 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {p.duration}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      p.published
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {p.published ? 'Live' : 'Draft'}
                  </span>
                </div>

                <h4 className="text-base font-serif font-bold text-stone-900 leading-snug">
                  {p.title}
                </h4>
                {p.titleUrdu && (
                  <p className="text-xs text-stone-500 font-arabic" dir="rtl">
                    {p.titleUrdu}
                  </p>
                )}

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>

                <p className="text-[11px] text-stone-500">
                  <strong>Eligibility:</strong> {p.eligibility}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
                <span className="text-[11px] text-amber-800 font-semibold">{p.feesType}</span>
                <div className="space-x-3">
                  <button
                    onClick={() => handleStartEdit(p)}
                    className="text-emerald-800 hover:underline font-semibold cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(p)}
                    className="text-rose-600 hover:underline font-semibold cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Academic Course"
        message={`Are you sure you want to delete the program "${deleteTarget?.title}"?`}
        confirmLabel="Delete Program"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
