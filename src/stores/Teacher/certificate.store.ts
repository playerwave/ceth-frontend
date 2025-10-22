import { create } from "zustand";
import { certificateService, CertificateTemplateAnalysis } from "../../service/Teacher/certificate.service";
import { Certificate } from "../../types/certificate/certificate.type";
import { CertificateTemplate } from "../../types/certificate/certificate-template.type";
import { CertificateVerification } from "../../types/certificate/certificate-verofocation.type";
import { CertificateAudit } from "../../types/certificate/certificate-audit.type";
import { CertificateBase } from "../../types/certificate/certificate-base.type";

interface CertificateStore {
  // State
  isAnalyzing: boolean;
  analysisResult: CertificateTemplateAnalysis | null;
  error: string | null;
  certificates: Certificate[];
  selectedCertificate: Certificate | null;
  certificateLoading: boolean;
  certificateTemplates: CertificateTemplate[];
  verifications: CertificateVerification[];
  audits: CertificateAudit[];
  certificateBases: CertificateBase[];

  // Actions
  analyzeCertificateTemplate: (file: File) => Promise<CertificateTemplateAnalysis>;
  createActivityCertificateTemplate: (activityId: number, file: File, description?: string) => Promise<any>;
  getActivityCertificateTemplate: (activityId: number) => Promise<any>;
  createCertificate: (data: Partial<Certificate>) => Promise<Certificate>;
  getCertificateById: (certificateId: number) => Promise<Certificate>;
  getCertificatesByStudentId: (studentId: number) => Promise<Certificate[]>;
  updateCertificate: (certificateId: number, data: Partial<Certificate>) => Promise<Certificate>;
  verifyCertificate: (certificateId: number, file: File, templateId?: number) => Promise<CertificateVerification>;
  getVerificationsByCertificateId: (certificateId: number) => Promise<CertificateVerification[]>;
  getAuditsByCertificateId: (certificateId: number) => Promise<CertificateAudit[]>;
  createCertificateBase: (data: Partial<CertificateBase>) => Promise<CertificateBase>;
  getCertificateBaseByActivityId: (activityId: number) => Promise<CertificateBase>;
  getCertificateVerificationStats: () => Promise<any>;
  getPendingCertificates: () => Promise<Certificate[]>;
  clearAnalysis: () => void;
  setError: (error: string | null) => void;
  setSelectedCertificate: (certificate: Certificate | null) => void;
}

export const useCertificateStore = create<CertificateStore>((set, get) => ({
  // Initial state
  isAnalyzing: false,
  analysisResult: null,
  error: null,
  certificates: [],
  selectedCertificate: null,
  certificateLoading: false,
  certificateTemplates: [],
  verifications: [],
  audits: [],
  certificateBases: [],

  // Actions
  analyzeCertificateTemplate: async (file: File) => {
    console.log("🔍 [Certificate Store] Starting certificate template analysis...");
    
    set({ 
      isAnalyzing: true, 
      error: null,
      analysisResult: null 
    });

    try {
      const result = await certificateService.analyzeCertificateTemplate(file);
      
      set({ 
        isAnalyzing: false, 
        analysisResult: result,
        error: null 
      });

      console.log("✅ [Certificate Store] Analysis completed successfully");
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze certificate template";
      
      set({ 
        isAnalyzing: false, 
        error: errorMessage,
        analysisResult: null 
      });

      console.error("❌ [Certificate Store] Analysis failed:", error);
      throw error;
    }
  },

  createActivityCertificateTemplate: async (activityId: number, file: File, description?: string) => {
    console.log("🏗️ [Certificate Store] Creating certificate template for activity:", activityId);
    
    set({ 
      isAnalyzing: true, 
      error: null 
    });

    try {
      const result = await certificateService.createActivityCertificateTemplate(activityId, file, description);
      
      set({ 
        isAnalyzing: false, 
        error: null 
      });

      console.log("✅ [Certificate Store] Certificate template created successfully");
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create certificate template";
      
      set({ 
        isAnalyzing: false, 
        error: errorMessage 
      });

      console.error("❌ [Certificate Store] Certificate template creation failed:", error);
      throw error;
    }
  },

  getActivityCertificateTemplate: async (activityId: number) => {
    console.log("📥 [Certificate Store] Getting certificate template for activity:", activityId);
    
    set({ certificateLoading: true, error: null });

    try {
      const result = await certificateService.getActivityCertificateTemplate(activityId);
      
      set({ certificateLoading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get certificate template";
      
      set({ certificateLoading: false, error: errorMessage });
      throw error;
    }
  },

  createCertificate: async (data: Partial<Certificate>) => {
    console.log("📄 [Certificate Store] Creating certificate");
    
    set({ certificateLoading: true, error: null });

    try {
      const result = await certificateService.createCertificate(data);
      
      set({ 
        certificateLoading: false, 
        error: null,
        certificates: [...get().certificates, result]
      });

      console.log("✅ [Certificate Store] Certificate created successfully");
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create certificate";
      
      set({ certificateLoading: false, error: errorMessage });
      throw error;
    }
  },

  getCertificateById: async (certificateId: number) => {
    console.log("🔍 [Certificate Store] Getting certificate by ID:", certificateId);
    
    set({ certificateLoading: true, error: null });

    try {
      const result = await certificateService.getCertificateById(certificateId);
      
      set({ 
        certificateLoading: false, 
        error: null,
        selectedCertificate: result
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get certificate";
      
      set({ certificateLoading: false, error: errorMessage });
      throw error;
    }
  },

  getCertificatesByStudentId: async (studentId: number) => {
    console.log("📥 [Certificate Store] Getting certificates for student:", studentId);
    
    set({ certificateLoading: true, error: null });

    try {
      const result = await certificateService.getCertificatesByStudentId(studentId);
      
      set({ 
        certificateLoading: false, 
        error: null,
        certificates: result
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get certificates by student";
      
      set({ certificateLoading: false, error: errorMessage });
      throw error;
    }
  },

  updateCertificate: async (certificateId: number, data: Partial<Certificate>) => {
    console.log("🔧 [Certificate Store] Updating certificate:", certificateId);
    
    set({ certificateLoading: true, error: null });

    try {
      const result = await certificateService.updateCertificate(certificateId, data);
      
      set({ 
        certificateLoading: false, 
        error: null,
        certificates: get().certificates.map(cert => 
          cert.certificate_id === certificateId ? result : cert
        )
      });

      console.log("✅ [Certificate Store] Certificate updated successfully");
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update certificate";
      
      set({ certificateLoading: false, error: errorMessage });
      throw error;
    }
  },

  verifyCertificate: async (certificateId: number, file: File, templateId?: number) => {
    console.log("🔍 [Certificate Store] Verifying certificate:", certificateId);
    
    set({ certificateLoading: true, error: null });

    try {
      const result = await certificateService.verifyCertificate(certificateId, file, templateId);
      
      set({ 
        certificateLoading: false, 
        error: null,
        verifications: [...get().verifications, result]
      });

      console.log("✅ [Certificate Store] Certificate verification completed");
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to verify certificate";
      
      set({ certificateLoading: false, error: errorMessage });
      throw error;
    }
  },

  getVerificationsByCertificateId: async (certificateId: number) => {
    console.log("📥 [Certificate Store] Getting verifications for certificate:", certificateId);
    
    set({ certificateLoading: true, error: null });

    try {
      const result = await certificateService.getVerificationsByCertificateId(certificateId);
      
      set({ 
        certificateLoading: false, 
        error: null,
        verifications: result
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get verifications";
      
      set({ certificateLoading: false, error: errorMessage });
      throw error;
    }
  },

  getAuditsByCertificateId: async (certificateId: number) => {
    console.log("📥 [Certificate Store] Getting audits for certificate:", certificateId);
    
    set({ certificateLoading: true, error: null });

    try {
      const result = await certificateService.getAuditsByCertificateId(certificateId);
      
      set({ 
        certificateLoading: false, 
        error: null,
        audits: result
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get audits";
      
      set({ certificateLoading: false, error: errorMessage });
      throw error;
    }
  },

  createCertificateBase: async (data: Partial<CertificateBase>) => {
    console.log("🏗️ [Certificate Store] Creating certificate base");
    
    set({ certificateLoading: true, error: null });

    try {
      const result = await certificateService.createCertificateBase(data);
      
      set({ 
        certificateLoading: false, 
        error: null,
        certificateBases: [...get().certificateBases, result]
      });

      console.log("✅ [Certificate Store] Certificate base created successfully");
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create certificate base";
      
      set({ certificateLoading: false, error: errorMessage });
      throw error;
    }
  },

  getCertificateBaseByActivityId: async (activityId: number) => {
    console.log("🔍 [Certificate Store] Getting certificate base for activity:", activityId);
    
    set({ certificateLoading: true, error: null });

    try {
      const result = await certificateService.getCertificateBaseByActivityId(activityId);
      
      set({ 
        certificateLoading: false, 
        error: null
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get certificate base";
      
      set({ certificateLoading: false, error: errorMessage });
      throw error;
    }
  },

  getCertificateVerificationStats: async () => {
    console.log("📊 [Certificate Store] Getting certificate verification statistics");
    
    set({ certificateLoading: true, error: null });

    try {
      const result = await certificateService.getCertificateVerificationStats();
      
      set({ 
        certificateLoading: false, 
        error: null
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get verification stats";
      
      set({ certificateLoading: false, error: errorMessage });
      throw error;
    }
  },

  getPendingCertificates: async () => {
    console.log("⏳ [Certificate Store] Getting pending certificates");
    
    set({ certificateLoading: true, error: null });

    try {
      const result = await certificateService.getPendingCertificates();
      
      set({ 
        certificateLoading: false, 
        error: null,
        certificates: result
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get pending certificates";
      
      set({ certificateLoading: false, error: errorMessage });
      throw error;
    }
  },

  clearAnalysis: () => {
    set({ 
      isAnalyzing: false, 
      analysisResult: null, 
      error: null 
    });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setSelectedCertificate: (certificate: Certificate | null) => {
    set({ selectedCertificate: certificate });
  },
}));
