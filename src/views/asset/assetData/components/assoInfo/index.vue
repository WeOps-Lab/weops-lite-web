<template>
    <div class="asso-info" v-loading="loading">
        <div class="operate-box">
            <div class="operate-box-left">
                <el-button
                    :type="'primary'"
                    size="small"
                    @click="addRelation">
                    新建关联
                </el-button>
                <el-button
                    size="small"
                    @click="expandAll(true)">
                    全部展开
                </el-button>
                <el-button
                    size="small"
                    @click="expandAll(false)">
                    全部收起
                </el-button>
            </div>
        </div>
        <collapse :collapse-list="resourcList">
            <template slot="content" slot-scope="{ collRow }">
                <com-table
                    ref="comTable"
                    :data="collRow.list"
                    :columns="columns"
                    :max-height="tableMaxHeight"
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
                            @click="cancelRelate(row)"
                        >
                            取消关联
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
            </template>
        </collapse>
        <add-relation
            ref="addRelation"
            :property-list="propertyList"
            :connect-type-list="connectTypeList"
            :model-info-list="modelInfoList"
            :group-list="groupList"
            :columns="columns"
            :slot-columns="slotColumns"
            @refreshList="initData"
        />
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator'
    import ComTable from '@/components/comTable/index.vue'
    import { Pagination, TableData } from '@/common/types'
    import Collapse from '@/components/collapse/index.vue'
    import AddRelation from '../addRelation/index.vue'
    @Component({
        name: 'asso-info',
        components: {
            ComTable,
            Collapse,
            AddRelation
        }
    })
    export default class AssoInfo extends Vue {
    @Prop({
        type: Array,
        default: () => []
    })
    groupList: Array<any>
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
    propertyList: Array<any>

    resourcList: Array<any> = []
    loading: boolean = false
    columns: Array<TableData> = []
    assoData: Array<any> = []
    pagination: Pagination = {
        current: 1,
        count: 0,
        limit: 20
    }
    tableMaxHeight: number = 300
    relatedList: Array<any> = []

    get slotColumns() {
        return this.columns.filter(item => item.scopedSlots && item.scopedSlots !== 'operation')
    }

    mounted() {
        this.initData()
    }

    addRelation() {
        const addRelation: any = this.$refs.addRelation
        addRelation.show(this.relatedList)
    }
    cancelRelate(row) {
        this.$confirm('确定取消关联吗？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
        }).then(async() => {
            try {
                const res = await this.$api.AssetData.deleteInstAsso({
                    id: row.relatedId
                })
                if (!res.result) {
                    return this.$error(res.message)
                } else {
                    this.$success('已成功取消关联!')
                    this.initData()
                }
                return true
            } catch (e) {
                return false
            }
        })
    }
    expandAll(bool) {
        this.resourcList.forEach(item => {
            item.isExpand = bool
        })
    }
    async getRelatedList() {
        const { instId, modelId } = this.$route.query
        const params = {
            dst_inst_id: instId,
            dst_model_id: modelId
        }
        const { result, message, data } = await this.$api.AssetData.getRelatedList(params)
        if (!result) {
            return this.$error(message)
        }
        this.relatedList = data
    }
    async getAssoInstList() {
        const { instId, modelId } = this.$route.query
        const params = {
            inst_id: instId,
            model_id: modelId
        }
        const { result, message, data } = await this.$api.AssetData.getAssoInstList(params)
        if (!result) {
            return this.$error(message)
        }
        this.assoData = data
    }
    initData() {
        this.loading = true
        Promise.all([this.getRelatedList(), this.getAssoInstList()]).finally(() => {
            this.loading = false
            this.columns = this.getColumns()
            this.resourcList = this.assoData.filter(row => row.inst_list?.length).map((item, index) => {
                return {
                    label: this.showConnectName(item),
                    id: index,
                    list: item.inst_list.map(inst => {
                        return {
                            relatedId: this.relatedList.find(relate => relate.dst_inst_id === inst._id)?._id || '',
                            ...inst
                        }
                    }),
                    isExpand: true
                }
            })
        })
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
    getColumns() {
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
            if (['enum', 'bool', 'organization'].includes(item.attr_type)) {
                item.scopedSlots = item.attr_id
            }
        })
        return [
            ...propertyList,
            operateColumn
        ]
    }
    showModelName(id) {
        return this.modelInfoList.find(item => item.model_id === id)?.model_name || '--'
    }
    showConnectType(id, key) {
        return this.connectTypeList.find(item => item.id === id)?.[key] || '--'
    }
    showConnectName(row) {
        const sourceName = this.showModelName(row.src_model_id)
        const targetName = this.showModelName(row.dst_model_id)
        const relation = this.showConnectType(row.asst_id, 'name')
        return `${sourceName} ${relation} ${targetName}`
    }
}
</script>

<style scoped lang="scss">
.asso-info {
    //
}
</style>
