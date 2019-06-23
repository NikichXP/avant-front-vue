<template>
  <div class="menu-wrapper">
    <router-link to='/' class="admin-menu-logo"><img src="../../assets/img/logo-1.png" alt=""></router-link>
    <div class="list-wrapper">
      <ul class='admin-menu-list'>
        <li :class='{"active" : $route.path.indexOf("event") > -1}'><router-link to='/admin/events/visible' class="admin-menu-link">События</router-link></li>
        <li :class='{"active" : $route.path.indexOf("news") > -1}'><router-link to='/admin/news' class="admin-menu-link">Инфо</router-link></li>
        <li :class='{"active" : $route.path.indexOf("blog") > -1}'><router-link to='/admin/blog' class="admin-menu-link admin-menu-margin">Чтиво</router-link></li>
        
        <li :class='{"active" : $route.path.indexOf("orders") > -1}'><router-link to='/admin/orders' class="admin-menu-link">Заказы</router-link></li>
        <li :class='{"active" : $route.path.indexOf("clients") > -1}'><router-link to='/admin/clients' class="admin-menu-link">Клиенты</router-link></li>
        <li :class='{"active" : $route.path.indexOf("gsheets") > -1}'><router-link to='/admin/gsheets/actual' class="admin-menu-link admin-menu-margin">Таблицы</router-link></li>
        
        <li :class='{"active" : $route.path.indexOf("curator") > -1}'><router-link to='/admin/curator' class="admin-menu-link">Кураторы</router-link></li>
        <li :class='{"active" : $route.path.indexOf("icons") > -1}'><router-link to='/admin/icons' class="admin-menu-link">Иконки событий</router-link></li>
        <li><router-link to='/admin/mobile/adventures' class="admin-menu-link">Мобильный раздел</router-link></li>
<!--        <li><a href='' class="admin-menu-link" @click='clearCookies'>Завершить сеанс</a></li>-->
      </ul>  
<!--        <a href='' class="admin-menu-link admin-logout" @click='clearCookies'>Завершить сеанс</a>-->
      <router-link to='/admin/settings'><img src="../../assets/img/gear-loading.png" alt="Настройки" title="Настройки" class="admin-logout"></router-link>
      <img src="../../assets/img/logout.png" alt="Выйти" title="Выйти" class="admin-logout" @click='clearCookies'>
    </div>
    

  </div>
</template>

<script>
import adminMenu from './admin-menu'
export default {
  name: 'adminMenuComponent',
  data () {
    return {
//      gifLink: ""  
    }
  },
//  computed: {
//    
//  },
  methods: {
    clearCookies: function () {
      this.$cookies.remove("refreshToken")
      this.$cookies.remove("accessToken")
      console.log('cookies removed');
      this.$router.push('/admin/'); 
    }    
  }
//  mounted: function () {
//    let d = new Date();
//    this.gifLink = "../assets/img/main-screen-gif-no-loop.gif?nocache" + d.getTime();
//      
//  }
}

</script>

<style lang="sass" scoped>
  @import "../../assets/sass/admin/admin-menu.sass"  

  
  
</style>
