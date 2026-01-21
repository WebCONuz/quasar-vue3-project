<script setup lang="ts">
import type { User } from '../../static/types';

interface PropsType {
  user: User;
}
const { user } = defineProps<PropsType>();
</script>

<template>
  <q-card class="my-card bg-grey-1" flat bordered>
    <div class="top row justify-between q-pt-sm q-px-md">
      <div class="text-overline">Gender: {{ user?.gender || '-' }}</div>
      <div class="text-overline">Age: {{ user?.age || '-' }}</div>
    </div>
    <div class="image">
      <q-img
        class="rounded-borders"
        :src="user?.image || 'https://cdn.quasar.dev/img/parallax2.jpg'"
      />
    </div>
    <div class="text-h5 q-my-xs q-px-md title">
      {{ user?.firstName || '-' + ' ' + user?.lastName || '-' }}
    </div>
    <div class="text-caption text-grey q-px-md q-pb-sm">{{ user?.userAgent || '-' }}</div>
  </q-card>
</template>

<style lang="scss">
.title {
  height: 32px;
  width: 100%;
  overflow: hidden;
}
.image {
  display: flex;
  justify-content: center;
  padding: 8px 0;
  .rounded-borders {
    border-radius: 50%;
    width: 80px;
    height: 80px;
    object-fit: cover;
  }
}
.text-grey {
  height: 68px;
  overflow: hidden;
}
</style>
