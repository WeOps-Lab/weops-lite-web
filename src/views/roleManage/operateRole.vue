<template>
    <bk-dialog
        v-model="visible"
        :position="{ top: 150 }"
        theme="primary"
        width="600"
        :mask-close="false"
        header-position="left"
        :title="title"
        @after-leave="closeDialog"
    >
        <div class="content-box" v-bkloading="{ isLoading: loading, zIndex: 10 }">
            <bk-form :label-width="90" :model="formData" :rules="rules" ref="roleValidateForm">
                <bk-form-item label="角色名称" :required="true" :property="'role_name'">
                    <bk-input v-model="formData.role_name" placeholder="请输入角色名称" :disabled="type === 'edit'"></bk-input>
                </bk-form-item>
                <bk-form-item label="角色描述">
                    <bk-input v-model="formData.describe" placeholder="请输入角色描述" type="textarea"></bk-input>
                </bk-form-item>
            </bk-form>
        </div>
        <template slot="footer">
            <bk-button :disabled="loading" :theme="'primary'" :title="'确认'" class="mr10" @click="confirm">
                确认
            </bk-button>
            <bk-button :theme="'default'" type="submit" :title="'取消'" @click="close">
                取消
            </bk-button>
        </template>
    </bk-dialog>
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
            roleValidateForm.validate().then(validator => {
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
            })
        }
        closeDialog() {
            // Object.assign(this.$data, this.$options.data())
            const roleValidateForm: any = this.$refs.roleValidateForm
            roleValidateForm.clearError()
        }
    }
</script>
