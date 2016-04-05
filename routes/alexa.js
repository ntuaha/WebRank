var fs = require('fs');
var page = require('webpage').create();
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';
var system = require('system');

/*
var jq = document.createElement('script');
jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);
// ... give time for script to load, then type.
jQuery.noConflict();
*/


function getRankWithPage(href,filename){
  page.open(href, function(status) {
    if (status === "success") {
      var f = fs.open(filename,{"mode": "w","charset": "utf8"} );
      f.write(page.content);
      f.close();
      phantom.exit();
    } else {
      phantom.exit(1);
    }
  });
}
var args = system.args[1].split(",");
getRankWithPage(args[0],args[1]);
