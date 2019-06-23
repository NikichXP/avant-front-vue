<template>
  <div class="menu-wrapper">
    <router-link to='/' class="admin-menu-link admin-menu-back">Вернуться на сайт</router-link>
    <ul class='admin-menu-list'>
      <li><router-link to='/admin/events/visible' class="admin-menu-link">События</router-link></li>
      <li><router-link to='/admin/orders' class="admin-menu-link">Заказы</router-link></li>
      <li><router-link to='/admin/news' class="admin-menu-link">Инфо</router-link></li>
      <li><router-link to='/admin/blog' class="admin-menu-link">Чтиво</router-link></li>
      <li><router-link to='/admin/curator' class="admin-menu-link">Кураторы</router-link></li>
      <li><router-link to='/admin/clients' class="admin-menu-link">Клиенты</router-link></li>
      <li><router-link to='/admin/gsheets' class="admin-menu-link">Таблицы</router-link></li>
      <li><router-link to='/admin/icons' class="admin-menu-link">Иконки событий</router-link></li>
      <li><a href='' class="admin-menu-link" @click='clearCookies'>Завершить сеанс</a></li>
    </ul>
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
