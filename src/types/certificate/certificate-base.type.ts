export interface CertificateBase {
  certificate_base_id: number;
  activity_id: number;
  certificate_name: string;
  certificate_source: string;
  supervisor_name1?: string | null;
  supervisor_name2?: string | null;
  claim_expiration_date?: Date | null;
}
