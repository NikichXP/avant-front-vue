<template>
  <div class="view-wrapper">
    <div class="logo-mobile">
      <img src="../assets/img/logo-1.png" alt="">
    </div>

    <section class="container">
      <div class="row">
        <div class="col-md-8 col-md-offset-2 post">
          <img v-bind:src='imgPath + post.image' alt="" class="post-image">
          <h3 class="post-header">{{post.title}}</h3>
          <div class="post-text" v-html='post.content'></div>

        </div>
      </div> 
    </section>
    <mobile-social></mobile-social>
    <custom-footer></custom-footer>
  </div>
</template>

<script>
import axios from '../lib/axios.js'
 
  
import mobileSocial from './mobileSocial'
import zapFooter from './footer'
export default {
  name: 'infoPostComponent',
  data () {
    return {
      post: {
        title: '',
        content: '',
        image: '',
        id: ''
      },
      imgPath: 'https://avant-2.herokuapp.com/api/file/get?file=',
    }
  },
  metaInfo() {
    return {
      title: this.post.title,
      meta: [
        { vmid: 'description', name: 'description', content: 'Авантюристы - не совсем туристы' }
      ]
    }
  },
//  computed: {
//    
//  },
  methods: {
    getPost: function () {
      let that = this;
      axios({
        method: 'get',
        url: '/blog/' + this.$route.params.id,
      })
      .then(function (response) {
        that.post.title = response.data.data.title;
        that.post.content = response.data.data.content;
        that.post.image = response.data.data.image;
        that.post.id = response.data.data.id;
      })
      .catch(function (error) {
        console.log(error);
      });       
    },  
  },
  components: {
    mobileSocial: mobileSocial,
    customFooter: zapFooter,
  },
  created: function () {
    this.getPost()  
      
  }
}

</script>

<style lang="sass" scoped>
  @import "../assets/sass/info-post.sass" 
  @import "../assets/sass/nav-additional.sass"  
</style>
