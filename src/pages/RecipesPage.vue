<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import RecipeCard from '../components/recipes/RecipeCard.vue';
import GlobalLoader from '../components/ui/GlobalLoader.vue';
import { useRecipesStore } from '../stores/recipe.store';

const recipesStore = useRecipesStore();
const { recipes, loading, error } = storeToRefs(recipesStore);

// Local state
const searchQuery = ref('');
const ratingSort = ref('none'); // 'none' | 'asc' | 'desc'

// Computed - filterlar
const filteredRecipes = computed(() => {
  let result = recipes.value;

  // Rating sort
  if (ratingSort.value === 'asc') {
    result = recipesStore.recipesSortedByRatingAsc;
  } else if (ratingSort.value === 'desc') {
    result = recipesStore.recipesSortedByRatingDesc;
  }

  return result;
});

// Search funksiyasi
const handleSearch = async () => {
  if (searchQuery.value.trim()) {
    await recipesStore.searchRecipes(searchQuery.value);
  } else {
    await recipesStore.fetchRecipes();
  }
};

// Mounting
onMounted(() => {
  void recipesStore.fetchRecipes();
});
</script>

<template>
  <q-page class="q-pa-lg">
    <!-- Filter Section -->
    <div class="row q-col-gutter-md q-mb-lg">
      <!-- Search -->
      <div class="col-12 col-md-4">
        <q-input
          v-model="searchQuery"
          outlined
          dense
          placeholder="Retsept qidirish..."
          @keyup.enter="handleSearch"
        >
          <template v-slot:append>
            <q-icon name="search" class="cursor-pointer" @click="handleSearch" />
          </template>
        </q-input>
      </div>

      <!-- Rating Sort -->
      <div class="col-12 col-md-4">
        <q-select
          v-model="ratingSort"
          outlined
          dense
          :options="[
            { label: 'Tartibsiz', value: 'none' },
            { label: 'Rating: Past → Yuqori', value: 'asc' },
            { label: 'Rating: Yuqori → Past', value: 'desc' },
          ]"
          option-label="label"
          option-value="value"
          emit-value
          map-options
          label="Tartiblash"
        />
      </div>
    </div>

    <!-- Recipes Grid -->
    <template v-if="loading"><global-loader /></template>
    <template v-else-if="error">{{ error }}</template>
    <template v-else>
      <div class="row q-col-gutter-lg">
        <div class="col-12" v-for="recipe in filteredRecipes" :key="recipe.id">
          <recipe-card :recipe="recipe" />
        </div>
      </div>

      <!-- Natija topilmadi -->
      <div v-if="filteredRecipes.length === 0" class="text-center q-mt-xl">
        <q-icon name="restaurant" size="4rem" color="grey-5" />
        <p class="text-grey-7 q-mt-md">Retsept topilmadi</p>
      </div>
    </template>
  </q-page>
</template>
