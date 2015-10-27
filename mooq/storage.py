from django.conf import settings
from storages.backends.s3boto import S3BotoStorage
from django.contrib.staticfiles.storage import CachedFilesMixin

DefaultStorage = lambda: S3BotoStorage(
    bucket=settings.AWS_MEDIA_STORAGE_BUCKET_NAME,
    custom_domain=settings.AWS_S3_CUSTOM_DOMAIN
)

class StaticStorage(CachedFilesMixin, S3BotoStorage):
    pass
