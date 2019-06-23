import admin from './adminlib'

export default {
  
  mainBlock: (dataObj) => {
    
    let errorList = []
    if (dataObj.title.length <= 0) {
      errorList.push('Вы не ввели название');  
    }
        
    if (dataObj.info.length <= 0) {
      errorList.push('Вы не ввели подзаголовок');  
    }
    
    if (dataObj.images.length <= 0) {
      errorList.push('Загрузите как минимум одну обложку');  
    }
    
    if (dataObj.priceDisclaimer.length <= 0) {
      errorList.push('Заполните текст блока цен');  
    }
    
    return errorList;

  },
  
  content: (dataObj) => {
    
    let errorList = []
    
    dataObj.forEach((e, index) => {
      
      if (e.first.length <= 0) {
        errorList.push('Блок контента #' + (index + 1) + ': Вы не ввели название');  
      } 
      if (e.second.length <= 0) {
        errorList.push('Блок контента #' + (index + 1) + ': Вы не ввели текст');  
      } 
    });

    console.log(errorList);
    
    return errorList;

  },
  
  dates: (e) => {
    
    
    let errorList = []
    
//    dataObj.forEach((e, index) => {

      if (e.startDateObj.day.length <= 0 
          || e.startDateObj.month.length <= 0 
          || e.startDateObj.year.length <= 0 
          || e.startDateObj.hours.length <= 0 
          || e.startDateObj.minutes.length <= 0 
          
          || parseInt(e.startDateObj.day) < 0 
          || parseInt(e.startDateObj.day) > 31
          
          || parseInt(e.startDateObj.month) < 1 
          || parseInt(e.startDateObj.month) > 12
          
          || parseInt(e.startDateObj.year) < 2018 
          
          || parseInt(e.startDateObj.hours) < 0 
          || parseInt(e.startDateObj.hours) > 23 
          
          || parseInt(e.startDateObj.minutes) < 0 
          || parseInt(e.startDateObj.minutes) > 59 
      ) {
        errorList.push('Вы неправильно ввели дату начала');  
      } 
      
      if (e.endDateObj.day.length <= 0 
          || e.endDateObj.month.length <= 0 
          || e.endDateObj.year.length <= 0 
          || e.endDateObj.hours.length <= 0 
          || e.endDateObj.minutes.length <= 0 
          
          || parseInt(e.endDateObj.day) < 0 
          || parseInt(e.endDateObj.day) > 31
          
          || parseInt(e.endDateObj.month) < 1 
          || parseInt(e.endDateObj.month) > 12
          
          || parseInt(e.endDateObj.year) < 2018 
          
          || parseInt(e.endDateObj.hours) < 0 
          || parseInt(e.endDateObj.hours) > 23 
          
          || parseInt(e.endDateObj.minutes) < 0 
          || parseInt(e.endDateObj.minutes) > 59 
      ) {
        errorList.push('Вы неправильно ввели дату конца');  
      } 
      
      e.offers.forEach((o, i) => {
        if (o.name.length <= 0) {
          errorList.push('Цена #' + (i + 1) + ': Вы не ввели название') 
        }    
        
        o.offerTypes.forEach((t, j) => {
          if (t.type.length <= 0) {
            errorList.push('Цена #' + (i + 1) + ', вариант #' + (j + 1) + ': Вы не ввели название') 
          } 
          if (t.price.length <= 0) {
            errorList.push('Цена #' + (i + 1) + ', вариант #' + (j + 1) + ': Вы не ввели цену') 
          } else {
            if (isNaN(parseInt(t.price))) {
              errorList.push('Цена #' + (i + 1) + ', вариант #' + (j + 1) + ': Вы неправильно ввели цену') 
            }   
            
            if (parseInt(t.price) <= 0) {
              errorList.push('Цена #' + (i + 1) + ', вариант #' + (j + 1) + ': Цена должна быть больше нуля') 
            }   
          }
          
          if (t.deposit.length <= 0) {
            errorList.push('Цена #' + (i + 1) + ', вариант #' + (j + 1) + ': Вы не ввели аванс (поставьте 0 если не нужен аванс)') 
          } else {
            if (isNaN(parseInt(t.deposit))) {
              errorList.push('Цена #' + (i + 1) + ', вариант #' + (j + 1) + ': Вы неправильно ввели аванс') 
            }   
          }
          if (parseInt(t.deposit) > parseInt(t.price)) {
            errorList.push('Цена #' + (i + 1) + ', вариант #' + (j + 1) + ': Аванс больше чем цена') 
          } 
        });
      });
    
//    });

//    console.log(dataObj);
    
    return errorList;

  },
  
  newsPost: (dataObj) => {
    
    let errorList = []
    if (dataObj.title.length <= 0) {
      errorList.push('Вы не ввели название');  
    }
    
    console.log(dataObj.content);
    
    if (dataObj.content.length <= 0 || dataObj.content == '<p><br></p>') {
      errorList.push('Вы не ввели текст');  
    }
    
    if (dataObj.image.length <= 0) {
      errorList.push('Загрузите обложку');  
    }
    
    return errorList;

  },
  
  curatorReg: (dataObj) => {
    console.log('a');
    
    let errorList = []
    if (dataObj.login.length <= 0) {
      errorList.push('Вы не ввели email');  
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dataObj.login)) {
      errorList.push('Вы ввели некорректный email');  
    } 
    
    if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(dataObj.phone)) {
      errorList.push('Вы ввели некорректный номер');  
    }    
    
//    console.log(dataObj.content);
    
    if (dataObj.pass.length <= 0) {
      errorList.push('Вы не ввели пароль');  
    }
    
//    if (dataObj.image.length <= 0) {
//      errorList.push('Загрузите обложку');  
//    }
    
    return errorList;

  },
  
  curatorEdit: (dataObj) => {
    console.log('a');
    
    let errorList = []
    if (dataObj.name.length <= 0) {
      errorList.push('Вы не ввели имя');  
    }
    
    if (dataObj.phone.length <= 0) {
      errorList.push('Вы не ввели номер телефона');  
    }
    
    if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(dataObj.phone)) {
      errorList.push('Вы ввели некорректный номер телефона');  
    }    
    
    
    if (dataObj.photo.length <= 0) {
      errorList.push('Вы не загрузили фото');  
    }
    
    
//    if (dataObj.image.length <= 0) {
//      errorList.push('Загрузите обложку');  
//    }
    
    return errorList;

  },
  
  convertCase: (str) => {
    var lower = String(str).toLowerCase();
    return lower.replace(/(^| )(\w)/g, function(x) {
      return x.toUpperCase();
    });
  }
  
}
