"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckoutProgressProps {
  currentStep: number
  steps: Array<{
    number: number
    title: string
    description: string
  }>
}

export default function CheckoutProgress({ currentStep, steps }: CheckoutProgressProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium",
                  step.number < currentStep
                    ? "border-primary bg-primary text-primary-foreground"
                    : step.number === currentStep
                      ? "border-primary bg-background text-primary"
                      : "border-muted-foreground/25 bg-background text-muted-foreground",
                )}
              >
                {step.number < currentStep ? <Check className="h-5 w-5" /> : step.number}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={cn(
                    "text-sm font-medium",
                    step.number <= currentStep ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-4 h-0.5 w-16 flex-1",
                  step.number < currentStep ? "bg-primary" : "bg-muted-foreground/25",
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
