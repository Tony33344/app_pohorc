import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="aspect-[3/2] cursor-pointer overflow-hidden rounded-lg"
            onClick={() => setSelectedImage(index)}
          >
            <img
              src={image}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          
          <button
            className="absolute left-4 text-white hover:text-gray-300"
            onClick={() => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev! - 1))}
          >
            <ChevronLeft size={32} />
          </button>
          
          <img
            src={images[selectedImage]}
            alt={`Gallery image ${selectedImage + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
          
          <button
            className="absolute right-4 text-white hover:text-gray-300"
            onClick={() => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev! + 1))}
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </>
  );
}
