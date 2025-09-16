"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const AGE_VERIFICATION_KEY = "kynky_age_verified"

export default function AgeVerificationModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user has already verified their age
    const hasVerified = localStorage.getItem(AGE_VERIFICATION_KEY)
    if (!hasVerified) {
      setIsOpen(true)
    }
    setIsLoading(false)
  }, [])

  const handleVerify = (isAdult: boolean) => {
    if (isAdult) {
      localStorage.setItem(AGE_VERIFICATION_KEY, "true")
      setIsOpen(false)
    } else {
      // Redirect to a safe site or show appropriate message
      window.location.href = "https://www.google.com"
    }
  }

  if (isLoading) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md bg-black/95 border-white/20" hideCloseButton>
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-white mb-2">Verificare Vârstă</DialogTitle>
          <DialogDescription className="text-white/90">
            Acest site conține conținut pentru adulți. Trebuie să aveți cel puțin 18 ani pentru a continua.
          </DialogDescription>
        </DialogHeader>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="text-center pb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-lg">18+</span>
            </div>
            <CardTitle className="text-white text-lg">Confirmare Vârstă</CardTitle>
            <CardDescription className="text-white">
              Vă rugăm să confirmați că aveți cel puțin 18 ani împliniți
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => handleVerify(true)}
              className="w-full bg-white text-black hover:bg-gray-100 font-medium"
            >
              Da, am peste 18 ani
            </Button>
            <Button
              onClick={() => handleVerify(false)}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white"
            >
              Nu, am sub 18 ani
            </Button>
          </CardContent>
        </Card>

        <p className="text-xs text-white/80 text-center mt-4">
          Prin continuare, confirmați că aveți vârsta legală în țara dumneavoastră pentru a vizualiza conținut pentru
          adulți.
        </p>
      </DialogContent>
    </Dialog>
  )
}
