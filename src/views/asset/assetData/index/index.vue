<template>
    <div class="asset-model page-container" v-loading="loading">
        <el-tabs class="asset-model-tabs" v-model="currentModel" @tab-click="handleTabClick">
            <el-tab-pane
                v-for="(item,index) in modelList"
                :key="index"
                :label="item.model_name"
                :name="item.model_id">
            </el-tab-pane>
        </el-tabs>
        <div class="asset-model-wrapper">
            <div class="group-tree">
                <el-tree
                    v-if="treeList.length"
                    empty-text="暂无数据"
                    ref="groupTree"
                    :data="treeList"
                    default-expand-all
                    :expand-on-click-node="false"
                    highlight-current
                    :props="{ children: 'subGroups', label: 'name' }"
                    node-key="id"
                    @node-click="selectGroup">
                    <!-- <span slot-scope="{ data }">
                        <span>{{ data.name }}</span>
                    </span> -->
                </el-tree>
                <el-empty v-else class="empty" :image-size="50"></el-empty>
            </div>
            <div class="instance-list">
                <div class="operate-box">
                    <div class="operate-box-left">
                        <el-dropdown>
                            <el-button
                                size="small"
                                type="primary">
                                新建
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item
                                    v-permission="{
                                        id: $route.name,
                                        type: `${classifyId}_create`
                                    }"
                                    @click.native="addResource('add')">
                                    手动创建
                                </el-dropdown-item>
                                <el-dropdown-item
                                    v-permission="{
                                        id: $route.name,
                                        type: `${classifyId}_create`
                                    }"
                                    @click.native="addResource('import')">
                                    批量导入
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <el-dropdown class="mr10 ml10">
                            <el-button size="small">
                                操作
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item
                                    v-permission="{
                                        id: $route.name,
                                        type: `${classifyId}_delete`
                                    }"
                                    :disabled="!selectedInstances.length"
                                    @click.native="deleteInstance">
                                    批量删除
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <el-dropdown>
                            <el-button size="small">
                                导出
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item
                                    v-permission="{
                                        id: $route.name,
                                        type: `${classifyId}_export`
                                    }"
                                    @click.native="exportInst([])">
                                    导出全部
                                </el-dropdown-item>
                                <el-dropdown-item
                                    v-permission="{
                                        id: $route.name,
                                        type: `${classifyId}_export`
                                    }"
                                    :disabled="!selectedInstances.length"
                                    @click.native="exportInst(selectedInstances)">
                                    导出所选
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div class="operate-box-right">
                        <selectInput :property-list="atrrList" :user-list="userList" @change="changeFeild" />
                    </div>
                </div>
                <com-table
                    v-loading="tableLoading"
                    ref="comTable"
                    :data="instanceList"
                    :columns="columns"
                    :pagination="pagination"
                    :max-height="tableMaxHeight"
                    @page-change="handlePageChange"
                    @page-limit-change="handleLimitChange"
                    @select="handleSelect"
                    @select-all="handleSelect"
                >
                    <template slot="operation" slot-scope="{ row }">
                        <el-button
                            v-permission="{
                                id: $route.name,
                                type: 'SysRole_users_manage'
                            }"
                            class="mr10"
                            type="text"
                            size="small"
                            @click="checkDetail(row)">
                            详情
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
        </div>
        <add-instance
            ref="addInstance"
            :model-id="currentModel"
            :group-list="groupList"
            :user-list="userList"
            :current-node="currentNode"
            @on-success="updateInstanceList" />
        <import-instance
            ref="importInstance"
            :model-id="currentModel"
            :current-node="currentNode"
            @on-success="updateInstanceList" />
    </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="scss">
@import "./index.scss"
</style>
