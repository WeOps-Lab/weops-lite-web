<template>
    <div class="asso-topo" v-loading="loading">
        <div class="topo" ref="canvasRef"></div>
    </div>
</template>

<script lang="ts">
    import G6 from '@antv/g6'
    import { Vue, Component, Prop } from 'vue-property-decorator'
    import registerNode from './registerNode'
@Component()
export default class AssoTopo extends Vue {
    @Prop({
        type: Array,
        default: () => []
    })
    modelInfoList: Array<any>
    @Prop({
        type: Array,
        default: () => []
    })
    connectTypeList: Array<any>

    graph: any = null
    loading: boolean = false
    topoData: any = {}

    mounted() {
        registerNode.registerNode()
        registerEdge()
        this.initGraph()
    }

    beforeDestroy() {
        if (this.graph && this.graph.destroyed) {
            this.graph.destroyed()
        }
    }

    getViewCenter() {
        const width = this.graph.get('width')
        const height = this.graph.get('height')
        return {
            x: width / 2,
            y: height / 2
        }
    }
    fitGraph() {
        this.graph.fitView([80], {}, false)
        if (this.graph.getZoom() > 1) {
            this.graph.zoomTo(1)
            this.graph.fitCenter(false)
        }
    }
    async initGraph() {
        const container: any = this.$refs['canvasRef']
        const { clientWidth: width, clientHeight: height } = this.$el
        await this.getInstanceTopo()
        const grid = new G6.Grid()
        const minimap = new G6.Minimap({
            size: [200, 120],
            className: 'minimap',
            type: 'delegate'
        })
        this.graph = new G6.TreeGraph({
            container,
            width,
            height,
            plugins: [grid, minimap],
            fitView: true,
            minZoom: 0.1,
            modes: {
                default: [
                    'drag-canvas',
                    'zoom-canvas',
                    {
                        type: 'tooltip',
                        offset: 15,
                        formatText: function formatText(node) {
                            const re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/
                            const showTip = `
                                    <span
                                        style="background-color: #333;
                                        padding: 5px 10px;
                                        color: #fff;
                                        border-radius: 3px;
                                        font-size: 12px;"
                                    >
                                        ${node.inst_name}
                                    </span>
                                `
                            if (re.test(node.inst_name)) {
                                if (node.inst_name.split('').length > 10) {
                                    return showTip
                                }
                                return ''
                            }
                            if (typeof node.inst_name === 'string') {
                                const res = /^[\u4e00-\u9fa5]/
                                const MAX_COUNT_LENGTH = res.test(node.inst_name) ? 5 : 10
                                return node.inst_name.split('').length > MAX_COUNT_LENGTH ? showTip : ''
                            }
                            return showTip
                        },
                        shouldUpdate: function shouldUpdate(e) {
                            return true
                        },
                        shouldBegin(e) {
                            return true
                        }
                    }
                ]
            },
            defaultNode: {
                type: 'asso-node',
                size: [170, 52]
            },
            defaultEdge: {
                type: 'cubic-horizontal',
                // label: () => this.getLabel(),
                labelCfg: {
                    autoRotate: true,
                    position: 'middle',
                    style: {
                        fill: '#ddd',
                        fontSize: 8,
                        background: {
                            padding: [2, 2, 2, 2],
                            radius: 2
                        },
                        opacity: 1
                    }
                }
            },
            layout: {
                type: 'mindmap',
                direction: 'H',
                dropCap: false,
                getHeight: () => {
                    return 40
                },
                getWidth: () => {
                    return 200
                },
                getSide: (node) => {
                    if (node.data.isSource) {
                        return 'right'
                    }
                    return 'left'
                }
            }
        })
        this.graph.data(this.topoData)
        this.graph.render()
        this.initEvent()
    }
    getLabel(item) {
        console.log(item)
        return '123'
    }
    initEvent() {
        this.graph.on('node:click', this.handleExpand)
    }
    handleExpand(e) {
        if (e.target.get('name') === 'collapse-icon') {
            e.item.getModel().collapsed = !e.item.getModel().collapsed
            this.graph.setItemState(e.item, 'collapsed', e.item.getModel().collapsed)
            this.graph.layout()
            return
        }
        console.log(123)
    }
    async getInstanceTopo() {
        this.loading = true
        const { modelId, instId } = this.$route.query
        const params = {
            model_id: modelId,
            inst_id: instId
        }
        try {
            const { result, message, data } = await this.$api.AssetData.getInstanceTopo(params)
            if (!result) {
                return this.$error(message)
            }
            const srcData = data.src_result.children.map(item => {
                return {
                    isSource: true,
                    ...item
                }
            })
            const dstData = data.dst_result.children
            const currentNode = this.$copy(data.src_result)
            delete currentNode.children
            const topoData = {
                ...currentNode,
                children: [...dstData, ...srcData]
            }
            this.topoData = this.dealTopoData(topoData)
            console.log(this.topoData)
        } finally {
            this.loading = false
        }
    }
    dealTopoData(data) {
        if (data.model_id) {
            const targetModel = this.modelInfoList.find(item => item.model_id === data.model_id)
            data.model_name = targetModel?.model_name || '--'
            data.icn = targetModel?.icn || 'cc-default_默认'
            data.asst_name = this.connectTypeList.find(item => item.id === data.asst_id)?.label || '--'
        }
        if (data.children?.length) {
            data.children.forEach(item => this.dealTopoData(item))
        }
        return data
    }
}
    function registerEdge() {
        G6.registerEdge(
            'cubic-horizontal',
            {
                afterDraw(cfg, group) {
                    const shape = group.get('children')[0]
                    const { isSource } = cfg.targetNode.getModel()
                    const style = {}
                    const key = isSource ? 'endArrow' : 'startArrow'
                    style[key] = {
                        path: 'M 0,0 L 8,4 L 8,-4 Z',
                        fill: '#ddd'
                    }
                    shape.attr(style)
                }
            },
            'cubic-horizontal'
        )
    }
</script>

<style lang="scss" scoped>
.asso-topo {
    width: 100%;
    height: calc(100vh - 246px);
    position: relative;

    /deep/ .minimap {
        position: absolute !important;
        right: 0;
        bottom: 0;
        border: 1px solid #ddd !important;
        border-right: none;
        background-color: #fff;
    }

    /deep/ .g6-grid-container {
        z-index: 0 !important;
    }

    /deep/ canvas {
        position: relative;
        z-index: 0 !important;
    }
}
</style>
