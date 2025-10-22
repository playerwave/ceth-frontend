export interface CertificateTemplate {
  template_id: number;
  template_name: string;
  template_description: string;
  issuer_organization: string;
  certificate_type: string;
  visual_features: {
    backgroundColor: string;
    logoPosition: { x: number; y: number };
    watermarkPattern: string;
    signatureArea: { x: number; y: number; width: number; height: number };
  };
  content_structure: {
    expectedFields: string[];
    fieldPositions: { [key: string]: { x: number; y: number } };
    fontFamilies: string[];
    textColors: string[];
  };
  security_features: {
    qrCodePosition: { x: number; y: number };
    securityElements: string[];
    hasWatermark: boolean;
    hasSignature: boolean;
  };
  template_image_url: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
