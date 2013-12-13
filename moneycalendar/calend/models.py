from django.db import models
from django.contrib.auth.models import User
from mptt.models import MPTTModel, TreeForeignKey

# Create your models here.

class Day(models.Model):
    date = models.DateField()
    text = models.CharField(max_length=600)
    summ = models.IntegerField()
    created_by = models.ForeignKey(User, unique = False)



class Category(MPTTModel):
    name = models.CharField(max_length=25, unique=False)
    parent = TreeForeignKey('self', null=True, blank=True, related_name='children')
    created_by = models.ForeignKey(User, unique = False)

    def __unicode__(self):

        return self.name; 

    class MPTTMeta:
        order_insertion_by = ['name']





class Expense(models.Model):
    name = models.CharField(max_length=25, unique=False)
    category = models.ForeignKey(Category, unique=False)
    created_by = models.ForeignKey(User, unique=False)
    def __unicode__(self):
    	return self.name;

class Entry(models.Model):
	date = models.DateField()
	#expense = models.CharField(max_length=25)
	expense = models.ForeignKey(Expense, unique = False, related_name='expense')
	summ = models.IntegerField()
	created_by = models.ForeignKey(User, unique = False, related_name='user')
    # created_by = models.ForeignKey(User, editable=False, null=True, blank=True)

