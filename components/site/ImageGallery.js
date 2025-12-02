'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

export default function ImageGallery({ images = [] }) {
  const [selectedImage, setSelectedImage] = useState(null)

  if (!images || images.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg border"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image.url || image}
              alt={image.title || `Galeri görseli ${index + 1}`}
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </div>
        ))}
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {selectedImage && (
            <div className="relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
              <img
                src={selectedImage.url || selectedImage}
                alt={selectedImage.title || 'Galeri görseli'}
                className="w-full h-auto"
              />
              {selectedImage.title && (
                <div className="p-4 bg-muted">
                  <h3 className="font-semibold">{selectedImage.title}</h3>
                  {selectedImage.description && (
                    <p className="text-sm text-muted-foreground mt-1">{selectedImage.description}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
