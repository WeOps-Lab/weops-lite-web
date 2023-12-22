<template>
    <div class="menu-manage-wrapper">
        <div class="menu-manage-area">
            <div class="menu-search">
                <bk-input
                    clearable
                    v-model="keywords"
                    style="width: 300px;"
                    placeholder="请输入关键词"
                    :right-icon="'bk-icon icon-search'"
                    @enter="getMenuList"
                    @clear="getMenuList">
                </bk-input>
                <bk-button
                    v-permission="{
                        id: $route.name,
                        type: 'SysSetting_menus_create'
                    }"
                    :theme="'primary'"
                    @click="handleAdd">
                    新建菜单
                </bk-button>
            </div>
            <custom-menu-table
                class="mt20"
                :data="menuList"
                :columns="columns"
                :pagination="pagination"
                v-bkloading="{ isLoading: loading, zIndex: 10 }"
                :max-height="maxHeight"
                @page-change="handlePageChange"
                @page-limit-change="handleLimitChange">
                <template slot="operation" slot-scope="{ row }">
                    <div>
                        <bk-button
                            v-if="row.use"
                            text
                            class="mr10"
                            disabled>
                            已启用
                        </bk-button>
                        <bk-button
                            v-else
                            v-permission="{
                                id: $route.name,
                                type: 'SysSetting_menus_edit'
                            }"
                            text
                            class="mr10"
                            theme="primary"
                            @click="handleChangeSatus(row)">
                            启用
                        </bk-button>
                        <bk-button
                            v-if="!row.default"
                            v-permission="{
                                id: $route.name,
                                type: 'SysSetting_menus_edit'
                            }"
                            text
                            :disabled="row.use"
                            class="mr10"
                            theme="primary"
                            @click="handleEdit(row)">
                            编辑
                        </bk-button>
                        <bk-button
                            v-permission="{
                                id: $route.name,
                                type: 'SysSetting_menus_delete'
                            }"
                            text
                            :disabled="row.default || row.use"
                            class="mr10"
                            theme="primary"
                            @click="handleDelete(row)">
                            删除
                        </bk-button>
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
        pagination: any = {
            current: 1,
            count: 0,
            limit: 20
        }
        columns: Array<any> = [
            {
                label: '菜单名称',
                key: 'menu_name'
            },
            {
                label: '创建人',
                key: 'created_by'
            },
            {
                label: '创建时间',
                key: 'created_at'
            },
            {
                label: '更新时间',
                key: 'updated_at'
            },
            {
                label: '操作',
                key: 'operation',
                width: '250px',
                prop: 'operation',
                scopedSlots: 'operation'
            }
        ]
        maxHeight: string|number = ''
        created() {
            const PAGE_OCCUPIED_HEIGHT = 310
            this.maxHeight = window.innerHeight - PAGE_OCCUPIED_HEIGHT
            window.onresize = () => {
                this.maxHeight = window.innerHeight - PAGE_OCCUPIED_HEIGHT
            }
        }
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
                    this.menuList = data.items
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
            this.$bkInfo({
                title: `是否启用菜单: ${row.menu_name}`,
                confirmLoading: true,
                confirmFn: async() => {
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
            this.$bkInfo({
                title: `是否删除菜单: ${row.menu_name}`,
                confirmLoading: true,
                confirmFn: async() => {
                    await this.confirmDelete(row)
                }
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

<style scoped lang="scss">
.menu-manage-wrapper {
    .menu-manage-area {
        background: #ffffff;
        padding: 10px;
        .menu-search {
            display: flex;
            .bk-form-control {
                flex: 1;
                margin-right: 15px;
            }
        }
    }
}
</style>
