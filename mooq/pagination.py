from rest_framework import pagination
from rest_framework.settings import api_settings

class DynamicFieldsLimitOffsetPagination(pagination.LimitOffsetPagination):
    """
    A dynamic fields implementation of a pagination serializer.
    """
    default_limit = api_settings.PAGE_SIZE
    limit_query_param = 'limit'
    offset_query_param = 'offset'
    max_limit = None
    template = 'rest_framework/pagination/numbers.html'

    def paginate_queryset(self, queryset, request, view=None):
        """
        Override init to add in the object serializer field on-the-fly.
        """
        print('request: ' + repr(request.GET))
        super().__init__(queryset, request, view=view)
        results_field = self.results_field
        object_serializer = self.opts.object_serializer_class

        if 'context' in kwargs:
            context_kwarg = {'context': kwargs['context']}
        else:
            context_kwarg = {}

        if fields:
            context_kwarg.update({'fields': fields})

        self.fields[results_field] = object_serializer(source='object_list',
                                                       many=True,
                                                       **context_kwarg)
