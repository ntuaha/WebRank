
function getDateString(d){
  var year = d.getFullYear();
  var month = d.getMonth()+1;
  month = (month<10)?'0'+month:month;
  var day = d.getDate();
  day = (day<10)?'0'+day:day;
  var hour = d.getHours();
  hour = (hour<10)?'0'+hour:hour;
  var min = d.getMinutes();
  min = (min<10)?'0'+min:min;
  var sec = d.getSeconds();
  sec = (sec<10)?'0'+sec:sec;
  //return year+month+day+hour+min+sec;
  return year.toString()+month.toString()+day.toString();
}



module.exports = {
  "getDateString": getDateString
};
