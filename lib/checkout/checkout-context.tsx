"use client"

import type React from "react"
import { createContext, useContext, useReducer, useCallback } from "react"

export interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface BillingInfo {
  sameAsShipping: boolean
  firstName?: string
  lastName?: string
  address?: string
  address2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

export interface PaymentInfo {
  method: "card" | "paypal" | "apple_pay"
  cardNumber?: string
  expiryDate?: string
  cvv?: string
  cardholderName?: string
}

export interface CheckoutState {
  currentStep: number
  shippingInfo: Partial<ShippingInfo>
  billingInfo: BillingInfo
  paymentInfo: Partial<PaymentInfo>
  isLoading: boolean
  errors: Record<string, string>
}

type CheckoutAction =
  | { type: "SET_STEP"; payload: number }
  | { type: "UPDATE_SHIPPING"; payload: Partial<ShippingInfo> }
  | { type: "UPDATE_BILLING"; payload: Partial<BillingInfo> }
  | { type: "UPDATE_PAYMENT"; payload: Partial<PaymentInfo> }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERRORS"; payload: Record<string, string> }
  | { type: "CLEAR_ERRORS" }
  | { type: "RESET_CHECKOUT" }

const checkoutReducer = (state: CheckoutState, action: CheckoutAction): CheckoutState => {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.payload }

    case "UPDATE_SHIPPING":
      return {
        ...state,
        shippingInfo: { ...state.shippingInfo, ...action.payload },
        errors: {},
      }

    case "UPDATE_BILLING":
      return {
        ...state,
        billingInfo: { ...state.billingInfo, ...action.payload },
        errors: {},
      }

    case "UPDATE_PAYMENT":
      return {
        ...state,
        paymentInfo: { ...state.paymentInfo, ...action.payload },
        errors: {},
      }

    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "SET_ERRORS":
      return { ...state, errors: action.payload }

    case "CLEAR_ERRORS":
      return { ...state, errors: {} }

    case "RESET_CHECKOUT":
      return {
        currentStep: 1,
        shippingInfo: {},
        billingInfo: { sameAsShipping: true },
        paymentInfo: { method: "card" },
        isLoading: false,
        errors: {},
      }

    default:
      return state
  }
}

interface CheckoutContextType {
  state: CheckoutState
  setStep: (step: number) => void
  updateShipping: (info: Partial<ShippingInfo>) => void
  updateBilling: (info: Partial<BillingInfo>) => void
  updatePayment: (info: Partial<PaymentInfo>) => void
  setLoading: (loading: boolean) => void
  setErrors: (errors: Record<string, string>) => void
  clearErrors: () => void
  resetCheckout: () => void
  validateStep: (step: number) => boolean
  nextStep: () => boolean
  prevStep: () => void
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(checkoutReducer, {
    currentStep: 1,
    shippingInfo: {},
    billingInfo: { sameAsShipping: true },
    paymentInfo: { method: "card" },
    isLoading: false,
    errors: {},
  })

  const setStep = useCallback((step: number) => {
    dispatch({ type: "SET_STEP", payload: step })
  }, [])

  const updateShipping = useCallback((info: Partial<ShippingInfo>) => {
    dispatch({ type: "UPDATE_SHIPPING", payload: info })
  }, [])

  const updateBilling = useCallback((info: Partial<BillingInfo>) => {
    dispatch({ type: "UPDATE_BILLING", payload: info })
  }, [])

  const updatePayment = useCallback((info: Partial<PaymentInfo>) => {
    dispatch({ type: "UPDATE_PAYMENT", payload: info })
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading })
  }, [])

  const setErrors = useCallback((errors: Record<string, string>) => {
    dispatch({ type: "SET_ERRORS", payload: errors })
  }, [])

  const clearErrors = useCallback(() => {
    dispatch({ type: "CLEAR_ERRORS" })
  }, [])

  const resetCheckout = useCallback(() => {
    dispatch({ type: "RESET_CHECKOUT" })
  }, [])

  const validateStep = useCallback(
    (step: number): boolean => {
      const errors: Record<string, string> = {}

      if (step === 1) {
        // Validate shipping info
        const { firstName, lastName, email, phone, address, city, state, postalCode, country } = state.shippingInfo

        if (!firstName?.trim()) errors.firstName = "First name is required"
        if (!lastName?.trim()) errors.lastName = "Last name is required"
        if (!email?.trim()) errors.email = "Email is required"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Invalid email format"
        if (!phone?.trim()) errors.phone = "Phone number is required"
        if (!address?.trim()) errors.address = "Address is required"
        if (!city?.trim()) errors.city = "City is required"
        if (!state?.trim()) errors.state = "State is required"
        if (!postalCode?.trim()) errors.postalCode = "Postal code is required"
        if (!country?.trim()) errors.country = "Country is required"
      }

      if (step === 2) {
        // Validate billing info
        if (!state.billingInfo.sameAsShipping) {
          const { firstName, lastName, address, city, state: billingState, postalCode, country } = state.billingInfo

          if (!firstName?.trim()) errors.billingFirstName = "First name is required"
          if (!lastName?.trim()) errors.billingLastName = "Last name is required"
          if (!address?.trim()) errors.billingAddress = "Address is required"
          if (!city?.trim()) errors.billingCity = "City is required"
          if (!billingState?.trim()) errors.billingState = "State is required"
          if (!postalCode?.trim()) errors.billingPostalCode = "Postal code is required"
          if (!country?.trim()) errors.billingCountry = "Country is required"
        }
      }

      if (step === 3) {
        // Validate payment info
        const { method, cardNumber, expiryDate, cvv, cardholderName } = state.paymentInfo

        if (method === "card") {
          if (!cardNumber?.trim()) errors.cardNumber = "Card number is required"
          else if (!/^\d{13,19}$/.test(cardNumber.replace(/\s/g, ""))) errors.cardNumber = "Invalid card number"
          if (!expiryDate?.trim()) errors.expiryDate = "Expiry date is required"
          else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) errors.expiryDate = "Invalid expiry date (MM/YY)"
          if (!cvv?.trim()) errors.cvv = "CVV is required"
          else if (!/^\d{3,4}$/.test(cvv)) errors.cvv = "Invalid CVV"
          if (!cardholderName?.trim()) errors.cardholderName = "Cardholder name is required"
        }
      }

      if (Object.keys(errors).length > 0) {
        setErrors(errors)
        return false
      }

      clearErrors()
      return true
    },
    [state, setErrors, clearErrors],
  )

  const nextStep = useCallback((): boolean => {
    if (validateStep(state.currentStep)) {
      if (state.currentStep < 3) {
        setStep(state.currentStep + 1)
        return true
      }
    }
    return false
  }, [state.currentStep, validateStep, setStep])

  const prevStep = useCallback(() => {
    if (state.currentStep > 1) {
      setStep(state.currentStep - 1)
    }
  }, [state.currentStep, setStep])

  const value: CheckoutContextType = {
    state,
    setStep,
    updateShipping,
    updateBilling,
    updatePayment,
    setLoading,
    setErrors,
    clearErrors,
    resetCheckout,
    validateStep,
    nextStep,
    prevStep,
  }

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>
}

export function useCheckout() {
  const context = useContext(CheckoutContext)
  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider")
  }
  return context
}
