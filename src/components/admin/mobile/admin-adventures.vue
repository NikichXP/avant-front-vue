<template>
  <div class="container-fluid admin-wrapper">
    <div class="row">
      <div class="col-md-12 admin-menu admin-menu-new">
        <admin-menu></admin-menu>  
      </div>
      <div class="col-md-12 admin-content">
        <div class="admin-toolbar">
          <div class="buttons">
            <router-link class="admin-button" to='/admin/mobile/adventures/edit/new'>Добавить</router-link>
<!--
            <button class="admin-button" v-if='buttonState == 0' @click='changeList("hidden")'>К списку скрытых</button>
            <button class="admin-button" v-else @click='changeList("visible")'>К списку активных</button>
-->
          </div>
          <div class="pagination">
<!--
            <button class="admin-button" :disabled='page == 0' @click='changePage(false)'>&lt;</button>
            <span class="admin-button">{{page + 1}}</span>
            <button class="admin-button" :disabled='page == lastPage' @click='changePage(true)'>&gt;</button> 
-->
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
              Дата
            </th>
            <th>
              Куратор
            </th>
            <th>
              Активно
            </th>
          </thead>
          <tbody>
<!--            <tr v-for="(event, index) in eventsList" v-bind:key='event.id' @click="openEditMenu('/admin/event/edit/' + event.id)">-->
            <tr v-for="(adv, index) in advList" v-bind:key='adv.id' @click="openEditMenu('/admin/mobile/adventures/edit/' + adv.id)">
              <td>{{(page*pageSize) + (index + 1)}}</td>
              <td>
                {{
                  adv.title.length > 100 ? adv.title.substr(0,100) + '...' : adv.title
                }}
              </td>
              <td>{{getDateString(adv.startDate)}}</td>
              <td>{{adv.curator.name}}</td>
              <td>
                {{
                  adv.visible ? "Да" : "Нет"
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div> 
    </div>
    
    
  </div>
</template>

<script>
import axios from '../../../lib/axios.js'
 
  
import adminMenu from './admin-mobile-menu'
  
import event from '../../../lib/eventlib'
import util from '../../../lib/util' 

export default {
  name: 'adminAdventuresComponent',
  data () {
    return {
      advList: [],
      page: 0,
      lastPage: 0,
      pageSize: 20,
      buttonState: 0,
    }
  },
  methods: {
    getAllEvents: function () {
      let that = this;
      
      axios({
        method: 'get',
        url: 'admin/adventure/list',
//        headers: {
//          "token": this.$cookies.get("accessToken")
//        },
        params: {
          token: this.$cookies.get("accessToken")
        }
      })
      .then(function (response) {
        that.advList = response.data.data; 
      })
      .catch(function (error) {
        console.log(error);
      });  
    },
    openEditMenu: function (path) {
      this.$router.push(path);   
    },
    getDateString: (timestamp) => {
      if (timestamp == 'Нет') {
        return "Даты отсутствуют"
      }
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
    hasFreePlaces: (dates) => {
      
      let d = util.createTimezoneDate(Date.now());
      let minDifference = 10000000000;
      let date;
      
//      let date = dates.filter(e => e.startDateTimeStamp > d.getTime()).sort((a, b) =>  a.startDateTimeStamp - b.startDateTimeStamp)[0];  
      
      for (let i = 0; i < dates.length; i++) {
        let dif = Math.abs(dates[i].startDateTimeStamp - d.getTime())  
                
        if (dif < minDifference) {
          minDifference = dif;
          date = dates[i];
        }
      }
      
//      console.log(date);
      
      if (!date) return "Нет"
      
      if (date.places > 0) return "Есть"  
      else return "Нет"  
    },
    changeList: function (path) {
      this.$router.push('/admin/events/' + path);
      this.getAllEvents();
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
    },
  },
  components: {
    adminMenu: adminMenu,
  },
  watch: {
    state: function () {
      console.log('asdh');
    }
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
  @import "../../../assets/sass/admin/admin.sass" 
</style>
