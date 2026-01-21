<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useUsersStore } from '../stores/users.store';
import UserCard from '../components/users/UserCard.vue';
import GlobalLoader from '../components/ui/GlobalLoader.vue';

const usersStore = useUsersStore();
const { users, loading, error } = storeToRefs(usersStore);

// Local state
const searchQuery = ref('');

// Search funksiyasi
const handleSearch = async () => {
  if (searchQuery.value.trim()) {
    await usersStore.searchUsers(searchQuery.value);
  } else {
    await usersStore.fetchUsers();
  }
};

// Mounting
onMounted(() => {
  void usersStore.fetchUsers();
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
          placeholder="Foydalanuvchi qidirish..."
          @keyup.enter="handleSearch"
        >
          <template v-slot:append>
            <q-icon name="search" class="cursor-pointer" @click="handleSearch" />
          </template>
        </q-input>
      </div>
    </div>

    <!-- Users Grid -->
    <template v-if="loading"><global-loader /></template>
    <template v-else-if="error">{{ error }}</template>
    <template v-else>
      <div class="row q-col-gutter-lg q-row-gutter-lg">
        <div class="col-12 col-sm-6 col-md-4 col-lg-3" v-for="user in users" :key="user.id">
          <user-card :user="user" />
        </div>
      </div>

      <!-- Natija topilmadi -->
      <div v-if="users.length === 0" class="text-center q-mt-xl">
        <q-icon name="person_off" size="4rem" color="grey-5" />
        <p class="text-grey-7 q-mt-md">Foydalanuvchi topilmadi</p>
      </div>
    </template>
  </q-page>
</template>
