export interface SetNumberVersion {
  set_number_version_id: number;
  assessment_version_id: number;
  order_index: number;
  name: string;
  description?: string;
  created_at: Date;
}
