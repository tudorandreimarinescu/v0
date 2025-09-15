"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"
import type { Category } from "@/lib/supabase/products"
import { formatCurrency } from "@/lib/currency"

interface ShopFiltersProps {
  categories: Category[]
  currentFilters: {
    categoryId?: string
    minPrice?: number
    maxPrice?: number
    searchTerm?: string
    sortBy?: string
    sortOrder?: string
  }
}

export default function ShopFilters({ categories, currentFilters }: ShopFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(currentFilters.searchTerm || "")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    currentFilters.categoryId ? [currentFilters.categoryId] : [],
  )
  const [priceRange, setPriceRange] = useState([currentFilters.minPrice || 0, currentFilters.maxPrice || 100])
  const [sortBy, setSortBy] = useState(currentFilters.sortBy || "created_at")
  const [sortOrder, setSortOrder] = useState(currentFilters.sortOrder || "DESC")

  const updateFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    // Update search term
    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim())
    } else {
      params.delete("search")
    }

    // Update categories
    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories[0]) // For now, support single category
    } else {
      params.delete("category")
    }

    // Update price range
    if (priceRange[0] > 0) {
      params.set("min_price", priceRange[0].toString())
    } else {
      params.delete("min_price")
    }

    if (priceRange[1] < 100) {
      params.set("max_price", priceRange[1].toString())
    } else {
      params.delete("max_price")
    }

    // Update sorting
    params.set("sort", sortBy)
    params.set("order", sortOrder)

    // Reset to first page when filters change
    params.delete("page")

    router.push(`/shop?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategories([])
    setPriceRange([0, 100])
    setSortBy("created_at")
    setSortOrder("DESC")
    router.push("/shop")
  }

  const hasActiveFilters = searchTerm || selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 100

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Products
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search shaders, templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && updateFilters()}
              className="flex-1"
            />
            <Button onClick={updateFilters} size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sort */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Sort By</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            value={`${sortBy}-${sortOrder}`}
            onValueChange={(value) => {
              const [newSortBy, newSortOrder] = value.split("-")
              setSortBy(newSortBy)
              setSortOrder(newSortOrder)
              setTimeout(updateFilters, 0)
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at-DESC">Newest First</SelectItem>
              <SelectItem value="created_at-ASC">Oldest First</SelectItem>
              <SelectItem value="price-ASC">Price: Low to High</SelectItem>
              <SelectItem value="price-DESC">Price: High to Low</SelectItem>
              <SelectItem value="name-ASC">Name: A to Z</SelectItem>
              <SelectItem value="name-DESC">Name: Z to A</SelectItem>
              <SelectItem value="rating-DESC">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedCategories([category.id]) // Single selection for now
                  } else {
                    setSelectedCategories([])
                  }
                  setTimeout(updateFilters, 0)
                }}
              />
              <Label htmlFor={category.id} className="text-sm font-normal cursor-pointer flex-1">
                {category.name}
                <span className="text-muted-foreground ml-1">({category.product_count})</span>
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              onValueCommit={updateFilters}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatCurrency(priceRange[0])}</span>
            <span>{formatCurrency(priceRange[1])}</span>
          </div>
        </CardContent>
      </Card>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  )
}
