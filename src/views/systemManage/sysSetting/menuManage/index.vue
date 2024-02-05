<template>
    <div class="menu-manage-wrapper">
        <div class="manage-wrapper">
            <div class="operate-box">
                <el-input
                    clearable
                    placeholder="请输入关键词"
                    v-model="keywords"
                    @change="getMenuList"
                    @clear="getMenuList">
                </el-input>
                <el-button
                    v-permission="{
                        id: $route.name,
                        type: 'SysSetting_menus_create'
                    }"
                    class="ml10"
                    :type="'primary'"
                    @click="handleAdd">
                    新建菜单
                </el-button>
            </div>
            <custom-menu-table
                class="mt20"
                :data="menuList"
                :columns="columns"
                :pagination="pagination"
                v-loading="loading"
                :max-height="tableMaxHeight"
                @page-change="handlePageChange"
                @page-limit-change="handleLimitChange">
                <template slot="operation" slot-scope="{ row }">
                    <div>
                        <el-button
                            v-if="row.use"
                            type="text"
                            disabled>
                            已启用
                        </el-button>
                        <el-button
                            v-else
                            v-permission="{
                                id: $route.name,
                                type: 'SysSetting_menus_edit'
                            }"
                            type="text"
                            @click="handleChangeSatus(row)">
                            启用
                        </el-button>
                        <el-button
                            v-if="!row.default"
                            v-permission="{
                                id: $route.name,
                                type: 'SysSetting_menus_edit'
                            }"
                            :disabled="row.use"
                            type="text"
                            @click="handleEdit(row)">
                            编辑
                        </el-button>
                        <el-button
                            v-permission="{
                                id: $route.name,
                                type: 'SysSetting_menus_delete'
                            }"
                            :disabled="row.default || row.use"
                            type="text"
                            @click="handleDelete(row)">
                            删除
                        </el-button>
                    </div>
                </template>
            </custom-menu-table>
        </div>
    </div>
</template>

<script lang="ts" src="./index.ts"></script>
