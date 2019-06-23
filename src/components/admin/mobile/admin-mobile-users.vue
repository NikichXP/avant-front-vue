<template>
  <div class="container-fluid admin-wrapper">
    <div class="row">
      <div class="col-md-12 admin-menu admin-menu-new">
        <admin-menu></admin-menu>  
      </div>
      <div class="col-md-12 admin-content">
<!--        <h4 class="admin-header">Клиенты</h4>-->
<!--
        <button class="admin-button" @click='createPhoneList()'>Выгрузить телефоны</button>
        <button class="admin-button" @click='createMailList()'>Выгрузить email</button>
        <button class="admin-button" @click='exportList()'>Экспорт в xls</button>
        <a class="admin-button" :href='exportLink' target="_blank">Экспорт в xls</a>
        <br>
-->
        
<!--        <br>-->
        <div class="admin-toolbar">
          <div class="buttons">
<!--
            <button class="admin-button" @click='createPhoneList()'>Выгрузить телефоны</button>
            <button class="admin-button" @click='createMailList()'>Выгрузить email</button>
            <a class="admin-button" :href='exportLink' target="_blank">Экспорт в xls</a>  
-->
          </div>
          <div class="pagination">
            <button class="admin-button" :disabled='page == 0' @click='changePage(false)'>&lt;</button>
            <span class="admin-button">{{page + 1}}</span>
            <button class="admin-button" :disabled='page == lastPage' @click='changePage(true)'>&gt;</button> 
          </div>
        </div>
        <input type="text" class="admin-search" placeholder='Поиск' @input='getAllEvents' v-model='searchParam'>
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
            <th>
              Большие авантюры
            </th>
            <th>
              Малые авантюры
            </th>
            <th>
              Бонусный счет
            </th>
            <th>
              Активные промокоды  
            </th>
            <th>
              Доступ  
            </th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in clientList" v-bind:key='item.id' @click="openEditMenu(item.id, index)">
              <td>{{(page*pageSize) + (index + 1)}}</td>
              <td>{{item.name}}</td>
              <td>{{item.phone}}</td>
              <td>{{item.bookedOrders.length}}</td>
              <td>{{item.paidOrders.length}}</td>
              <td>{{Math.round(Math.random() * 1000)}}</td>
              <td>{{Math.round(Math.random() * 5)}}</td>
              <td>{{index == 2 ? 'Модератор' : "Пользователь"}}</td>
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

export default {
  name: 'adminMobileUsersComponent',
  data () {
    return {
      clientList: [],
      page: 0,
      lastPage: 0,
      pageSize: 20,
      phoneList: [
        {
          name: '',
          phone: ''
        }
      ],
      mailList: [
        {
          name: '',
          mails: ''
        }
      ],
      modal1: false,
      modal2: false, 

      searchParam: '',
      
      exportLink: 'https://avant-2.herokuapp.com/api' + '/track/export'
    }
  },
  methods: {
    getAllEvents: function () {
      let that = this;
            
      let data = {
        page: this.page,
        pageSize: this.pageSize,
      };
      
      // Search implemented here and a watcher is used to change page on search param change
      if (this.searchParam.length > 0) data['searchString'] = this.searchParam;  
      
      axios({
        method: 'get',
        url: '/track/all',
        params: data,
      })
      .then(function (response) {
        let temp = response.data.data;
        
        if (temp.length < 1) {
          return;
        }        
        that.clientList = temp; 
        
        that.lastPage = response.data.maxPage - 1;
      })
      .catch(function (error) {
        console.log(error);
      });    
    },
//    exportList: function () {
//      axios({
//        method: 'get',
//        url: '/track/export',
//      })
//    },
    openEditMenu: function (id, index) {
      let path = '/admin/mobile/'
      let add = 'users/'
      if (index == 2) {
        add = 'moderators/' 
      }
      
      console.log(path + add + id)
      
      this.$router.push(path + add + 'edit/' + id);   
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
    changePage: function (direction) {
      if (direction) {
        this.page++;
      } else {
        this.page--;
      }
      
      this.getAllEvents();
    },
    createPhoneList: function () {
      this.phoneList = []
      
      this.clientList.forEach(e => {
        let eventArr = [];
        let keys = Object.keys(e.orderIdToEventNameMap);
        keys.forEach(a => {
          eventArr.push(e.orderIdToEventNameMap[a])
        });
        this.phoneList.push({
          name: e.name,
          phone: e.phone,
          orders: eventArr
        });
      });  
      this.modal1 = true; 
    },
    createMailList: function () {
      this.mailList = []
      
      this.clientList.forEach(e => {
        this.mailList.push({
          name: e.name,
          mails: e.mails,
        });
      });  
      this.modal2 = true;
      console.log(this.mailList);
    },
    closeModal: function () {
      this.modal1 = false;
      this.modal2 = false;
    },
    semicolon: (i, max) => {
      console.log(i + ' - ' + max)
      if (i < max - 1) return ', '
      else return ''   
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
    getBirthDateString: function (arr) {
      let result = '';
      
      result += arr[2].toString().length == 2 ? (arr[2] + '.') : ('0' + arr[2] + '.')
      result += arr[1].toString().length == 2 ? (arr[1] + '.') : ('0' + arr[1] + '.')
      result += arr[0]
            
      return result
    },
    getAge: function (arr) {
      let result = '';
      
      let dob = '' + arr[0] + arr[1] + arr[2];
      let year = Number(dob.substr(0, 4));
      let month = Number(dob.substr(4, 2)) - 1;
      let day = Number(dob.substr(6, 2));
      let today = new Date();
      let age = today.getFullYear() - year;
      if (today.getMonth() < month || (today.getMonth() == month && today.getDate() < day)) {
        age--;
      }
      
      result += ' (' + age + ' лет)'
      
      return result
    },
  },
  components: {
    adminMenu: adminMenu,
  },
  watch: {
    searchParam: function () {
      console.log('searchstr change');
      this.page = 0;
    }
  },
  created: function () {
    this.getAllEvents();     
    
    if (this.$cookies.get("accessToken")) {  
      this.checkAuth(this.$cookies.get("accessToken"));  
    } else {
      this.$router.push('/admin/');    
    }
  }
}

</script>

<style lang="sass" scoped>
  @import "../../../assets/sass/admin/admin.sass" 
</style>
