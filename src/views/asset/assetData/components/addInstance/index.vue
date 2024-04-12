<template>
    <drawer-component
        :title="`${isAdd ? '新建' : '编辑'}资产`"
        :size="640"
        :visible="visible"
        destroy-on-close
        custom-class="common-dialog-wrapper"
        :before-close="beforeCloseDialog"
        @changeVisible="changeVisible">
        <div slot="content" class="content-box common-dialog-wrapper-main">
            <el-form
                label-width="280"
                ref="addResourceForm"
                :rules="rules"
                :model="formData">
                <div class="info-box" v-for="item in resourcList" :key="item.id">
                    <div :class="['header',!item.isExpand && 'mb20']">
                        <span
                            :class="['cw-icon' ,'title-icon',item.isExpand ? 'weops-triangle-down' : 'weops-triangle-right']"
                            @click="item.isExpand = !item.isExpand">
                        </span>
                        <span class="title">{{ item.label }}</span>
                    </div>
                    <div v-show="item.isExpand" class="show-info">
                        <el-form-item
                            v-for="tex in item.list"
                            :key="tex['attr_id']"
                            :label="tex['attr_name']"
                            :prop="tex['attr_id']">
                            <el-date-picker
                                v-if="['date', 'time'].includes(tex['attr_type'])"
                                class="form-item"
                                size="small"
                                v-model="formData[tex.attr_id]"
                                :placeholder="'选择日期时间'"
                                :value-format="tex['attr_type'] === 'time' ? 'yyyy-MM-dd HH:mm:ss' : ''"
                                :type="tex['attr_type'] === 'date' ? 'date' : 'datetime'">
                            </el-date-picker>
                            <el-select
                                class="form-item"
                                v-else-if="['enum', 'list'].includes(tex['attr_type'])"
                                size="small"
                                v-model="formData[tex.attr_id]"
                                filterable>
                                <el-option
                                    v-for="option in tex.option"
                                    :key="option.id"
                                    :value="option.id"
                                    :label="option.name">
                                </el-option>
                            </el-select>
                            <el-switch
                                class="form-item"
                                v-else-if="tex['attr_type'] === 'bool'"
                                size="small"
                                v-model="formData[tex.attr_id]">
                            </el-switch>
                            <el-cascader
                                v-else-if="tex['attr_type'] === 'organization'"
                                :props="{
                                    emitPath: false,
                                    checkStrictly: true
                                }"
                                class="form-item"
                                size="small"
                                v-model="formData[tex.attr_id]"
                                :options="groupList">
                            </el-cascader>
                            <el-input
                                v-else
                                v-model="formData[tex.attr_id]"
                                size="small"
                                clearable
                                type="text">
                            </el-input>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </div>
        <div slot="footer">
            <el-button
                :loading="loading"
                :type="'primary'"
                size="small"
                @click="handleSubmit">
                保存
            </el-button>
            <el-button
                size="small"
                @click="beforeCloseDialog">
                关闭
            </el-button>
        </div>
    </drawer-component>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator'
    import DrawerComponent from '@/components/comDrawer/index.vue'
    @Component({
        name: 'add-resource',
        components: {
            DrawerComponent
        }
    })
    export default class AddResource extends Vue {
    @Prop({
        type: String,
        default: () => ''
    })
    modelId: string
    @Prop({
        type: Array,
        default: () => []
    })
    groupList: Array<any>
    @Prop({
        type: Object,
        default: () => ({})
    })
    currentNode: any

    configInfo: any = {
        row: null,
        propertyList: [],
        mode: 'add'
    }
    resourcList: Array<any> = [
        {
            label: '组织信息',
            id: 'group',
            list: [{
                attr_id: 'organization',
                attr_name: '所属组织',
                attr_type: 'organization',
                is_required: true
            }],
            isExpand: true
        },
        {
            label: '基础信息',
            id: 'base',
            list: [],
            isExpand: true
        }
    ]
    visible: boolean = false
    loading: boolean = false
    formData: any = {}
    rules = {}
    formDataV2 = {}
    expand: boolean = true

    get isAdd() {
        return this.configInfo.mode === 'add'
    }

    changeVisible(val) {
        this.visible = val
    }
    showDialog(configInfo) {
        this.visible = true
        this.configInfo = configInfo
        this.initData()
        this.formDataV2 = this.$copy(this.formData)
    }
    initData() {
        const groupProperty = this.configInfo.propertyList.find(item => item.attr_id === 'organization')
        if (!groupProperty) {
            this.configInfo.propertyList = [
                ...this.configInfo.propertyList,
                ...this.resourcList.at(0).list
            ]
        }
        this.configInfo.propertyList.forEach(item => {
            if (item.is_required) {
                this.rules[item.attr_id] = [
                    {
                        required: true,
                        message: '必填项',
                        trigger: 'blur'
                    }
                ]
            }
            const defaultVal = item.attr_type === 'bool' ? false : item.attr_type === 'organization' ? this.currentNode.id : ''
            this.$set(this.formData, item.attr_id, this.configInfo.row?.[item.attr_id] || defaultVal)
        })
        const baseInfo = this.resourcList.find(item => item.id === 'base')
        baseInfo.list = this.configInfo.propertyList.filter(item => item.attr_id !== 'organization')
    }
    beforeCloseDialog() {
        const flag = this.$compareFormData(this.formData, this.formDataV2)
        if (!flag) {
        this.$confirm('放弃将导致未保存信息丢失', '是否放弃本次操作？', {
            center: true
        }).then(() => {
            this.visible = false
        })
        return
    }
    this.visible = false
    }
    handleSubmit() {
        const addResourceForm: any = this.$refs.addResourceForm
        addResourceForm.validate(async valid => {
            if (valid) {
                this.loading = true
                try {
                    const url = this.isAdd ? 'createInstance' : 'updateInstance'
                    const tips = `${this.isAdd ? '新建' : '修改'}资产成功`
                    if (!this.isAdd) {
                        this.formData.id = this.configInfo.row?.id
                    }
                    const params = {
                        model_id: this.modelId,
                        instance_info: this.formData
                    }
                    const { result, message } = await this.$api.AssetData[url](params)
                    if (!result) {
                        return this.$error(message)
                    }
                    this.visible = false
                    this.$success(tips)
                    this.$emit('on-success', params)
                } finally {
                    this.loading = false
                }
            }
        })
    }
}
</script>

<style scoped lang="scss">
.show-info {
    display: flex;
    flex-wrap: wrap;
}
/deep/.el-form-item {
    width: 286px;
    &:nth-of-type(2n) {
        margin-left: 20px;
    }
}
.form-item {
    width: 100%;
}
.header {
    width: 100%;
    font-weight: 600;
    .title-icon {
        cursor: pointer;
    }
}
/* stylelint-disable selector-class-pattern */
/deep/ .el-form-item__label {
    text-align: left;
}
</style>
