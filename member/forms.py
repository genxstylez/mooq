from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _
from django import forms


class UserCreationForm(forms.ModelForm):
    password = forms.CharField(label=_("Password"), widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ('username',)

    def clean_password(self):
        password = self.cleaned_data.get('password')
        if len(password) < 8:
            raise forms.ValidationError(_('Password too short'))
        return password

    def clean_username(self):
        username = self.cleaned_data.get('username')
        username = username.lower()
        return username


    def save(self, commit=True):
        user = super(UserCreationForm, self).save(commit=False)
        user.username = self.cleaned_data['username']
        user.set_password(self.cleaned_data["password"])
        if commit:
            user.save()
        return user