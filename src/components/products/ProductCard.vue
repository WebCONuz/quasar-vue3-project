<script setup lang="ts">
import type { Product } from '../../static/types';
import { useQuasar } from 'quasar';
import { useProductsStore } from '../../stores/products.store';

// Props
const { product } = defineProps<{ product: Product }>();

// Emits
const emit = defineEmits<{
  edit: [product: Product];
  delete: [id: number];
}>();

const $q = useQuasar();
const productsStore = useProductsStore();

// Delete
const handleDelete = (product: Product) => {
  $q.dialog({
    title: 'Tasdiqlash',
    message: `"${product.title}" mahsulotini o'chirmoqchimisiz?`,
    cancel: {
      label: 'Bekor qilish',
      flat: true,
      color: 'grey-7',
    },
    ok: {
      label: "O'chirish",
      color: 'negative',
    },
    persistent: true,
  }).onOk(() => {
    void (async () => {
      try {
        await productsStore.deleteProduct(product.id);
        $q.notify({
          type: 'positive',
          message: "Mahsulot muvaffaqiyatli o'chirildi",
          position: 'top',
        });
        emit('delete', product.id);
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: "O'chirishda xatolik",
          position: 'top',
        });
        console.error('Delete error:', error);
      }
    })();
  });
};

// Edit
const handleEdit = (product: Product) => {
  emit('edit', product);
};
</script>

<template>
  <q-card class="my-card bg-grey-1" flat bordered>
    <div class="top row justify-between q-pt-sm q-px-md">
      <div class="text-overline">Status: {{ product?.availabilityStatus || '-' }}</div>
      <div>
        <!-- Edit Icon -->
        <q-icon
          name="edit"
          size="20px"
          color="positive"
          class="cursor-pointer"
          @click.stop="handleEdit(product)"
        >
          <q-tooltip>Tahrirlash</q-tooltip>
        </q-icon>

        <!-- Delete Icon -->
        <q-icon
          name="delete"
          size="20px"
          color="negative"
          class="cursor-pointer q-ml-xs"
          @click.stop="handleDelete(product)"
        >
          <q-tooltip>O'chirish</q-tooltip>
        </q-icon>
      </div>
    </div>
    <div class="text-h5 q-my-xs q-px-md title">{{ product?.title || '-' }}</div>
    <div class="main q-px-md">
      <div class="text-caption text-grey">{{ product?.description || '-' }}</div>
      <q-img
        class="rounded-borders"
        :src="product?.thumbnail || 'https://cdn.quasar.dev/img/parallax2.jpg'"
      />
    </div>
    <q-separator />
    <div class="row items-center justify-between q-pr-md">
      <q-card-actions>
        <q-btn flat color="green"> {{ product?.brand || 'brand' }} </q-btn>
        <q-btn flat color="primary"> {{ product?.category || 'category' }} </q-btn>
      </q-card-actions>
      <div class="text-h6">$ {{ product?.price || 0 }}</div>
    </div>
  </q-card>
</template>

<style lang="scss" scoped>
.title {
  height: 32px;
  width: 100%;
  overflow: hidden;
}
.main {
  display: flex;
  align-items: center;
  gap: 0 16px;
  padding-bottom: 8px;
  .text-grey {
    width: 60%;
    max-height: 160px;
    overflow: hidden;
  }
  .rounded-borders {
    width: 40%;
  }
}
</style>
