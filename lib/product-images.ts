export interface ProductImageSet {
  main: string
  gallery: string[]
  alt: string
}

// High-quality mock images for different product categories
const CATEGORY_IMAGE_MAPPING: Record<string, ProductImageSet[]> = {
  // Shader and Graphics Tools
  shaders: [
    {
      main: "/modern-shader-editor-interface-with-glowing-effect.jpg",
      gallery: [
        "/modern-shader-editor-interface-with-glowing-effect.jpg",
        "/shader-code-editor-with-syntax-highlighting.jpg",
        "/3d-preview-window-with-shader-effects.jpg",
        "/shader-node-graph-editor-interface.jpg",
      ],
      alt: "Professional shader development tool interface",
    },
    {
      main: "/particle-system-editor-with-colorful-effects.jpg",
      gallery: [
        "/particle-system-editor-with-colorful-effects.jpg",
        "/particle-timeline-and-keyframe-editor.jpg",
        "/3d-particle-preview-with-fire-effects.jpg",
        "/particle-properties-panel-interface.jpg",
      ],
      alt: "Advanced particle system creation tool",
    },
    {
      main: "/material-editor-with-pbr-textures-and-nodes.jpg",
      gallery: [
        "/material-editor-with-pbr-textures-and-nodes.jpg",
        "/texture-painting-interface-with-brushes.jpg",
        "/3d-material-preview-sphere-with-lighting.jpg",
        "/material-library-browser-interface.jpg",
      ],
      alt: "Professional material and texture editor",
    },
  ],

  // 3D Graphics and Modeling
  "3d-graphics": [
    {
      main: "/3d-modeling-software-interface-with-mesh-editing.jpg",
      gallery: [
        "/3d-modeling-software-interface-with-mesh-editing.jpg",
        "/3d-sculpting-tools-with-detailed-model.jpg",
        "/3d-animation-timeline-and-rigging-tools.jpg",
        "/placeholder.svg?height=600&width=800",
      ],
      alt: "Professional 3D modeling and animation software",
    },
    {
      main: "/placeholder.svg?height=600&width=800",
      gallery: [
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
      ],
      alt: "Professional CAD and engineering software",
    },
  ],

  // Development Tools
  development: [
    {
      main: "/placeholder.svg?height=600&width=800",
      gallery: [
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
      ],
      alt: "Advanced integrated development environment",
    },
    {
      main: "/placeholder.svg?height=600&width=800",
      gallery: [
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
      ],
      alt: "Professional API development and testing tool",
    },
  ],

  // Design Tools
  design: [
    {
      main: "/placeholder.svg?height=600&width=800",
      gallery: [
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
      ],
      alt: "Professional vector graphics design software",
    },
    {
      main: "/placeholder.svg?height=600&width=800",
      gallery: [
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
      ],
      alt: "Modern UI/UX design and prototyping tool",
    },
  ],

  // Default fallback for unknown categories
  default: [
    {
      main: "/placeholder.svg?height=600&width=800",
      gallery: [
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
      ],
      alt: "Professional software application interface",
    },
  ],
}

// Function to get images for a product based on its category and name
export function getProductImages(product: {
  id: string
  name: string
  category_name?: string
  image_url?: string | null
}): ProductImageSet {
  // If product already has an image_url, use it as the main image
  if (product.image_url) {
    return {
      main: product.image_url,
      gallery: [
        product.image_url,
        `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(product.name + " interface view")}`,
        `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(product.name + " features overview")}`,
        `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(product.name + " settings panel")}`,
      ],
      alt: product.name,
    }
  }

  // Determine category key
  const categoryKey = getCategoryKey(product.category_name || "")
  const categoryImages = CATEGORY_IMAGE_MAPPING[categoryKey] || CATEGORY_IMAGE_MAPPING["default"]

  // Use product ID to consistently select the same image set for the same product
  const imageIndex = Number.parseInt(product.id.slice(-1), 16) % categoryImages.length
  const selectedImageSet = categoryImages[imageIndex]

  // Customize the alt text with the product name
  return {
    ...selectedImageSet,
    alt: `${product.name} - ${selectedImageSet.alt}`,
  }
}

// Helper function to map category names to image category keys
function getCategoryKey(categoryName: string): string {
  const lowerCategory = categoryName.toLowerCase()

  if (lowerCategory.includes("shader") || lowerCategory.includes("graphics") || lowerCategory.includes("rendering")) {
    return "shaders"
  }
  if (lowerCategory.includes("3d") || lowerCategory.includes("modeling") || lowerCategory.includes("animation")) {
    return "3d-graphics"
  }
  if (
    lowerCategory.includes("development") ||
    lowerCategory.includes("code") ||
    lowerCategory.includes("programming")
  ) {
    return "development"
  }
  if (lowerCategory.includes("design") || lowerCategory.includes("ui") || lowerCategory.includes("ux")) {
    return "design"
  }

  return "default"
}

// Function to get a smaller image for grid/card views
export function getProductThumbnail(product: {
  id: string
  name: string
  category_name?: string
  image_url?: string | null
}): string {
  const images = getProductImages(product)
  // Convert main image to thumbnail size
  return images.main.replace("height=600&width=800", "height=300&width=400")
}

// Function to get category-specific placeholder image
export function getCategoryImage(categoryName: string): string {
  const categoryKey = getCategoryKey(categoryName)
  const categoryImages = CATEGORY_IMAGE_MAPPING[categoryKey] || CATEGORY_IMAGE_MAPPING["default"]
  return categoryImages[0].main.replace("height=600&width=800", "height=400&width=600")
}
