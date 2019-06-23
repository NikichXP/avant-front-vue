<template>
  <div class="view-wrapper">
    <div class="logo-mobile">
<!--      <img src="../assets/img/logo-1.png" alt="">-->
      <router-link class='menu-img' to="/">
        <img src="../assets/img/logo3x.png" alt="">    
      </router-link> 
    </div> 

    <header class="container header">
      <h1>Чтиво</h1>
      <h4>Полезные статьи и заметки для тру авантюриста.</h4>
    </header>

    <section class="container posts">
      <div class="row">
        <div class="col-md-3 col-sm-6" v-for="(item) in postsList" v-bind:key='item.id'>
          <router-link class="post" v-bind:to="'/blog/' + item.id">
            <img v-bind:src='imgPath + item.image' alt="" class="post-image">
            <h4 class="post-text">{{item.title}}</h4>      
          </router-link>
        </div>
      </div>
    </section>
    <contact></contact>
    <mobile-social></mobile-social>
    <custom-footer></custom-footer>
  </div>
</template>

<script>
import axios from '../lib/axios.js'
 
  
import mobileSocial from './mobileSocial'
import zapFooter from './footer'
import contact from './contact'
  
export default {
  name: 'infoComponent',
  data () {
    return {
      postsList: [],
      imgPath: 'https://avant-2.herokuapp.com/api/file/get?file=',
    }
  },
//  computed: {
//    
//  },
  metaInfo() {
    return {
      title: 'Авантюристы - чтиво',
      meta: [
        { vmid: 'description', name: 'description', content: 'Блог авантюристов' }
      ]
    }
  },
  methods: {
    getPosts: function () {
      const that = this;
      
      axios({
        method: 'get',
        url: '/blog/list',
        params: {
          page: 0,
          pageSize: 10000
        }
      })
      .then(function (response) {
        that.postsList = response.data.data; 
      })
      .catch(function (error) {
        console.log(error);
      });  
    },   
    
  },
  components: {
    mobileSocial: mobileSocial,
    customFooter: zapFooter,
    contact: contact
  },
  created: function () {
    this.getPosts();  
      
  }
}

</script>

<style lang="sass" scoped>
  @import "../assets/sass/info.sass" 
  @import "../assets/sass/nav-additional.sass"  
</style>
