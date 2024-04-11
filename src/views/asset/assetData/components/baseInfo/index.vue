<template>
    <div class="base-info">
        <el-form
            label-width="200"
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
                        class="custom-form-item"
                        :key="tex['attr_id']"
                        :label="tex['attr_name']"
                        :prop="tex['attr_id']">
                        <span :class="['custom-label',tex.is_required && 'label-required']">
                            <span v-overflow-tooltip class="attr-name">{{ tex['attr_name'] }}</span>
                            <span>:</span>
                        </span>
                        <template v-if="tex.isEdit">
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
                        </template>
                        <template v-else>
                            <div class="operate-content">
                                <span v-overflow-tooltip class="content">{{ getShowValue(tex) }}</span>
                                <span class="operate-edit">
                                    <span v-if="!tex.isEdit" class="edit-icon">
                                        <span class="cw-icon weops-edit operate-icon-edit" @click="editInfo(tex)"></span>
                                        <span class="cw-icon weops-copy operate-icon-copy" v-copy="getShowValue(tex)"></span>
                                    </span>
                                </span>
                            </div>
                        </template>
                        <span class="operate-confirm">
                            <span v-if="tex.isEdit" class="confirm-cancel">
                                <span class="cw-icon weops-complete operate-icon-left" @click="confirmEdit(tex)"></span>
                                <span class="cw-icon weops-close operate-icon-right" @click="cancelEdit(tex)"></span>
                            </span>
                        </span>
                    </el-form-item>
                </div>
            </div>
        </el-form>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator'
    @Component({
        name: 'add-resource',
        components: {}
    })
    export default class AddResource extends Vue {
    @Prop({
        type: Array,
        default: () => []
    })
    groupList: Array<any>

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
    propertyList: Array<any> = []
    instDetail: any = {}
    loading: boolean = false
    formData: any = {}
    rules = {}
    formDataV2 = {}

    mounted() {
        this.initData()
    }
    async getModelAttrList() {
        const params = {
            id: this.$route.query.modelId
        }
        const { result, message, data } = await this.$api.ModelManage.getModelAttrList(params)
        if (!result) {
            return this.$error(message)
        }
        this.propertyList = data
    }
    async getInstDetial() {
        const params = {
            id: this.$route.query.instId
        }
        const { result, message, data } = await this.$api.AssetData.getInstDetial(params)
        if (!result) {
            return this.$error(message)
        }
        this.instDetail = data
    }
    // 编辑信息
    editInfo(tex) {
        this.$set(tex, 'isEdit', true)
    }
    // 复制信息
    getShowValue(tex) {
        let str = '--'
        switch (tex.attr_type) {
            case 'organization':
                str = this.findLabelByValue(this.groupList, this.formData[tex.attr_id])
                break
            case 'enum':
                str = tex.option.find(item => item.id === this.formData[tex.attr_id])?.name || '--'
                break
            case 'bool':
                str = this.formData[tex.attr_id] ? '是' : '否'
                break
            default:
                str = this.formData[tex.attr_id] || '--'
                break
        }
        return str
    }
    findLabelByValue(arr, value) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].value === value) {
            return arr[i].label
          }
          if (arr[i].children && arr[i].children.length) {
            const label = this.findLabelByValue(arr[i].children, value)
            if (label) {
              return label
            }
          }
        }
        return '--'
    }
    initData() {
        this.loading = true
        Promise.all([this.getModelAttrList(), this.getInstDetial()]).finally(() => {
            this.loading = false
            const groupProperty = this.propertyList.find(item => item.attr_id === 'organization')
            if (!groupProperty) {
                this.propertyList = [
                    ...this.propertyList,
                    ...this.resourcList.at(0).list
                ]
            }
            this.propertyList.forEach(item => {
                if (item.is_required) {
                    this.$set(this.rules, item.attr_id, {
                        required: true,
                        message: '必填项',
                        trigger: 'blur'
                    })
                }
                const defaultVal = item.attr_type === 'bool' ? false : item.attr_type === 'organization' ? this.$route.query.groupId : ''
                this.$set(this.formData, item.attr_id, this.instDetail[item.attr_id] || defaultVal)
            })
            const baseInfo = this.resourcList.find(item => item.id === 'base')
            baseInfo.list = this.propertyList.filter(item => item.attr_id !== 'organization')
            this.formDataV2 = this.$copy(this.formData)
        })
    }
    confirmEdit(tex) {
        const addResourceForm: any = this.$refs.addResourceForm
        addResourceForm.validateField([tex.attr_id], async errMsg => {
            if (!errMsg) {
                const info = this.$copy(this.formDataV2)
                info[tex.attr_id] = this.formData[tex.attr_id]
                const params = {
                    id: this.$route.query.instId,
                    instance_info: info
                }
                const { result, message } = await this.$api.AssetData.updateInstance(params)
                if (!result) {
                    return this.$error(message)
                }
                this.$success('修改成功！')
                this.formDataV2[tex.attr_id] = this.formData[tex.attr_id]
                tex.isEdit = false
            }
        })
    }
    // 取消编辑
    cancelEdit(tex) {
        this.formData[tex.attr_id] = this.formDataV2[tex.attr_id]
        tex.isEdit = false
        const addResourceForm: any = this.$refs.addResourceForm
        addResourceForm.clearValidate()
    }
}
</script>

<style scoped lang="scss">
.show-info {
    display: flex;
    flex-wrap: wrap;
    .custom-form-item {
        display: flex;
        width: 33%;
    }
    .operate-edit,
    .operate-confirm {
        display: flex;
        width: 40px;
        min-width: 40px;
        cursor: pointer;
        margin-left: 10px;
        color: #3A84FF;
    }
    .operate-edit {
        display: none;
    }
}
.header {
    width: 100%;
    font-weight: 600;
    margin-bottom: 20px;
    .title-icon {
        cursor: pointer;
    }
}
/* stylelint-disable selector-class-pattern */
/deep/ .el-form-item__label {
    display: none;
}
/deep/ .el-form-item__content {
    width: 100%;
    display: flex;
    align-items: center;
    margin-right: 10%;
    .custom-label {
        width: 120px;
        min-width: 120px;
        display: flex;
        justify-content: space-between;
        margin: 0 10px 0 20px;
        .attr-name {
            width: 100px;
        }
    }
    .form-item {
        width: 100%;
    }
    .operate-content {
        display: flex;
        align-items: center;
        width: 60%;
        .content {
            max-width: 100%;
        }
        &:hover {
            .operate-edit {
                display: flex;
            }
        }
    }
}
.label-required {
    &::before {
        content: "*";
        color: #F56C6C;
        margin-right: 4px;
    }
}
</style>
