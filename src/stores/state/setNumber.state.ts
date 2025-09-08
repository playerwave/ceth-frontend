import { SetNumber } from "../../types/model";

export interface SetNumberState {
  setNumbers: SetNumber[];
  selectedSetNumber: SetNumber | null;
  setNumberLoading: boolean;
  setNumberError: string | null;

  fetchSetNumbers: () => Promise<void>;
  fetchSetNumbersByAssessment: (assessmentId: number) => Promise<void>;
  fetchSetNumberById: (id: number) => Promise<SetNumber | null>;

  createSetNumber: (data: Omit<SetNumber, "set_number_id">) => Promise<SetNumber | null>;
  updateSetNumber: (data: SetNumber) => Promise<SetNumber | null>;
  deleteSetNumber: (id: number) => Promise<SetNumber | null>;
  duplicateSetNumber: (id: number) => Promise<SetNumber | null>;
  clearSelectedSetNumber: () => void;
}
