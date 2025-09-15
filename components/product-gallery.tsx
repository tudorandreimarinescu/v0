"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, Download, ZoomIn } from "lucide-react"

interface Product {
  id: string
  slug: string
  brand: string
  image_url: string
  translations?: {
    name: string
    locale: string
  }[]
}

interface ProductGalleryProps {
  product: Product
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const translation = product.translations?.find((t) => t.locale === "en") || product.translations?.[0]
  const productName = translation?.name || `${product.brand} Product`

  // Mock additional images - in a real app, these would come from the database
  const images = [
    product.image_url || "/shader.jpg",
    "/shader-preview-1.jpg",
    "/shader-preview-2.jpg",
    "/shader-code.jpg",
  ]

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg overflow-hidden relative group">
        <img
          src={images[selectedImage] || "/placeholder.svg"}
          alt={`${productName} - Image ${selectedImage + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button size="sm" className="bg-white/90 text-black hover:bg-white">
            <ZoomIn className="h-4 w-4 mr-2" />
            Zoom
          </Button>
        </div>
      </div>

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`aspect-video rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              selectedImage === index
                ? "border-primary ring-2 ring-primary/50"
                : "border-white/20 hover:border-white/40"
            }`}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={`${productName} thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-white/20 text-white/80 bg-transparent hover:bg-white/10"
        >
          <Eye className="h-4 w-4 mr-2" />
          Live Preview
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-white/20 text-white/80 bg-transparent hover:bg-white/10"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Demo
        </Button>
      </div>
    </div>
  )
}
