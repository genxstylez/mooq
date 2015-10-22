from rest_framework.fields import empty


class DynamicFields(object):
    """A mixins that allows the query builder to display certain fields"""

    def get_fields_to_display(self):
        fields = self.request.GET.get('fields', None)
        return fields.split(',') if fields else None

    def get_serializer(self, instance=None, data=empty, many=False, partial=False):
        """
        Return the serializer instance that should be used for validating and
        deserializing input, and for serializing output.
        """
        serializer_class = self.get_serializer_class()
        context = self.get_serializer_context()
        fields = self.get_fields_to_display()
        return serializer_class(instance, data=data,
                                many=many, partial=partial,
                                context=context, fields=fields)

    def get_pagination_serializer(self, page):
        """
        Return a serializer instance to use with paginated data.
        """
        class SerializerClass(self.pagination_serializer_class):
            class Meta:
                object_serializer_class = self.get_serializer_class()

        pagination_serializer_class = SerializerClass
        context = self.get_serializer_context()
        fields = self.get_fields_to_display()
        return pagination_serializer_class(instance=page, context=context, fields=fields)