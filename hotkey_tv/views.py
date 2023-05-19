import json
import uuid
import urllib
import datetime
import re 
import requests # for setting cookies

from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.views.generic.base import RedirectView
from django.utils import timezone
from django.contrib import auth
#from django.forms.util import ErrorList
from django.template.context import RequestContext
from django.shortcuts import render
from django.shortcuts import render, redirect, render
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.decorators import login_required

import markdown
md = markdown.Markdown()

#import requests

from hotkey_tv.util import *
from hotkey_tv.chat import *
def simple_page(template):
    def handler(request):
        return renderWithNav(request, template)
    return handler

def blog_base(request):
    return blog(request,None)

   
def home(request):
    obj = {}
    obj['works'] = []
    obj['works'].append({
        "title" : "Mathbreakers",
        "video" : { "source": "https://player.vimeo.com/video/73754523", "img" : "mb_1.jpg" },
        "background" : "mb_1.png",
        "link" : "https://mathbreakers.com",
        "date" : "2013 Q3 - 2015 Q4",
        "position" : "Co-Founder",
        "subtitle" : "A math puzzle platformer for grades 2 - 8",
        "description" : "3D math adventure game for Mac, PC, and iOS with a linear storyline for arithmetic, number line, and fractions." ,
        "responsibilities" : 
        [
            "Game design & programming",
            "Strategic partnerships",
        ],
        "images" : [
            { "img" : "mb_1.jpg"},
            { "img" : "mb_2.jpg"},
            { "img" : "mb_3.jpg"},
            { "img" : "mb_4.jpg"}
        ],  
        })
    return renderWithNav(request,'home.html', obj)

def chat(request):
    obj = {}
    obj['chat'] = { 'response' : 'hello' }
    return  renderWithNav(request,'chat.html', obj)  

def load(request):
    if request.method == "POST": #and request.headers.get("contentType": "application/json"):
        success = False
        data = {"success":False}
        return JsonResponse({
            'success':success,
            })
