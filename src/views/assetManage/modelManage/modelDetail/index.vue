<template>
    <div class="model-detail">
        <div class="detail-header">
            <div class="header-info">
                <div class="icon">
                    <img :src="require(`@/assets/svg/model/${modelInfo.icn || 'cc-default_默认'}.svg`)" alt="">
                </div>
                <div class="object">
                    <div class="object-name">{{ modelInfo.model_name }}</div>
                    <div class="object-id">{{ modelInfo.model_id }}</div>
                </div>
                <!-- <div class="asset">
                        <span>资产数量：</span>
                        <span class="asset-num">12</span>
                    </div> -->
            </div>
            <div class="header-operate">
                <el-button type="text" size="mini" icon="el-icon-edit" @click="editModel">编辑</el-button>
                <el-button type="text" size="mini" icon="el-icon-delete" @click="handleDelete">删除</el-button>
            </div>
        </div>
        <el-card class="mt10">
            <menu-tab type="line" :panels="panels" :active-panel="active" @click="toTabMenu"></menu-tab>
            <div v-if="active === 'property'">
                <el-button class="mt10 mb10" size="small" type="primary" @click="editAttr()">
                    添加属性
                </el-button>
                <com-table
                    :data="propertyData"
                    :columns="columns"
                    v-loading="loading"
                    :height="tableMaxHeight">
                    <template slot="operation" slot-scope="{ row }">
                        <el-button type="text" size="mini" @click="editAttr(row)">编辑</el-button>
                        <el-button type="text" size="mini" @click="deleteAtrr(row)">删除</el-button>
                    </template>
                    <template slot="require" slot-scope="{ row }">
                        <el-tag :type="row.is_required ? 'success' : ''">{{row.is_required ? '是' : '否'}}</el-tag>
                    </template>
                    <template slot="attrType" slot-scope="{ row }">
                        <span>{{ showAttrType(row.attr_type) }}</span>
                    </template>
                </com-table>
            </div>
            <template v-else>
                <el-button class="mt10 mb10" size="small" type="primary" @click="relationOperate('add')">
                    添加关联
                </el-button>
                <com-table
                    :data="relationData"
                    :columns="relateColumns"
                    v-loading="relateLoading"
                    :height="tableMaxHeight">
                    <template slot="mapping" slot-scope="{ row }">
                        {{ showMapping(row) }}
                    </template>
                    <template slot="src_model_id" slot-scope="{ row }">
                        {{ showModelName(row.src_model_id) }}
                    </template>
                    <template slot="dst_model_id" slot-scope="{ row }">
                        {{ showModelName(row.dst_model_id) }}
                    </template>
                    <template slot="asst_id" slot-scope="{ row }">
                        {{ showConnectType(row.asst_id,'label') }}
                    </template>
                    <template slot="model_asst_id" slot-scope="{ row }">
                        {{ showConnectName(row) }}
                    </template>
                    <template slot="operation" slot-scope="{ row }">
                        <el-button type="text" size="mini" @click="relationOperate('edit',row)">编辑</el-button>
                        <el-button type="text" size="mini" @click="deleteAsso(row)">删除</el-button>
                    </template>
                </com-table>
            </template>
        </el-card>
        <add-model ref="editModel" :group-list="modelGroupList" @refreshModel="refreshModel"></add-model>
        <attributes-operation
            ref="attributesOperation"
            :model-id="modelInfo.model_id"
            @getTableData="handlerChange" />
        <connect-operation
            ref="connectOperation"
            :model-list="modelList"
            :connect-type-list="connectTypeList"
            :model-id="modelInfo.model_id"
            @refreshRel="getModelAssoList">
        </connect-operation>
    </div>
</template>

<script lang="ts">
    import { Component, Vue, Watch } from 'vue-property-decorator'
    import AddModel from '../components/modelOperation.vue'
    import MenuTab from '@/components/menuTab/index.vue'
    import ComTable from '@/components/comTable/index.vue'
    import AttributesOperation from '../components/attributesOperation.vue'
    import ConnectOperation from '../components/connectOperation.vue'
    import { TableData } from '@/common/types'
    import { PROPERTY_COLUMNS, OPERATE_TYPE_LIST, RELATION_COLUMNS, TARGET_BIND_LIST } from '@/common/constants/assetManage/modelManage'

    @Component({
        components: {
            AddModel,
            MenuTab,
            ComTable,
            AttributesOperation,
            ConnectOperation
        }
    })
    export default class ModelManage extends Vue {
        panels: Array<any> = [
            { name: 'property', label: '字段属性' },
            { name: 'relation', label: '关联关系' }
        ]
        active: string = 'property'
        columns: Array<TableData> = PROPERTY_COLUMNS
        relateColumns: Array<TableData> = RELATION_COLUMNS
        propertyData: Array<any> = []
        relationData: Array<any> = []
        loading: boolean = false
        relateLoading: boolean = false
        pageOccupiedHeight: number = 386
        modelGroupList: Array<any> = []
        modelList: Array<any> = []
        modelInfoList: Array<any> = []
        connectTypeList: Array<any> = []

        get powerParams() {
            return {}
        }

        get modelInfo() {
            const modelInfo:any = this.$route.query.modelInfo || '{}'
            return JSON.parse(modelInfo)
        }

        @Watch('active')
        onAlreadyAddListChanged(val) {
            if (val) {
                val === 'property' ? this.getModelAttrList() : this.getModelAssoList()
            }
        }

        mounted() {
            this.getAllModelList()
        }

        showMapping(row) {
            return TARGET_BIND_LIST.find(item => item.id === row.mapping)?.name || '--'
        }
        showModelName(id) {
            return this.modelInfoList.find(item => item.model_id === id)?.model_name || '--'
        }
        showConnectType(id, key) {
            return this.connectTypeList.find(item => item.id === id)?.[key] || '--'
        }

        showConnectName(row) {
            const sourceName = this.showModelName(row.src_model_id)
            const targetName = this.showModelName(row.dst_model_id)
            const relation = this.showConnectType(row.asst_id, 'name')
            return `${sourceName} ${relation} ${targetName}`
        }
        getAllModelList() {
            this.loading = true
            Promise.all([this.getClassification(), this.getModelInfoList(), this.getModelAttrList('init'), this.getConnectTypeList()]).finally(() => {
                this.modelList = this.modelGroupList.map(item => {
                    item.list = this.modelInfoList.filter(tex => tex.classification_id === item.classification_id)
                    return item
                })
                this.loading = false
            })
        }

        showAttrType(type) {
            return OPERATE_TYPE_LIST.find(item => item.id === type)?.name || '--'
        }

        relationOperate(type, row = {}) {
            if (!this.$BtnPermission(this.powerParams)) {
                return false
            }
            const connectOperation: any = this.$refs.connectOperation
            connectOperation.show(type, row)
        }
        async getModelAssoList() {
            try {
                const params = {
                    id: this.modelInfo.model_id
                }
                this.relateLoading = true
                const { result, message, data } = await this.$api.ModelManage.getModelAssoList(params)
                if (!result) {
                    return this.$error(message)
                }
                this.relationData = data
            } catch (e) {
                console.error(e)
            } finally {
                this.relateLoading = false
            }
        }

        async getConnectTypeList() {
            const { result, data } = await this.$api.ModelManage.getAssotypeList()
            if (!result) {
                return false
            }
            this.connectTypeList = data.map(item => {
                return {
                    id: item.asst_id,
                    label: item.asst_name,
                    name: `${item.asst_name}(${item.asst_id})`
                }
            })
        }

        async getModelAttrList(type?) {
            try {
                const params = {
                    id: this.modelInfo.model_id
                }
                this.loading = true
                const { result, message, data } = await this.$api.ModelManage.getModelAttrList(params)
                if (!result) {
                    return this.$error(message)
                }
                this.propertyData = data
            } catch (e) {
                console.error(e)
            } finally {
                this.loading = type === 'init'
            }
        }

        toTabMenu(item) {
            this.active = item.name
        }

        editAttr(row) {
            if (!this.$BtnPermission(this.powerParams)) {
                return false
            }
            const attributesOperation: any = this.$refs.attributesOperation
            attributesOperation.show({
                id: this.modelInfo.model_id,
                type: row ? '编辑' : '添加',
                rowData: row,
                groupList: []
            })
        }

        editModel() {
            if (!this.$BtnPermission(this.powerParams)) {
                return false
            }
            const editModel: any = this.$refs.editModel
            editModel.show('edit', this.modelInfo)
        }

        async getClassification() {
            const { result, message, data } = await this.$api.ModelManage.getClassification()
            if (!result) {
                return this.$error(message)
            }
            this.modelGroupList = data
        }

        async getModelInfoList() {
            const { result, message, data } = await this.$api.ModelManage.getModel()
            if (!result) {
                return this.$error(message)
            }
            this.modelInfoList = data
        }

        refreshModel(params) {
            this.$router.replace({
                name: 'ModelDetail',
                query: {
                    modelInfo: JSON.stringify(params)
                }
            })
        }

        // 删除模型
        handleDelete(row) {
            if (!this.$BtnPermission({
                id: this.$route.name,
                type: 'SysRole_permissions'
            })) {
                return false
            }
            const params:any = {
                id: this.modelInfo.model_id
            }
            this.$confirm('确认要删除此模型？', '提示', {
                center: true
            }).then(() => {
                this.deleteModel(params)
            })
        }

        async deleteModel(params) {
            const res = await this.$api.ModelManage.deleteModel(params)
            if (!res.result) {
                return this.$error(res.message)
            }
            this.$success('删除成功')
            this.$router.go(-1)
        }
        // 删除模型
        deleteAsso(row) {
            if (!this.$BtnPermission({
                id: this.$route.name,
                type: 'SysRole_permissions'
            })) {
                return false
            }
            const params:any = {
                id: row.model_asst_id
            }
            this.$confirm('确认要删除此关联？', '提示', {
                center: true
            }).then(() => {
                this.deleteModelAsso(params)
            })
        }

        async deleteModelAsso(params) {
            const res = await this.$api.ModelManage.deleteAssociation(params)
            if (!res.result) {
                return this.$error(res.message)
            }
            this.$success('删除成功')
            this.getModelAssoList()
        }

        // 删除属性
        deleteAtrr(row) {
            if (!this.$BtnPermission({
                id: this.$route.name,
                type: 'SysRole_permissions'
            })) {
                return false
            }
            const params:any = {
                id: this.modelInfo.model_id,
                attr_id: row.attr_id
            }
            this.$confirm('确认要删除此属性？', '提示', {
                center: true
            }).then(() => {
                this.deleteModelAttr(params)
            })
        }

        async deleteModelAttr(params) {
            const res = await this.$api.ModelManage.deleteModelAttr(params)
            if (!res.result) {
                return this.$error(res.message)
            }
            this.$success('删除成功')
            this.getModelAttrList()
        }

        handlerChange() {
            this.getModelAttrList()
        }
    }
</script>

<style lang="scss" scoped>
.model-detail {
    .detail-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 4px;
        background-image: url(~@/assets/img/model_bg.png);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        padding: 20px 60px 20px 20px;
        .header-info {
            display: flex;
            align-items: center;
            .icon {
                cursor: pointer;
                height: 50px;
                margin: 0 auto;
                width: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                img {
                    width: 24px;
                    height: 24px;
                }
            }
            .object {
                margin: 0 20px;
                .object-id {
                    font-size: 12px;
                    color: #C9CDD4;
                }
            }
            .asset {
                .asset-num {
                    color: #409EFF;
                    border-bottom: 1px solid #409EFF;
                }
            }
        }
    }
}
</style>
