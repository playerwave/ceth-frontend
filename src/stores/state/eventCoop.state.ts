import { EventCoop } from "../../types/eventcoop.type";

export interface EventCoopState {
  eventCoops: EventCoop[];
  selectedEventCoop: EventCoop | null;
  loading: boolean;
  error: string | null;
  eventCoopLoading: boolean;
  eventCoopError: string | null;
  eventCoop: EventCoop | null;
  searchResults: EventCoop[] | null;

  // Functions
  fetchEventCoops: () => Promise<void>;
  selectEventCoop: (id: number) => Promise<void>;
  clearSelectedEventCoop: () => void;
  createEventCoop: (eventCoop: Partial<EventCoop>) => Promise<number | undefined>;
  updateEventCoop: (eventCoop: EventCoop) => Promise<number | undefined>;
  deleteEventCoop: (id: number) => Promise<void>;
  searchEventCoops: (searchName: string) => Promise<void>;
  fetchEventCoop: (id: number) => Promise<EventCoop | null>;
  getEventCoopsByDepartment: (departmentId: number) => Promise<EventCoop[]>;
}
