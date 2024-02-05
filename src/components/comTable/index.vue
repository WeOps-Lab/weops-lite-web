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

<script lang="ts" src="./index.ts"></script>

<style scoped lang="scss">
@import "./index.scss"
</style>
