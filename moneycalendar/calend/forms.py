from django import forms



class hiddenForm(forms.Form):
    date = forms.DateField(widget=forms.HiddenInput())
    text = forms.CharField(widget=forms.HiddenInput())
    summ = forms.IntegerField(widget=forms.HiddenInput())
   