import { Certificate } from "@/types/certificate/certificate.type";
import { CertificateTemplate } from "@/types/certificate/certificate-template.type";
import { CertificateVerification } from "@/types/certificate/certificate-verofocation.type";
import { CertificateAudit } from "@/types/certificate/certificate-audit.type";
import { CertificateBase } from "@/types/certificate/certificate-base.type";

// API Response interfaces
export interface ApiCertificate {
  certificate_id: number;
  students_id: number;
  teacher_id?: number;
  activity_id?: number;
  date?: string;
  hours?: number;
  img?: string | null;
  status?: "Pending" | "Pass" | "Fail";
  original_filename?: string;
  file_type?: string;
  file_size?: number;
  ocr_extracted_data?: {
    studentName: string;
    courseName: string;
    completionDate: string;
    certificateId: string;
    issuerName: string;
  };
  verification_metadata?: {
    lastVerified: string;
    verificationCount: number;
    confidenceScore: number;
    verificationStatus: string;
  };
  uploaded_at: string;
  updated_at: string;
  activity?: {
    activity_id: number;
    activity_name: string;
  };
}

export interface ApiCertificateTemplate {
  template_id: number;
  template_name: string;
  template_description: string;
  issuer_organization: string;
  certificate_type: string;
  visual_features: any;
  content_structure: any;
  security_features: any;
  template_image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiCertificateVerification {
  verification_id: number;
  certificate_id: number;
  template_id?: number;
  verification_results: any;
  visual_analysis: any;
  content_analysis: any;
  security_analysis: any;
  verification_method: string;
  verified_at: string;
}

export interface ApiCertificateAudit {
  audit_id: number;
  certificate_id: number;
  action: string;
  old_values?: any;
  new_values?: any;
  reason?: string;
  performed_by: string;
  performed_at: string;
}

export interface ApiCertificateBase {
  certificate_base_id: number;
  activity_id: number;
  certificate_name: string;
  certificate_source: string;
  supervisor_name1?: string | null;
  supervisor_name2?: string | null;
  claim_expiration_date?: string | null;
  template_image_url?: string;
  validation_rules?: any;
  is_active: boolean;
  created_at: string;
}

// Map API response to Certificate type
export const mapApiToCertificate = (apiCertificate: ApiCertificate): Certificate => {
  return {
    certificate_id: apiCertificate.certificate_id,
    students_id: apiCertificate.students_id,
    teacher_id: apiCertificate.teacher_id,
    activity_id: apiCertificate.activity_id,
    date: apiCertificate.date ? new Date(apiCertificate.date) : undefined,
    hours: apiCertificate.hours,
    img: apiCertificate.img,
    status: apiCertificate.status,
    original_filename: apiCertificate.original_filename,
    file_type: apiCertificate.file_type,
    file_size: apiCertificate.file_size,
    ocr_extracted_data: apiCertificate.ocr_extracted_data,
    verification_metadata: apiCertificate.verification_metadata ? {
      ...apiCertificate.verification_metadata,
      lastVerified: new Date(apiCertificate.verification_metadata.lastVerified)
    } : undefined,
    uploaded_at: new Date(apiCertificate.uploaded_at),
    updated_at: new Date(apiCertificate.updated_at),
    activity: apiCertificate.activity,
  };
};

// Map API response to CertificateTemplate type
export const mapApiToCertificateTemplate = (apiTemplate: ApiCertificateTemplate): CertificateTemplate => {
  return {
    template_id: apiTemplate.template_id,
    template_name: apiTemplate.template_name,
    template_description: apiTemplate.template_description,
    issuer_organization: apiTemplate.issuer_organization,
    certificate_type: apiTemplate.certificate_type,
    visual_features: apiTemplate.visual_features,
    content_structure: apiTemplate.content_structure,
    security_features: apiTemplate.security_features,
    template_image_url: apiTemplate.template_image_url,
    is_active: apiTemplate.is_active,
    created_at: new Date(apiTemplate.created_at),
    updated_at: new Date(apiTemplate.updated_at),
  };
};

// Map API response to CertificateVerification type
export const mapApiToCertificateVerification = (apiVerification: ApiCertificateVerification): CertificateVerification => {
  return {
    verification_id: apiVerification.verification_id,
    certificate_id: apiVerification.certificate_id,
    template_id: apiVerification.template_id,
    verification_results: apiVerification.verification_results,
    visual_analysis: apiVerification.visual_analysis,
    content_analysis: apiVerification.content_analysis,
    security_analysis: apiVerification.security_analysis,
    verification_method: apiVerification.verification_method,
    verified_at: new Date(apiVerification.verified_at),
  };
};

// Map API response to CertificateAudit type
export const mapApiToCertificateAudit = (apiAudit: ApiCertificateAudit): CertificateAudit => {
  return {
    audit_id: apiAudit.audit_id,
    certificate_id: apiAudit.certificate_id,
    action: apiAudit.action,
    old_values: apiAudit.old_values,
    new_values: apiAudit.new_values,
    reason: apiAudit.reason,
    performed_by: apiAudit.performed_by,
    performed_at: new Date(apiAudit.performed_at),
  };
};

// Map API response to CertificateBase type
export const mapApiToCertificateBase = (apiBase: ApiCertificateBase): CertificateBase => {
  return {
    certificate_base_id: apiBase.certificate_base_id,
    activity_id: apiBase.activity_id,
    certificate_name: apiBase.certificate_name,
    certificate_source: apiBase.certificate_source,
    supervisor_name1: apiBase.supervisor_name1,
    supervisor_name2: apiBase.supervisor_name2,
    claim_expiration_date: apiBase.claim_expiration_date ? new Date(apiBase.claim_expiration_date) : null,
  };
};

// Map multiple API responses to arrays
export const mapApiToCertificates = (apiCertificates: ApiCertificate[]): Certificate[] => {
  return apiCertificates.map(mapApiToCertificate);
};

export const mapApiToCertificateTemplates = (apiTemplates: ApiCertificateTemplate[]): CertificateTemplate[] => {
  return apiTemplates.map(mapApiToCertificateTemplate);
};

export const mapApiToCertificateVerifications = (apiVerifications: ApiCertificateVerification[]): CertificateVerification[] => {
  return apiVerifications.map(mapApiToCertificateVerification);
};

export const mapApiToCertificateAudits = (apiAudits: ApiCertificateAudit[]): CertificateAudit[] => {
  return apiAudits.map(mapApiToCertificateAudit);
};

// Map to API format
export const mapCertificateToApi = (certificate: Certificate): Partial<ApiCertificate> => {
  return {
    certificate_id: certificate.certificate_id,
    students_id: certificate.students_id,
    teacher_id: certificate.teacher_id,
    activity_id: certificate.activity_id,
    date: certificate.date?.toISOString(),
    hours: certificate.hours,
    img: certificate.img,
    status: certificate.status,
    original_filename: certificate.original_filename,
    file_type: certificate.file_type,
    file_size: certificate.file_size,
    ocr_extracted_data: certificate.ocr_extracted_data,
    verification_metadata: certificate.verification_metadata ? {
      ...certificate.verification_metadata,
      lastVerified: certificate.verification_metadata.lastVerified.toISOString()
    } : undefined,
  };
};
