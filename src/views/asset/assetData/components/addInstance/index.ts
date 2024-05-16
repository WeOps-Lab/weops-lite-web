import { Vue, Component, Prop } from 'vue-property-decorator'
import DrawerComponent from '@/components/comDrawer/index.vue'
@Component({
    name: 'add-resource',
    components: {
        DrawerComponent
    }
})
export default class AddResource extends Vue {
    @Prop({
        type: String,
        default: () => ''
    })
    modelId: string
    @Prop({
        type: Array,
        default: () => []
    })
    groupList: Array<any>
    @Prop({
        type: Array,
        default: () => []
    })
    userList: Array<any>
    @Prop({
        type: Object,
        default: () => ({})
    })
    currentNode: any

    configInfo: any = {
        row: null,
        propertyList: [],
        inst_ids: [],
        mode: 'add'
    }
    resourcList: Array<any> = [
        {
            label: '组织信息',
            id: 'group',
            list: [{
                attr_id: 'organization',
                attr_name: '所属组织',
                attr_type: 'organization',
                is_required: true,
                checked: false
            }],
            isExpand: true
        },
        {
            label: '基础信息',
            id: 'base',
            list: [],
            isExpand: true
        }
    ]
    visible: boolean = false
    loading: boolean = false
    formData: any = {}
    rules = {}
    formDataV2 = {}
    expand: boolean = true

    get isAdd() {
        return this.configInfo.mode === 'add'
    }
    get isBatchUpdate() {
        return this.configInfo.mode === 'batchUpdate'
    }
    get saveDisabled() {
        const checkedFields = this.resourcList.reduce((pre, cur) => {
            return pre.concat(cur.list).filter(item => item.checked)
        }, [])
        if (this.isBatchUpdate && !checkedFields.length) {
            return true
        }
        return false
    }

    canEdit(tex) {
        if (this.isAdd) {
            return true
        }
        if (this.isBatchUpdate) {
            return tex.editable && tex.checked
        }
        return tex.editable
    }
    showDialog(configInfo) {
        this.visible = true
        this.configInfo = configInfo
        this.initData()
        this.formDataV2 = this.$copy(this.formData)
    }
    initData() {
        const groupProperty = this.configInfo.propertyList.find(item => item.attr_id === 'organization')
        if (!groupProperty) {
            this.configInfo.propertyList = [
                ...this.configInfo.propertyList,
                ...this.resourcList.at(0).list
            ]
        }
        this.configInfo.propertyList.forEach(item => {
            if (item.is_required) {
                this.rules[item.attr_id] = [
                    {
                        required: true,
                        message: '必填项',
                        trigger: 'blur'
                    }
                ]
            }
            const defaultVal = item.attr_type === 'bool' ? false : item.attr_type === 'organization' ? this.currentNode.id : ''
            this.$set(this.formData, item.attr_id, this.configInfo.row?.[item.attr_id] || defaultVal)
        })
        const baseInfo = this.resourcList.find(item => item.id === 'base')
        baseInfo.list = this.configInfo.propertyList.filter(item => item.attr_id !== 'organization').map(tex => ({
            ...tex,
            checked: false
        }))
    }
    beforeCloseDialog() {
        const flag = this.$compareFormData(this.formData, this.formDataV2)
        if (!flag) {
            this.$confirm('放弃将导致未保存信息丢失', '是否放弃本次操作？', {
                center: true
            }).then(() => {
                this.visible = false
            })
            return
        }
        this.visible = false
    }
    handleSubmit() {
        const addResourceForm: any = this.$refs.addResourceForm
        // 新增
        if (this.isAdd) {
            addResourceForm.validate(valid => {
                if (valid) {
                    this.createResource()
                }
            })
            return
        }
        // 批量更新
        if (this.isBatchUpdate) {
            const fields = this.resourcList.reduce((pre, cur) => {
                return pre.concat(cur.list).filter(item => item.checked).map(tex => tex.attr_id)
            }, [])
            let isError = false
            addResourceForm.validateField(fields, error => {
                if (error) {
                    isError = true
                }
            })
            if (isError) {
                return
            }
            const formData = {}
            for (const key of fields) {
                formData[key] = this.formData[key]
            }
            this.batchUpdateResource(formData)
            return
        }
        // 单个更新
        addResourceForm.validate(valid => {
            if (valid) {
                this.batchUpdateResource(this.formData)
            }
        })
    }
    async batchUpdateResource(formData) {
        this.loading = true
        try {
            const params = {
                update_data: formData,
                inst_ids: this.configInfo.inst_ids.map(item => item._id)
            }
            const { result, message } = await this.$api.AssetData.batchUpdate(params)
            if (!result) {
                return this.$error(message)
            }
            this.visible = false
            this.$success('更新资产成功！')
            this.$emit('on-success', params)
        } finally {
            this.loading = false
        }
    }
    async createResource() {
        this.loading = true
        try {
            const params = {
                model_id: this.modelId,
                instance_info: this.formData
            }
            const { result, message } = await this.$api.AssetData.createInstance(params)
            if (!result) {
                return this.$error(message)
            }
            this.visible = false
            this.$success('新建资产成功！')
            this.$emit('on-success', params)
        } finally {
            this.loading = false
        }
    }
}
