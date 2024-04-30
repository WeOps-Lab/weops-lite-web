import { Vue, Component, Prop } from 'vue-property-decorator'
import AssoTopo from '../assoTopo/index.vue'
import List from '../list/inde.vue'
@Component({
    name: 'asso-info',
    components: {
        AssoTopo,
        List
    }
})
export default class AssoInfo extends Vue {
    @Prop({
        type: Array,
        default: () => []
    })
    groupList: Array<any>
    @Prop({
        type: Array,
        default: () => []
    })
    userList: Array<any>
    @Prop({
        type: Array,
        default: () => []
    })
    connectTypeList: Array<any>
    @Prop({
        type: Array,
        default: () => []
    })
    modelInfoList: Array<any>
    @Prop({
        type: Array,
        default: () => []
    })
    propertyList: Array<any>

    active: string = '列表'
}
