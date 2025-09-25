import { Certificate } from "../../types/certificate/certificate.type";

export interface CertificateState {
  certificates: Certificate[];
  selectedCertificate: Certificate | null;
  certificateLoading: boolean;
  certificateError: string | null;
  searchResults: Certificate[] | null;

  fetchCertificates: () => Promise<void>;
  fetchCertificateById: (id: number) => Promise<Certificate | null>;
  createCertificate: (data: Partial<Certificate>) => Promise<void>;
  updateCertificate: (data: Certificate) => Promise<void>;
  deleteCertificate: (id: number) => Promise<void>;
  clearSelectedCertificate: () => void;
  searchCertificates: (name: string) => Promise<void>;
  
  // OCR specific methods
  uploadCertificate: (file: File) => Promise<any>;
  processOcrResult: (result: any) => Promise<void>;
}
