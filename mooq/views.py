from django.shortcuts import render

from django.conf import settings


def index(request):
    return render(request, 'index.html', {'DEBUG': settings.DEBUG, 'FACEBOOK_ID': settings.SOCIAL_AUTH_FACEBOOK_KEY})