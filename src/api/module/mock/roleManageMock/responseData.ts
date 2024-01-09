import Mock from 'mockjs'
export const roles = [
    {
        'id': '55ad1832-0cce-45c8-9b45-ee9c2d72abf2',
        'name': 'newRole',
        'description': '22222',
        'composite': false,
        'clientRole': true,
        'containerId': 'a72a5bed-8673-48e1-ac0a-97ba3c06c88f',
        'attributes': {
            'created': [
                '2023-12-27 17:40:34'
            ]
        }
    },
    {
        'id': '8d1600a5-a785-4d18-a815-44049210968b',
        'name': 'normal',
        'description': '本角色为普通用户，需要超级管理员赋予其他权限',
        'composite': false,
        'clientRole': true,
        'containerId': 'a72a5bed-8673-48e1-ac0a-97ba3c06c88f',
        'attributes': {
            'type': [
                '0'
            ],
            'created': [
                '2023-12-27'
            ]
        }
    },
    {
        'id': '85efb45a-a866-43ab-892a-85a6836ab1a7',
        'name': 'admin',
        'description': '本角色为超级管理员，有全部的权限',
        'composite': false,
        'clientRole': true,
        'containerId': 'a72a5bed-8673-48e1-ac0a-97ba3c06c88f',
        'attributes': {
            'created': [
                '2023-12-27'
            ]
        }
    },
    {
        'id': '05354688-1daa-4563-9f5e-cbcae93dff80',
        'name': 'testRole',
        'description': '222',
        'composite': false,
        'clientRole': true,
        'containerId': 'a72a5bed-8673-48e1-ac0a-97ba3c06c88f',
        'attributes': {
            'created': [
                '2023-12-27 16:04:52'
            ]
        }
    },
    {
        'id': '37055792-f354-4658-aa45-8a26daf1771b',
        'name': 'IA_admin',
        'description': '本角色为分级管理员，有二次授权权限',
        'composite': false,
        'clientRole': true,
        'containerId': 'a72a5bed-8673-48e1-ac0a-97ba3c06c88f',
        'attributes': {
            'created': [
                '2023-12-27'
            ]
        }
    }
]

const roleList = [
    {
        id: Mock.mock('@increment()'),
        role_name: Mock.mock('@name')
    },
    {
        id: Mock.mock('@increment()'),
        role_name: Mock.mock('@name')
    }
]

// 用户菜单
const roleMenus = {
    'menus_ids': [
        'SysLog',
        'SysSetting',
        'sysRole',
        'Setting'
    ],
    'operate_ids': [
        {
            'menuId': 'SysSetting',
            'operate_ids': [
                'operateAuth'
            ]
        }
    ]
}

// 实例权限详情
const instPermissionsDetail = {
    'instance_type': '拓扑图',
    'permissions': {
        'use': false,
        'view': true,
        'manage': true,
        'bk_obj_id': ''
    },
    'role': 3,
    'instances': [
        56
    ]
}

// 实例权限数据
const instPermissions = Mock.mock({
    'items|2': [
        {
            'id|+1': 90,
            'count': instPermissionsDetail.instances.length,
            'permissions_text': '查询',
            'created_at': '@datetime',
            'updated_at': '@datetime',
            'created_by': 'admin',
            'updated_by': 'admin',
            'instance_type': '拓扑图',
            'role': 3
        }
    ]
})

// 实例类型数据
const instTypes = [
    {
        'instance_type': '拓扑图',
        'fields': {
            'name': '拓扑图名称',
            'id': '',
            'created_by': '创建人',
            'created_at': '创建时间'
        },
        'permissions': {
            'view': '查询',
            'manage': '管理'
        },
        'show': 'name',
        'unique_id': 'id'
    }
]

// 具体实例类型的数据(拓扑图)
const instancesData = [
    {
        'id': 56,
        'name': '交换机连线',
        'created_at': '2023-10-25 18:22:42',
        'created_by': 'david24'
    },
    {
        'id': 55,
        'name': '图片下钻',
        'created_at': '2023-10-23 15:54:30',
        'created_by': 'martinezwalter'
    }
]

const getQuery = (url, name) => {
    const isFind = url.indexOf(name) !== -1
    if (isFind) {
        const queryArr = url.split('?')[1].split('&')
        for (let i = 0; i < queryArr.length; i++) {
            const result = queryArr[i].split('=')
            if (result[0] === name) {
                return result[1]
            }
        }
    }
    return null
}

export default {
    getRoleListData: (params) => {
        const res = {
            result: true,
            code: '20000',
            message: 'success',
            data: []
        }
        res.data = roles
        return res
    },
    createRoleData: (params) => {
        const name = params.role_name
        const exists = roles.some(item => item.role_name === name)
        if (exists) {
            return {
                result: false,
                code: '40000',
                message: `系统以存在同名分组：${name}`,
                data: null
            }
        }
        const res = {
            result: true,
            code: '20000',
            message: 'success',
            data: {
                id: Mock.mock('@id'),
                built_in: false,
                is_super: false,
                created_at: Mock.mock('@now'),
                users: [],
                role_name: params.role_name,
                describe: params.describe
            }
        }
        roles.push(res.data)
        return res
    },
    deleteRoleData: (params) => {
        const deleteId = getQuery(params.url, 'id')
        const deleteIndex = roles.findIndex(item => item.id === deleteId)
        roles.splice(deleteIndex, 1)
        return {
            result: true,
            code: '20000',
            message: 'success',
            data: '删除角色成功！'
        }
    },
    editRoleData: (params) => {
        const body = JSON.parse(params.body)
        const nameExists = roles.some(item => item.role_name === body.role_name && item.id !== body.id)
        if (nameExists) {
            return {
                result: false,
                code: '40000',
                message: 'role_name:具有 角色名称 的 系统角色 已存在。',
                data: null
            }
        }
        const editItem = roles.find(item => item.id === body.id)
        editItem.role_name = body.role_name
        editItem.describe = body.describe
        return {
            result: true,
            code: '20000',
            message: 'success',
            data: '修改角色成功！'
        }
    },
    getAllRoleList: () => {
        return {
            result: true,
            data: roleList
        }
    },
    getRoleMenus: (params) => {
        return {
            result: true,
            code: '20000',
            message: 'success',
            data: roleMenus
        }
    },
    getInstPermissions: (params) => {
        const res = {
            result: true,
            code: '20000',
            message: 'success',
            data: {
                page: 1,
                total_page: 1,
                count: 0,
                next: null,
                previous: null,
                items: instPermissions.items
            }
        }
        res.data.count = instPermissions.items.length
        return res
    },
    deleteInstPermissions: (params) => {
        const deleteIndex = instPermissions.items.findIndex(item => item.id === params.id)
        instPermissions.items.splice(deleteIndex, 1)
        return {
            result: true,
            code: '20000',
            message: 'success',
            data: null
        }
    },
    setRoleMenu: (params) => {
        return {
            result: true,
            code: '20000',
            message: 'success',
            data: '设置成功！'
        }
    },
    getInstanceTypes: (params) => {
        return {
            result: true,
            code: '20000',
            message: 'success',
            data: instTypes
        }
    },
    getInstPermissionsDetail: (params) => {
        return {
            result: true,
            code: '20000',
            message: 'success',
            data: instPermissionsDetail
        }
    },
    getInstances: (params) => {
        const res = {
            result: true,
            code: '20000',
            message: 'success',
            data: {
                page: 1,
                total_page: 1,
                count: 0,
                next: null,
                previous: null,
                items: instancesData
            }
        }
        res.data.items = instancesData.filter(item => item.name.includes(params.search))
        res.data.count = instancesData.length
        return res
    },
    editInstPermissions: (params) => {
        return {
            result: true,
            code: 20000,
            message: 'success',
            data: null
        }
    },
    createInstPermissions: (params) => {
        const newItem = Mock.mock({
            'id|+1': instPermissions.items[length - 1] + 1,
            'count': instPermissionsDetail.instances.length,
            'permissions_text': '查询',
            'created_at': '@datetime',
            'updated_at': '@datetime',
            'created_by': 'admin',
            'updated_by': 'admin',
            'instance_type': '拓扑图',
            'role': 3
        })
        instPermissions.items.push(newItem)
        return {
            result: true,
            code: 20000,
            message: 'success',
            data: null
        }
    },
    getRoleAllUser: () => {
        return {
            result: true,
            code: 20000,
            message: 'success',
            data: [
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
                    'notBefore': 0
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
                    'notBefore': 0
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
                    'notBefore': 0
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
                    'notBefore': 0
                }
            ]
        }
    },
    getRoleDetail: () => {
        return {
            result: true,
            code: 20000,
            message: 'success',
            data: {
                groups: [
                    {
                        id: 'a7847105-df3d-4ba8-a057-dedc9bb91c4c',
                        name: 'Test Group',
                        path: '/Test Group'
                    }
                ]
            }
        }
    }
}
