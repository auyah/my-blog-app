<template>
    <div class="comment">
      <TTextArea v-model="newComment" placeholder="评论" />
      <TButton @click="addComment(postId)">发表评论</TButton>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { TTextArea, TButton } from 'tdesign-vue-next';
  
  export default {
    props: {
      postId: {
        type: Number,
        required: true
      }
    },
    components: {
      TTextArea,
      TButton
    },
    setup(props) {
      const newComment = ref('');
  
      const addComment = async () => {
        try {
          const response = await fetch('http://localhost:9001/addComment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: newComment.value, user_id: 1, post_id: props.postId })
          });
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          console.log('Comment added:', data);
          newComment.value = ''; // 清空评论输入框
        } catch (error) {
          console.error('Failed to add comment:', error);
        }
      };
  
      return {
        newComment,
        addComment
      };
    }
  };
  </script>