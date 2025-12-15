import PDFDocument from "pdfkit";
import streamBuffers from "stream-buffers";

export async function generateInvoicePDF(order, opts = {}) {
  const { forAdmin = false, storeInfo = {}, includeMeta = false } = opts;

  const doc = new PDFDocument({ size: "A4", margin: 40 });
  const writableBuffer = new streamBuffers.WritableStreamBuffer({
    initialSize: 200 * 1024,
    incrementAmount: 50 * 1024,
  });

  doc.pipe(writableBuffer);

  // ===== HEADER (TEXT LOGO) =====
  doc
    .fontSize(30)
    .fillColor("#000000")
    .text(storeInfo.logoText || storeInfo.name || "Your Store", {
      align: "left",
    });

  doc.moveDown(0.3);

  doc.fontSize(10).fillColor("gray");
  if (storeInfo.address) doc.text(storeInfo.address);
  if (storeInfo.email) doc.text(`Email: ${storeInfo.email}`);
  if (storeInfo.phone) doc.text(`Phone: ${storeInfo.phone}`);

  doc.moveDown(1);

  // ===== INVOICE TITLE =====
  doc.fontSize(26).fillColor("#000000").text("INVOICE", { align: "right" });
  doc.moveDown(0.5);

  // Invoice metadata
  doc.fontSize(11).fillColor("black");
  doc.text(`Invoice #: ${order._id}`);
  doc.text(`Date: ${new Date(order.createdAt || Date.now()).toLocaleString()}`);

  if (forAdmin && order.stripeSessionId) {
    doc.text(`Stripe Session: ${order.stripeSessionId}`);
  }

  doc.moveDown(1);

  // ===== BILL TO =====
  doc.fontSize(12).text("Bill To:", { underline: true });
  doc.text(order.customerName || "Customer");
  doc.text(order.customerEmail || "");
  doc.moveDown(1);

  // ===== PRODUCTS TABLE =====
  const tableTop = doc.y;
  doc.fontSize(11);

  doc.text("Product", 40, tableTop);
  doc.text("Qty", 300, tableTop);
  doc.text("Price", 350, tableTop);
  doc.text("Total", 450, tableTop);

  doc.moveTo(40, tableTop + 15).lineTo(560, tableTop + 15).stroke();

  let y = tableTop + 25;
  const rowGap = 22;

  const products = Array.isArray(order.products) ? order.products : [];

  products.forEach((item) => {
    const name =
      typeof item.product === "string"
        ? item.product
        : item.product?.name || "Product";

    const qty = item.quantity || 1;
    const price = Number(item.price || 0);
    const lineTotal = (qty * price).toFixed(2);

    doc.text(name, 40, y);
    doc.text(qty.toString(), 300, y);
    doc.text(`$${price.toFixed(2)}`, 350, y);
    doc.text(`$${lineTotal}`, 450, y);

    y += rowGap;

    if (y > 700) {
      doc.addPage();
      y = 40;
    }
  });

  // ===== TOTALS =====
  doc.moveTo(40, y + 4).lineTo(560, y + 4).stroke();

  const subtotal = products.reduce(
    (acc, it) => acc + Number(it.price || 0) * (it.quantity || 1),
    0
  );

  const total =
    typeof order.totalAmount === "number" ? order.totalAmount : subtotal;

  doc.fontSize(12).text(`Subtotal: `, 370, y + 12);
  doc.text(`$${subtotal.toFixed(2)}`, 450, y + 12);

  doc.fontSize(14).text(`Grand Total:`, 370, y + 36);
  doc.text(`$${total.toFixed(2)}`, 450, y + 36);

  // ===== ADMIN META =====
  if (includeMeta || forAdmin) {
    doc.moveDown(3);
    doc
      .fontSize(10)
      .fillColor("gray")
      .text("----- ADMIN COPY -----", { align: "center" });
    doc.fillColor("black").moveDown(0.5);

    if (order.userId) doc.text(`User ID: ${order.userId}`);
    if (order.stripeSessionId)
      doc.text(`Stripe Session ID: ${order.stripeSessionId}`);
  }

  // ===== FOOTER =====
  doc.moveDown(3);
  doc.fontSize(10).fillColor("gray").text(
    storeInfo.notice ||
      "Thank you for your purchase! If you have any questions please contact support.",
    {
      align: "center",
    }
  );

  doc.end();

  await new Promise((resolve) => writableBuffer.on("finish", resolve));

  return writableBuffer.getContents();
}
