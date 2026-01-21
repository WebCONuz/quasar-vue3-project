export type MealType =
  | 'Breakfast'
  | 'Lunch'
  | 'Dinner'
  | 'Snacks'
  | 'Beverage'
  | 'Dessert'
  | 'Side Dish';

export interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  userId: number;
  image: string;
  rating: number;
  reviewCount: number;
  mealType: MealType[];
}

export interface CreateRecipe {
  name: string;
  userId: number;
}
