'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { cmsService } from '@/lib/cmsService';
import { CMSPage } from '@/lib/types';
import { slugify } from '@/lib/utils';

export default function AdminPagesPage() {
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<CMSPage | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CMSPage | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [showInNav, setShowInNav] = useState(true);
  const [published, setPublished] = useState(true);
  const [order, setOrder] = useState(0);

  useEffect(() => {
    loadPages();
  }, []);

  async function loadPages() {
    setLoading(true);
    try {
      const list = await cmsService.getPages();
      setPages(list.sort((a, b) => a.order - b.order));
    } finally {
      setLoading(false);
    }
  }

  const handleStartCreate = () => {
    setEditingPage(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setShowInNav(true);
    setPublished(true);
    setOrder(pages.length + 1);
    setIsCreating(true);
  };

  const handleStartEdit = (p: CMSPage) => {
    setIsCreating(false);
    setEditingPage(p);
    setTitle(p.title);
    setSlug(p.slug);
    setDescription(p.description || '');
    setShowInNav(p.showInNav ?? p.isInNavigation ?? true);
    setPublished(p.published !== undefined ? p.published : p.status !== 'draft');
    setOrder(p.order);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isCreating || !editingPage) {
      setSlug(slugify(val));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isCreating) {
        const newPage: CMSPage = {
          id: `page_${Date.now()}`,
          slug: slugify(slug || title),
          title,
          description,
          showInNav,
          published,
          order: Number(order) || 0,
          sections: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await cmsService.savePage(newPage);
      } else if (editingPage) {
        const updated: CMSPage = {
          ...editingPage,
          title,
          slug: slugify(slug || title),
          description,
          showInNav,
          published,
          order: Number(order) || 0,
          updatedAt: new Date().toISOString(),
        };
        await cmsService.savePage(updated);
      }
      setIsCreating(false);
      setEditingPage(null);
      await loadPages();
    } catch (err) {
      alert('Error saving page: ' + String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await cmsService.deletePage(deleteTarget.id);
      setDeleteTarget(null);
      await loadPages();
    } catch (err) {
      alert('Failed to delete page: ' + String(err));
    }
  };

  return (
    <AdminLayout
      title="Pages Management"
      subtitle="Create and customize unlimited pages, navigation visibility, and order"
      actions={
        <button
          onClick={handleStartCreate}
          className="px-3.5 py-2 bg-[#064e3b] hover:bg-[#022c22] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>+ Create New Page</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Modal / Inline Editor */}
        {(isCreating || editingPage) && (
          <div className="bg-white rounded-2xl p-6 border-2 border-emerald-800/30 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-serif font-bold text-stone-900 text-base">
                {isCreating ? 'Create New Website Page' : `Edit Page: ${editingPage?.title}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingPage(null);
                }}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Page Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Annual Convocation"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    URL Slug (e.g. /my-slug) *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(slugify(e.target.value))}
                    placeholder="e.g. annual-convocation"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">Description / Subtitle</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description for SEO and page header..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
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
                    id="navCheck"
                    checked={showInNav}
                    onChange={(e) => setShowInNav(e.target.checked)}
                    className="w-4 h-4 text-emerald-800 rounded focus:ring-emerald-700"
                  />
                  <label htmlFor="navCheck" className="text-xs font-medium text-stone-700">
                    Include in Top Navigation
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="pubCheck"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4 text-emerald-800 rounded focus:ring-emerald-700"
                  />
                  <label htmlFor="pubCheck" className="text-xs font-medium text-stone-700">
                    Published & Live
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingPage(null);
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
                  {saving ? 'Saving...' : 'Save Page ➔'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Pages Table */}
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-serif uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Page Title</th>
                  <th className="py-3.5 px-4">Slug / Path</th>
                  <th className="py-3.5 px-4">Sections</th>
                  <th className="py-3.5 px-4">Navigation</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {pages.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-stone-500">
                      {p.order}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-stone-900">
                      {p.title}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-800">
                      /{p.slug}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">
                      <Link
                        href={`/admin/sections?pageId=${p.id}`}
                        className="inline-flex items-center gap-1 text-emerald-800 hover:underline font-medium"
                      >
                        <span>{p.sections?.length || 0} sections</span> ➔
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      {p.showInNav ? (
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded">
                          Visible
                        </span>
                      ) : (
                        <span className="text-[10px] bg-stone-100 text-stone-500 font-medium px-2 py-0.5 rounded">
                          Hidden
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {p.published ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded">
                          Live
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        href={p.slug === 'home' ? '/' : `/${p.slug}`}
                        target="_blank"
                        className="text-stone-500 hover:text-stone-800 font-medium"
                      >
                        View ↗
                      </Link>
                      <button
                        onClick={() => handleStartEdit(p)}
                        className="text-emerald-800 hover:text-emerald-950 font-medium cursor-pointer"
                      >
                        Edit
                      </button>
                      {p.slug !== 'home' && (
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Confirm Page Deletion"
        message={`Are you sure you want to delete the page "${deleteTarget?.title}"? All associated sections and content will be removed.`}
        confirmLabel="Delete Page"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
