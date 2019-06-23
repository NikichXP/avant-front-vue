<template>
  <div class="container-fluid admin-wrapper">
    <div class="row">
      <div class="col-md-12 admin-menu admin-menu-new">
        <admin-menu></admin-menu>  
      </div>
      <div class="col-md-12 admin-content"> 
        <h4 class="admin-header">Заказ #{{order.id}}</h4>
        
        <!-- ОСНОВНЫЕ ПОЛЯ -->
        <div class="header-wrapper">
          <h4 class="admin-header">Данные о заказе</h4>
          <router-link class='hide-block' v-bind:to='"/admin/event/edit/" + order.event.id'>Посмотреть событие</router-link>
        </div>
        <div class="edit-menu__main">
         
          <div class="edit-menu__block">
            <label>Событие</label>
            <input type="text" class="edit-menu__text" v-model='order.event.title' disabled>
          </div>
          <div class="edit-menu__block">
            <label>Дата</label>
            <input type="text" class="edit-menu__text" v-model='dateString' disabled>
          </div>
          <div class="edit-menu__block">
            <label>Цена</label>
            <input type="text" class="edit-menu__text" v-model='order.fullPrice' disabled>
          </div>
          <div class="edit-menu__block">
            <label>Аванс</label>
            <input type="text" class="edit-menu__text" v-model='order.depositPrice' disabled>
          </div>
          <div class="edit-menu__block">
            <label>Оплачено</label>
            <input type="text" class="edit-menu__text" v-model='order.orderDeposit' disabled>
          </div>
          <div class="edit-menu__block" v-if='order.comment.length > 0'>
            <label>Комментарий</label>
            <textarea class="edit-menu__text" v-model='order.comment' disabled></textarea>
          </div>
          <button class="admin-button" v-if='order.orderDeposit == 0' @click='applyPayment'>Оплата внесена наличными</button>
        </div> 
        
        <div class="header-wrapper" v-if='!newEvent'>
          <h4 class="admin-header">Данные о клиентах</h4>
        </div>   
                
        <div class="edit-menu__content">
          <div class="edit-menu__block" v-for="(item, index) in order.persons" v-bind:key='index'>
            <h4 class="edit-block__header">Персона {{index + 1}}</h4>
            <label>ФИО</label>
            <input type="text" class="edit-menu__text" v-model='item.name' disabled>
            <label>Дата рождения</label>
            <input type="text" class="edit-menu__text" v-model='item.dateStr' disabled>
            <label>Номер телефона</label>
            <input type="text" class="edit-menu__text" v-model='item.phone' disabled>
            <label>Номер</label>
            <input type="text" class="edit-menu__text" v-model='item.offerName' disabled>
            <label>Скидка</label>
            <input type="text" class="edit-menu__text" v-model='item.offerType' disabled>
            <label v-if='item.document != null'>Документ</label>
            <input type="text" class="edit-menu__text" v-model='item.document' disabled v-if='item.document != null'>
          </div>
        </div>    
      </div>
    </div>
<!--
    <div class="errors" v-if='errorList.length > 0'>
      <p class="error" v-for="(e, index) in errorList" v-bind:key='index'> {{ e }} </p>
    </div>
-->
  </div>
</template> 

<script>
//import { VueEditor } from 'vue2-editor'
import axios from '../../lib/axios.js'
 
  
import adminMenu from './admin-menu'
  
//import event from '../../lib/eventlib'
import util from '../../lib/util'
//import admin from '../../lib/adminlib'
//import validate from '../../lib/validatelib'
  

export default {
  name: 'adminOrdersEditComponent',
  data () {
    return {
      order: {
        id: '',
        event: {
          id: ''
        }
      },
      newEvent: false,
      dateString: ''
//      imgPath: 'https://avant-2.herokuapp.com/api/file/get?file=',
//      customToolbar: [
//        [{ 'header': [3, false] }],
//        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
//      ],
    }
  },
  props: ['id'],
  methods: {
    getEvent: function () {
      let that = this;
        
      axios({
        method: 'get',
        url: '/order/order/' + that.id,
        params: {
          setSeen: true,
        }
      })
      .then(function (response) { 
          
        that.order = response.data.data;
        that.dateString = that.getDateString(that.order.dateInfo.startDateTimeStamp)
        
        that.order.persons.forEach(e => {
          e.dateStr = e.birthday[2] + '.' + e.birthday[1] + '.' + e.birthday[0];
        });

      })
      .catch(function (error) {
        console.log(error);
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
    applyPayment: function () {
      let that = this;
      
      let data = new FormData();
      
      data.append('cash', this.order.fullPrice);
      data.append('id', this.order.id);
      
      axios({
        method: 'post',
        url: '/order/deposit',
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response) {
        console.log('OK'); 
        that.order = response.data.data
      }).catch(function (error) {
        console.log(error);
      });  
    }
  },
  components: {
    adminMenu: adminMenu,
//    VueEditor
  },
  created: function () {
    if (this.$cookies.get("accessToken")) {  
      this.checkAuth(this.$cookies.get("accessToken"));  
    } else {
      this.$router.push('/admin/');    
    }
    
    this.getEvent();
    
  }
}

</script>

<style lang="sass" scoped>
  @import "../../assets/sass/admin/admin.sass" 
  @import "../../assets/sass/admin/admin-edit.sass" 
</style>
