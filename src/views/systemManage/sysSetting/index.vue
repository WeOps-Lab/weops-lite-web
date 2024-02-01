<template>
    <div>
        <header-sub class="system-setting-header">
            <template slot="title">
                <menu-tab
                    :panels="panels"
                    type="line"
                    v-model="active" />
            </template>
        </header-sub>
        <page-explanation
            :title="getTitleOrContent('label')"
            :content="getTitleOrContent('content')" />
        <component :is="active" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator'
    import MenuTab from '@/components/menuTab.vue'
    import HeaderSub from '@/components/headerSub.vue'
    import LogoSetting from './logoSettings.vue'
    import MenuManage from './menuManage.vue'
    import PageExplanation from '@/components/pageExplanation.vue'

    @Component({
        name: 'sys-setting',
        components: {
            MenuTab,
            HeaderSub,
            LogoSetting,
            MenuManage,
            PageExplanation
        },
        beforeRouteLeave(to, from, next) {
            this.$handleKeepAlive(to, from)
            next()
        }
    })
    export default class SysSetting extends Vue {
        panels = [
            {
                name: 'MenuManage',
                label: '菜单设置',
                content: '菜单管理允许您灵活配置菜单，包括菜单项、菜单层级等，可以根据需要自定义菜单并启用，以便更好使用系统功能'
            },
            {
                name: 'LogoSetting',
                label: 'Logo设置',
                content: '您可以进行主题logo的替换，或者恢复默认'
            }
        ]
        active: string = 'MenuManage'

        getTitleOrContent(key) {
            const activeItem = this.panels.find(item => item.name === this.active)
            return activeItem[key]
        }
    }
</script>

<style scoped lang="scss">
.system-setting-header {
    padding-bottom: 0 !important;
    margin-top: -20px !important;
}
</style>
