from social.pipeline.partial import partial

@partial
def new_user(strategy, details, is_new, user, *args, **kwargs):
    if details.get('password'):
        return
    elif is_new:
        username = strategy.session_get('username')
        password = strategy.session_get('password')

        if username and password:
            details['username'] = username
            details['password'] = password
        else:
            return strategy.redirect('member-new-social')
