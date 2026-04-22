import { jsPDF } from 'jspdf';

/**
 * Genera la nota de venta en PDF y la descarga automáticamente.
 * @param {Object} order - Objeto de orden del backend
 */
export function generateSalesPDF(order) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = margin;

  const brand = '#860734';
  const dark = '#141413';
  const gray = '#666666';

  // --- Encabezado ---
  doc.setFillColor(134, 7, 52);
  doc.rect(0, 0, pageW, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('MUEBLERÍA PLAZA REFORMA', pageW / 2, 14, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Nota de Venta', pageW / 2, 22, { align: 'center' });
  doc.text('Tel: 751-396-0035', pageW / 2, 28, { align: 'center' });

  y = 45;

  // --- Número de venta y fecha ---
  doc.setTextColor(dark);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Venta #${order.id || '—'}`, margin, y);

  const fecha = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha: ${fecha}`, pageW - margin, y, { align: 'right' });

  y += 8;

  // --- Estado ---
  const statusLabel = {
    PENDIENTE: 'Apartado / Pendiente',
    CONFIRMADA: 'Confirmada / Entregada',
    CANCELADA: 'Cancelada'
  }[order.status] || order.status || 'Pendiente';

  doc.setFontSize(9);
  doc.setTextColor(gray);
  doc.text(`Estado: ${statusLabel}`, margin, y);
  y += 10;

  // --- Datos del cliente ---
  doc.setFillColor(250, 247, 244);
  doc.roundedRect(margin, y, pageW - margin * 2, 24, 3, 3, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(brand);
  doc.text('DATOS DEL CLIENTE', margin + 4, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(dark);
  const clientName = order.customerName || `Cliente #${order.customerId || '—'}`;
  doc.text(`Nombre: ${clientName}`, margin + 4, y + 14);
  if (order.customerPhone) {
    doc.text(`Teléfono: ${order.customerPhone}`, margin + 4, y + 20);
  }
  y += 30;

  // --- Tabla de productos ---
  doc.setFillColor(134, 7, 52);
  doc.rect(margin, y, pageW - margin * 2, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Producto', margin + 3, y + 5.5);
  doc.text('Cant.', margin + 100, y + 5.5, { align: 'center' });
  doc.text('Precio Unit.', margin + 130, y + 5.5, { align: 'center' });
  doc.text('Subtotal', pageW - margin - 3, y + 5.5, { align: 'right' });
  y += 10;

  const items = order.items || order.orderItems || [];
  let total = 0;

  if (items.length === 0) {
    // Fallback si no hay items detallados
    doc.setTextColor(dark);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const amount = order.totalAmount || 0;
    doc.text('Venta registrada', margin + 3, y + 4);
    doc.text('1', margin + 100, y + 4, { align: 'center' });
    doc.text(`$${formatNum(amount)}`, margin + 130, y + 4, { align: 'center' });
    doc.text(`$${formatNum(amount)}`, pageW - margin - 3, y + 4, { align: 'right' });
    total = amount;
    y += 8;
  } else {
    items.forEach((item, idx) => {
      if (idx % 2 === 0) {
        doc.setFillColor(253, 251, 250);
        doc.rect(margin, y, pageW - margin * 2, 8, 'F');
      }
      const unitPrice = item.price || item.unitPrice || 0;
      const qty = item.quantity || 1;
      const subtotal = unitPrice * qty;
      total += subtotal;

      doc.setTextColor(dark);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const productName = item.productName || item.name || `Producto #${item.productId}`;
      doc.text(productName.substring(0, 45), margin + 3, y + 5.5);
      doc.text(String(qty), margin + 100, y + 5.5, { align: 'center' });
      doc.text(`$${formatNum(unitPrice)}`, margin + 130, y + 5.5, { align: 'center' });
      doc.text(`$${formatNum(subtotal)}`, pageW - margin - 3, y + 5.5, { align: 'right' });
      y += 8;
    });
  }

  // Línea divisora
  doc.setDrawColor(224, 208, 224);
  doc.line(margin, y + 2, pageW - margin, y + 2);
  y += 6;

  // --- Total ---
  doc.setFillColor(134, 7, 52);
  doc.roundedRect(pageW - margin - 70, y, 70, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  const totalToShow = total > 0 ? total : (order.totalAmount || 0);
  doc.text(`TOTAL: $${formatNum(totalToShow)}`, pageW - margin - 5, y + 8, { align: 'right' });

  y += 20;

  // --- Notas ---
  if (order.notes) {
    doc.setTextColor(gray);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text(`Notas: ${order.notes}`, margin, y);
    y += 10;
  }

  // --- Pie de página ---
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setFillColor(240, 232, 236);
  doc.rect(0, footerY - 5, pageW, 25, 'F');
  doc.setTextColor(gray);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Mueblería Plaza Reforma — Tel: 751-396-0035', pageW / 2, footerY + 2, { align: 'center' });
  doc.text('Gracias por su preferencia', pageW / 2, footerY + 8, { align: 'center' });

  doc.save(`venta-${order.id || 'nueva'}.pdf`);
}

function formatNum(val) {
  return (val || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 });
}
