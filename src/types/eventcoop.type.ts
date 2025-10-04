export interface EventCoop {
  eventcoop_id: number;
  department_id: number;
  grade_id: number;
  date?: Date;
  remaining_days?: number;
  is_on_coop?: boolean;
  grade_name?: string;
  th_year?: string;
}
