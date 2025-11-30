/**
 * PDF Reader Utility
 * อ่านและวิเคราะห์ไฟล์ PDF ใน Frontend โดยใช้ pdfjs-dist
 */

import * as pdfjsLib from 'pdfjs-dist';

// ✅ ตั้งค่า worker สำหรับ pdfjs-dist
// ใช้ jsdelivr CDN ซึ่งรองรับทั้ง .js และ .mjs
if (typeof window !== 'undefined') {
  const pdfVersion = pdfjsLib.version;
  
  // ✅ ใช้ jsdelivr CDN ซึ่งรองรับไฟล์ .mjs และมี CORS headers ที่ดี
  // jsdelivr จะ serve ไฟล์ที่ถูกต้องตาม request
  const workerUrl = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfVersion}/build/pdf.worker.min.mjs`;
  
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
  
  console.log("✅ [PDF Reader] PDF.js worker initialized");
  console.log("📦 [PDF Reader] PDF.js version:", pdfVersion);
  console.log("🔗 [PDF Reader] Worker URL:", workerUrl);
}

export interface PDFPageInfo {
  pageNumber: number;
  text: string;
  textItems: Array<{
    str: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontName?: string;
    fontSize?: number;
  }>;
  width: number;
  height: number;
}

export interface PDFDocumentInfo {
  totalPages: number;
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modificationDate?: string;
  pages: PDFPageInfo[];
  fullText: string;
  metadata: {
    hasText: boolean;
    isScanned: boolean;
    estimatedTextLength: number;
    fonts: string[];
    totalTextItems: number;
  };
}

/**
 * อ่านไฟล์ PDF และดึงข้อมูลทั้งหมด
 */
export async function readPdfFile(file: File): Promise<PDFDocumentInfo> {
  console.log("📄 [PDF Reader] Starting PDF reading process...");
  console.log("📄 [PDF Reader] File info:", {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: new Date(file.lastModified).toISOString()
  });

  try {
    // ✅ ตรวจสอบว่า worker พร้อมใช้งาน
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      throw new Error("PDF.js worker is not initialized. Please check worker configuration.");
    }

    // ✅ แปลง File เป็น ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    console.log("✅ [PDF Reader] File converted to ArrayBuffer, size:", arrayBuffer.byteLength, "bytes");

    // ✅ โหลด PDF document
    console.log("🔄 [PDF Reader] Loading PDF document...");
    const loadingTask = pdfjsLib.getDocument({ 
      data: arrayBuffer,
      // ✅ เพิ่ม options เพื่อ handle errors ดีขึ้น
      verbosity: 0, // 0 = errors, 1 = warnings, 2 = infos
      useSystemFonts: true,
      stopAtErrors: false // ไม่หยุดเมื่อเจอ error ในหน้าเดียว
    });
    
    const pdf = await loadingTask.promise;
    
    console.log("✅ [PDF Reader] PDF loaded successfully");
    console.log("📊 [PDF Reader] PDF info:", {
      numPages: pdf.numPages,
      fingerprint: pdf.fingerprints?.[0]
    });

    // ✅ ดึง metadata
    const metadata = await pdf.getMetadata();
    console.log("📋 [PDF Reader] PDF metadata:", metadata);

    // ✅ อ่านทุกหน้า
    const pages: PDFPageInfo[] = [];
    let fullText = '';
    const allFonts = new Set<string>();
    let totalTextItems = 0;

    console.log("📖 [PDF Reader] Reading pages...");
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      console.log(`🔄 [PDF Reader] Reading page ${pageNum}/${pdf.numPages}...`);
      
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.0 });

      console.log(`📐 [PDF Reader] Page ${pageNum} viewport:`, {
        width: viewport.width,
        height: viewport.height,
        scale: viewport.scale
      });

      // ✅ ดึงข้อความจากหน้า
      const textContent = await page.getTextContent();
      console.log(`📝 [PDF Reader] Page ${pageNum} text items count:`, textContent.items.length);

      // ✅ แปลง text items เป็นข้อความ
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');

      // ✅ สร้างรายละเอียดของ text items
      const textItems = textContent.items.map((item: any) => {
        const transform = item.transform || [1, 0, 0, 1, 0, 0];
        const fontName = item.fontName || 'unknown';
        const fontSize = item.height || (transform[0] || 12);
        
        // เก็บ font name
        if (fontName !== 'unknown') {
          allFonts.add(fontName);
        }

        return {
          str: item.str || '',
          x: transform[4] || 0,
          y: transform[5] || 0,
          width: item.width || 0,
          height: item.height || fontSize,
          fontName: fontName,
          fontSize: fontSize
        };
      });

      totalTextItems += textItems.length;

      const pageInfo: PDFPageInfo = {
        pageNumber: pageNum,
        text: pageText,
        textItems: textItems,
        width: viewport.width,
        height: viewport.height
      };

      pages.push(pageInfo);
      fullText += pageText + '\n\n';

      console.log(`✅ [PDF Reader] Page ${pageNum} processed:`, {
        textLength: pageText.length,
        textItems: textItems.length,
        preview: pageText.substring(0, 100) + (pageText.length > 100 ? '...' : '')
      });
    }

    // ✅ วิเคราะห์ metadata
    const hasText = fullText.trim().length > 0;
    const isScanned = !hasText || fullText.trim().length < 50; // ถ้ามีข้อความน้อยมาก อาจเป็น scanned image

    // ✅ Type-safe metadata access
    const info = metadata.info as any; // pdfjs metadata.info เป็น Object type แต่จริงๆ มี properties เหล่านี้

    const documentInfo: PDFDocumentInfo = {
      totalPages: pdf.numPages,
      title: info?.Title || undefined,
      author: info?.Author || undefined,
      subject: info?.Subject || undefined,
      creator: info?.Creator || undefined,
      producer: info?.Producer || undefined,
      creationDate: info?.CreationDate || undefined,
      modificationDate: info?.ModDate || undefined,
      pages: pages,
      fullText: fullText.trim(),
      metadata: {
        hasText: hasText,
        isScanned: isScanned,
        estimatedTextLength: fullText.length,
        fonts: Array.from(allFonts),
        totalTextItems: totalTextItems
      }
    };

    console.log("✅ [PDF Reader] PDF reading completed successfully");
    console.log("📊 [PDF Reader] Document summary:", {
      totalPages: documentInfo.totalPages,
      hasText: documentInfo.metadata.hasText,
      isScanned: documentInfo.metadata.isScanned,
      textLength: documentInfo.metadata.estimatedTextLength,
      fontsCount: documentInfo.metadata.fonts.length,
      totalTextItems: documentInfo.metadata.totalTextItems
    });

    return documentInfo;

  } catch (error) {
    console.error("❌ [PDF Reader] Error reading PDF:", error);
    
    // ✅ แสดง error details สำหรับ debugging
    if (error instanceof Error) {
      console.error("❌ [PDF Reader] Error name:", error.name);
      console.error("❌ [PDF Reader] Error message:", error.message);
      console.error("❌ [PDF Reader] Error stack:", error.stack);
    }
    
    // ✅ ตรวจสอบ error types ที่เป็นไปได้
    let errorMessage = "ไม่สามารถอ่านไฟล์ PDF ได้";
    
    if (error instanceof Error) {
      if (error.message.includes('worker') || error.message.includes('Worker')) {
        errorMessage = "ไม่สามารถโหลด PDF.js worker ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต";
      } else if (error.message.includes('Invalid PDF')) {
        errorMessage = "ไฟล์ PDF ไม่ถูกต้องหรือเสียหาย";
      } else if (error.message.includes('password')) {
        errorMessage = "ไฟล์ PDF มีรหัสผ่าน กรุณาเปิดรหัสผ่านก่อน";
      } else {
        errorMessage = `ไม่สามารถอ่านไฟล์ PDF ได้: ${error.message}`;
      }
    }
    
    throw new Error(errorMessage);
  }
}

/**
 * ตรวจสอบว่าไฟล์เป็น PDF หรือไม่
 */
export function isPdfFile(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

/**
 * ตรวจสอบว่า PDF มี text layer หรือไม่ (ไม่ใช่ scanned image)
 */
export async function checkPdfHasText(file: File): Promise<boolean> {
  try {
    const info = await readPdfFile(file);
    return info.metadata.hasText && !info.metadata.isScanned;
  } catch (error) {
    console.error("❌ [PDF Reader] Error checking PDF text:", error);
    return false;
  }
}

