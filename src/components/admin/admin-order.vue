<template>
  <div class="container-fluid admin-wrapper">
    <div class="row">
      <div class="col-md-12 admin-menu admin-menu-new">
        <admin-menu></admin-menu>  
      </div>
      <div class="col-md-12 admin-content">
<!--        <h4 class="admin-header">Заказы</h4>-->
        <div class="admin-toolbar">
          <div class="buttons">
            <button class="admin-button" @click='displayFilters = !displayFilters'>Фильтры</button>
          </div>
          <div class="pagination">
            <button class="admin-button" :disabled='page == 0' @click='changePage(false)'>&lt;</button>
            <span class="admin-button">{{page + 1}}</span>
            <button class="admin-button" :disabled='page == lastPage' @click='changePage(true)'>&gt;</button> 
          </div>
        </div>
        <div class="filters" v-if='displayFilters'>
          <div class="filter-block" v-for="filter in filters" v-bind:key='filter.type'>
            <div v-if='filter.type != "date"'>
              <label>{{filter.name}}</label>
              <input type="text" @input='filterChanged' v-model='filter.param'>  
            </div>
            <div v-else>
              <label>Дата</label>
              <Datepicker v-model='date' format='dd.MM.yyyy'></Datepicker>  
            </div>
          </div>
        </div>
        <table class="admin-table table table-striped table-condensed">
          <thead>
<!--
            <th>
              #
            </th>
-->
            <th @click='changeSortOrder(0)'>
              Событие
              <img src="../../assets/img/arrow.png" title='Изменить порядок сортировки' class='table-sort-icon' v-bind:class="{ 'table-sort-icon-desc': !sortOrder[0].asc }">
            </th>
            <th @click='changeSortOrder(1)'>
              Дата события
              <img src="../../assets/img/arrow.png" title='Изменить порядок сортировки' class='table-sort-icon' v-bind:class="{ 'table-sort-icon-desc': !sortOrder[1].asc }">
            </th> 
            <th @click='changeSortOrder(2)'>
              ID заказа 
              <img src="../../assets/img/arrow.png" title='Изменить порядок сортировки' class='table-sort-icon' v-bind:class="{ 'table-sort-icon-desc': !sortOrder[2].asc }">
            </th>
            <th @click='changeSortOrder(3)'>
              Комментарий
              <img src="../../assets/img/arrow.png" title='Изменить порядок сортировки' class='table-sort-icon' v-bind:class="{ 'table-sort-icon-desc': !sortOrder[3].asc }">
            </th>
            <th @click='changeSortOrder(4)'>
              Дата создания
              <img src="../../assets/img/arrow.png" title='Изменить порядок сортировки' class='table-sort-icon' v-bind:class="{ 'table-sort-icon-desc': !sortOrder[4].asc }">
            </th>
            <th @click='changeSortOrder(5)'>
              Клиент
              <img src="../../assets/img/arrow.png" title='Изменить порядок сортировки' class='table-sort-icon' v-bind:class="{ 'table-sort-icon-desc': !sortOrder[5].asc }">
            </th>
            <th @click='changeSortOrder(6)'>
              Оплачено
              <img src="../../assets/img/arrow.png" title='Изменить порядок сортировки' class='table-sort-icon' v-bind:class="{ 'table-sort-icon-desc': !sortOrder[6].asc }">
            </th>
          </thead>
          <tbody>
            <tr v-for="item in orderList" v-bind:key='item.id' @click="openEditMenu('/admin/orders/edit/' + item.id)" :class='{"table-unseen" : !item.seen}'>
<!--              <td>{{(page*pageSize) + (index + 1)}}</td>-->
              <td>{{item.event.title}}</td>
<!--              <td>{{ getDateString(item.dateInfo.startDateTimeStamp) }}</td>-->
              <td>{{ getBetweenDateString(item.dateInfo.startDate) }} - {{ getBetweenDateString(item.dateInfo.endDate) }}</td>
              <td>{{item.id}}</td>
              <td v-bind:class='{"table-red" : item.comment.length > 0}'>{{ item.comment.length > 0 ? 'Есть' : "Нет" }}</td>
              <td>{{ getCreatedDateString(item.created) }}</td>
              <td class='table-bod' >{{ getBirthDateString(item.persons[0].birthday) }}<span v-html='getAge(item.persons[0].birthday)'></span></td>
              <td v-bind:class='{"table-red" : item.orderDeposit < item.depositPrice, "table-green" : item.orderDeposit == item.depositPrice}'>{{ item.orderDeposit == item.depositPrice ? 'Да' : "Нет" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    
  </div>
</template>

<script>
import axios from '../../lib/axios.js'
 
  
import Datepicker from 'vuejs-datepicker';
  
import adminMenu from './admin-menu'
  
import event from '../../lib/eventlib'
import util from '../../lib/util'

export default {
  name: 'adminOrdersComponent',
  data () {
    return {
      orderList: [],
      page: 0,
      lastPage: 0,
      pageSize: 20,
      filters: [
        {
          name: 'Событие',
          type: 'title',
          param: ''
        },
        {
          name: 'Дата',
          type: 'date',
          param: ''
        },
        {
          name: 'Персона',
          type: 'person',
          param: ''
        },
        {
          name: 'Номер телефона',
          type: 'phone',
          param: ''
        }
      ],
      displayFilters: false,
      sortOrder: [
        {asc: true},
        {asc: true},
        {asc: true},
        {asc: true},
        {asc: true},
        {asc: true},
        {asc: true},
        {asc: true},
      ],
      date: ''
    }
  },
  methods: {
    getAllEvents: function () {
      let that = this;

      let data = {
        page: this.page,
        pageSize: this.pageSize,
      };
            
      // Search implemented here and a watcher is used to change page on search param change
      this.filters.forEach(e => {
        if (e.param.length > 0) {
          data[e.type] = e.param;
        }
      });
                  
      axios({
        method: 'get',
        url: '/order/orders',
        params: data,
      })
      .then(function (response) {
        let temp = response.data.data;
        
        temp = temp.sort((a, b) => { return b.created - a.created }); 
        if (temp.length < 1) {
          return;
        }        
        that.orderList = temp; 
        
        that.lastPage = response.data.maxPage - 1;
      })
      .catch(function (error) {
        console.log(error);
      }); 
      
    },
    openEditMenu: function (path) {
      this.$router.push(path);   
    },
    getDateString: (timestamp) => {
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
    getBetweenDateString: (timestamp) => {
      let d = util.createTimezoneDate(timestamp); 
      
      let result = d.getDate()
        + ' '
        + util.getMonthNameVar2(d.getMonth() + 1)
      return result;
    },
    getCreatedDateString: function (timestamp) {
      let d = util.createTimezoneDate(timestamp); 

      let days = this.daysBetweeen(d.getTime(), Date.now())
      
      let result = '';
      
      switch (days) {
        case -1: 
          result = "Сегодня в " + (d.getHours() < 10 ? '0' + d.getHours() : d.getHours())
          + ':' 
          + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes())
          break;
        case 0: 
          result = "Вчера в " + (d.getHours() < 10 ? '0' + d.getHours() : d.getHours())
          + ':' 
          + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes())
          break;
        default:
          result = d.getDate() + " " + util.getMonthNameVar2(d.getMonth() + 1) + ' в '
            + (d.getHours() < 10 ? '0' + d.getHours() : d.getHours())
            + ':' 
            + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes())
          break;
      }
      return result;
    },
    getBirthDateString: function (arr) {
      let result = '';
      
      result += arr[2].toString().length == 2 ? (arr[2] + '.') : ('0' + arr[2] + '.')
      result += arr[1].toString().length == 2 ? (arr[1] + '.') : ('0' + arr[1] + '.')
      result += arr[0]
            
      return result
    },
    getAge: function (arr) {
      let result = '';
      
      let dob = '' + arr[0] + arr[1] + arr[2];
      let year = Number(dob.substr(0, 4));
      let month = Number(dob.substr(4, 2)) - 1;
      let day = Number(dob.substr(6, 2));
      let today = new Date();
      let age = today.getFullYear() - year;
      if (today.getMonth() < month || (today.getMonth() == month && today.getDate() < day)) {
        age--;
      }
      
      result += ' (' + age + ' лет)'
      
      return result
    },
    changePage: function (direction) {
      if (direction) {
        this.page++;
      } else {
        this.page--;
      }
       
      this.getAllEvents();
    },
    daysBetweeen: function (a, b) {      
//      let date1 = new Date(a);
//      let date2 = new Date(b);
      
      let date1 = this.getStartOfTheDay(util.createTimezoneDate(a).getTime()); 
      let date2 = this.getStartOfTheDay(util.createTimezoneDate(b).getTime()); 
      
//      console.log(date1);
//      console.log(date2);
      
      // The number of milliseconds in one day
      var ONE_DAY = 1000 * 60 * 60 * 24

      // Convert both dates to milliseconds
      var date1_ms = date1.getTime()
      var date2_ms = date2.getTime()

      // Calculate the difference in milliseconds
      var difference_ms = Math.abs(date1_ms - date2_ms)

      // Convert back to days and return
//      return Math.floor(difference_ms/ONE_DAY) - 1
      return Math.round(difference_ms/ONE_DAY) - 1
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
    getStartOfTheDay: (timestamp) => {
      let d = new Date(timestamp);
      
      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      let day = d.getDate();
      
      let result = new Date(year, month, day, 0);
      return result
    },
    filterChanged: function () {
      this.page = 0;
      this.getAllEvents();
    },
    changeSortOrder: function (index) {
      this.sortOrder[index].asc = !this.sortOrder[index].asc
//      this.getAllEvents()
    }
  },
  components: {
    adminMenu: adminMenu,
    Datepicker
  },
  created: function () {
    if (this.$cookies.get("accessToken")) {  
      this.checkAuth(this.$cookies.get("accessToken"));  
    } else {
      this.$router.push('/admin/');    
    }
    
    this.getAllEvents();     
  },
  watch: {
    date: function () {
      console.log('date change');
      let ts = new Date(this.date).getTime()
      let d = util.createTimezoneDate(ts); 
      let result = ''
        + d.getFullYear()
        + '-'
        + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1))
        + '-'
        + (d.getDate() < 10 ? '0' + d.getDate() : d.getDate());
      this.filters[1].param = result;
      this.filterChanged()
    }
  },
}

</script>

<style lang="sass" scoped>
  @import "../../assets/sass/admin/admin.sass" 
</style>
