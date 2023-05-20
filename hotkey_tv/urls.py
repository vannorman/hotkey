from django.conf.urls import *

import hotkey_tv.views

urlpatterns = [
    # Examples:
    # url(r'^$', 'hotkey_tv.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

	url(r'^$', hotkey_tv.views.home),
	url(r'^address/$', hotkey_tv.views.simple_page('address.html')), 
	url(r'^chat/?$', hotkey_tv.views.chat),
	url(r'^sendchat/?$', hotkey_tv.views.sendchat),

#	url(r'^blog/(.*)$', hotkey_tv.views.blog), 

]
