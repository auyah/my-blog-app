<template>
    <div class="login">
      <TInput v-model="username" placeholder="用户名" />
      <TInput v-model="email" placeholder="邮箱" />
      <TInput v-model="password" type="password" placeholder="密码" />
      <TButton @click="login">登录</TButton>
      <TButton @click="register">注册</TButton>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { TInput, TButton } from 'tdesign-vue-next';
  
  export default {
    components: {
      TInput,
      TButton
    },
    setup() {
      const username = ref('');
      const email = ref('');
      const password = ref('');
  
      const register = async () => {
        try {
          const response = await fetch('http://localhost:9001/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username.value, email: email.value, password: password.value })
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
            // 登录成功后可以通过事件总线或Vuex来传递登录状态和用户ID
            // 这里简单示例，实际项目中建议使用更合适的状态管理方式
            this.$emit('login-success', data.user_id);
          } else {
            console.error('Login failed:', data.message);
          }
        } catch (error) {
          console.error('Failed to login:', error);
        }
      };
  
      return {
        username,
        email,
        password,
        register,
        login
      };
    }
  };
  </script>