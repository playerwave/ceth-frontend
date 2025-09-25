import { Certificate } from "../../types/certificate/certificate.type";

// API Response interface
export interface ApiCertificate {
  certificate_id: number;
  students_id: number;
  teacher_id?: number;
  activity_id?: number;
  date?: string;
  hours?: number;
  img?: string | null;
  status?: "Pending" | "Pass" | "Fail";
  created_at?: string;
  updated_at?: string;
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
  };
};

// Map multiple API responses to Certificate array
export const mapApiToCertificates = (apiCertificates: ApiCertificate[]): Certificate[] => {
  return apiCertificates.map(mapApiToCertificate);
};

// Map Certificate to API format
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
  };
};
