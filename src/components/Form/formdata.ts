
export interface FormData {
  activityName: string;
  companyOrSpeaker: string;
  description: string;
  category: string;
  roomFloor: string;
  roomNumber: string;
  status: string;
  seats: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  foodOptions: string[];
  selectedFoods: string[];
  evaluationType: string;
  file: File | null;
}

  

  export const defaultFormData: FormData = {
    activityName: "",
    companyOrSpeaker: "",
    description: "",
    category: "Soft Skill",
    roomFloor: "",
    roomNumber: "",
    status: "Private",
    seats: "0",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    foodOptions: ["เมนู 1", "เมนู 2"],
    selectedFoods: [],
    evaluationType: "แบบประเมิน 1",
    file: null,
  };
  