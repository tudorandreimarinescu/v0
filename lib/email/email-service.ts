import type { EmailAdapter } from "./email-adapter"
import { MockEmailAdapter } from "./mock-email-adapter"
import { ResendEmailAdapter } from "./resend-email-adapter"

export class EmailService {
  private adapter: EmailAdapter

  constructor() {
    // Use mock adapter in development, Resend in production
    if (process.env.NODE_ENV === "development" || !process.env.RESEND_API_KEY) {
      this.adapter = new MockEmailAdapter()
    } else {
      this.adapter = new ResendEmailAdapter(process.env.RESEND_API_KEY!)
    }
  }

  getAdapter(): EmailAdapter {
    return this.adapter
  }

  async sendEmail(request: any) {
    return this.adapter.sendEmail(request)
  }

  async sendTemplate(to: string, template: any) {
    return this.adapter.sendTemplate(to, template)
  }
}

// Singleton instance
export const emailService = new EmailService()
