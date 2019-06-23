<template>
  <div class="container-fluid admin-wrapper">
    <div class="row">
      <div class="col-md-12 admin-menu admin-menu-new">
        <admin-menu></admin-menu>  
      </div>
      <div class="col-md-12 admin-content">
        <h4 class="admin-header" v-if='!newPost'>Редактирование поста #{{id}}</h4>
        
        <!-- ОСНОВНЫЕ ПОЛЯ -->
        <h4 class="admin-header" v-else>Создание поста</h4>
        <div class="edit-menu__main">
          <div class="edit-menu__block">
            <label>Название</label>
            <input type="text" class="edit-menu__text" v-model='post.title'>
          </div>
          
          <div class="event-photos edit-menu__block container-fluid">
            <label class='event-photos__header'>Обложка</label>
            <div class="row">
              <div class="col-md-3 col-lg-2 photo" v-if='post.image.length > 0'>
                <button class="delete-item" @click='deleteImage()'>Удалить</button>
                <img v-bind:src='imgPath + post.image' alt="">
              </div>
              <label class="custom-file-upload col-md-3 col-lg-2" v-else>
                <input type="file" accept="image/*" v-on:change='uploadImage'>
                <span>Загрузить</span>
              </label>
            </div>  
          </div>
          <div class="edit-menu__block post-content">
            <label>Текст</label>
            <button class="delete-item" @click='post.content = ""'>Удалить</button>
            <vue-editor v-model="post.content" :editorToolbar="customToolbar" useCustomImageHandler @imageAdded="uploadPhoto"></vue-editor>
          </div>
          <button class='admin-button' @click='validatePost()'>Сохранить</button>
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
  

export default {
  name: 'adminBlogEditComponent',
  data () {
    return {
      post: {
        title: '',
        content: '',
        image: '',
        id: ''
      },
      newPost: false,
      imgPath: 'https://avant-2.herokuapp.com/api/file/get?file=',
      customToolbar: [
        [{ 'header': [4, false] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['image', 'link'],
      ],
      errorList: [],
      successMessage: ''
    }
  },
  props: ['id'],
  methods: {
    getPost: function () {
      if (this.$route.params.id != 'new') {
        let that = this;
        axios({
          method: 'get',
          url: '/blog/' + that.id,
        })
        .then(function (response) {
          that.newPost = false;
          that.post.title = response.data.data.title;
          that.post.content = response.data.data.content;
          if (response.data.data.image != null) that.post.image = response.data.data.image;
          that.post.id = response.data.data.id;
        })
        .catch(function (error) {
          console.log(error);
        });      
      } else {
        this.post.title = '';
        this.post.content = '';
        this.post.image = '';
        this.post.id = 'new-post';  
        this.newPost = true;
      }
      
    },
    editPost: function () {
      
      let data = util.createFormData({
        title: this.post.title,
        content: this.post.content,
//        image: this.post.image
      });
      
      data.append('image', this.post.image);
      
      let that = this;
      this.successMessage = 'В процессе...'
      
      if (this.newPost) {
        axios({
          method: 'post',
          url: '/blog/create',
          data: data,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(function (response) {
          console.log('OK'); 
          that.$router.push('/admin/blog/edit/' + response.data.data.id); 
          that.newPost = false;
          that.post.id = response.data.data.id;
          that.changeSuccessMessage()
        })
        .catch(function (error) {
          console.log(error);
        });  
      } else {
//        data.set('id', this.post.id);
        data.append('id', this.post.id);
        axios({
          method: 'post',
          url: '/blog/update',
          data: data,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(function (response) {
          console.log('OK'); 
          that.changeSuccessMessage()
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
          that.post.image = response.data.data   
        })
        .catch(function (error) {
          console.log(error);
        });      
      }
      
    },
    uploadPhoto: function (file, Editor, cursorLocation, resetUploader) {
      let that = this;
      
      if (!admin.isImage(file)) return;
      
      let data = new FormData();
        
//      data.set('file', file);
      data.append('file', file);
      
      console.log(file);
        
      axios({
        method: 'post',
        url: '/file/upload',
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response) {
        let url = response.data.data 
        Editor.insertEmbed(cursorLocation, 'image', that.imgPath + url);
        resetUploader();
      })
      .catch(function (error) {
        console.log(error);
      });      
      
    },
    deleteImage: function () { 
      this.post.image = '' 
    }, 
    validatePost: function () { 
      this.errorList = []
      this.errorList = this.errorList.concat(validate.newsPost(this.post)) 
      
      if (this.errorList.length <= 0) {
        this.editPost();  
      }  
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
    
    this.getPost();
    
  }
}

</script>

<style lang="sass" scoped>
  @import "../../assets/sass/admin/admin.sass" 
  @import "../../assets/sass/admin/admin-edit.sass" 
</style>
