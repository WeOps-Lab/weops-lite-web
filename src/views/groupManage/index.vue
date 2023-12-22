<template>
    <div class="sys-organization">
        <page-explanation
            title="组织管理"
            content="您可以创建组织，用于管理一组用户，或者进行角色授权，您可以创建、修改和删除组织，并管理其下级单位。" />
        <div class="organization-manage">
            <div class="operate-box">
                <div>
                    <bk-button
                        class="mr10"
                        theme="primary"
                        title="新增组织"
                        @click="operateGroup('add')">
                        新增组织
                    </bk-button>
                    <bk-button
                        class="mr10"
                        theme="default"
                        title="批量删除"
                        @click="deleteNodes">
                        批量删除
                    </bk-button>
                </div>
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
            <div class="tree-box" v-bkloading="{ isLoading: loading, zIndex: 10 }">
                <bk-big-tree
                    ref="tree"
                    enable-title-tip
                    default-expand-all
                    :selectable="true"
                    :show-checkbox="true"
                    :options="{ childrenKey: 'subGroups' }"
                    :data="nodeData"
                    @check-change="handleCheck">
                    <div slot-scope="{ node,data }">
                        <div class="node-box">
                            <span>{{ data.name }}</span>
                            <div class="operate-node">
                                <bk-button size="small" text title="primary" @click.stop="operateGroup('addSub', data)">
                                    添加子组
                                </bk-button>
                                <bk-button size="small" text title="primary" @click.stop="personnelManage(node)">
                                    人员管理
                                </bk-button>
                                <bk-button size="small" text title="primary" @click.stop="roleManage(node)">
                                    角色管理
                                </bk-button>
                                <bk-button size="small" text title="primary" @click.stop="operateGroup('edit', node)">
                                    编辑
                                </bk-button>
                                <bk-button size="small" text title="primary" @click.stop="deleteNode(node)">
                                    删除
                                </bk-button>
                            </div>
                        </div>
                    </div>
                </bk-big-tree>
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
            this.$bkInfo({
                title: '确认要删除该组织？',
                confirmLoading: true,
                confirmFn: async() => {
                    await this.confirmDelete(node)
                }
            })
        }
        // 批量删除
        deleteNodes() {
            this.$bkInfo({
                title: '确认要删除选中组织？',
                confirmLoading: true,
                confirmFn: async() => {
                    await this.confirmDelete()
                }
            })
        }
        async confirmDelete(node?) {
            let deleteIds
            // 有传参则删除一个，没有则删除勾选组织
            if (node) {
                deleteIds = [node.id]
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
            const res = await this.$api.GroupManage.getGroupUsers({id: node.id, page: 1, per_page: 20})
            res.data = res.data.map(item => ({
                id: item.id,
                bk_username: item.username,
                chname: item.lastName
            }))
            this.$refs.authWhiteList.showSlider({
                user: res.data
            }, node)
        }

        async roleManage(node) {
            const res = await this.$api.GroupManage.getGroupRoles({id: node.id})
            this.$refs.roleManage.showSlider({
                role: res.data
            }, node)
        }
        // 复选框改变
        handleCheck(ids) {
            this.checkedIds = ids
        }
    }
</script>

<style lang="scss" scoped>
.organization-manage {
    height: 100%;
    background-color: #fff;
    padding: 20px;
    display: flex;
    flex-direction: column;
    .operate-box {
        display: flex;
        justify-content: space-between;
    }
    .tree-box {
        margin-top: 20px;
        flex: 1;
        .node-box {
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>
