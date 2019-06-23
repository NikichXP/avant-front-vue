<template>
  <div class="container-fluid admin-wrapper">
    <div class="row">
      <div class="col-md-12 admin-menu admin-menu-new">
        <admin-menu></admin-menu>  
      </div>
      <div class="col-md-12 admin-content">        
        <div class="admin-toolbar" :class="{'admin-toolbar-sticky' : toolbarFixed}">
          <div class="buttons">
            <button class='admin-button' @click='toggleActivation()' v-if='!newEvent'>{{ activateButtonText }}</button>
            <button class='admin-button' @click='toggleBookable()' v-if='!newEvent'>{{ bookableButtonText }}</button>
            <router-link class='admin-button' v-bind:to='createEventLink(event)' v-if='date.id != "newdate" && event.id != "new-event"'>Показать на сайте</router-link>
            <button class='admin-button' @click='editAll()'>Сохранить</button>
          </div>
          <div class="pagination" v-if='toolbarFixed'>
            <button class='admin-button' @click='scrollTop()'>Вверх</button>  
          </div>

        </div>
        
        <h4 class="admin-header" v-if='!newEvent'>Редактирование события #{{id}}</h4>
        <h4 class="admin-header" v-else>Создание события</h4>
        
        <!-- ОСНОВНЫЕ ПОЛЯ -->
        <div class="edit-menu__main">
          <div class="edit-menu__block">
            <label>Название</label>
            <input type="text" class="edit-menu__text input-title" v-model='event.title'>
          </div>
          <div class="edit-menu__block">
            <label>Подзаголовок</label>
            <input type="text" class="edit-menu__text" v-model='event.info'>
          </div>
          <div class="edit-menu__block">
            <label>Ссылка</label>
            <div class="input-flex">
              <div class="url-folder-container url-folder" v-for="(item, index) in eventLink.folders" v-bind:key='index'  v-if='item.visible'>
                <input type="text" class="edit-menu__text"  v-model='item.content' @input='composeEventURL()'>  
                <img src="../../assets/img/cancel.png" alt="" class="url-folder-remove" @click='removeURLFolder(index)'> 
              </div>
               
              <input type="text" class="edit-menu__text" v-model='eventLink.url' @input='composeEventURL()'>  
            </div>
            
            <button class='admin-button' @click='generateURL()'>Сгенерировать из названия</button>
            <button class='admin-button' @click='addURLFolder()' v-if='eventLink.folderCount < 4'>Добавить вложенность</button>
          </div>
          <div class="event-photos edit-menu__block container-fluid">
            <label class='event-photos__header'>Обложки</label>
            <div class="row">
              <div class="col-md-3 col-lg-2 photo" v-for="(item, index) in event.images" v-bind:key='index'>
                <button class="delete-item" @click='deleteImage(1, index)'>Удалить</button>
                <img v-bind:src='imgPath + item' alt="">
              </div>
              <label class="custom-file-upload col-md-3 col-lg-2">
                <div class="file-upload-inner">
                  <input type="file" accept="image/*" v-on:change='uploadImage' multiple='true'>
                  <span>Загрузить</span>  
                </div>
              </label>
            </div>  
          </div>
          <div class="event-photos edit-menu__block container-fluid">
            <label class='event-photos__header'>Гиф-афиша</label>
            <div class="row">
              <div class="col-md-3 col-lg-2 photo" v-if='event.gif.length > 0'>
                <button class="delete-item" @click='deleteGif()'>Удалить</button>
                <img v-bind:src='imgPath + event.gif' alt="">
              </div>
              <label class="custom-file-upload col-md-3 col-lg-2" v-if='event.gif.length <= 0'>
                <div class="file-upload-inner">
                  <input type="file" accept="image/*" v-on:change='uploadGif' multiple='false'>
                  <span>Загрузить</span>  
                </div>
              </label>
            </div>  
          </div>
          <div class="event-photos edit-menu__block container-fluid">
            <label class='event-photos__header'>Иконка</label>
            <div class="row">
              <div class="col-md-1 col-lg-1 photo icon" v-for="(icon, index) in icons" v-bind:key='index'
              v-bind:class='{"chosen": icon == event.icon}' @click='chooseIcon(icon)'>
<!--                <button class="delete-item" @click='deleteImage(1, index)'>Удалить</button>-->
                <img v-bind:src='imgPath + icon' alt="" class='admin-icon'>
              </div>
            </div>  
          </div>
          <div class="edit-menu__block">
            <label class='event-photos__header'>Куратор</label>
            <select class='edit-menu__select' v-model='curatorChosen'>
              <option v-for="cur in curatorList" v-bind:value="cur.id" v-bind:key="cur.id">
                {{ cur.name + ' (' + cur.phone + ')' }}
              </option>
            </select>
          </div>
          <div class="edit-menu__block">
            <label>Видео</label>
            <input type="text" class="edit-menu__text" v-model='video'>
          </div>  
          <div class="edit-menu__block">
            <label>Текст в блоке цен</label>
            <vue-editor v-model="event.priceDisclaimer" :editorToolbar="customToolbar2" id='price-disclaimer'></vue-editor>
          </div>
        </div>
        
        
        <div class="edit-tabs__container">
          <div class="edit-tabs__header">
            <div class="tab-header admin-button" @click='tabActive = 1' :class='{"active" : tabActive == 1}'>
              Контент
            </div>    
            <div class="tab-header admin-button" @click='tabActive = 2' :class='{"active" : tabActive == 2}'>
              Фото
            </div>   
            <div class="tab-header admin-button" @click='tabActive = 3' :class='{"active" : tabActive == 3}'>
              Дата
            </div>   
          </div>
          <div class="edit-tabs">
           
            <!-- Контент -->
            <div class="edit-tab" v-show='tabActive == 1'>
              <div class="edit-menu__content">
                <div class="edit-menu__block" v-for="(item, index) in content" v-bind:key='index' v-if='item.first != "Видео"'>
                  <h4 class="edit-block__header">#{{index + 1}}</h4>
                  <button class="delete-item" @click='deleteContent(index)'>Удалить</button>
                  <label>Название</label>
                  <input type="text" class="edit-menu__text" v-model='item.first'>
                  <label>Текст</label>
                  <vue-editor v-model="item.second" :editorToolbar="customToolbar" v-bind:id='"content-text-" + index'></vue-editor>
                </div>
                <button class='admin-button' @click='moreContent()'>Добавить</button>
      <!--          <button class='admin-button' @click='validateContent()'>Сохранить</button>-->
              </div> 
            </div>
            
            <!-- Фото -->
            <div class="edit-tab" v-show='tabActive == 2'>
              <div class="event-photos edit-menu__block container-fluid" v-if='!photosHidden'>
                <div class="row">
                  <div class="col-md-3 col-lg-2 photo" v-for="(item, index) in photos" v-bind:key='index'>
                    <button class="delete-item" @click='deleteImage(2, index)'>Удалить</button>
                    <img v-bind:src='imgPath + item' alt="">
                  </div>
                  <label class="custom-file-upload col-md-3 col-lg-2">
                    <div class="file-upload-inner">
                      <input type="file" accept="image/*" v-on:change='uploadPhoto' multiple='true'>
                      <span>Загрузить</span>
                    </div>
                  </label>
                </div>  
              </div>
            </div>
            
            <!-- Дата -->
            <div class="edit-tab" v-show='tabActive == 3'>
              <div class="edit-menu__dates" v-if='!datesHidden'>
                <div class="edit-menu__block">        
                  <div class="date-block">
                    <label>Дата начала</label>
                    <input type="text" class="date-block__text day" v-model='date.startDateObj.day' @change='dateChanged()'>  /
                    <input type="text" class="date-block__text month" v-model='date.startDateObj.month' @change='dateChanged()'> / 
                    <input type="text" class="date-block__text year" v-model='date.startDateObj.year' @change='dateChanged()'>  
                    <input type="text" class="date-block__text hours" v-model='date.startDateObj.hours' @change='dateChanged()'> : 
                    <input type="text" class="date-block__text minutes" v-model='date.startDateObj.minutes' @change='dateChanged()'> 
                  </div>
                  <div class="date-block">
                    <label>Дата конца</label>
                    <input type="text" class="date-block__text day" v-model='date.endDateObj.day' @change='dateChanged()'>  /
                    <input type="text" class="date-block__text month" v-model='date.endDateObj.month' @change='dateChanged()'> / 
                    <input type="text" class="date-block__text year" v-model='date.endDateObj.year' @change='dateChanged()'>  
                    <input type="text" class="date-block__text hours" v-model='date.endDateObj.hours' @change='dateChanged()'> : 
                    <input type="text" class="date-block__text minutes" v-model='date.endDateObj.minutes' @change='dateChanged()'>  
                  </div>
                  <div class="date-block" v-if='date.id != "newdate"'>
                    <label>Свободные места</label>
                    <button class='admin-button' @click='changeFreePlaces(true)'>Включить безлимит</button><input type="number" class="date-places__count" v-model='date.places' min='0' @change='changeFreePlaces()'> 
                    Куплено мест: {{date.placesTaken}}, осталось: {{date.placesLeft}}
                  </div>

                  <!-- ЦЕНЫ -->
                  <div class="offers">
                    <div class="offer" v-for="(offer, i) in date.offers" v-bind:key='i'>
                      <h4 class="offer-header">Цена #{{i + 1}}</h4>  
                      <button class="delete-item" @click='deleteOffer(offer.name, i); dateChanged()' v-if='date.offers.length > 1'>Удалить</button> 
                      <div class="offer-block">
                        <label v-if='date.offers.length > 1'>Название</label>
<!--                        <input type="text" class="edit-menu__text" v-model='offer.name' v-if='date.offers.length > 1'>-->
                        <select class='edit-menu__select' v-model='offer.name' v-if='date.offers.length > 1' @change='dateChanged()'>
                          <option v-for="room in roomsList" v-bind:value="room.name" v-bind:key="i + room.name + Math.random()">
                            {{ room.name }}
                          </option>
                        </select>
                        <label>Валюта</label>
                        <div class="offer-currency">
                          <input type="radio" v-bind:name="'offer-' + i + '-currency'" v-bind:checked="offer.currency=='UAH'" @click='changeCurrency(i, "UAH")' @change='dateChanged()'> UAH
                          <input type="radio" v-bind:name="'offer-' + i + '-currency'" v-bind:checked="offer.currency=='USD'" @click='changeCurrency(i, "USD")' @change='dateChanged()'> USD
                          <input type="radio" v-bind:name="'offer-' + i + '-currency'" v-bind:checked="offer.currency=='EUR'" @click='changeCurrency(i, "EUR")' @change='dateChanged()'> EUR  
                        </div>
                        <div class="container-fluid">
                          <div class="row">
                            <div class="col-md-4 col-lg-3 variant-container" v-for="(variant, j) in offer.offerTypes" v-bind:key='j'>
                              <div class="offer-variant">
                                <h4 class="offer-header">Вариант #{{j + 1}}</h4>  
                                <button class="delete-item" @click='deleteVariant(i, j); dateChanged()' v-if='variant.type != "Обычный"'>Удалить</button> 
                                  <label>Название</label>
                                  <input type="text" class="edit-menu__text" v-model='variant.type' :disabled='variant.type=="Обычный"' @change='dateChanged()'>  

                                  <label>Цена</label>
                                  <input type="text" class="edit-menu__text" v-model='variant.price' @change='dateChanged()'> 

                                  <label>Аванс</label>
                                  <input type="text" class="edit-menu__text" v-model='variant.deposit' @change='dateChanged()'>
                              </div> 
                            </div>
                            <div class="col-md-4 col-lg-3 variant-container variant-hover" @click='moreVariants(i); dateChanged()'>
                              <div class="offer-variant">
                                <div class="offer-variant-add">
                                  +
                                </div>
                              </div> 
                            </div>
                          </div>
                        </div>
<!--                        <button class='admin-button' @click='moreVariants(i); dateChanged()'>Добавить варианты</button>-->
                      </div>
                    </div>
                  </div>
                  <button class='admin-button' @click='moreOffers(); dateChanged()'>Добавить цены</button>
                </div>
              </div>
            </div>
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
import axios from '../../lib/axios.js'
 
  
import adminMenu from './admin-menu'
  
import event from '../../lib/eventlib'
import util from '../../lib/util'
import admin from '../../lib/adminlib'
import validate from '../../lib/validatelib'
  

export default {
  name: 'adminEventEditComponent',
  data () {
    return {
      event: {
        title: '',
        info: '',
        images: '',
        gif: '',
        id: '',
        icon: '',
        priceDisclaimer: '',
        urlName: ''
      },
      content: [],
      date: {
        startDateObj: this.getDateObj(Date.now(), false),
        endDateObj: this.getDateObj(Date.now(), false),
        hasFreePlaces: true,
        placesBought: 0,
        offers: [{
          currency: 'UAH',
          offerTypes: [
            {
              type: 'Обычный',  
              deposit: 0,  
              price: 0,  
            }
          ],
          name: ' ',
        }],
        id: ''
      },
      photos: [],
      video: '',
      curatorChosen: '',
      curatorList: [],
      datesHidden: false,
      contentHidden: false,
      photosHidden: false,
      newEvent: false,
      imgPath: 'https://avant-2.herokuapp.com/api/file/get?file=',
      icons: [],
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
      eventLink: {
        folders: [
          {
            content: '',
            visible: false
          },
          {
            content: '',
            visible: false
          },
          {
            content: '',
            visible: false
          },
          {
            content: '',
            visible: false
          },
        ],
        url: '',
        folderCount: 0
      },
      toolbarFixed: false,
      tabActive: 1,
      roomsList: [],
      dateChangeDetected: false
    }
  },
  props: ['id'],
  methods: {
    getEvent: function () {
      if (this.$route.params.id != 'new') {
        let that = this;
        
        axios({
          method: 'get',
          url: '/event/' + that.id,
        })
        .then(function (response) {
          that.newEvent = false;
          
          that.event = response.data.data
          that.event.title = response.data.data.title;
          that.event.info = response.data.data.info;
          that.event.images = response.data.data.headImg;
          that.event.id = response.data.data.id;
          that.event.visible = response.data.data.visible;
          that.event.bookable = response.data.data.bookable;
          that.event.icon = response.data.data.icon;
          that.event.priceDisclaimer = response.data.data.priceDisclaimer;
          that.event.urlName = response.data.data.urlName || '';
          that.event.gif = response.data.data.gif || '';
          
          if (response.data.data.urlName.length > 0) that.parseUrl(response.data.data.urlName);
          
          that.content = response.data.data.content;
          let vid = response.data.data.content.filter(e => e.first == 'Видео')[0];
          that.video = vid ? vid.second : '';
          that.date = response.data.data.date;
          that.photos = response.data.data.photos;
          
          that.activateButtonText = response.data.data.visible ? "Деактивировать" : "Активировать";
          that.bookableButtonText = response.data.data.bookable ? "Деактивировать бронь" : "Активировать бронь";
          
          let cur = response.data.data.curator != null ? response.data.data.curator : ''; 
          if (cur != null) that.curatorChosen = cur.id;
          
          that.date['startDateObj'] = that.getDateObj(that.date.startDate, true);
          that.date['endDateObj'] = that.getDateObj(that.date.endDate, true);
          
          that.date['placesBought'] = 0
          
          that.placesLeft()
          
          console.log(that.date)

        })
        .catch(function (error) {
          console.log(error);
        });      
      } else {
        this.newEvent = true;
        
        this.event.title = '';
        this.event.info = '';
        this.event.images = [];
        this.event.id = 'new-event';  
        this.event.urlName = '';
        this.event.priceDisclaimer = '<p>В данном туре, цена зависит от того, в какой номер вы хотите заселиться. Ниже указана цена за <u>1 место</u> в номере.</p>';  
        this.event.visible = false;
        this.content.push({
          first: '',
          second: ''
        })
        this.date = {
          startDateObj: this.getDateObj(Date.now(), false),
          endDateObj: this.getDateObj(Date.now(), false),
          hasFreePlaces: true,
          offers: [{
            currency: 'UAH',
            offerTypes: [
              {
                type: 'Обычный',  
                deposit: 0,  
                price: 0,  
              }

            ],
            name: ' ',
          }],
          id: 'newdate'
        }
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
    getDateString: (timestamp) => {
      let d = new Date(timestamp);
      
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
    editContent: function () {
      let that = this;
      this.successMessage = 'В процессе...'
      
      let data = admin.createContentData(this.content, this.event.id)
      axios({
        method: 'post',
        url: '/event/content/set',
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response) {
        //console.log('OK'); 
        that.changeSuccessMessage()
        
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    editEvent: function () {
      
      if (this.requestInProcess) {
        console.log('a');
        return;
      }
      
      let data = util.createFormData({
        title: this.event.title,
        info: this.event.info,
        icon: this.event.icon,
      });
      data.append('images', admin.createImagesString(this.event.images));
      
      
      
      let that = this;
      this.successMessage = 'В процессе...'
      
      if (this.newEvent) {
        this.requestInProcess = true;
        axios({
          method: 'post',
          url: '/event/create',
          data: data,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(function (response) {
          console.log('OK'); 
          that.id = response.data.data.id;
          that.newEvent = false;
          that.$router.push('/admin/event/edit/' + response.data.data.id); 
          console.log('unreachable?');
          that.getEvent(); 
          
          that.requestInProcess = false;
          that.changeSuccessMessage()
        })
        .catch(function (error) {
          console.log(error);
        });  
      } else {
//        data.set('id', this.id);
        data.append('id', this.id);
        axios({
          method: 'post',
          url: '/event/edit',
          data: data,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(function (response) {
          console.log('OK'); 
          //that.id = response.data.data.id;
//          if (that.newEvent) {
//            this.$router.push('/admin/event/edit/' + response.data.data.id); 
//          }
          that.changeSuccessMessage()
        })
        .catch(function (error) {
          console.log(error);
        }); 
      }
      
      
    },
    editDates: function () {
      let that = this;
      this.successMessage = 'В процессе...'
      
      this.dates.forEach(e => {
        if (e.id.indexOf('newdate') < 0) {
          let data = new FormData();
          data.append('id', this.event.id)
          data.append('dateId', e.id)
          data.append('startDate', admin.createDate(e.startDateObj))
          data.append('endDate', admin.createDate(e.endDateObj))
          axios({
            method: 'post',
            url: '/event/date/edit',
            data: data,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(function (response) {
            console.log('OK');  
            admin.processOffers(e.offers, that.event.id, e.id);
            that.changeSuccessMessage()
          })
          .catch(function (error) {
            console.log(error);
          });    
          
        } else {   
          let that = this;
          let data = new FormData();
          data.append('id', this.event.id)
          data.append('startDate', admin.createDate(e.startDateObj))
          data.append('endDate', admin.createDate(e.endDateObj))

          axios({
            method: 'post',
            url: '/event/date/add',
            data: data,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(function (response) { 
            console.log('OK');
            e.id = response.data.data
            console.log(e.id);
            admin.processOffers(e.offers, that.event.id, e.id);
            that.changeSuccessMessage()
          })
          .catch(function (error) {
            console.log(error);
          });  
        }
        //admin.processOffers(e.offers, this.event.id, e.id);
      });

    },
    editPhotos: function () {
      let that = this;
      this.successMessage = 'В процессе...'
      let data = new FormData();
//      data.set('id', this.event.id);
//      data.set('photos', admin.createImagesString(this.photos));
      data.append('id', this.event.id);
      data.append('photos', admin.createImagesString(this.photos));
      axios({
        method: 'post',
        url: '/event/photo/set',
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response) {
        //console.log('OK'); 
        that.changeSuccessMessage()
        
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    contentRequest: function () {
      this.successMessage = 'Добавление контента...'
          
      let dataContent = admin.createContentData(this.content, this.id, this.video)
      
      let that = this
      
      axios({
        method: 'post',
        url: '/admin/event/content/set',
        data: dataContent,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response) {
          console.log('content ok');  
        })
        .catch(function (error) {
          console.log(error);
          that.changeSuccessMessage()
          that.errorList.push("Не удалось добавить контент. Проверьте заполнение")
        });
      
    },
    curatorRequest: function () {
      this.successMessage = 'Добавление куратора...'
      
      let dataCurator = util.createFormData({
        id: this.id,
        userId: this.curatorChosen
      });
      
      let that = this

      axios({
        method: 'post',
        url: '/admin/event/curator',
        data: dataCurator,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response) {
          console.log('curator ok');  
        })
        .catch(function (error) {
          console.log(error);
          that.changeSuccessMessage()
          that.errorList.push("Не удалось добавить куратора. Проверьте заполнение")
        });  
    },
    offersRequest: function (oldOffers) {
      admin.processOffers(this.date.offers, this.id, oldOffers);  
    },
    photosRequest: function () {
      this.successMessage = 'Добавление фото...'
                
      let dataPhotos = new FormData();
                
      dataPhotos.append('id', this.id);
      dataPhotos.append('photos', admin.createImagesString(this.photos));
      
      let that = this
                
      axios({
        method: 'post',
        url: '/admin/event/photo/set',
        data: dataPhotos,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response) {
          console.log('photos ok');
                  
          that.$router.push('/admin/event/edit/' + that.id); 
          that.requestInProcess = false;
          that.changeSuccessMessage()
        })
        .catch(function (error) {
          console.log(error);
          that.changeSuccessMessage()
          that.errorList.push("Не удалось загрузить фото. Проверьте заполнение")
        });         
    },
    editAll: function () {
      if (this.requestInProcess) {
        console.log('a');
        return;
      }
      
      // VALIDATION ---------------------------------
      
      this.errorList = []
      
      this.validateEvent();
      this.validateURL();
      this.validateContent();
      this.validateDates();
      
      if (this.errorList.length > 0) {
        return;  
      } 
      
      console.log('url = ' + admin.createURL(this.event.title));
      
      // VALIDATION END ---------------------------------
      
      let dataEvent = util.createFormData({
        title: this.event.title,
        info: this.event.info,
        icon: this.event.icon,
        priceDisclaimer: this.event.priceDisclaimer,
        urlName: this.event.urlName
      });
      
      dataEvent.append('images', admin.createImagesString(this.event.images));
      dataEvent.append('startDate', admin.createDate(this.date.startDateObj))
      dataEvent.append('endDate', admin.createDate(this.date.endDateObj))
      dataEvent.append('gif', this.event.gif);
      
      let that = this;
      
      this.successMessage = 'Обработка события...'
      
      let path = 'edit'
      
      if (this.newEvent) path = 'create' 
      else dataEvent.append('id', this.id)
      
      this.requestInProcess = true;
            
      
      // EVENT EDIT/CREATE ---------------------------------
      
      axios({
        method: 'post',
        url: '/admin/event/' + path,
        data: dataEvent,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response) {   
        console.log('event ok');
        let showPlacesNeeded = false;
        if (that.newEvent) {
          that.id = response.data.data.id;
          that.newEvent = false;  
        } else if (that.dateChangeDetected) showPlacesNeeded = true

        
        // CURATOR ---------------------------------
        
        that.curatorRequest()
        
        // CONTENT ---------------------------------
        
        that.contentRequest()
        
        // OFFERS ----------------------------------
        
        that.offersRequest(response.data.data.date.offers)
        
        // PHOTOS ----------------------------------
        
        that.photosRequest()
        
        // PLACES ----------------------------------
        
        if (showPlacesNeeded) that.showPlacesMSG()
        
        that.changeSuccessMessage()
        
        that.requestInProcess = false;   

      })
      .catch(function (error) {
        console.log(error);
      });   
    },
    moreContent: function () {
      this.content.push({
        first: '',
        second: ''
      })
    },
    moreDates: function () {
      this.dates.push({
        startDateObj: this.getDateObj(Date.now(), false),
        endDateObj: this.getDateObj(Date.now(), false),
        hasFreePlaces: true,
        offers: [{
          currency: 'UAH',
          offerTypes: [
            {
              type: 'Обычный',  
              deposit: 0,  
              price: 0,  
            }

          ],
          name: '',
        }],
        id: 'newdate'
      })
      
      console.log(this.dates);
    },
    moreOffers: function () {
      if (this.date.offers.length == 1 && this.date.offers[0].name.length < 0) this.date.offers[0].name = '';
      
      this.date.offers.push({
        currency: 'UAH',
        offerTypes: [
          {
            type: 'Обычный',  
            deposit: 0,  
            price: 0,  
          }
          
        ],
        name: '',
      }); 
    },
    moreVariants: function (index) {
      this.date.offers[index].offerTypes.push({
        type: '',  
        deposit: 0,  
        price: 0,  
      }); 
    },
    deleteContent: function (index) {
      this.content.splice(index, 1);  
    },
    deleteImage: function (variant, index) {
      if (variant == 1) {
        this.event.images.splice(index, 1);  
      } else {
        this.photos.splice(index, 1);   
      }        
    },
    deleteGif: function () {
      this.event.gif = ''
    },
    deleteDate: function (index) {
      this.dates.splice(index, 1);  
    },
    deleteOffer: function (offerName, offerIndex) {
      
      if (this.$route.params.id == 'new') {
        this.date.offers.splice(offerIndex, 1);  
        
        if (this.date.offers.length == 1) this.date.offers[0].name = ' '
        else this.date.offers[0].name = ''
        
        console.log('delete first price name = ' + this.dates[parentIndex].offers[0].name);
        
        return;
      }
      
      let data = new FormData();
    
      data.append('id', this.id);
//      data.append('dateId', parent);
      data.append('offerName', offerName);
      
      let that = this;
      
      axios({
        method: 'post',
        url: '/admin/event/offers/delete',
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response) {
        that.date.offers.splice(offerIndex, 1);    
        
        if (that.date.offers.length == 1) that.date.offers[0].name = ' '
        
        console.log('delete first price name = ' + that.date.offers[0].name);
      })
      .catch(function (error) {
        console.log(error);
      });    
        
      
    },
    deleteVariant: function (parent2, index) {
      this.date.offers[parent2].offerTypes.splice(index, 1);  
    },
    changeCurrency: function (index, cur) {
      this.date.offers[index].currency = cur;  
    },
    chooseIcon: function (path) {
      console.log(path);
      this.event.icon = path;  
    },
    toggleDatesHidden: function () {
      this.datesHidden = !this.datesHidden;
    },
    toggleContentHidden: function () {
      this.contentHidden = !this.contentHidden;
    },
    togglePhotosHidden: function () {
      this.photosHidden = !this.photosHidden;
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
    uploadGif: function (event) {
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
          that.event.gif = response.data.data 
        })
        .catch(function (error) {
          console.log(error);
        });      
      }
      
    },
    validateEvent: function () { 
//      this.errorList = []
      this.errorList = this.errorList.concat(validate.mainBlock(this.event)) 
      
//      if (this.errorList.length <= 0) {
//        this.editEvent();  
//      }  
    },
    validateURL: function () { 
      if (this.event.urlName.length < 1) this.generateURL()
    },
    validateContent: function () { 
//      this.errorList = []
      this.errorList = this.errorList.concat(validate.content(this.content)) 
      
//      if (this.errorList.length <= 0) {
//        this.editContent();  
//      }  
    },
    validateDates: function () { 
//      this.errorList = []
      this.errorList = this.errorList.concat(validate.dates(this.date)) 
      
//      if (this.errorList.length <= 0) {
//        this.editDates();  
//      }  
    },
    toggleFreePlaces: function (newValue, dateIndex) { 
      let data = new FormData();
        
      data.append('id', this.event.id);
      data.append('dateId', this.dates[dateIndex].id);
      data.append('hasFree', newValue);
      axios({
        method: 'post',
        url: '/event/offer/free',
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response) {
        console.log('ok');
      })
      .catch(function (error) {
        console.log(error);
      });       
    },
    changeFreePlaces: function (unlim) { 
      
      if (this.date.places < 0) this.date.places = 0;
      
      let data = new FormData();
      
      data.append('id', this.event.id);
      if (!unlim) {
        data.append('set', this.date.places);  
      } else {
        data.append('status', false);  
      }
              
      
      axios({
        method: 'post',
        url: '/admin/event/places',
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response) {
        console.log('ok');
      })
      .catch(function (error) {
        console.log(error);
      });       
    },
    toggleActivation: function () { 
      let data = new FormData();
      let that = this;
      this.errorList = [];
        
      data.append('id', this.event.id);
      data.append('state', !this.event.visible);
      
      axios({
        method: 'post',
        url: '/admin/event/disable',
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response) {
        console.log('ok');
        that.event.visible = response.data.data.visible;
        console.log(that.event.visible);
        
        that.activateButtonText = response.data.data.visible ? "Деактивировать" : "Активировать";
      })
      .catch(function (error) {
        console.log(error);
        that.errorList.push('Невозможно активировать событие. Проверьте заполнение полей и загруженные фото');        
      });       
    },
    toggleBookable: function () { 
      let data = new FormData();
      let that = this;
      this.errorList = [];
        
      data.append('id', this.event.id);
      data.append('state', !this.event.bookable);
      
      axios({
        method: 'post',
        url: '/admin/event/bookable',
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response) {
        console.log('ok');
        that.event.bookable = response.data.data.bookable;
        console.log(that.event.bookable);
        
        that.bookableButtonText = response.data.data.bookable ? "Деактивировать бронь" : "Активировать бронь";
      })
      .catch(function (error) {
        console.log(error);
        that.errorList.push('Невозможно активировать бронь');        
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
    setCurator: function () {
      let that = this;
      this.successMessage = 'В процессе...'
      
      let data = util.createFormData({
        id: this.id,
        userId: this.curatorChosen
      });
      
      axios({
        method: 'post',
        url: '/event/curator',
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response) {
        console.log('ok');
        that.changeSuccessMessage()
      })
      .catch(function (error) {
        console.log(error);
      });     
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
    createEventLink: (item) => {    
      let result = ''
            
      if (item.urlName) result = '/' + item.urlName
      else result = '/' + item.id
        
      return result;
      
    },
    generateURL: function () {
      this.eventLink.url = admin.createURL(this.event.title)  
      this.composeEventURL();
    },
    parseUrl: function (url) {
      let arr = url.split('/');
      
      if (arr.length == 1) {
        this.eventLink.url = url;
        return;
      }
      
      this.eventLink.url = arr[arr.length-1];
      arr.splice(arr.length-1, 1);
      
      arr.forEach((e, index) => {
        this.eventLink.folders[index].content = e;  
        this.eventLink.folders[index].visible = true;
      })
      
      this.countURLFolders();
    },
    countURLFolders: function () {
      this.eventLink.folderCount = this.eventLink.folders.filter(e => e.visible).length;  
    },
    addURLFolder: function () {
      this.eventLink.folders[this.eventLink.folderCount].visible = true;
      this.eventLink.folderCount++;
    },
    removeURLFolder: function (index) {
      this.eventLink.folders[index].content = '';
      this.eventLink.folders[index].visible = false;
      this.eventLink.folderCount--;
      this.composeEventURL();
    },
    composeEventURL: function () {
      this.event.urlName = '';
      
      this.eventLink.folders.forEach(e => {
        if (e.content.length > 0) this.event.urlName += e.content + '/';
      })
      
      this.event.urlName += this.eventLink.url;
      
    },
    handleScroll: function () {
      var scrollPos = window.pageYOffset || document.documentElement.scrollTop;  
      
      if (scrollPos >  60) this.toolbarFixed = true
      else this.toolbarFixed = false
    },
    scrollTop: function () {
      window.scrollTo(0, 0)
    },
    dateChanged: function () {
      console.log('date changed')
      this.dateChangeDetected = true;
    },
    showPlacesMSG: function () {
      if (confirm("Сбросить количество мест на событии?")) {
        this.date.places = 0;
        this.changeFreePlaces()
      } 
    },
    placesLeft: function () {
      let that = this;
      axios({
        method: 'get',
        url: '/order/bookable/' + this.id,
      })
      .then(function (response) {
        that.date.placesTaken = that.date.places - response.data.data.total
        that.date.placesLeft = response.data.data.total
      })
      .catch(function (error) {
        console.log(error);
      });       
    },
    changeUnlim: function () {
      let that = this;
      axios({
        method: 'get',
        url: '/order/bookable/' + this.id,
      })
      .then(function (response) {
        that.date.placesTaken = that.date.places - response.data.data.total
        that.date.placesLeft = response.data.data.total
      })
      .catch(function (error) {
        console.log(error);
      });       
    }
  },
//  computed: {
//    activateButtonText: function () {
//      let res = this.event.visible ? "Деактивировать" : "Активировать";
//      return res;
//    }  
//  },
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
    
    this.roomsList = event.roomsList()
    
    this.getCurators();
    this.getIcons();
    this.getEvent();
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll);
  },
}

</script>

<style lang="sass" scoped>
  @import "../../assets/sass/admin/admin.sass" 
  @import "../../assets/sass/admin/admin-edit.sass" 

  .admin-wrapper
    min-height: 1850px
</style>
