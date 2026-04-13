const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');

async function createPdf() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([200, 200]);
  page.drawText('Sample Page 1', { x: 50, y: 100, size: 15, color: rgb(1, 0, 0) });
  
  const page2 = pdfDoc.addPage([200, 200]);
  page2.drawText('Sample Page 2', { x: 50, y: 100, size: 15, color: rgb(0, 0, 1) });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('sample_test.pdf', pdfBytes);
}

createPdf();
