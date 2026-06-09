"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";

interface PropertyGalleryProps {
  images: string[];
}

export default function PropertyGallery({ images }: PropertyGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleNext = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setActiveIdx((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard Navigation for Lightbox & Carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === "ArrowRight") handleNext();
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "Escape") setIsLightboxOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, handleNext, handlePrev]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-zinc-900 rounded-2xl border border-white/5 flex items-center justify-center text-gray-500">
        No images available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Active Main Image Carousel */}
      <div className="relative h-96 md:h-[500px] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 group select-none">
        {/* Main Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[activeIdx]}
          alt={`Property image ${activeIdx + 1}`}
          className="w-full h-full object-cover transition-all duration-500"
        />

        {/* Dark Vignette Overlay on Hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Maximize Button Overlay */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 hover:bg-black/80 text-white p-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer select-none active:scale-95"
          title="Fullscreen view"
        >
          <Maximize2 size={16} />
        </button>

        {/* Pagination Counter Badge */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 text-white px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider select-none">
          {activeIdx + 1} / {images.length}
        </div>

        {/* Left Arrow Navigation Overlay */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/10 p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer select-none active:scale-90"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Right Arrow Navigation Overlay */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/10 p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer select-none active:scale-90"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Floating Glassmorphic Thumbnail Dock */}
      {images.length > 1 && (
        <div className="liquid-glass border border-white/10 p-3 rounded-2xl flex flex-wrap items-center justify-center gap-3 w-fit mx-auto mt-2">
          {images.map((url, idx) => (
            <button
              key={url}
              onClick={() => setActiveIdx(idx)}
              className={`relative h-14 w-20 rounded-lg overflow-hidden border transition-all active:scale-95 duration-200 cursor-pointer ${
                activeIdx === idx
                  ? "border-white scale-102 ring-2 ring-white/20"
                  : "border-white/10 opacity-50 hover:opacity-100 hover:scale-102"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Thumbnail preview ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center select-none animate-in fade-in duration-300">
          {/* Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition cursor-pointer select-none active:scale-95 border border-white/10"
            title="Close"
          >
            <X size={20} />
          </button>

          {/* Lightbox Main Image Container */}
          <div className="relative max-w-5xl w-full h-[70vh] px-4 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[activeIdx]}
              alt={`Fullscreen property image ${activeIdx + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />

            {/* Navigation inside Lightbox */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white border border-white/10 p-4 rounded-full transition cursor-pointer select-none active:scale-90"
                >
                  <ChevronLeft size={24} />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white border border-white/10 p-4 rounded-full transition cursor-pointer select-none active:scale-90"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {/* Lightbox Footer Pagination & Thumbnail bar */}
          <div className="flex flex-col items-center gap-3 mt-6">
            <span className="text-gray-400 text-sm font-light">
              Image {activeIdx + 1} of {images.length}
            </span>
            <div className="flex items-center gap-2 max-w-md overflow-x-auto py-2 px-4 bg-white/5 border border-white/10 rounded-xl">
              {images.map((url, idx) => (
                <button
                  key={`lightbox-${url}`}
                  onClick={() => setActiveIdx(idx)}
                  className={`relative h-10 w-16 rounded-md overflow-hidden border transition shrink-0 cursor-pointer ${
                    activeIdx === idx
                      ? "border-white scale-102"
                      : "border-white/5 opacity-40 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Lightbox thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
