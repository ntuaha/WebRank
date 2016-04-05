const jsdom = require("node-jsdom");
const fs = require("fs");
const jquery = fs.readFileSync(__dirname+"/jquery.js", "utf-8");
const csvWriter = require('csv-write-stream');

// https://stackoverflow.com/questions/1418050/string-strip-for-javascript
if(typeof(String.prototype.trim) === "undefined"){
  String.prototype.trim = function(){
    return String(this).replace(/^\s+|\s+$/g, '');
  };
}

function getAlexaRankHref(page_number){
  var href = "http://www.alexa.com/topsites/countries;"+page_number+"/TW";
  return href;
}


function getRankListWithPage(page_number){
  return new Promise(function(resolve,reject){
    jsdom.env({
      url: getAlexaRankHref(page_number),
      src: [jquery],
      done: function (errors, window) {
        var $ = window.$;
        var doms = $("li.site-listing");
        var data = [];
        for(var i=0;i<doms.length;i++){
          var dom = $(doms[i]);
          var count = +dom.find(".count").text();
          var site_title = dom.find("a:eq(0)").text();
          var site_href = "http://www.alexa.com"+dom.find("a").attr("href");
          var description = dom.find(".description").text() + dom.find(".remainder").text();
          data.push({"count":count, "title":site_title, "href": site_href,"description":description.trim()});
        }
        resolve(data);
      }
    });
  });

}

function mergeData(sets){
  var data = [];
  for(var i in sets){
    for(var j in sets[i]){
      data.push(sets[i][j]);
    }
  }
  return data;
}

function outputData(filename,data){
  var writer = csvWriter();
  writer.pipe(fs.createWriteStream(__dirname+'/'+filename));
  for(var i in data){
    writer.write(data[i]);
  }
  writer.end();
}

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
  return year+month+day+hour+min+sec;
  //return year+"-"+month+"-"day+" "+hour+":"+min+":"+sec;
  //YYYYMMDDhhmmss
}

function main(){
  var tasks = [];
  for(var i=0;i<20;i++){
    tasks.push(getRankListWithPage(i));
  }

  Promise.all(tasks).then(function(results){
    return new Promise(function(resolve){
      resolve(mergeData(results));
    });
  })
  .then(function(data){
    var sorted_data = data.sort(function(a,b){
      return a.count - b.count;
    });
    outputData(getDateString(new Date())+".csv",sorted_data);
  });
}
main();
