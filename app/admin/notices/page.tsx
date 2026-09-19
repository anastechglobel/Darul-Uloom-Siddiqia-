'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { cmsService } from '@/lib/cmsService';
import { Notice } from '@/lib/types';

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [titleUrdu, setTitleUrdu] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Academic');
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>('normal');
  const [publishedDate, setPublishedDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [linkText, setLinkText] = useState('Read Details');
  const [published, setPublished] = useState(true);

  useEffect(() => {
    loadNotices();
  }, []);

  async function loadNotices() {
    setLoading(true);
    try {
      const list = await cmsService.getNotices();
      setNotices(list);
    } finally {
      setLoading(false);
    }
  }

  const handleStartCreate = () => {
    setEditingNotice(null);
    setTitle('');
    setTitleUrdu('');
    setContent('');
    setCategory('Academic');
    setPriority('normal');
    setPublishedDate(new Date().toISOString().split('T')[0]);
    setExpiryDate('');
    setExternalLink('');
    setLinkText('Read Details');
    setPublished(true);
    setIsCreating(true);
  };

  const handleStartEdit = (n: Notice) => {
    setIsCreating(false);
    setEditingNotice(n);
    setTitle(n.title);
    setTitleUrdu(n.titleUrdu || '');
    setContent(n.content);
    setCategory(n.category);
    setPriority((n.priority as 'normal' | 'high' | 'urgent') || 'normal');
    setPublishedDate(n.publishedDate);
    setExpiryDate(n.expiryDate || '');
    setExternalLink(n.externalLink || '');
    setLinkText(n.linkText || 'Read Details');
    setPublished(n.published);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const noticeData: Notice = {
        id: isCreating ? `not_${Date.now()}` : editingNotice!.id,
        title,
        titleUrdu,
        content,
        category,
        priority,
        publishedDate,
        expiryDate,
        externalLink,
        linkText,
        published,
      };

      await cmsService.saveNotice(noticeData);
      setIsCreating(false);
      setEditingNotice(null);
      await loadNotices();
    } catch (err) {
      alert('Error saving notice: ' + String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await cmsService.deleteNotice(deleteTarget.id);
      setDeleteTarget(null);
      await loadNotices();
    } catch (e) {
      alert('Failed deleting notice: ' + String(e));
    }
  };

  return (
    <AdminLayout
      title="Notice Board & Circulars"
      subtitle="Publish administrative circulars, exam schedules, and urgent notifications"
      actions={
        <button
          onClick={handleStartCreate}
          className="px-3.5 py-2 bg-[#064e3b] hover:bg-[#022c22] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>+ Post Notice</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Editor Form */}
        {(isCreating || editingNotice) && (
          <div className="bg-white rounded-2xl p-6 border-2 border-emerald-800/40 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-serif font-bold text-stone-900 text-base">
                {isCreating ? 'Post New Notice' : `Edit Notice: ${editingNotice?.title}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingNotice(null);
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
                    Notice Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Schedule for Mid-Term Hifz Evaluations"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    Urdu Title
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={titleUrdu}
                    onChange={(e) => setTitleUrdu(e.target.value)}
                    placeholder="امتحان کی تاریخ اور ہدایات"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none font-arabic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Admission">Admission</option>
                    <option value="Examination">Examination</option>
                    <option value="Holiday">Holiday & Vacation</option>
                    <option value="General">General Administrative</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Priority *</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High Alert</option>
                    <option value="urgent">Urgent Announcement</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={publishedDate}
                    onChange={(e) => setPublishedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">Notice Content *</label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Full text of notification..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Link URL (Optional)</label>
                  <input
                    type="text"
                    value={externalLink}
                    onChange={(e) => setExternalLink(e.target.value)}
                    placeholder="https://... or /admission"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Link Label</label>
                  <input
                    type="text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Read Guidelines"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="notPub"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 text-emerald-800 rounded focus:ring-emerald-700"
                />
                <label htmlFor="notPub" className="text-xs font-medium text-stone-700">
                  Published and Visible on Public Notice Board
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingNotice(null);
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
                  {saving ? 'Saving...' : 'Publish Notice ➔'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notices List */}
        <div className="space-y-3">
          {notices.map((n) => (
            <div
              key={n.id}
              className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-700 transition-colors"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                      n.priority === 'urgent'
                        ? 'bg-rose-100 text-rose-800'
                        : n.priority === 'high'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-50 text-emerald-800'
                    }`}
                  >
                    {n.priority}
                  </span>
                  <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-medium">
                    {n.category}
                  </span>
                  <span className="text-[11px] text-stone-400">Date: {n.publishedDate}</span>
                </div>

                <h4 className="font-serif font-bold text-stone-900 text-sm truncate">
                  {n.title}
                </h4>
                <p className="text-xs text-stone-500 line-clamp-1">{n.content}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-xs">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    n.published
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {n.published ? 'Live' : 'Draft'}
                </span>
                <button
                  onClick={() => handleStartEdit(n)}
                  className="text-emerald-800 hover:underline font-semibold cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(n)}
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
        title="Delete Notice"
        message={`Are you sure you want to remove notice "${deleteTarget?.title}"?`}
        confirmLabel="Delete Notice"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
