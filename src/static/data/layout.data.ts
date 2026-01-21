import type { EssentialLinkProps } from '../types';

// main sidebar link datas
export const linksList: EssentialLinkProps[] = [
  {
    title: 'Products',
    caption: 'All product list',
    icon: 'view_list',
    link: '/',
    exact: true,
  },
  {
    title: 'Posts',
    caption: 'All posts',
    icon: 'article',
    link: '/posts',
    exact: false,
  },
  {
    title: 'Users',
    caption: 'All users table',
    icon: 'people',
    link: '/users',
    exact: false,
  },
  {
    title: 'Recipes',
    caption: 'The most inportant recipes',
    icon: 'menu_book',
    link: '/recipes',
    exact: false,
  },
];
