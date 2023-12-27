from pyramid.view import view_config
from pyramid.response import Response, FileResponse
from pyramid.request import Request
import os
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from sqlalchemy.orm import exc, joinedload
from sqlalchemy import func, distinct
import jwt
from datetime import datetime, date, timedelta

from .. import models


"""\
welcome
"""


@view_config(route_name='welcome', renderer='be:templates/mytemplate.jinja2')
def my_view(request):
    try:
        query = request.dbsession.query(models.MyModel)
        one = query.filter(models.MyModel.name == 'one').one()

    except SQLAlchemyError:
        return Response(db_err_msg, content_type='text/plain', status=500)
    return {'one': one, 'project': 'SIMAPEG '}


"""\
index
"""


@view_config(route_name='index', renderer='json',  request_method="GET")
def index(request):
    return {
        'message': 'Server SIMAPEG Running!',
        'versi': '0.0.1'
    }


"""\
JWT
"""


def auth_jwt_verify(request):
    authentication_header = request.cookies.get('token')
    if not authentication_header:
        authentication_header = request.headers.get('Authorization')
        if authentication_header and authentication_header.startswith('Bearer '):
            authentication_header = authentication_header.split(' ')[1]

    if authentication_header:
        try:
            decoded_user = jwt.decode(
                authentication_header, 'secret', algorithms=['HS256'])
            user_id = decoded_user.get('sub')

            if user_id:
                token = request.dbsession.query(models.Token).filter_by(
                    user_id=user_id, jwt_token=authentication_header).first()
                if token:
                    return decoded_user
        except jwt.ExpiredSignatureError:
            request.response.status = 401
    return None


def create_tokens(user_id):
    payload = {
        'sub': user_id,
        'exp': datetime.utcnow() + timedelta(minutes=30)
    }
    jwt_token = jwt.encode(payload, 'secret', algorithm='HS256')

    return jwt_token


"""\
auth
"""


@view_config(route_name='login', renderer='json',  request_method="POST")
def login(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        return {
            'message': 'error',
            'description': 'Already logged in'
        }

    username = request.POST['username']
    password = request.POST['password']

    try:
        user = request.dbsession.query(models.User).filter_by(
            username=username, password=password).first()
    except SQLAlchemyError:
        return Response(db_err_msg, content_type='text/plain', status=500)

    if user:
        jwt_token = create_tokens(user.id)

        try:
            new_token = models.Token(user_id=user.id, jwt_token=jwt_token)
            request.dbsession.add(new_token)
            request.dbsession.flush()

            request.response.set_cookie(
                'token', jwt_token, max_age=1800, httponly=True)

            return {
                'message': 'ok',
                'token': jwt_token,
                'description': 'login success!'
            }
        except SQLAlchemyError:
            return Response(db_err_msg, content_type='text/plain', status=500)
    else:
        request.response.status = 401
        return {
            'message': 'error',
            'description': 'Username atau Password salah!'
        }


@view_config(route_name='logout', renderer='json', request_method="DELETE")
def logout(request):
    auth_user = auth_jwt_verify(request)
    authentication_header = request.cookies.get('token')
    if not authentication_header:
        authentication_header = request.headers.get('Authorization')
    if auth_user:
        try:
            token = request.dbsession.query(models.Token).filter_by(
                jwt_token=authentication_header).first()
            request.dbsession.delete(token)
        except SQLAlchemyError:
            return Response(db_err_msg, content_type='text/plain', status=500)

        request.response.headers['Clear-Token'] = 'true'
        request.response.delete_cookie('token')
        return {
            'message': 'ok',
            'description': 'Successfully logged out'
        }
    request.response.status = 400
    return {
        'message': 'error',
        'description': 'Token not found'
    }


"""\
user me
"""


@view_config(route_name='auth-info', renderer='json', request_method='GET')
def get_auth_info(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        try:
            user = request.dbsession.query(models.User).filter_by(
                id=auth_user['sub']).first()
            position_name = request.dbsession.query(models.Position).filter_by(
                id=user.jabatan_id).first().name
        except SQLAlchemyError:
            return Response(db_err_msg, content_type='text/plain', status=500)

        avatar_path = user.avatar
        avatar_link = request.route_url(
            'get-avatar', username=user.username, path=avatar_path)
        avatar_link = avatar_link.replace("%5C", "/")
        return {
            'username': user.username,
            'name': user.name,
            'role': user.role,
            'avatar': avatar_link,
            'jatah_cuti': user.jatah_cuti,
            'nik': user.nik,
            'nohp': user.nohp,
            'jk_pegawai': user.jk_pegawai,
            'tgl_lahir': user.tgl_lahir.strftime('%Y-%m-%d'),
            'status': user.status,
            'jabatan':  position_name,
            'password':  user.password,
            'total_work_id': user.total_work_id,
            'isLogin': True
        }
    else:
        request.response.status = 401
        return {
            'message': 'error',
            'description': 'User is not authenticated',
            'isLogin': False
        }


@view_config(route_name='edit-profile', renderer='json', request_method='PATCH')
def edit_profile(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        try:
            user = request.dbsession.query(models.User).filter_by(
                id=auth_user['sub']).first()
            current_avatar_path = os.path.join('assets', user.avatar)
            if os.path.exists(current_avatar_path) and user.avatar != 'default.png':
                os.remove(current_avatar_path)

            # Explicitly set each attribute
            if 'avatar' in request.POST:
                print(user, 'avatar', request.POST['avatar'])
                avatar = request.POST['avatar']
                if avatar is not None and getattr(avatar, 'filename', None):
                    _, picture_extension = os.path.splitext(avatar.filename)

                    timestamp = str(int(datetime.datetime.now().timestamp()))
                    new_avatar_filename = f'{user.name}_{timestamp}{picture_extension}'
                    picture_path = os.path.join('assets', new_avatar_filename)

                    try:
                        with open(picture_path, 'wb') as picture_file:
                            chunk_size = 4096
                            while chunk := avatar.file.read(chunk_size):
                                picture_file.write(chunk)

                        user.avatar = new_avatar_filename
                    except Exception as e:
                        print("Exception:", e)

            if 'total_work_id' in request.POST:
                total_work_id = request.POST['total_work_id']
                try:
                    total_work_id = int(total_work_id)
                    user.total_work_id = total_work_id
                except ValueError as ve:
                    print(f"Error converting total_work_id to integer: {ve}")

            if 'name' in request.POST:
                user.name = request.POST['name']

            if 'nohp' in request.POST:
                user.nohp = request.POST['nohp']

            if 'nik' in request.POST:
                user.nik = request.POST['nik']

            if 'jk_pegawai' in request.POST:
                user.jk_pegawai = request.POST['jk_pegawai']

            if 'tgl_lahir' in request.POST:
                user.tgl_lahir = request.POST['tgl_lahir']

            if 'password' in request.POST:
                user.password = request.POST['password']

            if 'jabatan' in request.POST:
                request.POST['jabatan']

            if 'jatah_cuti' in request.POST:
                user.jatah_cuti = request.POST['jatah_cuti']

            if 'status' in request.POST:
                user.status = request.POST['status']

            request.dbsession.flush()
        except SQLAlchemyError:
            return Response('Error occurred', content_type='text/plain', status=500)

        return {
            'message': 'Sukses Edit Profil',
        }
    else:
        request.response.status = 401
        return {
            'message': 'error',
            'description': 'User is not authenticated',
            'isLogin': False
        }


@view_config(route_name='get-avatar', renderer='json', request_method='GET')
def get_avatar(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        try:
            user = request.dbsession.query(models.User).filter_by(
                id=auth_user['sub']).first()
            avatar_path = os.path.join('assets', user.avatar)

            if os.path.exists(avatar_path):
                return FileResponse(avatar_path, request=request)
            else:
                default_avatar_path = os.path.join(
                    'assets', 'default.png')
                return FileResponse(default_avatar_path, request=request)
        except SQLAlchemyError:
            return Response(db_err_msg, content_type='text/plain', status=500)
    else:
        request.response.status = 401
        return {
            'message': 'error',
            'description': 'User is not authenticated',
            'isLogin': False
        }


"""\
jabatan
"""


@view_config(route_name='get-jabatan', renderer='json', request_method='GET')
def get_jabatan(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        try:
            positions = request.dbsession.query(models.Position).all()
            jabatan_list = [{'id': position.id, 'name': position.name,
                            'salary_in_months': position.salary_in_months} for position in positions]
            return {'jabatan_list': jabatan_list}
        except SQLAlchemyError:
            return Response('Database error', content_type='text/plain', status=500)
    else:
        request.response.status = 401
        return {
            'message': 'error',
            'description': 'User is not authenticated',
            'isLogin': False
        }


@view_config(route_name='add-jabatan', renderer='json', request_method='POST')
def add_jabatan(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        try:
            name = request.POST.get('name')
            salary_in_months = request.POST.get('salary_in_months')
            new_jabatan = models.Position(
                name=name, salary_in_months=salary_in_months)
            request.dbsession.add(new_jabatan)
            request.dbsession.flush()
            return {'message': 'Tambah Jabatan Sukses!'}
        except SQLAlchemyError:
            return Response('Database error', content_type='text/plain', status=500)
    else:
        request.response.status = 401
        return {
            'message': 'error',
            'description': 'User is not authenticated',
            'isLogin': False
        }


@view_config(route_name='edit-jabatan', renderer='json', request_method='PATCH')
def edit_jabatan(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        jabatan_id = request.matchdict.get('id')
        try:
            jabatan = request.dbsession.query(
                models.Position).filter_by(id=jabatan_id).one()
            jabatan.name = request.POST.get('name', jabatan.name)
            jabatan.salary_in_months = request.POST.get(
                'salary_in_months', jabatan.salary_in_months)
            request.dbsession.flush()
            return {'message': 'Edit Jabatan Sukses!'}
        except exc.NoResultFound:
            return Response('Jabatan Tidak Ditemukan!', content_type='text/plain', status=404)
        except SQLAlchemyError:
            return Response('Database error', content_type='text/plain', status=500)
    else:
        request.response.status = 401
        return {
            'message': 'error',
            'description': 'User is not authenticated',
            'isLogin': False
        }


@view_config(route_name='delete-jabatan', renderer='json', request_method='DELETE')
def delete_jabatan(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        jabatan_id = request.matchdict.get('id')
        try:
            jabatan = request.dbsession.query(
                models.Position).filter_by(id=jabatan_id).one()
            request.dbsession.delete(jabatan)
            request.dbsession.flush()
            return {'message': 'Hapus Jabatan Sukses!'}
        except exc.NoResultFound:
            return Response('Jabatan not found', content_type='text/plain', status=404)
        except SQLAlchemyError as e:
            return Response('gagal, posisi sedang digunakan user!', content_type='text/plain', status=400)
    else:
        request.response.status = 401
        return {
            'message': 'error',
            'description': 'User is not authenticated',
            'isLogin': False
        }


"""\
Users
"""


@view_config(route_name='get-users', renderer='json', request_method='GET')
def get_users(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        try:
            users = (
                request.dbsession.query(models.User)
                .options(joinedload(models.User.jabatan))
                .all()
            )

            user_list = []

            for user in users:
                user_data = {
                    'id': user.id,
                    'username': user.username,
                    'name': user.name,
                    'avatar': user.avatar,
                    'jatah_cuti': user.jatah_cuti,
                    'nik': user.nik,
                    'nohp': user.nohp,
                    'jk_pegawai': user.jk_pegawai,
                    'tgl_lahir': user.tgl_lahir.strftime('%Y-%m-%d'),
                    'status': user.status,
                    'role': user.role,
                    'jabatan_id': user.jabatan_id,
                    'total_work_id': user.total_work_id,
                    'jabatan_name': user.jabatan.name if user.jabatan else None
                }
                user_list.append(user_data)

            return {'user_list': user_list}
        except SQLAlchemyError:
            return Response('Database error', content_type='text/plain', status=500)
    else:
        request.response.status = 401
        return {
            'message': 'error',
            'description': 'User is not authenticated',
            'isLogin': False
        }


# @view_config(route_name='get-user', renderer='json', request_method='GET')
# def get_user(request):
#     user_id = request.matchdict.get('id')
#     try:
#         user = request.dbsession.query(models.User).filter_by(id=user_id).one()
#         user_data = {
#             'id': user.id,
#             'username': user.username,
#             'name': user.name,
#             'avatar': user.avatar,
#             'jatah_cuti': user.jatah_cuti,
#             'nik': user.nik,
#             'nohp': user.nohp,
#             'jk_pegawai': user.jk_pegawai,
#             'tgl_lahir': user.tgl_lahir.strftime('%Y-%m-%d'),
#             'status': user.status,
#             'role': user.role,
#             'jabatan_id': user.jabatan_id
#         }
#         return {'user_data': user_data}
#     except SQLAlchemyError:
#         return Response('User not found', content_type='text/plain', status=404)


@view_config(route_name='add-user', renderer='json', request_method='POST')
def add_user(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        try:
            data = {
                'username': request.POST.get('username'),
                'name': request.POST.get('name'),
                'avatar': request.POST.get('avatar'),
                'jatah_cuti': request.POST.get('jatah_cuti'),
                'nik': request.POST.get('nik'),
                'nohp': request.POST.get('nohp'),
                'jk_pegawai': request.POST.get('jk_pegawai'),
                'tgl_lahir': request.POST.get('tgl_lahir'),
                'status': request.POST.get('status'),
                'role': request.POST.get('role'),
                'jabatan_id': request.POST.get('jabatan_id'),
                'password': request.POST.get('password'),
                'total_work_id': request.POST.get('total_work_id')
            }

            new_user = models.User(**data)

            request.dbsession.add(new_user)
            request.dbsession.flush()

            return {'message': 'User added successfully'}
        except IntegrityError:
            return Response('Username Sudah Terdaftar!', content_type='text/plain', status=400)
        except SQLAlchemyError:
            return Response('Database error', content_type='text/plain', status=500)
    else:
        request.response.status = 401
        return {
            'message': 'error',
            'description': 'User is not authenticated',
            'isLogin': False
        }


@view_config(route_name='edit-user', renderer='json', request_method='PATCH')
def edit_user(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        user_id = request.matchdict.get('id')
        try:
            user = request.dbsession.query(
                models.User).filter_by(id=user_id).one()

            user.username = request.POST.get('username', user.username)
            user.name = request.POST.get('name', user.name)
            user.avatar = request.POST.get('avatar', user.avatar)
            user.jatah_cuti = request.POST.get('jatah_cuti', user.jatah_cuti)
            user.nik = request.POST.get('nik', user.nik)
            user.nohp = request.POST.get('nohp', user.nohp)
            user.jk_pegawai = request.POST.get('jk_pegawai', user.jk_pegawai)
            user.tgl_lahir = request.POST.get('tgl_lahir', user.tgl_lahir)
            user.status = request.POST.get('status', user.status)
            user.role = request.POST.get('role', user.role)
            user.jabatan_id = request.POST.get('jabatan_id', user.jabatan_id)
            user.total_work_id = request.POST.get(
                'total_work_id', user.total_work_id)

            request.dbsession.flush()

            return {'message': 'User updated successfully'}
        except SQLAlchemyError:
            return Response('User not found', content_type='text/plain', status=404)
    else:
        request.response.status = 401
        return {
            'message': 'error',
            'description': 'User is not authenticated',
            'isLogin': False
        }


@view_config(route_name='delete-user', renderer='json', request_method='DELETE')
def delete_user(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        user_id = request.matchdict.get('id')
        try:
            user = request.dbsession.query(
                models.User).filter_by(id=user_id).one()
            request.dbsession.delete(user)
            request.dbsession.flush()
            return {'message': 'Hapus Pengguna Sukses!'}
        except exc.NoResultFound:
            return Response('Pengguna Tidak Ditemukan!', content_type='text/plain', status=404)
    else:
        request.response.status = 401
        return {
            'message': 'error',
            'description': 'User is not authenticated',
            'isLogin': False
        }


"""\
Presence & Leave
"""


@view_config(route_name='get-presence', renderer='json', request_method='GET')
def get_presence(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        try:
            presences = request.dbsession.query(models.Presence).options(
                joinedload(models.Presence.user)).all()
            presence_list = []

            for presence in presences:
                presence_out = (
                    presence.presence_out.strftime('%Y-%m-%d %H:%M:%S')
                    if presence.presence_out and presence.presence_out != '0000-00-00 00:00:00'
                    else '-'
                )
                presence_data = {
                    'id': presence.id,
                    'user_id': presence.user_id,
                    'name': presence.user.name if presence.user else None,
                    'presence_in': presence.presence_in.strftime('%Y-%m-%d %H:%M:%S'),
                    'presence_out': presence_out,
                    'status': presence.status
                }
                presence_list.append(presence_data)

            return {'presence_list': presence_list}
        except SQLAlchemyError:
            return Response('Database error', content_type='text/plain', status=500)
    else:
        request.response.status = 401
        return {
            'message': 'error',
            'description': 'User is not authenticated',
            'isLogin': False
        }


@view_config(route_name='get-leave', renderer='json', request_method='GET')
def get_leave(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        try:
            leave_list = (
                request.dbsession.query(models.Leave).options(
                    joinedload(models.Leave.user)).all()
            )
            leave_data = [{'id': leave.id,
                           'user_id': leave.user_id,
                           'name': leave.user.name if leave.user else None,
                           'awal': leave.awal.strftime('%Y-%m-%d %H:%M:%S'),
                           'akhir': leave.akhir.strftime('%Y-%m-%d %H:%M:%S'),
                           'status': leave.status,
                           'desc': leave.desc} for leave in leave_list]
            return {'leave_list': leave_data}
        except SQLAlchemyError:
            return Response('Database error', content_type='text/plain', status=500)
    else:
        request.response.status = 401
        return {
            'message': 'error',
            'description': 'User is not authenticated',
            'isLogin': False
        }


@view_config(route_name='get-leave-user', renderer='json', request_method='GET')
def get_leave_user(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        try:
            leave_list = (
                request.dbsession.query(models.Leave)
                .options(joinedload(models.Leave.user))
                .filter_by(user_id=auth_user['sub'])
                .all()
            )
            leave_data = [
                {
                    'id': leave.id,
                    'user_id': leave.user_id,
                    'name': leave.user.name if leave.user else None,
                    'awal': leave.awal.strftime('%Y-%m-%d %H:%M:%S'),
                    'akhir': leave.akhir.strftime('%Y-%m-%d %H:%M:%S'),
                    'status': leave.status,
                    'desc': leave.desc
                } for leave in leave_list
            ]
            return {'leave_list': leave_data}
        except SQLAlchemyError:
            return Response('Database error', content_type='text/plain', status=500)
    else:
        request.response.status = 401
        return {
            'message': 'error',
            'description': 'User is not authenticated',
            'isLogin': False
        }


@view_config(route_name='add-leave', renderer='json', request_method='POST')
def add_leave(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        try:
            user_id = auth_user['sub']
            awal_str = request.POST.get('awal_str')
            akhir_str = request.POST.get('akhir_str')
            status = request.POST.get('status')
            desc = request.POST.get('desc')

            new_leave_entry = models.Leave(
                user_id=user_id,
                awal=awal_str,
                akhir=akhir_str,
                status=status,
                desc=desc
            )

            request.dbsession.add(new_leave_entry)
            request.dbsession.flush()

            return {'message': 'Leave record added successfully'}
        except SQLAlchemyError:
            return Response('Database error', content_type='text/plain', status=500)
    else:
        request.response.status = 401
        return {
            'message': 'error',
            'description': 'User is not authenticated',
            'isLogin': False
        }


@view_config(route_name='update-presence-status', renderer='json', request_method='PATCH')
def update_presence_status(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        presence_id = request.matchdict.get('id')
        try:
            presence = request.dbsession.query(
                models.Presence).filter_by(id=presence_id).one()
            new_status = request.POST.get('status')

            if new_status == 'diterima':
                user = (
                    request.dbsession.query(models.User)
                    .filter_by(id=presence.user_id)
                    .first()
                )

                if user is not None:
                    salary = (
                        request.dbsession.query(models.Salary)
                        .filter_by(user_id=user.id)
                        .order_by(models.Salary.id.desc())
                        .first()
                    )

                    if salary is not None:
                        salary.total_presence += 1

                        total_days = user.total_work_id
                        salary_in_months = user.jabatan.salary_in_months
                        total_salary = (salary.total_presence /
                                        total_days) * salary_in_months

                        salary.total_salary = total_salary
                        current_month = datetime.now().month
                        current_year = datetime.now().year

                        if current_month != salary.month or current_year != salary.year:
                            new_salary_entry = models.Salary(
                                user_id=user.id,
                                total_presence=1,
                                total_work_id=user.total_work_id,
                                position_id=user.jabatan_id,
                                total_salary=0,
                                month=current_month,
                                year=current_year,
                                status='belum diambil'
                            )
                            request.dbsession.add(new_salary_entry)
                        elif salary.total_presence >= total_days and salary.status == 'diterima':
                            salary.status = 'belum diambil'
                            salary.total_presence = 0
                            salary.total_salary = 0
                    else:
                        # If salary is None, create a new entry
                        new_salary_entry = models.Salary(
                            user_id=user.id,
                            total_presence=1,
                            total_work_id=user.total_work_id,
                            position_id=user.jabatan_id,
                            total_salary=0,
                            month=datetime.now().month,
                            year=datetime.now().year,
                            status='belum diambil'
                        )
                        request.dbsession.add(new_salary_entry)

            presence.status = new_status
            request.dbsession.flush()

            return {'message': 'Presence status updated successfully'}
        except SQLAlchemyError:
            return Response('Database error', content_type='text/plain', status=500)
    else:
        request.response.status = 401
        return {
            'message': 'error',
            'description': 'User is not authenticated',
            'isLogin': False
        }


@view_config(route_name='update-leave-status', renderer='json', request_method='PATCH')
def update_leave_status(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        leave_id = request.matchdict.get('id')
        try:
            leave = request.dbsession.query(
                models.Leave).filter_by(id=leave_id).one()
            new_status = request.POST.get('status')
            leave.status = new_status
            request.dbsession.flush()
            return {'message': 'Leave status updated successfully'}
        except exc.NoResultFound:
            return Response('Leave not found', content_type='text/plain', status=404)
        except SQLAlchemyError:
            return Response('Database error', content_type='text/plain', status=500)
    else:
        request.response.status = 401
        return {
            'message': 'error',
            'description': 'User is not authenticated',
            'isLogin': False
        }


@view_config(route_name='add-presence-in', renderer='json', request_method='POST')
def add_presence_in(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        try:
            user_id = auth_user['sub']
            data = request.POST['data']

            today = date.today()
            presence_today = request.dbsession.query(models.Presence).filter(
                models.Presence.user_id == user_id,
                models.Presence.presence_in >= datetime(
                    today.year, today.month, today.day),
                models.Presence.presence_in < datetime(
                    today.year, today.month, today.day) + timedelta(days=1)
            ).first()

            if presence_today:
                return {'message': 'Sudah melakukan absen!'}

            new_presence = models.Presence(
                user_id=user_id,
                presence_in=data,
                presence_out="0000-00-00 00:00:00",
                status='diproses'
            )

            request.dbsession.add(new_presence)
            request.dbsession.flush()

            return {'message': 'Absen masuk berhasil!'}
        except (SQLAlchemyError, ValueError) as e:
            return Response(f'Error: {str(e)}', content_type='text/plain', status=500)
    else:
        request.response.status = 401
        return {
            'message': 'error',
            'description': 'User is not authenticated',
            'isLogin': False
        }


@view_config(route_name='add-presence-out', renderer='json', request_method='POST')
def add_presence_out(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        try:
            user_id = auth_user['sub']
            data = request.POST['data']

            open_presence = request.dbsession.query(models.Presence).filter(
                models.Presence.user_id == user_id,
                models.Presence.presence_out == '0000-00-00 00:00:00',
                models.Presence.status == 'diproses'
            ).first()

            if not open_presence:
                return {'message': 'Belum melakukan absen masuk!'}

            open_presence.presence_out = data
            open_presence.status = 'diproses'

            request.dbsession.flush()

            return {'message': 'Absen keluar berhasil!'}
        except (SQLAlchemyError, ValueError) as e:
            return Response(f'Error: {str(e)}', content_type='text/plain', status=500)
    else:
        request.response.status = 401
        return {
            'message': 'error',
            'description': 'User is not authenticated',
            'isLogin': False
        }


"""\
Salary (Gaji)
"""


@view_config(route_name='get-salary', renderer='json', request_method='GET')
def get_salary(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        try:
            salary_list = (
                request.dbsession.query(models.Salary).options(
                    joinedload(models.Salary.user)).all()
            )
            salary_data = [{'id': salary.id,
                            'user_id': salary.user_id,
                            'name': salary.user.name if salary.user else None,
                            'total_presence': salary.total_presence,
                            'total_work_id': salary.total_work_id,
                            'total_salary': salary.total_salary,
                            'month': salary.month,
                            'year': salary.year,
                            'status': salary.status} for salary in salary_list]
            return {'salary_list': salary_data}
        except SQLAlchemyError:
            return Response('Database error', content_type='text/plain', status=500)
    else:
        request.response.status = 401
        return {
            'message': 'error',
            'description': 'User is not authenticated',
            'isLogin': False
        }


@view_config(route_name='get-salary-user', renderer='json', request_method='GET')
def get_salary_user(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        try:
            user_id = auth_user['id']
            salary_list = (
                request.dbsession.query(models.Salary)
                .options(joinedload(models.Salary.user))
                .filter_by(user_id=user_id)
                .all()
            )
            salary_data = [
                {
                    'id': salary.id,
                    'user_id': salary.user_id,
                    'name': salary.user.name if salary.user else None,
                    'total_presence': salary.total_presence,
                    'total_work_id': salary.total_work_id,
                    'total_salary': salary.total_salary,
                    'month': salary.month,
                    'year': salary.year,
                    'status': salary.status
                }
                for salary in salary_list
            ]
            return {'salary_list': salary_data}
        except SQLAlchemyError:
            return Response('Database error', content_type='text/plain', status=500)
    else:
        request.response.status = 401
        return {
            'message': 'error',
            'description': 'User is not authenticated',
            'isLogin': False
        }


@view_config(route_name='update-salary-status', renderer='json', request_method='PATCH')
def update_salary_status(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        salary_id = request.matchdict.get('id')
        try:
            salary = request.dbsession.query(
                models.Salary).filter_by(id=salary_id).one()
            new_status = request.POST.get('status')
            salary.status = new_status
            request.dbsession.flush()
            return {'message': 'Salary status updated successfully'}
        except exc.NoResultFound:
            return Response('Salary not found', content_type='text/plain', status=404)
        except SQLAlchemyError:
            return Response('Database error', content_type='text/plain', status=500)
    else:
        request.response.status = 401
        return {
            'message': 'error',
            'description': 'User is not authenticated',
            'isLogin': False
        }


"""
Counter
"""


@view_config(route_name='get-presence-count-today', renderer='json', request_method='GET')
def get_presence_count_today(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        try:
            presence_accepted_count = request.dbsession.query(func.count()).filter(
                models.Presence.status == 'diterima').scalar()

            presence_rejected_count = request.dbsession.query(func.count()).filter(
                models.Presence.status == 'ditolak').scalar()

            presence_late_count = request.dbsession.query(func.count()).filter(
                models.Presence.status == 'telat').scalar()

            leave_accepted_count = request.dbsession.query(func.count()).filter(
                models.Leave.status == 'diterima').scalar()

            return {
                'presence_accepted_count': presence_accepted_count,
                'presence_rejected_count': presence_rejected_count,
                'presence_late_count': presence_late_count,
                'leave_accepted_count': leave_accepted_count
            }
        except SQLAlchemyError:
            return Response('Database error', content_type='text/plain', status=500)
    else:
        request.response.status = 401
        return {
            'message': 'error',
            'description': 'User is not authenticated',
            'isLogin': False
        }


@view_config(route_name='get-presence-count', renderer='json', request_method='GET')
def get_presence_count(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        try:
            presence_accepted_count = request.dbsession.query(func.count()).filter(
                models.Presence.status == 'diterima').scalar()

            presence_rejected_count = request.dbsession.query(func.count()).filter(
                models.Presence.status == 'ditolak').scalar()

            presence_late_count = request.dbsession.query(func.count()).filter(
                models.Presence.status == 'telat').scalar()

            leave_accepted_count = request.dbsession.query(func.count()).filter(
                models.Leave.status == 'diterima').scalar()

            total_presence_count = presence_accepted_count + \
                presence_rejected_count + presence_late_count

            return {
                'presence_accepted_count': presence_accepted_count,
                'presence_rejected_count': presence_rejected_count,
                'presence_late_count': presence_late_count,
                'leave_accepted_count': leave_accepted_count,
                'total_presence_count': total_presence_count
            }
        except SQLAlchemyError:
            return Response('Database error', content_type='text/plain', status=500)
    else:
        request.response.status = 401
        return {
            'message': 'error',
            'description': 'User is not authenticated',
            'isLogin': False
        }


@view_config(route_name='get-users-count', renderer='json', request_method='GET')
def get_users_count(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        try:
            today_users_count = request.dbsession.query(func.count(distinct(models.Presence.user_id))).filter(
                func.date(models.Presence.presence_in) == func.current_date()).scalar()

            return {'today_users_count': today_users_count}
        except SQLAlchemyError:
            return Response('Database error', content_type='text/plain', status=500)
    else:
        request.response.status = 401
        return {
            'message': 'error',
            'description': 'User is not authenticated',
            'isLogin': False
        }


@view_config(route_name='get-presence-user', renderer='json', request_method='GET')
def get_presence_user(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        try:
            user_id = auth_user['sub']
            presences = request.dbsession.query(models.Presence).options(
                joinedload(models.Presence.user)).filter_by(user_id=user_id).all()

            presence_list = []

            for presence in presences:
                presence_out = (
                    presence.presence_out.strftime('%Y-%m-%d %H:%M:%S')
                    if presence.presence_out and presence.presence_out != '0000-00-00 00:00:00'
                    else '-'
                )
                presence_data = {
                    'id': presence.id,
                    'user_id': presence.user_id,
                    'name': presence.user.name if presence.user else None,
                    'presence_in': presence.presence_in.strftime('%Y-%m-%d %H:%M:%S'),
                    'presence_out': presence_out,
                    'status': presence.status
                }
                presence_list.append(presence_data)

            return {'presence_list': presence_list}
        except SQLAlchemyError:
            return Response('Database error', content_type='text/plain', status=500)
    else:
        request.response.status = 401
        return {
            'message': 'error',
            'description': 'User is not authenticated',
            'isLogin': False
        }


@view_config(route_name='get-total-presence-user', renderer='json', request_method='GET')
def get_total_presence(request):
    auth_user = auth_jwt_verify(request)
    if auth_user:
        try:
            user_id = auth_user['sub']
            total_presence = (
                request.dbsession.query(func.count())
                .filter(models.Presence.user_id == user_id, models.Presence.status == 'diterima')
                .scalar()
            )

            total_cuti = (
                request.dbsession.query(func.count())
                .filter(models.Presence.user_id == user_id, models.Presence.status == 'cuti')
                .scalar()
            )

            return {'total_presence': total_presence, 'total_cuti': total_cuti}
        except SQLAlchemyError:
            return Response('Database error', content_type='text/plain', status=500)
    else:
        request.response.status = 401
        return {
            'message': 'error',
            'description': 'User is not authenticated',
            'isLogin': False
        }


db_err_msg = """\
Pyramid is having a problem using your SQL database.  The problem
might be caused by one of the following things:

1.  You may need to initialize your database tables with `alembic`.
    Check your README.txt for descriptions and try to run it.

2.  Your database server may not be running.  Check that the
    database server referred to by the "sqlalchemy.url" setting in
    your "development.ini" file is running.

After you fix the problem, please restart the Pyramid application to
try it again.
"""
