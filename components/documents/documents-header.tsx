"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Upload, Filter } from "lucide-react"
import Link from "next/link"

export function DocumentsHeader() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-foreground">Documente</h1>
            <div className="relative w-96 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Caută documente..." className="pl-10" />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
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
