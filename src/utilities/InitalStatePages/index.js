//USUARIO
import Profile from '../../containers/Profile/Profile'
import Users from '../../containers/User/Users'
//ROLES
import Roles from '../../containers/Role/Roles'
import RoleForm from '../../containers/Role/RoleForm'

export default{
    initialPages: [
        {
            component: Profile,
            path: '/profile',
            exact: true,
            name: 'Perfil'
        }],
    allPages: [
        {
            component: Profile,
            path: '/profile',
            exact: true,
            name: 'PERFIL'
        },{
            component: Users,
            path: '/users',
            exact: true,
            name: 'USUARIOS'
        },{
            component: Roles,
            path: '/roles',
            exact: true,
            name: 'ROLES'
        },{
            component: RoleForm,
            path: '/newRole',
            exact: true,
            name: 'AGREGAR ROL'
        },{
            component: RoleForm,
            path: '/editRole/:id',
            exact: true,
            name: 'ACTUALIZAR ROL'
        },{
            component: RoleForm,
            path: '/viewRole/:id',
            exact: true,
            name: 'VISUALIZAR ROL'
        }
    ]
}