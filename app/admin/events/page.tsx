'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImageUploader from '@/components/ImageUploader';
import { cmsService } from '@/lib/cmsService';
import { EventItem } from '@/lib/types';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<EventItem | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [titleUrdu, setTitleUrdu] = useState('');
  const [date, setDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('Darul Uloom Siddiqia Main Courtyard');
  const [chiefGuest, setChiefGuest] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [registrationRequired, setRegistrationRequired] = useState(false);
  const [published, setPublished] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    try {
      const list = await cmsService.getEvents();
      setEvents(list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    } finally {
      setLoading(false);
    }
  }

  const handleStartCreate = () => {
    setEditingEvent(null);
    setTitle('');
    setTitleUrdu('');
    setDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setTime('After Asr Prayer');
    setVenue('Darul Uloom Siddiqia Campus Grounds, Simraha');
    setChiefGuest('');
    setDescription('');
    setImageUrl('');
    setRegistrationRequired(false);
    setPublished(true);
    setIsCreating(true);
  };

  const handleStartEdit = (ev: EventItem) => {
    setIsCreating(false);
    setEditingEvent(ev);
    setTitle(ev.title);
    setTitleUrdu(ev.titleUrdu || '');
    setDate(ev.date);
    setEndDate(ev.endDate || '');
    setTime(ev.time || '');
    setVenue(ev.venue || ev.location || '');
    setChiefGuest(ev.chiefGuest || '');
    setDescription(ev.description);
    setImageUrl(ev.imageUrl || '');
    setRegistrationRequired(ev.registrationRequired || false);
    setPublished(ev.published);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const eventData: EventItem = {
        id: isCreating ? `ev_${Date.now()}` : editingEvent!.id,
        title,
        titleUrdu,
        date,
        endDate,
        time,
        venue,
        chiefGuest,
        description,
        imageUrl,
        registrationRequired,
        published,
      };

      await cmsService.saveEvent(eventData);
      setIsCreating(false);
      setEditingEvent(null);
      await loadEvents();
    } catch (err) {
      alert('Error saving event: ' + String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await cmsService.deleteEvent(deleteTarget.id);
      setDeleteTarget(null);
      await loadEvents();
    } catch (err) {
      alert('Failed deleting event: ' + String(err));
    }
  };

  return (
    <AdminLayout
      title="Conferences & Campus Events"
      subtitle="Organize upcoming Dastarbandi convocations, Seerat seminars, and Quran competitions"
      actions={
        <button
          onClick={handleStartCreate}
          className="px-3.5 py-2 bg-[#064e3b] hover:bg-[#022c22] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>+ Add Event</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Form Modal */}
        {(isCreating || editingEvent) && (
          <div className="bg-white rounded-2xl p-6 border-2 border-emerald-800/40 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-serif font-bold text-stone-900 text-base">
                {isCreating ? 'Schedule New Event' : `Edit Event: ${editingEvent?.title}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingEvent(null);
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
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 26th Annual Dastarbandi Ijlaas"
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
                    placeholder="سالانہ دستاربندی جلسہ"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none font-arabic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Time Schedule</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 10:00 AM – 4:00 PM"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Venue *</label>
                  <input
                    type="text"
                    required
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g. Campus Grounds, Simraha"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">
                  Dignitaries, Chief Guests & Presiding Scholars
                </label>
                <input
                  type="text"
                  value={chiefGuest}
                  onChange={(e) => setChiefGuest(e.target.value)}
                  placeholder="e.g. Prominent Ulama-e-Kiram from Darul Uloom Deoband"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">Event Narrative</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details of conference, program schedule, attendees welcome..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-stone-100">
                <ImageUploader
                  label="Event Poster or Banner (ImgBB)"
                  currentImageUrl={imageUrl}
                  onImageUploaded={(url) => setImageUrl(url)}
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="evReg"
                    checked={registrationRequired}
                    onChange={(e) => setRegistrationRequired(e.target.checked)}
                    className="w-4 h-4 text-emerald-800 rounded focus:ring-emerald-700"
                  />
                  <label htmlFor="evReg" className="text-xs font-medium text-stone-700">
                    RSVP / Registration Recommended
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="evPub"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4 text-emerald-800 rounded focus:ring-emerald-700"
                  />
                  <label htmlFor="evPub" className="text-xs font-medium text-stone-700">
                    Published on Website
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingEvent(null);
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
                  {saving ? 'Saving...' : 'Save Event ➔'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-3 hover:border-emerald-700 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                    📅 {ev.date}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      ev.published
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {ev.published ? 'Live' : 'Draft'}
                  </span>
                </div>

                <h4 className="text-base font-serif font-bold text-stone-900 leading-snug">
                  {ev.title}
                </h4>
                <p className="text-[11px] text-stone-500">📍 {ev.venue}</p>
                {ev.chiefGuest && (
                  <p className="text-[11px] text-amber-800">
                    <strong>Chief Guest:</strong> {ev.chiefGuest}
                  </p>
                )}
                <p className="text-xs text-stone-600 line-clamp-2">{ev.description}</p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-stone-100 text-xs">
                <button
                  onClick={() => handleStartEdit(ev)}
                  className="text-emerald-800 hover:underline font-semibold cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(ev)}
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
        title="Delete Event"
        message={`Are you sure you want to delete event "${deleteTarget?.title}"?`}
        confirmLabel="Delete Event"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
