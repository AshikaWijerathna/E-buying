import nodemailer from "nodemailer";
import { generateInvoicePDF } from "./invoice.js";

export async function sendInvoiceEmails(order, user) {
  if (!order || !user.email) {
    throw new Error("Missing order details or user email.");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const orderData = {
    ...(order.toObject?.() ?? order),
    customerEmail: user.email,
    customerName: user.name || "",
  };

  // Customer PDF
  const customerPdf = await generateInvoicePDF(orderData, {
    forAdmin: false,
    storeInfo: {
      logoText: process.env.STORE_NAME || "Ebuying",
      email: process.env.EMAIL_FROM,
      address: process.env.STORE_ADDRESS,
      phone: process.env.STORE_PHONE,
    },
  });

  // Admin PDF
  const adminPdf = await generateInvoicePDF(orderData, {
    forAdmin: true,
    includeMeta: true,
    storeInfo: {
      logoText: (process.env.STORE_NAME || "Ebuying") + " — ADMIN COPY",
      email: process.env.EMAIL_FROM,
    },
  });

  // Send customer email
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: `Your Invoice - Order #${order._id}`,
    html: `
      <p>Hi ${user.name || "Customer"},</p>
      <p>Thank you for your purchase! Your invoice is attached.</p>
    `,
    attachments: [
      {
        filename: `Invoice-${order._id}.pdf`,
        content: customerPdf,
      },
    ],
  });

  // Send admin copy
  if (process.env.ADMIN_EMAIL) {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `ADMIN COPY - Order #${order._id}`,
      html: `<p>A new order has been placed. Invoice attached.</p>`,
      attachments: [
        {
          filename: `Invoice-${order._id}-ADMIN.pdf`,
          content: adminPdf,
        },
      ],
    });
  }
}
