<template>
    <drawer-component
        title="新建关联"
        :size="640"
        :visible="visible"
        destroy-on-close
        custom-class="common-dialog-wrapper"
        :before-close="beforeCloseDialog"
        @changeVisible="changeVisible">
        <div slot="content" class="content-box common-dialog-wrapper-main" v-loading="relateLoading">
            <div class="operate-item mb20">
                <span class="label">关联列表</span>
                <el-select
                    class="field"
                    size="small"
                    filterable
                    v-model="relation"
                    placeholder="请选择"
                    :loading="relateLoading"
                    @change="searchRelationData">
                    <el-option
                        v-for="(item,index) in relationData"
                        :key="index"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="operate-item mb20">
                <span class="label">条件筛选</span>
                <selectInput :property-list="atrrList" :user-list="userList" @change="changeFeild" />
            </div>
            <com-table
                v-loading="tableLoading"
                ref="comTable"
                :data="instanceList"
                :columns="columns"
                :max-height="tableMaxHeight"
                :pagination="pagination"
                @page-change="handlePageChange"
                @page-limit-change="handleLimitChange"
            >
                <template slot="operation" slot-scope="{ row }">
                    <el-button
                        v-if="!row.isRelated"
                        v-permission="{
                            id: classifyId,
                            type: `classifyId_relation`
                        }"
                        class="mr10"
                        type="text"
                        size="small"
                        @click="handleRelate(row)"
                    >
                        关联
                    </el-button>
                    <el-button
                        v-else
                        v-permission="{
                            id: classifyId,
                            type: `classifyId_relation`
                        }"
                        class="mr10"
                        type="text"
                        size="small"
                        @click="cancelRelate(row)"
                    >
                        取消关联
                    </el-button>
                </template>
                <template v-for="field in slotColumns" :slot="field.scopedSlots" slot-scope="{ row }">
                    <div :key="field.key">
                        <el-tag
                            v-if="field.attr_type === 'bool'"
                            :type="row[field.key] ? 'success' : ''">
                            {{getShowValue(field, row)}}
                        </el-tag>
                        <span v-else>{{ getShowValue(field, row) }}</span>
                    </div>
                </template>
            </com-table>
        </div>
        <div slot="footer">
            <el-button
                size="small"
                @click="beforeCloseDialog">
                关闭
            </el-button>
        </div>
    </drawer-component>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="scss" scoped>
@import "./index.scss"
</style>
