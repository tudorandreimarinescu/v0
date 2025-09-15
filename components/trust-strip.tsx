"use client"

import { Shield, Truck, UserCheck } from "lucide-react"
import { useI18n } from "@/hooks/use-i18n-preview"

export default function TrustStrip() {
  const { t } = useI18n()

  const features = [
    {
      icon: Truck,
      text: t("trust.shipping"),
    },
    {
      icon: Shield,
      text: t("trust.payments"),
    },
    {
      icon: UserCheck,
      text: t("trust.age"),
    },
  ]

  return (
    <div className="relative z-10 bg-black/40 backdrop-blur-sm border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <feature.icon className="h-4 w-4 text-white/60" />
              <span className="text-sm text-white/80 font-light">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
