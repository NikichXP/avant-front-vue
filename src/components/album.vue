<template>
  <div class="view-wrapper">
    <div class="logo-mobile">
      <img src="../assets/img/logo-1.png" alt="">
    </div>

    <header class="container header">
      <h1>{{title}}</h1>
    </header>

    <section class="container photos">
<!--
      <div class="row">
        <div class="col-md-2 col-xs-6 image" v-for="photo in album" v-bind:key='photo.id'>
          <img v-bind:src="photo.sizes[0].src" alt="">
        </div>
      </div>
-->
      <vue-picture-swipe :items="galImages" :galleryType='type'></vue-picture-swipe>
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
  name: 'albumComponent',
//  props: ['id'],
  data () {
    return {
      album: [],
      galImages: [
        {
          src: '',
          thumbnail: '',
        }
      ],
      type: 'album',
      title: 'Альбом',
      description: 'Пустой'
    }
  },
  metaInfo() {
    return {
      title: this.title,
      meta: [
        { vmid: 'description', name: 'description', content: this.description || this.title }
      ]
    }
  },
//  computed: {
//    
//  },
  methods: {
    getPost: function () {
      const that = this;
      
      axios({
        method: 'get',
        url: '/photos/album/' + this.$route.params.id,
      })
      .then(function (response) {
        that.title = response.data.status.title; 
        that.description = response.data.status.description; 
                
      })
      .catch(function (error) {
        console.log(error);
      });  
      
      axios({
        method: 'get',
        url: '/photos/album/content',
        params: {
          albumId: this.$route.params.id,
        }
      })
      .then(function (response) {
        that.album = response.data.status; 
        
        that.galImages = [];
        
        that.album.forEach(e => {
          that.galImages.push({
            src: that.imagePath(e.sizes[e.sizes.length - 1].src),
            thumbnail: that.imagePath(e.sizes[3].src), 
            w: e.sizes[e.sizes.length - 1].width,
            h: e.sizes[e.sizes.length - 1].height
          });
        });
        
      })
      .catch(function (error) {
        console.log(error);
      });  
    }, 
    morePosts: function () {
      this.skip++;
      console.log(this.skip);
      this.getPosts()
    }, 
    imagePath: (img) => {
      return 'https://avant-2.herokuapp.com/api/proxy/img?path=' + img;
    }
  },
  components: {
    mobileSocial: mobileSocial,
    customFooter: zapFooter,
    contact: contact
  },
  created: function () {
    this.getPost();  
      
  }
}

</script>

<style lang="sass" scoped>
  @import "../assets/sass/album.sass" 
  @import "../assets/sass/nav-additional.sass"  
</style>
