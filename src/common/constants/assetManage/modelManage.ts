export const PROPERTY_COLUMNS = [
    {
        label: '属性名',
        key: 'attr_name',
        align: 'left',
        minWidth: '100px'
    },
    {
        label: '属性ID',
        key: 'attr_id',
        align: 'left',
        minWidth: '100px'
    },
    {
        label: '值类型',
        key: 'attr_type',
        align: 'left',
        scopedSlots: 'attrType',
        minWidth: '100px'
    },
    {
        label: '是否必填',
        key: 'is_required',
        align: 'left',
        minWidth: '100px',
        scopedSlots: 'require'
    },
    {
        label: '操作',
        key: 'operation',
        align: 'left',
        width: '180px',
        scopedSlots: 'operation'
    }
]

// 值类型
export const OPERATE_TYPE_LIST = [
    // {
    //     id: 'singlechar',
    //     name: '短字符'
    // },
    {
        id: 'str',
        name: '字符串'
    },
    {
        id: 'int',
        name: '数字'
    },
    {
        id: 'enum',
        name: '枚举'
    },
    // {
    //     id: 'date',
    //     name: '日期'
    // },
    {
        id: 'time',
        name: '时间'
    },
    // {
    //     id: 'objuser',
    //     name: '用户'
    // },
    {
        id: 'bool',
        name: '布尔'
    }
    // {
    //     id: 'organization',
    //     name: '组织'
    // }
]

// 关联表头
export const RELATION_COLUMNS = [
    {
        label: '关联名称',
        key: 'asst_id',
        align: 'left',
        minWidth: '100px'
    },
    {
        label: '源模型',
        key: 'src_model_id',
        align: 'left',
        minWidth: '100px'
    },
    {
        label: '目标模型',
        key: 'dst_model_id',
        align: 'left',
        minWidth: '100px'
    },
    {
        label: '关联关系',
        key: 'model_asst_id',
        align: 'left',
        minWidth: '100px'
    },
    {
        label: '约束条件',
        key: 'mapping',
        align: 'left',
        minWidth: '100px'
    },
    {
        label: '操作',
        key: 'operation',
        align: 'left',
        width: '180px',
        scopedSlots: 'operation'
    }
]
