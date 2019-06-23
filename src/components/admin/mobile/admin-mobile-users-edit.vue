<template>
  <div class="container-fluid admin-wrapper">
    <div class="row">
      <div class="col-md-12 admin-menu admin-menu-new">
        <admin-menu></admin-menu>  
      </div>
      <div class="col-md-12 admin-content">
        
        <!-- ОСНОВНЫЕ ПОЛЯ -->
        <h4 class="admin-header">Пользователь #{{id}}</h4>        
        <div class="edit-menu__main user-edit-flex">
          <div class="edit-menu-left">
            <div class="edit-menu__block">
              <label>Имя</label>
              <input type="text" class="edit-menu__text" v-model='client.name'>
            </div>
            <div class="edit-menu__block">
              <label>Номер телефона</label>
              <input type="text" class="edit-menu__text" v-model='client.phone'>
            </div>
            <div class="edit-menu__block">
              <label>Статус</label>
              <input type="text" class="edit-menu__text" v-model='client.access'>
            </div>
            <div class="edit-menu__block">
              <label>Бонусный счет</label>
              <input type="text" class="edit-menu__text" :value='Math.round(Math.random() * 1000)'>
            </div>  
            <div class="edit-menu__block">
              <label>Вывел денег</label>
              <input type="text" class="edit-menu__text" :value='Math.round(Math.random() * 1000)'>
            </div> 
            <div class="edit-menu__block">
              <label>Бан чата</label>
              <input type="text" class="edit-menu__text" :value='Math.random() > 0.5 ? "Да" : "Нет"'>
            </div>
          </div>  
          <div class="edit-menu-right">
            <img src="https://via.placeholder.com/800" alt="">
          </div>
          
        </div> 
        <div class="edit-menu__main">
          <div class="edit-menu__block">
            <label>Рейтинг сопровождающего</label>
            <input type="text" class="edit-menu__text" :value='Math.round(Math.random() * 1000)'>
          </div>
          <div class="edit-menu__block">
            <label>Информация о сопровождающем</label>
            <textarea class="edit-menu__text" :value='Math.round(Math.random() * 100000000)'></textarea>
          </div>
        </div> 
        <div class="edit-menu__content">
          <table class="admin-table table table-striped table-condensed">
            <thead>
              <th>
                #
              </th>
              <th>
                ID промокода 
              </th>
            </thead>
            <tbody>
                <tr v-for="(item, index) in codes" :class='{"table-unseen" : !item.seen}' :key='item.id'>
                  <td>{{index + 1}}</td>
                  <td>{{item.id}}</td>                
                </tr>
            </tbody>
          </table>
        </div>       
      </div>
    </div>
    <div class="errors" v-if='errorList.length > 0'>
      <p class="error" v-for="(e, index) in errorList" v-bind:key='index'> {{ e }} </p>
    </div>
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
import axios from '../../../lib/axios.js'
 
  
import adminMenu from './admin-mobile-menu'
  
import event from '../../../lib/eventlib'
import util from '../../../lib/util'
import admin from '../../../lib/adminlib'
import validate from '../../../lib/validatelib'
  
// TODO галочка активного события, галочка мест на дате, подключение куратора к событию

export default {
  name: 'adminMobileUsersEditComponent',
  data () {
    return {
      client: {
        name: '',
      },
      orders: [],
      errorList: [],
      codes: []
    }
  },
  props: ['id'],
  methods: {
    getEvent: function () {
        let that = this;
        
        axios({
          method: 'get',
          url: '/track/' + that.id,
        })
        .then(function (response) {

          that.client = response.data.data
//          that.getOrders(that.client.bookedOrders)
          if (that.$route.path.indexOf("moderators") > -1) that.client.access = 'Модератор'
          else that.client.access = 'Пользователь'

        })
        .catch(function (error) {
          console.log(error);
        });      
      
    },
    getOrders: function (data) {
      let that = this;
      let result = []
      
      data.forEach(e => {
        axios({
          method: 'get',
          url: '/order/order/' + e
        })
        .then(function (response) { 

//          that.orders = that.orders.concat(response.data.data);
          that.orders.push(response.data.data);
          
        })
        .catch(function (error) {
          console.log(error);
        });      
      });
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
    openEditMenu: function (path) {
      this.$router.push(path);   
    },
    generatePromoCodes: function (count) {
      for (let i = 0; i < count; i++)  
        this.codes.push({
          id: Math.round(Math.random() * 100000),
          seen: Math.random() > 0.5
        })  
       
    }

  },
  components: {
    adminMenu: adminMenu,
    VueEditor
  },
  created: function () {
    if (this.$cookies.get("accessToken")) {  
      this.checkAuth(this.$cookies.get("accessToken"));  
    } else {
      this.$router.push('/admin/');    
    }
    
    this.getEvent();
    
    this.generatePromoCodes(10);
    
  }
}

</script>

<style lang="sass" scoped>
  @import "../../../assets/sass/admin/admin.sass" 
  @import "../../../assets/sass/admin/admin-edit.sass" 
</style>
