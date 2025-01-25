import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'tdesign-vue-next/es/style/index.css'; // 引入 TDesign 样式
import TDesign from 'tdesign-vue-next'; // 引入 TDesign 组件库

const app = createApp(App);

app.use(router);
app.use(store);
app.use(TDesign);

app.mount('#app');