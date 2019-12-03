from editlive.adaptors.base import BaseAdaptor


class ManyToManyAdaptor(BaseAdaptor):
    """The ManyToManyAdaptor is used for ManyToMany fields".
    """

    def __init__(self, *args, **kwargs):
        super(ManyToManyAdaptor, self).__init__(*args, **kwargs)
        if self.form_field:
            self.attributes.update({
                'data-type':   'manytomanyField',
                'data-source': '#%s' % self.attributes.get('data-field-id'),
            })

    def get_value(self):
        """Returns `self.field_value` unless it is callable. If it is
        callable, it calls it before returning the output.
        """
        if callable(self.field_value):
            return self.field_value.all()
        return self.field_value

    def set_value(self, value):
        if value is None:
            self.field_value = []
            getattr(self.obj, self.field_name).clear()
        else:
            self.field_value = value
            setattr(self.obj, self.field_name, value)
        return value
