export const routeConfig = [
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
                                type: 'check',
                                apiKey: ['role_list']
                            },
                            {
                                key: 'SysRole_create',
                                value: false,
                                label: '创建角色',
                                type: 'operate',
                                apiKey: ['role_create']
                            },
                            {
                                key: 'SysRole_edit',
                                value: false,
                                label: '编辑角色',
                                type: 'operate',
                                apiKey: ['role_update']
                            },
                            {
                                key: 'SysRole_delete',
                                value: false,
                                label: '删除角色',
                                type: 'operate',
                                apiKey: ['role_delete']
                            },
                            {
                                key: 'SysRole_users_manage',
                                value: false,
                                label: '人员管理',
                                type: 'operate',
                                apiKey: ['user_list_by_role', 'role_groups', 'user_list', 'group_list', 'role_remove_user', 'role_add_user', 'role_add_groups', 'role_remove_groups']
                            },
                            {
                                key: 'SysRole_permissions',
                                value: false,
                                label: '设置权限',
                                type: 'operate',
                                apiKey: ['role_permissions', 'role_set_permissions']
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
                                type: 'check',
                                apiKey: ['user_list', 'role_list']
                            },
                            {
                                key: 'SysUser_create',
                                value: false,
                                label: '创建用户',
                                type: 'operate',
                                apiKey: ['user_create']
                            },
                            {
                                key: 'SysUser_edit',
                                value: false,
                                label: '编辑用户',
                                type: 'operate',
                                apiKey: ['user_update', 'user_reset_password', 'role_add_user', 'role_remove_user', 'role_list', 'group_list', 'user_remove_groups', 'user_add_groups']
                            },
                            {
                                key: 'SysUser_delete',
                                value: false,
                                label: '删除用户',
                                type: 'operate',
                                apiKey: ['user_delete']
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
                                type: 'check',
                                apiKey: ['group_list']
                            },
                            {
                                key: 'SysGroup_create',
                                value: false,
                                label: '创建组织',
                                type: 'operate',
                                apiKey: ['group_create']
                            },
                            {
                                key: 'SysGroup_edit',
                                value: false,
                                label: '编辑组织',
                                type: 'operate',
                                apiKey: ['group_update']
                            },
                            {
                                key: 'SysGroup_delete',
                                value: false,
                                label: '删除组织',
                                type: 'operate',
                                apiKey: ['group_delete']
                            },
                            {
                                key: 'SysGroup_role',
                                value: false,
                                label: '角色管理',
                                type: 'operate',
                                apiKey: ['group_users', 'user_list', 'group_add_users', 'group_remove_users']
                            },
                            {
                                key: 'SysGroup_user',
                                value: false,
                                label: '人员管理',
                                type: 'operate',
                                apiKey: ['group_roles', 'role_list', 'group_add_roles', 'group_remove_roles']
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
                                type: 'check',
                                apiKey: ['operation_log_list']
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
                                type: 'check',
                                apiKey: ['menu_list']
                            },
                            {
                                key: 'SysSetting_menus_create',
                                value: false,
                                label: '新增菜单',
                                type: 'operate',
                                apiKey: ['menu_create']
                            },
                            {
                                key: 'SysSetting_menus_edit',
                                value: false,
                                label: '编辑菜单',
                                type: 'operate',
                                apiKey: ['menu_update', 'menu_retrieve', 'menu_use']
                            },
                            {
                                key: 'SysSetting_menus_delete',
                                value: false,
                                label: '删除菜单',
                                type: 'operate',
                                apiKey: ['menu_delete']
                            },
                            {
                                key: 'SysSetting_logo_change',
                                value: false,
                                label: '更换logo',
                                type: 'operate',
                                apiKey: ['logo_update', 'logo_reset']
                            }
                        ]
                    }
                ]
            }
        ]
    }
]