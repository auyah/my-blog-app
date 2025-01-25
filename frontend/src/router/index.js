// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Post from '../views/Post.vue';
import Comment from '../views/Comment.vue'; // 假设评论界面组件

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/post/:id',
    name: 'Post',
    component: Post
  },
  {
    path: '/comment/:postId', // 评论界面路由
    name: 'Comment',
    component: Comment
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;