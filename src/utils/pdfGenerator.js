import { jsPDF } from 'jspdf';

/**
 * Genera la nota de compra / orden de internamiento en PDF
 * @param {Object} order - Objeto de orden del backend
 * @param {Object} supplier - Datos del proveedor
 * @param {Object} logistics - Datos logísticos
 */
export function generatePurchaseOrderPDF(order, supplier = {}, logistics = {}) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = margin;

  const colors = {
    primary: '#860734',      // Burdeos institucional
    secondary: '#2c3e50',    // Azul oscuro para textos
    accent: '#e74c3c',       // Acento para totales
    light: '#f8f9fa',        // Fondo claro
    border: '#dee2e6',       // Bordes
    text: '#212529',         // Texto principal
    textLight: '#6c757d'     // Texto secundario
  };

  // ==================== ENCABEZADO ====================
  doc.setFillColor(colors.primary);
  doc.rect(0, 0, pageW, 38, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('ORDEN DE COMPRA', pageW / 2, 14, { align: 'center' });
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('GUÍA DE INTERNAMIENTO', pageW / 2, 22, { align: 'center' });

  doc.setFontSize(9);
  doc.text(`N° OC: ${order.poNumber || 'PEND-001'}`, pageW / 2, 30, { align: 'center' });

  // Datos de la empresa en la parte superior derecha
  doc.setFontSize(9);
  doc.text('RUC: 20633646499', pageW - margin, 10, { align: 'right' });
  doc.text('UNIVERSIDAD NACIONAL DE SAN AGUSTÍN', pageW - margin, 16, { align: 'right' });
  doc.text('Meta: 54', pageW - margin, 22, { align: 'right' });

  y = 48;

  // ==================== DATOS DEL PROVEEDOR ====================
  // Fondo gris claro
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(margin, y, pageW - margin * 2, 35, 3, 3, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.primary);
  doc.text('SEÑOR(ES):', margin + 4, y + 7);
  doc.setTextColor(colors.text);
  doc.setFont('helvetica', 'normal');
  doc.text(supplier.name || 'Proveedor no especificado', margin + 4, y + 14);

  doc.text('Dirección:', margin + 4, y + 21);
  doc.text(supplier.address || '—', margin + 35, y + 21);

  doc.text('RUC:', margin + 4, y + 28);
  doc.text(supplier.ruc || '—', margin + 20, y + 28);

  y += 42;

  // ==================== DATOS DE ENVÍO Y FACTURACIÓN ====================
  doc.setDrawColor(colors.border);
  doc.setLineWidth(0.3);
  doc.rect(margin, y, pageW - margin * 2, 28);

  doc.setFillColor(colors.primary);
  doc.rect(margin, y, pageW - margin * 2, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('DATOS DE ENVÍO Y FACTURACIÓN', margin + 4, y + 4.5);

  doc.setTextColor(colors.text);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  const rowY = y + 10;
  doc.text('Almacén de destino:', margin + 4, rowY);
  doc.text(logistics.warehouse || 'ALMACÉN CENTRAL', margin + 45, rowY);

  doc.text('Con destino a:', margin + 4, rowY + 6);
  doc.text(logistics.destination || 'UNIDAD DE LOGÍSTICA', margin + 33, rowY + 6);

  doc.text('Referencia:', margin + 4, rowY + 12);
  doc.text(logistics.reference || order.reference || '—', margin + 27, rowY + 12);

  y += 38;

  // ==================== INFORMACIÓN LOGÍSTICA ====================
  doc.setDrawColor(colors.border);
  doc.rect(margin, y, pageW - margin * 2, 32);

  doc.setFillColor(colors.secondary);
  doc.rect(margin, y, pageW - margin * 2, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMACIÓN LOGÍSTICA', margin + 4, y + 4.5);

  doc.setTextColor(colors.text);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  const logY = y + 10;
  const colWidth = (pageW - margin * 2 - 20) / 2;

  doc.text(`PROCESO: ${logistics.process || order.process || 'CONVOCATORIA PÚBLICA'}`, margin + 4, logY);
  doc.text(`EXPEDIENTE: ${logistics.expediente || order.expediente || '—'}`, margin + 4 + colWidth, logY);
  doc.text(`FUENTE FINANCIAMIENTO: ${logistics.fundingSource || order.fundingSource || 'RECURSOS ORDINARIOS'}`, margin + 4, logY + 6);
  doc.text(`ALMACÉN: ${logistics.warehouse || 'ALMACÉN CENTRAL'}`, margin + 4 + colWidth, logY + 6);
  doc.text(`SIAF: ${logistics.siaf || order.siaf || '—'}`, margin + 4, logY + 12);
  doc.text(`CCI: ${logistics.cci || order.cci || '—'}`, margin + 4 + colWidth, logY + 12);

  y += 42;

  // ==================== TABLA DE PRODUCTOS ====================
  const tableTop = y;
  const headers = ['ITEM', 'CANT.', 'CÓDIGO', 'MEDIDA', 'DESCRIPCIÓN', 'VALOR UNIT.', 'TOTAL'];
  const colWidths = [12, 15, 20, 25, 60, 25, 25];

  // Cabecera de la tabla
  doc.setFillColor(colors.primary);
  doc.rect(margin, y, pageW - margin * 2, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');

  let xOffset = margin;
  headers.forEach((header, idx) => {
    let align = idx === 0 ? 'left' : 'center';
    let xPos = xOffset + (align === 'center' ? colWidths[idx] / 2 : 3);
    doc.text(header, xPos, y + 6.5, { align });
    xOffset += colWidths[idx];
  });

  y += 12;

  // Filas de productos
  const items = order.items || order.orderItems || [];
  let totalGeneral = 0;
  let rowCount = 0;

  if (items.length === 0) {
    // Fila de ejemplo si no hay items
    doc.setFillColor(rowCount % 2 === 0 ? 255 : 250, rowCount % 2 === 0 ? 255 : 250, rowCount % 2 === 0 ? 255 : 250);
    doc.rect(margin, y, pageW - margin * 2, 8, 'F');
    doc.setTextColor(colors.text);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    xOffset = margin;
    doc.text('1', xOffset + colWidths[0] / 2, y + 5.5, { align: 'center' });
    xOffset += colWidths[0];
    doc.text('1', xOffset + colWidths[1] / 2, y + 5.5, { align: 'center' });
    xOffset += colWidths[1];
    doc.text('—', xOffset + colWidths[2] / 2, y + 5.5, { align: 'center' });
    xOffset += colWidths[2];
    doc.text('—', xOffset + colWidths[3] / 2, y + 5.5, { align: 'center' });
    xOffset += colWidths[3];
    doc.text('MUEBLE MOSTRADOR 1.20m', xOffset + 3, y + 5.5);
    xOffset += colWidths[4];
    doc.text('$850.00', xOffset + colWidths[5] / 2, y + 5.5, { align: 'center' });
    xOffset += colWidths[5];
    doc.text('$850.00', xOffset + colWidths[6] / 2, y + 5.5, { align: 'center' });
    totalGeneral = 850;
    y += 8;
    rowCount++;
  } else {
    items.forEach((item, idx) => {
      if (y > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        y = margin;
      }

      const backgroundColor = rowCount % 2 === 0 ? '#ffffff' : '#f8f9fa';
      doc.setFillColor(backgroundColor === '#ffffff' ? 255 : 248,
          backgroundColor === '#ffffff' ? 255 : 249,
          backgroundColor === '#ffffff' ? 255 : 250);
      doc.rect(margin, y, pageW - margin * 2, 8, 'F');

      const qty = item.quantity || 1;
      const unitPrice = item.price || item.unitPrice || 0;
      const subtotal = qty * unitPrice;
      totalGeneral += subtotal;

      doc.setTextColor(colors.text);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);

      xOffset = margin;
      doc.text(String(idx + 1), xOffset + colWidths[0] / 2, y + 5.5, { align: 'center' });
      xOffset += colWidths[0];
      doc.text(String(qty), xOffset + colWidths[1] / 2, y + 5.5, { align: 'center' });
      xOffset += colWidths[1];
      doc.text(item.code || item.sku || '—', xOffset + colWidths[2] / 2, y + 5.5, { align: 'center' });
      xOffset += colWidths[2];
      doc.text(item.measurement || item.size || '—', xOffset + colWidths[3] / 2, y + 5.5, { align: 'center' });
      xOffset += colWidths[3];
      const description = item.description || item.productName || item.name || `Producto #${item.productId}`;
      doc.text(description.substring(0, 35), xOffset + 3, y + 5.5);
      xOffset += colWidths[4];
      doc.text(`$${formatNumber(unitPrice)}`, xOffset + colWidths[5] / 2, y + 5.5, { align: 'center' });
      xOffset += colWidths[5];
      doc.text(`$${formatNumber(subtotal)}`, xOffset + colWidths[6] / 2, y + 5.5, { align: 'center' });

      y += 8;
      rowCount++;
    });
  }

  // Línea final de la tabla
  doc.setDrawColor(colors.border);
  doc.line(margin, y, pageW - margin, y);
  y += 5;

  // ==================== TOTALES ====================
  const totalToShow = totalGeneral > 0 ? totalGeneral : (order.totalAmount || 0);
  doc.setFillColor(colors.accent);
  doc.roundedRect(pageW - margin - 70, y, 70, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`TOTAL S/ ${formatNumber(totalToShow)}`, pageW - margin - 5, y + 8, { align: 'right' });

  doc.setTextColor(colors.text);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`TOTAL S/ ${formatNumber(totalToShow)}`, margin, y + 8);

  y += 18;

  // ==================== AUTORIZACIONES Y NOTAS ====================
  // Línea divisoria
  doc.setDrawColor(colors.border);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // Firmas/autorizaciones
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.primary);
  doc.text('ORDENACIÓN DE LA COMPRA:', margin, y);

  doc.setTextColor(colors.text);
  doc.setFont('helvetica', 'normal');
  const signatureY = y + 8;

  // Líneas para firmas
  doc.line(margin, signatureY, margin + 60, signatureY);
  doc.setFontSize(8);
  doc.text('Jefe de Sección Bs. y Ss.', margin + 30, signatureY + 3, { align: 'center' });

  doc.line(margin + 85, signatureY, margin + 145, signatureY);
  doc.text('Jefe Oficina Logística', margin + 115, signatureY + 3, { align: 'center' });

  y += 20;

  // Nota importante
  doc.setFillColor(255, 243, 205);
  doc.roundedRect(margin, y, pageW - margin * 2, 20, 2, 2, 'F');
  doc.setTextColor(colors.text);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('NOTA IMPORTANTE:', margin + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('• El proveedor debe adjuntar los documentos que correspondan al contrato.', margin + 6, y + 10);
  doc.text('• Los documentos deben estar en el mismo formato que la solicitud.', margin + 6, y + 15);

  y += 28;

  // ==================== DISTRIBUCIÓN CONTABLE ====================
  doc.setFillColor(colors.light);
  doc.roundedRect(margin, y, pageW - margin * 2, 28, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.primary);
  doc.text('DISTRIBUCIÓN CONTABLE', margin + 4, y + 5);

  doc.setTextColor(colors.text);
  doc.setFont('helvetica', 'normal');
  doc.text(`Programa: N° ${order.programa || '—'}`, margin + 4, y + 12);
  doc.text(`Sub-Programa: N° ${order.subPrograma || '—'}`, margin + 80, y + 12);
  doc.text(`Cuentas por Pagar S/: ${formatNumber(totalToShow)}`, margin + 4, y + 19);
  doc.text(`AFECTACIÓN PRESUPUESTARIA: ${order.budgetAffectation || 'DIRECTA'}`, margin + 80, y + 19);

  y += 35;

  // ==================== RECIBIDO CONFORME ====================
  if (y + 30 < doc.internal.pageSize.getHeight() - 20) {
    doc.setDrawColor(colors.border);
    doc.rect(margin, y, pageW - margin * 2, 30);

    doc.setTextColor(colors.primary);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('RECIBÍ CONFORME', margin + 4, y + 8);

    doc.setTextColor(colors.text);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    const currentDate = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    doc.text(`DÍA: ${currentDate.split('/')[0]}`, margin + 4, y + 16);
    doc.text(`MES: ${currentDate.split('/')[1]}`, margin + 40, y + 16);
    doc.text(`AÑO: ${currentDate.split('/')[2]}`, margin + 75, y + 16);

    doc.line(margin + 120, y + 20, pageW - margin - 10, y + 20);
    doc.text('Jefe de Almacén', margin + 145, y + 24, { align: 'center' });
  }

  // ==================== PIE DE PÁGINA ====================
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFillColor(240, 245, 248);
  doc.rect(0, footerY - 8, pageW, 23, 'F');
  doc.setTextColor(colors.textLight);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Documento generado por sistema - Válido como comprobante de internamiento', pageW / 2, footerY, { align: 'center' });
  doc.text('UNIVERSIDAD NACIONAL DE SAN AGUSTÍN - Oficina de Logística', pageW / 2, footerY + 5, { align: 'center' });

  // Guardar PDF
  doc.save(`OC-${order.poNumber || order.id || 'nueva'}.pdf`);
}

/**
 * Formatea números como moneda
 */
function formatNumber(val) {
  return (val || 0).toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}