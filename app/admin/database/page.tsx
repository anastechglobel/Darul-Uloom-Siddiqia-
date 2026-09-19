'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { cmsService } from '@/lib/cmsService';

export default function AdminDatabasePage() {
  const [resetting, setResetting] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleResetDefaults = async () => {
    setResetting(true);
    try {
      await cmsService.resetToDefaults();
      setStatusMessage({
        type: 'success',
        text: 'Darul Uloom Siddiqia institutional defaults successfully seeded into database!',
      });
      setConfirmReset(false);
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: 'Reset failed: ' + String(err),
      });
    } finally {
      setResetting(false);
    }
  };

  const handleExportBackup = async () => {
    try {
      const data = await cmsService.exportFullBackup();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `darul-uloom-siddiqia-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Backup export failed: ' + String(e));
    }
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        await cmsService.importFullBackup(json);
        setStatusMessage({
          type: 'success',
          text: 'Backup successfully restored into database!',
        });
      } catch (err) {
        setStatusMessage({
          type: 'error',
          text: 'Import error: ' + String(err),
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <AdminLayout
      title="Database & Cloud Synchronization"
      subtitle="Monitor Firebase Realtime Database connectivity, backup datasets, or reset to institutional defaults"
    >
      <div className="space-y-6">
        {statusMessage && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}
          >
            <span>{statusMessage.type === 'success' ? '✅' : '⚠️'}</span>
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Database Status */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-serif font-bold text-stone-900 text-base border-b border-stone-100 pb-3">
            Active Database Configuration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <span className="text-[10px] font-bold text-stone-500 uppercase">
                Primary Cloud Provider
              </span>
              <p className="font-bold text-stone-900 text-sm">Firebase Realtime Database</p>
              <p className="text-[11px] text-stone-500">
                Low-latency, live push synchronization across all visitors and administrative devices.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <span className="text-[10px] font-bold text-stone-500 uppercase">
                Offline Persistence Engine
              </span>
              <p className="font-bold text-emerald-800 text-sm">Active & Resilient</p>
              <p className="text-[11px] text-stone-500">
                Zero-lag instant UI rendering with fallback caching if network connectivity is interrupted.
              </p>
            </div>
          </div>
        </div>

        {/* Backup & Restore */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-serif font-bold text-stone-900 text-base border-b border-stone-100 pb-3">
            Full Institutional Data Backup & Restore
          </h3>
          <p className="text-stone-500">
            Export a complete snapshot of all Madrasa records (pages, staff, facilities, donations, photos, notices, and events) as an archival JSON file, or restore from a previous backup.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={handleExportBackup}
              className="px-4 py-2.5 bg-stone-900 hover:bg-black text-white font-medium rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <span>📥</span>
              <span>Export Full JSON Archive</span>
            </button>

            <label className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-2 border border-stone-300">
              <span>📤</span>
              <span>Restore from Backup File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Reset Defaults */}
        <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-xs space-y-4 text-xs">
          <h3 className="font-serif font-bold text-rose-900 text-base border-b border-rose-100 pb-3">
            Danger Zone: Seed Institutional Defaults
          </h3>
          <p className="text-stone-500 leading-relaxed">
            Seeding will restore all default data for Darul Uloom Siddiqia (Aurahi East, Simraha, Araria, Bihar, Maulana Abdus Subhan, official contact numbers, standard academic programs, and foundational campus facilities).
          </p>

          <div>
            <button
              onClick={() => setConfirmReset(true)}
              disabled={resetting}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg text-xs transition-colors cursor-pointer"
            >
              {resetting ? 'Resetting...' : 'Re-seed Darul Uloom Siddiqia Defaults'}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmReset}
        title="Reset to Institutional Defaults?"
        message="This will overwrite current CMS records with the verified institutional master dataset for Darul Uloom Siddiqia. Are you sure you wish to proceed?"
        confirmLabel="Yes, Reset Database"
        onConfirm={handleResetDefaults}
        onCancel={() => setConfirmReset(false)}
      />
    </AdminLayout>
  );
}
