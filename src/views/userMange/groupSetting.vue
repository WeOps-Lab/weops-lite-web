<template>
    <bk-sideslider
        :is-show.sync="visible"
        :quick-close="true"
        :before-close="handleClose"
        :width="700"
        ext-cls="common-dialog-wrapper">
        <div slot="header">{{ title }}</div>
        <div slot="content" class="transfer-box common-dialog-wrapper-main">
            <div class="source-list">
                <div class="header">待选择列表</div>
                <div class="content-box">
                    <div class="search">
                        <bk-input
                            clearable
                            style="width: 300px;"
                            placeholder="请输入搜索关键字"
                            :right-icon="'bk-icon icon-search'"
                            v-model="search"
                            @right-icon-click="handlerIconClick"
                            @enter="handlerIconClick"
                            @clear="handlerIconClick"
                        >
                        </bk-input>
                    </div>
                    <div class="organization-box" v-bkloading="{ isLoading: loading, zIndex: 10 }">
                        <bk-big-tree
                            v-if="nodeData.length"
                            enable-title-tip
                            ref="tree"
                            :default-expand-all="true"
                            :options="{ childrenKey: 'subGroups' }"
                            :data="nodeData">
                            <div slot-scope="{ data }">
                                <div class="node-box">
                                    <div class="name">{{data.name}}</div>
                                    <bk-checkbox
                                        v-model="data.checked"
                                        @click.stop.native="() => {}" />
                                </div>
                            </div>
                        </bk-big-tree>
                        <bk-exception
                            v-else
                            :class="{ 'exception-gray': false }"
                            type="empty"
                            scene="part">
                        </bk-exception>
                    </div>
                </div>
            </div>
            <div class="selection-container">
                <p>已选择（共<span>{{ selectedNode.length }}</span>条）<span class="clear" @click="handleClear">清空</span></p>
                <ul>
                    <li v-for="item in selectedNode" :key="item.id">
                        {{ item.name }}
                        <span>组织</span>
                        <bk-icon type="close" @click="handleDelete(item.id)" />
                    </li>
                </ul>
            </div>
        </div>
        <template slot="footer">
            <bk-button
                class="mr10"
                :title="'确认'"
                :theme="'primary'"
                @click="handleConfirm">
                确认
            </bk-button>
            <bk-button
                type="submit"
                :theme="'default'"
                :title="'取消'"
                @click="handleClose">
                取消
            </bk-button>
        </template>
    </bk-sideslider>
</template>
<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator'
    @Component({
    name: 'group-setting',
    components: {}
})
    export default class GroupSetting extends Vue {
        @Prop({
            type: String,
            default: () => '设置所在组织'
        })
        title: string

        loading: boolean = false
        search: string = ''
        nodeData: any[] = []
        visible: boolean = false
        // 用户的id
        userId: string = ''
        // 原始选择的数据
        rawSelected: any[] = []
        // 要删除的id
        deleteIds: string[] = []
        // 要增加的id
        addIds: string[] = []
        // 选中的数据
        get selectedNode() {
            const arr = []
            for (const node of this.nodeData) {
                this.traverseTree(node, arr)
            }
            return arr
        }
        async show(row, id) {
            this.rawSelected = row
            this.userId = id
            // 拿到groups数据后，设置已选择列表
            await this.getGroups()
            this.visible = true
        }
        handlerIconClick() {
            this.getGroups()
        }
        async getGroups() {
            this.loading = true
            const params = {
                search: this.search
            }
            const res = await this.$api.GroupManage.getGroups(params)
            if (!res.result) {
                return false
            }
            // 对接口返回的数据进行处理，设置checked
            for (let i = 0; i < this.rawSelected.length; i++) {
                res.data.forEach(item => {
                    this.handleData(item, this.rawSelected[i].id)
                })
            }
            this.nodeData = res.data
            this.loading = false
        }
        // 设置数据的checked
        handleData(data, id) {
            if (data.id === id) {
                data.checked = true
            } else if (data.subGroups && data.subGroups.length > 0) {
                for (const childNode of data.subGroups) {
                    this.handleData(childNode, id)
                }
            }
        }
        // 递归遍历树结构，将 checked 为 true 的项加入 selected 数组
        traverseTree(node, arr) {
            const index = arr.findIndex(item => item.id === node.id)
            // checked为true且arr里不存在该数据
            if (node.checked && index < 0) {
                arr.push(node)
            } else if (!node.checked && index >= 0) {
                arr.splice(index, 1)
            }
            if (node.subGroups && node.subGroups.length > 0) {
                for (const childNode of node.subGroups) {
                    this.traverseTree(childNode, arr)
                }
            }
        }
        // 清空
        handleClear() {
            for (const node of this.nodeData) {
                this.checkedToFalse(node)
            }
        }
        // 将nodeData里的checked都置为false
        checkedToFalse(node) {
            if (node.checked) {
                node.checked = false
            }
            if (node.subGroups && node.subGroups.length > 0) {
                for (const childNode of node.subGroups) {
                    this.checkedToFalse(childNode)
                }
            }
        }
        // 删除列表项
        handleDelete(id) {
            for (const node of this.nodeData) {
                this.deleteNode(node, id)
            }
        }
        // 查找到当前项并改checked为false
        deleteNode(node, id) {
            if (node.id === id) {
                node.checked = false
            } else if (node.subGroups && node.subGroups.length > 0) {
                for (const childNode of node.subGroups) {
                    this.deleteNode(childNode, id)
                }
            }
        }
        handleConfirm() {
            this.findAddAndDel(this.rawSelected, this.selectedNode)
            this.setGroups()
        }
        // 找出要删除的id和要增加的id
        findAddAndDel(rawData, updateData) {
            const deleteId = []
            const rawTemp = rawData.map(item => item.id)
            const updateTemp = updateData.map(item => item.id)
            for (let i = 0; i < rawTemp.length; i++) {
                if (!updateTemp.includes(rawTemp[i])) {
                    deleteId.push(rawTemp[i])
                }
            }
            const addId = []
            for (let i = 0; i < updateTemp.length; i++) {
                if (!rawTemp.includes(updateTemp[i])) {
                    addId.push(updateTemp[i])
                }
            }
            this.deleteIds = deleteId
            this.addIds = addId
        }
        // 调接口设置组织
        async setGroups() {
            const deletePromises = []
            const addPromises = []
            this.deleteIds.length > 0 && deletePromises.push(this.$api.UserManageMain.delUserGroups({id: this.userId, deleteIds: this.deleteIds}))
            this.addIds.length > 0 && addPromises.push(this.$api.UserManageMain.addUserGroups({id: this.userId, addIds: this.addIds}))
            try {
                const res = await Promise.all([...deletePromises, ...addPromises])
                if (res.every(item => item.result)) {
                    this.$success('设置组织成功')
                    this.handleClose()
                    this.$emit('confirm')
                }
            } catch (err) {
                this.$warn('设置失败')
            }
        }
        handleClose() {
            this.visible = false
        }
    }
</script>

<style lang="scss" scoped>
    .transfer-box {
        display: flex;
        max-height: calc(100vh - 114px) !important;
        .header {
            padding-left: 20px;
            padding-right: 20px;
            height: 40px;
            line-height: 40px;
            background-color: rgb(250, 251, 253);
            border-bottom: 1px solid rgb(220, 222, 229);
        }
        .source-list {
            width: 60%;
            border: 1px solid rgb(220, 222, 229);
            overflow-y: auto;
            .search {
                padding: 20px;
            }
            .organization-box {
                padding: 0 0 20px 20px;
                .node-box {
                    padding-right: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .bk-checkbox {
                        border-radius: 50%;
                    }
                }
            }
        }
        .selection-container {
            border: 1px solid #dcdee5;
            border-bottom: none;
            background-color: #f5f7fa;
            padding: 12px 24px;
            height: 100%;
            flex: 1;
            margin-left: 10px;
            overflow-y: scroll;
            > p {
                justify-content: space-between;
                font-size: 12px;
                margin: 0 0 10px 0;
                color: #63656e;
                span {
                    display: inline-block;
                    color: $cw-color-primary;
                }
                .clear {
                    float: right;
                    cursor: pointer;
                }
            }
            ul {
                margin-top: 15px;
                li {
                    background: #fff;
                    padding: 10px;
                    position: relative;
                    border-bottom: 1px solid $cw-color-border-0;
                    &:last-child {
                        border: none;
                    }
                    span {
                        float: right;
                        font-size: 12px;
                        color: $cw-color-text-3;
                        padding-right: 10px;
                    }
                    > i {
                        display: none;
                        position: absolute;
                        right: 5px;
                        top: 12px;
                        font-size: 18px;
                    }
                    &:hover {
                        cursor: pointer;
                        i {
                            display: inline-block;
                            &:hover {
                                color: $cw-color-primary;
                            }
                        }
                    }
                }
            }
        }
    }
    .bk-sideslider {
        .bk-sideslider-footer {
            display: flex;
            flex-direction: row-reverse;
        }
    }
</style>
