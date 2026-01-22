<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // ✅ Router qo'shish
import { storeToRefs } from 'pinia';
import { useProductsStore } from '../stores/products.store';
import ProductCard from '../components/products/ProductCard.vue';
import GlobalLoader from '../components/ui/GlobalLoader.vue';
import ProductModal from '../components/products/ProductModal.vue';
import type { Product } from '../static/types';

const route = useRoute(); // ✅ Current route
const router = useRouter(); // ✅ Router navigation

const productsStore = useProductsStore();
const { products, loading, error, categories, pagination } = storeToRefs(productsStore);

// ✅ Local state - URL query params'dan o'qiladi
const searchQuery = ref('');
const selectedCategory = ref('all');
const priceSort = ref('none');

const showModal = ref(false);
const editingProduct = ref<Product | null>(null);

// ✅ URL ni yangilash funksiyasi
const updateURL = (params: Record<string, string | number>) => {
  void router.push({
    query: {
      ...route.query,
      ...params,
    },
  });
};

// ✅ URL'dan state'ni tiklash
const restoreStateFromURL = () => {
  const query = route.query;

  // Page
  const page = query.page ? Number(query.page) : 1;

  // Search
  searchQuery.value = (query.search as string) || '';

  // Category
  selectedCategory.value = (query.category as string) || 'all';

  // Sort
  priceSort.value = (query.sort as string) || 'none';

  return { page, search: searchQuery.value };
};

// Sort uchun computed
const sortedProducts = computed(() => {
  if (priceSort.value === 'asc') {
    return [...products.value].sort((a, b) => a.price - b.price);
  } else if (priceSort.value === 'desc') {
    return [...products.value].sort((a, b) => b.price - a.price);
  }
  return products.value;
});

// ✅ Search
const handleSearch = async () => {
  selectedCategory.value = 'all';
  priceSort.value = 'none';

  updateURL({
    search: searchQuery.value,
    page: 1,
    category: 'all',
    sort: 'none',
  });

  if (searchQuery.value.trim()) {
    await productsStore.searchProducts(searchQuery.value, 1);
  } else {
    await productsStore.fetchProducts(1);
  }
};

// ✅ Category change
const handleCategoryChange = async () => {
  searchQuery.value = '';
  priceSort.value = 'none';

  updateURL({
    category: selectedCategory.value,
    page: 1,
    search: '',
    sort: 'none',
  });

  await productsStore.fetchProducts(1);
};

// ✅ Sort change
const handleSortChange = () => {
  searchQuery.value = '';
  selectedCategory.value = 'all';

  updateURL({
    sort: priceSort.value,
    page: 1,
    search: '',
    category: 'all',
  });
};

// ✅ Pagination
const handlePageChange = async (page: number) => {
  updateURL({ page });

  if (searchQuery.value.trim()) {
    await productsStore.searchProducts(searchQuery.value, page);
  } else {
    await productsStore.fetchProducts(page);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
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
  const currentPage = pagination.value.currentPage;

  if (searchQuery.value.trim()) {
    await productsStore.searchProducts(searchQuery.value, currentPage);
  } else {
    await productsStore.fetchProducts(currentPage);
  }
};

// ✅ Mounting - URL'dan state tiklash
onMounted(async () => {
  const { page, search } = restoreStateFromURL();

  await productsStore.fetchCategories();

  if (search) {
    await productsStore.searchProducts(search, page);
  } else {
    await productsStore.fetchProducts(page);
  }
});

// ✅ Watch route changes (back/forward button uchun)
watch(
  () => route.query,
  async (newQuery) => {
    const page = newQuery.page ? Number(newQuery.page) : 1;
    const search = (newQuery.search as string) || '';

    // Local state'ni yangilash
    searchQuery.value = search;
    selectedCategory.value = (newQuery.category as string) || 'all';
    priceSort.value = (newQuery.sort as string) || 'none';

    // Data yuklash
    if (search) {
      await productsStore.searchProducts(search, page);
    } else {
      await productsStore.fetchProducts(page);
    }
  },
);
</script>

<template>
  <q-page class="q-pa-lg">
    <!-- Header with Create Button -->
    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h4 text-weight-bold">Mahsulotlar</div>
      <q-btn color="primary" icon="add" label="Yangi mahsulot" @click="openCreateModal" />
    </div>

    <!-- Filter Section -->
    <div class="row q-col-gutter-md q-mb-lg">
      <!-- Search -->
      <div class="col-12 col-md-4">
        <q-input
          v-model="searchQuery"
          outlined
          dense
          placeholder="Mahsulot qidirish..."
          @keyup.enter="handleSearch"
          clearable
          @clear="handleSearch"
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
          @update:model-value="handleCategoryChange"
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
          @update:model-value="handleSortChange"
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
        <div class="col-12 col-sm-6 col-md-4" v-for="product in sortedProducts" :key="product.id">
          <product-card :product="product" @edit="openEditModal" @delete="handleModalSuccess" />
        </div>
      </div>

      <!-- Natija topilmadi -->
      <div v-if="sortedProducts.length === 0" class="text-center q-mt-xl">
        <q-icon name="inbox" size="4rem" color="grey-5" />
        <p class="text-grey-7 q-mt-md">Mahsulot topilmadi</p>
      </div>

      <!-- Pagination -->
      <div v-if="sortedProducts.length > 0" class="q-mt-lg flex flex-center">
        <q-pagination
          :model-value="pagination.currentPage"
          :max="productsStore.totalPages"
          :max-pages="6"
          direction-links
          boundary-links
          @update:model-value="handlePageChange"
          color="primary"
        />
      </div>

      <!-- Pagination Info -->
      <div class="text-center q-mt-md text-grey-7">
        Jami: {{ pagination.total }} ta mahsulot | Sahifa {{ pagination.currentPage }} /
        {{ productsStore.totalPages }}
      </div>
    </template>

    <!-- Product Modal -->
    <product-modal
      v-model:show="showModal"
      :product="editingProduct"
      @success="handleModalSuccess"
    />
  </q-page>
</template>
