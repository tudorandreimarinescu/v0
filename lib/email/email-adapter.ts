export interface EmailTemplate {
  subject: string
  html: string
  text?: string
}

export interface SendEmailRequest {
  to: string
  from?: string
  subject: string
  html: string
  text?: string
  attachments?: Array<{
    filename: string
    content: string | Buffer
    contentType: string
  }>
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: {
    code: string
    message: string
  }
}

export abstract class EmailAdapter {
  abstract sendEmail(request: SendEmailRequest): Promise<EmailResult>
  abstract sendTemplate(to: string, template: EmailTemplate): Promise<EmailResult>
}
