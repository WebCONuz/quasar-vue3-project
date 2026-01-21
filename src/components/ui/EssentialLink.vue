<template>
  <q-item clickable :to="link" :exact="exact">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" size="sm" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-h6">{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import type { EssentialLinkProps } from '../../static/types';

withDefaults(defineProps<EssentialLinkProps>(), {
  caption: '',
  link: '#',
  icon: '',
});
</script>
