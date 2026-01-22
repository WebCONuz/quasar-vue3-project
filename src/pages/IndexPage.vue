<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useProductsStore } from '../stores/products.store';
import ProductCard from '../components/products/ProductCard.vue';
import GlobalLoader from '../components/ui/GlobalLoader.vue';
import ProductModal from '../components/products/ProductModal.vue';
import type { Product } from '../static/types';

// store-object, reactive-state and actions
const productsStore = useProductsStore();
const { products, loading, error, categories, pagination } = storeToRefs(productsStore);

// Local state
const searchQuery = ref('');
const selectedCategory = ref('all');
const priceSort = ref('none'); // 'none' | 'asc' | 'desc'

// Modal state
const showModal = ref(false);
const editingProduct = ref<Product | null>(null);

// Computed - filterlar
const filteredProducts = computed(() => {
  let result = products.value;

  // Category filter
  if (selectedCategory.value !== 'all') {
    result = productsStore.getProductsByCategory(selectedCategory.value);
  }

  // Price sort
  if (priceSort.value === 'asc') {
    result = productsStore.productsSortedByPriceAsc;
  } else if (priceSort.value === 'desc') {
    result = productsStore.productsSortedByPriceDesc;
  }

  return result;
});

// ✅ Pagination handlers
const handlePageChange = async (page: number) => {
  if (searchQuery.value.trim()) {
    await productsStore.searchProducts(searchQuery.value, page);
  } else {
    await productsStore.fetchProducts(page);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Search funksiyasi
const handleSearch = async () => {
  selectedCategory.value = 'all';
  priceSort.value = 'none';

  if (searchQuery.value.trim()) {
    await productsStore.searchProducts(searchQuery.value, 1);
  } else {
    await productsStore.fetchProducts(1);
  }
};

// Create modal
const openCreateModal = () => {
  editingProduct.value = null;
  showModal.value = true;
};

// Edit modal
const openEditModal = (product: Product) => {
  editingProduct.value = product;
  showModal.value = true;
};

// Modal success
const handleModalSuccess = async () => {
  await productsStore.fetchProducts();
};

// mounting
onMounted(() => {
  void productsStore.fetchProducts(1);
  void productsStore.fetchCategories();
});
</script>

<template>
  <q-page class="q-pa-lg">
    <!-- Header with Create Button -->
    <div class="row items-center justify-between q-mb-sm">
      <div class="text-h4 text-weight-bold">Mahsulotlar</div>
      <q-btn color="primary" icon="add" label="Yangi mahsulot" @click="openCreateModal" />
    </div>

    <!-- Filter Section -->
    <div class="text-caption q-pb-xs text-orange-5">
      Filter va Sortirovka faqat quyidagi 12 ta maxsulot uchun:
    </div>
    <div class="row q-col-gutter-md q-mb-lg">
      <!-- Search -->
      <div class="col-12 col-md-4">
        <q-input
          v-model="searchQuery"
          outlined
          dense
          placeholder="Mahsulot qidirish..."
          @keyup.enter="handleSearch"
        >
          <template v-slot:append>
            <q-icon name="search" class="cursor-pointer" @click="handleSearch" />
          </template>
        </q-input>
      </div>

      <!-- Category Filter -->
      <div class="col-12 col-md-4">
        <q-select
          v-model="selectedCategory"
          outlined
          dense
          :options="[
            { label: 'Barchasi', value: 'all' },
            ...categories.map((cat) => ({ label: cat, value: cat })),
          ]"
          option-label="label"
          option-value="value"
          emit-value
          map-options
          label="Kategoriya"
        />
      </div>

      <!-- Price Sort -->
      <div class="col-12 col-md-4">
        <q-select
          v-model="priceSort"
          outlined
          dense
          :options="[
            { label: 'Tartibsiz', value: 'none' },
            { label: 'Narx: Arzon → Qimmat', value: 'asc' },
            { label: 'Narx: Qimmat → Arzon', value: 'desc' },
          ]"
          option-label="label"
          option-value="value"
          emit-value
          map-options
          label="Tartiblash"
        />
      </div>
    </div>

    <!-- Products Grid -->
    <template v-if="loading"><global-loader /></template>
    <template v-else-if="error">
      <q-banner class="bg-negative text-white" rounded>
        <template v-slot:avatar>
          <q-icon name="error" />
        </template>
        {{ error }}
      </q-banner>
    </template>
    <template v-else>
      <div class="row q-col-gutter-lg q-row-gutter-lg">
        <div class="col-12 col-sm-6 col-md-4" v-for="product in filteredProducts" :key="product.id">
          <product-card :product="product" @edit="openEditModal" @delete="handleModalSuccess" />
        </div>
      </div>

      <!-- Natija topilmadi -->
      <div v-if="filteredProducts.length === 0" class="text-center q-mt-xl">
        <q-icon name="inbox" size="4rem" color="grey-5" />
        <p class="text-grey-7 q-mt-md">Mahsulot topilmadi</p>
      </div>

      <!-- ✅ Pagination Component -->
      <div v-if="filteredProducts.length > 0" class="q-mt-lg flex flex-center">
        <q-pagination
          v-model="pagination.currentPage"
          :max="productsStore.totalPages"
          :max-pages="6"
          direction-links
          boundary-links
          icon-first="skip_previous"
          icon-last="skip_next"
          icon-prev="fast_rewind"
          icon-next="fast_forward"
          @update:model-value="handlePageChange"
          color="primary"
        />
      </div>

      <!-- ✅ Pagination Info -->
      <div class="text-center q-mt-md text-grey-7">
        Jami: {{ pagination.total }} ta mahsulot | Sahifa {{ pagination.currentPage }} /
        {{ productsStore.totalPages }}
      </div>
    </template>

    <!-- Product Modal (Create/Edit) -->
    <product-modal
      v-model:show="showModal"
      :product="editingProduct"
      @success="handleModalSuccess"
    />
  </q-page>
</template>
