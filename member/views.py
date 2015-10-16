from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User

from rest_framework import viewsets, permissions,status
from rest_framework.response import Response

from member.serializers import UserSerializer
from member.forms import SignupForm

def new_social(request):
    backend = request.session['partial_pipeline']['backend']
    form = SignupForm(request.POST or None)
    if form.is_valid():
        request.session['username'] = form.cleaned_data['username']
        request.session['password'] = form.cleaned_data['password']
        return redirect('social:complete', backend=backend)
    return render(request, 'member/signup.html', {'form': form})


def signup(request):
    form = SignupForm(request.POST or None)
    if form.is_valid():
        user = form.save()
        user = authenticate(user.username, user.password)
        if user is not None and user.is_active:
            login(request, user)
            redirect('index')
    return render(request, 'member/signup.html')


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class MeViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()

    def list(self, request, format=None):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def update(self, request, format=None):
        serializer = UserSerializer(request.user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


