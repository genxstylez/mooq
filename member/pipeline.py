from requests import request, HTTPError

from django.core.files.base import ContentFile
from member.models import Profile


def save_profile_picture(backend, user, social, response, details,
                         is_new=False, *args,**kwargs):
    if is_new and backend.name == 'facebook' and user:
        url = 'http://graph.facebook.com/{0}/picture'.format(response['id'])

        try:
            response = request('GET', url, params={'type': 'large'})
            response.raise_for_status()
        except HTTPError:
            pass
        else:
            profile = Profile.objects.create(user=user, is_verified=True)
            profile.avatar.save('{0}_social.jpg'.format(user.username),
                                   ContentFile(response.content))
            profile.save()