import { Assessment } from "../../types/model";

export interface AssessmentState {
  assessments: Assessment[];
  selectedAssessment: Assessment | null;
  assessmentLoading: boolean;
  assessmentError: string | null;
  searchResults: Assessment[] | null;

  fetchAssessments: (type?: "latest" | "published" | "all") => Promise<void>;
  fetchAssessmentById: (id: number) => Promise<Assessment | null>;
  createAssessment?: (data: Partial<Assessment>) => Promise<void>;
  updateAssessment?: (data: Assessment) => Promise<void>;
  deleteAssessment?: (id: number) => Promise<void>;
  clearSelectedAssessment?: () => void;
  searchAssessments?: (name: string) => Promise<void>;

  duplicateAssessment: (id: number) => Promise<void>;

  // versioning
  versions?: any[];
  selectedVersion?: any | null;
  versionLoading?: boolean;
  versionError?: string | null;
  fetchVersionHistory?: (assessmentId: number) => Promise<void>;
  fetchAllVersionAssessment?: (assessmentId: number) => Promise<void>;
  fetchLatestPublishedVersion?: (assessmentId: number) => Promise<any | null>;
  fetchVersionWithFullData?: (versionId: number) => Promise<any | null>;
  createVersion?: (assessmentId: number) => Promise<void>;
  publishAssessment?: (assessmentId: number) => Promise<void>;
  setSelectedVersion?: (version: any) => void;
}
