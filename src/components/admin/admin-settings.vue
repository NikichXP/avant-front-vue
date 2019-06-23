<template>
  <div class="container-fluid admin-wrapper"> 
    <div class="row">
      <div class="col-md-12 admin-menu admin-menu-new">
        <admin-menu></admin-menu>  
      </div>
      <div class="col-md-12 admin-content">
        <div class="edit-menu__block">
          <label>Старый пароль</label>
          <input type="text" class="edit-menu__text" v-model='oldPass'>
        </div>
        <div class="edit-menu__block">
          <label>Новый пароль</label>
          <input type="text" class="edit-menu__text" v-model='newPass'>
        </div>
        <button class='admin-button' @click='sendPass()'>Сохранить</button>      
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
import axios from '../../lib/axios.js'
 
  
import adminMenu from './admin-menu'
  
export default {
  name: 'adminSettingsComponent',
  data () {
    return {
      oldPass: '',  
      newPass: '',  
      errorList: [],
      successMessage: ''
    }
  },
//  props: ['id'],
  methods: {
    sendPass: function () {        
      let data = new FormData(); 
      data.append('oldPass', this.oldPass);
      data.append('newPass', this.newPass);
      data.append('token', this.$cookies.get("accessToken"));
      
      let that = this;
      
      axios({
        method: 'post',
        url: '/auth/changePass',
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response) {
        console.log(response.data);  
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
  }
}

</script>

<style lang="sass" scoped>
  @import "../../assets/sass/admin/admin.sass" 
  @import "../../assets/sass/admin/admin-edit.sass" 
  .event-photos .photo
    padding: 10px
  
</style>
