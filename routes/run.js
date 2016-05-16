const path = require('path');
const childProcess = require('child_process');
const phantomjs = require('phantomjs-prebuilt');

const jsdom = require("node-jsdom");
const fs = require("fs");
const jquery = fs.readFileSync(__dirname+"/jquery.js", "utf-8");
const exec_js_path = path.join(__dirname, '/alexa.js');

const csvWriter = require('csv-write-stream');

const util = require('./util');



function extractInfo(in_file,company){
  return new Promise(function(resolve){
    jsdom.env({
      "file": in_file,
      "src": [jquery],
      "done": function(error,window){
          var $ = window.$;
          var data = {};
          data.company = company;
          data.global_rank = +$(".globleRank strong:eq(2)").text().replace(/[\n ,]/g,'');
          data.tw_rank = +$(".countryRank strong:eq(2)").text().replace(/[\n ]/g,'');
          data.Bound_Rate = $("h4.metrics-title:contains('Bounce Rate')").parent().find('.metrics-data').text().replace(/[ \n]/g,'');
          data.DPV = $("h4.metrics-title:contains('Daily Pageviews per Visitor')").parent().find('.metrics-data').text().replace(/[ \n]/g,'');
          data.DTS = $("h4.metrics-title:contains('Daily Time on Site')").parent().find('.metrics-data').text().replace(/[ \n]/g,'');
          data.Search_Visits = $("h4.metrics-title:contains('Search Visits')").parent().find('.metrics-data').text().replace(/[ \n]/g,'');
          data.Total_Sites_Linking_Number = +$("h5.font-1").next().text();

          var Top_Keywords_From_SE = $(".topkeywordellipsis").map(function(){
            var jthis = $(this);
            return {
              "title": jthis.attr("title"),
              "count": +jthis.parent().attr("data-count"),
              "percent": jthis.next().text()
            };
          });

          var Linkin_Site = $("#linksin_table tbody tr").map(function(){
            var jthis = $(this);
            return {
              "count": +jthis.attr("data-count"),
              "host": jthis.find("a:eq(0)").text(),
              "link": jthis.find("a:eq(1)").attr("href")
            };
          });
          for (var j = 0; j<5;j++){
            data["Top_Keywords_From_SE_"+(j+1)] = Top_Keywords_From_SE[j].count + " || " + Top_Keywords_From_SE[j].title + " || " + Top_Keywords_From_SE[j].percent;
          }

          for (var i =0;i<5;i++){
            data["Linkin_Site_"+(i+1)] = Linkin_Site[i].count + " || " + Linkin_Site[i].host + " || " + Linkin_Site[i].link;
          }

          data.load_velocity_rank =  $("#loadspeed-panel-content span").text();
          data.load_velocity_desc =  $("#loadspeed-panel-content p").text();
          //writeToCSV(data,out_file);
          resolve(data);
      }
    });
  });
}

function writeToCSV(data,filename){
  var writer = csvWriter();
  writer.pipe(fs.createWriteStream(filename));
  for(var i in data){
    writer.write(data[i]);
  }
  writer.end();
}

function extractData(href,time_string,company){
  return new Promise(function(resolve){
    var html_filepath = __dirname+"/../rawdata/"+company+"_"+time_string+".html";
    var childArgs = [
      exec_js_path,
      [href,html_filepath]
    ];
    childProcess.execFile(phantomjs.path, childArgs, function(err, stdout, stderr) {
      if(err){
        console.log("stderr:" + stderr);
      }
      console.log(company+"RUN");
      resolve(html_filepath);
    });
  });
}


function run(href,time_string,company,company_name){
  return extractData(href,time_string,company)
  .then(function(html_path){
    return extractInfo(html_path,company_name);
  });
}

var time_string = util.getDateString(new Date());
var tasks = [];
tasks.push(run("http://www.alexa.com/siteinfo/esunbank.com.tw",time_string,"esun","玉山銀行"));
tasks.push(run("http://www.alexa.com/siteinfo/ctbcbank.com",time_string,"ctbc","中國信託"));
tasks.push(run("http://www.alexa.com/siteinfo/citibank.com.tw",time_string,"Citibank","花旗銀行"));
tasks.push(run("http://www.alexa.com/siteinfo/sinopac.com",time_string,"sinopac","永豐銀行"));
tasks.push(run("http://www.alexa.com/siteinfo/taishinbank.com.tw",time_string,"taishinbank","台新銀行"));
tasks.push(run("http://www.alexa.com/siteinfo/firstbank.com.tw",time_string,"firstbank","第一銀行"));
tasks.push(run("http://www.alexa.com/siteinfo/mybank.com.tw",time_string,"cathaybk","國泰世華"));
tasks.push(run("http://www.alexa.com/siteinfo/hncb.com.tw",time_string,"hncb","華南銀行"));
tasks.push(run("http://www.alexa.com/siteinfo/fubon.com",time_string,"fubon","富邦銀行"));
tasks.push(run("http://www.alexa.com/siteinfo/post.gov.tw",time_string,"post","郵局"));
tasks.push(run("http://www.alexa.com/siteinfo/bot.com.tw",time_string,"taiwanbank","臺灣銀行"));

Promise.all(tasks).then(function(data){
  data = data.sort(function(a,b){
    return a.tw_rank - b.tw_rank;
  });
  writeToCSV(data, __dirname+"/../data/alexa_detail_"+time_string+".csv");
});
