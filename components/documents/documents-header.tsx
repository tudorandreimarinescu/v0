"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Upload, Filter, X } from "lucide-react"
import Link from "next/link"

interface DocumentsHeaderProps {
  onSearch?: (query: string) => void
  onFilterToggle?: () => void
}

export function DocumentsHeader({ onSearch, onFilterToggle }: DocumentsHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    if (onSearch) {
      // Simple debouncing - in production, use a proper debounce hook
      setTimeout(() => onSearch(value), 300)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    if (onSearch) {
      onSearch("")
    }
  }

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-foreground">Documente</h1>
            <div className="relative w-96 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Caută documente..."
                className="pl-10 pr-10"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={clearSearch}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={onFilterToggle}>
              <Filter className="h-4 w-4 mr-2" />
              Filtrează
            </Button>
            <Button asChild>
              <Link href="/documents/upload">
                <Upload className="h-4 w-4 mr-2" />
                Încarcă Document
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
