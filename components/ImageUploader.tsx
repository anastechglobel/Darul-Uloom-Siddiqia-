'use client';

import React, { useState, useRef } from 'react';
import { cmsService } from '@/lib/cmsService';
import { formatFileSize } from '@/lib/utils';
import { ImageRecord } from '@/lib/types';

interface ImageUploaderProps {
  value?: string;
  onChange?: (url: string, metadata?: Partial<ImageRecord>) => void;
  currentImageUrl?: string;
  onImageUploaded?: (url: string, metadata?: Partial<ImageRecord>) => void;
  label?: string;
  helperText?: string;
  id?: string;
}

export default function ImageUploader({
  value,
  onChange,
  currentImageUrl,
  onImageUploaded,
  label = 'Image',
  helperText,
  id = 'image-uploader',
}: ImageUploaderProps) {
  const activeValue = value !== undefined ? value : (currentImageUrl || '');
  const [method, setMethod] = useState<'url' | 'upload'>('url');
  const [urlInput, setUrlInput] = useState<string>(activeValue);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const triggerChange = (url: string, metadata?: Partial<ImageRecord>) => {
    if (onChange) onChange(url, metadata);
    if (onImageUploaded) onImageUploaded(url, metadata);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    triggerChange(urlInput.trim(), {
      provider: 'external',
      source: 'url',
      imageUrl: urlInput.trim(),
    });
    setUploadSuccess('Direct image URL applied.');
    setTimeout(() => setUploadSuccess(null), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const handleUploadToImgBB = async () => {
    if (!selectedFile) {
      setUploadError('Please choose an image file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(
          json.error || 'Failed to upload image. Please verify your ImgBB setup or use a direct URL.'
        );
      }

      const imgData = json.data;
      const finalUrl = imgData.imageUrl || imgData.displayUrl;

      // Save to Image Library in Firebase/CMS
      const record: ImageRecord = {
        id: imgData.id || 'img_' + Date.now(),
        provider: 'imgbb',
        source: 'upload',
        imageUrl: finalUrl,
        displayUrl: imgData.displayUrl,
        thumbnailUrl: imgData.thumbnailUrl,
        deleteUrl: imgData.deleteUrl,
        filename: selectedFile.name,
        mimeType: selectedFile.type,
        size: selectedFile.size,
        createdAt: new Date().toISOString(),
      };
      await cmsService.saveImageRecord(record);

      setUrlInput(finalUrl);
      triggerChange(finalUrl, record);
      setUploadSuccess('Image successfully uploaded to ImgBB and saved!');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setUploadError(err.message || 'An error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setUrlInput('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    triggerChange('');
    setUploadSuccess(null);
    setUploadError(null);
  };

  const handleCopyUrl = () => {
    if (activeValue) {
      navigator.clipboard.writeText(activeValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div id={id} className="border border-stone-200 rounded-xl bg-white p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-semibold text-stone-800 tracking-wide">
          {label}
        </label>
        <div className="flex bg-stone-100 p-0.5 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => setMethod('url')}
            className={`px-3 py-1 rounded-md transition-all ${
              method === 'url'
                ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Direct URL
          </button>
          <button
            type="button"
            onClick={() => setMethod('upload')}
            className={`px-3 py-1 rounded-md transition-all ${
              method === 'upload'
                ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Upload (ImgBB)
          </button>
        </div>
      </div>

      {helperText && (
        <p className="text-xs text-stone-500 mb-3">{helperText}</p>
      )}

      {/* METHOD A: Direct URL */}
      {method === 'url' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 text-stone-800 bg-stone-50/50"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              Apply
            </button>
          </div>
          <p className="text-[11px] text-stone-500">
            Paste any direct image URL (JPEG, PNG, WEBP, or hosted link).
          </p>
        </div>
      )}

      {/* METHOD B: ImgBB Upload */}
      {method === 'upload' && (
        <div className="space-y-3">
          <div className="border-2 border-dashed border-stone-300 hover:border-emerald-700 rounded-xl p-4 text-center bg-stone-50/60 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              className="hidden"
              id={`${id}-file-input`}
            />
            <label
              htmlFor={`${id}-file-input`}
              className="cursor-pointer block space-y-1"
            >
              <div className="w-10 h-10 mx-auto rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-lg">
                ↑
              </div>
              <p className="text-sm font-medium text-stone-800">
                {selectedFile ? selectedFile.name : 'Click to browse image'}
              </p>
              <p className="text-xs text-stone-500">
                {selectedFile
                  ? `${formatFileSize(selectedFile.size)} • Ready to upload`
                  : 'PNG, JPG, WEBP up to 10MB'}
              </p>
            </label>
          </div>

          {selectedFile && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleUploadToImgBB}
                disabled={isUploading}
                className="flex-1 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isUploading ? 'Uploading to ImgBB...' : 'Confirm & Upload to ImgBB'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium rounded-lg cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* Status Messages */}
      {uploadError && (
        <div className="mt-2.5 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 leading-relaxed">
          {uploadError}
        </div>
      )}

      {uploadSuccess && (
        <div className="mt-2.5 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 font-medium">
          {uploadSuccess}
        </div>
      )}

      {/* Preview and actions */}
      {value && (
        <div className="mt-4 pt-3 border-t border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0 relative">
              <img
                src={value}
                alt="Selected preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-stone-800 truncate">
                Active Image
              </p>
              <p className="text-[11px] text-stone-500 truncate mt-0.5" title={value}>
                {value}
              </p>
              <div className="flex gap-3 mt-1.5">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer"
                >
                  {copied ? 'Copied!' : 'Copy URL'}
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
                >
                  Remove Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
