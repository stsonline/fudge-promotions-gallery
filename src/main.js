import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.config.silent = true

new Vue({
  render: h => h(App),
}).$mount('#fugePromotionsGalleryApp')
