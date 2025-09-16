import { EmailAdapter, type SendEmailRequest, type EmailTemplate, type EmailResult } from "./email-adapter"

export class MockEmailAdapter extends EmailAdapter {
  private sentEmails: Array<SendEmailRequest & { sentAt: Date; messageId: string }> = []

  async sendEmail(request: SendEmailRequest): Promise<EmailResult> {
    try {
      // Simulate email sending delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      const messageId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Store the email for debugging/testing
      this.sentEmails.push({
        ...request,
        sentAt: new Date(),
        messageId,
      })

      console.log("[v0] Mock email sent:", {
        to: request.to,
        subject: request.subject,
        messageId,
        sentAt: new Date().toISOString(),
      })

      return {
        success: true,
        messageId,
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: "send_failed",
          message: error instanceof Error ? error.message : "Failed to send email",
        },
      }
    }
  }

  async sendTemplate(to: string, template: EmailTemplate): Promise<EmailResult> {
    return this.sendEmail({
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
  }

  // Helper method for testing/debugging
  getSentEmails() {
    return this.sentEmails
  }

  clearSentEmails() {
    this.sentEmails = []
  }
}
