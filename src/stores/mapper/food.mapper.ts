import { ApiFood } from "../api/food.api";
import { Food } from "../../types/model";

export function mapApiToFood(api: ApiFood): Food {
  return {
    food_id: api.food_id,
    food_name: api.food_name,
    status: api.status,
    faculty_id: api.faculty_id,
  };
}

export function mapApiToFoods(arr: ApiFood[]): Food[] {
  return arr.map(mapApiToFood);
}
