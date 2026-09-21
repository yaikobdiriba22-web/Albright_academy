import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Tag,
  Calendar,
} from 'lucide-react';
import { api } from '../lib/api.ts';
import { GalleryCategory, GalleryImage } from '../types/index.ts';
import { SectionHeader } from '../components/ui/SectionHeader.tsx';

export const GalleryView: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const categories: GalleryCategory[] = [
    'All',
    'School',
    'Classrooms',
    'Students',
    'Events',
    'Sports',
    'Activities',
  ];

  const fetchImages = async (cat: GalleryCategory) => {
    setIsLoading(true);
    try {
      const data = await api.getGallery(cat);
      setImages(data);
    } catch (err) {
      console.error('Failed to load gallery images', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(selectedCategory);
  }, [selectedCategory]);

  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const nextImage = () => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((prev) => ((prev! + 1) % images.length));
  };

  const prevImage = () => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((prev) => (prev! === 0 ? images.length - 1 : prev! - 1));
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, images]);

  const currentImage = activeLightboxIndex !== null ? images[activeLightboxIndex] : null;

  return (
    <div className="py-12 bg-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-[#0f2444] text-white py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-4">
            Visual Journey
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-white mb-4">
            Campus Life & Activities Gallery
          </h1>
          <p className="text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Glimpse daily moments of discovery, sportsmanship, artistic expression, and scholarly
            growth at Albright Academy.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-cat-${cat.toLowerCase()}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0f2444] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-72 bg-slate-200 rounded-2xl" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200">
            <p className="text-slate-500 font-medium">No images found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img, index) => (
              <div
                key={img.id}
                onClick={() => openLightbox(index)}
                className="group relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer h-72"
              >
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a182e]/90 via-[#0a182e]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5 text-white">
                  <div className="flex justify-end">
                    <span className="p-2 rounded-lg bg-black/40 text-white backdrop-blur-xs">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 text-2xs font-bold uppercase mb-1.5">
                      {img.category}
                    </span>
                    <h3 className="text-base font-bold text-white font-display line-clamp-1">
                      {img.title}
                    </h3>
                    {img.description && (
                      <p className="text-xs text-slate-200 line-clamp-2 mt-1">
                        {img.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {currentImage && (
        <div
          id="gallery-lightbox"
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev button */}
          <button
            onClick={prevImage}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next button */}
          <button
            onClick={nextImage}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image & Caption Container */}
          <div className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center justify-center">
            <img
              src={currentImage.imageUrl}
              alt={currentImage.title}
              className="max-h-[65vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
            />
            <div className="mt-4 text-center text-white max-w-2xl px-4">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-xs font-bold uppercase mb-2">
                {currentImage.category}
              </span>
              <h3 className="text-xl font-bold font-display text-white">{currentImage.title}</h3>
              {currentImage.description && (
                <p className="text-sm text-slate-300 mt-1">{currentImage.description}</p>
              )}
              <div className="text-2xs text-slate-400 mt-2">
                Image {activeLightboxIndex! + 1} of {images.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
