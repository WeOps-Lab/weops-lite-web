// import AppPermission from './appPermission.vue'
import OperationPermission from '../operationPermission/index.vue'
// import InstancePermission from './instancePermission.vue'
import menuTab from '@/components/menuTab.vue'
import { Vue, Component } from 'vue-property-decorator'
import DrawerComponent from '@/components/comDrawer.vue'
import { routeConfig } from '@/router/menuList'
import { findAuthById } from '@/common/dealMenu'

@Component({
    name: 'permission-settings',
    components: {
        // AppPermission,
        OperationPermission,
        // InstancePermission,
        menuTab,
        DrawerComponent
    }
})
export default class permissionSettings extends Vue {
    isShow: boolean = false
    panels = [
        { name: 'operationPermission', label: '操作权限' }
        // { name: 'instancePermission', label: '实例权限' }
    ]
    active: string = 'operationPermission'
    role: any = {}
    menuLoading: boolean = false
    appLoading: boolean = false
    latestMenu = []
    latestOperate = []
    latestApp = []
    loading: boolean = false
    permissions = {}
    // 原本有权限的id
    rawIds = []
    // 权限要改变的id
    changePermissionIds = []
    get disableBtn() {
        return this.active === 'operationPermission' ? this.menuLoading : this.appLoading
    }
    getLatestMenu(data) {
        this.latestMenu = data.checkAuthIds
        this.latestOperate = data.operateAuthIds
    }
    // getLatestApp(data) {
    //     this.latestApp = data
    // }
    getMenuLoading(loading) {
        this.menuLoading = loading
    }
    // getAppLoading(loading, visible) {
    //     this.appLoading = loading
    //     if (visible === 'hide') {
    //         this.isShow = false
    //     }
    // }
    show(data) {
        this.isShow = true
        this.role = data
        this.active = 'operationPermission'
    }
    toTabMenu(item) {
        this.active = item.name
    }
    // 拿到角色权限数据
    getPermissions(data) {
        this.permissions = data
    }
    // 拿到原始id数据
    getRawIds(data) {
        this.rawIds = data
    }

    confirm() {
        const menuPermission: any = this.$refs.menuPermission
        menuPermission.getLatestMenu()
        // const appPermission: any = this.$refs.appPermission
        // appPermission.getLatestApp()
        const nowIds = []
        // 设置查看权限的id
        this.latestMenu.forEach(item => {
            const result = findAuthById(item, routeConfig)
            if (result) {
                nowIds.push(result.find(target => target.key.endsWith('_view'))?.key) // 菜单查看的权限id
                nowIds.push(...result.reduce((pre, cur) => {
                    return pre.concat(cur.apiKey)
                }, [])) // 所有的apiKey
            }
        })
        const operateIds = this.latestOperate.reduce((pre, cur) => {
            return pre.concat(cur.operate_ids)
        }, []) // 菜单操作的权限id
        this.changePermissionIds = Array.from(new Set([...nowIds, ...operateIds])) // 过滤掉重复的id
        this.loading = true
        this.$api.RoleManageMain.setRoleMenu({
            name: this.role.name,
            array: this.changePermissionIds
        }).then(res => {
            const { result, message } = res
            if (!result) {
                this.$error(message)
                return false
            }
            this.$success('权限设置成功!')
            this.isShow = false
        }).finally(() => {
            this.loading = false
        })
    }

    changeVisible(val) {
        this.isShow = val
    }
}
