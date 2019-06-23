<template>
  <div class="menu-wrapper">
    <router-link to='/' class="admin-menu-logo"><img src="../../../assets/img/logo-1.png" alt=""></router-link>
    <div class="list-wrapper">
      <ul class='admin-menu-list'>
        <li :class='{"active" : $route.path.indexOf("adventures") > -1}'><router-link to='/admin/mobile/adventures' class="admin-menu-link">Авантюры</router-link></li>
        <li :class='{"active" : $route.path.indexOf("users") > -1 || $route.path.indexOf("moderators") > -1}'><router-link to='/admin/mobile/users' class="admin-menu-link">Пользователи</router-link></li>
        <li :class='{"active" : $route.path.indexOf("feedback") > -1}'><router-link to='/admin/mobile/feedback' class="admin-menu-link">Отзывы</router-link></li>
        <li :class='{"active" : $route.path.indexOf("announcements") > -1}'><router-link to='/admin/mobile/announcements' class="admin-menu-link">Объявления</router-link></li>
        <li :class='{"active" : $route.path.indexOf("censored") > -1}'><router-link to='/admin/mobile/censored' class="admin-menu-link">Запрещенные слова</router-link></li>
        <li :class='{"active" : $route.path.indexOf("bans") > -1}'><router-link to='/admin/mobile/bans' class="admin-menu-link">Забаненые пользователи</router-link></li>
        <li><router-link to='/admin/events/visible' class="admin-menu-link">Основной раздел</router-link></li>
<!--        <li><a href='' class="admin-menu-link" @click='clearCookies'>Завершить сеанс</a></li>-->
      </ul>  
<!--        <a href='' class="admin-menu-link admin-logout" @click='clearCookies'>Завершить сеанс</a>-->
       <img src="../../../assets/img/logout.png" alt="Выйти" class="admin-logout" @click='clearCookies'>
    </div>
    

  </div>
</template>

<script>
//import adminMenu from './admin-menu'
export default {
  name: 'adminMobileMenuComponent',
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
  @import "../../../assets/sass/admin/admin-menu.sass"  

  
  
</style>
