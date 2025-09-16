export interface AssessmentVersion {
  assessment_version_id: number;
  assessment_id: number;
  version_no: number;
  is_published: boolean;
  published_at?: Date | null;
  created_at: Date;
}
