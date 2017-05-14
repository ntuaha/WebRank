var page = require('webpage').create();
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';
var system = require('system');
var fs = require('fs');
var system = require('system');

page.onConsoleMessage = function(msg) {
  console.log(JSON.stringify(msg));
}

/*
/home/aha/Project/WebRank/node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs rank_ph.js 'http://www.alexa.com/topsites/countries;0/TW'
*/
page.open(system.args[1], function(status) {
  if(status === "success") {    
    page.injectJs('../routes/jquery.js')    
    var data2 = page.evaluate(function() {
    var doms = $("div.site-listing");
      var data = [];
      for(var i=0;i<doms.length;i++){
        var dom = $(doms[i]);
        var DailyPageviewsPerVisitor= +dom.find("div.right:eq(1)").text();
        var site_title = dom.find("a:eq(0)").text();
        var site_href = "http://www.alexa.com"+dom.find("a").attr("href");
        var description = dom.find(".description").text() + dom.find(".remainder").text();
        data.push({"DailyPageviewsPerVisitor":DailyPageviewsPerVisitor, "title":site_title, "href": site_href,"description":description.trim()});
      }       
      return data;
    });
    console.log(JSON.stringify(data2))
    phantom.exit();   
  }else{
    phantom.exit(1);
  }
  
});


