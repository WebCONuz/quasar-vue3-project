<script setup lang="ts">
import type { Post } from '../../static/types';

interface PropsType {
  post: Post;
}
const { post } = defineProps<PropsType>();
</script>

<template>
  <q-card class="my-card bg-grey-1" flat bordered>
    <div class="top row justify-between q-pt-sm q-px-md">
      <div class="text-overline text-teal">Likes: {{ post?.reactions?.likes || 0 }}</div>
      <div class="text-overline text-orange">Dislikes: {{ post?.reactions?.dislikes || 0 }}</div>
    </div>
    <div class="text-h5 q-my-xs q-px-md title">{{ post?.title || '-' }}</div>
    <div class="text-caption text-grey q-px-md q-pb-md">{{ post?.body || '-' }}</div>

    <q-separator />
    <q-card-actions>
      <template v-if="post.tags.length > 0">
        <q-btn class="bg-green-2 text-green-10" v-for="tag in post.tags" :key="tag">
          {{ tag }}
        </q-btn>
      </template>
      <template v-else>
        <q-btn flat class="bg-red-2 text-red-10"> No Tags </q-btn>
      </template>
    </q-card-actions>
  </q-card>
</template>

<style lang="scss">
.title {
  height: 32px;
  width: 100%;
  overflow: hidden;
}
.text-grey {
  height: 136px;
  overflow: hidden;
}
</style>
