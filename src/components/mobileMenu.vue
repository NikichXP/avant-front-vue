<template>
  <nav class="mobile-menu">
    <router-link to="/" v-on:click.native='toggleMobileMenu()'>
      <img src="../assets/img/logo.png" alt="" class="mobile-menu__logo">
    </router-link>
    <ul class="mobile-menu__list">
      <li class='animation' v-bind:class="{ active: activeMenuItem == 1 }" >
        <router-link to="/events" v-on:click.native='toggleMobileMenu()'>События</router-link>
      </li>
      <li class='animation' v-bind:class="{ active: activeMenuItem == 2 }" >
        <router-link to="/info" v-on:click.native='toggleMobileMenu()'>Инфо</router-link>
      </li>
      <li class='animation' v-bind:class="{ active: activeMenuItem == 3 }" >
        <router-link to="/photos" v-on:click.native='toggleMobileMenu()'>Фото</router-link>
      </li>
      <li class='animation' v-bind:class="{ active: activeMenuItem == 4 }" >
        <router-link to="/contacts" v-on:click.native='toggleMobileMenu()'>Контакты</router-link>
      </li>
    </ul>
    <div class="mobile-menu__footer">
      <div class="mobile-menu__line"></div>
      <img src="../assets/img/logo-footer.png" alt="">
    </div>
  </nav>
</template>

<script>
export default { 
  name: 'mobileMenu',
  computed: {
    activeMenuItem: {
      get: function () {
        if (this.$route.path == '/' || this.$route.path.indexOf('event') > 0) return 1
        else if (this.$route.path.indexOf('info') > 0) return 2
        else if (this.$route.path.indexOf('photos') > 0) return 3  
        else if (this.$route.path.indexOf('contacts') > 0) return 4
        else return 0;
      },
      set: function () {
        if (this.$route.path == '/' || this.$route.path.indexOf('event') > 0) return 1
        else if (this.$route.path.indexOf('info') > 0) return 2
        else if (this.$route.path.indexOf('photos') > 0) return 3  
        else if (this.$route.path.indexOf('contacts') > 0) return 4
        else return 0;  
      }
    }  
  },
  methods: {
    toggleMobileMenu: function () {
      this.$emit('closeMenu'); 
    }
  }
}

</script>

<style scoped>

</style>
