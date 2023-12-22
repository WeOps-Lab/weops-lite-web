<template>
    <div class="instance-permission">
        <bk-button
            :theme="'primary'"
            class="mt20"
            @click="operateInstancePermission('add')">
            新增权限
        </bk-button>
        <com-table
            class="mt20"
            v-bkloading="{ isLoading: tableLoading }"
            ref="comTable"
            :data="tableData"
            :columns="columns"
            :pagination="pagination"
            @page-change="handlePageChange"
            @page-limit-change="limitChange">
            <template slot="operation" slot-scope="{ row }">
                <bk-button
                    :text="true"
                    title="primary"
                    class="mr10"
                    @click="operateInstancePermission('edit', row)">
                    编辑
                </bk-button>
                <bk-button
                    :text="true"
                    title="primary"
                    @click="deleteInstancePermission(row)">
                    删除
                </bk-button>
            </template>
        </com-table>
        <operate-instance-permission
            :role="role"
            ref="operateInstancePermission"
            @refresh-list="getList">
        </operate-instance-permission>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from 'vue-property-decorator'
    import ComTable from '@/components/comTable.vue'
    import OperateInstancePermission from './operateInstancePermission.vue'
    @Component({
        components: {
            ComTable,
            OperateInstancePermission
        }
    })
    export default class instancePermission extends Vue {
        @Prop({
            type: Object,
            default: () => ({})
        })
        role: any
        tableLoading: boolean = false
        tableData: any[] = []
        columns = [
            {
                label: '实例类型',
                key: 'instance_type',
                align: 'left',
                minWidth: '120px'
            },
            {
                label: '实例数量',
                key: 'count',
                align: 'left',
                minWidth: '120px'
            },
            {
                label: '权限类型',
                key: 'permissions_text',
                align: 'left',
                minWidth: '120px'
            },
            {
                label: '操作',
                key: 'operation',
                width: '160px',
                prop: 'operation',
                scopedSlots: 'operation'
            }
        ]
        pagination: {
            current: number,
            count: number,
            limit: number
        } = {
            current: 1,
            count: 20,
            limit: 20
        }
        mounted() {
            this.getList()
        }
        operateInstancePermission(type, row?) {
            const operateInstancePermission: any = this.$refs.operateInstancePermission
            operateInstancePermission.show(type, row)
        }
        deleteInstancePermission(row) {
            this.$bkInfo({
                title: '确认要删除该实例权限？',
                confirmLoading: true,
                confirmFn: async() => {
                    await this.confirmDelete(row)
                }
            })
        }
        async confirmDelete(row) {
            try {
                const res = await this.$api.RoleManageMain.deleteInstPermissions({
                    id: row.id
                })
                if (!res.result) {
                    this.$error(res.message)
                } else {
                    this.$success('删除成功!')
                    if (this.pagination.current > 1 && this.tableData.length === 1) {
                        this.pagination.current--
                    }
                    this.getList()
                }
                return true
            } catch (e) {
                return false
            }
        }
        getList() {
            this.tableLoading = true
            this.$api.RoleManageMain.getInstPermissions({
                role: this.role.id,
                page: this.pagination.current,
                page_size: this.pagination.limit
            }).then(res => {
                const { result, data } = res
                if (!result) {
                    return false
                }
                this.tableData = data.items
                this.pagination.count = data.count
            }).finally(() => {
                this.tableLoading = false
            })
        }
        handlePageChange(page) {
            this.pagination.current = page
            this.getList()
        }
        // 当每页展示条数发生变化时触发
        limitChange(size) {
            this.pagination.current = 1
            this.pagination.limit = size
            this.getList()
        }
    }
</script>

<style scoped lang="scss">
    .instance-permission {
        padding: 0 20px;
    }
    /deep/.bk-table-body-wrapper {
        max-height: calc(100vh - 360px);
        overflow-y: scroll;
    }
</style>
