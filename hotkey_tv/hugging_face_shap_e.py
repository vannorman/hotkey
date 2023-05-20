# bs load https://huggingface.co/spaces/hysts/Shap-E
# insert text into prompt
# push enter key
# monitor output until done
# download output

import requests
from bs4 import BeautifulSoup as bs
import urllib2


_URL = 'https://huggingface.co/spaces/hysts/Shap-E'



# functional
#def ask():
#    r = requests.get(_URL)
#    soup = bs(r.text)
#    urls = []
#    names = []
#    for i, link in enumerate(soup.findAll('a')):
#        _FULLURL = _URL + link.get('href')
#        if _FULLURL.endswith('.pdf'):
#            urls.append(_FULLURL)
#            names.append(soup.select('a')[i].attrs['href'])
#
#    names_urls = zip(names, urls)
#
#for name, url in names_urls:
#    print url
#    rq = urllib2.Request(url)
#    res = urllib2.urlopen(rq)
#    pdf = open("pdfs/" + name, 'wb')
#    pdf.write(res.read())
#    pdf.close()
