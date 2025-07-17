export interface ApiFood {
  food_id: number;
  food_name: string;
  status: "Active" | "Inactive";
  faculty_id: number;
  faculty_name?: string; // ถ้า backend รวมมาด้วย
}
