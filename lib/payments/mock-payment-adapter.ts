import {
  PaymentAdapter,
  type PaymentIntent,
  type CreatePaymentIntentRequest,
  type ConfirmPaymentIntentRequest,
  type PaymentResult,
} from "./payment-adapter"

export class MockPaymentAdapter extends PaymentAdapter {
  private intents: Map<string, PaymentIntent> = new Map()

  async createIntent(request: CreatePaymentIntentRequest): Promise<PaymentResult> {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const intent: PaymentIntent = {
        id: `pi_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: request.amount,
        currency: request.currency,
        status: "requires_payment_method",
        client_secret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
        metadata: request.metadata || {},
        created_at: new Date(),
        updated_at: new Date(),
      }

      this.intents.set(intent.id, intent)

      return {
        success: true,
        payment_intent: intent,
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: "api_error",
          message: "Failed to create payment intent",
          type: "api_error",
        },
      }
    }
  }

  async confirmIntent(request: ConfirmPaymentIntentRequest): Promise<PaymentResult> {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const intent = this.intents.get(request.payment_intent_id)
      if (!intent) {
        return {
          success: false,
          error: {
            code: "resource_missing",
            message: "Payment intent not found",
            type: "api_error",
          },
        }
      }

      // Simulate card validation
      const cardNumber = request.payment_method.card.number.replace(/\s/g, "")

      // Test card numbers for different scenarios
      if (cardNumber === "4000000000000002") {
        return {
          success: false,
          error: {
            code: "card_declined",
            message: "Your card was declined.",
            type: "card_error",
          },
        }
      }

      if (cardNumber === "4000000000000069") {
        return {
          success: false,
          error: {
            code: "expired_card",
            message: "Your card has expired.",
            type: "card_error",
          },
        }
      }

      if (cardNumber === "4000000000000127") {
        return {
          success: false,
          error: {
            code: "incorrect_cvc",
            message: "Your card's security code is incorrect.",
            type: "card_error",
          },
        }
      }

      // Simulate successful payment for valid test cards
      const updatedIntent: PaymentIntent = {
        ...intent,
        status: "succeeded",
        updated_at: new Date(),
      }

      this.intents.set(intent.id, updatedIntent)

      return {
        success: true,
        payment_intent: updatedIntent,
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: "api_error",
          message: "Failed to confirm payment intent",
          type: "api_error",
        },
      }
    }
  }

  async getIntent(payment_intent_id: string): Promise<PaymentResult> {
    try {
      const intent = this.intents.get(payment_intent_id)
      if (!intent) {
        return {
          success: false,
          error: {
            code: "resource_missing",
            message: "Payment intent not found",
            type: "api_error",
          },
        }
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
          message: "Failed to retrieve payment intent",
          type: "api_error",
        },
      }
    }
  }

  async cancelIntent(payment_intent_id: string): Promise<PaymentResult> {
    try {
      const intent = this.intents.get(payment_intent_id)
      if (!intent) {
        return {
          success: false,
          error: {
            code: "resource_missing",
            message: "Payment intent not found",
            type: "api_error",
          },
        }
      }

      const updatedIntent: PaymentIntent = {
        ...intent,
        status: "canceled",
        updated_at: new Date(),
      }

      this.intents.set(intent.id, updatedIntent)

      return {
        success: true,
        payment_intent: updatedIntent,
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: "api_error",
          message: "Failed to cancel payment intent",
          type: "api_error",
        },
      }
    }
  }
}
