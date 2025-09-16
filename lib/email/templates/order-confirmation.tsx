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
  estimatedDelivery: string
}

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export function generateOrderConfirmationTemplate(data: OrderConfirmationData): EmailTemplate {
  const subject = `Order Confirmation - ${data.orderNumber}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #059669; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .order-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .item { border-bottom: 1px solid #eee; padding: 10px 0; }
        .total { font-weight: bold; font-size: 18px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase, ${data.customerName}</p>
        </div>
        
        <div class="content">
          <div class="order-details">
            <h2>Order Details</h2>
            <p><strong>Order Number:</strong> ${data.orderNumber}</p>
            <p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>
            
            <h3>Items Ordered:</h3>
            ${data.items
              .map(
                (item) => `
              <div class="item">
                <p><strong>${item.name}</strong></p>
                <p>Quantity: ${item.quantity} × $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}</p>
              </div>
            `,
              )
              .join("")}
            
            <div style="margin-top: 20px;">
              <p>Subtotal: $${data.subtotal.toFixed(2)}</p>
              <p>VAT: $${data.vatAmount.toFixed(2)}</p>
              <p class="total">Total: $${data.total.toFixed(2)}</p>
            </div>
          </div>
          
          <div class="order-details">
            <h3>Shipping Address</h3>
            <p>${data.shippingAddress.name}</p>
            <p>${data.shippingAddress.address}</p>
            ${data.shippingAddress.address2 ? `<p>${data.shippingAddress.address2}</p>` : ""}
            <p>${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}</p>
            <p>${data.shippingAddress.country}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
    Order Confirmation - ${data.orderNumber}
    
    Thank you for your purchase, ${data.customerName}!
    
    Order Number: ${data.orderNumber}
    Estimated Delivery: ${data.estimatedDelivery}
    
    Items Ordered:
    ${data.items.map((item) => `${item.name} - Qty: ${item.quantity} × $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}`).join("\n")}
    
    Subtotal: $${data.subtotal.toFixed(2)}
    VAT: $${data.vatAmount.toFixed(2)}
    Total: $${data.total.toFixed(2)}
    
    Shipping Address:
    ${data.shippingAddress.name}
    ${data.shippingAddress.address}
    ${data.shippingAddress.address2 || ""}
    ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}
    ${data.shippingAddress.country}
  `

  return { subject, html, text }
}
