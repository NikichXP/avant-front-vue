<template>
  <div class="container-fluid admin-wrapper">
    <div class="row">
      <div class="col-md-12 admin-menu admin-menu-new">
        <admin-menu></admin-menu>  
      </div>
      <div class="col-md-12 admin-content">
<!--        <h4 class="admin-header">Таблицы</h4>-->
<!--        <router-link class="admin-button" to='/admin/curator/edit/new'>Добавить</router-link>-->

        <div class="admin-toolbar">
          <div class="buttons">
            <button class="admin-button" @click='changeList("archive")' v-if='buttonState == 0'>К архиву</button>
            <button class="admin-button" @click='changeList("actual")' v-else>К актуальным</button>
            <button class="admin-button" @click='openAuthMenu()'>Авторизация</button>
            <span v-if='authNeeded'>В данный момент отсутствует подключенный аккаунт</span>
            <span else>В данный момент присутствует подключенный аккаунт</span>
          </div>
        </div>
        <table class="admin-table table table-striped table-condensed">
          <thead>
            <th>
              # 
            </th>
            <th>
              ID события 
            </th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tableList" v-bind:key='item.key'>
              <td>{{index + 1}}</td>
              <td><a target="_blank" rel="noopener noreferrer" :href="'https://docs.google.com/spreadsheets/d/' + item.value">{{item.key}}</a></td>
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
  name: 'adminGSheetsComponent',
  data () {
    return {
      eventList: [],
      tableList: [],
      page: 0,
      lastPage: 0,
      pageSize: 20,
      authNeeded: false,
      buttonState: 0
    }
  },
  methods: {
    getAllEvents: function () {
      let that = this;
      
      let path = ''
      if (this.$route.path.indexOf('actual') > -1) {
        path = 'actual'
        this.buttonState = 0;
      } else {
        path = 'archive' 
        this.buttonState = 1;
      }
      
      
      let data = {
        page: this.page,
        pageSize: this.pageSize,
      };
      
      axios({
        method: 'get',
        url: '/google/sheets/' + path,
        params: data,
      })
      .then(function (response) {
        let temp = response.data.data;
        
//        console.log(temp);
        
        let keys = Object.keys(temp);
        
//        keys.forEach(e => {
//          that.tableList.push({
//            key: e,
//            value: temp[e]
//          });
//        }); 
        
//        axios({
//          method: 'get',
//          url: '/event/all',
//          params: {
//            page: 0,
//            pageSize: 10000
//          }
//        })
//        .then(function (response) {
//          that.eventList = response.data.data
//          
//          keys.forEach(e => {
//            console.log(that.eventList.find(a => a.id == e));  
//            
//            let event = that.eventList.find(a => a.id == e);
//            
//            if (event) {
//              that.tableList.push({
//                key: event.title,
//                value: temp[e]
//              });  
//            }
//            
//            
//            
//          }); 
//          
//        })
//        .catch(function (error) {
//          console.log(error);
//        }); 
        
//        console.log(that.tableList);
      })
      .catch(function (error) {
        console.log(error);
      }); 
      
      axios({
        method: 'get',
        url: '/google/auth/status',
      })
      .catch(function (error) {
        console.log(error);
        that.authNeeded = true
//        axios({
//          method: 'get',
//          url: '/google/auth/',
//        })
//        .then(function (response) {
//          console.log(response.data);
//          that.authLink = response.data 
//        })
//        .catch(function (error) {
//          console.log(error);
//        }); 
      });
      
      axios({
        method: 'get',
        url: '/google/auth/',
      })
      .then(function (response) {
        console.log(response.data);
        that.authLink = response.data 
      })
      .catch(function (error) {
        console.log(error);
      }); 
      
    },
    openEditMenu: function (path) {
      this.$router.push(path);   
    },
    getDateString: (timestamp) => {
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
    changePage: function (direction) {
      if (direction) {
        this.page++;
      } else {
        this.page--;
      }
      
      this.getAllEvents();
    },
    openAuthMenu: function () {
      window.open(this.authLink)
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
    },
    openTable: (path) => {
      window.open('https://docs.google.com/spreadsheets/d/' + path)
    },
    changeList: function (path) {
      this.$router.push('/admin/gsheets/' + path);
      this.getAllEvents();
    },
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
