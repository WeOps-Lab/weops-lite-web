<template>
    <div>
        <el-container>
            <!-- 头部 -->
            <el-header>
                <div class="navigation-header">
                    <div class="navigation-title">
                        <div class="monitor-logo" @click="goHome">
                            <img :src="'data:image/png;base64,' + nav.logo" height="40" width="40" :alt="'logo图片'">
                        </div>
                        <span class="title-desc">WeOps</span>
                    </div>
                    <div class="header-right">
                        <div class="monitor-navigation-header">
                            <ul class="top-nav">
                                <li
                                    v-for="item in menuList"
                                    :key="item.id"
                                    :class="['top-nav-item', activeTopNav === item.id && 'active-top-nav']"
                                    @click="changeTopNav(item)">
                                    {{item.name}}
                                </li>
                            </ul>
                            <div class="other-info">
                                <el-popover
                                    placement="top-start"
                                    trigger="hover"
                                    popper-class="header-popper">
                                    <div class="header-user is-left" slot="reference">
                                        <el-tooltip :content="user.chname" :disabled="isShowTooltip" placement="bottom" effect="dark">
                                            <div
                                                @mouseover="onMouseOver"
                                                style="max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                                            >
                                                <span ref="strRef">{{user.chname}}</span>
                                            </div></el-tooltip>
                                        <i class="el-icon-caret-bottom"></i>
                                    </div>
                                    <ul class="monitor-navigation-admin" ref="userList">
                                        <li class="nav-item" @click="checkPersonalInfo">
                                            个人信息
                                        </li>
                                        <li class="nav-item" @click="outLogin">
                                            退出登录
                                        </li>
                                    </ul>
                                </el-popover>
                            </div>
                        </div>
                    </div>
                </div>
            </el-header>
            <el-container>
                <!-- 侧边导航栏 -->
                <el-aside width="auto">
                    <el-menu v-if="needLeftNav"
                        class="el-menu-vertical"
                        :default-active="defaultActive"
                        :collapse="!open && defaultOpen"
                        :unique-opened="true"
                        @select="handleSelect">
                        <template v-for="item in leftNavList">
                            <!-- 有子菜单 -->
                            <el-submenu
                                v-if="item.children && !!item.children.length"
                                :index="item.id"
                                :key="item.name"
                                @click="handleNavItemClick(item)">
                                <template slot="title">
                                    <i :class="[item.icon || 'cw-icon weops-folder', 'icon-class']"></i>
                                    <span>{{ item.name }}</span>
                                </template>
                                <el-menu-item v-for="child in item.children" :key="child.name" :index="child.id" @click="handleNavItemClick(child)">
                                    <template slot="title">
                                        <i class="cw-icon icon-class"></i>
                                        <span>{{ child.name }}</span>
                                    </template>
                                </el-menu-item>
                            </el-submenu>
                            <!-- 没有子菜单 -->
                            <el-menu-item
                                v-else
                                :index="item.id"
                                :key="item.name"
                                @click="handleNavItemClick(item)">
                                <i :class="[item.icon || 'cw-icon weops-folder', 'icon-class']"></i>
                                <span slot="title">{{ item.name }}</span>
                            </el-menu-item>
                        </template>
                        <div class="nav-slider-footer">
                            <i :class="open ? 'el-icon-back' : 'el-icon-right'" @click="handleIconCLick"></i>
                        </div>
                    </el-menu>
                </el-aside>
                <!-- 主体部分 -->
                <el-main>
                    <Container :key="renderKey" :nav-toggle="nav.toggle" :user="user"></Container>
                    <personal-info ref="personalInfo"></personal-info>
                </el-main>
            </el-container>
        </el-container>

    </div>
</template>

<script lang="ts">
    import { Component, Vue, Watch } from 'vue-property-decorator'
    import Container from './container.vue'
    import PersonalInfo from './personalInfo.vue'
    import { mapState } from 'vuex'
    import { removeItemsWithId } from '@/common/dealMenu'
    @Component({
        components: {
            Container,
            PersonalInfo
        },
        computed: {
            ...mapState({
                permission: item => item.permission
            })
        }
    })
    export default class NavFrame extends Vue {
        renderKey: number = 0
        clickFlag: boolean = false
        activeTopNav: string = ''
        leftNavList: Array<any> = []
        title: string = this.$route.meta.title
        nav = {
            list: [],
            name: '',
            id: 'HomeFirst',
            toggle: false,
            submenuActive: false,
            title: 'WeOps',
            // 图片base64格式
            logo: ''
        }
        defaultActive: string = ''
        refreshNavKey: string = 'leftNavkey'
        ticketIconVisible = false
        defaultOpen: boolean = true // 是否展开左侧栏
        open: boolean = true // 图标控制，一直展开
        isShowTooltip: boolean = false
        get user() {
            const user = this.permission.user
            if (user.is_super) {
                this.ticketIconVisible = true
            } else {
                this.ticketIconVisible = user.menus?.includes('Ticket') && user.applications.includes('itsm')
            }
            return user
        }
        get menuList() {
            return this.permission.menuList
        }
        get ticketCount() {
            return this.permission.ticketCount
        }
        get updateCustomMenu() {
            return this.permission?.updateCustomMenu
        }
        get needLeftNav() {
            if (this.$route.name === 'Login') {
                return false
            }
            const target = this.menuList.find(item => item.id === this.activeTopNav)
            return !!(target && target.children)
        }
        get headerHight() {
            return this.$route.name === 'Login' ? '0' : '52'
        }
        @Watch('$route', {
            immediate: true,
            deep: true
        })
        @Watch('updateCustomMenu', {
            deep: true
        })
        on$routeChanged(val) {
            let routeValue = val
            // 若watch的变量updateCustomMenu，则为布尔值，即该菜单改变时处理如下
            if (typeof val === 'boolean') {
                routeValue = this.$route
            }
            if (this.clickFlag) {
                this.clickFlag = false
                this.renderKey++
            }
            this.menuList.forEach(item => {
                if (item.id === routeValue.name || (item.sonMenuIds || []).includes(routeValue.name)) {
                    this.activeTopNav = item.id
                    if ((item.sonMenuIds || []).includes(routeValue.name)) {
                        this.leftNavList = item.children
                    }
                } else {
                    if (!routeValue.meta?.parentIds) {
                        return false
                    }
                    const morePage = item.sonMenuIds.map(tex => routeValue.meta.parentIds.find(nev => nev === tex))
                    if (!morePage.every(tex => !tex)) {
                        this.activeTopNav = item.id
                        this.leftNavList = item.children
                    }
                }
            })
            this.defaultActive = this.setDefaultActive()
        }
        @Watch('leftNavList', {
            immediate: true,
            deep: true
        })
        onLeftNavListChanged(val) {
            // 判断用户不是超管组内的人员，则不展示系统管理的界面[角色管理，用户管理，通知渠道，服务台管理]
            if (!this.user.is_super) {
                const ONLY_ADMIN_HAS_MENUS = ['ServiceDeskManage', 'AutoProcessManage', 'NoticeWays']
                removeItemsWithId(val, ONLY_ADMIN_HAS_MENUS)
            }
        }
        created() {
            if (document.body.clientWidth > 1440) {
                this.defaultOpen = true
            }
        }
        mounted() {
            this.$bus.$on('updateLogo', () => {
                this.getLogo()
            })
            this.$bus.$on('refreshNav', from => {
                this.defaultActive = this.setDefaultActive()
                this.refreshNavKey = Vue.prototype.$random(5)
                const topNav = this.menuList.find(item => item.sonMenuIds.includes(from.name) || item.sonMenuIds.includes(from.meta.activeMenu))
                if (topNav) {
                    this.activeTopNav = topNav.id
                    this.leftNavList = topNav.children
                }
            })
            this.getLogo()
            this.title = this.$route.meta.title
        }
        beforeDestroy() {
            this.$bus.$off('updateLogo')
        }
        checkPersonalInfo() {
            const personalInfo: any = this.$refs.personalInfo
            personalInfo.show()
        }
        setDefaultActive() {
            if (this.$route.meta.hasOwnProperty('parentIds')) {
                if (this.$route.meta.activeMenu) {
                    return this.$route.meta.activeMenu
                } else {
                    const activeMenuId = sessionStorage.getItem('activeMenuId')
                    if (activeMenuId) {
                        return JSON.parse(activeMenuId)
                    }
                }
            }
            return this.$route.name
        }
        outLogin() {
            this.$confirm('是否退出登录', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center: true
            }).then(() => {
                sessionStorage.clear()
                document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;'
                localStorage.removeItem('loginToken')
                this.$store.commit('setLoginStatus')
                this.$router.go(0)
            })
        }
        handleSelect(id, item) {
            this.nav.id = id
        }
        getLogo() {
            this.$api.Server.getLogo({}, {
                cancelWhenRouteChange: false
            }).then(res => {
                if (res.result) {
                    this.nav.logo = res.data.value
                }
            })
        }
        changeTopNav(item) {
            if (item.isUrl) {
                window.open(item.url, '_blank')
            } else {
                this.activeTopNav = item.id
                if (!item.children) {
                    this.clickFlag = true
                    this.$router.push({
                        name: this.activeTopNav
                    })
                    return false
                }
                this.leftNavList = item.children
                if (this.leftNavList.every(item => item.isUrl)) {
                    return false
                }
                this.$router.push({
                    name: this.findFirstNonUrlId(this.leftNavList)
                })
            }
        }
        findFirstNonUrlId(arr) {
            for (const item of arr) {
                if (item.isUrl) {
                    continue
                }
                if (item.children && item.children.length > 0) {
                    const childResult = this.findFirstNonUrlId(item.children)
                    if (childResult !== null) {
                        return childResult
                    }
                } else {
                    return item.id
                }
            }
            return null
        }
        goHome() {
            this.$router.push('/')
            this.nav.name = this.$route.meta.title
        }
        handleToggle(v) {
            this.nav.toggle = v
        }
        // beforeNavChange(item) {
        //     const result = this.findItemById(this.leftNavList, item)
        //     return !result.isUrl
        // }
        // findItemById(arr, id) {
        //     for (const item of arr) {
        //         if (item.id === id) {
        //             return item
        //         }
        //         if (item.children) {
        //             const found = this.findItemById(item.children, id)
        //             if (found) {
        //                 return found
        //             }
        //         }
        //     }
        //     return null
        // }
        // 点击菜单
        handleNavItemClick(item) {
            if (item.isUrl) {
                window.open(item.url, '_blank')
            } else {
                this.clickFlag = true
                if (this.$route.name !== item.id) {
                    this.nav.name = item.name
                    sessionStorage.setItem('activeMenuId', JSON.stringify(item.id))
                    this.$router.push({
                        name: item.id,
                        params: item.params || {}
                    })
                }
            }
        }
        handleIconCLick() {
            this.open = !this.open
        }
        // 内容超出，显示文字提示内容
        onMouseOver() {
            const tag = this.$refs['strRef']
            const parentWidth = tag.parentNode.offsetWidth // 获取元素父级可视宽度
            const contentWidth = tag.offsetWidth // 获取元素可视宽度
            this.isShowTooltip = contentWidth <= parentWidth
        }
    }
</script>

<style lang="scss" scoped>
    /* stylelint-disable selector-class-pattern */
    .el-header {
        padding: 0 !important;
        height: 52px !important;
    }

    .el-container {
        .el-aside {
            .el-menu {
                height: 100%;
                position: relative;
                .el-menu-item {
                    text-align: left;
                    padding: 0 20px !important;
                }
                /deep/.nav-slider-footer {
                    width: 100%;
                    position: absolute;
                    bottom: 50px;
                    transform: translateY(-50%);
                    padding: 0 20px;
                    i {
                        font-size: 16px;
                        cursor: pointer;
                        color: #909399;
                        transition: all;
                    }
                }
            }
        }
        .el-main {
            background-color: #f5f7fa;
        }
    }

    .navigation-header {
        display: flex;
        align-items: center;
        background-color: rgb(24, 33, 50);
        // flex-basis: 52px;
        height: 52px;
        padding-right: 24px;

        .navigation-title {
            display: flex;
            align-items: center;
            padding: 8px 16px;
            width: 200px;
            .title-desc {
                font-size: 16px;
                font-weight: 700;
                color: #96a2b9;
                display: inline-block;
                margin-left: 16px;
                line-height: 24px;
                overflow: hidden;
                white-space: nowrap;
            }
        }

        .header-right {
            display: flex;
            flex: 1;
            justify-content: space-between;
            .top-nav {
                display: flex;
                height: 100%;
                max-width: calc(100vw - 470px);
                overflow-x: auto;
                .top-nav-item {
                    list-style: none;
                    margin-right: 65px;
                    display: flex;
                    align-items: center;
                    color: #96a2b9;
                    font-size: 14px;
                    white-space: nowrap;
                    &:hover {
                        cursor: pointer;
                        color: #d3d9e4;
                    }
                    &:last-child {
                        margin-right: 0;
                    }
                }
                .active-top-nav {
                    color: #fff;
                }
            }
            .other-info {
                display: flex;
                height: 100%;
                align-items: center;
                flex: 1;
                flex-direction: row-reverse;
                .header-user {
                    text-align: center;
                    vertical-align: center;
                }
                .show-name {
                    display: inline-block;
                    max-width: 100px;
                }
            }
        }
    }

    .el-menu-vertical:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }
    // 原始样式
    .child-menu-item .navigation-menu-item-name {
        overflow: auto !important;
        white-space: normal !important;
    }
    .monitor-logo {
        display: flex;
        align-items: center;
        .credit-tip {
            position: absolute;
            top: 5px;
            left: 140px;
        }
    }
    .icon-class {
        font-size: 16px;
        min-width: 38px;
        text-align: left;
        display: inline-block;
    }
    .bk-navigation-title {
        flex: 0 0 200px !important;
    }
    .monitor-navigation-header {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        height: 100%;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        font-size: 14px;
        //justify-content: flex-end;
    }

    .monitor-navigation-header .header-title {
        color: #63656E;
        font-size: 16px;
        display: flex;
        flex: 1;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        margin-left: -6px;
        .header-title-tip {
            color: #979BA5;
            font-size: 12px;
            margin-left: 8px;
            margin-top: 1px;
        }
    }

    .monitor-navigation-header .header-mind {
        font-size: 14px;
        position: relative;
        height: 32px;
        line-height: 32px;
        min-width: 140px;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        color: #63656e;

        .iconfont {
            font-size: 14px;
            margin: 0 4px;
        }
    }

    .monitor-navigation-header .header-mind.is-left {
        color: #63656E;
    }

    .monitor-navigation-header .header-mind.is-left:hover {
        color: #3A84FF;
    }

    .monitor-navigation-header .header-mind-mark {
        position: absolute;
        right: 8px;
        top: 8px;
        height: 7px;
        width: 7px;
        border: 1px solid #27334C;
        background-color: #EA3636;
        border-radius: 100%;
    }

    .monitor-navigation-header .header-mind-mark.is-left {
        border-color: #F0F1F5;
    }

    .monitor-navigation-header .header-mind:hover {
        cursor: pointer;
        color: #D3D9E4;
    }

    .monitor-navigation-header .header-help {
        font-size: 14px;
        position: relative;
        height: 32px;
        min-width: 140px;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        color: #63656e;
        line-height: 32px;

        .iconfont {
            font-size: 16px;
            margin: 0 4px;
        }
    }

    .monitor-navigation-header .header-help.is-left {
        color: #63656E;
    }

    .monitor-navigation-header .header-help.is-left:hover {
        color: #3A84FF;
    }

    .monitor-navigation-header .header-help:hover {
        cursor: pointer;
        color: #D3D9E4;
    }

    .monitor-navigation-header .header-user {
        height: 100%;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        color: #96A2B9;
        margin-left: 8px;
    }

    .monitor-navigation-header .header-user .el-icon-caret-bottom {
        margin-left: 5px;
        font-size: 16px;
    }

    .monitor-navigation-header .header-user.is-left {
        color: #63656E;
    }

    .monitor-navigation-header .header-user.is-left:hover {
        color: #3A84FF;
    }

    .monitor-navigation-header .header-user:hover {
        cursor: pointer;
        color: #D3D9E4;
    }

    .monitor-navigation-admin {
        width: 100px;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
        border-radius: 4px;
        background: #FFFFFF;
        border: 1px solid #E2E2E2;
        -webkit-box-shadow: 0 3px 4px 0 rgba(64, 112, 203, 0.06);
        box-shadow: 0 3px 4px 0 rgba(64, 112, 203, 0.06);
        padding: 6px 0;
        margin: 0;
        color: #63656E;
    }

    .monitor-navigation-admin .nav-item {
        -webkit-box-flex: 0;
        -ms-flex: 0 0 32px;
        flex: 0 0 32px;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        padding: 0 20px;
        list-style: none;
    }

    .monitor-navigation-admin .nav-item:hover {
        color: #3A84FF;
        cursor: pointer;
        background-color: #F0F1F5;
    }

    .tippy-popper .tippy-tooltip.navigation-message-theme {
        padding: 0;
        border-radius: 0;
        -webkit-box-shadow: none;
        box-shadow: none;
    }

    .navigation-sbmenu,
    .navigation-menu-item {
        .cw-icon {
            text-align: left !important;
        }
    }
    // 适配到期情况的宽度
    .navigation-other-wrapper {
        .bk-navigation-title {
            flex: 0 0 260px !important;
        }
        .monitor-navigation-header {
            .top-nav {
                max-width: calc(100vw - 530px);
            }
        }
    }
    /* 当屏幕宽度小于或等于 1280 像素时 */
    @media screen and (max-width: 1280px) {
        .monitor-navigation-header {
            .top-nav {
                max-width: 810px !important;
            }
        }
        .navigation-other-wrapper {
            .monitor-navigation-header {
                .top-nav {
                    max-width: 750px !important;
                }
            }
        }
    }
</style>
<!-- 改Popover弹出框样式 -->
<style lang="scss">
    .header-popper {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        min-width: 100px !important;
        margin-top: 7px !important;
        .popper__arrow {
            display: none !important;
        }
    }
</style>
