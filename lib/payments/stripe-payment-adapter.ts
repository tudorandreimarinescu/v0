import {
  PaymentAdapter,
  type PaymentIntent,
  type CreatePaymentIntentRequest,
  type ConfirmPaymentIntentRequest,
  type PaymentResult,
} from "./payment-adapter"

export class StripePaymentAdapter extends PaymentAdapter {
  private apiKey: string
  private baseUrl = "https://api.stripe.com/v1"

  constructor(apiKey: string) {
    super()
    this.apiKey = apiKey
  }

  private async makeRequest(endpoint: string, method: "GET" | "POST", data?: any): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    }

    const options: RequestInit = {
      method,
      headers,
    }

    if (data && method === "POST") {
      const formData = new URLSearchParams()
      Object.keys(data).forEach((key) => {
        if (typeof data[key] === "object") {
          Object.keys(data[key]).forEach((subKey) => {
            formData.append(`${key}[${subKey}]`, data[key][subKey])
          })
        } else {
          formData.append(key, data[key])
        }
      })
      options.body = formData
    }

    const response = await fetch(url, options)
    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error?.message || "Stripe API error")
    }

    return result
  }

  async createIntent(request: CreatePaymentIntentRequest): Promise<PaymentResult> {
    try {
      const stripeData = {
        amount: request.amount,
        currency: request.currency,
        payment_method_types: request.payment_method_types || ["card"],
        metadata: request.metadata || {},
        description: request.description,
        receipt_email: request.receipt_email,
      }

      if (request.shipping) {
        stripeData.shipping = {
          name: request.shipping.name,
          address: request.shipping.address,
        }
      }

      const stripeIntent = await this.makeRequest("/payment_intents", "POST", stripeData)

      const intent: PaymentIntent = {
        id: stripeIntent.id,
        amount: stripeIntent.amount,
        currency: stripeIntent.currency,
        status: stripeIntent.status,
        client_secret: stripeIntent.client_secret,
        metadata: stripeIntent.metadata,
        created_at: new Date(stripeIntent.created * 1000),
        updated_at: new Date(),
      }

      return {
        success: true,
        payment_intent: intent,
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: "api_error",
          message: error instanceof Error ? error.message : "Failed to create payment intent",
          type: "api_error",
        },
      }
    }
  }

  async confirmIntent(request: ConfirmPaymentIntentRequest): Promise<PaymentResult> {
    try {
      const confirmData = {
        payment_method: {
          type: request.payment_method.type,
          card: {
            number: request.payment_method.card.number,
            exp_month: request.payment_method.card.exp_month,
            exp_year: request.payment_method.card.exp_year,
            cvc: request.payment_method.card.cvc,
          },
        },
      }

      if (request.payment_method.billing_details) {
        confirmData.payment_method.billing_details = request.payment_method.billing_details
      }

      const stripeIntent = await this.makeRequest(
        `/payment_intents/${request.payment_intent_id}/confirm`,
        "POST",
        confirmData,
      )

      const intent: PaymentIntent = {
        id: stripeIntent.id,
        amount: stripeIntent.amount,
        currency: stripeIntent.currency,
        status: stripeIntent.status,
        client_secret: stripeIntent.client_secret,
        metadata: stripeIntent.metadata,
        created_at: new Date(stripeIntent.created * 1000),
        updated_at: new Date(),
      }

      return {
        success: true,
        payment_intent: intent,
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: "api_error",
          message: error instanceof Error ? error.message : "Failed to confirm payment intent",
          type: "api_error",
        },
      }
    }
  }

  async getIntent(payment_intent_id: string): Promise<PaymentResult> {
    try {
      const stripeIntent = await this.makeRequest(`/payment_intents/${payment_intent_id}`, "GET")

      const intent: PaymentIntent = {
        id: stripeIntent.id,
        amount: stripeIntent.amount,
        currency: stripeIntent.currency,
        status: stripeIntent.status,
        client_secret: stripeIntent.client_secret,
        metadata: stripeIntent.metadata,
        created_at: new Date(stripeIntent.created * 1000),
        updated_at: new Date(),
      }

      return {
        success: true,
        payment_intent: intent,
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: "api_error",
          message: error instanceof Error ? error.message : "Failed to retrieve payment intent",
          type: "api_error",
        },
      }
    }
  }

  async cancelIntent(payment_intent_id: string): Promise<PaymentResult> {
    try {
      const stripeIntent = await this.makeRequest(`/payment_intents/${payment_intent_id}/cancel`, "POST")

      const intent: PaymentIntent = {
        id: stripeIntent.id,
        amount: stripeIntent.amount,
        currency: stripeIntent.currency,
        status: stripeIntent.status,
        client_secret: stripeIntent.client_secret,
        metadata: stripeIntent.metadata,
        created_at: new Date(stripeIntent.created * 1000),
        updated_at: new Date(),
      }

      return {
        success: true,
        payment_intent: intent,
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: "api_error",
          message: error instanceof Error ? error.message : "Failed to cancel payment intent",
          type: "api_error",
        },
      }
    }
  }
}
