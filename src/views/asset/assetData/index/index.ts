import { Component, Vue } from 'vue-property-decorator'
import ComTable from '@/components/comTable/index.vue'
import { Pagination, TableData } from '@/common/types'
import AddInstance from '../components/addInstance/index.vue'
import ImportInstance from '../components/importInstance/index.vue'
import SelectInput from '../components/selectInput/index.vue'
import { getAssetAttrValue } from '@/controller/func/common'
@Component({
    components: {
        ComTable,
        AddInstance,
        SelectInput,
        ImportInstance
    }
})
export default class ModelManage extends Vue {
    loading: boolean = false
    modelList: Array<any> = []
    treeList: Array<any> = []
    propertyList: Array<any> = []
    instanceList: Array<any> = []
    columns: Array<TableData> = []
    currentModel: string = ''
    pagination: Pagination = {
        current: 1,
        count: 0,
        limit: 20
    }
    tableLoading: boolean = false
    selectedInstances: Array<any> = []
    search: string = ''
    pageOccupiedHeight: number = 246
    groupList: Array<any> = []
    currentNode: any = {}
    condition: any = null
    userList: Array<any> = []

    get atrrList() {
        return this.propertyList.filter(item => item.attr_id !== 'organization').map(item => {
            if (item.attr_type === 'bool') {
                item.option = [
                    { name: '是', id: true },
                    { name: '否', id: false }
                ]
            }
            return item
        })
    }

    get classifyId() {
        return this.$route.name
    }

    get slotColumns() {
        return this.columns.filter(item => item.scopedSlots && item.scopedSlots !== 'operation')
    }

    async mounted() {
        this.loading = true
        await this.getAllModelList()
        Promise.all([this.getGroups(), this.getUserList(), this.getModelAttrList(), this.getInstanceList('init')]).finally(() => {
            this.loading = false
        })
    }

    // 导出资产
    exportInst(list) {
        if (!this.$BtnPermission({
            id: this.$route.name,
            type: `${this.classifyId}_export`
        })) {
            return false
        }
        const params = {
            id: this.currentModel,
            body: list.map(item => item._id)
        }
        this.$api.AssetData.exportInst(params).then((res) => {
            const blob = new Blob([res], { type: '.xlsx' })
            // 通过创建a标签实现
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            // 对下载的文件命名
            link.download = `${this.currentModel}资产列表.xlsx`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        })
    }
    async getUserList() {
        const { result, message, data } = await this.$api.UserManageMain.getAllUsers()
        if (!result) {
            return this.$error(message)
        }
        this.userList = data.map(item => {
            return {
                name: item.lastName,
                id: item.username
            }
        })
    }
    changeFeild(condition) {
        this.condition = condition
        this.getInstanceList()
    }
    addResource(mode, row = {}) {
        if (!this.$BtnPermission({
            id: this.$route.name,
            type: `${this.classifyId}_create`
        })) {
            return false
        }
        if (mode === 'import') {
            const importInstance: any = this.$refs.importInstance
            importInstance.showDialog()
            return
        }
        const addInstance: any = this.$refs.addInstance
        addInstance.showDialog({
            mode,
            row,
            propertyList: this.propertyList
        })
    }
    updateInstanceList() {
        this.pagination.current = 1
        this.getInstanceList()
    }
    getShowValue(field, tex) {
        return getAssetAttrValue(field, tex, {
            groupList: this.groupList,
            userList: this.userList
        })
    }
    checkDetail(row) {
        this.$router.push({
            name: 'AssetDetail',
            query: {
                fromPage: this.classifyId,
                inst_name: row.inst_name || row.biz_name || '--',
                modelId: this.currentModel,
                instId: row._id,
                groupId: this.currentNode.id
            }
        })
    }
    handleSelect(selections) {
        this.selectedInstances = selections
    }
    selectGroup(node, row) {
        this.currentNode = { ...node, level: row.level }
        this.pagination.current = 1
        this.getInstanceList()
    }
    handleTabClick(tab, event) {
        this.pagination.current = 1
        this.loading = true
        Promise.all([this.getModelAttrList(), this.getInstanceList('init')]).finally(() => {
            this.loading = false
        })
    }
    async getAllModelList() {
        const res = await this.$api.ModelManage.getModel()
        const { result, message, data } = res
        if (!result) {
            this.modelList = []
            return this.$error(message)
        }
        this.modelList = data.filter(item => item.classification_id === this.classifyId)
        this.currentModel = this.modelList[0]?.model_id || ''
    }
    async getGroups() {
        const res = await this.$api.GroupManage.getGroups()
        const { result, message, data } = res
        if (!result) {
            return this.$error(message)
        }
        this.treeList = data
        this.currentNode = {
            ...data[0],
            level: 1
        }
        this.groupList = this.convertArray(data)
        this.$nextTick(() => {
            const groupTree: any = this.$refs.groupTree
            groupTree.setCurrentKey(data[0]?.id || '')
        })
    }
    convertArray(arr) {
        const result = []
        arr.forEach(item => {
            const newItem = {
                value: item.id,
                label: item.name
            }
            if (item.subGroups && !!item.subGroups.length) {
                newItem.children = this.convertArray(item.subGroups)
            }
            result.push(newItem)
        })
        return result
    }
    async getModelAttrList() {
        const params = {
            id: this.currentModel
        }
        const { result, message, data } = await this.$api.ModelManage.getModelAttrList(params)
        if (!result) {
            return this.$error(message)
        }
        this.propertyList = data
        const operateColumn = {
            label: '操作',
            key: 'operation',
            align: 'left',
            width: '140px',
            fixed: 'right',
            scopedSlots: 'operation'
        }
        const propertyList = this.$copy(this.propertyList)
        propertyList.forEach(item => {
            item.key = item.attr_id
            item.label = item.attr_name
            item.minWidth = '100px'
            item.align = 'left'
            item.scopedSlots = item.attr_id
        })
        this.columns = [
            {
                type: 'selection',
                fixed: true
            },
            ...propertyList,
            operateColumn
        ]
        this.$refs.comTable?.updateColumns(this.columns)
    }
    async getInstanceList(type?) {
        this.tableLoading = type !== 'init'
        try {
            const params = this.getParams()
            const { result, message, data } = await this.$api.AssetData.getInstanceList(params)
            if (!result) {
                return this.$error(message)
            }
            this.instanceList = data.insts
            this.pagination.count = data.count
        } finally {
            this.tableLoading = false
        }
    }
    getParams() {
        const params = {
            query_list: [],
            page: this.pagination.current,
            page_size: this.pagination.limit,
            order: '',
            model_id: this.currentModel
        }
        const { id, level } = this.currentNode
        const groupCondition = {
            field: 'organization',
            type: 'str=',
            value: id
        }
        if (this.condition) {
            if (level !== 1) {
                params.query_list = [
                    groupCondition,
                    this.condition
                ]
            } else {
                params.query_list = [this.condition]
            }
        } else if (id && level !== 1) {
            params.query_list = [
                groupCondition
            ]
        }
        return params
    }
    // 批量删除
    deleteInstance(list) {
        if (!this.$BtnPermission({
            id: this.$route.name,
            type: `${this.classifyId}_delete`
        })) {
            return false
        }
        this.$confirm('确认要删除该资产？', '提示', {
            center: true
        }).then(() => {
            this.deleteInstanceRequest(list)
        })
    }
    async deleteInstanceRequest(list) {
        this.tableLoading = true
        const params = {
            body: list.map(item => item._id)
        }
        const { result, message } = await this.$api.AssetData.deleteInstance(params)
        if (!result) {
            this.tableLoading = false
            return this.$error(message)
        }
        this.$success('删除成功！')
        this.getInstanceList()
    }
    handlePageChange(page) {
        this.pagination.current = page
        this.getInstanceList()
    }

    handleLimitChange(size) {
        this.pagination.current = 1
        this.pagination.limit = size
        this.getInstanceList()
    }
}