/*
 * @comopnent 表格组件
 * @param { Array } settingsFields:[],
*/
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Pagination, TableData } from '@/common/types'

@Component({
    name: 'table-component'
})
export default class TableComponent extends Vue {
    @Prop({
        type: Array,
        default: () => [],
        required: true
    })
    columns: Array<TableData>
    @Prop({
        type: Boolean,
        default: false
    })
    noneBorder: boolean
    @Prop({
        type: Array,
        default: () => []
    })
    settingsFields: Pagination
    @Prop({
        type: Boolean,
        default: () => false
    })
    needNextTick: boolean
    @Prop({
        type: String,
        default: () => 'small'
    })
    size: string
    @Prop({
        type: Boolean,
        default: () => false
    })
    defaultExpandAll: boolean
    @Prop({
        type: String,
        default: () => 'id'
    })
    rowKey: string
    @Prop({
        type: Array,
        default: () => []
    })
    expandRowKeys: any
    @Prop({
        type: Object,
        default: () => ({
            current: 1,
            count: 0,
            limit: 20
        })
    })
    pagination: any

    setting = {
        fields: [],
        selectFields: [],
        size: 'small'
    }
    topDistance: number = 0
    hasYScroll: boolean = true
    isCheckAll: boolean = false
    settingKeys: any = []

    get indeterminate() {
        return !!this.settingKeys.length && this.settingKeys.length < this.settingsFields.length
    }

    mounted() {
        this.setting.selectFields = this.columns
        this.setting.fields = this.settingsFields || []
        this.settingKeys = this.handleKeys(this.columns)
        this.handleCheckAll()
    }

    handleKeys(columns) {
        return Array.from(new Set(columns.filter(r => r.key && r.key !== 'operation').map(r => r.key)))
    }

    // 过滤字段触发方法
    columnFilterMethod(value, row, column, remote) {
        if (!remote) {
            const property = column.property
            return row[property] === value
        } else {
            return true
        }
    }
    updateColumns(columns) {
        this.setting.selectFields = columns
        this.settingKeys = this.handleKeys(columns)
        this.handleCheckAll()
    }
    updateFields(fields) {
        this.setting.fields = fields
        this.handleCheckAll()
    }
    // 勾选数据行的 Checkbox 时触发的事件
    onselect(selection, row) {
        this.$emit('select', selection, row)
    }
    // 用户手动勾选全选 Checkbox 时触发的事件
    selectAll(selection) {
        this.$emit('select-all', selection)
    }
    // 当选择项发生变化时会触发该事件
    selectChange(selection) {
        this.$emit('selection-change', selection)
    }
    // 切换表格分页时会触发的事件
    handlePageChange(page) {
        this.$emit('page-change', page)
    }
    // 切换表格每页显示条数时会触发的事件
    limitChange(limit) {
        this.$emit('page-limit-change', limit)
    }
    handleSettingChange({ fields, size }) {
        this.setting.size = size
        this.$emit('handle-setting-change', fields)
    }
    // 表格的筛选条件发生变化的时候触发
    filterChange(key) {
        this.$emit('filter-change', key)
    }
    // 表格的排序条件发生变化的时候会触发
    sortChange({ column, prop, order }) {
        this.$emit('sort-change', { column, prop, order })
    }
    cellMouseEnter(row, column, cell, event) {
        this.$emit('cell-mouse-enter', row, column, cell, event)
    }
    cellMouseLeave(row, column, cell, event) {
        this.$emit('cell-mouse-leave', row, column, cell, event)
    }
    expandChange(row, expandedRows) {
        this.$emit('expand-change', row, expandedRows)
    }
    toggleRowExpansion() {
        this.$attrs.data.forEach(item => this.$refs.table.toggleRowExpansion(item, false))
    }
    doLayout() {
        this.$refs.table.doLayout()
    }
    setSize(size) {
        this.setting.size = size
    }
    cellClick(row, column) {
        this.$emit('cell-click', row, column)
    }
    rowClick(row, event, column, rowIndex, columnIndex) {
        this.$emit('row-click', row, event, column, rowIndex, columnIndex)
    }
    toggleRowSelection(data, flag) {
        this.$refs.table.toggleRowSelection(data, flag)
    }
    clearSelection() {
        this.$refs.table.clearSelection()
    }
    hidePopover() {
        this.$refs.popverCom?.hide()
    }
    confirmPopover() {
        this.$refs.popverCom?.hide()
        const fields = this.setting.fields.filter(item => this.settingKeys.includes(item.key))
        this.$emit('handle-setting-change', fields)
    }
    handleCheckAll() {
        this.isCheckAll = this.settingKeys.length === this.setting.fields.length
    }
    changeAllCheck() {
        if (this.indeterminate || !this.settingKeys.length) {
            this.settingKeys = this.setting.fields.map(r => r.key)
        } else {
            this.settingKeys = this.setting.fields.filter(r => r.disabled).map(r => r.key)
        }
    }
    changeCheckbox() {
        this.isCheckAll = !!this.settingKeys.length && this.settingKeys.length === this.setting.fields.length
    }
}
