from django.shortcuts import render, redirect
from member.forms import SignupForm


def new_social(request):
    backend = request.session['partial_pipeline']['backend']
    form = SignupForm(request.POST or None)
    if form.is_valid():
        request.session['username'] = form.cleaned_data['username']
        request.session['password'] = form.cleaned_data['password']
        return redirect('social:complete', backend=backend)
    return render(request, 'member/new_user.html', {'form': form})


def signup(request):
    return render(request, 'member/new_user.html')


