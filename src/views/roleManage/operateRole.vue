<template>
    <el-dialog
        :visible.sync="visible"
        width="600px"
        :title="title"
        @closed="closeDialog"
    >
        <div class="content-box" v-loading="loading">
            <el-form ref="roleValidateForm" label-width="90px" :model="formData" :rules="rules">
                <el-form-item label="角色名称" prop="role_name">
                    <el-input v-model="formData.role_name" placeholder="请输入角色名称" :disabled="type === 'edit'"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <bk-input v-model="formData.describe" placeholder="请输入角色描述" type="textarea"></bk-input>
                </el-form-item>
            </el-form>
        </div>
        <template slot="footer">
            <el-button :disabled="loading" type="primary" @click="confirm">
                确认
            </el-button>
            <el-button @click="close">
                取消
            </el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator'
    @Component
    export default class OperateRole extends Vue {
        visible: boolean = false
        loading: boolean = false
        roleInfo: any = ''
        type: string = ''
        formData = {
            role_name: '',
            describe: '',
            id: ''
        }
        rules = {
            role_name: [
                {
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }
            ]
        }
        get title() {
            if (this.type === 'add') {
                return '新增角色'
            } else if (this.type === 'edit') {
                return '编辑角色'
            } else {
                return '拷贝角色'
            }
        }
        show(type, data) {
            this.visible = true
            this.type = type
            this.formData.role_name = ''
            this.formData.describe = ''
            if (['edit', 'copy'].includes(this.type)) {
                this.roleInfo = data
                this.formData.role_name = data.name
                this.formData.describe = data.description
                if (this.type === 'edit') {
                    this.formData.id = data.id
                }
            }
        }
        close() {
            this.visible = false
        }
        confirm() {
            const roleValidateForm: any = this.$refs.roleValidateForm
            roleValidateForm.validate((valid) => {
                if (valid) {
                    let url = ''
                    let params: any = {}
                    if (['add', 'copy'].includes(this.type)) {
                        url = 'createRole'
                        params.role_name = this.formData.role_name
                        params.description = this.formData.describe
                    } else {
                        url = 'editRole'
                        params = {
                            id: this.formData.id,
                            description: this.formData.describe
                        }
                    }
                    this.loading = true
                    this.$api.RoleManageMain[url](params).then(res => {
                        if (!res.result) {
                            this.$error(res.message)
                            return false
                        }
                        this.$success(`${this.title}成功!`)
                        this.$emit('refreshList')
                        this.close()
                    }).finally(() => {
                        this.loading = false
                    })
                }
            })
        }
        closeDialog() {
            // Object.assign(this.$data, this.$options.data())
            const roleValidateForm: any = this.$refs.roleValidateForm
            roleValidateForm.clearValidate()
        }
    }
</script>

<style lang="scss">
    /* stylelint-disable selector-class-pattern */
    .el-dialog__body {
        padding-bottom: 0;
    }
</style>
