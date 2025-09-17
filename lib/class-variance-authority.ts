// Simple mock implementation of class-variance-authority
export type VariantProps<T extends (...args: any) => any> = Partial<{
  [K in keyof Parameters<T>[0]]: Parameters<T>[0][K] extends string | number | boolean | undefined
    ? Parameters<T>[0][K]
    : never
}>

export function cva(
  base: string,
  config?: {
    variants?: Record<string, Record<string, string>>
    defaultVariants?: Record<string, string>
  },
) {
  return (props: Record<string, any> = {}) => {
    let classes = base

    if (config?.variants) {
      for (const [variantKey, variantValue] of Object.entries(props)) {
        if (variantValue && config.variants[variantKey] && config.variants[variantKey][variantValue]) {
          classes += " " + config.variants[variantKey][variantValue]
        }
      }
    }

    // Apply default variants for missing props
    if (config?.defaultVariants) {
      for (const [key, defaultValue] of Object.entries(config.defaultVariants)) {
        if (!(key in props) && config.variants?.[key]?.[defaultValue]) {
          classes += " " + config.variants[key][defaultValue]
        }
      }
    }

    return classes
  }
}
