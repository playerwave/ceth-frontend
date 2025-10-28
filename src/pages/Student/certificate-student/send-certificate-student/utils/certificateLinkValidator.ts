// src/pages/Student/certificate-student/send-certificate-student/utils/certificateLinkValidator.ts

/**
 * Certificate Link Validator
 * ตรวจสอบลิ้งก์ใบรับรอง BUU MOOC โดยใช้ web scraping
 */

export interface CertificateLinkData {
  studentName: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
  isValid: boolean;
  error?: string;
}

export interface CertificateValidationResult {
  success: boolean;
  data?: CertificateLinkData;
  error?: string;
}

/**
 * ฟังก์ชันตรวจสอบลิ้งก์ใบรับรอง
 * @param link - ลิ้งก์ใบรับรอง
 * @param expectedStudentName - ชื่อ-นามสกุลที่คาดหวัง (จากระบบ)
 * @returns Promise<CertificateValidationResult>
 */
export async function validateCertificateLink(
  link: string, 
  expectedStudentName?: string
): Promise<CertificateValidationResult> {
  try {
    console.log("🔍 [CertificateLinkValidator] Starting validation for link:", link);
    
    // ✅ ตรวจสอบว่าเป็นลิ้งก์ BUU MOOC หรือไม่
    if (!link.includes('mooc.buu.ac.th/certificates/')) {
      return {
        success: false,
        error: 'ลิ้งก์ไม่ใช่ใบรับรอง BUU MOOC ที่ถูกต้อง'
      };
    }

    // ✅ ใช้ Backend API แทน CORS proxy
    const response = await fetchCertificatePage(link);
    
    if (!response.success) {
      return {
        success: false,
        error: response.error || 'ไม่สามารถเข้าถึงลิ้งก์ได้'
      };
    }

    // ✅ ใช้ข้อมูลที่ parse แล้วจาก backend
    const certificateData = parseCertificateHTML(response.html, expectedStudentName);
    
    console.log("✅ [CertificateLinkValidator] Validation completed:", certificateData);
    
    return {
      success: true,
      data: certificateData
    };

  } catch (error) {
    console.error("❌ [CertificateLinkValidator] Error:", error);
    return {
      success: false,
      error: `เกิดข้อผิดพลาดในการตรวจสอบ: ${error instanceof Error ? error.message : 'ไม่ทราบสาเหตุ'}`
    };
  }
}

/**
 * ฟังก์ชันดึงข้อมูล HTML จากลิ้งก์ผ่าน Backend API
 * @param link - ลิ้งก์ใบรับรอง
 * @returns Promise<{success: boolean, html?: string, error?: string}>
 */
async function fetchCertificatePage(link: string): Promise<{success: boolean, html?: string, error?: string}> {
  try {
    // ✅ ใช้ Backend API แทน CORS proxy
    const apiUrl = 'http://localhost:5090/api/student/certificate/validate-link';
    
    console.log("🌐 [CertificateLinkValidator] Fetching page via backend API:", apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include', // ✅ ส่ง cookies สำหรับ authentication
      body: JSON.stringify({ link })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'ไม่สามารถเข้าถึงลิ้งก์ได้');
    }

    console.log("✅ [CertificateLinkValidator] Page fetched successfully via backend");
    
    return {
      success: true,
      html: data.data // ✅ ข้อมูลที่ parse แล้วจาก backend
    };

  } catch (error) {
    console.error("❌ [CertificateLinkValidator] Fetch error:", error);
    return {
      success: false,
      error: `ไม่สามารถดึงข้อมูลจากลิ้งก์ได้: ${error instanceof Error ? error.message : 'ไม่ทราบสาเหตุ'}`
    };
  }
}

/**
 * ฟังก์ชัน Parse HTML และดึงข้อมูลใบรับรอง
 * @param data - ข้อมูลที่ parse แล้วจาก backend
 * @param expectedStudentName - ชื่อ-นามสกุลที่คาดหวัง
 * @returns CertificateLinkData
 */
function parseCertificateHTML(data: any, expectedStudentName?: string): CertificateLinkData {
  try {
    console.log("🔍 [CertificateLinkValidator] Using parsed data from backend:", data);
    
    // ✅ ใช้ข้อมูลที่ parse แล้วจาก backend
    const studentName = data.studentName || '';
    const courseName = data.courseName || '';
    const completionDate = data.completionDate || '';
    const certificateId = data.certificateId || '';
    const isValid = data.isValid || false;
    
    console.log("📊 [CertificateLinkValidator] Data from backend:", {
      studentName,
      courseName,
      completionDate,
      certificateId,
      isValid
    });
    
    // ✅ ตรวจสอบความถูกต้องของข้อมูล (ถ้ายังไม่ได้ตรวจสอบใน backend)
    const finalIsValid = isValid || validateCertificateData({
      studentName,
      courseName,
      completionDate,
      certificateId
    }, expectedStudentName);
    
    console.log("✅ [CertificateLinkValidator] Final validation result:", finalIsValid);
    
    return {
      studentName,
      courseName,
      completionDate,
      certificateId,
      isValid: finalIsValid
    };

  } catch (error) {
    console.error("❌ [CertificateLinkValidator] Parse error:", error);
    return {
      studentName: '',
      courseName: '',
      completionDate: '',
      certificateId: '',
      isValid: false,
      error: `เกิดข้อผิดพลาดในการอ่านข้อมูล: ${error instanceof Error ? error.message : 'ไม่ทราบสาเหตุ'}`
    };
  }
}

/**
 * ฟังก์ชันตรวจสอบความถูกต้องของข้อมูล
 * @param data - ข้อมูลใบรับรอง
 * @param expectedStudentName - ชื่อ-นามสกุลที่คาดหวัง
 * @returns boolean
 */
function validateCertificateData(
  data: Omit<CertificateLinkData, 'isValid' | 'error'>, 
  expectedStudentName?: string
): boolean {
  console.log("🔍 [CertificateLinkValidator] Validating certificate data...");
  
  // ✅ ตรวจสอบข้อมูลพื้นฐาน
  if (!data.studentName || !data.courseName || !data.completionDate || !data.certificateId) {
    console.log("❌ [CertificateLinkValidator] Missing required fields");
    return false;
  }
  
  // ✅ ตรวจสอบชื่อนิสิต (ถ้ามีข้อมูลจากระบบ)
  if (expectedStudentName) {
    const normalizedExpected = expectedStudentName.toLowerCase().trim();
    const normalizedActual = data.studentName.toLowerCase().trim();
    
    console.log("👤 [CertificateLinkValidator] Name comparison:", {
      expected: normalizedExpected,
      actual: normalizedActual,
      match: normalizedActual.includes(normalizedExpected) || normalizedExpected.includes(normalizedActual)
    });
    
    // ✅ ตรวจสอบว่าชื่อตรงกันหรือไม่ (ใช้ partial match)
    if (!normalizedActual.includes(normalizedExpected) && !normalizedExpected.includes(normalizedActual)) {
      console.log("❌ [CertificateLinkValidator] Student name mismatch");
      return false;
    }
  }
  
  // ✅ ตรวจสอบรูปแบบวันที่
  const datePattern = /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}$/i;
  if (!datePattern.test(data.completionDate)) {
    console.log("❌ [CertificateLinkValidator] Invalid date format:", data.completionDate);
    return false;
  }
  
  // ✅ ตรวจสอบ Certificate ID (ควรเป็น hex string)
  const idPattern = /^[a-f0-9]{32,}$/i;
  if (!idPattern.test(data.certificateId)) {
    console.log("❌ [CertificateLinkValidator] Invalid certificate ID format:", data.certificateId);
    return false;
  }
  
  console.log("✅ [CertificateLinkValidator] All validations passed");
  return true;
}

/**
 * ฟังก์ชันตรวจสอบลิ้งก์แบบง่าย (ไม่ต้องดึงข้อมูลจากระบบ)
 * @param link - ลิ้งก์ใบรับรอง
 * @returns Promise<CertificateValidationResult>
 */
export async function quickValidateCertificateLink(link: string): Promise<CertificateValidationResult> {
  return validateCertificateLink(link);
}

/**
 * ฟังก์ชันตรวจสอบลิ้งก์แบบเต็ม (ต้องดึงข้อมูลจากระบบ)
 * @param link - ลิ้งก์ใบรับรอง
 * @param expectedStudentName - ชื่อ-นามสกุลที่คาดหวัง
 * @returns Promise<CertificateValidationResult>
 */
export async function fullValidateCertificateLink(
  link: string, 
  expectedStudentName: string
): Promise<CertificateValidationResult> {
  return validateCertificateLink(link, expectedStudentName);
}
