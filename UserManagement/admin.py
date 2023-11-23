from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser
# Register your models here.

# admin.site.register(CustomUser, UserAdmin)

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_user', 'is_admin')  # Add the new fields here

admin.site.register(CustomUser, UserAdmin)



# from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin
# from .models import CustomUser
# # Register your models here.

# admin.site.register(CustomUser, UserAdmin)
