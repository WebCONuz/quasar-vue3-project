<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { Product, CreateProduct } from '../../static/types';
import { useProductsStore } from '../../stores/products.store';
import { storeToRefs } from 'pinia';

// Props
const props = defineProps<{
  show: boolean;
  product?: Product | null; // Edit uchun
}>();

// Emits
const emit = defineEmits<{
  'update:show': [value: boolean];
  success: [];
}>();

// Store
const productsStore = useProductsStore();
const { loading, categories } = storeToRefs(productsStore);

// Local state
const form = ref<CreateProduct>({
  title: '',
  description: '',
  category: '',
  price: 0,
});

// Computed
const isEditMode = computed(() => !!props.product);
const modalTitle = computed(() => (isEditMode.value ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'));

// Form validation rules
const titleRules = [(val: string) => (val && val.length > 0) || 'Sarlavha majburiy'];
const priceRules = [(val: number) => val > 0 || "Narx musbat son bo'lishi kerak"];

// Watch props.product - edit mode uchun
watch(
  () => props.product,
  (newProduct) => {
    if (newProduct) {
      form.value = {
        title: newProduct.title,
        description: newProduct.description,
        category: newProduct.category,
        price: newProduct.price,
      };
    }
  },
  { immediate: true },
);

// Reset form
const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    category: '',
    price: 0,
  };
};

// Close modal
const closeModal = () => {
  emit('update:show', false);
  if (!isEditMode.value) {
    resetForm();
  }
};

// Submit
const onSubmit = async () => {
  try {
    if (isEditMode.value && props.product) {
      // UPDATE
      await productsStore.updateProduct(props.product.id, form.value);
    } else {
      // CREATE
      await productsStore.createProduct(form.value);
    }

    emit('success');
    closeModal();
    resetForm();
  } catch (error) {
    console.error('Submit error:', error);
  }
};
</script>

<template>
  <q-dialog :model-value="show" @update:model-value="emit('update:show', $event)" persistent>
    <q-card style="min-width: 500px">
      <!-- Header -->
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ modalTitle }}</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="closeModal" />
      </q-card-section>

      <!-- Form -->
      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <!-- Title -->
          <q-input
            v-model="form.title"
            outlined
            label="Sarlavha *"
            :rules="titleRules"
            lazy-rules
            :disable="loading"
          >
            <template v-slot:prepend>
              <q-icon name="title" />
            </template>
          </q-input>

          <!-- Description -->
          <q-input
            v-model="form.description"
            outlined
            type="textarea"
            label="Tavsif"
            rows="3"
            :disable="loading"
          >
            <template v-slot:prepend>
              <q-icon name="description" />
            </template>
          </q-input>

          <!-- Category -->
          <q-select
            v-model="form.category"
            outlined
            :options="categories"
            label="Kategoriya"
            :disable="loading"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="category" />
            </template>
          </q-select>

          <!-- Price -->
          <q-input
            v-model.number="form.price"
            outlined
            type="number"
            label="Narx *"
            :rules="priceRules"
            lazy-rules
            :disable="loading"
            prefix="$"
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" />
            </template>
          </q-input>

          <!-- Actions -->
          <div class="row q-gutter-sm justify-end">
            <q-btn
              flat
              label="Bekor qilish"
              color="grey-7"
              @click="closeModal"
              :disable="loading"
            />
            <q-btn
              type="submit"
              :label="isEditMode ? 'Yangilash' : 'Qo\'shish'"
              color="primary"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
