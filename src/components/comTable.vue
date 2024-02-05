<template>
    <div class="table-container" :class="{ 'border-none': noneBorder }">
        <el-table
            ref="table"
            v-bind="$attrs"
            :default-expand-all="defaultExpandAll"
            :row-key="rowKey"
            :expand-row-keys="expandRowKeys"
            @select="onselect"
            @cell-click="cellClick"
            @row-click="rowClick"
            @select-all="selectAll"
            @selection-change="selectChange"
            @sort-change="sortChange"
            @filter-change="filterChange"
            @expand-change="expandChange"
            @cell-mouse-enter="cellMouseEnter"
            @cell-mouse-leave="cellMouseLeave">
            <template v-for="column in setting.selectFields">
                <el-table-column
                    v-bind="column"
                    :key="column.type + '_opertion'"
                    v-if="['selection', 'index'].includes(column.type)">
                </el-table-column>
                <el-table-column
                    v-else
                    v-bind="column"
                    :key="column.key"
                    :show-overflow-tooltip="column.noNeedTip ? false : true"
                    :prop="column.key"
                    :column-key="column.key"
                    :filter-method="column.filters ? (value, row, col) => columnFilterMethod(value, row, col, column.filterRemote) : undefined"
                    :render-header="column.renderHeader">
                    <template slot-scope="props">
                        <template v-if="column.scopedSlots">
                            <slot :name="column.scopedSlots" :row="props.row" :colKey="column.key" :index="props.$index"></slot>
                        </template>
                        <span v-else>{{ props.row[column.key] || (props.row[column.key] === 0 ? props.row[column.key] : '--')}}</span>
                    </template>
                </el-table-column>
            </template>
            <template slot="empty">
                <slot name="empty"></slot>
            </template>
        </el-table>
        <div class="pagination_box">
            <el-pagination
                background
                :current-page.sync="pagination.current"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pagination.limit"
                layout="total, sizes, next, pager, prev"
                :total="pagination.count"
                :small="pagination.small"
                @size-change="limitChange"
                @current-change="handlePageChange">
            </el-pagination>
        </div>
        <div v-if="settingsFields && settingsFields.length > 0" class="table-content-setting">
            <el-popover
                ref="popverCom"
                trigger="click"
                width="400"
                placement="bottom-end">
                <i class="el-icon-s-tools"></i>
                <template>
                    <div class="content-setting-wrapper">
                        <h2>表格设置</h2>
                        <div class="setting-fields-checkout-group">
                            <div class="mb10">
                                <el-checkbox
                                    :indeterminate="indeterminate"
                                    v-model="isCheckAll"
                                    @change="changeAllCheck">
                                    全选
                                </el-checkbox>
                            </div>
                            <el-checkbox-group
                                v-model="settingKeys"
                                @change="changeCheckbox">
                                <el-checkbox
                                    :key="item.key"
                                    :value="item.key"
                                    :disabled="item.disabled"
                                    v-for="item in setting.fields">
                                    <span :title="item.label">{{ item.label }}</span>
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div class="content-setting-footer">
                            <el-button
                                type="primary"
                                @click="confirmPopover">
                                确定
                            </el-button>
                            <el-button
                                class="ml20"
                                @click="hidePopover">
                                取消
                            </el-button>
                        </div>
                    </div>
                </template>
            </el-popover>
        </div>
    </div>
</template>

<script lang="ts">
    /*
     * @comopnent 表格组件
     * @param { Array } settingsFields:[],
    */
    import { Component, Prop, Vue } from 'vue-property-decorator'

    @Component({
        name: 'table-component'
    })
    export default class TableComponent extends Vue {
        @Prop({
            type: Array,
            default: () => [],
            required: true
        })
        columns: any
        @Prop({
            type: Boolean,
            default: false
        })
        noneBorder: boolean
        @Prop({
            type: Array,
            default: () => []
        })
        settingsFields: any
        @Prop({
            type: Boolean,
            default: () => false
        })
        needNextTick: boolean
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
                count: 1,
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
            this.$store.commit('setResourcePage', page)
            this.$emit('page-change', page)
        }
        // 切换表格每页显示条数时会触发的事件
        limitChange(limit) {
            this.$store.commit('setResourceLimit', limit)
            this.$emit('page-limit-change', limit)
        }
        handleSettingChange({ fields, size }) {
            this.setting.size = size
            this.$store.commit('setCustomFields', fields)
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
            this.$store.commit('setCustomFields', fields)
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
</script>

<style scoped lang="scss">
/* stylelint-disable selector-class-pattern */
.table-container {
    position: relative;
    background: #fff;
    border: 1px solid #dfe0e5;
    &.border-none {
        border: none !important;
    }
    .pagination_box {
        padding: 15px;
        background-color: rgb(255, 255, 255);
        .el-pagination {
            /deep/.btn-prev, /deep/.el-pager, /deep/.btn-next {
                float: right !important;
            }
        }
    }
}

/deep/ .content-line-height {
    display: none;
}

.table-content-setting {
    position: absolute;
    right: 15px;
    top: 10px;
    z-index: 10;
}
.content-setting-wrapper {
    h2 {
        line-height: 32px;
        font-size: 16px;
        margin: 10px 0;
        color: #313238;
    }
    .setting-fields-checkout-group {
        color: #fff000;
    }
    .content-setting-footer {
        padding: 0 10px;
        margin: 30px -14px -7px;
        height: 51px;
        line-height: 50px;
        font-size: 0;
        text-align: right;
        background: #fafbfd;
        border-top: 1px solid #dcdee5;
        width: calc(100% + 28px);
    }
}
</style>
