import { Component, Prop, Vue } from 'vue-property-decorator'
import ComTable from '@/components/comTable/index.vue'

@Component({
    name: 'drawer-component',
    components: {
        ComTable
    }
})
export default class DrawerComponent extends Vue {
    @Prop({
        type: String,
        default: () => '标题'
    })
    title: string

    @Prop({
        type: Boolean,
        default: () => false
    })
    visible: boolean

    get drawerVisible() {
        return this.visible
    }
    set drawerVisible(val) {
        this.$emit('changeVisible', val)
    }
    handleClose() {
        this.$emit('changeVisible', false)
    }
}
