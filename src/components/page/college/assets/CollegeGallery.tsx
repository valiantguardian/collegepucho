"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Gallery } from "@/api/@types/college-info";
import { FaCamera, FaTimes, FaChevronLeft, FaChevronRight, FaExpand, FaCompress } from "react-icons/fa";

interface CollegeGalleryProps {
  gallery: Gallery[];
}

const CollegeGallery: React.FC<CollegeGalleryProps> = ({ gallery }) => {
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<Gallery | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const filteredGallery = useMemo(() => {
    if (selectedTag === "all") {
      return gallery;
    }
    return gallery.filter(item => item.tag === selectedTag);
  }, [selectedTag, gallery]);

  const getUniqueTags = () => {
    const tags = gallery.map(item => item.tag);
    return ["all", ...Array.from(new Set(tags))];
  };

  const getTagDisplayName = (tag: string) => {
    if (tag === "all") return "All";
    return tag.charAt(0).toUpperCase() + tag.slice(1).replace(/_/g, " ");
  };

  const openImageViewer = (image: Gallery, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
    setIsFullscreen(false);
  };

  const closeImageViewer = () => {
    setSelectedImage(null);
    setCurrentImageIndex(0);
    setIsFullscreen(false);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : filteredGallery.length - 1;
      setCurrentImageIndex(newIndex);
      setSelectedImage(filteredGallery[newIndex]);
    } else {
      const newIndex = currentImageIndex < filteredGallery.length - 1 ? currentImageIndex + 1 : 0;
      setCurrentImageIndex(newIndex);
      setSelectedImage(filteredGallery[newIndex]);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      
      switch (e.key) {
        case 'Escape':
          closeImageViewer();
          break;
        case 'ArrowLeft':
          navigateImage('prev');
          break;
        case 'ArrowRight':
          navigateImage('next');
          break;
        case 'f':
          toggleFullscreen();
          break;
      }
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedImage, currentImageIndex]);

  if (!gallery.length) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
            <FaCamera className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Gallery Images</h3>
          <p className="text-gray-500">Gallery images are not available for this college.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Campus Gallery</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our campus through carefully curated photographs showcasing facilities, infrastructure, and student life.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {getUniqueTags().map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedTag === tag
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {getTagDisplayName(tag)}
          </button>
        ))}
      </div>

      {/* Masonry Grid Gallery - No more blank spaces */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {filteredGallery.map((item, index) => (
          <div
            key={item.media_URL}
            className="group relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
            onClick={() => openImageViewer(item, index)}
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={item.media_URL}
                alt={item.alt_text}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
              
              {/* Subtle overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300">
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="inline-block px-2 py-1 bg-white/90 text-gray-800 text-xs font-medium rounded">
                    {getTagDisplayName(item.tag)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gallery Info */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          {filteredGallery.length} of {gallery.length} images • Click any image to view full size
        </p>
      </div>

      {/* Enhanced Image Viewer Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center">
          <div className={`relative w-full h-full ${isFullscreen ? 'p-0' : 'p-4'}`}>
            {/* Top Control Bar */}
            <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={closeImageViewer}
                    className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                  <div className="text-white">
                    <span className="text-sm font-medium">{getTagDisplayName(selectedImage.tag)}</span>
                    <span className="text-xs text-gray-300 ml-2">{currentImageIndex + 1} of {filteredGallery.length}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
                    title={isFullscreen ? "Exit fullscreen (F)" : "Enter fullscreen (F)"}
                  >
                    {isFullscreen ? <FaCompress className="w-4 h-4" /> : <FaExpand className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => navigateImage('prev')}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all duration-200 backdrop-blur-sm group"
              title="Previous image (←)"
            >
              <FaChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={() => navigateImage('next')}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all duration-200 backdrop-blur-sm group"
              title="Next image (→)"
            >
              <FaChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            {/* Main Image Container */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative w-full h-full max-w-7xl max-h-full">
                <Image
                  src={selectedImage.media_URL}
                  alt={selectedImage.alt_text}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            </div>

            {/* Bottom Info Bar */}
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="text-center">
                <p className="text-white text-sm font-medium mb-1">{getTagDisplayName(selectedImage.tag)}</p>
                <p className="text-gray-300 text-xs">
                  Use arrow keys to navigate • Press F for fullscreen • Press ESC to close
                </p>
              </div>
            </div>

            {/* Thumbnail Preview Strip */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
              <div className="flex space-x-2 bg-black/50 backdrop-blur-sm rounded-lg p-2">
                {filteredGallery.slice(Math.max(0, currentImageIndex - 2), currentImageIndex + 3).map((item, idx) => {
                  const actualIndex = Math.max(0, currentImageIndex - 2) + idx;
                  const isActive = actualIndex === currentImageIndex;
                  
                  return (
                    <div
                      key={item.media_URL}
                      className={`relative w-12 h-12 rounded overflow-hidden cursor-pointer transition-all duration-200 ${
                        isActive ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                      onClick={() => {
                        setCurrentImageIndex(actualIndex);
                        setSelectedImage(item);
                      }}
                    >
                      <Image
                        src={item.media_URL}
                        alt={item.alt_text}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CollegeGallery;
