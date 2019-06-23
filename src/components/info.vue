<template>
  <div class="view-wrapper">
    <div class="logo-mobile">
      <router-link class='menu-img' to="/">
        <img src="../assets/img/logo3x.png" alt="">    
      </router-link> 
    </div> 

    <header class="container header">
      <h1>ИНФО</h1>
      <h4>Полезные статьи и заметки для тру авантюриста.</h4>
    </header>

    <section class="container posts">
      <div class="row">
        <div class="col-md-3 col-sm-6" v-for="(item) in postsList" v-bind:key='item.id'>
          <router-link class="post" v-bind:to="'/info/' + item.id">
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
  metaInfo() {
    return {
      title: 'Авантюристы - инфо',
      meta: [
        { vmid: 'description', name: 'description', content: 'Информация о событиях' }
      ]
    }
  },
//  computed: {
//    
//  },
  methods: {
    getPosts: function () {
      const that = this;
      
      axios({
        method: 'get',
        url: '/news/list',
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
    
//    let data = new FormData();
//    
//    
//    data.append('id', '52945461-bf22-4d2a-9821-3e7513033f12')
//    data.append('dateId', 'd074b223')
//    data.append('offerName', 'Good day')
//    data.append('currency', 'UAH')
//    data.append('Обычный', '50/200')
////    data.append('SSSSS', '50/167')
//    
//    axios({
//        method: 'post',
//        url: '/event/offer/set',
//        data: data,
//        headers: {
//          'Content-Type': 'multipart/form-data'
//        }
//      }).then(function (response) {
//        console.log('OK');  
//      })
//      .catch(function (error) {
//        console.log(error);
//      }); 
      
  }
}

</script>

<style lang="sass" scoped>
  @import "../assets/sass/info.sass" 
  @import "../assets/sass/nav-additional.sass"  
</style>
