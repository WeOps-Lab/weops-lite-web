<template>
    <div class="sys-organization">
        <page-explanation
            title="组织管理"
            content="您可以创建组织，用于管理一组用户，或者进行角色授权，您可以创建、修改和删除组织，并管理其下级单位。" />
        <div class="organization-manage manage-wrapper">
            <div class="operate-box">
                <div>
                    <el-button
                        class="mr10"
                        size="small"
                        type="primary"
                        v-permission="{
                            id: $route.name,
                            type: 'SysGroup_create'
                        }"
                        @click="operateGroup('add')">
                        新增组织
                    </el-button>
                    <el-button
                        class="mr10"
                        size="small"
                        title="批量删除"
                        v-permission="{
                            id: $route.name,
                            type: 'SysGroup_delete'
                        }"
                        @click="deleteNodes">
                        批量删除
                    </el-button>
                </div>
                <el-input
                    clearable
                    size="small"
                    style="width: 300px;"
                    placeholder="请输入搜索关键字"
                    suffix-icon="el-icon-search"
                    v-model="search"
                    @change="handlerIconClick"
                    @clear="handlerIconClick"
                >
                </el-input>
            </div>
            <div class="tree-box" v-loading="loading">
                <el-tree
                    ref="tree"
                    :data="nodeData"
                    show-checkbox
                    default-expand-all
                    :props="{ children: 'subGroups' }"
                    @check-change="handleCheck">
                    <span class="custom-tree-node" slot-scope="{ node,data }">
                        <span>{{ data.name }}</span>
                        <span class="operate-node">
                            <el-button
                                size="small"
                                type="text"
                                v-permission="{
                                    id: $route.name,
                                    type: 'SysGroup_create'
                                }"
                                @click.stop="operateGroup('addSub', node)">
                                添加子组
                            </el-button>
                            <el-button
                                size="small"
                                type="text"
                                v-permission="{
                                    id: $route.name,
                                    type: 'SysGroup_user'
                                }"
                                @click.stop="personnelManage(node)">
                                人员管理
                            </el-button>
                            <el-button
                                size="small"
                                type="text"
                                v-permission="{
                                    id: $route.name,
                                    type: 'SysGroup_role'
                                }"
                                @click.stop="roleManage(node)">
                                角色管理
                            </el-button>
                            <el-button
                                size="small"
                                type="text"
                                v-permission="{
                                    id: $route.name,
                                    type: 'SysGroup_edit'
                                }"
                                @click.stop="operateGroup('edit', node)">
                                编辑
                            </el-button>
                            <el-button
                                size="small"
                                type="text"
                                v-permission="{
                                    id: $route.name,
                                    type: 'SysGroup_delete'
                                }"
                                @click.stop="deleteNode(node)">
                                删除
                            </el-button>
                        </span>
                    </span>
                </el-tree>
            </div>
        </div>
        <operate-group ref="operateGroup" @refreshList="refreshList" />
        <auth-white-list
            ref="authWhiteList"
            :only-choose-user="true"
            title="人员管理"
            caller="groupManage"
            @confirm="getGroups" />
        <role-manage
            ref="roleManage"
            title="角色管理" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator'
    import PageExplanation from '@/components/pageExplanation.vue'
    import OperateGroup from './operateGroup.vue'
    import AuthWhiteList from '../userMange/components/authWhiteList.vue'
    import RoleManage from './roleManage.vue'
    @Component({
        name: 'group-manage',
        components: {
            PageExplanation,
            OperateGroup,
            AuthWhiteList,
            RoleManage
        }
    })
    export default class GroupManage extends Vue {
        search: string = ''
        nodeData: any[] = []
        loading: boolean = false
        // 存放复选框勾选的id
        checkedIds: string[] = []
        get user() {
            return this.$store.state.permission.user
        }
        mounted() {
            this.getGroups()
        }
        // 新建/编辑组织
        operateGroup(type: string, data?: any) {
            if (!this.$BtnPermission({
                id: this.$route.name,
                type: type === 'edit' ? 'SysGroup_edit' : 'SysGroup_create'
            })) {
                return false
            }
            const operateGroup: any = this.$refs.operateGroup
            operateGroup.show(type, data)
        }
        // 搜索
        handlerIconClick() {
            this.getGroups()
        }
        async getGroups() {
            this.loading = true
            const params = {
                search: this.search
            }
            const res = await this.$api.GroupManage.getGroups(params)
            if (!res.result) {
                return false
            }
            this.nodeData = res.data
            this.loading = false
        }
        // 删除节点
        deleteNode(node) {
            if (!this.$BtnPermission({
                id: this.$route.name,
                type: 'SysGroup_delete'
            })) {
                return false
            }
            this.$confirm('确认要删除该组织？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center: true
            }).then(async() => {
                await this.confirmDelete(node)
            })
        }
        // 批量删除
        deleteNodes() {
            if (!this.$BtnPermission({
                id: this.$route.name,
                type: 'SysGroup_delete'
            })) {
                return false
            }
            this.$confirm('确认要删除选中组织？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center: true
            }).then(async() => {
                await this.confirmDelete()
            })
        }
        async confirmDelete(node?) {
            let deleteIds
            // 有传参则删除一个，没有则删除勾选组织
            if (node) {
                deleteIds = [node.data.id]
            } else {
                deleteIds = this.checkedIds
            }
            const res = await this.$api.GroupManage.delGroup({ deleteIds })
            if (res.result) {
                this.$success('删除成功')
                this.getGroups()
            } else {
                this.$error('删除失败')
            }
        }
        // 刷新
        refreshList() {
            this.getGroups()
        }
        async personnelManage(node) {
            if (!this.$BtnPermission({
                id: this.$route.name,
                type: 'SysGroup_user'
            })) {
                return false
            }
            const res = await this.$api.GroupManage.getGroupUsers({id: node.data.id, page: 1, per_page: 20})
            res.data = res.data.map(item => ({
                id: item.id,
                bk_username: item.username,
                chname: item.lastName
            }))
            this.$refs.authWhiteList.showSlider({
                user: res.data
            }, node.data)
        }

        async roleManage(node) {
            if (!this.$BtnPermission({
                id: this.$route.name,
                type: 'SysGroup_role'
            })) {
                return false
            }
            const res = await this.$api.GroupManage.getGroupRoles({id: node.data.id})
            this.$refs.roleManage.showSlider({
                role: res.data
            }, node.data)
        }
        // 复选框改变
        handleCheck(node, isChecked) {
            if (isChecked) {
                this.checkedIds.push(node.id)
            } else {
                const index = this.checkedIds.findIndex(item => item === node.id)
                index !== -1 && this.checkedIds.splice(index, 1)
            }
        }
    }
</script>

<style lang="scss" scoped>
.organization-manage {
    .custom-tree-node {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>
