'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { cmsService } from '@/lib/cmsService';
import { VideoItem } from '@/lib/types';
import { extractYouTubeId } from '@/lib/utils';

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingVid, setEditingVid] = useState<VideoItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<VideoItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [category, setCategory] = useState('Lectures');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState(1);
  const [published, setPublished] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  async function loadVideos() {
    setLoading(true);
    try {
      const list = await cmsService.getVideos();
      setVideos(list.sort((a, b) => a.order - b.order));
    } finally {
      setLoading(false);
    }
  }

  const handleStartCreate = () => {
    setEditingVid(null);
    setTitle('');
    setYoutubeUrl('');
    setCategory('Lectures');
    setDescription('');
    setOrder(videos.length + 1);
    setPublished(true);
    setIsCreating(true);
  };

  const handleStartEdit = (v: VideoItem) => {
    setIsCreating(false);
    setEditingVid(v);
    setTitle(v.title);
    setYoutubeUrl(v.youtubeUrl);
    setCategory(v.category);
    setDescription(v.description || '');
    setOrder(v.order);
    setPublished(v.published);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const ytid = extractYouTubeId(youtubeUrl);
    if (!ytid) {
      alert('Please enter a valid YouTube video URL or ID.');
      return;
    }

    setSaving(true);
    try {
      const videoData: VideoItem = {
        id: isCreating ? `vid_${Date.now()}` : editingVid!.id,
        title,
        youtubeUrl,
        youtubeVideoId: ytid,
        category,
        description,
        order: Number(order) || 1,
        published,
      };

      await cmsService.saveVideo(videoData);
      setIsCreating(false);
      setEditingVid(null);
      await loadVideos();
    } catch (err) {
      alert('Error saving video: ' + String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await cmsService.deleteVideo(deleteTarget.id);
      setDeleteTarget(null);
      await loadVideos();
    } catch (e) {
      alert('Failed deleting video: ' + String(e));
    }
  };

  return (
    <AdminLayout
      title="Videos & Audio-Visual Media"
      subtitle="Publish YouTube discourses, Dastarbandi recitations, and campus documentaries"
      actions={
        <button
          onClick={handleStartCreate}
          className="px-3.5 py-2 bg-[#064e3b] hover:bg-[#022c22] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>+ Add Video</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Editor Form */}
        {(isCreating || editingVid) && (
          <div className="bg-white rounded-2xl p-6 border-2 border-emerald-800/40 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-serif font-bold text-stone-900 text-base">
                {isCreating ? 'Add YouTube Video' : `Edit: ${editingVid?.title}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingVid(null);
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
                    Video Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Annual Convocation Address by Maulana Abdus Subhan"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    YouTube URL or Video ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none bg-white"
                  >
                    <option value="Lectures">Theological Lectures</option>
                    <option value="Dastarbandi">Dastarbandi & Convocation</option>
                    <option value="Qirat">Quranic Qirat & Tilawat</option>
                    <option value="Documentary">Campus Documentary</option>
                    <option value="Conference">Special Conferences</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Display Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of discourse, speaker names..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="vidPub"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 text-emerald-800 rounded focus:ring-emerald-700"
                />
                <label htmlFor="vidPub" className="text-xs font-medium text-stone-700">
                  Visible on Public Video Portal
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingVid(null);
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
                  {saving ? 'Saving...' : 'Save Video ➔'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-xl overflow-hidden border border-stone-200 shadow-xs flex flex-col justify-between group hover:border-emerald-700 transition-all"
            >
              <div className="aspect-video bg-stone-900 relative">
                <img
                  src={`https://img.youtube.com/vi/${v.youtubeVideoId}/mqdefault.jpg`}
                  alt={v.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <span className="absolute top-2 left-2 bg-stone-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                  {v.category}
                </span>
              </div>

              <div className="p-3 space-y-1">
                <h4 className="font-serif font-bold text-stone-900 text-xs truncate">
                  {v.title}
                </h4>
                {v.description && (
                  <p className="text-[10px] text-stone-500 truncate">{v.description}</p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px]">
                  <button
                    onClick={() => handleStartEdit(v)}
                    className="text-emerald-800 hover:underline font-semibold cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(v)}
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
        title="Delete Video"
        message={`Are you sure you want to remove "${deleteTarget?.title}"?`}
        confirmLabel="Delete Video"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
