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
    import { Panels } from '@/common/types'
    import { SYSSETTING_PANELS } from '@/common/constants/systemManage/sysSetting.ts'

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
        panels: Array<Panels> = SYSSETTING_PANELS
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
