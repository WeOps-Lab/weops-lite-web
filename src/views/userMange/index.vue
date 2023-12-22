<template>
    <div>
        <!-- <header-sub class="user-manage-header">
            <template slot="title">
                <menu-tab :panels="panels" type="line" :active-panel="active" @click="toTabMenu"></menu-tab>
            </template>
        </header-sub> -->
        <page-explanation
            :title="getTitleOrContent('label')"
            :content="getTitleOrContent('content')" />
        <component
            style="height: calc(100% - 140px);"
            :is="active" />
    </div>
</template>

<script lang="ts">
    import UserManage from './userManage.vue'
    import MultipleFactor from './multipleFactor.vue'
    import MenuTab from '@/components/menuTab.vue'
    import HeaderSub from '@/components/headerSub.vue'
    import PageExplanation from '@/components/pageExplanation.vue'
    import { Vue, Component } from 'vue-property-decorator'
    @Component({
        name: 'user-manage-index',
        components: {
            MenuTab,
            UserManage,
            HeaderSub,
            MultipleFactor,
            PageExplanation
        }
    })
    export default class UserManageIndex extends Vue {
        panels = [
            {
                name: 'userManage',
                label: '用户列表',
                content: '展示所有自动/手动同步的用户信息，您可以进行用户信息的维护和角色的授予'
            },
            {
                name: 'multipleFactor',
                label: '登录配置',
                content: '支持对系统登录的登录域和认证方式进行设置，根据设置对登录方式进行限制'
            }
        ]
        active: string = 'userManage'
        get user() {
            return this.$store.state.permission.user
        }
        created() {
            if (!this.user.is_super) {
                this.panels = this.panels.filter(item => item.name !== 'userCatalog')
                this.active = this.panels[0].name
            }
        }
        getTitleOrContent(key) {
            const activeItem = this.panels.find(item => item.name === this.active)
            return activeItem[key]
        }
        toTabMenu(item) {
            this.active = item.name
        }
    }
</script>

<style lang="scss" scoped>
.user-manage-header {
    padding-bottom: 0 !important;
    margin-top: -20px !important;
}
</style>
