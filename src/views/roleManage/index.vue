<template>
    <div class="role-manage">
        <page-explanation
            title="角色管理"
            content="您可以进行角色的新建和授权，权限的授权分为操作权限和实例权限，可从菜单操作和实例管理两个方面进行限制" />
        <div class="role-manage-wrapper">
            <div class="operate-box">
                <bk-button
                    v-permission="{
                        id: $route.name,
                        type: 'SysRole_create'
                    }"
                    class="mr10"
                    theme="primary"
                    title="新增角色"
                    icon="plus"
                    @click="operateRole('add')">
                    新增角色
                </bk-button>
                <bk-input
                    clearable
                    style="width: 300px;"
                    placeholder="请输入搜索关键字"
                    :right-icon="'bk-icon icon-search'"
                    v-model="search"
                    @right-icon-click="handlerIconClick"
                    @enter="handlerIconClick"
                    @clear="handlerIconClick"
                >
                </bk-input>
            </div>
            <div class="table-box">
                <com-table
                    v-bkloading="{ isLoading: tableLoading, zIndex: 10 }"
                    ref="comTable"
                    :data="dataList"
                    :columns="columns"
                    :pagination="pagination"
                    :max-height="maxHeight"
                    @page-change="handlePageChange"
                    @page-limit-change="limitChange"
                >
                    <template slot="built_in" slot-scope="{ row }">
                        {{['admin', 'normal', 'IA_admin'].includes(row.name) ? '是' : '否'}}
                    </template>
                    <template slot="operation" slot-scope="{ row }">
                        <bk-button
                            v-permission="{
                                id: $route.name,
                                type: 'SysRole_users_manage'
                            }"
                            class="mr10"
                            theme="primary"
                            text
                            @click="personnelManage(row)">
                            人员和组织
                        </bk-button>
                        <bk-button
                            v-permission="{
                                id: $route.name,
                                type: 'SysRole_permissions'
                            }"
                            class="mr10"
                            theme="primary"
                            text
                            :disabled=" ['admin', 'IA_admin'].includes(row.name)"
                            @click="setPermission(row)">
                            设置权限
                        </bk-button>
                        <bk-button
                            v-permission="{
                                id: $route.name,
                                type: 'SysRole_edit'
                            }"
                            class="mr10"
                            theme="primary"
                            text
                            :disabled="['admin', 'normal', 'IA_admin'].includes(row.name)"
                            @click="operateRole('edit', row)">
                            编辑
                        </bk-button>
                        <bk-button
                            v-permission="{
                                id: $route.name,
                                type: 'SysRole_delete'
                            }"
                            class="mr10"
                            theme="primary"
                            text
                            :disabled="['admin', 'normal', 'IA_admin'].includes(row.name)"
                            @click="deleteRole(row)">
                            删除
                        </bk-button>
                    </template>
                </com-table>
            </div>
            <operate-role ref="operateRole" @refreshList="refreshList" />
            <permission-settings ref="permissionSettings" />
            <auth-white-list
                ref="authWhiteList"
                :only-choose-user="true"
                title="人员管理"
                @confirm="getRoleList()" />
            <user-and-group
                ref="userAndGroup"
                title="人员和组织"
                @confirm="getRoleList()" />
        </div>
    </div>
</template>

<script lang="ts">
    import ComTable from '@/components/comTable.vue'
    import OperateRole from './operateRole.vue'
    import PermissionSettings from './permissionSettings.vue'
    import { Vue, Component } from 'vue-property-decorator'
    import AuthWhiteList from '../userMange/components/authWhiteList.vue'
    import PageExplanation from '@/components/pageExplanation.vue'
    import UserAndGroup from './userAndGroup.vue'
    @Component({
        name: 'role-manage',
        components: {
            ComTable,
            OperateRole,
            PermissionSettings,
            AuthWhiteList,
            PageExplanation,
            UserAndGroup
        }
    })
    export default class RoleManage extends Vue {
        tableLoading: boolean = false
        dataList: Array<any> = []
        allDataList: Array<any> = []
        columns = [
            {
                label: '角色名称',
                key: 'name',
                align: 'left',
                minWidth: '100px'
            },
            {
                label: '角色描述',
                key: 'description',
                align: 'left',
                minWidth: '300px'
            },
            {
                label: '是否内置',
                key: 'built_in',
                align: 'left',
                minWidth: '100px',
                scopedSlots: 'built_in'
            },
            {
                label: '创建时间',
                key: 'created',
                align: 'left',
                minWidth: '120'
            },
            {
                label: '操作',
                key: 'operation',
                align: 'left',
                width: '250px',
                scopedSlots: 'operation'
            }
        ]
        pagination = {
            current: 1,
            count: 1,
            limit: 20
        }
        maxHeight: string|number = ''
        search: string = ''
        created() {
            this.getRoleList()
            const PAGE_OCCUPIED_HEIGHT = 276
            this.maxHeight = window.innerHeight - PAGE_OCCUPIED_HEIGHT
            window.onresize = () => {
                this.maxHeight = window.innerHeight - PAGE_OCCUPIED_HEIGHT
            }
        }
        handlerIconClick() {
            this.pagination.current = 1
            this.dataList = this.allDataList.filter(item => item.name.includes(this.search))
            this.pagination.count = this.dataList.length
        }
        async personnelManage(row) {
            if (!this.$BtnPermission({
                id: this.$route.name,
                type: 'SysRole_users_manage'
            })) {
                return false
            }
            const res = await this.$api.RoleManageMain.getRoleAllUser({id: row.id})
            res.data = res.data.map(item => ({
                id: item.id,
                bk_username: item.username,
                chname: item.lastName
            }))
            const detailRes = await this.$api.RoleManageMain.getRoleDetail({id: row.id})
            this.$refs.userAndGroup.showSlider({
                user: res.data,
                group: detailRes.data.groups
            }, row)
        }
        setPermission(row) {
            if (!this.$BtnPermission({
                id: this.$route.name,
                type: 'SysRole_permissions'
            })) {
                return false
            }
            const permissionSettings: any = this.$refs.permissionSettings
            permissionSettings.show(row)
        }
        operateRole(type, data?) {
            if (!this.$BtnPermission({
                id: this.$route.name,
                type: type === 'edit' ? 'SysRole_edit' : 'SysRole_create'
            })) {
                return false
            }
            const operateRole: any = this.$refs.operateRole
            operateRole.show(type, data)
        }
        refreshList() {
            this.getRoleList()
        }
        deleteRole(row) {
            if (!this.$BtnPermission({
                id: this.$route.name,
                type: 'SysRole_delete'
            })) {
                return false
            }
            this.$bkInfo({
                title: '确认要删除该角色？',
                confirmLoading: true,
                confirmFn: async() => {
                    await this.confirmDelete(row)
                }
            })
        }
        async confirmDelete(row) {
            try {
                const res = await this.$api.RoleManageMain.deleteRole({
                    id: row.id
                })
                if (!res.result) {
                    this.$error(res.message)
                } else {
                    this.$success('删除成功!')
                    if (this.pagination.current > 1 && this.dataList.length === 1) {
                        this.pagination.current--
                    }
                    this.getRoleList()
                }
                return true
            } catch (e) {
                return false
            }
        }
        getRoleList() {
            this.tableLoading = true
            this.$api.RoleManageMain.getRoleList().then(res => {
                if (!res.result) {
                    return false
                }
                this.allDataList = res.data.map(item => {
                    return {
                        ...item,
                        created: item.attributes.created?.[0]
                    }
                })
                // 三个角色置顶，其他角色按照创建时间排序
                const topDataName = ['admin', 'IA_admin', 'normal']
                const orderMap = {
                    admin: 0,
                    IA_admin: 1,
                    normal: 2
                }
                const topData = []
                const otherData = []
                this.allDataList.forEach(item => {
                    if (topDataName.includes(item.name)) {
                        topData.push(item)
                    } else {
                        otherData.push(item)
                    }
                })
                topData.sort((a, b) => orderMap[a.name] - orderMap[b.name])
                this.allDataList = [...topData, ...otherData.sort((a, b) => Date.parse(b.created) - Date.parse(a.created))]
                const {current, limit} = this.pagination
                this.dataList = this.allDataList.slice((current - 1) * limit, current * limit)
                this.pagination.count = res.data.length
            }).finally(() => {
                this.tableLoading = false
            })
        }
        handlePageChange(val) {
            this.pagination.current = val
            const {limit} = this.pagination
            this.dataList = this.allDataList.filter(item => item.name.includes(this.search)).slice((val - 1) * limit, val * limit)
        }
        limitChange(val) {
            this.pagination.current = 1
            this.pagination.limit = val
            this.dataList = this.allDataList.filter(item => item.name.includes(this.search)).slice(0, val)
        }
    }
</script>

<style lang="scss" scoped>
    .role-manage-wrapper {
        height: 100%;
        background-color: #fff;
        padding: 20px;
        display: flex;
        flex-direction: column;
        .operate-box {
            display: flex;
            justify-content: space-between;
        }
        .table-box {
            margin-top: 20px;
            flex: 1;
        }
    }
</style>
