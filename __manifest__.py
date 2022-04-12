# -*- coding: utf-8 -*-
{
    'name': "Fix Localization",

    'summary': """
        Corrige algunos defecto de la localizacion""",

    'description': """
        Corrige algunos defecto de la localizacion
    """,

    'author': "dev.jhernandez@gmail.com(Jorge Hernandez)",
    'category': 'Pos',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': ['base','point_of_sale',],

    # always loaded
    'data': [
        # 'security/ir.model.access.csv',
        'views/views.xml',
        'views/templates.xml',
    ],
}
