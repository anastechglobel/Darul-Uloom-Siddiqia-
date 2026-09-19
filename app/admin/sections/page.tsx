'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImageUploader from '@/components/ImageUploader';
import { cmsService } from '@/lib/cmsService';
import { CMSPage, PageSection, SectionType } from '@/lib/types';

function AdminSectionsContent() {
  const searchParams = useSearchParams();
  const initialPageId = searchParams.get('pageId');

  const [pages, setPages] = useState<CMSPage[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editor states
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PageSection | null>(null);

  // Form fields
  const [sectionType, setSectionType] = useState<SectionType>('rich_text');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imagePosition, setImagePosition] = useState<'left' | 'right' | 'top' | 'center'>('left');
  const [videoUrl, setVideoUrl] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');
  const [secondaryCtaText, setSecondaryCtaText] = useState('');
  const [secondaryCtaUrl, setSecondaryCtaUrl] = useState('');
  const [backgroundColor, setBackgroundColor] = useState<'default' | 'emerald' | 'ivory' | 'charcoal' | 'gold'>('default');
  const [published, setPublished] = useState(true);

  useEffect(() => {
    loadPages();
  }, []);

  async function loadPages() {
    setLoading(true);
    try {
      const list = await cmsService.getPages();
      setPages(list);
      if (list.length > 0) {
        if (initialPageId && list.some((p) => p.id === initialPageId)) {
          setSelectedPageId(initialPageId);
        } else {
          setSelectedPageId(list[0].id);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  const currentPage = pages.find((p) => p.id === selectedPageId);
  const sections = currentPage?.sections || [];

  const handleStartCreate = () => {
    setEditingSection(null);
    setSectionType('rich_text');
    setTitle('');
    setSubtitle('');
    setDescription('');
    setContentHtml('');
    setImageUrl('');
    setImageAlt('');
    setImagePosition('left');
    setVideoUrl('');
    setCtaText('');
    setCtaUrl('');
    setSecondaryCtaText('');
    setSecondaryCtaUrl('');
    setBackgroundColor('default');
    setPublished(true);
    setIsCreating(true);
  };

  const handleStartEdit = (sec: PageSection) => {
    setIsCreating(false);
    setEditingSection(sec);
    setSectionType(sec.type);
    setTitle(sec.title || '');
    setSubtitle(sec.subtitle || '');
    setDescription(sec.description || '');
    setContentHtml(sec.contentHtml || '');
    setImageUrl(sec.imageUrl || '');
    setImageAlt(sec.imageAlt || '');
    setImagePosition(sec.imagePosition || 'left');
    setVideoUrl(sec.videoUrl || '');
    setCtaText(sec.ctaText || '');
    setCtaUrl(sec.ctaUrl || '');
    setSecondaryCtaText(sec.secondaryCtaText || '');
    setSecondaryCtaUrl(sec.secondaryCtaUrl || '');
    setBackgroundColor(sec.backgroundColor || 'default');
    setPublished(sec.published);
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPage) return;
    setSaving(true);
    try {
      let updatedSections: PageSection[] = [];
      if (isCreating) {
        const newSec: PageSection = {
          id: `sec_${Date.now()}`,
          type: sectionType,
          title,
          subtitle,
          description,
          contentHtml,
          imageUrl,
          imageAlt,
          imagePosition,
          videoUrl,
          ctaText,
          ctaUrl,
          secondaryCtaText,
          secondaryCtaUrl,
          backgroundColor,
          published,
          order: sections.length + 1,
        };
        updatedSections = [...sections, newSec];
      } else if (editingSection) {
        updatedSections = sections.map((s) =>
          s.id === editingSection.id
            ? {
                ...editingSection,
                type: sectionType,
                title,
                subtitle,
                description,
                contentHtml,
                imageUrl,
                imageAlt,
                imagePosition,
                videoUrl,
                ctaText,
                ctaUrl,
                secondaryCtaText,
                secondaryCtaUrl,
                backgroundColor,
                published,
              }
            : s
        );
      }

      const updatedPage: CMSPage = {
        ...currentPage,
        sections: updatedSections,
        updatedAt: new Date().toISOString(),
      };

      await cmsService.savePage(updatedPage);
      setIsCreating(false);
      setEditingSection(null);
      await loadPages();
    } catch (err) {
      alert('Failed saving section: ' + String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (!currentPage) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // re-assign orders
    newSections.forEach((s, idx) => {
      s.order = idx + 1;
    });

    const updatedPage: CMSPage = {
      ...currentPage,
      sections: newSections,
      updatedAt: new Date().toISOString(),
    };

    await cmsService.savePage(updatedPage);
    await loadPages();
  };

  const handleDelete = async () => {
    if (!currentPage || !deleteTarget) return;
    try {
      const filtered = sections.filter((s) => s.id !== deleteTarget.id);
      filtered.forEach((s, idx) => {
        s.order = idx + 1;
      });
      const updatedPage: CMSPage = {
        ...currentPage,
        sections: filtered,
        updatedAt: new Date().toISOString(),
      };
      await cmsService.savePage(updatedPage);
      setDeleteTarget(null);
      await loadPages();
    } catch (e) {
      alert('Error deleting section: ' + String(e));
    }
  };

  return (
    <AdminLayout
      title="Modular Page Sections"
      subtitle="Assemble, reorder, and configure dynamic content blocks for any page"
      actions={
        <button
          onClick={handleStartCreate}
          className="px-3.5 py-2 bg-[#064e3b] hover:bg-[#022c22] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>+ Add Section</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Page Selector */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Selected Page:
            </label>
            <select
              value={selectedPageId}
              onChange={(e) => {
                setSelectedPageId(e.target.value);
                setIsCreating(false);
                setEditingSection(null);
              }}
              className="px-3 py-1.5 text-xs font-semibold border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} (/{p.slug})
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs text-stone-500">
            {sections.length} sections defined on this page
          </span>
        </div>

        {/* Section Editor / Modal */}
        {(isCreating || editingSection) && (
          <div className="bg-white rounded-2xl p-6 border-2 border-emerald-800/40 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-serif font-bold text-stone-900 text-base">
                {isCreating ? 'Add New Section' : `Edit Section: ${editingSection?.title || sectionType}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingSection(null);
                }}
                className="text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSaveSection} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    Section Type *
                  </label>
                  <select
                    value={sectionType}
                    onChange={(e) => setSectionType(e.target.value as SectionType)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white font-medium"
                  >
                    <option value="hero">Hero Banner (Full Screen)</option>
                    <option value="rich_text">Rich Text & Typography</option>
                    <option value="image_text">Image + Narrative Text</option>
                    <option value="statistics">Numerical Statistics Grid</option>
                    <option value="features">Key Pillars & Features</option>
                    <option value="quote">Leadership Quote & Callout</option>
                    <option value="cta">Call to Action (CTA)</option>
                    <option value="video">Embedded Video Presentation</option>
                    <option value="custom">Custom Structured Section</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    Section Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Welcome to Darul Uloom Siddiqia"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    Eyebrow / Subtitle
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. Authentic Classical Scholarship"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">
                  Description / Paragraph Text
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Section narrative text..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              {/* Image Uploader integration with ImgBB */}
              <div className="pt-2 border-t border-stone-100">
                <ImageUploader
                  label="Section Image (Optional)"
                  currentImageUrl={imageUrl}
                  onImageUploaded={(url) => setImageUrl(url)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="e.g. Apply for Admission"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    Primary Button Link
                  </label>
                  <input
                    type="text"
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    placeholder="e.g. /admission"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    Background Aesthetic
                  </label>
                  <select
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white"
                  >
                    <option value="default">Default White / Light</option>
                    <option value="emerald">Deep Emerald Green (Islamic)</option>
                    <option value="ivory">Warm Ivory Canvas</option>
                    <option value="charcoal">Sleek Charcoal Dark</option>
                    <option value="gold">Warm Antique Gold</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="secPub"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4 text-emerald-800 rounded focus:ring-emerald-700"
                  />
                  <label htmlFor="secPub" className="text-xs font-medium text-stone-700">
                    Published & Active
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingSection(null);
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
                  {saving ? 'Saving...' : 'Save Section ➔'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sections List */}
        <div className="space-y-3">
          {sections.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 text-stone-500 text-xs">
              No modular sections created for this page yet. Click <strong>+ Add Section</strong> above.
            </div>
          ) : (
            sections.map((sec, idx) => (
              <div
                key={sec.id}
                className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs flex items-center justify-between gap-4 hover:border-emerald-700 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex flex-col gap-1">
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="text-stone-400 hover:text-stone-900 disabled:opacity-30 cursor-pointer text-xs"
                      title="Move Up"
                    >
                      ▲
                    </button>
                    <button
                      disabled={idx === sections.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="text-stone-400 hover:text-stone-900 disabled:opacity-30 cursor-pointer text-xs"
                      title="Move Down"
                    >
                      ▼
                    </button>
                  </div>

                  <span className="w-6 text-center font-mono text-xs text-stone-400 font-bold">
                    {idx + 1}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                        {sec.type}
                      </span>
                      <h4 className="font-serif font-bold text-stone-900 text-sm truncate">
                        {sec.title || 'Untitled Section'}
                      </h4>
                    </div>
                    {sec.subtitle && (
                      <p className="text-[11px] text-stone-500 truncate">{sec.subtitle}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-xs">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      sec.published
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {sec.published ? 'Live' : 'Draft'}
                  </span>

                  <button
                    onClick={() => handleStartEdit(sec)}
                    className="text-emerald-800 hover:underline font-semibold cursor-pointer"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setDeleteTarget(sec)}
                    className="text-rose-600 hover:underline font-semibold cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Section"
        message={`Are you sure you want to remove the section "${deleteTarget?.title || deleteTarget?.type}" from this page?`}
        confirmLabel="Delete Section"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}

export default function AdminSectionsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-stone-50 text-stone-500 font-sans text-sm">
          Loading Page Sections Editor...
        </div>
      }
    >
      <AdminSectionsContent />
    </React.Suspense>
  );
}
