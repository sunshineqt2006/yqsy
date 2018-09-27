// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/reset.css'
import './styles/index.less'
import './components'
import 'whatwg-fetch'
import directives from '@/utils/directives'
require('@/utils/apiHttp.js')
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(directives)
/* eslint-disable no-new */
window.$vue = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
