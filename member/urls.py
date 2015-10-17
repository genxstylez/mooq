from django.conf.urls import url

urlpatterns = [

    url(r'^new_social/$', 'member.views.new_social', name='member-new-social'),
    url(r'^signup/$', 'member.views.signup', name='member-signup'),
]