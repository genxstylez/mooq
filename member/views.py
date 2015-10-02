from django.shortcuts import render, redirect
from member.forms import UserCreationForm


def new_social(request):
    backend = request.session['partial_pipeline']['backend']
    form = UserCreationForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            request.session['username'] = form.cleaned_data['username']
            request.session['password'] = form.cleaned_data['password']
            return redirect('social:complete', backend=backend)
    return render(request, 'member/new_user.html', {'form': form})


def signup(request):
    pass


