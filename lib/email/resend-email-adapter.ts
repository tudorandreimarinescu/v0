import { EmailAdapter, type SendEmailRequest, type EmailTemplate, type EmailResult } from "./email-adapter"

export class ResendEmailAdapter extends EmailAdapter {
  private apiKey: string
  private baseUrl = "https://api.resend.com"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async sendEmail(request: SendEmailRequest): Promise<EmailResult> {
    try {
      const response = await fetch(`${this.baseUrl}/emails`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: request.from || "noreply@shaderstore.com",
          to: [request.to],
          subject: request.subject,
          html: request.html,
          text: request.text,
          attachments: request.attachments,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: result.name || "send_failed",
            message: result.message || "Failed to send email",
          },
        }
      }

      return {
        success: true,
        messageId: result.id,
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: "api_error",
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
}
