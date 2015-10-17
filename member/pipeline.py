from django.http import Http404
from social.pipeline.partial import partial

@partial
def new_user(strategy, details, is_new, user, *args, **kwargs):
    '''
    print(details['username'])
    print(kwargs)
    print('username ' + repr(kwargs.get('username')))
    print('password ' + repr(kwargs.get('password')))
    '''
    if details.get('password'):
        print('not new')
        print(details.get('password'))
        return
    elif is_new:
        print('is new')
        username = kwargs.get('username')
        password = kwargs.get('password')

        if username and password:
            print('in if')
            print(type(username))
            print(type(password))
            details['username'] = username
            details['password'] = password
            return
        else:
            return Http404
