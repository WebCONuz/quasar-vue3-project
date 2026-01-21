import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/',
        name: 'proucts-page',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: '/posts',
        name: 'posts-page',
        component: () => import('pages/PostsPage.vue'),
      },
      {
        path: '/users',
        name: 'users-page',
        component: () => import('pages/UsersPage.vue'),
      },
      {
        path: '/recipes',
        name: 'recipes-page',
        component: () => import('pages/RecipesPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
