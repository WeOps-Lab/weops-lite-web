import _ from 'lodash'
import { Vue, Component } from 'vue-property-decorator'
import PageExplanation from '@/components/pageExplanation/index.vue'
import ComTable from '@/components/comTable/index.vue'
import moment from 'moment'
import { Pagination, TableData } from '@/common/types'
import { LogList } from '@/common/types/systemManage/logManage'
import { TYPE_LIST, LOG_COLUMNS } from '@/common/constants/systemManage/logManage'

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
