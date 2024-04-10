<template>
    <div class="asset-model page-container" v-loading="loading">
        <el-tabs v-model="currentModel" @tab-click="handleTabClick">
            <el-tab-pane
                v-for="(item,index) in modelList"
                :key="index"
                :label="item.model_name"
                :name="item.model_id">
            </el-tab-pane>
        </el-tabs>
        <div class="asset-model-wrapper">
            <div class="group-tree">
                <el-tree
                    v-if="treeList.length"
                    empty-text="暂无数据"
                    ref="groupTree"
                    :data="treeList"
                    default-expand-all
                    :expand-on-click-node="false"
                    highlight-current
                    :props="{ children: 'subGroups', label: 'name' }"
                    node-key="id"
                    @node-click="selectGroup">
                    <!-- <span slot-scope="{ data }">
                        <span>{{ data.name }}</span>
                    </span> -->
                </el-tree>
                <el-empty v-else class="empty" :image-size="50"></el-empty>
            </div>
            <div class="instance-list">
                <div class="operate-box">
                    <div class="operate-box-left">
                        <el-dropdown>
                            <el-button
                                size="small"
                                type="primary">
                                新建
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="addResource('add')">手动创建</el-dropdown-item>
                                <el-dropdown-item v-if="false">批量导入</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <el-dropdown class="mr10 ml10">
                            <el-button size="small">
                                操作
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :disabled="!selectedInstances.length" @click.native="deleteInstance">批量删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <el-dropdown v-if="false">
                            <el-button size="small">
                                导出
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>导出全部</el-dropdown-item>
                                <el-dropdown-item>导出所选</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div class="operate-box-right">
                        <el-input
                            clearable
                            style="width: 300px;"
                            placeholder="请输入搜索关键字"
                            suffix-icon="el-icon-search"
                            size="small"
                            v-model="search"
                        >
                        </el-input>
                    </div>
                </div>
                <com-table
                    v-loading="tableLoading"
                    ref="comTable"
                    :data="instanceList"
                    :columns="columns"
                    :pagination="pagination"
                    :height="tableMaxHeight"
                    @page-change="handlePageChange"
                    @page-limit-change="handleLimitChange"
                    @select="handleSelect"
                    @select-all="handleSelect"
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
                            @click="checkDetail(row)">
                            详情
                        </el-button>
                    </template>
                    <template v-for="field in slotColumns" :slot="field.scopedSlots" slot-scope="{ row }">
                        <div :key="field.key">
                            <span v-if="field.attr_type === 'enum'">{{ showEnumName(field, row) }}</span>
                            <el-tag v-else :type="row[field.key] ? 'success' : ''">{{row[field.key] ? '是' : '否'}}</el-tag>
                        </div>
                    </template>
                </com-table>
            </div>
        </div>
        <add-instance
            ref="addInstance"
            :model-id="currentModel"
            :group-list="groupList"
            :current-node="currentNode"
            @on-success="updateInstanceList" />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator'
    import ComTable from '@/components/comTable/index.vue'
    import { Pagination, TableData } from '@/common/types'
    import addInstance from '../components/addInstance/index.vue'
    @Component({
        components: {
            ComTable,
            addInstance
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
        pageOccupiedHeight: number = 266
        groupList: Array<any> = []
        currentNode: any = {}

        get classifyId() {
            return this.$route.name
        }

        get slotColumns() {
            return this.columns.filter(item => item.scopedSlots && item.scopedSlots !== 'operation')
        }

        async mounted() {
            this.loading = true
            await this.getAllModelList()
            Promise.all([this.getGroups(), this.getModelAttrList(), this.getInstanceList('init')]).finally(() => {
                this.loading = false
            })
        }

        addResource(mode, row = {}) {
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
        showEnumName(field, row) {
            return (field.option || []).find(item => item.id === row[field.key])?.name || '--'
        }
        checkDetail(row) {
            this.$router.push({
                name: 'AssetDetail',
                query: {
                    fromPage: this.classifyId,
                    inst_name: '10.10.10.11',
                    modelId: this.currentModel,
                    instId: row.id,
                    groupId: this.currentNode.id
                }
            })
        }
        handleSelect(selections) {
            this.selectedInstances = selections
        }
        selectGroup(node) {
            this.currentNode = node
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
            this.groupList = this.convertArray(data)
            this.$nextTick(() => {
                const groupTree:any = this.$refs.groupTree
                groupTree.setCurrentKey(data[0]?.id || '')
                this.currentNode = data[0]
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
                if (['enum', 'bool'].includes(item.attr_type)) {
                    item.scopedSlots = item.attr_id
                }
            })
            this.columns = [
                {
                    type: 'selection'
                },
                ...propertyList,
                operateColumn
            ]
            this.$refs.comTable?.updateColumns(this.columns)
        }
        async getInstanceList(type?) {
            this.tableLoading = type !== 'init'
            try {
                const params = {
                    query_list: [],
                    page: this.pagination.current,
                    page_size: this.pagination.limit,
                    order: '',
                    model_id: this.currentModel
                }
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
        // 批量删除
        async deleteInstance() {
            this.tableLoading = true
            const params = JSON.stringify(this.selectedInstances.map(item => item.id))
            const { result, message } = await this.$api.AssetData.deleteInstance(params)
            if (!result) {
                this.tableLoading = false
                return this.$error(message)
            }
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
</script>

<style lang="scss" scoped>
.asset-model {
    .asset-model-wrapper {
        display: flex;
    }

    .instance-list {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        overflow: scroll;
        flex-flow: column;
        background: #fff;
    }

    .group-tree {
        width: 250px;
        background: #fff;
        border: 1px solid #edeff3;
        margin-right: 10px;
        padding: 10px;
        overflow: scroll;
        height: calc(100vh - 150px);
    }

    /* stylelint-disable selector-class-pattern */
    /deep/ .el-tree-node__label {
        font-size: 12px;
    }
}
</style>
