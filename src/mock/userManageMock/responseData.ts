import {roles as roleItems} from '../roleManageMock/responseData'
import Mock from 'mockjs'
// 菜单数据
const menuItems = [
    {
        'id': 1,
        'created_at': '2023-08-28 23:37:32',
        'updated_at': '2023-10-30 15:11:10',
        'created_by': 'admin',
        'updated_by': 'admin',
        'menu_name': '默认菜单',
        'default': true,
        'use': true,
        'menu': []
    },
    {
        'id': 2,
        'created_at': '2023-08-29 18:17:34',
        'updated_at': '2023-10-30 15:10:57',
        'created_by': 'admin',
        'updated_by': 'admin',
        'menu_name': '外链',
        'default': false,
        'use': false,
        'menu': [
            {
                'id': 'SysSetting',
                'url': '/sysSetting',
                'auth': [
                    {
                        'key': 'checkAuth',
                        'type': 'check',
                        'label': '查看',
                        'value': false
                    },
                    {
                        'key': 'operateAuth',
                        'type': 'operate',
                        'label': '操作',
                        'value': false
                    }
                ],
                'icon': 'cw-icon weops-setting',
                'name': '系统设置',
                'originName': '系统管理/系统设置'
            },
            {
                'id': 'datainsight7457',
                'key': '050v9',
                'url': 'http://datainsight.weops.com/',
                'auth': [
                    {
                        'key': 'checkAuth',
                        'type': 'check',
                        'label': '查看',
                        'value': false
                    }
                ],
                'icon': 'cw-icon weops-lian-jie',
                'name': 'datainsight',
                'isUrl': true
            },
            {
                'id': 'SysUser',
                'url': '/sysUser',
                'auth': [
                    {
                        'key': 'checkAuth',
                        'type': 'check',
                        'label': '查看',
                        'value': false
                    },
                    {
                        'key': 'operateAuth',
                        'type': 'operate',
                        'label': '操作',
                        'value': false
                    }
                ],
                'icon': 'cw-icon weops-user',
                'name': '用户管理',
                'originName': '系统管理/用户管理'
            },
            {
                'id': 'SysLog',
                'url': '/sysLog',
                'auth': [
                    {
                        'key': 'checkAuth',
                        'type': 'check',
                        'label': '查看',
                        'value': false
                    }
                ],
                'icon': 'cw-icon weops-operation-log-fill',
                'name': '操作日志',
                'originName': '系统管理/操作日志'
            },
            {
                'id': 'SysRole',
                'url': '/sysRole',
                'auth': [
                    {
                        'key': 'checkAuth',
                        'type': 'check',
                        'label': '查看',
                        'value': false
                    },
                    {
                        'key': 'operateAuth',
                        'type': 'operate',
                        'label': '操作',
                        'value': false
                    }
                ],
                'icon': 'cw-icon weops-role',
                'name': '角色管理',
                'originName': '系统管理/角色管理'
            }
        ]
    }
]

// 人员管理数据
const userItems = [
    {
        'id': 2,
        'bk_username': 'admin',
        'chname': '\u8d85\u7ba1'
    },
    {
        'id': 3,
        'bk_username': 'randy61',
        'chname': 'randy61'
    },
    {
        'id': 7,
        'bk_username': 'pwm',
        'chname': '\u72d7\u86cb'
    },
    {
        'id': 8,
        'bk_username': 'eric',
        'chname': 'Eric'
    },
    {
        'id': 10,
        'bk_username': 'windyzhao',
        'chname': '\u8d75\u91d1\u76df'
    },
    {
        'id': 11,
        'bk_username': 'windyzhao1',
        'chname': '\u8d75\u91d1\u76df\u5c0f\u5f1f'
    }
]

// 用户列表数据
const userListItems = [
    {
        'id': 'ed7c355d-a2d5-4921-8203-50c2b7e273d7',
        'createdTimestamp': 1703149919945,
        'username': '111',
        'enabled': true,
        'totp': false,
        'emailVerified': false,
        'lastName': '额',
        'disableableCredentialTypes': [],
        'requiredActions': [],
        'notBefore': 0,
        'access': {
            'manageGroupMembership': true,
            'view': true,
            'mapRoles': true,
            'impersonate': true,
            'manage': true
        },
        'groups': [],
        'group_roles': [],
        'roles': []
    },
    {
        'id': '4e7be797-270d-4d92-8f23-8923efa81a31',
        'createdTimestamp': 1702458013473,
        'username': 'admin',
        'enabled': true,
        'totp': false,
        'emailVerified': false,
        'lastName': '管理员',
        'email': 'admin@kc.com',
        'disableableCredentialTypes': [],
        'requiredActions': [],
        'notBefore': 0,
        'access': {
            'manageGroupMembership': true,
            'view': true,
            'mapRoles': true,
            'impersonate': true,
            'manage': true
        },
        'groups': [
            {
                'id': 'a7847105-df3d-4ba8-a057-dedc9bb91c4c',
                'name': 'Test Group',
                'path': '/Test Group'
            }
        ],
        'group_roles': [
            {
                'id': '85efb45a-a866-43ab-892a-85a6836ab1a7',
                'name': 'admin',
                'description': '本角色为超级管理员，有全部的权限',
                'composite': false,
                'clientRole': true,
                'containerId': 'a72a5bed-8673-48e1-ac0a-97ba3c06c88f'
            }
        ],
        'roles': []
    },
    {
        'id': 'adb3c92c-8b8a-4bcd-ba9e-bd444a092183',
        'createdTimestamp': 1702546733331,
        'username': 'new',
        'enabled': true,
        'totp': false,
        'emailVerified': false,
        'lastName': '是',
        'disableableCredentialTypes': [],
        'requiredActions': [],
        'notBefore': 0,
        'access': {
            'manageGroupMembership': true,
            'view': true,
            'mapRoles': true,
            'impersonate': true,
            'manage': true
        },
        'groups': [
            {
                'id': 'd9cca9e9-967b-4c9c-9330-882b8e36160d',
                'name': '新组织',
                'path': '/新组织'
            }
        ],
        'group_roles': [
            {
                'id': '55ad1832-0cce-45c8-9b45-ee9c2d72abf2',
                'name': 'newRole',
                'description': '22222',
                'composite': false,
                'clientRole': true,
                'containerId': 'a72a5bed-8673-48e1-ac0a-97ba3c06c88f'
            }
        ],
        'roles': [
            {
                'id': '8d1600a5-a785-4d18-a815-44049210968b',
                'name': 'normal',
                'description': '本角色为普通用户，需要超级管理员赋予其他权限',
                'composite': false,
                'clientRole': true,
                'containerId': 'a72a5bed-8673-48e1-ac0a-97ba3c06c88f'
            },
            {
                'id': '85efb45a-a866-43ab-892a-85a6836ab1a7',
                'name': 'admin',
                'description': '本角色为超级管理员，有全部的权限',
                'composite': false,
                'clientRole': true,
                'containerId': 'a72a5bed-8673-48e1-ac0a-97ba3c06c88f'
            },
            {
                'id': '05354688-1daa-4563-9f5e-cbcae93dff80',
                'name': 'testRole',
                'description': '222',
                'composite': false,
                'clientRole': true,
                'containerId': 'a72a5bed-8673-48e1-ac0a-97ba3c06c88f'
            },
            {
                'id': '37055792-f354-4658-aa45-8a26daf1771b',
                'name': 'IA_admin',
                'description': '本角色为分级管理员，有二次授权权限',
                'composite': false,
                'clientRole': true,
                'containerId': 'a72a5bed-8673-48e1-ac0a-97ba3c06c88f'
            }
        ]
    },
    {
        'id': '91aefc4d-1525-45cb-9cd6-07d184a39986',
        'createdTimestamp': 1702458013615,
        'username': 'normal_user',
        'enabled': true,
        'totp': false,
        'emailVerified': false,
        'lastName': '普通用户',
        'email': 'normal@kc.com',
        'disableableCredentialTypes': [],
        'requiredActions': [],
        'notBefore': 0,
        'access': {
            'manageGroupMembership': true,
            'view': true,
            'mapRoles': true,
            'impersonate': true,
            'manage': true
        },
        'groups': [],
        'group_roles': [],
        'roles': [
            {
                'id': '8d1600a5-a785-4d18-a815-44049210968b',
                'name': 'normal',
                'description': '本角色为普通用户，需要超级管理员赋予其他权限',
                'composite': false,
                'clientRole': true,
                'containerId': 'a72a5bed-8673-48e1-ac0a-97ba3c06c88f'
            }
        ]
    },
    {
        'id': '99358af8-3d7d-4d6f-8561-11803ccf0966',
        'createdTimestamp': 1703134764268,
        'username': 'test',
        'enabled': true,
        'totp': false,
        'emailVerified': false,
        'lastName': '测试用户',
        'email': '111@qq.com',
        'disableableCredentialTypes': [],
        'requiredActions': [],
        'notBefore': 0,
        'access': {
            'manageGroupMembership': true,
            'view': true,
            'mapRoles': true,
            'impersonate': true,
            'manage': true
        },
        'groups': [],
        'group_roles': [],
        'roles': [
            {
                'id': '8d1600a5-a785-4d18-a815-44049210968b',
                'name': 'normal',
                'description': '本角色为普通用户，需要超级管理员赋予其他权限',
                'composite': false,
                'clientRole': true,
                'containerId': 'a72a5bed-8673-48e1-ac0a-97ba3c06c88f'
            }
        ]
    },
    {
        'id': '68238901-e24e-461f-a524-9d072ef8c7d5',
        'createdTimestamp': 1703149626635,
        'username': 'user',
        'enabled': true,
        'totp': false,
        'emailVerified': false,
        'lastName': '呃',
        'disableableCredentialTypes': [],
        'requiredActions': [],
        'notBefore': 0,
        'access': {
            'manageGroupMembership': true,
            'view': true,
            'mapRoles': true,
            'impersonate': true,
            'manage': true
        },
        'groups': [],
        'group_roles': [],
        'roles': [
            {
                'id': '8d1600a5-a785-4d18-a815-44049210968b',
                'name': 'normal',
                'description': '本角色为普通用户，需要超级管理员赋予其他权限',
                'composite': false,
                'clientRole': true,
                'containerId': 'a72a5bed-8673-48e1-ac0a-97ba3c06c88f'
            },
            {
                'id': '05354688-1daa-4563-9f5e-cbcae93dff80',
                'name': 'testRole',
                'description': '222',
                'composite': false,
                'clientRole': true,
                'containerId': 'a72a5bed-8673-48e1-ac0a-97ba3c06c88f'
            }
        ]
    }
]

// 双因子认证配置
let loginSetData = Mock.mock({
    'default_domain': 'default.local',
    'auth_type': ['mail'],
    'auth_white_list': {
        'role|2': [
            {
                'id|+1': 100,
                'role_name': '@word',
                'user_count|0-5': 0,
                'isChecked': true
            }
        ],
        'user': []
    },
    'two_factor_enable': false
})

// 角色列表(白名单)
const roleItemsWhite = Mock.mock({
    'items|3': [
        {
            'id|+1': 110,
            'role_name': '@word',
            'user_count|1-20': 1
        }
    ]
})

export default {
    getMenuData: (params) => {
        const res = {
            result: true,
            code: '20000',
            message: 'success',
            data: {
                page: 1,
                total_page: 1,
                count: menuItems.length,
                next: null,
                previous: null,
                data: menuItems
            }
        }
        res.data.data = menuItems.filter(item => item.menu_name.includes(params.search))
        return res
    },
    getMenuById: (params) => {
        const menuData = menuItems.find(item => item.id === +params.id)
        const res = {
            result: true,
            code: '20000',
            message: 'success',
            data: menuData
        }
        return res
    },
    deleteMenu: (params) => {
        const deleteIndex = menuItems.findIndex(item => item.id === params.id)
        menuItems.splice(deleteIndex, 1)
        return {
            result: true,
            code: '20000',
            message: 'success',
            data: {'success': true}
        }
    },
    useMenu: (params) => {
        menuItems.forEach(item => {
            if (item.id === params.id) {
                item.use = true
            } else {
                item.use = false
            }
        })
        return {
            result: true,
            code: '20000',
            message: 'success',
            data: {success: true}
        }
    },
    searchUserList: (params) => {
        const res = {
            result: true,
            data: {
                count: 0,
                items: userItems
            }
        }
        res.data.count = userItems.length
        res.data.items = userItems.filter(item => item.chname.includes(params.search))
        return res
    },
    setUsersByRole: (params) => {
        const roleItem = roleItems.find(item => item.id === params.id)
        const userList = userItems.filter(item => params.users.includes(item.id))
        roleItem.users = userList.map(item => {
            return {
                bk_user_id: Mock.mock('@id'),
                bk_username: item.bk_username,
                chname: item.chname,
                id: item.id
            }
        })
        return {
            result: true,
            code: '20000',
            message: 'success',
            data: '设置成功！'
        }
    },
    getUserList: (params) => {
        const res = {
            'result': true,
            'code': '20000',
            'message': 'success',
            'data': {
                'page': 1,
                'total_page': 1,
                'count': 0,
                'next': 'http://paas.weops.com/o/weops_saas/system/mgmt/user_manage/get_users/?page=2&page_size=20&roles=%5B%5D&search=',
                'previous': null,
                'users': userListItems
            }
        }
        res.data.total_page = Math.ceil(res.data.count / params.per_age)
        res.data.users = userListItems.filter(item => item.username.includes(params.search))
        res.data.count = res.data.users.length
        return res
    },
    deleteUser: (params) => {
        const deleteIndex = userListItems.findIndex(item => item.id === params.id)
        userListItems.splice(deleteIndex, 1)
        return {
            result: true,
            code: '20000',
            message: 'success',
            data: '删除用户成功！'
        }
    },
    setUserRoles: (params) => {
        return {
            result: true,
            code: '20000',
            message: 'success',
            data: '设置用户角色成功！'
        }
    },
    editUser: (params) => {
        const editItem = userListItems.find(item => item.id === params.id)
        if (editItem) {
            editItem.lastName = params.lastName
            editItem.email = params.email
        }
        return {
            result: true,
            code: '20000',
            message: 'success',
            data: '修改用户成功'
        }
    },
    createUser: (params) => {
        if (userListItems.find(item => item.username === params.username)) {
            return {
                result: false,
                code: 40000,
                data: '用户已存在',
                message: '用户已经存在'
            }
        }
        const newUser = {
            id: '' + Mock.mock('@integer'),
            username: params.username,
            lastName: params.lastName,
            email: params.email
        }
        userListItems.unshift(newUser)
        return {
            result: true,
            code: '20000',
            message: 'success',
            data: '创建用户成功'
        }
    },
    updateUserStatus: (params) => {
        const updateUser = userListItems.find(item => item.id === params.id)
        updateUser.status = params.body.status
        return {
            result: true,
            code: '20000',
            message: 'success',
            data: '修改用户状态成功'
        }
    },
    resetPassword: (params) => {
        return {
            result: true,
            code: '20000',
            message: 'success',
            data: '重置密码成功'
        }
    },
    getDomainList: (params) => {
        return {
            result: true,
            data: ['default.local', 'test']
        }
    },
    getLoginSet: (params) => {
        return {
            result: true,
            data: loginSetData
        }
    },
    setDomain: (params) => {
        loginSetData.default_domain = params.default_domain
        return {
            result: true
        }
    },
    updateLoginSet: (params) => {
        loginSetData = params
        return {
            result: true
        }
    },
    searchRoleList: (params) => {
        const res = {
            result: true,
            data: {
                count: 0,
                items: roleItemsWhite.items
            }
        }
        res.data.count = roleItemsWhite.items.length
        return res
    },
    createMenuManage: (params) => {
        const newMenu = {
            id: +Mock.mock('@id'),
            created_at: Mock.mock('@now'),
            updated_at: Mock.mock('@now'),
            created_by: 'admin',
            updated_by: 'admin',
            menu_name: params.menu_name,
            default: false,
            use: false,
            menu: params.menu
        }
        menuItems.push(newMenu)
        return {
            result: true,
            code: '20000',
            message: 'success',
            data: newMenu
        }
    },
    updateMenuManage: (params) => {
        menuItems.forEach(item => {
            if (item.id === params.id) {
                item.updated_at = Mock.mock('@now')
                item.menu = params.menu
                item.menu_name = params.menu_name
            }
        })
        return {
            result: true,
            code: '20000',
            message: 'success'
        }
    }
}
