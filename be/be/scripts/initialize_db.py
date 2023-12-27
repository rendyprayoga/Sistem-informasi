import argparse
import sys

from pyramid.paster import bootstrap, setup_logging
from sqlalchemy.exc import OperationalError

from .. import models


def setup_models(dbsession):
    """
    Add or update models / fixtures in the database.

    """
    model = models.mymodel.MyModel(name='one', value=1)
    dbsession.add(model)
    # Add Position
    position_data = {
        'name': 'Manager',
        'salary_in_months': 5000.0,
    }
    position = models.mymodel.Position(**position_data)
    dbsession.add(position)

    # add total work
    work_data = {
        'total_days': 28,
    }
    work = models.mymodel.Work(**work_data)
    dbsession.add(work)

    # Add User
    user_data_list = [
        {
            'username': 'admin',
            'name': 'admin',
            'avatar': 'default.png',
            'jatah_cuti': 10000000,
            'nik': 1234567890,
            'nohp': '123-456-7890',
            'jk_pegawai': 'Laki laki',
            'tgl_lahir': '1990-01-01',
            'status': 'Lajang',
            'password': 'admin',
            'role': 'admin',
            'jabatan_id': 1,
            'total_work_id': 1,
        },
        {
            'username': 'user',
            'name': 'user',
            'avatar': 'default.png',
            'jatah_cuti': 10000000,
            'nik': 12312421,
            'nohp': '123-456-7890',
            'jk_pegawai': 'Laki laki',
            'tgl_lahir': '1990-01-01',
            'status': 'Lajang',
            'password': 'user',
            'role': 'user',
            'jabatan_id': 1,
            'total_work_id': 1,
        }
    ]

    for user_data in user_data_list:
        user = models.mymodel.User(**user_data)
        dbsession.add(user)


def parse_args(argv):
    parser = argparse.ArgumentParser()
    parser.add_argument(
        'config_uri',
        help='Configuration file, e.g., development.ini',
    )
    return parser.parse_args(argv[1:])


def main(argv=sys.argv):
    args = parse_args(argv)
    setup_logging(args.config_uri)
    env = bootstrap(args.config_uri)

    try:
        with env['request'].tm:
            dbsession = env['request'].dbsession
            setup_models(dbsession)
    except OperationalError:
        print('''
Pyramid is having a problem using your SQL database.  The problem
might be caused by one of the following things:

1.  You may need to initialize your database tables with `alembic`.
    Check your README.txt for description and try to run it.

2.  Your database server may not be running.  Check that the
    database server referred to by the "sqlalchemy.url" setting in
    your "development.ini" file is running.
            ''')
