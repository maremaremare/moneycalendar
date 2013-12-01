from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Day(models.Model):
    date = models.DateField()
    text = models.CharField(max_length=600)
    summ = models.IntegerField()
    created_by = models.ForeignKey(User, unique = False)
    # created_by = models.ForeignKey(User, editable=False, null=True, blank=True)

