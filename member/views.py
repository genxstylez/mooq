from django.shortcuts import render, redirect
from member.forms import SignupForm
from django.contrib.auth import authenticate, login


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


