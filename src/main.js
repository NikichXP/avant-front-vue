// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import Vector from './Vector'
import MainPageIcon from './MainPageIcon'
import VuePictureSwipe from 'vue-picture-swipe';
import VueCookies from 'vue-cookies'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueCookies)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBwnArypUipk8HTIg0dd_Tf_fyawCoQVQw',
    libraries: 'places'
  },
})

Vue.component('vue-picture-swipe', VuePictureSwipe);
Vue.component('vector', Vector)
Vue.component('mp-icon', MainPageIcon)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
