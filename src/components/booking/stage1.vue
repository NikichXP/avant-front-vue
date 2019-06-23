<template>   
  <div class="col-md-4 col-md-offset-1 booking booking-1">
    <div class="person" v-for="(person, index) in personList" v-bind:key='index'>
      <h3 class="person-header">
        Персона {{ index + 1 }}
      </h3>
      
      <!--   ФИО   -->

      <div class="person-form">
        <label for="" class="person-label">Фамилия</label>
        <input type="text" class="person-input__text" placeholder='Введите фамилию' v-model='namesList[index].surname' v-bind:class="{ 'validate-fail': person.surnameValidateFail }" @input='changePersonName(index)'>
        <div class="person-error-tooltip" v-if='person.surnameValidateFail'>
          Вы ввели некорректную фамилию
        </div>
      </div>
      <div class="person-form">
        <label for="" class="person-label">Имя</label>
        <input type="text" class="person-input__text" placeholder='Введите имя' v-model='namesList[index].name' v-bind:class="{ 'validate-fail': person.nameValidateFail }" @input='changePersonName(index)'>
        <div class="person-error-tooltip" v-if='person.nameValidateFail'>
          Вы ввели некорректное имя
        </div>
      </div>

      <!--   ДАТА РОЖДЕНИЯ   -->

      <div class="person-form">
        <label for="" class="person-label">Дата Рождения</label>
        <div class="complex-input__wrapper" v-bind:class="{ 'validate-fail': person.bdateValidateFail }">

          <input type="tel" class='complex-input__text complex-input__underline block-4' maxlength="2" placeholder="дд" 
            v-model='person.bdate.day'
            @input='bdateBlockOnInput(person.bdate.day, 2, 2, 0, index)'
            oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
            >

          <input type="text" class='complex-input__text block-4' placeholder='/' disabled>

          <input type="tel" class='complex-input__text complex-input__underline block-4' maxlength="2" placeholder="мм" 
            v-model='person.bdate.month' 
            @input='bdateBlockOnInput(person.bdate.month, 2, 3, 0, index)' v-bind:ref='"date-" + index + "-2"'
            oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
            >

          <input type="text" class='complex-input__text block-4' placeholder='/' disabled>

          <input type="tel" class='complex-input__text complex-input__underline block-5' maxlength="4" placeholder="гггг" 
            v-model='person.bdate.year' 
            @input='bdateBlockOnInput(person.bdate.year, 4, "no", 1, index)' @blur='bdateBlockOnBlur(person.bdate.year, index, 4)' v-bind:ref='"date-" + index + "-3"'
            oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
            >

        </div>
        <div class="person-error-tooltip" v-if='person.bdateValidateFail'>
          Вы ввели некорректную дату
        </div>
      </div>
      
      <!--   ТЕЛЕФОН   -->

      <div class="person-form">
        <label for="" class="person-label">Ваш контактный телефон</label>
        <div class="complex-input__wrapper" v-bind:class="{ 'validate-fail': person.phoneValidateFail }">
          <input type="text" class='complex-input__text block-1' placeholder='+38 (' disabled>

          <input type="tel" class='complex-input__text complex-input__underline block-2' maxlength="3"
            v-model='person.phone.first' 
            @input='phoneBlockOnInput(person.phone.first, 3, 2, index)' 
            oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
            >

          <input type="text" class='complex-input__text block-3' placeholder=')' disabled>

          <input type="tel" class='complex-input__text complex-input__underline block-2' maxlength="3"
            v-model='person.phone.second' v-bind:ref='"phone-" + index + "-2"' @input='phoneBlockOnInput(person.phone.second, 3, 3, index)'
            oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
            >

          <input type="tel" class='complex-input__text complex-input__underline block-4' maxlength="2" 
            v-model='person.phone.third' v-bind:ref='"phone-" + index + "-3"' @input='phoneBlockOnInput(person.phone.third, 2, 4, index)'
            oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
            >

          <input type="tel" class='complex-input__text complex-input__underline block-4' maxlength="2"  
            v-model='person.phone.fourth' v-bind:ref='"phone-" + index + "-4"' @input='phoneBlockOnInput(person.phone.fourth, 2, "no", index)'
            oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
            >
        </div>
        <div class="person-error-tooltip" v-if='person.phoneValidateFail'>
          Вы ввели некорректный номер телефона
        </div>
      </div>
      
      <!--   МЕСТО   -->

      <div class="person-form" v-if='person.offerNeeded'>
<!--      <div class="person-form">-->
        <label for="" class="person-label">Место в номере</label>
        <select class="person-input__text" v-model='person.offerChosen' @change='onOfferChosen(index)' v-bind:class="{ 'validate-fail': person.offerValidateFail }">
          <option disabled value=''>Выберите тип брони</option>
          <option v-for="(offer, i) in date.offers" v-bind:value="i" v-bind:key="offer.name">{{ offer.name }}</option>
        </select>
      </div>
      
      <!--   СКИДКА   -->

      <div class="person-form" v-if='parseInt(person.offerChosen) > -1 && person.variantNeeded'>
        <label for="" class="person-label">Скидка</label>
        <select class="person-input__text" v-model='person.variantChosen' @change='onVariantChosen(index)' v-bind:class="{ 'validate-fail': person.variantValidateFail }">
<!--          <option disabled value=''>Выберите скидку</option>-->
          <option v-for="variant in date.offers[person.offerChosen].offerTypes" v-bind:value="variant.type" v-bind:key="variant.type">{{ variant.type != "Обычный" ? variant.type : "Без скидки" }}</option>
        </select>
      </div>
      
      <!--   СТУДАК   -->
      
      <div class="person-form" v-if='person.variantChosen.toLowerCase() == "студент"'>
        <label for="" class="person-label">Номер студенческого билета</label>
        <input type="text" class="person-input__text" placeholder='XX00000000' v-model='person.student' maxlength="10" @input='validateStudent(index)' v-bind:class="{ 'validate-fail': person.studentValidateFail }">
        <div class="person-error-tooltip" v-if='person.studentValidateFail'>
          Вы ввели некорректный номер студенческого билета
        </div>
      </div>

      <vector src="../../assets/img/icons/close.svg" class="person-delete" v-if='personList.length > 1' @click.native='deletePerson(index)'></vector>

    </div>

    <div class="add" @click='initAddPerson' v-if='personList.length < placesLeft'>
<!--    <div class="add" @click='initAddPerson'>-->
      <div class="add-image">
        <!--            <img src="./img/icons/plus.svg" alt="">-->
        <vector src="../../assets/img/icons/plus.svg"></vector>
      </div>
      <div class="add-inside">
        <h3 class="add-header">
          Добавить человека
        </h3>
        <div class="add-text">
          Вместе веселее!
        </div>
      </div>
    </div>
    <div class="add" v-else>
      <div class="add-inside">
        <div class="add-text">
          Больше свободных мест нет!  
        </div>
      </div>
    </div>
    <div class="person-form comment-form">
      <label for="" class="person-label">Комментарий к заказу</label>
      <textarea class="person-input__text" placeholder='Оставьте общий комментарий к заказу' @change='editComment' v-model='comment' v-bind:class="{ 'validate-fail': commentValidateFail }"></textarea> 
      <div class="person-error-tooltip" v-if='commentValidateFail'>
        Укажите кто и с кем будет жить
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

import validate from '../../lib/validatelib'

  
export default {
  name: 'bookingStage1Component',
  props: {
    'id': {
      type: String,
    },
    'dateid': {
      type: String,
    },
//    'comment': {
//      type: String,
//    },
    'date': {
      type: Object,
    },
    'stage2': {
      type: Boolean,
    },
    'commentValidateFail': {
      type: Boolean,
    },
//    'personUpdate': {
//      type: Boolean,
//    },
    'personList': {
      type: Array,
    },
    'placesLeft': {
      type: Number,
    },
  },
  data () {
    return {
//      personList: [],
      payment: {
        deposit: '',
        price: '',
        currency: ''
      },
      comment: '',
      errorList: [],
      formErrors: [
        {
          surnameError: false,
          nameError: false,
          dateError: false,
          phoneError: false,
        }
      ],
      firstUpdate: true,
      namesList: [{
        name: '',
        surname: '',
//        father: ''
      }]
    }
  },
//  computed: {
//    
//  },
  methods: {
    bdateBlockOnInput: function (value, maxlength, nextBlock, year, personIndex) { 
      this.errorList = [];
      if (value.length <= 0) {
        this.personList[personIndex].bdateValidateFail = false;
        return;
      }
//      console.log(this.$refs['dateSecond']);

      if (isNaN(value)) {
        
        this.personList[personIndex].bdateValidateFail = true; 
        
      } else {
                
        let d = new Date();
        
        if (year == 1 && value.length > 3) {

          if (parseInt(value) <= 1900 || parseInt(value) > d.getFullYear()) {
            
            this.personList[personIndex].bdateValidateFail = true;  
            
          } 
        } else {
          
          this.personList[personIndex].bdateValidateFail = false; 
          
        } 
      }
      
      if (value.length >= maxlength && !this.personList[personIndex].bdateValidateFail) {
        
        if (!isNaN(nextBlock)) this.$refs['date-' + personIndex + '-' + nextBlock][0].focus();
        
        return;
      }
    }, 
    bdateBlockOnBlur: function (value, personIndex, maxLength) { 
      if (value.length > 0 && value.length < maxLength) {
        this.personList[personIndex].bdateValidateFail = true; 
      } 
    }, 
    phoneBlockOnInput: function (value, maxlength, nextBlock, personIndex) { 
      this.errorList = [];
      if (value.length <= 0) {
        this.personList[personIndex].phoneValidateFail = false;
        return;
      }

      if (isNaN(value)) {
        
        this.personList[personIndex].phoneValidateFail = true; 
        
      } else {
                  
        this.personList[personIndex].phoneValidateFail = false; 
          
      }
      
      if (value.length >= maxlength && !this.personList[personIndex].phoneValidateFail) {
        
        if (!isNaN(nextBlock)) this.$refs['phone-' + personIndex + '-' + nextBlock][0].focus();
        
        return;
      }
      
    }, 
    validateStudent: function (index) {
      let data = this.personList[index].student;
      
      if (data.length <= 0) {
        this.personList[index].studentValidateFail = false;
        return;
      }
      
      if (!isNaN(data.substr(0,2)) || isNaN(data.substr(2))) {
        this.personList[index].studentValidateFail = true;  
      } else {
        this.personList[index].studentValidateFail = false;   
      }
      
//      if (isNaN(data.substr(2))) {
//        this.personList[index].studentValidateFail = true;  
//      }
    },
    validateUsers: function () {     
      this.errorList = []
      
      this.$emit('validate-comment'); 
            
      if (this.personList.length > 2 && this.comment.length <= 0) {
        this.errorList.push('Пустой комментарий')  
      }
      
      this.personList.forEach((e, i) => {
        e.nameValidateFail = false;
        e.surnameValidateFail = false;
        e.bdateValidateFail = false;
        e.phoneValidateFail = false;
        
        if (e.name.length <= 0) {
          this.errorList.push('Введите имя персоне #' + (i + 1))
          e.nameValidateFail = true;
        }
        
//        if (/\d/.test(e.name)) {
        if (!/^[A-ZА-ЯЁ\s-]+$/i.test(e.name) || e.name.split(' ').length > 3) {
          this.errorList.push('Некорректные ФИО у персоны #' + (i + 1) + '. ФИО не должны содержать цифры, спецсимволы и пробелы')
          e.nameValidateFail = true;
        }

        
        if (this.namesList[i].surname.length == 0) {
          this.errorList.push('Введите фамилию персоны #' + (i + 1))
          e.surnameValidateFail = true;
        }
        
        if (this.namesList[i].name.length == 0) {
          this.errorList.push('Введите имя персоны #' + (i + 1))
          e.nameValidateFail = true;
        }
        
//        if (this.namesList[i].father.length == 0) {
//          this.errorList.push('Введите отчество персоны #' + (i + 1))
//          e.nameValidateFail = true;
//        }

        let date = e.bdate.year + '-' + e.bdate.month + '-' + e.bdate.day; 

        if (isNaN(Date.parse(date))) {
          this.errorList.push('Некорректная дата рождения у персоны #' + (i + 1))
          e.bdateValidateFail = true;
        }
        
        if (e.phone.first.length < 3 || e.phone.second.length < 3 || e.phone.third.length < 2 || e.phone.fourth.length < 2) {
          e.phoneValidateFail = true;
          this.errorList.push('Некорректный номер у персоны #' + (i + 1))
        }
        
        if (e.offerChosen.length <= 0) {
          this.errorList.push('Выберите место персоне #' + (i + 1))
          e.offerValidateFail = true;
        }
        
        if (e.variantChosen.length <= 0) {
          this.errorList.push('Выберите скидку персоне #' + (i + 1))
          e.variantValidateFail = true;
        }
      });
      
//      console.log(this.errorList);
      
      if (this.errorList.length <= 0) {
        this.$router.push('/order/' + this.id + '/' + this.dateid + '/stage-2');   
      } else {
        this.$emit('validate-fail');
      }
    },
    initAddPerson: function () {
      this.$emit('init-add-person')  
    }, 
    deletePerson: function (index) { 
      this.personList.splice(index, 1); 
      this.changePayment(); 
    }, 
    onOfferChosen: function (index) { 
//      console.log(index)
      
      this.errorList = [];
      
      let variantEmpty = this.personList[index].variantChosen.length == 0;
                  
      let variantExists = this.containsVariant(this.personList[index].variantChosen, this.date.offers[this.personList[index].offerChosen].offerTypes)
      
//      console.log('variant empty? ' + variantEmpty) 
//      console.log('variant exists? ' + variantExists) 
      
      if (variantEmpty || !variantExists) this.personList[index].variantChosen = 'Обычный'; 
      
//      console.log(this.personList[index].offerChosen)
      
      if (this.date.offers[this.personList[index].offerChosen].offerTypes.length == 1) 
        this.personList[index].variantNeeded = false;
      else
        this.personList[index].variantNeeded = true;  
      
      
      
      this.personList[index].payment = {
        deposit: '',
        price: '',
        currency: ''
      }
      
      this.onVariantChosen(index)
      
//      this.changePayment();
    }, 
    onVariantChosen: function (index) { 
//      console.log(index);
//      console.log(this.date);
      this.errorList = [];
      let offer = this.date.offers[this.personList[index].offerChosen].offerTypes.filter(e => e.type == this.personList[index].variantChosen)[0];
            
      this.personList[index].payment.deposit = offer.deposit;
      this.personList[index].payment.price = offer.price;

//      console.log(this.personList[index].payment);
      
      this.personList[index].payment.currency = this.date.offers[this.personList[index].offerChosen].currency;  
      
      this.changePayment();   
    }, 
    changePayment: function () { 
      
      this.payment.deposit = 0
      this.payment.price = 0
      
      this.personList.forEach((e, index) => {
        
        if (e.payment.deposit != '') this.payment.deposit += parseInt(e.payment.deposit)
        if (e.payment.price != '') this.payment.price += parseInt(e.payment.price)
           
//        console.log(this.payment.deposit + " - " + this.payment.price);
        
      })
            
      this.payment.currency = this.date.offers[this.personList[0].offerChosen].currency;  
      
      this.$emit('payment-changed', this.payment)      
    },
    editComment: function () { 
      this.errorList = [];
      this.$emit('comment-changed', this.comment)
      
    },
    containsVariant: function (type, list) {

      var i;
      for (i = 0; i < list.length; i++) {
        if (list[i].type == type) {
          return true;
        }
      }
      return false;
    },
    changePersonName: function (index) {
      this.personList[index].name = this.namesList[index].surname + ' ' + this.namesList[index].name;
    },
    parseNames: function () {
      console.log('-------- parse names ----------');
      this.personList.forEach((e, index) => {
        console.log('name:', e.name);
        let nameArr = [];
        if (e.name.length > 0) {
          nameArr = e.name.split(' ') 
          if (this.namesList.length < this.personList.length) {
            this.namesList.push({
              name: nameArr[1],
              surname: nameArr[0],
//              father: nameArr[2]  
            });
          } else {
            this.namesList[index] = {
              name: nameArr[1],
              surname: nameArr[0],
//              father: nameArr[2]  
            };    
          }
          
          console.log(this.namesList);
        }
      });  
    }
    
  },
  watch: { 
    stage2: function(newVal, oldVal) { // watch it
      if (newVal) {
        this.validateUsers()
      }
    },
    personList: function(newVal, oldVal) { // watch it
//      console.log('personList watch');
//      console.log(oldVal);
//      console.log(newVal);
      
      while (this.namesList.length < this.personList.length) {
        this.namesList.push({
          name: '',
          surname: '',
//          father: ''
        });
      }
      
      if (this.namesList.length > this.personList.length) {
        this.namesList = this.namesList.slice(0, this.personList.length)
      }
//      if (this.firstUpdate) {
      this.personList.forEach((e, index) => this.onOfferChosen(index))
        
//        this.firstUpdate = false;
//      }
      
    }
  },
  created: function () { 
//    console.log('stage 1 mount');
    this.parseNames();
  }
}

</script>

<style lang="sass" scoped>
  @import "../../assets/sass/booking.sass" 
</style>

<style>
  input[type='number']::-webkit-inner-spin-button, 
  input[type='number']::-webkit-outer-spin-button { 
      -webkit-appearance: none;    
      appearance: none;
      margin: 0;  
  }
  input[type='number'], 
  input[type='number']:hover,
  input[type='number']:focus {
    -moz-appearance: textfield;
}</style>
