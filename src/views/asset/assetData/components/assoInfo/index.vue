<template>
    <div class="asso-info" v-loading="loading">
        <div class="operate-box">
            <div class="operate-box-left">
                <el-button
                    v-permission="{
                        id: classifyId,
                        type: `${classifyId}_relation`
                    }"
                    :type="'primary'"
                    size="small"
                    @click="addRelation">
                    新建关联
                </el-button>
                <el-button
                    size="small"
                    @click="expandAll(true)">
                    全部展开
                </el-button>
                <el-button
                    size="small"
                    @click="expandAll(false)">
                    全部收起
                </el-button>
            </div>
        </div>
        <collapse :collapse-list="resourcList">
            <template slot="content" slot-scope="{ collRow }">
                <com-table
                    ref="comTable"
                    :data="collRow.list"
                    :columns="columns"
                    :max-height="tableMaxHeight"
                >
                    <template slot="operation" slot-scope="{ row }">
                        <el-button
                            v-permission="{
                                id: classifyId,
                                type: `${classifyId}_relation`
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
            </template>
        </collapse>
        <add-relation
            ref="addRelation"
            :property-list="propertyList"
            :connect-type-list="connectTypeList"
            :model-info-list="modelInfoList"
            :group-list="groupList"
            :user-list="userList"
            :columns="columns"
            :slot-columns="slotColumns"
            @refreshList="initData"
        />
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
