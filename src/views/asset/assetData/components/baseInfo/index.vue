<template>
    <div class="base-info" v-loading="loading">
        <el-form
            label-width="200"
            ref="addResourceForm"
            :rules="rules"
            :model="formData">
            <collapse :collapse-list="resourcList">
                <template slot="content" slot-scope="{ collRow }">
                    <div class="show-info">
                        <el-form-item
                            v-for="tex in collRow.list"
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
                                    v-else-if="['enum', 'list', 'user'].includes(tex['attr_type'])"
                                    size="small"
                                    :multiple="tex['attr_type'] === 'user'"
                                    v-model="formData[tex.attr_id]"
                                    filterable>
                                    <el-option
                                        v-for="option in tex['attr_type'] === 'user' ? userList : tex.option"
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
                                    :show-password="tex['attr_type'] === 'pwd'"
                                    :type="tex['attr_type'] === 'pwd' ? 'password' : 'text'">
                                </el-input>
                            </template>
                            <template v-else>
                                <div class="operate-content">
                                    <span v-overflow-tooltip class="content">{{ getShowValue(tex) }}</span>
                                    <span class="operate-edit">
                                        <span v-if="!tex.isEdit" class="edit-icon">
                                            <span v-if="tex.editable" class="cw-icon weops-edit operate-icon-edit" @click="editInfo(tex)"></span>
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
                </template>
            </collapse>
        </el-form>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator'
    import Collapse from '@/components/collapse/index.vue'
    import { getAssetAttrValue } from '@/controller/func/common'
    @Component({
        name: 'add-resource',
        components: {
            Collapse
        }
    })
    export default class AddResource extends Vue {
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
    propertyList: Array<any>

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
    instDetail: any = {}
    loading: boolean = false
    formData: any = {}
    rules = {}
    formDataV2 = {}

    mounted() {
        this.getInstDetial()
    }
    async getInstDetial() {
        this.loading = true
        try {
            const params = {
                id: this.$route.query.instId
            }
            const { result, message, data } = await this.$api.AssetData.getInstDetial(params)
            if (!result) {
                return this.$error(message)
            }
            this.instDetail = data
            this.initData(data)
        } finally {
            this.loading = false
        }
    }
    // 编辑信息
    editInfo(tex) {
        this.$set(tex, 'isEdit', true)
    }
    getShowValue(field) {
        field.key = field.attr_id
        return getAssetAttrValue(field, this.formData, {
            groupList: this.groupList,
            userList: this.userList
        })
    }
    initData(data) {
        let propertyList = this.$copy(this.propertyList)
        const groupProperty = propertyList.find(item => item.attr_id === 'organization')
        if (!groupProperty) {
            propertyList = [
                ...propertyList,
                ...this.resourcList.at(0).list
            ]
        }
        propertyList.forEach(item => {
            if (item.is_required) {
                this.$set(this.rules, item.attr_id, {
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                })
            }
            const defaultVal = item.attr_type === 'bool' ? false : item.attr_type === 'organization' ? this.$route.query.groupId : ''
            this.$set(this.formData, item.attr_id, data[item.attr_id] || defaultVal)
        })
        const baseInfo = this.resourcList.find(item => item.id === 'base')
        baseInfo.list = propertyList.filter(item => item.attr_id !== 'organization')
        this.formDataV2 = this.$copy(this.formData)
    }
    confirmEdit(tex) {
        const addResourceForm: any = this.$refs.addResourceForm
        addResourceForm.validateField([tex.attr_id], async errMsg => {
            if (!errMsg) {
                const info = this.$copy(this.formDataV2)
                info[tex.attr_id] = this.formData[tex.attr_id]
                const params = {
                    id: this.$route.query.instId,
                    body: {}
                }
                params.body[tex.attr_id] = this.formData[tex.attr_id]
                try {
                    this.loading = true
                    const { result, message } = await this.$api.AssetData.updateInstance(params)
                    if (!result) {
                        return this.$error(message)
                    }
                    this.$success('修改成功！')
                    this.formDataV2[tex.attr_id] = this.formData[tex.attr_id]
                    tex.isEdit = false
                } finally {
                    this.loading = false
                }
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
