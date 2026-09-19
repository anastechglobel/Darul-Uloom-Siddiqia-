'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImageUploader from '@/components/ImageUploader';
import { cmsService } from '@/lib/cmsService';
import { StaffMember } from '@/lib/types';

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<StaffMember | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [nameUrdu, setNameUrdu] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('Quran & Hifz Department');
  const [qualification, setQualification] = useState('Hafiz & Qari');
  const [biography, setBiography] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [order, setOrder] = useState(1);
  const [published, setPublished] = useState(true);

  useEffect(() => {
    loadStaff();
  }, []);

  async function loadStaff() {
    setLoading(true);
    try {
      const list = await cmsService.getStaff();
      setStaff(list.sort((a, b) => a.order - b.order));
    } finally {
      setLoading(false);
    }
  }

  const handleStartCreate = () => {
    setEditingStaff(null);
    setName('');
    setNameUrdu('');
    setDesignation('Ustad-e-Hifz');
    setDepartment('Quran & Hifz Department');
    setQualification('Hafiz, Qari & Alim');
    setBiography('');
    setImageUrl('');
    setPhone('');
    setContactEmail('');
    setOrder(staff.length + 1);
    setPublished(true);
    setIsCreating(true);
  };

  const handleStartEdit = (s: StaffMember) => {
    setIsCreating(false);
    setEditingStaff(s);
    setName(s.name);
    setNameUrdu(s.nameUrdu || '');
    setDesignation(s.designation);
    setDepartment(s.department);
    setQualification(s.qualification);
    setBiography(s.biography || '');
    setImageUrl(s.imageUrl || '');
    setPhone(s.phone || '');
    setContactEmail(s.contactEmail || '');
    setOrder(s.order);
    setPublished(s.published);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const staffData: StaffMember = {
        id: isCreating ? `staff_${Date.now()}` : editingStaff!.id,
        name,
        nameUrdu,
        designation,
        department,
        qualification,
        biography,
        imageUrl,
        phone,
        contactEmail,
        order: Number(order) || 1,
        published,
      };

      await cmsService.saveStaff(staffData);
      setIsCreating(false);
      setEditingStaff(null);
      await loadStaff();
    } catch (err) {
      alert('Error saving staff member: ' + String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await cmsService.deleteStaff(deleteTarget.id);
      setDeleteTarget(null);
      await loadStaff();
    } catch (err) {
      alert('Failed deleting staff member: ' + String(err));
    }
  };

  return (
    <AdminLayout
      title="Teachers & Staff Directory"
      subtitle="Manage scholarly faculty profiles, qualifications, departments, and photos"
      actions={
        <button
          onClick={handleStartCreate}
          className="px-3.5 py-2 bg-[#064e3b] hover:bg-[#022c22] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>+ Add Teacher / Staff</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Editor Form */}
        {(isCreating || editingStaff) && (
          <div className="bg-white rounded-2xl p-6 border-2 border-emerald-800/40 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-serif font-bold text-stone-900 text-base">
                {isCreating ? 'Add New Faculty Member' : `Edit: ${editingStaff?.name}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingStaff(null);
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
                    Full Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Qari Noor Alam"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    Urdu Name
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={nameUrdu}
                    onChange={(e) => setNameUrdu(e.target.value)}
                    placeholder="قاری نور عالم"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none font-arabic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Sadr-ul-Mudarriseen / Senior Hafiz"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    Academic Department *
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Quran & Hifz Department"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    Educational Qualifications *
                  </label>
                  <input
                    type="text"
                    required
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="e.g. Fazil-e-Deoband, Hafiz-ul-Quran"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">
                  Brief Biography / Mentorship Description
                </label>
                <textarea
                  rows={3}
                  value={biography}
                  onChange={(e) => setBiography(e.target.value)}
                  placeholder="Experience, years at Siddiqia, subject specializations..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-stone-100">
                <ImageUploader
                  label="Teacher Profile Photo (ImgBB Hosted)"
                  currentImageUrl={imageUrl}
                  onImageUploaded={(url) => setImageUrl(url)}
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
                    id="staffPub"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4 text-emerald-800 rounded focus:ring-emerald-700"
                  />
                  <label htmlFor="staffPub" className="text-xs font-medium text-stone-700">
                    Published on Staff Directory
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingStaff(null);
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
                  {saving ? 'Saving...' : 'Save Staff Profile ➔'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Staff Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((s) => (
            <div
              key={s.id}
              className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-3 hover:border-emerald-700 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-stone-200 bg-stone-100 shrink-0">
                  <img
                    src={
                      s.imageUrl ||
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
                    }
                    alt={s.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif font-bold text-stone-900 text-sm truncate">
                    {s.name}
                  </h4>
                  <p className="text-[11px] text-amber-800 font-medium truncate">
                    {s.designation}
                  </p>
                  <p className="text-[10px] text-stone-500 truncate">{s.department}</p>
                </div>
              </div>

              <div className="text-[11px] text-stone-600 line-clamp-2">
                {s.biography || `Qualification: ${s.qualification}`}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    s.published
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {s.published ? 'Active' : 'Hidden'}
                </span>
                <div className="space-x-3">
                  <button
                    onClick={() => handleStartEdit(s)}
                    className="text-emerald-800 hover:underline font-semibold cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(s)}
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
        title="Delete Staff Profile"
        message={`Are you sure you want to remove "${deleteTarget?.name}" from the faculty list?`}
        confirmLabel="Delete Staff"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
