import type { PaymentAdapter } from "./payment-adapter"
import { MockPaymentAdapter } from "./mock-payment-adapter"
import { StripePaymentAdapter } from "./stripe-payment-adapter"

export class PaymentService {
  private adapter: PaymentAdapter

  constructor() {
    // Use mock adapter in development, Stripe in production
    if (process.env.NODE_ENV === "development" || !process.env.STRIPE_SECRET_KEY) {
      this.adapter = new MockPaymentAdapter()
    } else {
      this.adapter = new StripePaymentAdapter(process.env.STRIPE_SECRET_KEY!)
    }
  }

  getAdapter(): PaymentAdapter {
    return this.adapter
  }

  // Convenience methods that delegate to the adapter
  async createIntent(request: any) {
    return this.adapter.createIntent(request)
  }

  async confirmIntent(request: any) {
    return this.adapter.confirmIntent(request)
  }

  async getIntent(payment_intent_id: string) {
    return this.adapter.getIntent(payment_intent_id)
  }

  async cancelIntent(payment_intent_id: string) {
    return this.adapter.cancelIntent(payment_intent_id)
  }
}

// Singleton instance
export const paymentService = new PaymentService()
