import { Vue, Component } from 'vue-property-decorator'
import AssoTopo from '../assoTopo/index.vue'
import List from '../list/index.vue'
@Component({
    name: 'asso-info',
    components: {
        AssoTopo,
        List
    }
})
export default class AssoInfo extends Vue {
    active: string = '列表'
    commentsMap: any = {
        '列表': 'list',
        '拓扑': 'assoTopo'
    }
}
