<template>
  <div class="app">
    <TLayout class="layout">
      <THeader class="header">
        <Login @login-success="handleLoginSuccess" />
      </THeader>
      <TContent v-if="loggedIn" class="content">
        <div class="post-creation">
          <TInput v-model="newPostTitle" placeholder="标题" />
          <TTextArea v-model="newPostContent" placeholder="内容" />
          <TButton @click="createPost">发布</TButton>
        </div>
        <div v-for="post in posts" :key="post.id" class="post">
          <h3>{{ post.title }} <small>by User {{ post.user_id }}</small></h3>
          <p>{{ post.content }}</p>
          <TButton @click="likePost(post.id)">{{ post.likes }} 点赞</TButton>
          <div v-for="comment in post.comments" :key="comment.id" class="comment">
            <p>{{ comment.content }} <small>by User {{ comment.user_id }}</small></p>
          </div>
          <Comment :postId="post.id" />
        </div>
      </TContent>
      <TContent v-else class="content">
        <p>请登录或注册以查看帖子。</p>
      </TContent>
    </TLayout>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Login from './components/Login.vue';
import Comment from './components/Comment.vue';
import { TLayout, THeader, TContent, TInput, TButton, TTextArea } from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';

export default {
  components: {
    TLayout,
    THeader,
    TContent,
    TInput,
    TButton,
    TTextArea,
    Login,
    Comment
  },
  setup() {
    const newPostTitle = ref('');
    const newPostContent = ref('');
    const posts = ref([]);
    const loggedIn = ref(false);
    const currentUserId = ref(null);

    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:9001/posts');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        posts.value = data;
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };

    const createPost = async () => {
      try {
        const response = await fetch('http://localhost:9001/createPost', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newPostTitle.value, content: newPostContent.value, user_id: currentUserId.value })
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log('Post created:', data);
        newPostTitle.value = '';
        newPostContent.value = '';
        fetchPosts();
      } catch (error) {
        console.error('Failed to create post:', error);
      }
    };

    const likePost = async (postId) => {
      try {
        const response = await fetch(`http://localhost:9001/likePost/${postId}`, {
          method: 'POST'
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log('Post liked:', data);
        fetchPosts();
      } catch (error) {
        console.error('Failed to like post:', error);
      }
    };

    const handleLoginSuccess = (userId) => {
      loggedIn.value = true;
      currentUserId.value = userId;
      fetchPosts();
    };

    onMounted(() => {
      if (loggedIn.value) {
        fetchPosts();
      }
    });

    return {
      newPostTitle,
      newPostContent,
      posts,
      loggedIn,
      currentUserId,
      createPost,
      likePost,
      handleLoginSuccess
    };
  }
};
</script>