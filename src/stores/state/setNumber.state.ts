import { SetNumber } from "../../types/model";

export interface SetNumberState {
  setNumbers: SetNumber[];
  selectedSetNumber: SetNumber | null;
  setNumberLoading: boolean;
  setNumberError: string | null;

  fetchSetNumbers: () => Promise<void>;
  fetchSetNumbersByAssessment: (assessmentId: number) => Promise<void>;
  fetchSetNumberById: (id: number) => Promise<SetNumber | null>;
  createSetNumber: (data: Omit<SetNumber, "set_number_id">) => Promise<void>;
  updateSetNumber: (data: SetNumber) => Promise<void>;
  deleteSetNumber: (id: number) => Promise<void>;
  clearSelectedSetNumber: () => void;
}
