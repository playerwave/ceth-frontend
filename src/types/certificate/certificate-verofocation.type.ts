export interface CertificateVerification {
  verification_id: number;
  certificate_id: number;
  template_id?: number;
  verification_results: {
    isAuthentic: boolean;
    confidenceScore: number;
    matchedFeatures: string[];
    failedFeatures: string[];
    recommendations: string[];
  };
  visual_analysis: {
    backgroundMatch: number;
    logoMatch: number;
    watermarkMatch: number;
    signatureMatch: number;
    layoutMatch: number;
  };
  content_analysis: {
    fieldCompleteness: number;
    formatConsistency: number;
    dataValidity: number;
    textQuality: number;
  };
  security_analysis: {
    qrCodeValid: boolean;
    securityElementsPresent: string[];
    securityElementsMissing: string[];
    tamperingDetected: boolean;
  };
  verification_method: string;
  verified_at: Date;
}
