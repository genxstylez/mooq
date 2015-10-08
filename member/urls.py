from django.conf.urls import url

urlpatterns = [
    url(r'^login/$', 'django.contrib.auth.views.login', {'template_name': 'login.html'}),
    url(r'^logout/$', 'django.contrib.auth.views.logout', {'next_page': 'index'}),
    url(r'^new_social/$', 'member.views.new_social', name='member-new-social'),
    url(r'^signup/$', 'member.views.signup', name='member-signup'),
]