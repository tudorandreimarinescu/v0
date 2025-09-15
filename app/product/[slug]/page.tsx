import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import ProductGallery from "@/components/product-gallery"
import ProductInfo from "@/components/product-info"
import ProductReviews from "@/components/product-reviews"
import RelatedProducts from "@/components/related-products"
import { getProductBySlug, getProducts } from "@/lib/supabase/products"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { product } = await getProductBySlug(params.slug)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  const translation = product.translations?.find((t) => t.locale === "en") || product.translations?.[0]
  const productName = translation?.name || `${product.brand} Product`
  const productDesc = translation?.short_desc || "Premium shader product"

  return {
    title: `${productName} - ShaderStore`,
    description: productDesc,
    openGraph: {
      title: productName,
      description: productDesc,
      images: [product.image_url || "/placeholder.svg"],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { product, error } = await getProductBySlug(params.slug)

  if (error || !product) {
    notFound()
  }

  // Get related products from the same category
  const { products: relatedProducts } = await getProducts(
    { category: product.category?.slug },
    { field: "created_at", direction: "desc" },
    1,
    4,
  )

  // Filter out current product from related products
  const filteredRelatedProducts = relatedProducts.filter((p) => p.id !== product.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <SiteHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Gallery */}
          <Suspense fallback={<div className="animate-pulse bg-white/5 rounded-lg aspect-video" />}>
            <ProductGallery product={product} />
          </Suspense>

          {/* Product Info */}
          <Suspense fallback={<div className="animate-pulse bg-white/5 rounded-lg h-96" />}>
            <ProductInfo product={product} />
          </Suspense>
        </div>

        {/* Product Reviews */}
        <div className="mb-16">
          <Suspense fallback={<div className="animate-pulse bg-white/5 rounded-lg h-64" />}>
            <ProductReviews productId={product.id} />
          </Suspense>
        </div>

        {/* Related Products */}
        {filteredRelatedProducts.length > 0 && (
          <div>
            <Suspense fallback={<div className="animate-pulse bg-white/5 rounded-lg h-64" />}>
              <RelatedProducts products={filteredRelatedProducts} />
            </Suspense>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
