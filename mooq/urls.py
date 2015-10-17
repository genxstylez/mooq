"""mooq URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic import TemplateView
from django.views.decorators.cache import cache_page

from django_js_reverse.views import urls_js

from rest_framework.routers import DefaultRouter
from chat import views as ChatView
from member import views as MemberView

router = DefaultRouter()
router.register(r'channels', ChatView.ChannelViewSet, base_name='channels')
router.register(r'users', MemberView.UserViewSet, base_name='users')
router.register(r'me', MemberView.MeViewSet, base_name='me')

urlpatterns = [
    #url('', include('social.apps.django_app.urls', namespace='social')),
    url(r'^api/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api-social-auth/$', 'member.views.social_auth'), # 網頁端送backend及access_token, 回傳jwt_token
    url(r'^api-token-auth/$', 'rest_framework_jwt.views.obtain_jwt_token', name="api-token-auth"),
    url(r'accounts/', include('member.urls')),
    url(r'^login/$', 'django.contrib.auth.views.login',
        {'template_name': 'member/login.html'}, name='login'),
    url(r'^logout/$', 'django.contrib.auth.views.logout',
        {'next_page': 'index'}, name='logout'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^jsreverse/$', cache_page(3600)(urls_js), name='js_reverse'),
    url(r'^', TemplateView.as_view(template_name='index.html'), name='index'),
]
