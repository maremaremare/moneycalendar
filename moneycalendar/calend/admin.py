# coding: utf-8
from django.contrib import admin
from django.contrib.auth.models import User, Group
from treeadmin.admin import TreeAdmin
from calend.models import Entry, Category, Expense


class UserAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'date')
    list_filter = ('category','date')
    change_list_filter_template = "admin/filter_listing.html"

    class Media:
        js = ['/static/grappelli/tinymce/jscripts/tiny_mce/tiny_mce.js',
                          '/static/grappelli/tinymce_setup/tinymce_setup.js' ]

class BlogAdmin(admin.ModelAdmin):
    #exclude = ('category',)
    class Media:
        js = ['/static/grappelli/tinymce/jscripts/tiny_mce/tiny_mce.js',
                          '/static/grappelli/tinymce_setup/tinymce_setup.js' ]

class TreeModelAdmin(TreeAdmin):
    pass
    #prepopulated_fields = {"slug": ("kw","content")}   
    #exclude = ('slug',)
        # class Media:
 #        js = ['/static/grappelli/tinymce/jscripts/tiny_mce/tiny_mce.js',
 #              '/static/grappelli/tinymce_setup/tinymce_setup.js' ]
# class SinglePageAdmin(admin.ModelAdmin):
#     def formfield_for_foreignkey(self, db_field, request=None, **kwargs):
#         field = super(SinglePageAdmin, self).formfield_for_foreignkey(db_field, request, **kwargs)
#         if unicode(field.label) == u"slug_keyword" and request is not None:
#             field.initial = request.category,
#         return field
#     prepopulated_fields = {"slug": ("category",)}


           
admin.site.register(Entry)
admin.site.register(Expense)
   
admin.site.register(Category, TreeModelAdmin)

