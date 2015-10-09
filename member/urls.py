from django.conf.urls import url

urlpatterns = [
    url(r'^login/$', 'django.contrib.auth.views.login',
        {'template_name': 'member/login.html'}, name='member-login'),
    url(r'^logout/$', 'django.contrib.auth.views.logout',
        {'next_page': 'index'}, name='member-logout'),
    url(r'^new_social/$', 'member.views.new_social', name='member-new-social'),
    url(r'^signup/$', 'member.views.signup', name='member-signup'),
]