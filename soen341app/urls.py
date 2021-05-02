"""soen341app URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView, RedirectView
from django.conf.urls.static import static
from django.conf import settings

app_name = "soen341app"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('main/', include('main.urls')),
    path('register/', TemplateView.as_view(template_name='index.html')),
    path('login/', TemplateView.as_view(template_name='index.html')),
    path('report/', TemplateView.as_view(template_name='index.html')),
    path('feed/', TemplateView.as_view(template_name='index.html')),
    path('follow/', TemplateView.as_view(template_name='index.html')),
    path('post/', TemplateView.as_view(template_name='index.html')),
    path('', RedirectView.as_view(url='feed/'), name="home-redirect-feed"),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
