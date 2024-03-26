<template>
    <div class="asset-model page-container">
        <page-explanation
            title="模型管理"
            content="模型管理提供了所有资产的模型和模型分组的新建和管理，您可以根据需求创建和管理" />
        <div
            class="asset-model-wrapper"
            v-loading="loading">
            <div class="action-bar">
                <el-button
                    size="small"
                    v-permission="permissionObj"
                    :type="'primary'"
                    @click="addModel">
                    新建模型
                </el-button>
                <el-button
                    size="small"
                    v-permission="permissionObj"
                    class="ml20"
                    @click="groupOperation('add')">
                    新建分组
                </el-button>
                <el-input
                    class="ml20"
                    size="small"
                    clearable
                    placeholder="请输入模型名称"
                    style="flex: 1;"
                    suffix-icon="el-icon-search"
                    v-model="searchKey"
                    @change="getAllModelList"
                    @clear="getAllModelList">
                </el-input>
            </div>
            <div class="show-box">
                <div
                    class="model-list"
                    v-for="item in modelList"
                    :key="item.id">
                    <div class="model-header">
                        <div>
                            <span class="name">{{item.classification_name}}</span>
                            <span class="count">{{`(${item.list.length})`}}</span>
                        </div>
                        <div class="model-header-operation show-operation">
                            <el-button
                                v-permission="permissionObj"
                                :disabled="!!item.list.length"
                                type="text"
                                size="mini"
                                icon="el-icon-delete"
                                @click="handleDelete(item)">
                            </el-button>
                            <el-button
                                v-permission="permissionObj"
                                type="text"
                                size="mini"
                                icon="el-icon-edit"
                                @click="groupOperation('edit',item)">
                            </el-button>
                        </div>
                    </div>
                    <div class="model-body">
                        <div
                            v-for="tex in item.list"
                            :key="tex.model_id"
                            class="model-info"
                            @click="checkModelDetail(tex)">
                            <div class="left-info">
                                <div class="icon-box">
                                    <div
                                        class="drag-item">
                                        <!-- <i class="cw-icon weops-drag-drop"></i> -->
                                    </div>
                                    <img :src="getIconUrl(tex)" alt="">
                                </div>
                                <div class="info-box">
                                    <div class="hide-text" v-overflow-tooltip>
                                        {{tex.model_name}}
                                    </div>
                                    <div class="model-id hide-text" v-overflow-tooltip>
                                        {{tex.model_id}}
                                    </div>
                                </div>
                            </div>
                            <div :class="['right-info', 'is-show', item.bk_classification_id === 'bk_file' && 'is-disabled']">
                                <i class="el-icon-date" style="font-size: 16px;" />
                                <!-- <span>{{tex.count > 999 ? '999+' : tex.count}}</span> -->
                            </div>
                        </div>
                    </div>
                </div>
                <el-empty
                    v-if="!modelList.length"
                    style="margin-top: 200px;"
                    class="exception-wrap-item exception-part"
                    description="暂无数据"
                >
                </el-empty>
            </div>
            <add-model
                ref="addModel"
                :group-list="modelGroupList"
                @getAllModelList="getAllModelList">
            </add-model>
            <group-operation
                ref="groupOperation"
                @getAllModelList="getAllModelList" />
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator'
    import addModel from '../components/modelOperation.vue'
    import groupOperation from '../components/groupOperation.vue'
    import PageExplanation from '@/components/pageExplanation/index.vue'
    @Component({
        components: {
            addModel,
            groupOperation,
            PageExplanation
        }
    })
    export default class ModelManage extends Vue {
        searchKey: string = ''
        loading: boolean = false
        modelList: Array<any> = []
        groupList: Array<any> = []
        allModelList: Array<any> = []
        dragStartParent: any = ''
        dragEndParent: any = ''
        oldData: any = ''
        dragStartId: number = 0
        dragEndId: number = 0
        dragStartIndex: string | number = ''
        dragEndIndex: string | number = ''
        mounted() {
            this.getAllModelList()
        }
        get modelGroupList() {
            return this.groupList
        }
        get permissionObj() {
            return {}
        }
        dragstart(parentValue, value, index) {
            this.dragStartParent = parentValue
            this.oldData = value
            this.dragStartId = value.id
            this.dragStartIndex = index
        }
        dragenter(parentValue, value, index) {
            this.dragEndParent = parentValue
            this.dragEndId = value.id
            this.dragEndIndex = index
        }
        dragover(e) {
            e.preventDefault()
        }
        getDragend() {
            if (this.dragStartId !== this.dragEndId && this.dragStartParent.id === this.dragEndParent.id) {
                const oldIndex = this.dragStartParent.list.findIndex(item => item.id === this.dragStartId)
                const newIndex = this.dragStartParent.list.findIndex(item => item.id === this.dragEndId)
                // 删除之前DOM节点
                this.dragStartParent.list.splice(oldIndex, 1)
                // 在拖拽结束目标位置增加新的DOM节点
                this.dragStartParent.list.splice(newIndex, 0, this.oldData)
                this.setModelIndex()
            }
            this.initDragData()
        }
        async setModelIndex() {
            try {
                const params = {}
                this.modelList.forEach(item => {
                    const obj = {}
                    item.list.forEach((tex, index) => {
                        obj[tex.bk_obj_id] = index
                    })
                    params[item.bk_classification_id] = obj
                })
                this.loading = true
                const { result, message } = await this.$api.modelSetting.setModelIndex(params)
                if (!result) {
                    this.$error(message)
                    return false
                }
                this.$success('修改成功')
            } catch (e) {
                console.error(e)
            } finally {
                this.loading = false
            }
        }
        initDragData() {
            this.dragStartParent = ''
            this.dragEndParent = ''
            this.oldData = ''
            this.dragStartId = 0
            this.dragEndId = 0
            this.dragStartIndex = ''
            this.dragEndIndex = ''
        }
        handleTipsConfig(item) {
            return {
                placement: 'left-start',
                content: '内置模型组不支持删除和修改',
                disabled: item.classification_id.startsWith('ex_')
            }
        }
        goAssetRecord(item, tex) {
            if (item.bk_classification_id === 'bk_file') {
                return false
            }
            if (item.bk_classification_id === 'bk_host_manage') {
                this.$router.push({
                    name: 'AssetRecordsHost'
                })
            } else {
                this.$router.push({
                    name: item.bk_classification_id,
                    params: {
                        activeId: tex.bk_obj_id
                    }
                })
            }
        }
        checkModelDetail(tex) {
            this.$router.push({
                name: 'ModelDetail',
                query: {
                    modelInfo: JSON.stringify(tex)
                }
            })
        }
        getAllModelList() {
            this.loading = true
            Promise.all([this.getClassification(), this.getModelInfoList()]).then(res => {
                const [classifyRes, modelListRes] = res
                if (!classifyRes.result) {
                    this.$error(classifyRes.message)
                    this.modelList = []
                    return false
                }
                if (!modelListRes.result) {
                    this.$error(modelListRes.message)
                    this.modelList = []
                    return false
                }
                this.groupList = classifyRes.data || []
                if (classifyRes.result && modelListRes.result) {
                    let modelList = this.groupList.map(item => {
                        item.list = modelListRes.data.filter(tex => tex.classification_id === item.classification_id && tex.model_name.includes(this.searchKey))
                        return item
                    })
                    if (this.searchKey) {
                        modelList = modelList.filter(item => item.list.length)
                    }
                    this.modelList = modelList
                }
                if (!this.searchKey) {
                    this.allModelList = JSON.parse(JSON.stringify(this.modelList))
                }
            }).finally(() => {
                this.loading = false
            })
        }
        addModel() {
            if (!this.$BtnPermission({
                id: this.$route.name,
                type: 'SysRole_permissions'
            })) {
                return false
            }
            const addModel: any = this.$refs.addModel
            addModel.show('add')
        }
        groupOperation(type, data = {}) {
            if (!this.$BtnPermission({
                id: this.$route.name,
                type: 'SysRole_permissions'
            }) && type !== 'edit') {
                return false
            }
            const groupOperation: any = this.$refs.groupOperation
            groupOperation.show(type, data)
        }
        getIconUrl(tex) {
            try {
                return require(`@/assets/svg/model/${tex.icn || 'cc-default_默认'}.svg`)
            } catch (e) {
                return require('@/assets/svg/model/cc-default_默认.svg')
            }
        }
        getModelInfoList() {
            return this.$api.ModelManage.getModel({
                bk_obj_name: this.searchKey
            })
        }
        getClassification() {
            return this.$api.ModelManage.getClassification()
        }
        // 删除分组
        handleDelete(row) {
            if (!this.$BtnPermission({
                id: this.$route.name,
                type: 'SysRole_permissions'
            })) {
                return false
            }
            const params:any = {
                id: row.classification_id,
                classification_name: row.classification_name
            }
            this.$confirm('确认要删除此分组？', '提示', {
                center: true
            }).then(() => {
                this.confirmDeleteGroup(params)
            })
        }
        async confirmDeleteGroup(params) {
            this.loading = true
            const res = await this.$api.ModelManage.deleteClassification(params)
            if (!res.result) {
                this.$error(res.message)
                this.loading = false
                return
            }
            this.$success('删除成功')
            this.getAllModelList()
        }
    }
</script>

<style lang="scss" scoped>
.asset-model {
    display: flex;
    flex-direction: column;
    height: 100%;
}
.asset-model-wrapper {
    background-color: #fff;
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 0;
    .action-bar {
        display: flex;
    }
    .show-box {
        max-height: calc(100vh - 230px);
        overflow-y: auto;
        margin-top: 20px;
        padding: 0 10px;
        .model-list {
            padding: 10px 0 20px;
            .model-header {
                color: #333948;
                line-height: 21px;
                outline: 0;
                display: flex;
                align-items: center;
                font-size: 14px;
                .name {
                    font-weight: 700;
                    // margin-right: 5px;
                }
                .count {
                    font-weight: 700;
                    color: #c3cdd7;
                }
                &::before {
                    background: #c3cdd7;
                    content: "";
                    display: inline-block;
                    height: 14px;
                    margin: 0 10px 0 0;
                    vertical-align: middle;
                    width: 4px;
                }
                &-operation {
                    color: #3a84ff;
                    margin-left: 6px;
                    display: none;
                    .icon {
                        margin-right: 6px;
                    }
                }
                &:hover {
                    .show-operation {
                        display: flex;
                        cursor: pointer;
                    }
                }
                /deep/ .el-button--text {
                    padding: 0;
                }
            }
            .model-body {
                overflow: hidden;
                padding-left: 14px;
                .model-info {
                    background-color: #fff;
                    border: 1px solid #dde4eb;
                    border-radius: 4px;
                    cursor: pointer;
                    display: flex;
                    float: left;
                    height: 70px;
                    margin: 10px 10px 0 0;
                    position: relative;
                    width: calc(20% - 12px);
                    &.disabled {
                        opacity: .4;
                    }
                    .left-info {
                        flex: 1;
                        display: flex;
                        .icon-box {
                            width: 66px;
                            height: 70px;
                            display: flex;
                            align-items: center;
                            .drag-item {
                                width: 19px;
                                height: 100%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                opacity: 0;
                                color: #bfc7d2;
                                .weops-drag-drop {
                                    font-size: 18px;
                                }
                            }
                            img {
                                width: 28px;
                                height: 28px;
                            }
                        }
                        .info-box {
                            flex: 1;
                            width: 0;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            .model-id {
                                font-size: 12px;
                                color: #bfc7d2;
                            }
                        }
                        &:hover {
                            .drag-item {
                                opacity: 1;
                            }
                        }
                    }
                    .right-info {
                        width: 70px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        color: #3a84ff;
                        background-color: #f0f5ff;
                        .bk-icon {
                            font-size: 16px !important;
                        }
                        span {
                            margin-top: 2px;
                            font-size: 16px;
                        }
                    }
                    .is-disabled {
                        cursor: not-allowed;
                    }
                }
                .already-add-active-left::after,
                .already-add-active-right::after {
                    position: absolute;
                    display: block;
                    content: "";
                    width: 2px;
                    height: 100%;
                    background-color: #0D90FC;
                }
                .already-add-active-left::after {
                    left: -6px;
                }
                .already-add-active-right::after {
                    right: -6px;
                }
            }
        }
    }
}
</style>
