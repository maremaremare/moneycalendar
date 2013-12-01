# -*- coding: utf-8 -*-
from django.http import HttpResponse
from django.shortcuts import render
from calend.forms import hiddenForm
from calend.models import Day
import logging

# Create your views here.
def get_day_summ(request, *args, **kwargs):

    year = self.kwargs['year']
    month = self.kwargs['month']
    day = self.kwargs['day']
    obj = Day.objects.filter(date__year=year, 
                      date__month=month,
                      date__day=day)
    html = obj.summ
    return HttpResponse(html)


def index(request):
    form = hiddenForm()
    if request.method == 'POST':  # If the form has been submitted...
        form = hiddenForm(request.POST, request.user)  # A form bound to the POST data
        if form.is_valid():  # All validation rules pass

            text = form.cleaned_data['text']
            summ = form.cleaned_data['summ']
            date = form.cleaned_data['date']
            form.cleaned_data['created_by'] = request.user


            logging.log(1,(text,summ,date, request.user))
            day, created = Day.objects.get_or_create(**form.cleaned_data)
 
           
            if created:
                day.text = text
                day.summ = summ
                day.created_by = request.user
  
            else:
            	day.text = text
                day.summ = summ
                day.created_by = request.user

            answer = 'ok'

        else:
            answer = 'Ошибка валидации'
        return HttpResponse(answer)

    else:
        return render(request, 'cal.html', {'form': form})