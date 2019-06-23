<template>
  <div class="container-fluid admin-wrapper">
    <div class="row">
      <div class="col-md-12 admin-menu admin-menu-new">
        <admin-menu></admin-menu>  
      </div>

      <div class="col-md-12 admin-content">   
           
        <div class="admin-toolbar" :class="{'admin-toolbar-sticky' : toolbarFixed}">
          <div class="buttons">
<!--            <button class='admin-button' @click='toggleActivation()' v-if='!newAdv'>{{ activateButtonText }}</button>-->
<!--            <button class='admin-button' @click='toggleBookable()' v-if='!newAdv'>{{ bookableButtonText }}</button>-->
<!--            <router-link class='admin-button' v-bind:to='createEventLink(event)' v-if='date.id != "newdate" && event.id != "new-event"'>Показать на сайте</router-link>-->
            <button class='admin-button' @click='editAdventure()'>Сохранить</button>
          </div>
          <div class="pagination" v-if='toolbarFixed'>
            <button class='admin-button' @click='scrollTop()'>Вверх</button>  
          </div>

        </div>
        
        <h4 class="admin-header" v-if='!newAdv'>Редактирование авантюры #{{id}}</h4>
        <h4 class="admin-header" v-else>Создание авантюры</h4>

        
        <!-- ОСНОВНЫЕ ПОЛЯ -->
        <div class="edit-menu__main">
          <div class="edit-menu__block">
            <label>Название</label>
            <input type="text" class="edit-menu__text input-title" v-model='adventure.title'>
          </div>
          
          <div class="edit-menu__block">
            <label class='event-photos__header'>Куратор</label>
            <select class='edit-menu__select' v-model='curatorChosen'>
              <option v-for="cur in curatorList" v-bind:value="cur.id" v-bind:key="cur.id">
                {{ cur.name + ' (' + cur.phone + ')' }}
              </option>
            </select>
          </div>
          
          <div class="edit-menu__dates">
                <div class="edit-menu__block">        
                  <div class="date-block">
                    <label>Дата начала</label>
                    <input type="text" class="date-block__text day" v-model='date.startDateObj.day'>  /
                    <input type="text" class="date-block__text month" v-model='date.startDateObj.month'> / 
                    <input type="text" class="date-block__text year" v-model='date.startDateObj.year'>  
                    <input type="text" class="date-block__text hours" v-model='date.startDateObj.hours'> : 
                    <input type="text" class="date-block__text minutes" v-model='date.startDateObj.minutes'> 
                  </div>
                  <div class="date-block">
                    <label>Дата конца</label>
                    <input type="text" class="date-block__text day" v-model='date.endDateObj.day'>  /
                    <input type="text" class="date-block__text month" v-model='date.endDateObj.month'> / 
                    <input type="text" class="date-block__text year" v-model='date.endDateObj.year'>  
                    <input type="text" class="date-block__text hours" v-model='date.endDateObj.hours'> : 
                    <input type="text" class="date-block__text minutes" v-model='date.endDateObj.minutes'>  
                  </div>
              </div>
        </div>
          
          <div class="edit-menu__block">
            <label class='event-photos__header'>Описание(Взять с собой?)</label>
            <vue-editor v-model="adventure.takeWithYourself" :editorToolbar="customToolbar" id="adv-desc"></vue-editor>
          </div>
                              
        </div>
              
              
        <div class="edit-tabs__container">
          <div class="edit-tabs__header">
            <div class="tab-header admin-button" @click='tabActive = 1' :class='{"active" : tabActive == 1}'>
              Локация
            </div> 
            <div class="tab-header admin-button" @click='tabActive = 2' :class='{"active" : tabActive == 2}'>
              Контент
            </div>    
            <div class="tab-header admin-button" @click='tabActive = 3' :class='{"active" : tabActive == 3}' v-if='!newAdv'>
              Пользователи
            </div>     
          </div>
        </div> 
     
        <div class="edit-tabs">
            <div class="edit-tab" v-show='tabActive == 1'>
              <div class="edit-menu__block">
                <label class='event-photos__header'>Локация</label>
                <div class="map-form">
                  <input type="text" class="edit-menu__text input-title" v-model='locationText' disabled>
                  <button class='admin-button map-hide' @click='mapHidden = !mapHidden'>{{ mapHidden ? 'Скрыть карту' : 'Показать карту' }}</button>    
                </div>
              </div>
              <div class="map-container">
                <GmapMap
                  style="width: 100%; height: 800px;"
                  :center="{lat: 46.486636, lng: 30.730328}"
                  :zoom="16"
                  map-type-id="terrain"
                  v-bind:options="mapStyle"

                  @click="getMarkerPosition($event.latLng)"
                  @tilesloaded="searchLocation"
                  v-if='mapHidden'
                >
                  <GmapMarker
                    :position="mapPos"
                    :clickable="true"
                    :draggable="true"

                    @dragend="getMarkerPosition($event.latLng)"
                  />
                </GmapMap>
              </div>  
            </div>
            <div class="edit-tab" v-show='tabActive == 2' v-if='!newAdv'>
              <div class="edit-menu__content">
                <div class="edit-menu__block" v-for="(item, index) in adventure.info" v-bind:key='index'>
                  <h4 class="edit-block__header">#{{index + 1}}</h4>
<!--                  <button class="delete-item" @click='deleteContent(index)'>Удалить</button>-->
                  
                  <label>Название</label>
                  <input type="text" class="edit-menu__text" v-model='item.title'>
                  
                  <div class="event-photos edit-menu__block container-fluid">
                    <label>Иконка</label>
                    <div class="row">
                      <div class="col-md-1 col-lg-1 photo icon" v-for="(icon, index) in icons" v-bind:key='index'
                      v-bind:class='{"chosen": icon == item.icon}' @click='chooseIcon(icon)'>
                        <img v-bind:src='imgPath + icon' alt="" class='admin-icon'>
                      </div>
                    </div>  
                  </div>
                  
                  <div class="event-photos container-fluid">
                    <label>Фото</label>
                    <div class="row">
                      <div class="col-md-3 col-lg-2 photo" v-for="(img, index) in item.content" v-bind:key='index'>
                        <button class="delete-item" @click='deleteImage(1, index)'>Удалить</button>
                        <img v-bind:src='img' alt="">
                      </div>
                      <div class="custom-file-upload col-md-3 col-lg-2">
                        <input type="file" accept="image/*" v-on:change='uploadImage' multiple='true'>
                        <span>Загрузить</span>
                      </div>
                    </div>  
                  </div>
                  
                </div>
                <button class='admin-button' @click='moreContent()'>Добавить</button>
      <!--          <button class='admin-button' @click='validateContent()'>Сохранить</button>-->
              </div> 
            </div>
            <div class="edit-tab" v-show='tabActive == 3' v-if='!newAdv'>
              <div class="user-list container-fluid">
                <div class="row">
                  <div class="col-md-2 user-card" v-for="(user, index) in userList" v-bind:key='user.id'>
                    <span class="user-card-name">{{user.name}}</span>  
                    <span class="user-card-phone">{{user.phone}}</span>  
                    <button class="delete-item" @click='deleteUser(index)'>Удалить</button>
                  </div>
                </div>
              </div>
              <div class="admin-toolbar" v-if='clientList.length > 0'>
                <div class="buttons"></div>
                <div class="pagination">
                  <button class="admin-button" :disabled='page == 0' @click='changePage(false)'>&lt;</button>
                  <span class="admin-button">{{page + 1}}</span>
                  <button class="admin-button" :disabled='page == lastPage' @click='changePage(true)'>&gt;</button> 
                </div>
              </div>
              <input type="text" class="admin-search" placeholder='Поиск' @input='getClients' v-model='searchParam'>
              <table class="admin-table table table-striped table-condensed" v-if='clientList.length > 0'>
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
                </thead>
                <tbody>
                  <tr v-for="(item, index) in clientList" v-bind:key='item.id' @click="addUser(item)">
                    <td>{{(page*pageSize) + (index + 1)}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.phone}}</td>
                  </tr>
                </tbody>
              </table>  
            </div>
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
import axios from '../../../lib/axios.js'
 
  
import adminMenu from './admin-mobile-menu'
  
import event from '../../../lib/eventlib'
import util from '../../../lib/util'
import admin from '../../../lib/adminlib'
import validate from '../../../lib/validatelib'
  

export default {
  name: 'adminAdventuresEditComponent',
  data () {
    return {
      adventure: {},
      date: {
        startDateObj: this.getDateObj(Date.now(), false),
        endDateObj: this.getDateObj(Date.now(), false),
      },
      curatorChosen: '',
      curatorList: [],
      newAdv: false,
      imgPath: 'https://avant-2.herokuapp.com/api/file/get?file=',
      icons: [
        ''
      ],
      customToolbar: [
        [{ 'header': [3, false] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ],
      customToolbar2: [
        ['bold', 'italic', 'underline'],
      ],
      errorList: [],
      requestInProcess: false,
      activateButtonText: '',
      bookableButtonText: '',
      successMessage: '',
      toolbarFixed: false,
      tabActive: 1,
      mapStyle: {
        styles: [
      {
          "featureType": "landscape",
          "elementType": "geometry",
          "stylers": [
              {
                  "hue": "#f3f4f4"
              },
              {
                  "saturation": -84
              },
              {
                  "lightness": 59
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "landscape",
          "elementType": "labels",
          "stylers": [
              {
                  "hue": "#ffffff"
              },
              {
                  "saturation": -100
              },
              {
                  "lightness": 100
              },
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "landscape.man_made",
          "elementType": "geometry",
          "stylers": [
              {
                  "lightness": "37"
              }
          ]
      },
      {
          "featureType": "poi",
          "elementType": "all",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
              {
                  "saturation": "33"
              },
              {
                  "lightness": "83"
              },
              {
                  "visibility": "on"
              },
              {
                  "gamma": "0.33"
              },
              {
                  "color": "#e0f2ba"
              }
          ]
      },
      {
          "featureType": "poi.school",
          "elementType": "all",
          "stylers": [
              {
                  "hue": "#d7e4e4"
              },
              {
                  "saturation": -60
              },
              {
                  "lightness": 23
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "road",
          "elementType": "all",
          "stylers": [
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
              {
                  "hue": "#ffffff"
              },
              {
                  "saturation": -100
              },
              {
                  "lightness": 100
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "road",
          "elementType": "labels",
          "stylers": [
              {
                  "hue": "#bbbbbb"
              },
              {
                  "saturation": -100
              },
              {
                  "lightness": 26
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
              {
                  "hue": "#ffcc00"
              },
              {
                  "saturation": 100
              },
              {
                  "lightness": -22
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
              {
                  "hue": "#ffcc00"
              },
              {
                  "saturation": 100
              },
              {
                  "lightness": -35
              },
              {
                  "visibility": "simplified"
              }
          ]
      },
      {
          "featureType": "road.local",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "visibility": "on"
              },
              {
                  "saturation": "55"
              },
              {
                  "lightness": "-9"
              },
              {
                  "color": "#faf4d8"
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "all",
          "stylers": [
              {
                  "hue": "#00a9ff"
              },
              {
                  "saturation": 55
              },
              {
                  "lightness": -6
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "labels",
          "stylers": [
              {
                  "hue": "#7fc8ed"
              },
              {
                  "saturation": 55
              },
              {
                  "lightness": -6
              },
              {
                  "visibility": "off"
              }
          ]
      }
  ]
      },
      mapHidden: true,
      mapPos: {
        lat: 46.486636, 
        lng: 30.730328
      },
      mapAddress: '',
      userList: [],
      clientList: [],
      page: 0,
      lastPage: 0,
      pageSize: 10,
      searchParam: '',
    }
  },
  props: ['id'],
  methods: {
    getEvent: function () {
      if (this.$route.params.id != 'new') {
        let that = this;
        axios({
          method: 'get',
          url: 'admin/adventure/' + this.id,
  //        headers: {
  //          "token": this.$cookies.get("accessToken")
  //        },
          params: {
            token: this.$cookies.get("accessToken")
          }
        })
        .then(function (response) {
          that.adventure = response.data.data;

          that.curatorChosen = that.adventure.curator.id
          
          that.date.startDateObj = that.getDateObj(that.adventure.startDate, true)
          that.date.endDateObj = that.getDateObj(that.adventure.endDate, true)
        })
        .catch(function (error) {
          console.log(error);
        });    
               
      } else {
        this.newAdv = true 
      }
    },
    getIcons: function () {
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
    getClients: function () {
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
    getCurators: function () {
      let that = this;
      axios({
        method: 'get',
        url: '/user/curators',

      })
      .then(function (response) {
        let temp = response.data.data;
        
        if (temp.length < 1) {
          return;
        }        
        that.curatorList = temp; 
      })
      .catch(function (error) {
        console.log(error);
      });    
    },
    editAdventure: function () {
      let that = this;
      
      this.successMessage = 'Обработка авантюры...'
      
      let path = 'create'
      
      if (!this.newAdv) path = this.id
      
      let data = new FormData();
      data.append('title', this.adventure.title);  
      data.append('curatorId', this.curatorChosen);  
      data.append('startDate', admin.createDate(this.date.startDateObj));  
      data.append('endDate', admin.createDate(this.date.endDateObj));  
      data.append('geoX', this.mapPos.lat);  
      data.append('geoY', this.mapPos.lng);  
      data.append('address', this.mapAddress);  
      data.append('description', this.adventure.takeWithYourself);  
      
      this.requestInProcess = true;
      
      axios({
        method: 'post',
        url: '/admin/adventure/' + path,
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response) {   
        console.log('event ok');
        
        that.requestInProcess = false; 
        
        if (that.newAdv) {
          that.id = response.data.data.id;
          that.newAdv = false;
        } else {
//          that.editContent()
          that.editUsers()
        }
                
        that.changeSuccessMessage()
        
          
        
        

      })
      .catch(function (error) {
        console.log(error);
      });   
      
      
    },
    editContent: function () {
      let that = this;
      
      this.successMessage = 'Обработка контента...'
      
      let path = this.id
      
      this.adventure.info.filter(e => e.new).forEach(e => {
        let data = new FormData();
        data.append('icon', e.icon);  
        data.append('title', e.title);  
        data.append('content', admin.createImagesString(e.content));  
        
        this.requestInProcess = true;
      
        axios({
          method: 'post',
          url: '/admin/adventure/' + path + '/content/add',
          data: data,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(function (response) {   
          console.log('content ok');

          that.changeSuccessMessage()

          that.requestInProcess = false;   
        })
        .catch(function (error) {
          console.log(error);
        });   
      })
       
    },
    editUsers: function () {
      let that = this;
      
      this.successMessage = 'Обработка пользователей...'
      
      let path = this.id
      
//      this.userList.filter(e => e.new).forEach(e => {
      this.userList.forEach(e => {
        let data = new FormData();
        data.append('userId', e.id);  
        
        this.requestInProcess = true;
        
        console.log(e)
      
        axios({
          method: 'post',
          url: '/admin/adventure/' + path + '/user/add',
          data: data,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(function (response) {   
          console.log('users ok');

          that.changeSuccessMessage()

          that.requestInProcess = false;   
        })
        .catch(function (error) {
          console.log(error);
        });   
      })
       
    },
    changeSuccessMessage() {
      this.successMessage = 'Готово';
      setTimeout(() => {
        this.successMessage = ''
        this.getEvent()
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
    },
    handleScroll: function () {
      var scrollPos = window.pageYOffset || document.documentElement.scrollTop;  
      
      if (scrollPos >  60) this.toolbarFixed = true
      else this.toolbarFixed = false
    },
    scrollTop: function () {
      window.scrollTo(0, 0)
    },
    getMarkerPosition: function (data) {
      this.mapPos.lng = data.lng()
      this.mapPos.lat = data.lat()
      this.searchLocation()
    },
    searchLocation: function() {
      let that = this;
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        'latLng': this.mapPos
      }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
//            console.log(results[1]);
            that.mapAddress = results[1].formatted_address
          } else {
            console.log('No results found');
          }
        } else {
          console.log('Geocoder failed due to: ' + status);
        }
      });
    },
    getDateObj: (timestamp, convert) => {
      let d;
      if (convert) {
        d = util.createTimezoneDate(timestamp);  
      } else {
        d = new Date(timestamp);  
      }     

      return {
        day: (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()),
        month: ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)),
        year: d.getFullYear(),
        hours: (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()),
        minutes: (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes())
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
          that.event.images.push(response.data.data)  
        })
        .catch(function (error) {
          console.log(error);
        });      
      }
      
    },
    deleteContent: function (index) {
      this.adventure.info.splice(index, 1);  
    },
    moreContent: function () {
      this.adventure.info.push({
        title: '',
        icon: '',
        content: [],
        new: true
      })
    },
    changePage: function (direction) {
      if (direction) {
        this.page++;
      } else {
        this.page--;
      }
      
      this.getClients();
    },
    addUser: function (user) {
      this.userList.push({
        name: user.name,
        phone: user.phone,
        id: user.id
      }) 
    },
    deleteUser: function (index) {
      this.userList.splice(index, 1);  
    },

  },
  computed: {
    locationText: function () {
      return this.mapAddress + ", " + this.mapPos.lng + ", " + this.mapPos.lat 
    }  
  },
  watch: {
    searchParam: function () {
      console.log('searchstr change');
      this.page = 0;
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
    
    this.getCurators();
    this.getIcons()
//    this.getClients()
    this.getEvent();
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll);
  },
}

</script>

<style lang="sass" scoped>
  @import "../../../assets/sass/admin/admin.sass" 
  @import "../../../assets/sass/admin/admin-edit.sass" 


</style>
