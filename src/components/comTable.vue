<template>
    <div class="table-container" :class="{ 'border-none': noneBorder }">
        <bk-table
            ref="table"
            v-bind="$attrs"
            :outer-border="false"
            :header-border="false"
            :default-expand-all="defaultExpandAll"
            :row-key="rowKey"
            :expand-row-keys="expandRowKeys"
            @select="onselect"
            @cell-click="cellClick"
            @row-click="rowClick"
            @select-all="selectAll"
            @selection-change="selectChange"
            @page-change="handlePageChange"
            @page-limit-change="limitChange"
            @expand-change="expandChange"
            @filter-change="filterChange"
            @sort-change="sortChange"
            @row-mouse-enter="rowMouseEnter"
            @row-mouse-leave="rowMouseLeave">
            <template v-for="column in setting.selectFields">
                <bk-table-column
                    v-bind="column"
                    :key="column.type + '_opertion'"
                    v-if="['selection', 'index'].includes(column.type)">
                </bk-table-column>
                <bk-table-column
                    v-else
                    v-bind="column"
                    :key="column.key"
                    :show-overflow-tooltip="column.noNeedTip ? false : { interactive: false }"
                    :prop="column.key"
                    :column-key="column.key"
                    :filter-method="(value, row, col) => columnFilterMethod(value, row, col, column.filterRemote)"
                    :render-header="column.renderHeader">
                    <template slot-scope="props">
                        <template v-if="column.scopedSlots">
                            <slot :name="column.scopedSlots" :row="props.row" :colKey="column.key" :index="props.$index"></slot>
                        </template>
                        <span v-else>{{ props.row[column.key] || (props.row[column.key] === 0 ? props.row[column.key] : '--')}}</span>
                    </template>
                </bk-table-column>
            </template>
            <!-- <bk-table-column type="setting" v-if="settingsFields && settingsFields.length > 0">
                <bk-table-setting-content
                    value-key="key"
                    :max="setting.max"
                    :size="setting.size"
                    :fields="setting.fields"
                    :selected="setting.selectFields"
                    @setting-change="handleSettingChange">
                </bk-table-setting-content>
            </bk-table-column> -->
            <bk-table-column type="setting" v-if="settingsFields && settingsFields.length > 0" />
            <template slot="empty">
                <slot name="empty"></slot>
            </template>
        </bk-table>
        <div v-if="settingsFields && settingsFields.length > 0" class="table-content-setting">
            <bk-popover
                ref="popverCom"
                trigger="click"
                theme="light"
                width="400"
                placement="bottom-end">
                <bk-icon type="cog-shape" />
                <template slot="content">
                    <div class="content-setting-wrapper">
                        <h2>表格设置</h2>
                        <div class="setting-fields-checkout-group">
                            <div class="mb10">
                                <bk-checkbox
                                    :indeterminate="indeterminate"
                                    v-model="isCheckAll"
                                    @change="changeAllCheck">
                                    全选
                                </bk-checkbox>
                            </div>
                            <bk-checkbox-group
                                v-model="settingKeys"
                                @change="changeCheckbox">
                                <bk-checkbox
                                    :key="item.key"
                                    :value="item.key"
                                    :disabled="item.disabled"
                                    v-for="item in setting.fields">
                                    <span :title="item.label">{{ item.label }}</span>
                                </bk-checkbox>
                            </bk-checkbox-group>
                        </div>
                        <div class="content-setting-footer">
                            <bk-button
                                theme="primary"
                                title="确定"
                                @click="confirmPopover">
                                确定
                            </bk-button>
                            <bk-button
                                class="ml20"
                                title="取消"
                                @click="hidePopover">
                                取消
                            </bk-button>
                        </div>
                    </div>
                </template>
            </bk-popover>
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
            require: true
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
        rowMouseEnter(index, event, row) {
            this.$emit('row-mouse-enter', index, event, row)
        }
        rowMouseLeave(index, event, row) {
            this.$emit('row-mouse-leave', index, event, row)
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
            this.$refs.popverCom?.hideHandler()
        }
        confirmPopover() {
            this.$refs.popverCom?.hideHandler()
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
.table-container {
    position: relative;
    background: #fff;
    border: 1px solid #dfe0e5;
    &.border-none {
        border: none !important;
    }
}

/deep/ .content-line-height {
    display: none;
}

/deep/ .bk-table::before {
    height: 0;
}

/deep/ .bk-table-fixed-right {
    border-bottom: none !important;
}

/deep/ .bk-table-fixed {
    border-bottom: none !important;
    th {
        //border: none !important;
    }
}
/deep/ .bk-table-column-setting {
    border-left: 0;
}
/deep/.bk-table .bk-table-body td.bk-table-expanded-cell {
    padding: 0 !important;
    background: #f7f7f7;
    tr {
        background: #f7f7f7;
        th {
            background: #f7f7f7 !important;
        }
    }
}
/deep/ .bk-table-fixed-right {
    right: 0;
}
/deep/.bk-table-scrollable-x {
    .bk-table-body-wrapper {
        &::-webkit-scrollbar-thumb:window-inactive {
            background: #C4C6CC;
        }
        &::-webkit-scrollbar {
            width: 6px;// 高宽分别对应横竖滚动条的尺寸
            height: 6px;
            background-color: rgba(255, 255, 255, .07);
            border: none;
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            box-shadow: inset 0 0 6px rgba(196, 198, 204, .5);
            background: rgba(196, 198, 204, 1);
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            -webkit-border-radius: 10px;
            background: rgba(196, 198, 204, 1);
            -webkit-box-shadow: inset 0 0 6px rgba(196, 198, 204, .5);
        }
    }
}
.table-content-setting {
    position: absolute;
    right: 15px;
    top: 10px;
    z-index: 10;
    .bk-icon {
        display: inline-block;
        vertical-align: middle;
        width: 24px;
        height: 24px;
        line-height: 24px;
        font-size: 14px;
        color: #979ba5;
        cursor: pointer;
    }
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
        .bk-form-control {
            max-height: 317px;
            overflow-y: auto;
            .bk-form-checkbox {
                display: inline-block;
                width: calc(33.33333% - 15px);
                margin: 10px 15px 0 0;
                /deep/.bk-checkbox-text {
                    display: inline-block;
                    max-width: calc(100% - 22px);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
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
/deep/.bk-table-header-label {
    .bk-table-setting-icon {
        display: none;
    }
}
</style>
