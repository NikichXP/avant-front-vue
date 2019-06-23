<template>
  <div class="container-fluid admin-wrapper">
    <div class="row">
      <div class="col-md-12 admin-menu admin-menu-new">
        <admin-menu></admin-menu>  
      </div>
      <div class="col-md-12 admin-content">
<!--        <h4 class="admin-header">События</h4>-->
<!--
        <router-link class="admin-button" to='/admin/event/edit/new'>Добавить новое</router-link>
        <button class="admin-button" v-if='buttonState == 0' @click='changeList("hidden")'>К списку скрытых</button>
        <button class="admin-button" v-else @click='changeList("visible")'>К списку активных</button>
        <br>
-->
        <div class="admin-toolbar">
          <div class="buttons">
            <router-link class="admin-button" to='/admin/event/edit/new'>Добавить новое</router-link>
            <button class="admin-button" v-if='buttonState == 0' @click='changeList("hidden")'>К списку скрытых</button>
            <button class="admin-button" v-else @click='changeList("visible")'>К списку активных</button>
          </div>
          <div class="pagination">
            <button class="admin-button" :disabled='page == 0' @click='changePage(false)'>&lt;</button>
            <span class="admin-button">{{page + 1}}</span>
            <button class="admin-button" :disabled='page == lastPage' @click='changePage(true)'>&gt;</button> 
          </div>
        </div>
        <table class="admin-table table table-striped table-condensed">
          <thead>
            <th @click='changeSortOrder(0)'>
              #
              <img src="../../assets/img/arrow.png" title='Изменить порядок сортировки' class='table-sort-icon' v-bind:class="{ 'table-sort-icon-desc': !sortOrder[0].asc }">
            </th> 
            <th @click='changeSortOrder(1)'>
              Название
              <img src="../../assets/img/arrow.png" title='Изменить порядок сортировки' class='table-sort-icon' v-bind:class="{ 'table-sort-icon-desc': !sortOrder[1].asc }">
            </th>
            <th @click='changeSortOrder(2)'>
              Ближайшая дата
              <img src="../../assets/img/arrow.png" title='Изменить порядок сортировки' class='table-sort-icon' v-bind:class="{ 'table-sort-icon-desc': !sortOrder[2].asc }">
            </th>
            <th @click='changeSortOrder(3)'>
              Мест всего
              <img src="../../assets/img/arrow.png" title='Изменить порядок сортировки' class='table-sort-icon' v-bind:class="{ 'table-sort-icon-desc': !sortOrder[3].asc }">
            </th>
            <th @click='changeSortOrder(4)'>
              Мест доступно
              <img src="../../assets/img/arrow.png" title='Изменить порядок сортировки' class='table-sort-icon' v-bind:class="{ 'table-sort-icon-desc': !sortOrder[4].asc }">
            </th>
            <th @click='changeSortOrder(5)'>
              Мест куплено 
              <img src="../../assets/img/arrow.png" title='Изменить порядок сортировки' class='table-sort-icon' v-bind:class="{ 'table-sort-icon-desc': !sortOrder[5].asc }">
            </th>
            <th @click='changeSortOrder(6)'>
              Активно
              <img src="../../assets/img/arrow.png" title='Изменить порядок сортировки' class='table-sort-icon' v-bind:class="{ 'table-sort-icon-desc': !sortOrder[6].asc }">
            </th>
            <th>
              Действия
            </th>
          </thead>
          <tbody>
            <tr v-for="(event, index) in eventsList" v-bind:key='event.id'>
              <td @click="openEditMenu('/admin/event/edit/' + event.id)">{{(page*pageSize) + (index + 1)}}</td>
              <td @click="openEditMenu('/admin/event/edit/' + event.id)">
                {{
                  event.name.length > 100 ? event.name.substr(0,100) + '...' : event.name
                }}
              </td>
              <td @click="openEditMenu('/admin/event/edit/' + event.id)">{{getDateString(event.date.startDate)}}</td>
              <td @click="openEditMenu('/admin/event/edit/' + event.id)">{{event.date.places}}</td>
              <td @click="openEditMenu('/admin/event/edit/' + event.id)">{{event.placesLeft}}</td>
              <td @click="openEditMenu('/admin/event/edit/' + event.id)">{{event.placesTaken}}</td>
              <td @click="openEditMenu('/admin/event/edit/' + event.id)">
                {{
                  event.visible ? "Да" : "Нет"
                }}
              </td>
              <td>
               <button class="table-button">
                  <img src="../../assets/img/grid.png" alt="Открыть таблицу" title="Открыть таблицу">
                </button>
                <button class="table-button" @click='cloneEvent(event.id)'>
                  <img src="../../assets/img/copy.png" alt="Дублировать событие" title="Дублировать событие">
                </button>
                <button class="table-button">
                  <img src="../../assets/img/cancel.png" alt="Удалить событие" title="Удалить событие">
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    
  </div>
</template>

<script>
import axios from '../../lib/axios.js'
 
  
import adminMenu from './admin-menu'
  
import event from '../../lib/eventlib'
import util from '../../lib/util' 

export default {
  name: 'adminEventsComponent',
  data () {
    return {
      eventsList: [],
      page: 0,
      lastPage: 0,
      pageSize: 20,
      buttonState: 0,
      sortOrder: [
        {asc: true},
        {asc: true},
        {asc: true},
        {asc: true},
        {asc: true},
        {asc: true},
        {asc: true},
        {asc: true},
      ]
    }
  },
  methods: {
    getAllEvents: function () {
      let hidden = ''
      if (this.$route.path.indexOf('visible') > -1) {
        hidden = false
        this.buttonState = 0;
      } else {
        hidden = true 
        this.buttonState = 1;
      }
      
      
      let that = this;
      
      axios({
        method: 'get',
        url: '/event/list',
        params: {
          page: this.page,
          pageSize: this.pageSize,
          showHidden: hidden
        }
      })
      .then(function (response) {
        let temp = response.data.data;
        
        if (temp.length < 1) {
          return;
        }
        let allEvents = []
        
        temp.forEach(e => {
          allEvents.push({
            id: e.id,
            name: e.title,
            closestDate: e.date.startDate || "Нет",
            date: e.date,
            visible: e.visible,
            placesLeft: 0,
            placesTaken: 0,
          });
        });
        
        that.eventsList = allEvents; 
        that.placesLeft()
        that.lastPage = response.data.maxPage - 1; 
      })
      .catch(function (error) {
        console.log(error);
      });    
    },
    placesLeft: function () {

//      let that = this;
//      console.log('places left');
      
      this.eventsList.forEach(e => {
        axios({
          method: 'get',
          url: '/order/bookable/' + e.id,
        })
        .then(function (response) {
          e.placesTaken = e.date.places - response.data.data.total
          e.placesLeft = response.data.data.total
        })
        .catch(function (error) {
          console.log(error);
        });     
      })       
    },
    openEditMenu: function (path) {
      this.$router.push(path);   
    },
    getDateString: (timestamp) => {
      if (timestamp == 'Нет') {
        return "Даты отсутствуют"
      }
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
    hasFreePlaces: (eventDate) => {
      
      let d = util.createTimezoneDate(Date.now());
      let minDifference = 10000000000;
      let date;
      
//      let date = dates.filter(e => e.startDateTimeStamp > d.getTime()).sort((a, b) =>  a.startDateTimeStamp - b.startDateTimeStamp)[0];  
      
//      for (let i = 0; i < dates.length; i++) {
        let dif = Math.abs(eventDate.startDate - d.getTime())  
                
        if (dif < minDifference) {
          minDifference = dif;
          date = eventDate;
        }
//      }
      
//      console.log(date);
      
      if (!date) return "Нет"
      
      if (date.places > 0) return "Есть"  
      else return "Нет"  
    },
    changeList: function (path) {
      this.$router.push('/admin/events/' + path);
      this.getAllEvents();
    },
    changePage: function (direction) {
      if (direction) {
        this.page++;
      } else {
        this.page--;
      }
      
      this.getAllEvents();
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
    cloneEvent: function (id) {
      
      let data = new FormData()
      data.append('id', id);
      
      let that = this
      
      axios({
        method: 'post',
        url: '/admin/event/clone',
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response) {
        console.log('OK');       
        that.getAllEvents()
      }).catch(function (error) {
        console.log(error);
      });  
    },
    changeSortOrder: function (index) {
      this.sortOrder[index].asc = !this.sortOrder[index].asc
//      this.getAllEvents()
    }
  },
  components: {
    adminMenu: adminMenu,
  },
  watch: {
    state: function () {
      console.log('asdh');
    }
  },
  created: function () {
    if (this.$cookies.get("accessToken")) {  
      this.checkAuth(this.$cookies.get("accessToken"));  
    } else {
      this.$router.push('/admin/');    
    }
    
    this.getAllEvents();     
  }
}

</script>

<style lang="sass" scoped>
  @import "../../assets/sass/admin/admin.sass" 
</style>
