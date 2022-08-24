const numberService = require('./number.service');
var moment = require('moment');
function randomDate(startDate, endDate) {
  if (!startDate) {
    startDate = new Date(2010, 0, 1);
  }
  if (!endDate) {
    endDate = new Date();
  }

  return new Date(startDate.getTime()
    + numberService.randomInt(endDate.getTime() - startDate.getTime()));
}

function getYearStart(date) {
  return new Date(date.getFullYear(), 0, 1);
}

function getYearEnd(date) {
  return new Date(new Date(date.getFullYear() + 1, 0, 1) - 1);
}

function getMonthBefore(amount) {
  const monthsBefore = new Date();
  monthsBefore.setMonth(monthsBefore.getMonth() - amount);
  return monthsBefore;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date) {
  const startOfNextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return new Date(startOfNextMonth - 1);
}

function startOfWeek(date) {
  const day = date.getDay();
  const startOfWeek = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.getFullYear(), date.getMonth(), startOfWeek);
}

function endOfWeek(date) {
  const nextWeek = new Date(date);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const startOfNextWeek = startOfWeek(nextWeek);
  return new Date(startOfNextWeek - 1);
}

function getYearsBefore(amount) {
  return new Date(new Date().getFullYear() - amount, 0, 1);
}

function getWeekBefore() {
  const weekBefore = new Date();
  weekBefore.setDate(weekBefore.getDate() - 7);
  return weekBefore;
}

const shortMonthsNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function getShortMonthName(monthIndex) {
  return shortMonthsNames[monthIndex];
}

const shortWeekDayNames = ['Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun'];
function getShortWeekDay(dayIndex) {
  return shortWeekDayNames[dayIndex - 1];
}

function duration(startdate,enddate){
  var a = moment(enddate,"DD-MM-YYYY");
  var b = moment(startdate, "DD-MM-YYYY");

  var years = a.diff(b, 'year');
  b.add(years, 'years');

  var months = a.diff(b, 'months');
  b.add(months, 'months');

  var days = parseInt(a.diff(b, 'days'))+1;
  var weeks=0;

  if (moment(enddate,"DD-MM-YYYY").daysInMonth()==days){
    months = months + 1;
    days = 0;
  }
  if (months==12){
    years = years + 1;
    months = 0;
  }
  if(days!=0){
        if(days%7 ==0){
            weeks=days/7; days=0;
        }   
        if(days%7 !=0) { 
            weeks=Math.floor(days/7); 
            days=days%7;
        }
     }
   return {'years':years,'months':months,'weeks':weeks,'days':days};
 
}

function getDurationInString(duration){
  var d='days';if(duration.days==1) d='day'; if(duration.days==0) {d='';duration.days='';};
  var w='weeks'; if(duration.weeks==1) w='week';if(duration.weeks==0){w=''; duration.weeks=''} ;
  var m='months'; if(duration.months==1) m='month';  if(duration.months==0) {m='';duration.months=''};
  var y='years'; if(duration.years==1) y='year'; if(duration.years==0) {y=''; duration.years=''};
  var cduration=duration.years+' '+y+' '+duration.months+' '+m+' '+duration.weeks+' '+w+' '+duration.days+' '+d;
  return cduration;
}
module.exports = {
  randomDate,
  getYearsBefore,
  getWeekBefore,
  getShortMonthName,
  getShortWeekDay,
  getYearStart,
  getYearEnd,
  getMonthBefore,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  duration,
  getDurationInString,
};
