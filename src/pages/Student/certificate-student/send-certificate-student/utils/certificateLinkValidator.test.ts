// src/pages/Student/certificate-student/send-certificate-student/utils/certificateLinkValidator.test.ts

/**
 * Test file for Certificate Link Validator
 * ทดสอบการทำงานของ certificateLinkValidator
 */

import { 
  validateCertificateLink, 
  quickValidateCertificateLink, 
  fullValidateCertificateLink,
  CertificateLinkData 
} from './certificateLinkValidator';

// ✅ Mock HTML content สำหรับทดสอบ
const mockCertificateHTML = `
<html>
<head>
  <title>BUU LI003 Certificate | mooc.buu.ac.th</title>
</head>
<body>
  <main class="accomplishment accomplishment-main">
    <div class="wrapper-accomplishment-rendering">
      <div class="accomplishment-rendering cer-size">
        <div class="accomplishment-statement">
          <span class="gold-line bucc-line font-gold">CERTIFICATE OF BUU MOOC</span>
          <span class="font-cer-template top-line">is presented to</span>
          <strong class="gold-line font-gold">Thanyarat Poungcahalam</strong>
          <span class="font-cer-template">has successfully completed the Open Online Course </span>
          <span class="gold-line font-gold">ภาษาอังกฤษเพื่อการสื่อสาร (English for Communication)</span>
          <span class="project-line">On December 20, 2022</span>
          
          <div class="list-signatories">
            <span>Certificate ID Number : 11969169962e425db01c662346eec8ca</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</body>
</html>
`;

// ✅ Mock fetch function
global.fetch = jest.fn();

describe('Certificate Link Validator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateCertificateLink', () => {
    it('should validate BUU MOOC certificate link successfully', async () => {
      // ✅ Mock successful fetch response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          contents: mockCertificateHTML
        })
      });

      const result = await validateCertificateLink('https://mooc.buu.ac.th/certificates/11969169962e425db01c662346eec8ca');

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.studentName).toBe('Thanyarat Poungcahalam');
      expect(result.data?.courseName).toBe('ภาษาอังกฤษเพื่อการสื่อสาร (English for Communication)');
      expect(result.data?.completionDate).toBe('December 20, 2022');
      expect(result.data?.certificateId).toBe('11969169962e425db01c662346eec8ca');
      expect(result.data?.isValid).toBe(true);
    });

    it('should reject non-BUU MOOC links', async () => {
      const result = await validateCertificateLink('https://example.com/certificate/123');

      expect(result.success).toBe(false);
      expect(result.error).toBe('ลิ้งก์ไม่ใช่ใบรับรอง BUU MOOC ที่ถูกต้อง');
    });

    it('should handle fetch errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await validateCertificateLink('https://mooc.buu.ac.th/certificates/123');

      expect(result.success).toBe(false);
      expect(result.error).toContain('ไม่สามารถเข้าถึงลิ้งก์ได้');
    });
  });

  describe('quickValidateCertificateLink', () => {
    it('should perform quick validation without name comparison', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          contents: mockCertificateHTML
        })
      });

      const result = await quickValidateCertificateLink('https://mooc.buu.ac.th/certificates/11969169962e425db01c662346eec8ca');

      expect(result.success).toBe(true);
      expect(result.data?.isValid).toBe(true);
    });
  });

  describe('fullValidateCertificateLink', () => {
    it('should perform full validation with name comparison', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          contents: mockCertificateHTML
        })
      });

      const result = await fullValidateCertificateLink(
        'https://mooc.buu.ac.th/certificates/11969169962e425db01c662346eec8ca',
        'Thanyarat Poungcahalam'
      );

      expect(result.success).toBe(true);
      expect(result.data?.isValid).toBe(true);
    });

    it('should fail validation when names do not match', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          contents: mockCertificateHTML
        })
      });

      const result = await fullValidateCertificateLink(
        'https://mooc.buu.ac.th/certificates/11969169962e425db01c662346eec8ca',
        'John Doe'
      );

      expect(result.success).toBe(true);
      expect(result.data?.isValid).toBe(false);
    });
  });
});

// ✅ Manual test function สำหรับทดสอบใน browser
export const manualTest = async () => {
  console.log('🧪 [CertificateLinkValidator] Starting manual test...');
  
  const testLink = 'https://mooc.buu.ac.th/certificates/11969169962e425db01c662346eec8ca';
  
  try {
    const result = await quickValidateCertificateLink(testLink);
    console.log('✅ [CertificateLinkValidator] Manual test result:', result);
    return result;
  } catch (error) {
    console.error('❌ [CertificateLinkValidator] Manual test error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// ✅ Export สำหรับใช้ใน browser console
if (typeof window !== 'undefined') {
  (window as any).testCertificateLink = manualTest;
  console.log('🔧 [CertificateLinkValidator] Manual test function available as window.testCertificateLink()');
}

