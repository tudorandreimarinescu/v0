"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { PriceDisplay } from "@/components/price-display"
import { useTranslations } from "next-intl"

interface ProductCardProps {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  baseCurrency?: string
}

export function ProductCard({ id, name, description, price, image, category, baseCurrency = "EUR" }: ProductCardProps) {
  const t = useTranslations("shop")

  return (
    <Card className="group overflow-hidden border-white/10 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all duration-300">
      <div className="aspect-square overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          width={400}
          height={400}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60 uppercase tracking-wide">{category}</span>
          </div>
          <h3 className="font-semibold text-white group-hover:text-white/90 transition-colors">{name}</h3>
          <p className="text-sm text-white/70 line-clamp-2">{description}</p>
          <PriceDisplay price={price} baseCurrency={baseCurrency} className="text-lg text-white" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 space-y-2">
        <Button className="w-full bg-white text-black hover:bg-white/90" size="sm">
          {t("addToCart")}
        </Button>
        <Link href={`/product/${id}`} className="block">
          <Button variant="ghost" className="w-full text-white/80 hover:text-white hover:bg-white/10" size="sm">
            {t("quickView")}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
