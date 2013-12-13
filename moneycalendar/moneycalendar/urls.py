from django.conf.urls import patterns, include, url
from calend.api import DayResource, UserResource, CategoryResource, EntryResource, ExpenseResource

from django.views.generic import TemplateView

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
from calend.views import index
from tastypie.api import Api
admin.autodiscover()
# day_resource = DayResource()
# user_resource = UserResource()
v1_api = Api(api_name='v1')
v1_api.register(UserResource())
v1_api.register(DayResource())
v1_api.register(CategoryResource())
v1_api.register(EntryResource())
v1_api.register(ExpenseResource())

urlpatterns = patterns('',
    url(r'^$', index),
    url(r'^calendar/', index),
    url(r'^accounts/', include('registration.backends.default.urls')),
    url(r'^api/', include(v1_api.urls)),
    # url(r'^accounts/login/$', 'django.contrib.auth.views.login'),

    # Examples:
    # url(r'^$', 'moneycalendar.views.home', name='home'),
    # url(r'^moneycalendar/', include('moneycalendar.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
