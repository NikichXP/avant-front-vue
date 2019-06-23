import moment from "moment-timezone"

export default {
  getMonthNameVar1: (month) => {
    month += '';
    if (month[0] == '0') {
      month = month.splice(1,1);
    }
    switch (month) {
      case '1':
        return 'январь';
      case '2':
        return 'февраль';
      case '3': 
        return 'март';
      case '4':
        return 'апрель';
      case '5':
        return 'май';
      case '6':
        return 'июнь';
      case '7':
        return 'июль';
      case '8':
        return 'август';
      case '9':
        return 'сентябрь';
      case '10':
        return 'октябрь';
      case '11':
        return 'ноябрь';
      case '12':
        return 'декабрь';
    }  
    return null;
  },
  getMonthNameVar2: (month) => {    
    month += '';
    switch (month) {
      case '1':
        return 'января';
      case '2':
        return 'февраля';
      case '3':
        return 'марта';
      case '4':
        return 'апреля';
      case '5':
        return 'мая';
      case '6':
        return 'июня';
      case '7':
        return 'июля';
      case '8':
        return 'августа';
      case '9':
        return 'сентября';
      case '10':
        return 'октября';
      case '11':
        return 'ноября';
      case '12':
        return 'декабря';
    }  
    return null;
  },
  getDayName: (day) => {    
    day += '';
    switch (day) {
      case '1':
        return 'понедельник';
      case '2':
        return 'вторник';
      case '3':
        return 'среда';
      case '4':
        return 'четверг';
      case '5':
        return 'пятница';
      case '6':
        return 'суббота';
      case '0':
        return 'воскресение';
      
    }  
    return null;
  },
  createFormData: (obj) => {
    let keys = Object.keys(obj);
    
    let data = new FormData();
    
    keys.forEach(e => {
      data.append(e, obj[e]);
    });
    
    return data;
  },
  createTimezoneDate: (timestamp) => {
//    var currentHoursOffset = 3;
//    var date = new Date(timestamp);
//    var hoursOffset = currentHoursOffset*60*60000;
//    var userOffset = date.getTimezoneOffset()*60000; // [min*60000 = ms]
//    var kievTime = new Date(date.getTime() + hoursOffset + userOffset); 
    
//    console.log(timestamp);
    var kievTime = moment.tz(timestamp, "Europe/Kiev")
//    console.log(kievTime.utc().unix());
    
    return new Date(kievTime.utc().unix() * 1000);
  }
}
