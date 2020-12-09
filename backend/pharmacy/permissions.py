from rest_framework import permissions
from rest_framework.permissions import BasePermission, IsAuthenticated, SAFE_METHODS


class IsStaff(permissions.BasePermission):

    def has_permission(self, request, view):
        return request.user.is_staff

    def has_object_permission(self, request, view, obj):
        return request.user.is_staff


class IsStaffOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_staff

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_staff


class IsLoggedInUserOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        owner = obj
        if hasattr(obj, 'user'):
            owner = obj.user
        elif hasattr(obj, 'customer'):
            owner = obj.customer.user
        elif hasattr(obj, 'medicineOrder'):
            owner = obj.medicineOrder.customer.user
        return owner == request.user or request.user.is_staff
