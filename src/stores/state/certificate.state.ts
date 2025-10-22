import { Certificate } from "../../types/certificate/certificate.type";
import { CertificateTemplate } from "../../types/certificate/certificate-template.type";
import { CertificateVerification } from "../../types/certificate/certificate-verofocation.type";
import { CertificateAudit } from "../../types/certificate/certificate-audit.type";
import { CertificateBase } from "../../types/certificate/certificate-base.type";

export interface CertificateState {
  // Certificate state
  certificates: Certificate[];
  selectedCertificate: Certificate | null;
  certificateLoading: boolean;
  certificateError: string | null;
  searchResults: Certificate[] | null;

  // Certificate Template state
  certificateTemplates: CertificateTemplate[];
  selectedTemplate: CertificateTemplate | null;
  templateLoading: boolean;
  templateError: string | null;

  // Certificate Verification state
  verifications: CertificateVerification[];
  selectedVerification: CertificateVerification | null;
  verificationLoading: boolean;
  verificationError: string | null;

  // Certificate Audit state
  audits: CertificateAudit[];
  selectedAudit: CertificateAudit | null;
  auditLoading: boolean;
  auditError: string | null;

  // Certificate Base state
  certificateBases: CertificateBase[];
  selectedBase: CertificateBase | null;
  baseLoading: boolean;
  baseError: string | null;

  // Analytics state
  verificationStats: any;
  pendingCertificates: Certificate[];
  statsLoading: boolean;
  statsError: string | null;

  // Certificate actions
  fetchCertificates: () => Promise<void>;
  fetchCertificateById: (id: number) => Promise<Certificate | null>;
  createCertificate: (data: Partial<Certificate>) => Promise<void>;
  updateCertificate: (data: Certificate) => Promise<void>;
  deleteCertificate: (id: number) => Promise<void>;
  clearSelectedCertificate: () => void;
  searchCertificates: (name: string) => Promise<void>;
  
  // Certificate Template actions
  fetchCertificateTemplates: () => Promise<void>;
  fetchCertificateTemplateById: (id: number) => Promise<CertificateTemplate | null>;
  createCertificateTemplate: (data: Partial<CertificateTemplate>) => Promise<void>;
  updateCertificateTemplate: (data: CertificateTemplate) => Promise<void>;
  deleteCertificateTemplate: (id: number) => Promise<void>;
  clearSelectedTemplate: () => void;

  // Certificate Verification actions
  fetchVerificationsByCertificateId: (certificateId: number) => Promise<void>;
  fetchVerificationById: (id: number) => Promise<CertificateVerification | null>;
  createVerification: (data: Partial<CertificateVerification>) => Promise<void>;
  clearSelectedVerification: () => void;

  // Certificate Audit actions
  fetchAuditsByCertificateId: (certificateId: number) => Promise<void>;
  fetchAuditById: (id: number) => Promise<CertificateAudit | null>;
  clearSelectedAudit: () => void;

  // Certificate Base actions
  fetchCertificateBases: () => Promise<void>;
  fetchCertificateBaseById: (id: number) => Promise<CertificateBase | null>;
  fetchCertificateBaseByActivityId: (activityId: number) => Promise<CertificateBase | null>;
  createCertificateBase: (data: Partial<CertificateBase>) => Promise<void>;
  updateCertificateBase: (data: CertificateBase) => Promise<void>;
  deleteCertificateBase: (id: number) => Promise<void>;
  clearSelectedBase: () => void;

  // Analytics actions
  fetchVerificationStats: () => Promise<void>;
  fetchPendingCertificates: () => Promise<void>;
  
  // OCR specific methods
  uploadCertificate: (file: File) => Promise<any>;
  processOcrResult: (result: any) => Promise<void>;
}
