from django import template
from TimeSeriesBase.models import Indicator


register = template.Library()

@register.inclusion_tag('indicators.html')
def render_indicator_tree(Indicator):
    return {'indicators': Indicator}