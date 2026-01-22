import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import type { CreateProduct, Product } from '../static/types';

interface ProductsState {
  products: Product[];
  product: Product | null;
  loading: boolean;
  error: string | null;
  categories: string[];
  pagination: {
    total: number;
    limit: number;
    skip: number;
    currentPage: number;
  };
}

export const useProductsStore = defineStore('products', {
  state: (): ProductsState => ({
    products: [],
    product: null,
    loading: false,
    error: null,
    categories: [],
    pagination: {
      total: 0,
      limit: 12,
      skip: 0,
      currentPage: 1,
    },
  }),

  getters: {
    // Barcha mahsulotlar
    allProducts: (state) => state.products,

    // Mahsulotlar soni
    productsCount: (state) => state.products.length,

    // ID bo'yicha mahsulot topish
    getProductById: (state) => (id: number) => {
      return state.products.find((product) => product.id === id);
    },

    // Kategoriya bo'yicha filter
    getProductsByCategory: (state) => (category: string) => {
      return state.products.filter((product) => product.category === category);
    },

    // Qimmat mahsulotlar
    expensiveProducts: (state) => {
      return state.products.filter((product) => product.price > 1000);
    },

    // Narx bo'yicha o'suvchi tartib
    productsSortedByPriceAsc: (state) => {
      return [...state.products].sort((a, b) => a.price - b.price);
    },

    // Narx bo'yicha kamayuvchi tartib
    productsSortedByPriceDesc: (state) => {
      return [...state.products].sort((a, b) => b.price - a.price);
    },

    // Pagination getters
    totalPages: (state) => Math.ceil(state.pagination.total / state.pagination.limit),
  },

  actions: {
    // Barcha mahsulotlarni olish (READ ALL)
    async fetchProducts(page: number = 1) {
      this.loading = true;
      this.error = null;
      const skip = (page - 1) * this.pagination.limit;

      try {
        const response = await api.get('/products', {
          params: {
            limit: this.pagination.limit,
            skip: skip,
          },
        });

        this.products = response.data.products;
        this.pagination.total = response.data.total;
        this.pagination.skip = skip;
        this.pagination.currentPage = page;

        return response.data.products;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Noma'lum xatolik";
        this.error = errorMessage;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Bitta mahsulotni olish (READ ONE)
    async fetchProduct(id: number) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get(`/products/${id}`);
        this.product = response.data;

        return response.data;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Noma'lum xatolik";
        this.error = errorMessage;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Yangi mahsulot qo'shish (CREATE)
    async createProduct(productData: CreateProduct) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.post('/products/add', productData);
        this.products.push(response.data);

        return response.data;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Noma'lum xatolik";
        this.error = errorMessage;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Mahsulotni yangilash (UPDATE)
    async updateProduct(id: number, productData: Partial<Product>) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.put(`/products/${id}`, productData);

        // State'dagi mahsulotni yangilash
        const index = this.products.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.products[index] = response.data;
        }
        return response.data;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Noma'lum xatolik";
        this.error = errorMessage;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Mahsulotni o'chirish (DELETE)
    async deleteProduct(id: number) {
      this.loading = true;
      this.error = null;

      try {
        await api.delete(`/products/${id}`);
        // State'dan o'chirish
        this.products = this.products.filter((p) => p.id !== id);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Noma'lum xatolik";
        this.error = errorMessage;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Qo'shimcha: Qidirish (Search)
    async searchProducts(query: string, page: number = 1) {
      this.loading = true;
      this.error = null;
      const skip = (page - 1) * this.pagination.limit;

      try {
        const response = await api.get(`/products/search`, {
          params: {
            q: query,
            limit: this.pagination.limit,
            skip: skip,
          },
        });
        this.products = response.data.products;
        this.pagination.total = response.data.total;
        this.pagination.skip = skip;
        this.pagination.currentPage = page;

        return response.data.products;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Noma'lum xatolik";
        this.error = errorMessage;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // State'ni tozalash
    clearProducts() {
      this.products = [];
      this.product = null;
      this.error = null;
      this.categories = [];
    },

    // Kategoriyalar ro'yxatini olish
    async fetchCategories() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get('/products/category-list');
        this.categories = response.data;
        return response.data;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Noma'lum xatolik";
        this.error = errorMessage;
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
