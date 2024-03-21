<template>
    <div>
        <drawer-component
            :title="`${isAdd ? '新建' : '编辑'}分组`"
            :size="500"
            :visible="visible"
            custom-class="common-dialog-wrapper"
            :before-close="cancel"
            @changeVisible="changeVisible">
            <div slot="content" class="common-dialog-wrapper-main">
                <el-form
                    label-width="110"
                    :model="formData"
                    :rules="rules"
                    ref="validateForm">
                    <el-form-item
                        label="唯一标识"
                        :required="true"
                        desc="可使用英文、数字、下划线，需以字母开头"
                        :desc-type="'icon'"
                        :prop="'onlyMark'"
                        :error-display-type="'normal'">
                        <el-input
                            v-model="formData.onlyMark"
                            :disabled="!isAdd"
                            size="small"
                            placeholder="请输入唯一标识"
                            ref="onlyMark">
                        </el-input>
                    </el-form-item>
                    <el-form-item
                        label="名称"
                        :required="true"
                        :prop="'name'"
                        :error-display-type="'normal'">
                        <el-input size="small" v-model="formData.name" placeholder="请输入名称"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <el-button
                    :loading="loading"
                    :disabled="loading"
                    :type="'primary'"
                    size="small"
                    @click="confirm">
                    确认
                </el-button>
                <el-button size="small" @click="cancel">
                    取消
                </el-button>
            </div>
        </drawer-component>
    </div>
</template>

<script lang="ts">
    import { Component, Emit, Vue } from 'vue-property-decorator'
    import DrawerComponent from '@/components/comDrawer/index.vue'
@Component({
    components: {
        DrawerComponent
    }
})
export default class ModelOperation extends Vue {
    visible: boolean = false
    formData: any = {
        onlyMark: '',
        name: ''
    }
    formDataCopy: any = {}
    groupDetial: any = {}
    rules: any = {
        onlyMark: [
            {
                required: true,
                message: '请输入唯一标识',
                trigger: 'blur'
            }
        ],
        name: [
            {
                required: true,
                message: '请输入唯一名称',
                trigger: 'blur'
            }
        ]
    }
    loading: boolean = false
    currentType: string = 'add'
    get isAdd() {
        return this.currentType === 'add'
    }
    changeVisible(val) {
        this.visible = val
    }
    show(type, data) {
        this.currentType = type
        this.visible = true
        if (type === 'edit') {
            this.formData = {
                onlyMark: data.classification_id,
                name: data.classification_name
            }
            this.groupDetial = data
            this.formDataCopy = this.$copy(this.formData)
            return
        }
        this.initData()
    }
    confirm() {
        this.$refs.validateForm.validate(valid => {
            if (valid) {
                const params: any = {
                    classification_name: this.formData.name,
                    classification_id: this.formData.onlyMark
                }
                this.createOrEditGroup(params)
            }
        })
    }
    async createOrEditGroup(params) {
        this.loading = true
        const url = this.isAdd ? 'createClassification' : 'upDateClassification'
        try {
            const res = await this.$api.ModelManage[url](params)
            if (!res.result) {
                this.$error(res.message)
                return
            }
            this.$success(`${this.isAdd ? '新增' : '编辑'}分组成功!`)
            this.visible = false
            this.getAllModelList()
        } finally {
            this.loading = false
        }
    }
    cancel() {
        const result = this.$compareFormData(this.formData, this.formDataCopy)
        const validateForm: any = this.$refs.validateForm
        if (!result) {
            this.$confirm('放弃将导致未保存信息丢失', '是否放弃本次操作？', {
                center: true
            }).then(() => {
                this.visible = false
                validateForm.clearValidate()
            })
            return
        }
        this.visible = false
        validateForm.clearValidate()
    }
    initData() {
        this.groupDetial = {}
        this.formData = {
            onlyMark: '',
            name: ''
        }
        this.formDataCopy = this.$copy(this.formData)
    }
    @Emit('getAllModelList')
    getAllModelList() {
        return ''
    }
}
</script>
