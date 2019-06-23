<template>
  <div class="container-fluid admin-wrapper">
    <div class="row">
      <div class="col-md-4 col-md-offset-4 edit-menu__content login-menu">
        <div class="edit-menu__block">
          <h4 class="auth-header">Авторизация</h4>
          <label>Логин</label>
          <input type="text" class="edit-menu__text" v-model='login' @focus='hideError'  @keyup.enter="sendAuthData()">
          <label>Пароль</label>
          <input type="password" class="edit-menu__text" v-model='pass' @focus='hideError'  @keyup.enter="sendAuthData()">
          <p v-if='errorVisible'>Авторизация провалилась. Проверьте введенные данные</p>
        </div>
        <button class='admin-button' @click='sendAuthData()'>Войти</button>
      </div> 
    </div>
  </div>
</template>

<script>
import axios from '../../lib/axios.js'
 
  
export default {
  name: 'adminAuthComponent',
  data () {
    return {
      login: '',
      pass: '',
      errorVisible: false
    }
  },
  methods: {
    sendAuthData: function () {
      
      this.errorVisible = false;
      
      let data = new FormData();
    
      data.append('login', this.login);
      data.append('pass', this.pass);
      
      let that = this; 
        
      axios({
        method: 'post',
        url: '/auth/login',
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response) {
        that.$cookies.remove("refreshToken")
        that.$cookies.set("refreshToken", response.data.data.refreshToken, '0', '/')
        
        let d = new FormData();
        d.append('refreshToken', that.$cookies.get("refreshToken"));
        
        axios({
          method: 'post',
          url: '/auth/access',
          data: d,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(function (r) {
          that.$cookies.remove("accessToken")
          that.$cookies.set("accessToken", r.data.data.accessToken, '0', '/')
          
          that.$router.push('/admin/events/visible');  
        })
        .catch(function (error) {
          console.log(error);
        });    
      })
      .catch(function (error) {
        console.log(error);
        that.errorVisible = true;
      });    
      
//      this.$router.push('/admin/events/visible');  
    },
    hideError: function () {
      this.errorVisible = false;
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
        if (!r.data.expired) that.$router.push('/admin/events/visible');
        else {
          that.$cookies.remove("refreshToken")
          that.$cookies.remove("accessToken")  
        }
        
      })
      .catch(function (error) {
        console.log(error);
        that.$cookies.remove("refreshToken")
        that.$cookies.remove("accessToken")
      });    
    },
    submit: () => {
      console.log('a');
    }
  },
  mounted: function () {
    if (this.$cookies.get("accessToken")) {  
      console.log(this.$cookies.get("accessToken"))
      this.checkAuth(this.$cookies.get("accessToken"));  
    } 
          
  }
}

</script>

<style lang="sass" scoped>
  @import "../../assets/sass/admin/admin.sass" 
  @import "../../assets/sass/admin/admin-edit.sass" 
</style>
