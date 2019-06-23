import axios from './axios.js'
 

import util from './util'



const getTimestampFromDateObj = (dateObj) => {
  let month = parseInt(dateObj.month) - 1;
  console.log('date obj')
  console.log(dateObj)
  let d = new Date(
    dateObj.year,
    month,
    dateObj.day,
    dateObj.hours,
    dateObj.minutes,
  ); 
  
  console.log(d)
  
//  return util.createTimezoneDate(d.getTime())
  return d.getTime()
   
};



export default {
  
  createContentData: (arr, id, video) => {

    let data = new FormData();
    data.append('id', id)

    arr.forEach(e => {
      if (e.first != 'Видео')
        data.append('eventContent:' + e.first, e.second);
    });
    
    if (video.length > 0) data.append('eventContent:Видео', video);
    
    return data;
  },
  createDateFormat: (timestamp) => {
    return createDate(timestamp)  
  },
  processOffers: (offers, eventId, oldOffers) => {
    
    if (oldOffers.length > 0) {
      oldOffers.forEach(e => {
        if (!offers.find(a => a.name == e.name )) {
          let data = new FormData();
          
          data.append('id', eventId)
//          data.append('dateId', dateId)
          data.append('offerName', e.name)  
          
          axios({
            method: 'post',
            url: '/admin/event/offers/delete',
            data: data,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(function (response) {
            console.log('offer delete OK');  
          })
          .catch(function (error) {
            console.log(error);
          });  
        }
      })
    }
    
    offers.forEach(e => {
      let data = new FormData();
      data.append('id', eventId)
//      data.append('dateId', dateId)
      data.append('offerName', e.name)  
//      console.log(e.currency);
      data.append('currency', e.currency)  
      
      e.offerTypes.forEach(o => {
        data.append(o.type, o.deposit == '0' ? o.price : o.deposit + '/' + o.price)
      });
      
      axios({
        method: 'post',
        url: '/admin/event/offer/set',
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response) {
        console.log('offer OK');  
      })
      .catch(function (error) {
        console.log(error);
      }); 
      
    });
  },
  createDate: (dateObj) => {
  
//    let d = new Date(getTimestampFromDateObj(dateObj));
//
//    let result = '' +
//        d.getFullYear() + 
//        '-' + 
//        ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) +
//        '-' +
//        (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) +
//        'T' +
//        (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) +
//        ':' +
//        (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()); 
//    console.log(result);
//    return result;
    let d = getTimestampFromDateObj(dateObj)
    return d
    
  },
  createImagesString: (arr) => {
    let result = '';
    
    arr.forEach(e => {
      result += e + ','
    });
    result = result.substring(0, result.length - 1);
    return result;
  },
  isImage: function (file) {
    console.log(file['type'].split('/'))
    return file['type'].split('/')[0] == 'image';//returns true or false
  },
  isSVG: function (file) {
    return file['type'].split('/')[1].indexOf('svg') != -1;//returns true or false
  },
  createURL: function (str) {
    var space = '-';
    var link = '';
    var transl = {
      'а': 'a',
      'б': 'b',
      'в': 'v',
      'г': 'g',
      'д': 'd',
      'е': 'e',
      'ё': 'e',
      'ж': 'zh',
      'з': 'z',
      'и': 'i',
      'й': 'j',
      'к': 'k',
      'л': 'l',
      'м': 'm',
      'н': 'n',
      'о': 'o',
      'п': 'p',
      'р': 'r',
      'с': 's',
      'т': 't',
      'у': 'u',
      'ф': 'f',
      'х': 'h',
      'ц': 'c',
      'ч': 'ch',
      'ш': 'sh',
      'щ': 'sh',
      'ъ': space,
      'ы': 'y',
//      'ь': space,
      'ь': '',
      'э': 'e',
      'ю': 'yu',
      'я': 'ya',
      'і': 'i',
      'ї': 'yi',
      'є': 'ye',
    }
    if (str != '')
      str = str.toLowerCase();

    for (var i = 0; i < str.length; i++) {
      if (/[а-яё]/.test(str.charAt(i))) { // заменяем символы на русском
        link += transl[str.charAt(i)];
      } else if (/[a-z0-9]/.test(str.charAt(i))) { // символы на анг. оставляем как есть
        link += str.charAt(i);
      } else {
        if (link.slice(-1) !== space) link += space; // прочие символы заменяем на space
      }
    }
    return link;
  }
  
}
