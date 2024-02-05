// 角色管理表头
export const ROLE_MANAGE_COLUMNS = [
    {
        label: '角色名称',
        key: 'name',
        align: 'left',
        minWidth: '100px'
    },
    {
        label: '角色描述',
        key: 'description',
        align: 'left',
        minWidth: '300px'
    },
    {
        label: '是否内置',
        key: 'built_in',
        align: 'left',
        minWidth: '100px',
        scopedSlots: 'built_in'
    },
    {
        label: '操作',
        key: 'operation',
        align: 'left',
        width: '300px',
        scopedSlots: 'operation'
    }
]
// 人员表头
export const USER_COLUMNS = [
    {
        type: 'selection'
    },
    {
        label: '中文名',
        key: 'chname'
    },
    {
        label: '用户名',
        key: 'bk_username'
    }
]
// 人员和组织tab
export const ROLE_PANELS = [
    {
        label: '人员',
        name: 'user'
    },
    {
        label: '组织',
        name: 'group'
    }
]
