import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Upload, Palette, Share2, Code, Sparkles } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Quick Actions</CardTitle>
        <CardDescription className="text-white/60">Common tasks for shader development</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button asChild className="w-full justify-start bg-transparent text-white hover:bg-white/10" variant="outline">
          <Link href="/projects/new">
            <Plus className="h-4 w-4 mr-2" />
            Create New Shader
          </Link>
        </Button>

        <Button asChild className="w-full justify-start bg-transparent text-white hover:bg-white/10" variant="outline">
          <Link href="/projects/import">
            <Upload className="h-4 w-4 mr-2" />
            Import Shader Code
          </Link>
        </Button>

        <Button asChild className="w-full justify-start bg-transparent text-white hover:bg-white/10" variant="outline">
          <Link href="/gallery">
            <Palette className="h-4 w-4 mr-2" />
            Browse Gallery
          </Link>
        </Button>

        <Button asChild className="w-full justify-start bg-transparent text-white hover:bg-white/10" variant="outline">
          <Link href="/projects/templates">
            <Sparkles className="h-4 w-4 mr-2" />
            Shader Templates
          </Link>
        </Button>

        <Button asChild className="w-full justify-start bg-transparent text-white hover:bg-white/10" variant="outline">
          <Link href="/docs">
            <Code className="h-4 w-4 mr-2" />
            Documentation
          </Link>
        </Button>

        <Button asChild className="w-full justify-start bg-transparent text-white hover:bg-white/10" variant="outline">
          <Link href="/community">
            <Share2 className="h-4 w-4 mr-2" />
            Community
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
