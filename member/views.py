from django.contrib.auth import get_user_model
from django.core.exceptions import ImproperlyConfigured
from django.http import HttpResponse

from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework import parsers, renderers
from rest_framework import viewsets, permissions
from rest_framework.generics import CreateAPIView

from rest_framework_jwt.settings import api_settings

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

try:
    from social.apps.django_app.utils import load_strategy, load_backend
    from social.exceptions import AuthAlreadyAssociated
except ImportError:
    raise ImproperlyConfigured('SocialAuthSerializer require python-social-auth')

from .serializers import SocialAuthSerializer

from member.serializers import PublicUserSerializer, PrivateUserSerializer

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

User = get_user_model()


def check_email(request):
    if User.objects.filter(email=request.GET['email']).count() > 0:
        return HttpResponse(status=409)
    return HttpResponse()

def check_username(request):
    if User.objects.filter(username=request.GET['username']).count() > 0:
        return HttpResponse(status=409)
    return HttpResponse()

class CreateUserView(CreateAPIView):
    model = User
    permission_classes = [permissions.AllowAny]
    serializer_class = PrivateUserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = PublicUserSerializer


class MeViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()

    def list(self, request, format=None):
        serializer = PrivateUserSerializer(request.user)
        return Response(serializer.data)

    def update(self, request, format=None):
        serializer = PrivateUserSerializer(request.user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class SocialAuth(APIView):
    """
    用access_token來驗證使用者(登入及連結)
    回傳JSON Web Token (JWT token)給客戶端
    """
    throttle_classes = ()
    permission_classes = ()
    parser_classes = (parsers.FormParser, parsers.JSONParser,)
    renderer_classes = (renderers.JSONRenderer,)
    serializer_class = SocialAuthSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            backend = serializer.data['backend']
            access_token = serializer.data['access_token']

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # 讀取python-social-auth strategy
        strategy = load_strategy(request=request)
        backend = load_backend(strategy, backend, 'next')

        try:
            kwargs = dict({(k, i) for k, i in serializer.data.items() if k != 'backend'})
            user = request.user # 如果註冊過的使用者已登入, 則連結此使用者
            print(user)
            kwargs['user'] = user.is_authenticated() and user or None


            # 使用者驗證
            user = backend.do_auth(**kwargs)

        except AuthAlreadyAssociated:
            data = {
                'error_code': 'social_already_associated',
                'status': 'Auth associated with another user.',
            }
            return Response(data, status=status.HTTP_403_FORBIDDEN)

        if not user:
            data = {
                'error_code': 'social_no_user',
                'status': 'No associated user.',
            }
            return Response(data, status=status.HTTP_403_FORBIDDEN)

        if not user.is_active:
            data = {
                'error_code': 'social_inactive',
                'status': 'Associated user is inactive.'
            }
            return Response(data, status=status.HTTP_403_FORBIDDEN)

        payload = jwt_payload_handler(user)
        return Response({'token': jwt_encode_handler(payload), 'username': user.username}) # 回傳JWT token及使用者帳號

social_auth = SocialAuth.as_view() # 方便由urls.py來import
create_user = CreateUserView.as_view()
