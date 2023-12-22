// 无设置菜单权限
const AuthPermission = () => import('@/views/authPermission.vue')
const Forbidden = () => import('@/views/403.vue')
const NoFound = () => import('@/views/404.vue')

// 系统管理
const SysRole = () => import('@/views/roleManage/index.vue')
const SysUser = () => import('@/views/userMange/index.vue')
const SysSetting = () => import('@/views/sysSetting/index.vue')
const SysLog = () => import('@/views/logManage/index.vue')
const MenuSetting = () => import('@/views/sysSetting/menuSetting.vue')
const Login = () => import('@/views/login.vue')
const SysGroup = () => import('@/views/groupManage/index.vue')

let mainRouter = [
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            title: '登录'
        }
    },
    {
        path: '/authPermissionFail',
        name: 'AuthPermissionFail',
        component: AuthPermission,
        meta: {
            title: '无菜单权限'
        }
    },
    {
        path: '/403',
        name: '403',
        component: Forbidden,
        meta: {
            title: '页面无访问权限'
        }
    },
    {
        path: '/404',
        name: '404',
        component: NoFound,
        meta: {
            title: '页面找不到'
        }
    },
    // 新增
    {
        path: '/sysRole',
        name: 'SysRole',
        component: SysRole,
        meta: {
            title: '角色管理'
        }
    },
    {
        path: '/sysUser',
        name: 'SysUser',
        component: SysUser,
        meta: {
            title: '用户管理'
        }
    },
    {
        path: '/sysSetting',
        name: 'SysSetting',
        component: SysSetting,
        meta: {
            title: '系统设置',
            cacheName: 'sys-setting' // 需要缓存的页面名称，需要跟这个组件的name命名一致
        }
    },
    {
        path: '/menuSetting',
        name: 'MenuSetting',
        component: MenuSetting,
        meta: {
            title: '自定义菜单',
            activeMenu: 'SysSetting',
            parentIds: ['SysSetting'],
            needCache: false // 离开后是父级页面否需要缓存。需注意的是，要配合cacheName使用，并且在父级页面的beforeRouteLeave钩子中，判断是否需要缓存。若需要缓存，则调用this.$handleKeepAlive(to, from)这个方法,vuex中的keepAliveList要把父级页面的路由名称加进去
        }
    },
    {
        path: '/sysLog',
        name: 'SysLog',
        component: SysLog,
        meta: {
            title: '操作日志'
        }
    },
    {
        path: '/sysGroup',
        name: 'SysGroup',
        component: SysGroup,
        meta: {
            title: '组织管理'
        }
    }
]
const routeConfig = [
    {
        name: '管理',
        id: 'Setting',
        sortIndex: 8,
        auth: [
            {
                key: 'checkAuth',
                value: false,
                label: '查看',
                type: 'check'
            },
            {
                key: 'operateAuth',
                value: false,
                label: '操作',
                type: 'operate'
            }
        ],
        children: [
            {
                name: '系统管理',
                icon: 'cw-icon weops-system',
                id: 'sysManage',
                // id: 'sysRole',
                sortIndex: 9,
                auth: [
                    {
                        key: 'checkAuth',
                        value: false,
                        label: '查看',
                        type: 'check'
                    },
                    {
                        key: 'operateAuth',
                        value: false,
                        label: '操作',
                        type: 'operate'
                    }
                ],
                children: [
                    {
                        name: '角色管理',
                        id: 'SysRole',
                        icon: 'cw-icon weops-role',
                        url: '/sysRole',
                        auth: [
                            {
                                key: 'SysRole_view',
                                value: false,
                                label: '查看',
                                type: 'check'
                            },
                            {
                                key: 'SysRole_create',
                                value: false,
                                label: '创建角色',
                                type: 'operate'
                            },
                            {
                                key: 'SysRole_edit',
                                value: false,
                                label: '编辑角色',
                                type: 'operate'
                            },
                            {
                                key: 'SysRole_delete',
                                value: false,
                                label: '删除角色',
                                type: 'operate'
                            },
                            {
                                key: 'SysRole_users_manage',
                                value: false,
                                label: '人员管理',
                                type: 'operate'
                            },
                            {
                                key: 'SysRole_permissions',
                                value: false,
                                label: '设置权限',
                                type: 'operate'
                            }
                        ]
                    },
                    {
                        name: '用户管理',
                        id: 'SysUser',
                        icon: 'cw-icon weops-user',
                        url: '/sysUser',
                        auth: [
                            {
                                key: 'SysUser_view',
                                value: false,
                                label: '查看',
                                type: 'check'
                            },
                            {
                                key: 'SysUser_create',
                                value: false,
                                label: '创建用户',
                                type: 'operate'
                            },
                            {
                                key: 'SysUser_edit',
                                value: false,
                                label: '编辑用户',
                                type: 'operate'
                            },
                            {
                                key: 'SysUser_delete',
                                value: false,
                                label: '删除用户',
                                type: 'operate'
                            }
                        ]
                    },
                    {
                        name: '组织管理',
                        id: 'SysGroup',
                        icon: 'cw-icon weops-user',
                        url: '/sysGroup',
                        auth: [
                            {
                                key: 'SysGroup_view',
                                value: false,
                                label: '查看',
                                type: 'check'
                            },
                            {
                                key: 'SysGroup_create',
                                value: false,
                                label: '创建组织',
                                type: 'operate'
                            },
                            {
                                key: 'SysGroup_edit',
                                value: false,
                                label: '编辑组织',
                                type: 'operate'
                            },
                            {
                                key: 'SysGroup_delete',
                                value: false,
                                label: '删除组织',
                                type: 'operate'
                            }
                        ]
                    },
                    {
                        name: '操作日志',
                        id: 'SysLog',
                        icon: 'cw-icon weops-operation-log-fill',
                        url: '/sysLog',
                        auth: [
                            {
                                key: 'SysLog_view',
                                value: false,
                                label: '查看',
                                type: 'check'
                            }
                        ]
                    },
                    {
                        name: '系统设置',
                        id: 'SysSetting',
                        icon: 'cw-icon weops-setting',
                        url: '/sysSetting',
                        auth: [
                            {
                                key: 'SysSetting_menus_view',
                                value: false,
                                label: '查看',
                                type: 'check'
                            },
                            {
                                key: 'SysSetting_menus_create',
                                value: false,
                                label: '新增菜单',
                                type: 'operate'
                            },
                            {
                                key: 'SysSetting_menus_edit',
                                value: false,
                                label: '编辑菜单',
                                type: 'operate'
                            },
                            {
                                key: 'SysSetting_menus_delete',
                                value: false,
                                label: '删除菜单',
                                type: 'operate'
                            },
                            {
                                key: 'SysSetting_logo_change',
                                value: false,
                                label: '更换logo',
                                type: 'operate'
                            }
                        ]
                    }
                ]
            }
        ]
    }
]
let subsMenuPromission = {}
const manageMenu = []

// 自动导入子应用
// @ts-ignore
const files = require.context('@/projects', true, /frameRouter.ts/)
files.keys().forEach(key => {
    const router = files(key).frameRouter
    const menuList = files(key).adminRouteConfig
    const subsMenu = files(key).subsMenuList
    mainRouter = mainRouter.concat(router)
    // 处理合并项目菜单
    menuList.forEach(item => {
        const targetIndex = routeConfig.findIndex(tex => tex.id === item.id)
        if (targetIndex !== -1) {
            routeConfig[targetIndex].children = routeConfig[targetIndex].children.concat(item.children).sort((a, b) => a.sortIndex - b.sortIndex)
        } else {
            routeConfig.push(item)
        }
    })
    routeConfig.sort((a, b) => a.sortIndex - b.sortIndex)
    subsMenuPromission = { ...subsMenuPromission, ...subsMenu }
    const manageMenuItem = files(key).manageMenu
    if (manageMenuItem) {
        manageMenuItem.forEach(item => {
            const findIndex = manageMenu.findIndex(tex => tex.id === item.id)
            if (findIndex !== -1) {
                manageMenu[findIndex].children = manageMenu[findIndex].children.concat(item.children).sort((a, b) => a.sortIndex - b.sortIndex)
            } else {
                manageMenu.push(item)
            }
        })
    }
})
routeConfig.forEach(item => {
    if (item.id === 'Setting') {
        item.children = item.children.concat(manageMenu).sort((a, b) => a.sortIndex - b.sortIndex)
    }
})

export const frameRouter = mainRouter

export const menuList = routeConfig

export const subsMenuList = subsMenuPromission
