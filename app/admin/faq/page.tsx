'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { cmsService } from '@/lib/cmsService';
import { FAQItem } from '@/lib/types';

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FAQItem | null>(null);

  // Form states
  const [question, setQuestion] = useState('');
  const [questionUrdu, setQuestionUrdu] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('Admission');
  const [order, setOrder] = useState(1);
  const [published, setPublished] = useState(true);

  useEffect(() => {
    loadFaqs();
  }, []);

  async function loadFaqs() {
    setLoading(true);
    try {
      const list = await cmsService.getFAQs();
      setFaqs(list.sort((a, b) => a.order - b.order));
    } finally {
      setLoading(false);
    }
  }

  const handleStartCreate = () => {
    setEditingFaq(null);
    setQuestion('');
    setQuestionUrdu('');
    setAnswer('');
    setCategory('Admission');
    setOrder(faqs.length + 1);
    setPublished(true);
    setIsCreating(true);
  };

  const handleStartEdit = (f: FAQItem) => {
    setIsCreating(false);
    setEditingFaq(f);
    setQuestion(f.question);
    setQuestionUrdu(f.questionUrdu || '');
    setAnswer(f.answer);
    setCategory(f.category);
    setOrder(f.order);
    setPublished(f.published);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const faqData: FAQItem = {
        id: isCreating ? `faq_${Date.now()}` : editingFaq!.id,
        question,
        questionUrdu,
        answer,
        category,
        order: Number(order) || 1,
        published,
      };

      await cmsService.saveFAQ(faqData);
      setIsCreating(false);
      setEditingFaq(null);
      await loadFaqs();
    } catch (err) {
      alert('Error saving FAQ: ' + String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await cmsService.deleteFAQ(deleteTarget.id);
      setDeleteTarget(null);
      await loadFaqs();
    } catch (err) {
      alert('Failed deleting FAQ: ' + String(err));
    }
  };

  return (
    <AdminLayout
      title="Frequently Asked Questions (FAQ)"
      subtitle="Manage answers to common inquiries regarding admissions, syllabus, fees, and visits"
      actions={
        <button
          onClick={handleStartCreate}
          className="px-3.5 py-2 bg-[#064e3b] hover:bg-[#022c22] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>+ Add FAQ</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Editor Form */}
        {(isCreating || editingFaq) && (
          <div className="bg-white rounded-2xl p-6 border-2 border-emerald-800/40 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-serif font-bold text-stone-900 text-base">
                {isCreating ? 'Add New FAQ' : `Edit FAQ`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingFaq(null);
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
                    Question (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g. What is the minimum age for Hifz admission?"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    Urdu Question
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={questionUrdu}
                    onChange={(e) => setQuestionUrdu(e.target.value)}
                    placeholder="حفظ میں داخلے کی کم از کم عمر کیا ہے؟"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 font-arabic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 bg-white"
                  >
                    <option value="Admission">Admissions & Eligibility</option>
                    <option value="Fees">Fees & Sponsorships</option>
                    <option value="Curriculum">Curriculum & Academics</option>
                    <option value="Hostel">Hostel & Living</option>
                    <option value="Donation">Donation & Zakat</option>
                    <option value="General">General Inquiries</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Display Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">Answer *</label>
                <textarea
                  required
                  rows={4}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Clear and detailed answer..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="faqPub"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 text-emerald-800 rounded focus:ring-emerald-700"
                />
                <label htmlFor="faqPub" className="text-xs font-medium text-stone-700">
                  Published and Visible on Website
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingFaq(null);
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
                  {saving ? 'Saving...' : 'Save FAQ ➔'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* FAQs List */}
        <div className="space-y-3">
          {faqs.map((f) => (
            <div
              key={f.id}
              className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-700 transition-colors"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[10px] font-bold uppercase bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                    {f.category}
                  </span>
                  <span className="text-[11px] text-stone-400">Order: {f.order}</span>
                </div>

                <h4 className="font-serif font-bold text-stone-900 text-sm">
                  {f.question}
                </h4>
                <p className="text-xs text-stone-500 line-clamp-1">{f.answer}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-xs">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    f.published
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {f.published ? 'Live' : 'Draft'}
                </span>
                <button
                  onClick={() => handleStartEdit(f)}
                  className="text-emerald-800 hover:underline font-semibold cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(f)}
                  className="text-rose-600 hover:underline font-semibold cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete FAQ"
        message={`Are you sure you want to delete this FAQ item?`}
        confirmLabel="Delete FAQ"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
