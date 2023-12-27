def includeme(config):
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('index', '/')
    config.add_route('welcome', '/welcome')
    # Auth
    config.add_route('login', '/login')
    config.add_route('logout', '/logout')
    config.add_route('auth-info', '/auth-info')
    # Profil Me
    config.add_route('edit-profile', '/edit-profile', request_method="PATCH")
    config.add_route('get-avatar', '/avatars/{username}/{path}')
    # Jabatan
    config.add_route('get-jabatan', '/jabatan', request_method='GET')
    config.add_route('add-jabatan', '/jabatan', request_method='POST')
    config.add_route('edit-jabatan', '/jabatan/{id}', request_method='PATCH')
    config.add_route('delete-jabatan',
                     '/jabatan/{id}', request_method='DELETE')
    # Users
    config.add_route('get-users', '/users', request_method='GET')
    # config.add_route('get-user', '/users/{id}', request_method='GET')
    config.add_route('add-user', '/users', request_method='POST')
    config.add_route('edit-user', '/users/{id}', request_method='PATCH')
    config.add_route('delete-user', '/users/{id}', request_method='DELETE')
    # Presence
    config.add_route('get-presence', '/presence', request_method='GET')
    config.add_route('get-total-presence-user',
                     '/count-presence', request_method='GET')
    config.add_route('add-presence-in', '/add-presence-in',
                     request_method='POST')
    config.add_route('add-presence-out', '/add-presence-out',
                     request_method='POST')
    config.add_route('get-presence-user', '/presence-user',
                     request_method='GET')
    config.add_route('update-presence-status',
                     '/presence/{id}/update-status', request_method='PATCH')
    # leave
    config.add_route('get-leave', '/leave', request_method='GET')
    config.add_route('get-leave-user', '/leave-user', request_method='GET')
    config.add_route('add-leave', '/add-leave', request_method='POST')
    config.add_route(
        'update-leave-status', '/leave/{id}/update-status', request_method='PATCH')

    # salary
    config.add_route('get-salary', '/salary', request_method='GET')
    config.add_route('get-salary-user', '/salaryU', request_method='GET')
    config.add_route('update-salary-status',
                     '/salary/{id}/update-status', request_method='PATCH')

    # counter
    config.add_route('get-presence-count-today',
                     '/presence-count-today', request_method='GET')
    config.add_route('get-presence-count',
                     '/presence-count', request_method='GET')
    config.add_route('get-users-count', '/users-count',
                     request_method='GET')
