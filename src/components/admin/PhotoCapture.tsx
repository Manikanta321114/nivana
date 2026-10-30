import React, { useRef, useState, useCallback } from 'react'
import { Camera, Upload, X, Image, RotateCcw } from 'lucide-react'

export interface CapturedPhoto {
  id: string
  url: string      // object URL for preview
  file: File
  source: 'camera' | 'gallery'
}

interface PhotoCaptureProps {
  photos: CapturedPhoto[]
  onChange: (photos: CapturedPhoto[]) => void
  maxPhotos?: number
}

export const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  photos,
  onChange,
  maxPhotos = 10,
}) => {
  const cameraInputRef  = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging]   = useState(false)

  // ── helpers ──────────────────────────────────────────────────────
  const addFiles = useCallback(
    (files: FileList | File[], source: 'camera' | 'gallery') => {
      const arr = Array.from(files).filter(f => f.type.startsWith('image/'))
      const remaining = maxPhotos - photos.length
      const toAdd = arr.slice(0, remaining).map(file => ({
        id: `photo-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        url: URL.createObjectURL(file),
        file,
        source,
      }))
      onChange([...photos, ...toAdd])
    },
    [photos, onChange, maxPhotos],
  )

  const removePhoto = (id: string) => {
    const next = photos.filter(p => p.id !== id)
    // revoke old object URLs to avoid memory leaks
    const removed = photos.find(p => p.id === id)
    if (removed) URL.revokeObjectURL(removed.url)
    onChange(next)
  }

  // ── drag-and-drop ────────────────────────────────────────────────
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files, 'gallery')
  }

  const full = photos.length >= maxPhotos

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        {/* Camera capture — uses device camera directly */}
        <button
          type="button"
          disabled={full}
          onClick={() => cameraInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          <Camera size={16} />
          Take Photo
        </button>

        {/* Gallery / file picker */}
        <button
          type="button"
          disabled={full}
          onClick={() => galleryInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 text-sm font-semibold hover:bg-stone-50 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          <Upload size={16} />
          Upload from Gallery
        </button>

        {photos.length > 0 && (
          <button
            type="button"
            onClick={() => {
              photos.forEach(p => URL.revokeObjectURL(p.url))
              onChange([])
            }}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-red-600 text-sm hover:bg-red-50 transition-colors ml-auto"
          >
            <RotateCcw size={14} />
            Clear all
          </button>
        )}
      </div>

      {/* Hidden inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"   /* rear camera on mobile */
        multiple
        className="hidden"
        onChange={e => { if (e.target.files) { addFiles(e.target.files, 'camera'); e.target.value = '' } }}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => { if (e.target.files) { addFiles(e.target.files, 'gallery'); e.target.value = '' } }}
      />

      {/* Drop zone (when no photos yet) */}
      {photos.length === 0 && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl py-10 transition-colors cursor-pointer
            ${dragging ? 'border-primary-400 bg-primary-50' : 'border-stone-200 bg-stone-50 hover:border-primary-300 hover:bg-primary-50/40'}`}
          onClick={() => galleryInputRef.current?.click()}
        >
          <div className="w-12 h-12 rounded-xl bg-white border border-stone-200 flex items-center justify-center shadow-sm">
            <Image size={22} className="text-stone-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-stone-600">Drag photos here or click to upload</p>
            <p className="text-xs text-stone-400 mt-1">JPG, PNG, WEBP — up to {maxPhotos} photos</p>
          </div>
        </div>
      )}

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {photos.map((photo, idx) => (
            <div key={photo.id} className="relative group rounded-xl overflow-hidden aspect-square bg-stone-100 border border-stone-200 shadow-sm">
              <img
                src={photo.url}
                alt={`Property photo ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Index badge */}
              <div className="absolute top-1.5 left-1.5 bg-black/50 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold backdrop-blur-sm">
                {idx + 1}
              </div>
              {/* Source badge */}
              <div className="absolute bottom-1.5 left-1.5">
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                  photo.source === 'camera'
                    ? 'bg-primary-600 text-white'
                    : 'bg-stone-700/70 text-white'
                }`}>
                  {photo.source === 'camera' ? '📷' : '🖼️'}
                </span>
              </div>
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removePhoto(photo.id)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow"
                aria-label="Remove photo"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {/* Add more slot */}
          {!full && (
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-stone-200 hover:border-primary-400 hover:bg-primary-50/40 flex flex-col items-center justify-center gap-1 text-stone-400 hover:text-primary-600 transition-all"
            >
              <Upload size={18} />
              <span className="text-xs font-medium">Add more</span>
            </button>
          )}
        </div>
      )}

      {/* Count */}
      <p className="text-xs text-stone-400">
        {photos.length} / {maxPhotos} photos added
        {photos.length >= maxPhotos && (
          <span className="ml-2 text-amber-600 font-medium">Maximum reached</span>
        )}
      </p>
    </div>
  )
}
