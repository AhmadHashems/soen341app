from django.shortcuts import render
from django.http import HttpResponse


# Create your views here.

def home(request):
    return HttpResponse("<h1>Our first custom page in Django!</h1>Daniel now has a working environment!</br>Oliver now "
                        "has a working environment!</br>Ahmad now has a working environment!</br>Anusha now has a working environment!")
