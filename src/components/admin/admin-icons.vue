<template>
  <div class="container-fluid admin-wrapper"> 
    <div class="row">
      <div class="col-md-12 admin-menu admin-menu-new">
        <admin-menu></admin-menu>  
      </div>
      <div class="col-md-12 admin-content">
<!--        <h4 class="admin-header">Иконки событий</h4>          -->
          <div class="event-photos edit-menu__block container-fluid admin-margin-top">
            <div class="row">
              <div class="col-md-3 col-lg-2 photo" v-for="(icon, index) in icons" v-bind:key='index'>
                <button class="delete-item" @click='deleteImage(icon)'>Удалить</button>
                <img v-bind:src='imgPath + icon' alt="" class='admin-icon'>
<!--                <vector v-bind:src="imgPath + icon" alt="" class='svg svg-admin-icon'></vector>-->
              </div>
              <label class="custom-file-upload col-md-3 col-lg-2">
                <input type="file" accept="image/*" v-on:change='uploadImage'>
                <span>Загрузить</span>
              </label>
            </div>   
          </div>
<!--          <button class='admin-button' @click='validateCurator()'>Сохранить</button>-->
        </div>        
      </div>
    <div class="errors" v-if='errorList.length > 0'>
      <p class="error" v-for="(e, index) in errorList" v-bind:key='index'> {{ e }} </p>
    </div>
    <div class="success-block" v-if='successMessage.length > 0'>
      <p class="success"> {{ successMessage }} </p>
    </div>
  </div>
</template>

<script>
//import { VueEditor } from 'vue2-editor'
import axios from '../../lib/axios.js'
 
  
import adminMenu from './admin-menu'
  
import event from '../../lib/eventlib'
import util from '../../lib/util'
import admin from '../../lib/adminlib'
import validate from '../../lib/validatelib'
  
// TODO галочка активного события, галочка мест на дате, подключение куратора к событию

export default {
  name: 'adminIconsComponent',
  data () {
    return {
      icons: [],
      imgPath: 'https://avant-2.herokuapp.com/api/file/get?file=',
      errorList: [],
      successMessage: ''
    }
  },
//  props: ['id'],
  methods: {
    getEvent: function () {
      let that = this;
        
      axios({
        method: 'get',
        url: '/admin/config/icon/list',
      })
      .then(function (response) {
          
        that.icons = response.data.data;    

      })
      .catch(function (error) {
        console.log(error);
      });            
    },
    uploadImage: function (event) {
      let fileList = event.target.files;
      let that = this;
      
      for (let i = 0; i < fileList.length; i++) {
        if (!admin.isSVG(fileList[i])) continue;
        
        let data = new FormData();
        
//        data.set('file', fileList[i]);
        data.append('file', fileList[i]);
        
        axios({
          method: 'post',
          url: '/file/upload',
          data: data,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(function (response) {
          that.addIcon(response.data.data)  
        })
        .catch(function (error) {
          console.log(error);
        });      
      }
    },
    addIcon: function (url) {        
      let data = new FormData(); 
      data.append('url', url);
      let that = this;
      
      axios({
        method: 'post',
        url: '/admin/config/icon/add',
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response) {
        that.getEvent()    
      })
      .catch(function (error) {
          console.log(error);
      });          
    },
    deleteImage: function (url) {        
      let data = new FormData(); 
      data.append('url', url);
      let that = this;
      
      axios({
        method: 'post',
        url: '/admin/config/icon/remove',
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response) {
        that.getEvent()    
      })
      .catch(function (error) {
          console.log(error);
      });          
    },
    changeSuccessMessage() {
      this.successMessage = 'Готово';
      setTimeout(() => {
        this.successMessage = ''
      }, 3000);  
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
    this.getEvent();
    
  }
}

</script>

<style lang="sass" scoped>
  @import "../../assets/sass/admin/admin.sass" 
  @import "../../assets/sass/admin/admin-edit.sass" 
  .event-photos .photo
    padding: 10px
  
</style>
