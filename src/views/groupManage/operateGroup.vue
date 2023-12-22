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
            <bk-form :label-width="90" :model="formData" :rules="rules" ref="organizationValidateForm">
                <bk-form-item label="名称" required :property="'group_name'">
                    <bk-input v-model="formData.group_name" placeholder="请输入组织名称"></bk-input>
                </bk-form-item>
            </bk-form>
        </div>
        <template slot="footer">
            <bk-button class="mr10" :disabled="loading" :theme="'primary'" :title="'确认'" @click="confirm">
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
    export default class OperateGroup extends Vue {
        visible: boolean = false
        loading: boolean = false
        roleInfo: any = ''
        type: string = ''
        formData = {
            group_name: '',
            id: ''
        }
        rules = {
            group_name: [
                {
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }
            ]
        }
        get title() {
            if (this.type === 'add') {
                return '新增组织'
            }
            if (this.type === 'edit') {
                return '编辑组织'
            }
            return '添加子组'
        }
        show(type, data) {
            this.visible = true
            this.type = type
            this.formData.group_name = ''
            if (type === 'addSub') {
                this.formData.id = data.id
            }
            if (['edit'].includes(this.type)) {
                this.roleInfo = data
                this.formData.group_name = data.name
                if (this.type === 'edit') {
                    this.formData.id = data.id
                }
            }
        }
        close() {
            this.visible = false
        }
        confirm() {
            const organizationValidateForm: any = this.$refs.organizationValidateForm
            organizationValidateForm.validate().then(validator => {
                let url = ''
                const params: any = {}
                if (['add', 'addSub'].includes(this.type)) {
                    url = 'addGroup'
                    params.group_name = this.formData.group_name
                    if (this.type === 'addSub') {
                        params.parent_group_id = this.formData.id
                    }
                } else {
                    url = 'editGroup'
                    params.id = this.formData.id
                    params.group_name = this.formData.group_name
                }
                this.loading = true
                this.$api.GroupManage[url](params).then(res => {
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
                this.close()
            })
        }
        closeDialog() {
            // Object.assign(this.$data, this.$options.data.call(this))
            const organizationValidateForm: any = this.$refs.organizationValidateForm
            organizationValidateForm.clearError()
        }
    }
</script>
