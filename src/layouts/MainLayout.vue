<script setup lang="ts">
import { ref } from 'vue';
import { linksList } from '../static/data';
import EssentialLink from '../components/ui/EssentialLink.vue';

const leftDrawerOpen = ref(true);
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <!-- header -->
    <q-header bordered class="bg-grey-1 text-black">
      <q-toolbar class="row items-center justify-between">
        <div class="row items-center">
          <div class="q-pr-md text-weight-bold text-h6 text-primary" v-if="!leftDrawerOpen">
            Quasar CRUD App
          </div>
          <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        </div>
        <div class="text-right">
          <div class="text-weight-bold">Muxammadi Toshtemirov</div>
          <div class="ext-weight-thin text-caption">+998(94) 542-63-07</div>
        </div>
      </q-toolbar>
    </q-header>

    <!-- left-sidebar -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-1">
      <div class="q-pb-sm q-pt-md q-px-md text-weight-bold text-h5 text-primary">
        Quasar CRUD App
      </div>
      <q-list class="q-mt-md">
        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <!-- main-content (pages) -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style lang="scss"></style>
