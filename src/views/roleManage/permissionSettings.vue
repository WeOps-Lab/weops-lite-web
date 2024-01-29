<template>
    <drawer-component
        title="权限管理"
        :visible="isShow"
        :size="850"
        @changeVisible="changeVisible">
        <div slot="content" class="content-box">
            <menu-tab :panels="panels" :active-panel="active" @click="toTabMenu"></menu-tab>
            <div class="main-box" v-loading="loading" v-if="isShow">
                <operation-permission
                    v-show="active === 'operationPermission'"
                    :role="role"
                    ref="menuPermission"
                    @getMenuLoading="getMenuLoading"
                    @getLatestMenu="getLatestMenu"
                    @getPermissions="getPermissions"
                    @getRawIds="getRawIds"
                >
                </operation-permission>
                <!-- <app-permission
                    v-show="active === 'appPermission'"
                    :role="role"
                    ref="appPermission"
                    @getAppLoading="getAppLoading"
                    @getLatestApp="getLatestApp"
                >
                </app-permission> -->
                <!-- <instance-permission
                    v-show="active === 'instancePermission'"
                    :role="role"
                    ref="instancePermission">
                </instance-permission> -->
            </div>
            <div class="footer-box">
                <el-button v-if="active !== 'instancePermission'" :disabled="disableBtn || loading" :type="'primary'" @click="confirm">
                    确定
                </el-button>
            </div>
        </div>
    </drawer-component>
</template>

<script lang="ts">
    // import AppPermission from './appPermission.vue'
    import OperationPermission from './operationPermission.vue'
    // import InstancePermission from './instancePermission.vue'
    import menuTab from '@/components/menuTab.vue'
    import { Vue, Component } from 'vue-property-decorator'
    import DrawerComponent from '@/components/comDrawer.vue'
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
                const menuPermission = this.permissions[item]
                if (menuPermission) {
                    for (let i = 0; i < menuPermission.length; i++) {
                    // 如果是查看权限
                    if (menuPermission[i].name.endsWith('view')) {
                        nowIds.push(menuPermission[i].name)
                    }
                }
                }
            })
            const operateIds = this.latestOperate.reduce((pre, cur) => {
                return pre.concat(cur.operate_ids)
            }, [])
            this.changePermissionIds = this.compareArrays(this.rawIds, operateIds)
            if (this.rawIds) {
                return
            }

            this.loading = true
            this.$api.RoleManageMain.setRoleMenu({
                id: this.role.id,
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
        getIdByName(data, category, name) {
            if (data.hasOwnProperty(category)) {
                const items = data[category]
                for (let i = 0; i < items.length; i++) {
                    if (items[i].name === name) {
                        return items[i].name
                    }
                }
            }
            return null // 如果没有找到对应的名称，则返回 null
        }
        compareArrays(arrayA, arrayB) {
            const valuesOnlyInA = arrayA.filter(item => !arrayB.includes(item))
            const valuesOnlyInB = arrayB.filter(item => !arrayA.includes(item))
            return [...valuesOnlyInA, ...valuesOnlyInB]
        }

        changeVisible(val) {
            this.isShow = val
        }
    }
</script>

<style scoped lang="scss">
    .content-box {
        height: calc(100vh - 60px);
        padding: 20px 20px 0 20px;
        background-color: #f5f7fa;
        display: flex;
        flex-direction: column;
        .main-box {
            flex: 1;
            height: 0;
            background-color: #fff;
        }
        .footer-box {
            padding-right: 20px;
            background-color: #fff;
            height: 70px;
            display: flex;
            align-items: center;
            flex-direction: row-reverse;
        }
    }
</style>
