<template>
    <drawer-component
        title="新建关联"
        :size="640"
        :visible="visible"
        destroy-on-close
        custom-class="common-dialog-wrapper"
        :before-close="beforeCloseDialog"
        @changeVisible="changeVisible">
        <div slot="content" class="content-box common-dialog-wrapper-main" v-loading="relateLoading">
            <div class="operate-item mb20">
                <span class="label">关联列表</span>
                <el-select
                    class="field"
                    size="small"
                    filterable
                    v-model="relation"
                    placeholder="请选择"
                    :loading="relateLoading"
                    @change="searchRelationData">
                    <el-option
                        v-for="(item,index) in relationData"
                        :key="index"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="operate-item mb20">
                <span class="label">条件筛选</span>
                <selectInput :property-list="atrrList" @change="changeFeild" />
            </div>
            <com-table
                v-loading="tableLoading"
                ref="comTable"
                :data="instanceList"
                :columns="columns"
                :max-height="tableMaxHeight"
                :pagination="pagination"
                @page-change="handlePageChange"
                @page-limit-change="handleLimitChange"
            >
                <template slot="operation" slot-scope="{ row }">
                    <el-button
                        v-permission="{
                            id: $route.name,
                            type: 'SysRole_users_manage'
                        }"
                        class="mr10"
                        type="text"
                        size="small"
                        :disabled="row.isRelated"
                        @click="handleRelate(row)"
                    >
                        关联
                    </el-button>
                </template>
                <template v-for="field in slotColumns" :slot="field.scopedSlots" slot-scope="{ row }">
                    <div :key="field.key">
                        <el-tag
                            v-if="field.attr_type === 'bool'"
                            :type="row[field.key] ? 'success' : ''">
                            {{getShowValue(field, row)}}
                        </el-tag>
                        <span v-else>{{ getShowValue(field, row) }}</span>
                    </div>
                </template>
            </com-table>
        </div>
        <div slot="footer">
            <el-button
                size="small"
                @click="beforeCloseDialog">
                关闭
            </el-button>
        </div>
    </drawer-component>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator'
    import DrawerComponent from '@/components/comDrawer/index.vue'
    import ComTable from '@/components/comTable/index.vue'
    import SelectInput from '../selectInput/index.vue'
    import { Pagination, TableData } from '@/common/types'
    @Component({
        components: {
            DrawerComponent,
            ComTable,
            SelectInput
        }
    })
    export default class AddRelation extends Vue {
    @Prop({
        type: Array,
        default: () => []
    })
    columns: Array<TableData>

    @Prop({
        type: Array,
        default: () => []
    })
    slotColumns: Array<TableData>

    @Prop({
        type: Array,
        default: () => []
    })
    propertyList: Array<any>

    @Prop({
        type: Array,
        default: () => []
    })
    connectTypeList: Array<any>

    @Prop({
        type: Array,
        default: () => []
    })
    modelInfoList: Array<any>

    @Prop({
        type: Array,
        default: () => []
    })
    groupList: Array<any>

    pagination: Pagination = {
        current: 1,
        count: 0,
        limit: 20
    }
    instanceList: Array<any> = []
    tableLoading: boolean = false
    loading: boolean = false
    condition: any = null
    visible: boolean = false
    pageOccupiedHeight: number = 320
    relation: string = ''
    relateLoading: boolean = false
    relationData: Array<any> = []
    relatedList: Array<any> = []

    get atrrList() {
        return this.propertyList.filter(item => item.attr_id !== 'organization').map(item => {
            if (item.attr_type === 'bool') {
                item.option = [
                    {name: '是', id: true},
                    {name: '否', id: false}
                ]
            }
            return item
        })
    }

    show(relatedList) {
        this.visible = true
        this.relatedList = relatedList
        this.getModelAssoList()
    }
    searchRelationData() {
        this.pagination.current = 1
        this.getInstanceList()
    }
    showModelName(id) {
        return this.modelInfoList.find(item => item.model_id === id)?.model_name || '--'
    }
    showConnectType(id, key) {
        return this.connectTypeList.find(item => item.id === id)?.[key] || '--'
    }
    getShowValue(field, tex) {
        let str = '--'
        switch (field.attr_type) {
            case 'organization':
                str = this.findLabelByValue(this.groupList, tex[field.key])
                break
            case 'enum':
                str = (field.option || []).find(item => item.id === tex[field.key])?.name || '--'
                break
            case 'bool':
                str = tex[field.key] ? '是' : '否'
                break
            default:
                str = tex[field.key] || '--'
                break
        }
        return str
    }
    async handleRelate(row) {
        const relation = JSON.parse(this.relation)
        const params = {
            model_asst_id: relation.model_asst_id,
            src_model_id: relation.src_model_id,
            dst_model_id: relation.dst_model_id,
            asst_id: relation.asst_id
        }
        if (relation.dst_model_id === this.$route.query.modelId) {
            params.dst_inst_id = this.$route.query.instId
            params.src_inst_id = row._id
        } else {
            params.dst_inst_id = row._id
            params.src_inst_id = this.$route.query.instId
        }
        const { result, message } = await this.$api.AssetData.createInstAsso(params)
        if (!result) {
            return this.$error(message)
        }
        this.$success('已成功关联')
        this.$emit('refreshList')
        this.getInstanceList()
    }
    async getModelAssoList() {
        this.relateLoading = true
        try {
            const params = {
                id: this.$route.query.modelId
            }
            const { result, message, data } = await this.$api.ModelManage.getModelAssoList(params)
            if (!result) {
                return this.$error(message)
            }
            this.relationData = data.map(item => {
                return {
                    name: `${this.showConnectType(item.asst_id, 'label')}-${this.showModelName(item.dst_model_id)}`,
                    id: JSON.stringify(item)
                }
            })
            this.relation = JSON.stringify(data[0]) || ''
            if (!this.relation.length) {
                return
            }
            this.getInstanceList()
        } finally {
            this.relateLoading = false
        }
    }
    findLabelByValue(arr, value) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].value === value) {
            return arr[i].label
          }
          if (arr[i].children && arr[i].children.length) {
            const label = this.findLabelByValue(arr[i].children, value)
            if (label) {
              return label
            }
          }
        }
        return '--'
    }

    changeFeild(condition) {
        this.pagination.current = 1
        this.condition = condition
        this.getInstanceList()
    }
    async getInstanceList(type?) {
        this.tableLoading = type !== 'init'
        try {
            const params = this.getParams()
            const { result, message, data } = await this.$api.AssetData.getInstanceList(params)
            if (!result) {
                return this.$error(message)
            }
            this.instanceList = data.insts.map(item => {
                return {
                    ...item,
                    isRelated: !!this.relatedList.find(rel => rel.dst_inst_id === item._id)
                }
            })
            this.pagination.count = data.count
        } finally {
            this.tableLoading = false
        }
    }
    getParams() {
        const relation = JSON.parse(this.relation)
        const params = {
            query_list: [],
            page: this.pagination.current,
            page_size: this.pagination.limit,
            order: '',
            model_id: relation.dst_model_id || ''
        }
        if (this.condition) {
            params.query_list = [this.condition]
        }
        return params
    }
    beforeCloseDialog() {
        this.visible = false
    }
    changeVisible(val) {
        this.visible = val
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
</script>

<style scoped lang="scss">
.operate-item {
    display: flex;
    align-items: center;
    .label {
        margin-right: 10px;
    }
}
</style>
