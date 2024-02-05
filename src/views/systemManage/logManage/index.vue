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
    import { Pagination, TableData } from '@/common/types'
    import { LogList } from '@/common/types/systemManage/logManage.ts'
    import { TYPE_LIST, LOG_COLUMNS } from '@/common/constants/systemManage/logManage.ts'

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

        typeList = TYPE_LIST

        logList: LogList[] = [
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
            count: 0,
            limit: 20
        }

        columns: Array<TableData> = LOG_COLUMNS

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
            this.getLogsRequest()
        }
        getLogsRequest() {
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
            this.getLogsRequest()
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
