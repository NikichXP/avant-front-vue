<template>
  <div class="container-fluid admin-wrapper">
    <div class="row">
      <div class="col-md-12 admin-menu admin-menu-new">
        <admin-menu></admin-menu>  
      </div>
      <div class="col-md-12 admin-content">
        <h4 class="admin-header" v-if='!newEvent'>Редактирование куратора #{{id}}</h4>
        
        <!-- ОСНОВНЫЕ ПОЛЯ -->
        <h4 class="admin-header" v-else>Регистрация куратора</h4>
        <div class="edit-menu__main">
         
          <div class="edit-menu__block" v-if='newEvent'>
            <label>Email</label>
            <input type="text" class="edit-menu__text" v-model='curator.login'>
          </div>
          <div class="edit-menu__block" v-if='newEvent'>
            <label>Пароль</label>
            <input type="text" class="edit-menu__text" v-model='curator.pass'>
          </div>
          <div class="edit-menu__block">
            <label>Имя</label>
            <input type="text" class="edit-menu__text" v-model='curator.name'>
          </div>
          <div class="edit-menu__block">
            <label>Номер телефона</label>
            <input type="text" class="edit-menu__text" v-model='curator.phone'>
          </div>
          
          <div class="event-photos edit-menu__block container-fluid">
            <label class='event-photos__header'>Фото</label>
            <div class="row">
              <div class="col-md-3 col-lg-2 photo" v-if='curator.photo.length > 0'>
                <button class="delete-item" @click='deleteImage()'>Удалить</button>
                <img v-bind:src='imgPath + curator.photo' alt="">
              </div>
              <label class="custom-file-upload col-md-3 col-lg-2" v-else>
                <input type="file" accept="image/*" v-on:change='uploadImage'>
                <span>Загрузить</span>
              </label>
            </div>   
          </div>
          <button class='admin-button' @click='validateCurator()'>Сохранить</button>
        </div>        
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
import { VueEditor } from 'vue2-editor'
import axios from '../../lib/axios.js'
 
  
import adminMenu from './admin-menu'
  
import event from '../../lib/eventlib'
import util from '../../lib/util'
import admin from '../../lib/adminlib'
import validate from '../../lib/validatelib'
  
// TODO галочка активного события, галочка мест на дате, подключение куратора к событию

export default {
  name: 'adminCuratorsEditComponent',
  data () {
    return {
      curator: {
        login: '',
        pass: '',
        isAdmin: false,
        phone: '',
        name: '',
        photo: ''
      },
      newEvent: false,
      imgPath: 'https://avant-2.herokuapp.com/api/file/get?file=',
      customToolbar: [
        [{ 'header': [3, false] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ],
      errorList: [],
      successMessage: ''
    }
  },
  props: ['id'],
  methods: {
    getEvent: function () {
      if (this.$route.params.id != 'new') {
        let that = this;
        
        axios({
          method: 'get',
          url: '/user/' + that.id,
        })
        .then(function (response) {
          
          that.newEvent = false;

          that.curator.login = response.data.data.mail;
          that.curator.pass = '';
          that.curator.isAdmin = '';
          that.curator.id = response.data.data.id;
          that.curator.phone = response.data.data.phone;
          that.curator.name = response.data.data.name;
          that.curator.photo = response.data.data.photo;

        })
        .catch(function (error) {
          console.log(error);
        });      
      } else {
        this.curator.login = '';
        this.curator.pass = '';
        this.curator.isAdmin = '';
        this.newEvent = true;
      }
      
    },
    editCurator: function () {      
      let that = this;
      this.successMessage = 'В процессе...'
      
      if (this.newEvent) {
        let data = util.createFormData({
          login: this.curator.login,
          pass: this.curator.pass,
          isAdmin: true
        });
        
        axios({
          method: 'post',
          url: '/user/register',
          data: data,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(function (response) {
          console.log('OK'); 
          
          that.id = response.data.data.id;
          that.newEvent = false;
          
          let userId = response.data.data.id;
          
          let data2 = util.createFormData({
            id: that.id,
            name: that.curator.name,
            phone: that.curator.phone,
            photo: that.curator.photo,
          })
          
//          data2.append('photo', that.curator.photo);
          
          axios({
            method: 'post',
            url: '/user/setData',
            data: data2,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(function (response) {
            console.log('OK'); 
            
            axios({
              method: 'post',
              url: '/user/curator/set',
              data: util.createFormData({
                id: userId,
                isCurator: true
              }),
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }).then(function (response) {
              console.log('curator set');
              that.$router.push('/admin/curator/edit/' + response.data.data.id); 
              that.getEvent(); 
              that.changeSuccessMessage()
            })
            .catch(function (error) {
              console.log(error);
            });    
          })
          .catch(function (error) {
            console.log(error);
          }); 
        })
        .catch(function (error) {
          console.log(error);
        });  
      } else {
        let data = util.createFormData({
          id: this.curator.id,
          name: this.curator.name,
          phone: this.curator.phone,
          photo: this.curator.photo,
        });
        
        axios({
          method: 'post',
          url: '/user/setData',
          data: data,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(function (response) {
          console.log('OK'); 
          that.changeSuccessMessage()
//          that.id = response.data.data.id;
        })
        .catch(function (error) {
          console.log(error);
        }); 
      }
      
      
    },
    uploadImage: function (event) {
      let fileList = event.target.files;
      let that = this;
      
      for (let i = 0; i < fileList.length; i++) {
        if (!admin.isImage(fileList[i])) continue;
        
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
          that.curator.photo = response.data.data 
        })
        .catch(function (error) {
          console.log(error);
        });      
      }
      
    },
    uploadPhoto: function (event) {
      let fileList = event.target.files;
      let that = this;
      
      for (let i = 0; i < fileList.length; i++) {
        if (!admin.isImage(fileList[i])) continue;
        
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
          that.photos.push(response.data.data)  
          console.log(that.photos);
        })
        .catch(function (error) {
          console.log(error);
        });      
      }
      
    },
    validateCurator: function () { 
      this.errorList = []
      console.log('a');
      if (this.newEvent) {
        this.errorList = this.errorList.concat(validate.curatorReg(this.curator))   
      } else {
        this.errorList = this.errorList.concat(validate.curatorEdit(this.curator))     
      }
      
      if (this.errorList.length <= 0) {
        this.editCurator();  
      }  
    }, 
    deleteImage: function () { 
      this.curator.photo = '' 
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
    VueEditor
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
