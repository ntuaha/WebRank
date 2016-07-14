from selenium import webdriver
import os
from time import sleep as sleep
import datetime
import csv
import random

browser = webdriver.Chrome()
#browser = webdriver.PhantomJS()
#browser.set_window_size(1920, 1080)

href = "http://www.alexa.com/siteinfo/google.com.tw"
dirname = os.path.dirname(os.path.abspath(__file__));
print(dirname)
time_string = datetime.datetime.now().strftime("%Y%m%d")
with open(dirname+"/../data/alexa_categories_%s.csv"%time_string,"w+") as f:    
  with open(dirname+"/../data/%s.csv"%time_string, "r") as csvfile:
    reader = csv.reader(csvfile, delimiter=',', quotechar='"')
    i = 0
    for row in reader:
      if i==0:
        f.write("count,title,href,categories,description\n")
      else:
        (count,title,href,description) = row;
        print(href)
        browser.get(href)
        categories = "|".join(map(lambda x:x.text,browser.find_elements_by_css_selector("#category_link_table tr[class=' ']")))
        f.write(",".join([count,title,href,'"'+categories+'"','"'+description+'"'])+"\n")
        f.flush()
        sleep(5*random.random())
      i = i + 1
      print("%d"%(i))
browser.quit()
