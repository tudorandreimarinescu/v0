export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status:
    | "requires_payment_method"
    | "requires_confirmation"
    | "requires_action"
    | "processing"
    | "succeeded"
    | "canceled"
  client_secret?: string
  metadata?: Record<string, string>
  created_at: Date
  updated_at: Date
}

export interface PaymentMethod {
  id: string
  type: "card" | "paypal" | "apple_pay" | "google_pay"
  card?: {
    brand: string
    last4: string
    exp_month: number
    exp_year: number
  }
  billing_details?: {
    name?: string
    email?: string
    address?: {
      line1?: string
      line2?: string
      city?: string
      state?: string
      postal_code?: string
      country?: string
    }
  }
}

export interface CreatePaymentIntentRequest {
  amount: number
  currency: string
  payment_method_types?: string[]
  metadata?: Record<string, string>
  description?: string
  receipt_email?: string
  shipping?: {
    name: string
    address: {
      line1: string
      line2?: string
      city: string
      state: string
      postal_code: string
      country: string
    }
  }
}

export interface ConfirmPaymentIntentRequest {
  payment_intent_id: string
  payment_method: {
    type: "card"
    card: {
      number: string
      exp_month: number
      exp_year: number
      cvc: string
    }
    billing_details?: {
      name?: string
      email?: string
      address?: {
        line1?: string
        line2?: string
        city?: string
        state?: string
        postal_code?: string
        country?: string
      }
    }
  }
}

export interface PaymentResult {
  success: boolean
  payment_intent?: PaymentIntent
  error?: {
    code: string
    message: string
    type: "card_error" | "validation_error" | "api_error" | "authentication_error"
  }
}

export abstract class PaymentAdapter {
  abstract createIntent(request: CreatePaymentIntentRequest): Promise<PaymentResult>
  abstract confirmIntent(request: ConfirmPaymentIntentRequest): Promise<PaymentResult>
  abstract getIntent(payment_intent_id: string): Promise<PaymentResult>
  abstract cancelIntent(payment_intent_id: string): Promise<PaymentResult>
}
