import { Vue, Component } from 'vue-property-decorator'
import PageExplanation from '@/components/pageExplanation.vue'
import OperateGroup from '../operateGroup/index.vue'
import AuthWhiteList from '@/views/systemManage/userMange/components/authWhiteList/index.vue'
import RoleManage from '../roleManage/index.vue'
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
    search: string = '';
    nodeData: any[] = [];
    loading: boolean = false;
    // 存放复选框勾选的id
    checkedIds: string[] = [];
    get user() {
        return this.$store.state.permission.user
    }
    mounted() {
        this.getGroups()
    }
    // 新建/编辑组织
    operateGroup(type: string, data?: any) {
        if (
            !this.$BtnPermission({
                id: this.$route.name,
                type: type === 'edit' ? 'SysGroup_edit' : 'SysGroup_create'
            })
        ) {
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
        if (
            !this.$BtnPermission({
                id: this.$route.name,
                type: 'SysGroup_delete'
            })
        ) {
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
        if (
            !this.$BtnPermission({
                id: this.$route.name,
                type: 'SysGroup_delete'
            })
        ) {
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
        if (
            !this.$BtnPermission({
                id: this.$route.name,
                type: 'SysGroup_user'
            })
        ) {
            return false
        }
        const res = await this.$api.GroupManage.getGroupUsers({
            id: node.data.id,
            page: 1,
            per_page: 20
        })
        res.data = res.data.map((item) => ({
            id: item.id,
            bk_username: item.username,
            chname: item.lastName
        }))
        this.$refs.authWhiteList.showSlider(
            {
                user: res.data
            },
            node.data
        )
    }

    async roleManage(node) {
        if (
            !this.$BtnPermission({
                id: this.$route.name,
                type: 'SysGroup_role'
            })
        ) {
            return false
        }
        const res = await this.$api.GroupManage.getGroupRoles({
            id: node.data.id
        })
        this.$refs.roleManage.showSlider(
            {
                role: res.data
            },
            node.data
        )
    }
    // 复选框改变
    handleCheck(node, isChecked) {
        if (isChecked) {
            this.checkedIds.push(node.id)
        } else {
            const index = this.checkedIds.findIndex((item) => item === node.id)
            index !== -1 && this.checkedIds.splice(index, 1)
        }
    }
}
