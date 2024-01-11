<!--操作日志-->
<template>
    <div id="sys-log">
        <page-explanation
            title="操作日志"
            content="展示所有增删改等历史记录，您可以根据操作者/操作类型/时间等条件进行查询" />
        <div class="search-box">
            <span>操作者</span>
            <el-input
                clearable
                size="small"
                v-model="params.operator"
                style="width: 150px;"
                placeholder="请输入操作者"
                @change="searchDataByUser">
            </el-input>
            <span>操作类型</span>
            <el-select
                size="small"
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
                size="small"
                v-model="params.dateTime"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="getDate">
            </el-date-picker>
            <el-button size="small" :disabled="isLoading" @click="resetSearch">重置</el-button>
        </div>
        <div class="test-dom" v-bkloading="{ isLoading: isLoading, zIndex: 10 }">
            <el-table
                :data="logList"
                :size="size"
                :max-height="maxHeight"
                ref="table"
                style="background-color: #ffffff;"
            >
                <el-table-column label="操作者" prop="operator" width="200"></el-table-column>
                <el-table-column label="操作对象" prop="operate_obj" width="200"></el-table-column>
                <el-table-column label="操作类型" prop="operate_type" width="200">
                    <template slot-scope="props">
                        <span>{{ typeMap[props.row.operate_type]}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作时间" prop="created_at" width="200"></el-table-column>
                <el-table-column
                    :show-overflow-tooltip="true"
                    label="概要"
                    prop="operate_summary">
                </el-table-column>
            </el-table>
            <div class="pager">
                <el-pagination
                    background
                    @size-change="handleLimitChange"
                    @current-change="handlePageChange"
                    :current-page="1"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="100"
                    layout="total, sizes, next, pager, prev"
                    :total="pagination.count">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        bkTable, bkTableColumn,
        bkButton, bkSelect, bkOption,
        bkDatePicker
    } from 'bk-magic-vue'
    import _ from 'lodash'
    import { Vue, Component } from 'vue-property-decorator'
    import PageExplanation from '@/components/pageExplanation.vue'
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
            bkTable,
            bkTableColumn,
            bkButton,
            bkSelect,
            bkOption,
            bkDatePicker,
            PageExplanation
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
            { id: 'upload', name: '上传' }
        ]

        typeMap = {
            add: '增加',
            modify: '修改',
            exec: '执行',
            delete: '删除',
            download: '下载',
            upload: '上传',
            login: '登录'
        };

        size: string = 'small'

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
        maxHeight: string|number = ''

        created() {
            const PAGE_OCCUPIED_HEIGHT = 230
            this.maxHeight = window.innerHeight - PAGE_OCCUPIED_HEIGHT
            window.onresize = () => {
                this.maxHeight = window.innerHeight - PAGE_OCCUPIED_HEIGHT
            }
        }

        mounted() {
            this.getLogs()
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
                this.logList = res.data.items
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
                    this.logList = res.data.items
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
            this.params.create_time_after = date[0]
            this.params.create_time_before = date[1]
            this.getLogs()
        }
    }
</script>

<style lang="scss">
#sys-log {
    width: 100%;
    height: calc(100vh - 95px);
    box-sizing: border-box;
    overflow: hidden;

    .search-box {
        display: flex;
        align-items: center;
        justify-content: left;

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
    .test-dom {
        margin-top: 10px;
        border: 1px solid #dfe0e5;
    }
    .pager {
        padding: 15px;
        background-color: rgb(255, 255, 255);
        .btn-prev, .el-pager, .btn-next {
            float: right;
        }
    }
}
</style>
