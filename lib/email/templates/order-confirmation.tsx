import { formatCurrency } from "@/lib/utils/currency"
import type { EmailTemplate } from "../email-adapter"

export interface OrderConfirmationData {
  orderNumber: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    quantity: number
    price: number
    currency: string
    image_url?: string
  }>
  subtotal: number
  vatAmount: number
  total: number
  currency: string
  shippingAddress: {
    name: string
    address: string
    address2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  estimatedDelivery?: string
}

export function generateOrderConfirmationTemplate(data: OrderConfirmationData): EmailTemplate {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <div style="display: flex; align-items: center;">
          ${item.image_url ? `<img src="${item.image_url}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 12px;">` : ""}
          <div>
            <h4 style="margin: 0; font-size: 14px; font-weight: 600; color: #111827;">${item.name}</h4>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">Quantity: ${item.quantity}</p>
          </div>
        </div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">
        ${formatCurrency(item.price * item.quantity, item.currency)}
      </td>
    </tr>
  `,
    )
    .join("")

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - ${data.orderNumber}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Order Confirmed!</h1>
        <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">Thank you for your purchase</p>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <div style="margin-bottom: 30px;">
          <h2 style="color: #111827; margin: 0 0 8px 0; font-size: 20px;">Hi ${data.customerName},</h2>
          <p style="color: #6b7280; margin: 0; font-size: 16px;">
            Your order <strong style="color: #111827;">#${data.orderNumber}</strong> has been confirmed and is being processed.
          </p>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #111827; margin: 0 0 16px 0; font-size: 18px; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px;">Order Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${itemsHtml}
          </table>
        </div>

        <div style="margin-bottom: 30px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Subtotal:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600;">${formatCurrency(data.subtotal, data.currency)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">VAT:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600;">${formatCurrency(data.vatAmount, data.currency)}</td>
            </tr>
            <tr style="border-top: 2px solid #f3f4f6;">
              <td style="padding: 12px 0 8px 0; font-size: 18px; font-weight: 700; color: #111827;">Total:</td>
              <td style="padding: 12px 0 8px 0; text-align: right; font-size: 18px; font-weight: 700; color: #111827;">${formatCurrency(data.total, data.currency)}</td>
            </tr>
          </table>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #111827; margin: 0 0 16px 0; font-size: 18px; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px;">Shipping Address</h3>
          <div style="background: #f9fafb; padding: 16px; border-radius: 8px; color: #374151;">
            <p style="margin: 0; font-weight: 600;">${data.shippingAddress.name}</p>
            <p style="margin: 4px 0 0 0;">${data.shippingAddress.address}</p>
            ${data.shippingAddress.address2 ? `<p style="margin: 4px 0 0 0;">${data.shippingAddress.address2}</p>` : ""}
            <p style="margin: 4px 0 0 0;">${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}</p>
            <p style="margin: 4px 0 0 0;">${data.shippingAddress.country}</p>
          </div>
        </div>

        ${
          data.estimatedDelivery
            ? `
          <div style="background: #ecfdf5; border: 1px solid #d1fae5; padding: 16px; border-radius: 8px; margin-bottom: 30px;">
            <p style="margin: 0; color: #065f46; font-weight: 600;">📦 Estimated Delivery: ${data.estimatedDelivery}</p>
          </div>
        `
            : ""
        }

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #6b7280; margin: 0 0 16px 0;">Questions about your order?</p>
          <a href="mailto:support@shaderstore.com" style="color: #667eea; text-decoration: none; font-weight: 600;">Contact Support</a>
        </div>
      </div>

      <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 14px;">
        <p style="margin: 0;">© 2024 Shader Store. All rights reserved.</p>
      </div>
    </body>
    </html>
  `

  const text = `
Order Confirmation - ${data.orderNumber}

Hi ${data.customerName},

Your order #${data.orderNumber} has been confirmed and is being processed.

Order Details:
${data.items.map((item) => `- ${item.name} (Qty: ${item.quantity}) - ${formatCurrency(item.price * item.quantity, item.currency)}`).join("\n")}

Subtotal: ${formatCurrency(data.subtotal, data.currency)}
VAT: ${formatCurrency(data.vatAmount, data.currency)}
Total: ${formatCurrency(data.total, data.currency)}

Shipping Address:
${data.shippingAddress.name}
${data.shippingAddress.address}
${data.shippingAddress.address2 || ""}
${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}
${data.shippingAddress.country}

${data.estimatedDelivery ? `Estimated Delivery: ${data.estimatedDelivery}` : ""}

Questions about your order? Contact us at support@shaderstore.com

© 2024 Shader Store. All rights reserved.
  `

  return {
    subject: `Order Confirmation - ${data.orderNumber}`,
    html,
    text,
  }
}
