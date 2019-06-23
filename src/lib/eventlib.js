export default {
  createEventsList: (event, month) => {
    let result = [];
  
    if (month) {
      let date = new Date(month), 
        y = date.getFullYear(), 
        m = date.getMonth();
    
      let firstDay = new Date(y, m, 1).getTime();
      let lastDay = new Date(y, m + 1, 1).getTime();
      
//      console.log(new Date(event.date.startDate))

      if (event.date != null) {
//        event.dates.forEach(e => {
          if (event.date.startDate >= firstDay && event.date.startDate <= lastDay) {
//          if (e.startDateTimeStamp >= firstDay) {
            result.push({
              name: event.title,
              id: event.id,
              date: event.date.startDate, 
              dateId: event.date.id,
              img: event.headImg[0],
              icon: event.icon,
              urlName: event.urlName
            });
          } 
//        });  
      }
      
    } else {
      if (event.date != null) { 
//        event.dates.forEach(e => {
          result.push({
            name: event.title,
            id: event.id,
            date: event.date.startDate,
            dateId: event.date.id,
            img: event.headImg[0],
            urlName: event.urlName
          });
//        });
      }
    }
    
    console.log(result)
    
    return result;  
  },
  createMonthsList: (firstDate, lastDate) => {
    let result = [];

    let month = firstDate.getMonth();
    let year = firstDate.getFullYear();

    do {
      let monthStr = (month + 1) < 10 ? '0' + (month + 1) : '' + (month + 1);
      var dateStr = '' + year + '-' + monthStr;
      
      result.push('' + year + '-' + monthStr);

      if (month + 1 >= 12) {
        month = 0;
        year++;
      } else {
        month++;
      }
    } while (month <= lastDate.getMonth() && year <= lastDate.getFullYear())
    
    return result;
  },
  createClosestList: (event) => {
    let result = [];

    let date = new Date();
    
    if (event.dates.length > 0) {
      event.dates.forEach(e => {
        if (e.startDateTimeStamp >= date.getTime()) {
          result.push({
            name: event.title,
            id: event.id,
            date: e.startDateTimeStamp,
            dateId: e.id,
            headImg: event.headImg[0],
            urlName: event.urlName
          });
        } 
      });  
    }   
    return result;  
  },
  findDate: (dateStr, dates) => {    
    let dateSplit = dateStr.split('-');
    
    let date = new Date(dateSplit[2], (dateSplit[1] - 1), dateSplit[0]);
        
    return dates.filter(e => {
      let d = new Date(e.startDateTimeStamp);
      d.setHours(0,0,0,0);
      
      return d.getTime() === date.getTime();
    })[0];
  },
  createDateURL: (d) => {
    let result = '';
    
    let date = new Date(d);
    
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
    let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1); 
    
    result += day + '-' + month + '-' + date.getFullYear();
    
    return result; 
  },
  roomsList: () => {
    return [
      { 
        name: '1-местный',
        alias: '1-местный',
        places: 1
      },
      { 
        name: '2-х местный с раздельными кроватями',
        alias: '2-х местный',
        places: 2
      },
      { 
        name: '2-х местный с двуспальной кроватью',
        alias: '2-х местный',
        places: 1
      },
      { 
        name: '3-х местный с раздельными кроватями',
        alias: '3-х местный',
        places: 3
      },
      { 
        name: '3-х местный, кровати двуспальная+односпальная',
        alias: '3-х местный',
        places: 3
      },
      { 
        name: '4-х местный с раздельными кроватями',
        alias: '4-х местный',
        places: 4
      },
      { 
        name: '4-х местный с двуспальными кроватями',
        alias: '4-х местный',
        places: 4
      },
      { 
        name: '4-х местный, кровати двуспальная+односпальные',
        alias: '4-х местный',
        places: 4
      },
      
      { 
        name: '1-местный, удобства на этаже',
        alias: '1-местный',
        places: 1
      },
      { 
        name: '2-х местный с раздельными кроватями, удобства на этаже',
        alias: '2-х местный',
        places: 2
      },
      { 
        name: '2-х местный с двуспальной кроватью, удобства на этаже',
        alias: '2-х местный',
        places: 2
      },
      { 
        name: '2-х местный с раздельными кроватями, удобства на этаже',
        alias: '2-х местный',
        places: 2
      },
      { 
        name: '2-х местный с двуспальной кроватью, удобства на этаже',
        alias: '2-х местный',
        places: 2
      },
      { 
        name: '3-х местный с раздельными кроватями, удобства на этаже',
        alias: '3-х местный',
        places: 3
      },
      { 
        name: '3-х местный, кровати двуспальная+односпальная, удобства на этаже',
        alias: '3-х местный',
        places: 3
      },
      { 
        name: '4-х местный с раздельными кроватями, удобства на этаже',
        alias: '4-х местный',
        places: 4
      },
      { 
        name: '4-х местный с двуспальными кроватями, удобства на этаже',
        alias: '4-х местный',
        places: 4
      }, 
      { 
        name: '4-х местный, кровати двуспальная+односпальные, удобства на этаже',
        alias: '4-х местный',
        places: 4
      },      
    ]
  }

}
