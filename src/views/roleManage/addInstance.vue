<template>
    <bk-dialog
        :position="{
            top: 50
        }"
        v-model="visible"
        :width="800"
        theme="primary"
        :mask-close="false"
        header-position="left"
        title="新增实例"
        @confirm="confirm">
        <div class="content-box">
            <div class="table-box">
                <bk-input
                    :clearable="true"
                    v-model="searchValue"
                    :right-icon="'bk-icon icon-search'"
                    placeholder="请输入名称进行实例搜索"
                    @enter="getList"
                    @clear="getList">
                </bk-input>
                <com-table
                    class="mt20"
                    v-bkloading="{ isLoading: tableLoading }"
                    ref="comTable"
                    :data="tableData"
                    :columns="columns"
                    :pagination="pagination"
                    @select-all="selectAllTableData"
                    @select="selectTableData"
                    @page-change="handlePageChange"
                    @page-limit-change="limitChange">
                </com-table>
            </div>
            <div class="result-box">
                <div class="title">结果预览</div>
                <div class="info">
                    <div class="info-left">
                        <span>已选择</span>
                        <span style="color: #659FFD;">{{selectList.length}}</span>
                        <span>项实例</span>
                    </div>
                    <div class="info-right" @click="clearSelect">清空</div>
                </div>
                <div class="list">
                    <div
                        v-bk-overflow-tips
                        :class="['list-item', index !== selectList.length - 1 && 'list-item-border-bottom', 'hide-text']"
                        v-for="(item, index) in selectList"
                        :key="item.id"
                    >
                        <span class="value">{{item[instanceShowField]}}</span>
                        <i class="cw-icon weops-close" @click="removeSelect(item, index)"></i>
                    </div>
                </div>
            </div>
        </div>
    </bk-dialog>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from 'vue-property-decorator'
    import ComTable from '@/components/comTable.vue'
    @Component({
        components: {
            ComTable
        }
    })
    export default class addInstance extends Vue {
        @Prop({
            type: Array,
            default: () => []
        })
        instanceColumns: any[]
        @Prop({
            type: String,
            default: () => ''
        })
        instanceType: string
        @Prop({
            type: String,
            default: () => ''
        })
        modelId: string
        @Prop({
            type: String,
            default: () => ''
        })
        instanceShowField: string
        visible: boolean = false
        tableData: any[] = []
        tableLoading: boolean = false
        columns = []
        pagination: {
            current: number,
            count: number,
            limit: number,
            small: boolean
        } = {
            current: 1,
            count: 100,
            limit: 20,
            small: true
        }
        selectList: any[] = []
        searchValue: string = ''
        show(data) {
            this.visible = true
            this.searchValue = ''
            this.updateColumns()
            this.getList()
            this.selectList = data
        }
        confirm() {
            this.$emit('change-list', this.selectList)
        }
        updateColumns() {
            this.$nextTick(() => {
                const comTable: any = this.$refs.comTable
                comTable.updateColumns(this.instanceColumns)
            })
        }
        selectTableData(selection, row) {
            if (!this.selectList.map(item => item.id).includes(row.id)) {
                this.selectList.push(row)
            } else {
                this.selectList.splice(this.selectList.findIndex(item => item.id === row.id), 1)
            }
        }
        selectAllTableData(selection) {
            if (selection.length === 0) {
                this.selectList = this.selectList.filter(item => !this.tableData.some(tex => item.id === tex.id))
            } else {
                selection.forEach(item => {
                    if (!this.selectList.map(item => item.id).includes(item.id)) {
                        this.selectList.push(item)
                    }
                })
            }
        }
        getList() {
            this.tableLoading = true
            this.$api.RoleManageMain.getInstances({
                page: this.pagination.current,
                page_size: this.pagination.limit,
                search: this.searchValue,
                instance_type: this.instanceType,
                bk_obj_id: this.modelId
            }).then(res => {
                const { result, data } = res
                if (!result) {
                    return false
                }
                this.tableData = data.items
                this.pagination.count = data.count
                this.$nextTick(() => {
                    if (this.selectList.length > 0) {
                        this.tableData.forEach(item => {
                            const target = this.selectList.find(tex => tex.id === item.id)
                            if (target) {
                                const comTable: any = this.$refs.comTable
                                comTable.toggleRowSelection(item, true)
                            }
                        })
                    }
                })
            }).finally(() => {
                this.tableLoading = false
            })
        }
        handlePageChange(page) {
            this.pagination.current = page
            this.getList()
        }
        // 当每页展示条数发生变化时触发
        limitChange(size) {
            this.pagination.current = 1
            this.pagination.limit = size
            this.getList()
        }
        clearSelect() {
            this.selectList = []
            const comTable: any = this.$refs.comTable
            comTable.clearSelection()
        }
        removeSelect(item, index) {
            this.selectList.splice(index, 1)
            this.$nextTick(() => {
                this.tableData.forEach(tex => {
                    if (tex.id === item.id) {
                        const comTable: any = this.$refs.comTable
                        comTable.toggleRowSelection(tex, false)
                    }
                })
            })
        }
    }
</script>

<style lang="scss" scoped>
    /deep/.bk-table-body-wrapper {
        max-height: 268px !important;
        overflow-y: scroll;
    }
    .content-box {
        height: 450px;
        border: 1px solid #c0c4cc;
        display: flex;
        .table-box {
            flex: 1;
            width: 0;
            padding: 12px;
        }
        .result-box {
            width: 250px;
            border-left: 1px solid #DCDEE5;
            border-bottom: none;
            background-color: #F5F7FA;
            padding: 12px 24px;
            display: flex;
            flex-direction: column;
            .list {
                flex: 1;
                height: 0;
                overflow: auto;
                .list-item {
                    height: 32px;
                    line-height: 32px;
                    background-color: #fff;
                    padding: 0 25px 0 10px;
                    position: relative;
                    .value {
                        font-size: 12px;
                        color: #63656E;
                    }
                    .weops-close {
                        position: absolute;
                        top: 50%;
                        right: 10px;
                        transform: translateY(-50%);
                        display: none;
                        cursor: pointer;
                    }
                }
                .list-item:hover {
                    background-color: #E1ECFF;
                    .weops-close {
                        display: block;
                    }
                }
                .list-item-border-bottom {
                    border-bottom: 1px solid #F6F8FA;
                }
            }
            .title {
                color: #313238;
                margin-bottom: 16px;
            }
            .info {
                height: 22px;
                line-height: 22px;
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                margin-bottom: 10px;
                .info-left {
                    color: #63656E;
                }
                .info-right {
                    color: #3A84FF;
                    cursor: pointer;
                }
            }
        }
    }
</style>
