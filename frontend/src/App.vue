<template>
  <div class="app">
    <!-- 使用 TLayout 进行布局 -->
    <TLayout class="layout">
      <!-- 头部区域，包含登录和注册按钮 -->
      <THeader class="header">
        <TInput v-model="username" placeholder="用户名" />
        <TInput v-model="email" placeholder="邮箱" />
        <TInput v-model="password" type="password" placeholder="密码" />
        <TButton @click="login">登录</TButton>
        <TButton @click="register">注册</TButton>
      </THeader>

      <!-- 内容区域，根据登录状态显示不同内容 -->
      <TContent v-if="loggedIn" class="content">
        <!-- 帖子创建区域 -->
        <div class="post-creation">
          <TInput v-model="newPostTitle" placeholder="标题" />
          <TTextArea v-model="newPostContent" placeholder="内容" />
          <TButton @click="createPost">发布</TButton>
        </div>

        <!-- 帖子列表区域 -->
        <div v-for="post in posts" :key="post.id" class="post">
          <h3>{{ post.title }} <small>by User {{ post.user_id }}</small></h3>
          <p>{{ post.content }}</p>
          <TButton @click="likePost(post.id)">{{ post.likes }} 点赞</TButton>
          <!-- 评论列表 -->
          <div v-for="comment in post.comments" :key="comment.id" class="comment">
            <p>{{ comment.content }} <small>by User {{ comment.user_id }}</small></p>
          </div>
          <!-- 发表评论区域 -->
          <TTextArea v-model="newComment" placeholder="评论" />
          <TButton @click="addComment(post.id)">发表评论</TButton>
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
import { TLayout, THeader, TContent, TInput, TButton, TTextArea } from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';

export default {
  components: {
    // 注册组件
    TLayout,
    THeader,
    TContent,
    TInput,
    TButton,
    TTextArea
  },
  setup() {
    // 定义响应式变量
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const newPostTitle = ref('');
    const newPostContent = ref('');
    const newComment = ref('');
    const posts = ref([]);
    const loggedIn = ref(false);
    const currentUserId = ref(null);

    // 获取帖子列表
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

    //注册用户
    const register = async () => {
      try {
        const response = await fetch('http://localhost:9001/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: username.value, email: email.value, password: password.value})
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error registering:', errorData);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Registration successful:', data);
      } catch (error) {
        console.error('Failed to register:', error);
      }
    };

    //用户登录
    const login = async () => {
      try {
        const response = await fetch('http://localhost:9001/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.value, password: password.value })
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.message === 'Login successful') {
          loggedIn.value = true;
          currentUserId.value = data.user_id;
          fetchPosts();
        } else {
          console.error('Login failed:', data.message);
        }
      } catch (error) {
        console.error('Failed to login:', error);
      }
    };
    //创建帖子
    const createPost = async () => {
      try {
        const response = await fetch('http://localhost:9001/createPost', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newPostTitle.value, content: newPostContent.value, user_id: currentUserId.value })
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        console.log('Post creation successful');
        fetchPosts();
      } catch (error) {
        console.error('Failed to create post:', error);
      }
    };
    //评论
    const addComment = async (postId) => {
      try {
        const response = await fetch('http://localhost:9001/addComment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: newComment.value, user_id: currentUserId.value, post_id: postId })
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        console.log('Comment added successfully');
        fetchPosts();
      } catch (error) {
        console.error('Failed to add comment:', error);
      }
    };
    //点赞
    const likePost = async (postId) => {
      try {
        const response = await fetch(`http://localhost:9001/likePost/${postId}`, { method: 'POST' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        console.log('Post liked successfully');
        fetchPosts();
      } catch (error) {
        console.error('Failed to like post:', error);
      }
    };
    //组件挂载时获取帖子列表
    onMounted(() => {
      fetchPosts();
    });
    //返回响应式变量和方法
    return {
      username,
      email,
      password,
      newPostTitle,
      newPostContent,
      newComment,
      posts,
      loggedIn,
      register,
      login,
      createPost,
      addComment,
      likePost
    };
  }
};
</script>

<style scoped>
.app {
  font-family: Arial, sans-serif;
}

/* 布局样式 */
.layout {
  min-height: 100vh; /* 视口高度 */
  display: flex;
  flex-direction: column;
}

/* 头部样式 */
.header {
  background-color: #f0f0f0;
  padding: 10px;
  text-align: center; /* 居中对齐 */
}

/* 内容区域样式 */
.content {
  flex: 1; /* 占据剩余空间 */
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center; /* 居中对齐 */
}

/* 帖子创建区域样式 */
.post-creation {
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
}

/* 帖子列表项样式 */
.post {
  width: 100%;
  max-width: 600px;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px; /* 圆角 */
}

/* 评论样式 */
.comment {
  background-color: #f9f9f9;
  padding: 5px;
  margin-top: 5px;
  border-radius: 3px; /* 圆角 */
}
</style>