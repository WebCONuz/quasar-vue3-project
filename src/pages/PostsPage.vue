<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { usePostsStore } from '../stores/posts.store';
import PostCard from '../components/posts/PostCard.vue';
import GlobalLoader from '../components/ui/GlobalLoader.vue';

const postsStore = usePostsStore();
const { posts, loading, error } = storeToRefs(postsStore);

// Local state
const searchQuery = ref('');

// Search funksiyasi
const handleSearch = async () => {
  if (searchQuery.value.trim()) {
    await postsStore.searchPosts(searchQuery.value);
  } else {
    await postsStore.fetchPosts();
  }
};

// Mounting
onMounted(() => {
  void postsStore.fetchPosts();
});
</script>

<template>
  <q-page class="q-pa-lg">
    <!-- Filter Section -->
    <div class="row q-col-gutter-md q-mb-lg">
      <!-- Search -->
      <div class="col-12 col-md-6">
        <q-input
          v-model="searchQuery"
          outlined
          dense
          placeholder="Post qidirish..."
          @keyup.enter="handleSearch"
        >
          <template v-slot:append>
            <q-icon name="search" class="cursor-pointer" @click="handleSearch" />
          </template>
        </q-input>
      </div>
    </div>

    <!-- Posts Grid -->
    <template v-if="loading"><global-loader /></template>
    <template v-else-if="error">{{ error }}</template>
    <template v-else>
      <div class="row q-col-gutter-lg q-row-gutter-lg">
        <div class="col-12 col-sm-6" v-for="post in posts" :key="post.id">
          <post-card :post="post" />
        </div>
      </div>

      <!-- Natija topilmadi -->
      <div v-if="posts.length === 0" class="text-center q-mt-xl">
        <q-icon name="article" size="4rem" color="grey-5" />
        <p class="text-grey-7 q-mt-md">Post topilmadi</p>
      </div>
    </template>
  </q-page>
</template>
