from django.urls import path
from MobileApp.views import *

urlpatterns = [
    path('',index,name="Mobile_index"),
    path('component-accordion/',component_accordion,name="component_accordion"),
    path('component-actions/',component_actions,name="component_actions"),
    path('component-buttons/',component_buttons,name="component_buttons"),
    path('component-alerts/', component_alerts, name = 'component_alerts'),
    path('component-cards/',component_cards,name="component_cards"),
    path('component-charts/',component_charts,name="component_charts"),
    path('component-collapse/',component_collapse,name="component_collapse"),
    path('component-colors/',component_colors,name="component_colors"),
    path('component-footer-bar/',component_footer_bar,name="component_footer_bar"),
    path('component-header-bar/',component_header_bar,name="component_header_bar"),
    path('component-inputs/',component_inputs,name="component_inputs"),
    path('component-list-groups/',component_list_groups,name="component_list_groups"),
    path('component-menus/',component_menus,name="component_menus"),
    path('component-tables/',component_tables,name="component_tables"),
    path('component-typography/',component_typography,name="component_typography"),
    path('components/',components,name="components"),
    path('index-crypto-waves/',index_crypto_waves,name="index_crypto_waves"),
    path('index-waves/',index_waves,name="index_waves"),
    path('menu-add-card/',menu_add_card,name="menu_add_card"),
    path('menu_exchange/',menu_exchange,name="menu_exchange"),
    path('menu-card-settings/',menu_card_settings,name="menu_card_settings"),
    path('menu-friends-transfer/',menu_friends_transfer,name="menu_friends_transfer"),
    path('menu-highlights/',menu_highlights,name="menu_highlights"),
    path('menu-notifications/',menu_notifications,name="menu_notifications"),
    path('menu-sidebar/', menu_sidebar, name="menu_sidebar"),
    path('menu_transfer/',menu_transfer,name="menu_transfer"),
    path('page_activity/',page_activity,name="page_activity"),
    path('page_cards_add/',page_cards_add,name="page_cards_add"),
    path('page_cards_single/',page_cards_single,name="page_cards_single"),
    path('page_crypto_report/',page_crypto_report,name="page_crypto_report"),
    path('page_forgot_1/',page_forgot_1,name="page_forgot_1"),
    path('page_goals/',page_goals,name="page_goals"),
    path('page_payment_bill/',page_payment_bill,name="page_payment_bill"),
    path('page_payment_exchange/',page_payment_exchange,name="page_payment_exchange"),
    path('page_payment_request/',page_payment_request,name="page_payment_request"),
    path('page_payment_search/',page_payment_search,name="page_payment_search"),
    path('page_payment_transfer/',page_payment_transfer,name="page_payment_transfer"),
    path('page_payments/',page_payments,name="page_payments"),
    path('page_profile/',page_profile,name="page_profile"),
    path('page_reports/',page_reports,name="page_reports"),
    path('page_signin_1/',page_signin_1,name="page_signin_1"),
    path('page_wallet/',page_wallet,name="page_wallet"),
    path('pages_stacked/',pages_stacked,name="pages_stacked"),
    path('pages/',pages,name="pages"),
    path('walkthrough_slide/',walkthrough_slide,name="walkthrough_slide"),

]