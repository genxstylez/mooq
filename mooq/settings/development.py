from . import *

DEBUG = True

DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'
THUMBNAIL_DEFAULT_STORAGE = 'django.core.files.storage.FileSystemStorage'


INSTALLED_APPS += (
    'debug_toolbar',
    'django_extensions',
)

# django-debug-toolbar
DEBUG_TOOLBAR_PATCH_SETTINGS = False

if not DEBUG_TOOLBAR_PATCH_SETTINGS:
    MIDDLEWARE_CLASSES += (
        'debug_toolbar.middleware.DebugToolbarMiddleware',
    )