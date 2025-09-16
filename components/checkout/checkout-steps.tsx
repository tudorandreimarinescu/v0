"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckoutStepsProps {
  currentStep: number
}

const steps = [
  { id: 1, name: "Shipping", description: "Delivery information" },
  { id: 2, name: "Billing", description: "Payment details" },
  { id: 3, name: "Payment", description: "Complete order" },
]

export default function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <div className="w-full py-6">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-center space-x-8">
          {steps.map((step, stepIdx) => (
            <li key={step.name} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium",
                    step.id < currentStep
                      ? "border-primary bg-primary text-primary-foreground"
                      : step.id === currentStep
                        ? "border-primary bg-background text-primary"
                        : "border-muted-foreground/30 bg-background text-muted-foreground",
                  )}
                >
                  {step.id < currentStep ? <Check className="h-5 w-5" /> : <span>{step.id}</span>}
                </div>
                <div className="ml-4 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      step.id <= currentStep ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {step.name}
                  </p>
                  <p
                    className={cn(
                      "text-xs",
                      step.id <= currentStep ? "text-muted-foreground" : "text-muted-foreground/60",
                    )}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
              {stepIdx < steps.length - 1 && (
                <div className={cn("ml-8 h-0.5 w-16 bg-muted-foreground/30", step.id < currentStep && "bg-primary")} />
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
