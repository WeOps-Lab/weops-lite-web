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
                            },
                            {
                                key: 'SysGroup_role',
                                value: false,
                                label: '角色管理',
                                type: 'operate'
                            },
                            {
                                key: 'SysGroup_user',
                                value: false,
                                label: '人员管理',
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
