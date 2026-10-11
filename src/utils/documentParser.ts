import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker if available or set workerSrc
if (typeof window !== 'undefined') {
  // Use CDN worker fallback for Vite bundling stability
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.0.379'}/pdf.worker.min.mjs`;
}

export interface ParseResult {
  text: string;
  pageCount?: number;
  wordCount: number;
  warnings?: string[];
}

export async function parseDocument(file: File): Promise<ParseResult> {
  const fileName = file.name.toLowerCase();
  const warnings: string[] = [];

  // Check file size (max 8MB)
  if (file.size > 8 * 1024 * 1024) {
    throw new Error('File exceeds maximum size limit of 8MB. Please upload a smaller document.');
  }

  if (fileName.endsWith('.pdf')) {
    return parsePdfFile(file);
  } else if (fileName.endsWith('.docx')) {
    return parseDocxFile(file);
  } else if (fileName.endsWith('.txt') || fileName.endsWith('.md')) {
    const text = await file.text();
    const cleaned = cleanExtractedText(text);
    return {
      text: cleaned,
      wordCount: countWords(cleaned),
    };
  } else {
    throw new Error('Unsupported format. Please upload a PDF (.pdf), Word Document (.docx), or plain text file.');
  }
}

async function parsePdfFile(file: File): Promise<ParseResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: false,
      useSystemFonts: true,
    });

    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;
    let fullText = '';

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((item: any) => item.str || '')
        .join(' ');
      fullText += pageText + '\n\n';
    }

    const cleaned = cleanExtractedText(fullText);
    const wordCount = countWords(cleaned);

    const warnings: string[] = [];
    if (wordCount < 30) {
      warnings.push(
        'Extracted very few words. This document may be a scanned image without an OCR text layer. If text is missing, consider copying and pasting your resume text.'
      );
    }

    return {
      text: cleaned,
      pageCount: numPages,
      wordCount,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('PDF parsing error:', err);
    throw new Error(`Failed to extract text from PDF: ${errMsg}. Ensure the PDF is not password-protected or corrupted.`);
  }
}

async function parseDocxFile(file: File): Promise<ParseResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const cleaned = cleanExtractedText(result.value);
    const wordCount = countWords(cleaned);

    const warnings: string[] = [];
    if (result.messages && result.messages.length > 0) {
      warnings.push(result.messages.map(m => m.message).join('; '));
    }

    return {
      text: cleaned,
      wordCount,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('DOCX parsing error:', err);
    throw new Error(`Failed to parse DOCX: ${errMsg}. Please ensure the file is a valid Microsoft Word document.`);
  }
}

function cleanExtractedText(raw: string): string {
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();
}

function countWords(str: string): number {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}
