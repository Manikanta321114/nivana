import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import type { PublicPropertyImage } from '../../types'
import { cn } from '../../utils'

interface PropertyGalleryProps {
  images: PublicPropertyImage[]
  title: string
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, title }) => {
  const [activeIndex, setActiveIndex]   = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (!images.length) {
    return (
      <div className="w-full h-72 bg-stone-100 rounded-3xl flex items-center justify-center text-stone-400">
        <div className="text-center">
          <span className="text-4xl block mb-2">🏠</span>
          <p className="text-sm">No photos available</p>
        </div>
      </div>
    )
  }

  const prev = () => setActiveIndex(i => (i > 0 ? i - 1 : images.length - 1))
  const next = () => setActiveIndex(i => (i < images.length - 1 ? i + 1 : 0))

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft')  prev()
    if (e.key === 'ArrowRight') next()
    if (e.key === 'Escape')     setLightboxOpen(false)
  }

  return (
    <>
      {/* Main gallery */}
      <div className="space-y-3">
        {/* Hero image */}
        <div
          className="relative rounded-3xl overflow-hidden bg-stone-200 cursor-zoom-in"
          style={{ aspectRatio: '16/9' }}
          onClick={() => setLightboxOpen(true)}
          role="button"
          tabIndex={0}
          aria-label={`View full-size photo ${activeIndex + 1} of ${images.length}`}
          onKeyDown={handleKeyDown}
        >
          <img
            src={images[activeIndex].file_path}
            alt={images[activeIndex].caption ?? `${title} — photo ${activeIndex + 1}`}
            className="w-full h-full object-cover transition-opacity duration-300"
            loading="eager"
          />
          <div className="absolute inset-0 flex items-center justify-between px-3">
            {images.length > 1 && (
              <>
                <button
                  onClick={e => { e.stopPropagation(); prev() }}
                  aria-label="Previous photo"
                  className="w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); next() }}
                  aria-label="Next photo"
                  className="w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
            <div className="bg-black/50 text-white text-xs rounded-full px-2.5 py-1 backdrop-blur-sm">
              {activeIndex + 1} / {images.length}
            </div>
            <div className="bg-black/50 text-white rounded-full p-1.5 backdrop-blur-sm">
              <ZoomIn size={13} />
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActiveIndex(i)}
                aria-label={`View photo ${i + 1}`}
                aria-current={i === activeIndex ? 'true' : undefined}
                className={cn(
                  'flex-shrink-0 w-16 h-12 rounded-xl overflow-hidden border-2 transition-all duration-200',
                  i === activeIndex
                    ? 'border-primary-700 opacity-100 ring-2 ring-primary-300'
                    : 'border-transparent opacity-60 hover:opacity-80',
                )}
              >
                <img
                  src={img.file_path}
                  alt={img.caption ?? `Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Property photo lightbox"
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Close lightbox"
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors z-10"
          >
            <X size={24} />
          </button>

          <button
            onClick={prev}
            aria-label="Previous photo"
            className="absolute left-4 text-white/70 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <ChevronLeft size={32} />
          </button>

          <img
            src={images[activeIndex].file_path}
            alt={images[activeIndex].caption ?? `${title} — photo ${activeIndex + 1}`}
            className="max-h-[85vh] max-w-full object-contain rounded-2xl"
          />

          <button
            onClick={next}
            aria-label="Next photo"
            className="absolute right-4 text-white/70 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <ChevronRight size={32} />
          </button>

          <div className="absolute bottom-4 text-white/60 text-sm">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}
