<template>
  <div class="container-fluid admin-wrapper">
    <div class="row">
      <div class="col-md-12 admin-menu admin-menu-new">
        <admin-menu></admin-menu>  
      </div>
      <div class="col-md-12 admin-content">
<!--        <h4 class="admin-header">Инфо</h4>-->
<!--
        <router-link class="admin-button" to='/admin/news/edit/new'>Новый пост</router-link>
        <br>
-->
        <div class="admin-toolbar">
          <div class="buttons">
            <router-link class="admin-button" to='/admin/news/edit/new'>Новый пост</router-link>
          </div>
          <div class="pagination">
            <button class="admin-button" :disabled='page == 0' @click='changePage(false)'>&lt;</button>
            <span class="admin-button">{{page + 1}}</span>
            <button class="admin-button" :disabled='page == lastPage' @click='changePage(true)'>&gt;</button> 
          </div>
        </div>
        <table class="admin-table table table-striped table-condensed">
          <thead>
            <th>
              #
            </th>
            <th>
              Название
            </th>
            <th>
              Создан
            </th>
          </thead>
          <tbody>
            <tr v-for="(event, index) in eventsList" v-bind:key='event.id' @click="openEditMenu('/admin/news/edit/' + event.id)">
              <td>{{(page*pageSize) + (index + 1)}}</td>
              <td>{{event.title}}</td>
              <td>{{getDateString(event.posted)}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    
  </div>
</template>

<script>
import axios from '../../lib/axios.js'
 
  
import adminMenu from './admin-menu'
  
import event from '../../lib/eventlib'
import util from '../../lib/util'

export default {
  name: 'adminNewsComponent',
  data () {
    return {
      eventsList: [],
      page: 0,
      lastPage: 0,
      pageSize: 20,
    }
  },
  methods: {
    getAllEvents: function () {
      let that = this;
      axios({
        method: 'get',
        url: '/news/list',
        params: {
          page: this.page,
          pageSize: this.pageSize
        }
      })
      .then(function (response) {
        that.eventsList = response.data.data; 
        that.lastPage = response.data.maxPage - 1; 
      })
      .catch(function (error) {
        console.log(error);
      });     
    },
    openEditMenu: function (path) {
      this.$router.push(path);   
    },
    getDateString: (timestamp) => {
//      let d = new Date(timestamp);
//      d.setHours(d.getHours() - 1);
      let d = util.createTimezoneDate(timestamp); 
      let result = 
        (d.getHours() < 10 ? '0' + d.getHours() : d.getHours())
        + ':' 
        + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes())
        + ' '
        + (d.getDate() < 10 ? '0' + d.getDate() : d.getDate())
        + '.'
        + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1))
        + '.'
        + d.getFullYear();
      return result;
    },
    hasFreePlaces: (arg) => {
      if (arg) return "Есть"  
      else return "Нет"  
    },
    changePage: function (direction) {
      if (direction) {
        this.page++;
      } else {
        this.page--;
      }
      
      this.getAllEvents();
    },
    checkAuth: function (token) {
      let that = this;
      axios({
        method: 'get',
        url: '/auth/check',
        params: {
          token: token
        },
      }).then(function (r) {
        if (r.data.expired) that.$router.push('/admin/');  
      })
      .catch(function (error) {
        console.log(error);
        that.$router.push('/admin/');  
      });    
    }
  },
  components: {
    adminMenu: adminMenu,
  },
  created: function () {
    if (this.$cookies.get("accessToken")) {  
      this.checkAuth(this.$cookies.get("accessToken"));  
    } else {
      this.$router.push('/admin/');    
    }
    
    this.getAllEvents();     
  }
}

</script>

<style lang="sass" scoped>
  @import "../../assets/sass/admin/admin.sass" 
</style>
