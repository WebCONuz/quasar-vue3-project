<script setup lang="ts">
import type { Recipe } from '../../static/types';

interface PropsType {
  recipe: Recipe;
}
const { recipe } = defineProps<PropsType>();
</script>

<template>
  <q-card class="my-card bg-grey-1" flat bordered>
    <div class="main q-pa-md">
      <q-img
        class="rounded-borders"
        :src="recipe?.image || 'https://cdn.quasar.dev/img/parallax2.jpg'"
      />
      <div class="main__text q-pl-md">
        <div class="row">
          <div class="text-overline text-amber-7">Raiting: {{ recipe?.rating || 5 }} star</div>
          <div class="text-overline text-green q-pl-md">
            Time: {{ recipe?.prepTimeMinutes || '-' }} min
          </div>
        </div>
        <q-card-actions>
          <template v-if="recipe.mealType.length > 0">
            <q-btn
              class="bg-blue-1 text-blue-10"
              size="sm"
              v-for="meal in recipe.mealType"
              :key="meal"
            >
              {{ meal }}
            </q-btn>
          </template>
          <template v-else>
            <q-btn flat class="bg-gray"> No Meal Type </q-btn>
          </template>
        </q-card-actions>
        <div class="text-h5 q-my-xs title">{{ recipe?.name || '-' }}</div>
        <div class="text-caption text-grey">{{ recipe?.instructions?.join(' ') || '-' }}</div>

        <q-separator />
        <q-card-actions>
          <template v-if="recipe.tags.length > 0">
            <q-btn class="bg-green-2 text-green-10" v-for="tag in recipe.tags" :key="tag">
              {{ tag }}
            </q-btn>
          </template>
          <template v-else>
            <q-btn flat class="bg-red-2 text-red-10"> No Tags </q-btn>
          </template>
        </q-card-actions>
      </div>
    </div>
  </q-card>
</template>

<style lang="scss">
.title {
  height: 32px;
  width: 100%;
  overflow: hidden;
}
.main {
  display: flex;
  .rounded-borders {
    width: 35%;
    height: 300px;
    object-fit: cover;
  }
  .main__text {
    width: 65%;
    height: 100%;
    .text-grey {
      height: 120px;
      overflow: hidden;
    }
  }
}
</style>
