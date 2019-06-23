<template>
  <div class="vue-wrapper">
    <div class="wrapper">
      <div class="wrapper-content" :style='{"top": "-" + this.scrollPos + "px"}'>
      <nav class="container-fluid nav" v-if="showHUD">
        <div class="container">
          <div class="row">
            <div class="col-md-3 col-md-offset-2 menu-item">
              <router-link class='menu-link' v-bind:class="{ active: activeMenuItem == 1 }" to="/events">
                <div class="menu-link__text">События</div>
                <vector src="./assets/img/icons/topmenu.svg" class="svg menu-link__markericon markericon-color" v-if='showMarker'></vector>
              </router-link>
              <router-link class='menu-link' v-bind:class="{ active: activeMenuItem == 2 }" to="/info">
                <div class="menu-link__text">Инфо</div>
                <vector src="./assets/img/icons/topmenu.svg" class="svg menu-link__markericon"></vector>
              </router-link>
            </div>
            <div class="col-md-2 menu-logo">
              <router-link class='menu-img' to="/">
                <img src="./assets/img/logo3x.png" alt="">    
              </router-link>
            </div>
            <div class="col-md-3 menu-item">
              <router-link class='menu-link' v-bind:class="{ active: activeMenuItem == 3 }" to="/photos">
                <div class="menu-link__text">Фото</div>
                <vector src="./assets/img/icons/topmenu.svg" class="svg menu-link__markericon"></vector>
              </router-link>
              <router-link class='menu-link' v-bind:class="{ active: activeMenuItem == 4 }" to="/contacts">
                <div class="menu-link__text">Контакты</div>
                <vector src="./assets/img/icons/topmenu.svg" class="svg menu-link__markericon"></vector>
              </router-link>
            </div>
          </div>
        </div>
        <div class="mobile-menu__wrapper">
          <div class="mobile-menu__toggle" @click='toggleMobileMenu()'>
            <vector src="./assets/img/icons/menu.svg" class='toggle-icon'></vector>
          </div>
          <div class="mobile-menu__overlay" @click='toggleMobileMenu()'></div>
        </div>  
      </nav>
      <transition name="fade">
        <router-view></router-view>   
      </transition>
        
      </div>
    </div>
      <mobile-menu v-if="showHUD" v-on:closeMenu='toggleMobileMenu(true)'></mobile-menu>
  </div>
</template>

<script>
import mobileMenu from '@/components/mobileMenu'

  
export default {
  name: 'App',
  data () {
    return {
      uiNeeded: true,
      mobileMenuVisible: false,
      doOnce: true,
      scrollPos: 0
    }
  },
  components: {
    mobileMenu: mobileMenu,
  },
  computed: {
    showHUD: function () {
      if (this.$route.path.indexOf('admin') < 0 && this.$route.path.indexOf('order') < 0 && this.$route.path.indexOf('payment') < 0)  
        return true;
      else return false;
    },
    activeMenuItem: {
      get: function () {
        if (this.$route.path.indexOf('events') > 0) return 0
        else if (this.$route.path == '/' || this.$route.path.indexOf('event') > 0) return 1
        else if (this.$route.path.indexOf('info') > 0) return 2
        else if (this.$route.path.indexOf('photos') > 0) return 3  
        else if (this.$route.path.indexOf('contacts') > 0) return 4
        else return 0;
      },
      set: function () {
        if (this.$route.path.indexOf('events') > 0) return 0
        else if (this.$route.path == '/' || this.$route.path.indexOf('event') > 0) return 1
        else if (this.$route.path.indexOf('info') > 0) return 2
        else if (this.$route.path.indexOf('photos') > 0) return 3  
        else if (this.$route.path.indexOf('contacts') > 0) return 4
        else return 0;  
      }
    },
    showMarker: function () {
      if (this.$route.path.indexOf('/event/') < 0) 
        return true;
      else return false;
    },
      
  },
  watch:{
    $route (to, from){
      if (this.mobileMenuVisible) this.toggleMobileMenu(true);
    }
  }, 
  methods: {
    toggleMobileMenu: function (reset) {
      // Retard code on pure js ported from jquery which destroys all concept of reactivity...
      

      
      if (reset) this.scrollPos = 0;

      const menu = document.getElementsByClassName('mobile-menu')[0]
      const overlay = document.getElementsByClassName('mobile-menu__overlay')[0]
//      const body = document.getElementsByTagName('body')[0]
      const body = document.getElementsByClassName('vue-wrapper')[0]
      const wrapper = document.getElementsByClassName('wrapper')[0]
      const wrapperContent = document.getElementsByClassName('wrapper-content')[0]
      const li = document.querySelectorAll('.mobile-menu__list li')
      
      if (!this.mobileMenuVisible) {
                
        this.scrollPos = window.pageYOffset || document.documentElement.scrollTop;
        
        menu.style.display = 'block';
        menu.style.opacity = 1;
        overlay.style.display = 'block';
        overlay.style.opacity = 0.4;
        body.classList.add('mobile-perspective');
        wrapper.classList.add('wrapper-perspective');
        wrapperContent.classList.add('active');

        li.forEach(e => {
          e.classList.remove('animation');  
        });
                
      } else {
        let sp = this.scrollPos;
        menu.style.display = 'none';
        overlay.style.opacity = 0;
        setTimeout(function() { 
          overlay.style.display = 'none';  
          body.classList.remove('mobile-perspective');
          wrapperContent.classList.remove('active');
          console.log(sp)
          window.scrollTo(0, sp);
        }, 400);
        wrapper.classList.remove('wrapper-perspective');
       
      }
      
      this.mobileMenuVisible = !this.mobileMenuVisible; 
    },
    resetScrollPos: function () {
      this.scrollPos = 0;
      console.log('a');  
    },
    whichTransitionEvent: function (selector) {
      var t, el = document.querySelector(selector);

      var transitions = {
        "transition": "transitionend",
        "OTransition": "oTransitionEnd",
        "MozTransition": "transitionend",
        "WebkitTransition": "webkitTransitionEnd"
      }

      for (t in transitions) {
        if (el.style[t] !== undefined) {
          return transitions[t];
        }
      }
    }
  }
}
</script>

<style lang="sass">
  @import "assets/sass/nav.sass" 

  .fade-enter-active, .fade-leave-active 
    transition: opacity .2s

  .fade-enter, .fade-leave-to, .fade-leave-active
    opacity: 0
</style>
