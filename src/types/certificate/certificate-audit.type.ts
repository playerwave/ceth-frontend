export interface CertificateAudit {
  audit_id: number;
  certificate_id: number;
  action: string;
  old_values?: any;
  new_values?: any;
  reason?: string;
  performed_by: string;
  performed_at: Date;
}
