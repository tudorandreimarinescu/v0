"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Search, X } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
}

interface ShopFiltersProps {
  categories: Category[]
  currentFilters: {
    category?: string
    search?: string
    minPrice?: number
    maxPrice?: number
    brand?: string
    material?: string
  }
  currentSort: {
    field: string
    direction: string
  }
}

export default function ShopFilters({ categories, currentFilters, currentSort }: ShopFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(currentFilters.search || "")
  const [priceRange, setPriceRange] = useState([currentFilters.minPrice || 0, currentFilters.maxPrice || 100])

  const updateFilters = (newFilters: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    // Reset to page 1 when filters change
    params.delete("page")

    router.push(`/shop?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/shop")
    setSearchTerm("")
    setPriceRange([0, 100])
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ search: searchTerm })
  }

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values)
    updateFilters({
      minPrice: values[0] > 0 ? values[0].toString() : undefined,
      maxPrice: values[1] < 100 ? values[1].toString() : undefined,
    })
  }

  const activeFiltersCount = Object.values(currentFilters).filter(Boolean).length

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search shaders, templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <Button type="submit" size="sm" className="bg-white text-black hover:bg-white/90">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Sort */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-white">Sort By</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={`${currentSort.field}-${currentSort.direction}`}
            onValueChange={(value) => updateFilters({ sort: value })}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at-desc">Newest First</SelectItem>
              <SelectItem value="created_at-asc">Oldest First</SelectItem>
              <SelectItem value="base_price-asc">Price: Low to High</SelectItem>
              <SelectItem value="base_price-desc">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
              <SelectItem value="name-desc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-white">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="all-categories"
              checked={!currentFilters.category}
              onCheckedChange={() => updateFilters({ category: undefined })}
            />
            <Label htmlFor="all-categories" className="text-white/80">
              All Categories
            </Label>
          </div>
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.slug}
                checked={currentFilters.category === category.slug}
                onCheckedChange={(checked) => updateFilters({ category: checked ? category.slug : undefined })}
              />
              <Label htmlFor={category.slug} className="text-white/80">
                {category.name}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-white">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-white/80">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button
          onClick={clearFilters}
          variant="outline"
          className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
        >
          <X className="h-4 w-4 mr-2" />
          Clear Filters ({activeFiltersCount})
        </Button>
      )}
    </div>
  )
}
