import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { Notify } from 'quasar';
import type { CreateRecipe, Recipe } from '../static/types';

interface RecipesState {
  recipes: Recipe[];
  recipe: Recipe | null;
  loading: boolean;
  error: string | null;
}

export const useRecipesStore = defineStore('recipes', {
  state: (): RecipesState => ({
    recipes: [],
    recipe: null,
    loading: false,
    error: null,
  }),

  getters: {
    allRecipes: (state) => state.recipes,
    recipesCount: (state) => state.recipes.length,

    getRecipeById: (state) => (id: number) => {
      return state.recipes.find((recipe) => recipe.id === id);
    },

    // Rating bo'yicha o'suvchi tartib
    recipesSortedByRatingAsc: (state) => {
      return [...state.recipes].sort((a, b) => a.rating - b.rating);
    },

    // Rating bo'yicha kamayuvchi tartib
    recipesSortedByRatingDesc: (state) => {
      return [...state.recipes].sort((a, b) => b.rating - a.rating);
    },
  },

  actions: {
    async fetchRecipes() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get('/recipes');
        this.recipes = response.data.recipes || response.data;
        return this.recipes;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Noma'lum xatolik";
        this.error = errorMessage;
        Notify.create({
          type: 'negative',
          message: 'Retseptlarni yuklashda xatolik',
          position: 'top',
        });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchRecipe(id: number) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get(`/recipes/${id}`);
        this.recipe = response.data;
        return response.data;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Noma'lum xatolik";
        this.error = errorMessage;
        Notify.create({
          type: 'negative',
          message: 'Retseptni yuklashda xatolik',
          position: 'top',
        });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createRecipe(recipeData: CreateRecipe) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.post('/recipes', recipeData);
        this.recipes.push(response.data);

        Notify.create({
          type: 'positive',
          message: "Retsept muvaffaqiyatli qo'shildi",
          position: 'top',
        });

        return response.data;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Noma'lum xatolik";
        this.error = errorMessage;
        Notify.create({
          type: 'negative',
          message: "Retseptni qo'shishda xatolik",
          position: 'top',
        });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateRecipe(id: number, recipeData: Partial<Recipe>) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.put(`/recipes/${id}`, recipeData);

        const index = this.recipes.findIndex((r) => r.id === id);
        if (index !== -1) {
          this.recipes[index] = response.data;
        }

        Notify.create({
          type: 'positive',
          message: 'Retsept muvaffaqiyatli yangilandi',
          position: 'top',
        });

        return response.data;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Noma'lum xatolik";
        this.error = errorMessage;
        Notify.create({
          type: 'negative',
          message: 'Retseptni yangilashda xatolik',
          position: 'top',
        });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteRecipe(id: number) {
      this.loading = true;
      this.error = null;

      try {
        await api.delete(`/recipes/${id}`);
        this.recipes = this.recipes.filter((r) => r.id !== id);

        Notify.create({
          type: 'positive',
          message: "Retsept muvaffaqiyatli o'chirildi",
          position: 'top',
        });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Noma'lum xatolik";
        this.error = errorMessage;
        Notify.create({
          type: 'negative',
          message: "Retseptni o'chirishda xatolik",
          position: 'top',
        });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async searchRecipes(query: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get(`/recipes/search?q=${query}`);
        this.recipes = response.data.recipes;
        return response.data.recipes;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Noma'lum xatolik";
        this.error = errorMessage;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearRecipes() {
      this.recipes = [];
      this.recipe = null;
      this.error = null;
    },
  },
});
