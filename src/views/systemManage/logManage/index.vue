<!--操作日志-->
<template>
    <div class="sys-log">
        <page-explanation
            title="操作日志"
            content="展示所有增删改等历史记录，您可以根据操作者/操作类型/时间等条件进行查询" />
        <div class="manage-wrapper">
            <div class="search-box">
                <span>操作者</span>
                <el-input
                    clearable
                    v-model="params.operator"
                    style="width: 150px;"
                    placeholder="请输入操作者"
                    @change="searchDataByUser">
                </el-input>
                <span>操作类型</span>
                <el-select
                    v-model="params.operate_type"
                    style="width: 150px;background-color: #ffffff;"
                    clearable placeholder="请选择操作类型"
                    @change="searchDataByType">
                    <el-option
                        v-for="item in typeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <span>时间范围</span>
                <el-date-picker
                    class="mr16"
                    v-model="params.dateTime"
                    type="datetimerange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="getDate">
                </el-date-picker>
                <el-button :disabled="isLoading" @click="resetSearch">重置</el-button>
            </div>
            <div class="test-dom" v-loading="isLoading">
                <com-table
                    v-loading="tableLoading"
                    ref="table"
                    :data="logList"
                    :columns="columns"
                    :pagination="pagination"
                    :max-height="tableMaxHeight"
                    @page-change="handlePageChange"
                    @page-limit-change="handleLimitChange"
                >
                    <template slot="operate_type" slot-scope="{ row }">
                        <span>{{ getOperateType(row.operate_type)}}</span>
                    </template>
                </com-table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import _ from 'lodash'
    import { Vue, Component } from 'vue-property-decorator'
    import PageExplanation from '@/components/pageExplanation.vue'
    import ComTable from '@/components/comTable.vue'
    import moment from 'moment'
    interface Log {
        operator: string;
        operate_obj: string;
        operate_type: string;
        created_at: string;
        operate_summary: string;
    }

    interface Pagination {
        current: number;
        count: number;
        limit: number;
    }
    @Component({
        name: 'log-manage',
        components: {
            PageExplanation,
            ComTable
        }
    })
    export default class LogManage extends Vue {
        isLoading: boolean = false

        params = {
            operator: '',
            operate_type: '',
            create_time_after: '',
            create_time_before: '',
            dateTime: [],
            page: 1,
            page_size: 10
        }

        typeList = [
            { id: 'add', name: '增加' },
            { id: 'modify', name: '修改' },
            { id: 'exec', name: '执行' },
            { id: 'delete', name: '删除' },
            { id: 'download', name: '下载' },
            { id: 'upload', name: '上传' },
            { id: 'login', name: '登录' }
        ]

        logList: Log[] = [
            {
                operator: 'test',
                operate_obj: '',
                operate_type: '',
                created_at: '',
                operate_summary: ''
            }
        ]

        pagination: Pagination = {
            current: 1,
            count: 10,
            limit: 10
        }

        columns = [
            {
                label: '操作者',
                key: 'operator',
                align: 'left',
                minWidth: '100px'
            },
            {
                label: '操作对象',
                key: 'operate_obj',
                align: 'left',
                minWidth: '200px'
            },
            {
                label: '操作类型',
                key: 'operate_type',
                align: 'left',
                minWidth: '100px',
                scopedSlots: 'operate_type'
            },
            {
                label: '操作时间',
                key: 'created_at',
                align: 'left',
                minWidth: '140'
            },
            {
                label: '概要',
                key: 'operate_summary',
                align: 'left',
                minWidth: '200px'
            }
        ]

        tableLoading: boolean = false

        mounted() {
            this.getLogs()
        }
        getOperateType(id) {
            return this.typeList.find(item => item.id === id)?.name || '--'
        }
        searchDataByUser() {
            this.pagination.current = 1
            this.getRemote()
        }
        getRemote = _.debounce(function() {
            this.getLogs()
        }, 1000)

        searchDataByType() {
            this.pagination.current = 1
            this.getLogs()
        }
        getLogs() {
            this.params.page = this.pagination.current
            this.params.page_size = this.pagination.limit
            this.isLoading = true
            this.$api.Server.getLogs(this.params).then(res => {
                if (!res.result) {
                    this.$error(res.message)
                    this.logList = []
                    return false
                }
                this.logList = res.data.data
                this.pagination.count = res.data.count
            }).finally(() => {
                this.isLoading = false
            })
        }
        resetSearch() {
            this.params = {
                operator: '',
                operate_type: '',
                create_time_after: '',
                create_time_before: '',
                page: 1,
                page_size: 10,
                dateTime: []
            }
            this.isLoading = true
            this.$api.Server.getLogs(this.params).then(res => {
                this.isLoading = false
                if (res.result) {
                    this.logList = res.data.data
                }
            })
        }
        handlePageChange(page) {
            this.pagination.current = page
            this.getLogs()
        }
        handleLimitChange(limit) {
            this.pagination.limit = limit
            this.getLogs()
        }
        getDate(date) {
            this.pagination.current = 1
            if (!date?.length) {
                this.params.create_time_after = ''
                this.params.create_time_before = ''
            } else {
                this.params.create_time_after = moment(date[0]).format('YYYY-MM-DD HH:mm:ss')
                this.params.create_time_before = moment(date[1]).format('YYYY-MM-DD HH:mm:ss')
            }
            this.getLogs()
        }
    }
</script>

<style lang="scss">
.sys-log {
    .search-box {
        display: flex;
        align-items: center;
        justify-content: left;
        margin-bottom: 20px;

        .mr16 {
            margin-right: 16px;
        }

        .mr8 {
            margin-right: 8px;
        }

        & > span {
            display: inline-block;
            margin: 0 8px 0 16px;
        }

        & > span:nth-of-type(1) {
            margin-left: 0;
        }
    }
}
</style>
