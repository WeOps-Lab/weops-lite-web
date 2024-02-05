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

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator'
    import CustomMenuTable from '@/components/comTable.vue'
    import { mapState } from 'vuex'
    import { Pagination, TableData } from '@/common/types'
    import { MENU_MANAGE_COLUMNS } from '@/common/constants/systemManage/sysSetting.ts'

    @Component({
        name: 'menu-manage',
        components: {
            CustomMenuTable
        },
        computed: {
            ...mapState({
                PermissionState: item => item.permission
            })
        }
    })
    export default class MenuManage extends Vue {
        keywords: string = ''
        loading: boolean = false
        menuList: any = []
        pagination: Pagination = {
            current: 1,
            count: 0,
            limit: 20
        }
        columns: Array<TableData> = MENU_MANAGE_COLUMNS
        pageOccupiedHeight: number = 400
        mounted() {
            this.getMenuList()
        }
        async getMenuList() {
            this.loading = true
            try {
                const res = await this.$api.UserManageMain.getMenuManage({
                    search: this.keywords,
                    page_size: this.pagination.limit,
                    page: this.pagination.current
                })
                if (res.result) {
                    const { data } = res
                    this.pagination.count = data.count
                    this.menuList = data.data
                } else {
                    this.$error(res.message)
                    this.menuList = []
                }
            } finally {
                this.loading = false
            }
        }
        handleAdd() {
            if (!this.$BtnPermission({id: this.$route.name, type: 'SysSetting_menus_create'})) return
            this.$router.push({
                name: 'MenuSetting'
            })
        }
        handlePageChange(page) {
            this.pagination.current = page
            this.getMenuList()
        }
        handleLimitChange(limit) {
            this.pagination.current = 1
            this.pagination.limit = limit
            this.getMenuList()
        }
        async handleChangeSatus(row) {
            if (!this.$BtnPermission({id: this.$route.name, type: 'SysSetting_menus_edit'})) return
            this.$confirm(`是否启用菜单: ${row.menu_name}`, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center: true
            }).then(async() => {
                const res = await this.$api.UserManageMain.useCustomMenu({
                        id: row.id
                    })
                if (res.result) {
                    this.getMenuList()
                    this.$success(`启用${row.menu_name}成功`)
                    // 启动成功后，更新菜单
                    const userInfo = {
                        ...this.PermissionState.user,
                        weops_menu: row.menu
                    }
                    this.$store.commit('setUser', userInfo)
                    this.$store.commit('setCustomMenuStatus')
                    this.$store.dispatch('updateMenuList', userInfo)
                } else {
                    this.$error(res.message)
                }
            })
        }
        handleEdit(row) {
            if (!this.$BtnPermission({id: this.$route.name, type: 'SysSetting_menus_edit'})) return
            this.$router.push({
                name: 'MenuSetting',
                query: {
                    id: row.id
                }
            })
        }
        handleDelete(row) {
            if (!this.$BtnPermission({id: this.$route.name, type: 'SysSetting_menus_delete'})) return
            this.$confirm(`是否删除菜单: ${row.menu_name}`, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center: true
            }).then(async() => {
                await this.confirmDelete(row)
            })
        }
        async confirmDelete(row) {
            const res = await this.$api.UserManageMain.deleteCustomMenu({
                id: row.id
            })
            if (res.result) {
                this.$success(`${row.menu_name}删除成功`)
                if (this.pagination.current > 1 && this.menuList.length === 1) {
                    this.pagination.current--
                }
                await this.getMenuList()
            } else {
                this.$error(res.message)
            }
        }
    }
</script>
