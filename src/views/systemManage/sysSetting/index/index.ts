import { Vue, Component } from 'vue-property-decorator'
import MenuTab from '@/components/menuTab.vue'
import HeaderSub from '@/components/headerSub.vue'
import LogoSetting from '../logoSettings/index.vue'
import MenuManage from '../menuManage/index.vue'
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
