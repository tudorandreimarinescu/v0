"use client"

import { useEffect, useRef } from "react"

interface FormErrorAnnouncerProps {
  errors: Record<string, string | undefined>
  isSubmitting?: boolean
}

export function FormErrorAnnouncer({ errors, isSubmitting }: FormErrorAnnouncerProps) {
  const announcerRef = useRef<HTMLDivElement>(null)
  const previousErrorsRef = useRef<string>("")

  useEffect(() => {
    const errorMessages = Object.values(errors).filter(Boolean)
    const currentErrors = errorMessages.join(". ")

    // Only announce if errors have changed and we're not submitting
    if (currentErrors !== previousErrorsRef.current && !isSubmitting && currentErrors) {
      if (announcerRef.current) {
        announcerRef.current.textContent = `Form errors: ${currentErrors}`
      }
      previousErrorsRef.current = currentErrors
    } else if (!currentErrors) {
      previousErrorsRef.current = ""
    }
  }, [errors, isSubmitting])

  return <div ref={announcerRef} aria-live="polite" aria-atomic="true" className="sr-only" role="status" />
}
