<template> 
  <div class="view-wrapper">
    <div class="logo-mobile">
      <img src="../assets/img/logo-1.png" alt="">
    </div>

    <header class="container header">
      <h1>ФОТО</h1>
      <h4>Много фотографий из наших поездок!</h4>
    </header>

    <section class="container photos">
      <div class="row">
       
        <div class="col-md-4 col-sm-6" v-for="album in albumsList" v-bind:key='album.id'>
          <router-link class="album" v-bind:to="'/photos/' + album.id">
            <img v-bind:src="imagePath(album.sizes[2].src)" alt="" class="album-image">
            <h4 class="album-text">{{ album.title }}</h4>
          </router-link>
        </div>
        
        
      </div>
    </section>

    <button class="button-more" @click='morePosts'>Больше альбомов</button>
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
  name: 'photosComponent',
  data () {
    return {
      albumsList: [],
      imgPath: 'https://avant-2.herokuapp.com/api/file/get?file=',
      limit: 15,
      skip: 0
    }
  },
  metaInfo() {
    return {
      title: 'Авантюристы - фото',
      meta: [
        { vmid: 'description', name: 'description', content: 'Фотографии с наших мероприятий' }
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
        url: '/photos/album/list',
        params: {
          limit: this.limit,
          skip: this.skip * this.limit
        }
      })
      .then(function (response) {
        that.albumsList = that.albumsList.concat(response.data.status); 
        
      })
      .catch(function (error) {
        console.log(error);
      });  
    }, 
    morePosts: function () {
      this.skip++;
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
    this.getPosts();        
  }
}

</script>

<style lang="sass" scoped>
  @import "../assets/sass/photos.sass" 
  @import "../assets/sass/nav-additional.sass"  
</style>
