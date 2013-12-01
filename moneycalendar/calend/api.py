from django.contrib.auth.models import User
from tastypie.resources import ModelResource
from calend.models import Day
import urlparse
from django.conf.urls import  url
from tastypie.serializers import Serializer
from tastypie.authentication import SessionAuthentication

from tastypie import fields
from tastypie.authorization import Authorization
from tastypie.exceptions import Unauthorized
from functools import partial
from tastypie.constants import ALL, ALL_WITH_RELATIONS



class urlencodeSerializer(Serializer):
    formats = ['json', 'jsonp', 'xml', 'yaml', 'html', 'plist', 'urlencode']
    content_types = {
        'json': 'application/json',
        'jsonp': 'text/javascript',
        'xml': 'application/xml',
        'yaml': 'text/yaml',
        'html': 'text/html',
        'plist': 'application/x-plist',
        'urlencode': 'application/x-www-form-urlencoded',
        }
    def from_urlencode(self, data,options=None):
        """ handles basic formencoded url posts """
        qs = dict((k, v if len(v)>1 else v[0] )
            for k, v in urlparse.parse_qs(data).iteritems())
        return qs

    def to_urlencode(self,content): 
        pass

class UserResource(ModelResource):
    # comments = fields.ToManyField('myapp.api.resources.CommentResource', 'comments')

    class Meta:
        queryset = User.objects.all()

        resource_name = 'user'
        serializer = urlencodeSerializer() # IMPORTANT
        authentication = SessionAuthentication()
        allowed_methods = ['get']
        authorization = Authorization()



class DayResource(ModelResource):

    created_by = fields.ForeignKey(UserResource, 'created_by', full=False, unique=False)

    # created_by = fields.ToOneField('resources.UserResource', attribute = 'user', related_name='user', full=True)
  # another = fields.ToOneField(AnotherResource, 'another', full=True) 
    class Meta:
        queryset = Day.objects.all()

        resource_name = 'day'
        excludes = [ 'resource_uri']
        serializer = urlencodeSerializer() # IMPORTANT
        authentication = SessionAuthentication()
        allowed_methods = ['get', 'post', 'put']
        authorization = Authorization()
        filtering = {
            "date": ALL,
        }


   
        
    def get_object_list(self, request): 
        return super(DayResource, self).get_object_list(request).filter(created_by__id=request.user.id)
    def get__month_object_list(self, request): 
        return super(DayResource, self).get_object_list(request).filter(created_by__id=request.user.id).filter(month='2013-10')

    def prepend_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/(?P<date>[0-9-]*)/$" % self._meta.resource_name, self.wrap_view('dispatch_detail'), name="api_dispatch_detail"),
            url(r"^(?P<resource_name>%s)/month/(?P<month>[0-9-]*)/$" % self._meta.resource_name, self.wrap_view('dispatch_list'), name="api_dispatch_detail"),
        ]          
    # def dehydrate(self, bundle):
    #     # If they're requesting their own record, add in their email address.

    #     # bundle.data['month'] = str(bundle.data['date'].year)+'-'+str(bundle.data['date'].month)
    #     #buddle.date['created_by'] = bundle.data['created_by'].username
    #     return bundle

