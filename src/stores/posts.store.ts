import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import type { CreatePost, Post } from '../static/types';

interface PostsState {
  posts: Post[];
  post: Post | null;
  loading: boolean;
  error: string | null;
}

export const usePostsStore = defineStore('posts', {
  state: (): PostsState => ({
    posts: [],
    post: null,
    loading: false,
    error: null,
  }),

  getters: {
    allPosts: (state) => state.posts,
    postsCount: (state) => state.posts.length,

    getPostById: (state) => (id: number) => {
      return state.posts.find((post) => post.id === id);
    },
  },

  actions: {
    async fetchPosts() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get('/posts');
        this.posts = response.data.posts || response.data;
        return this.posts;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Noma'lum xatolik";
        this.error = errorMessage;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchPost(id: number) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get(`/posts/${id}`);
        this.post = response.data;
        return response.data;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Noma'lum xatolik";
        this.error = errorMessage;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createPost(postData: CreatePost) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.post('/posts', postData);
        this.posts.push(response.data);

        return response.data;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Noma'lum xatolik";
        this.error = errorMessage;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updatePost(id: number, postData: Partial<Post>) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.put(`/posts/${id}`, postData);
        const index = this.posts.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.posts[index] = response.data;
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

    async deletePost(id: number) {
      this.loading = true;
      this.error = null;

      try {
        await api.delete(`/posts/${id}`);
        this.posts = this.posts.filter((p) => p.id !== id);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Noma'lum xatolik";
        this.error = errorMessage;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async searchPosts(query: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get(`/posts/search?q=${query}`);
        this.posts = response.data;
        return response.data;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Noma'lum xatolik";
        this.error = errorMessage;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearPosts() {
      this.posts = [];
      this.post = null;
      this.error = null;
    },
  },
});
