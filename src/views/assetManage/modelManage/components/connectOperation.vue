<template>
    <drawer-component
        :size="550"
        :title="`${isAdd ? '新建关联' : '编辑关联'}属性`"
        :visible="isShow"
        :quick-close="true"
        destroy-on-close
        custom-class="common-dialog-wrapper"
        :before-close="cancel"
        @changeVisible="changeVisible">
        <div slot="content" class="common-dialog-wrapper-main content-box">
            <el-form
                v-loading="loading"
                label-width="110"
                :model="formData"
                :rules="rules"
                ref="validateForm">
                <el-form-item label="关联名称" :prop="'name'">
                    <el-input
                        class="width100"
                        size="small"
                        disabled
                        placeholder="请输入关联名称"
                        v-model="assoName">
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="源模型"
                    :prop="'src_model_id'">
                    <el-select
                        class="width100"
                        :disabled="!isAdd"
                        size="small"
                        v-model="formData.src_model_id"
                        @change="changeSourceModel">
                        <el-option-group
                            v-for="group in modelList"
                            :label="group.classification_name"
                            :key="group.classification_id">
                            <el-option
                                v-for="option in group.list"
                                :disabled="option.disabled"
                                :key="option.model_id"
                                :value="option.model_id"
                                :label="option.model_name">
                            </el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>
                <div v-if="isAdd" class="sort">
                    <span class="exchange-icon" @click="exchangeSource">
                        <i class="el-icon-sort"></i>
                    </span>
                </div>
                <el-form-item
                    label="目标模型"
                    :prop="'dst_model_id'">
                    <el-select
                        class="width100"
                        size="small"
                        v-model="formData.dst_model_id"
                        :disabled="!isAdd"
                        @change="changeTargetModel">
                        <el-option-group
                            v-for="group in modelList"
                            :label="group.classification_name"
                            :key="group.classification_id">
                            <el-option
                                v-for="option in group.list"
                                :disabled="option.disabled"
                                :key="option.model_id"
                                :value="option.model_id"
                                :label="option.model_name">
                            </el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="关联类型"
                    :prop="'asst_id'">
                    <el-select
                        class="width100"
                        size="small"
                        v-model="formData.asst_id"
                        :disabled="!isAdd"
                        :clearable="false"
                        @change="changeConnectType">
                        <el-option
                            v-for="option in connectTypeList"
                            :key="option.id"
                            :value="option.id"
                            :label="option.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="约束条件"
                    :prop="'mapping'">
                    <el-select
                        class="width100"
                        size="small"
                        v-model="formData.mapping"
                        :clearable="false"
                        :disabled="!isAdd">
                        <el-option
                            v-for="option in targetBindList"
                            :key="option.id"
                            :value="option.id"
                            :label="option.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="sourceModelDetail && targetModelDetail && connectTypeDetail" label="效果示意">
                    <div class="effect-representation">
                        <div class="model-item">
                            <div class="model-icon">
                                <img :src="getIconUrl(sourceModelDetail)" alt="">
                            </div>
                            <span class="model-name">{{sourceModelDetail.model_name}}</span>
                        </div>
                        <div class="model-edge">
                            <div class="connection">
                                <span v-overflow-tooltip class="name">{{connectTypeDetail.name}}</span>
                            </div>
                        </div>
                        <div class="model-item">
                            <div class="model-icon">
                                <img :src="getIconUrl(targetModelDetail)" alt="">
                            </div>
                            <span class="model-name">{{targetModelDetail.model_name}}</span>
                        </div>
                    </div>
                    <!-- <div class="tip-text">
                        <span>{{assoName}}</span>
                    </div> -->
                    <div class="tip-text">
                        <span>{{connectTypeDetail.name}}</span>:
                        <span class="ml5">{{connectTypeMap[formData.asst_id] || connectTypeMap.default}}</span>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer">
            <el-button
                :disabled="loading || !isAdd"
                :loading="loading"
                type="primary"
                size="small"
                @click="confirm">
                确认
            </el-button>
            <el-button
                size="small"
                type="default"
                @click="cancel">
                取消
            </el-button>
        </div>
    </drawer-component>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator'
    import DrawerComponent from '@/components/comDrawer/index.vue'
    import { TARGET_BIND_LIST } from '@/common/constants/assetManage/modelManage'
    @Component({
        components: {
            DrawerComponent
        }
    })
    export default class connectOperation extends Vue {
        @Prop({
            type: Array,
            default: () => []
        })
        modelList: Array<any>
        @Prop({
            type: String,
            default: () => ''
        })
        modelId: string
        @Prop({
            type: Array,
            default: () => []
        })
        connectTypeList: Array<any>

        hostDetail: any = ''
        isShow: boolean = false
        formData = {
            src_model_id: '',
            dst_model_id: '',
            asst_id: '',
            mapping: '',
            model_asst_id: ''
        }
        formDataV2 = {}
        rules = {
            src_model_id: [
                {
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }
            ],
            dst_model_id: [
                {
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }
            ],
            asst_id: [
                {
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }
            ],
            mapping: [
                {
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }
            ],
            name: [
                {
                    required: true,
                    validator: (rule, value, callback) => this.validateName(rule, value, callback),
                    trigger: 'blur'
                }
            ]
        }
        loading: boolean = false
        protocolList = [
            {
                id: 'rdp',
                name: 'RDP'
            },
            {
                id: 'ssh',
                name: 'SSH'
            }
        ]
        targetBindList = TARGET_BIND_LIST
        type: string = ''
        relDetail: any = ''
        sourceModelDetail: any = null
        targetModelDetail: any = null
        connectTypeDetail: any = null
        connectTypeMap = {
            belong: '常用与组织或管理层级的连接',
            group: '设备部件和整体之间的连接',
            bk_mainline: '系统内置类型，仅用于业务拓扑的节点关系，仅限系统使用',
            run: '程序与操作系统之间的连接',
            connect: '常用与网络设备之间的连接',
            default: '资产节点之间的连接',
            install_on: '数据库/中间库等与主机之间的连接'
        }
        get isAdd() {
            return this.type === 'add'
        }
        get assoName() {
            if (this.connectTypeDetail && this.sourceModelDetail && this.targetModelDetail) {
                return `${this.sourceModelDetail.model_name} ${this.connectTypeDetail.name} ${this.targetModelDetail.model_name}`
            }
            return ''
        }
        validateName(rule, value, callback) {
            if (!this.assoName) {
                callback(new Error('必填项'))
            } else {
                callback()
            }
        }
        getIconUrl(tex) {
            try {
                return require(`@/assets/svg/model/${tex.icn || 'cc-default_默认'}.svg`)
            } catch (e) {
                return require('@/assets/svg/model/cc-default_默认.svg')
            }
        }
        changeVisible(val) {
            this.isShow = val
        }
        changeConnectType() {
            this.getConnectTypeDetail()
        }
        exchangeSource() {
            const target = JSON.parse(JSON.stringify(this.formData.src_model_id))
            this.formData.src_model_id = JSON.parse(JSON.stringify(this.formData.dst_model_id))
            this.formData.dst_model_id = target
            this.getModelDetail()
        }
        changeSourceModel() {
            if (!this.formData.src_model_id) {
                this.formData.dst_model_id = this.modelId
            }
            this.getModelDetail()
        }
        changeTargetModel() {
            if (!this.formData.dst_model_id) {
                this.formData.src_model_id = this.modelId
            }
            this.getModelDetail()
        }
        show(type, data) {
            for (const key in this.formData) {
                this.formData[key] = ''
            }
            this.type = type
            this.isShow = true
            this.formData.src_model_id = this.modelId
            if (!this.isAdd) {
                this.relDetail = data
                for (const key in data) {
                    if (this.formData.hasOwnProperty(key)) {
                        this.formData[key] = data[key]
                    }
                }
            }
            this.getModelDetail()
            this.getConnectTypeDetail()
            this.formDataV2 = JSON.parse(JSON.stringify(this.formData))
        }
        getConnectTypeDetail() {
            this.connectTypeDetail = this.connectTypeList.find(item => item.id === this.formData.asst_id)
        }
        getModelDetail() {
            this.sourceModelDetail = null
            this.targetModelDetail = null
            for (const item of this.modelList) {
                if (!this.sourceModelDetail) {
                    this.sourceModelDetail = item.list.find(tex => tex.model_id === this.formData.src_model_id)
                }
                if (!this.targetModelDetail) {
                    this.targetModelDetail = item.list.find(tex => tex.model_id === this.formData.dst_model_id)
                }
                // 如果两者都找到了，提前退出循环
                if (this.sourceModelDetail && this.targetModelDetail) {
                    break
                }
            }
        }
        confirm() {
            this.$refs.validateForm.validate().then(validator => {
                const params = this.formData
                params.model_asst_id = `${this.formData.src_model_id}_${this.formData.asst_id}_${this.formData.dst_model_id}`
                if (!this.isAdd) {
                    params.id = this.relDetail.id
                }
                this.save(params)
            })
        }
        save(params) {
            this.loading = true
            const url = this.isAdd ? 'createAssociation' : 'updateAssociation'
            this.$api.ModelManage[url](params).then(res => {
                if (!res.result) {
                    this.$error(res.message)
                    return false
                }
                this.$success(`${this.isAdd ? '新增' : '编辑'}模型关系成功`)
                this.isShow = false
                this.$emit('refreshRel')
            }).finally(() => {
                this.loading = false
            })
        }
        cancel() {
            const flag = this.$compareFormData(this.formData, this.formDataV2)
            if (!flag) {
                this.$confirm('放弃将导致未保存信息丢失', '是否放弃本次操作？', {
                    center: true
                }).then(() => {
                    this.isShow = false
                })
            } else {
                this.isShow = false
            }
        }
    }
</script>

<style lang="scss" scoped>
.width100 {
    width: 100%;
}
.content-header {
    .ip {
        color: #c4c6cc;
        font-size: 13px;
    }
}
.content-box {
    .tip-text {
        color: #868b97;
        font-size: 12px;
        margin-top: 8px;
        text-align: center;
    }
    .effect-representation {
        padding: 10px 68px;
        background-color: #f3f8ff;
        display: flex;
        justify-content: space-between;
        .model-edge {
            flex: 1;
            margin: 0 3px;
            .connection {
                height: 46px;
                position: relative;
                .name {
                    background: #fff;
                    color: #868b97;
                    font-size: 12px;
                    left: 50%;
                    max-width: 150px;
                    overflow: hidden;
                    padding: 2px 8px;
                    position: absolute;
                    text-align: center;
                    text-overflow: ellipsis;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    white-space: nowrap;
                }
                &::before {
                    background: #c4c6cc;
                    content: "";
                    height: 1px;
                    left: 0;
                    margin-top: -0.5px;
                    position: absolute;
                    top: 50%;
                    width: 100%;
                }
                &::after {
                    border: 4px solid transparent;
                    border-left: 8px solid #c4c6cc;
                    content: "";
                    height: 0;
                    position: absolute;
                    right: -5px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 0;
                }
            }
        }
        .model-item {
            align-items: center;
            display: flex;
            flex-direction: column;
            .model-icon {
                width: 46px;
                height: 46px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #fff;
                border-radius: 50%;
                img {
                    width: 24px;
                    height: 24px;
                }
            }
            .model-name {
                color: #868b97;
                font-size: 12px;
                margin-top: 2px;
            }
        }
    }
    .sort {
        display: flex;
        justify-content: center;
        margin-top: 10px;
        .exchange-icon {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 1px solid #3a84ff;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            .el-icon-sort {
                font-size: 14px !important;
                color: #3a84ff;
            }
        }
    }
}
</style>
