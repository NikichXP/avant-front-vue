<template>
  <div class="container-fluid admin-wrapper">
    <div class="row">
      <div class="col-md-12 admin-menu admin-menu-new">
        <admin-menu></admin-menu>  
      </div>
      <div class="col-md-12 admin-content">
<!--        <h4 class="admin-header">Кураторы</h4>-->
<!--        <router-link class="admin-button" to='/admin/curator/edit/new'>Добавить</router-link>-->
        <div class="admin-toolbar">
          <div class="buttons">
            <router-link class="admin-button" to='/admin/curator/edit/new'>Добавить</router-link>
          </div>
          
        </div>
        <table class="admin-table table table-striped table-condensed">
          <thead>
            <th>
              #
            </th>
            <th>
              Имя
            </th>
            <th>
              Номер
            </th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in curList" v-bind:key='item.id' @click="openEditMenu('/admin/curator/edit/' + item.id)">
              <td>{{index + 1}}</td>
              <td>{{item.name}}</td>
              <td>{{item.phone}}</td>
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

export default {
  name: 'adminCuratorsComponent',
  data () {
    return {
      curList: []
    }
  },
  methods: {
    getAllEvents: function () {
      let that = this;
      axios({
        method: 'get',
        url: '/user/curators',

      })
      .then(function (response) {
        let temp = response.data.data;
        
        if (temp.length < 1) {
          return;
        }        
        that.curList = temp; 
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
      let d = util.createTimezoneDate(date); 
      
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
