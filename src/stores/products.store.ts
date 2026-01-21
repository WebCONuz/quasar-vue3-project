import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import type { CreateProduct, Product } from '../static/types';

interface ProductsState {
  products: Product[];
  product: Product | null;
  loading: boolean;
  error: string | null;
  categories: string[];
}

export const useProductsStore = defineStore('products', {
  state: (): ProductsState => ({
    products: [],
    product: null,
    loading: false,
    error: null,
    categories: [],
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
  },

  actions: {
    // Barcha mahsulotlarni olish (READ ALL)
    async fetchProducts() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get('/products');
        this.products = response.data.products;

        return response.data.products;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Noma'lum xatolik";
        this.error = errorMessage;
        console.log('Mahsulotlarni yuklashda xatolik');

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
        console.log('Mahsulotlarni yuklashda xatolik');
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

        console.log('Mahsulotlarni yuklashda xatolik');

        return response.data;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Noma'lum xatolik";
        this.error = errorMessage;
        console.log('Mahsulotlarni yuklashda xatolik');
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
        console.log('Mahsulot muvaffaqiyatli yangilandi');
        return response.data;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Noma'lum xatolik";
        this.error = errorMessage;
        console.log('Mahsulotlarni yuklashda xatolik');
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
        console.log("Mahsulot muvaffaqiyatli o'chirildi");
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Noma'lum xatolik";
        this.error = errorMessage;
        console.log('Mahsulotlarni yuklashda xatolik');
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Qo'shimcha: Qidirish
    async searchProducts(query: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get(`/products/search?q=${query}`);
        this.products = response.data.products;

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
        console.log('Kategoriyalarni yuklashda xatolik');
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
