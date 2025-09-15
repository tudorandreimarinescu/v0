"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Plus } from "lucide-react"

export function ProductManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Product Management
        </CardTitle>
        <CardDescription>Manage your product catalog</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No products yet</h3>
          <p className="text-muted-foreground mb-4">Start by adding your first product to the catalog</p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
