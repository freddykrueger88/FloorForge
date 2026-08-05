/**
 * pdfExportController – PDF-Taktikblatt-Export via pdfkit
 * Issue #24 – v0.8.0
 *
 * Anders als GIF-/MP4-Export (exportController.js) kein Job-Store/Polling
 * nötig: Erzeugung aus bereits gerenderten Frame-PNGs ist schnell genug
 * für einen synchronen Request/Response, direkt in die Response gestreamt.
 */
import PDFDocument from 'pdfkit';
import logger from '../utils/logger.js';

const MAX_FRAMES = 60;
const PAGE_SIZES = { a4: 'A4', letter: 'LETTER' };
const GRIDS = {
  1: { cols: 1, rows: 1 },
  2: { cols: 1, rows: 2 },
  4: { cols: 2, rows: 2 },
};

const TEXT = {
  de: {
    footer: 'Vertraulich – Nur für internes Coaching',
    page: (n, total) => `Seite ${n} von ${total}`,
    fallbackBoardName: 'Unbenanntes Board',
  },
  en: {
    footer: 'Confidential – For internal coaching use only',
    page: (n, total) => `Page ${n} of ${total}`,
    fallbackBoardName: 'Untitled Board',
  },
};

function parsePngBuffer(dataUrl) {
  const base64 = String(dataUrl).replace(/^data:image\/png;base64,/, '');
  return Buffer.from(base64, 'base64');
}

function formatDate(lang) {
  return new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

/**
 * POST /api/export/pdf
 * Body: { boardName?, frames: [{ image, note? }], framesPerPage?, paperSize?, language? }
 */
export async function exportPdf(req, res) {
  const { boardName, frames, framesPerPage = 2, paperSize = 'a4', language = 'de' } = req.body;

  if (!Array.isArray(frames) || frames.length < 1) {
    return res.status(400).json({ success: false, message: 'Mindestens 1 Frame erforderlich.' });
  }
  if (frames.length > MAX_FRAMES) {
    return res.status(400).json({ success: false, message: `Maximal ${MAX_FRAMES} Frames erlaubt.` });
  }

  const grid = GRIDS[Number(framesPerPage)] ?? GRIDS[2];
  const size = PAGE_SIZES[paperSize] ?? 'A4';
  const lang = language === 'en' ? 'en' : 'de';
  const texts = TEXT[lang];
  const safeBoardName = typeof boardName === 'string' && boardName.trim() ? boardName.trim() : texts.fallbackBoardName;

  try {
    const doc = new PDFDocument({ size, margin: 40, bufferPages: true });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="openfloorball-taktikblatt.pdf"');
    doc.pipe(res);

    const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const headerHeight = 50;
    const footerHeight = 30;
    const dateStr = formatDate(lang);

    function drawHeader() {
      doc.font('Helvetica-Bold').fontSize(16).fillColor('#111827')
        .text('OpenFloorball', doc.page.margins.left, doc.page.margins.top);
      doc.font('Helvetica').fontSize(11).fillColor('#374151')
        .text(safeBoardName, doc.page.margins.left, doc.page.margins.top + 20);
      doc.font('Helvetica').fontSize(9).fillColor('#6b7280')
        .text(dateStr, doc.page.margins.left, doc.page.margins.top, { width: contentWidth, align: 'right' });
      const lineY = doc.page.margins.top + headerHeight - 8;
      doc.moveTo(doc.page.margins.left, lineY).lineTo(doc.page.width - doc.page.margins.right, lineY)
        .strokeColor('#d1d5db').stroke();
    }

    function drawFooter(pageNum, totalPages) {
      // Innerhalb der Marge bleiben (nicht darunter) – sonst löst pdfkit
      // einen automatischen Seitenumbruch aus, weil der Text sonst außerhalb
      // des beschreibbaren Bereichs läge
      const y = doc.page.height - doc.page.margins.bottom - 14;
      doc.font('Helvetica-Oblique').fontSize(8).fillColor('#9ca3af')
        .text(texts.footer, doc.page.margins.left, y, { width: contentWidth / 2, lineBreak: false });
      doc.font('Helvetica').fontSize(8).fillColor('#9ca3af')
        .text(texts.page(pageNum, totalPages), doc.page.margins.left, y, { width: contentWidth, align: 'right', lineBreak: false });
    }

    const gridTop = doc.page.margins.top + headerHeight;
    const gridHeight = doc.page.height - doc.page.margins.bottom - gridTop - footerHeight;
    const cellW = contentWidth / grid.cols;
    const cellH = gridHeight / grid.rows;
    const cellPad = 8;
    const noteHeight = 16;

    let frameIndex = 0;
    let pageIndex = 0;
    while (frameIndex < frames.length) {
      if (pageIndex > 0) doc.addPage();
      drawHeader();

      for (let slot = 0; slot < grid.cols * grid.rows && frameIndex < frames.length; slot++, frameIndex++) {
        const frame = frames[frameIndex];
        const col = slot % grid.cols;
        const row = Math.floor(slot / grid.cols);
        const cellX = doc.page.margins.left + col * cellW;
        const cellY = gridTop + row * cellH;

        const imgBuf = parsePngBuffer(frame.image);
        doc.image(imgBuf, cellX + cellPad, cellY + cellPad, {
          fit: [cellW - cellPad * 2, cellH - cellPad * 2 - noteHeight],
          align: 'center',
          valign: 'center',
        });

        const note = typeof frame.note === 'string' ? frame.note.trim() : '';
        if (note) {
          doc.font('Helvetica').fontSize(9).fillColor('#374151')
            .text(note, cellX + cellPad, cellY + cellH - noteHeight, {
              width: cellW - cellPad * 2,
              align: 'center',
              ellipsis: true,
            });
        }
      }
      pageIndex++;
    }

    // Seitenzahlen nachträglich einzeichnen (Gesamtzahl steht erst nach der Schleife fest)
    const totalPages = doc.bufferedPageRange().count;
    for (let i = 0; i < totalPages; i++) {
      doc.switchToPage(i);
      drawFooter(i + 1, totalPages);
    }

    doc.end();
  } catch (err) {
    logger.error('[exportPdf]', err);
    if (!res.headersSent) res.status(500).json({ success: false, message: 'Interner Serverfehler' });
  }
}
