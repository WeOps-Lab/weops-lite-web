<template>
    <bk-dialog
        v-model="visible"
        :position="{ top: 100 }"
        theme="primary"
        width="600"
        :mask-close="false"
        header-position="left"
        :title="type === 'add' ? '新增用户' : '编辑用户'"
        @after-leave="closeDialog"
    >
        <div class="content-box" v-bkloading="{ isLoading: loading, zIndex: 10 }">
            <bk-form :label-width="80" :model="formData" :rules="rules" ref="validateForm">
                <bk-form-item label="用户名" :required="true" :property="'username'" error-display-type="normal">
                    <bk-input :disabled="type === 'edit'" v-model="formData.username" placeholder="请输入用户名"></bk-input>
                </bk-form-item>
                <bk-form-item label="中文名" :required="true" :property="'lastName'" error-display-type="normal">
                    <bk-input v-model="formData.lastName" placeholder="请输入中文名"></bk-input>
                </bk-form-item>
                <bk-form-item label="邮箱" :property="'email'" error-display-type="normal">
                    <bk-input v-model="formData.email" placeholder="请输入邮箱"></bk-input>
                </bk-form-item>
                <bk-form-item v-if="type === 'add'" label="密码" :required="true" :property="'password'" error-display-type="normal">
                    <bk-input v-model="formData.password" placeholder="请输入密码" type="password" :clearable="true"></bk-input>
                </bk-form-item>
                <bk-form-item v-if="type === 'add'" label="确认密码" :required="true" :property="'confirmPassword'" error-display-type="normal">
                    <bk-input v-model="formData.confirmPassword" placeholder="请输入密码" type="password" :clearable="true"></bk-input>
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

    @Component({
        name: 'operate-user'
    })
    export default class OperateUser extends Vue {
        visible: boolean = false
        loading: boolean = false
        userInfo: any = {}
        type: string = ''
        formData = {
            username: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
        rules = {
            username: [
                {
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }
            ],
            lastName: [
                {
                    required: true,
                    regex: /^$|^[\u4e00-\u9fa5]+$/,
                    message: '必须是中文',
                    trigger: 'blur'
                }
            ],
            password: [
                {
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }
            ],
            confirmPassword: [
                {
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                },
                {
                    validator: (val) => {
                        return val === this.formData.password
                    },
                    message: '两次输入密码不一致',
                    trigger: 'blur'
                }
            ]
        }

        show(type, data) {
            this.visible = true
            this.type = type
            if (this.type === 'edit') {
                this.userInfo = data
                this.formData.username = data.username
                this.formData.lastName = data.lastName
                this.formData.email = data.email
            }
        }
        close() {
            this.visible = false
        }
        confirm() {
            const validateForm: any = this.$refs.validateForm
            validateForm.validate().then(validator => {
                let url = 'createUser'
                let params: any = {
                    username: this.formData.username,
                    lastName: this.formData.lastName,
                    email: this.formData.email,
                    password: this.formData.password
                }
                if (this.formData.email) params.email = this.formData.email
                if (this.type !== 'add') {
                    url = 'editUser'
                    params = {
                        id: this.userInfo.id,
                        lastName: this.formData.lastName,
                        email: this.formData.email
                    }
                }
                this.loading = true
                this.$api.UserManageMain[url](params).then(res => {
                    if (!res.result) {
                        this.$error(res.message)
                        return false
                    }
                    this.$success(`${this.type === 'add' ? '新增' : '编辑'}用户成功!`)
                    this.$emit('refreshList')
                    // this.$store.dispatch('getAllUserList')
                    this.close()
                }).finally(() => {
                    this.loading = false
                })
            })
        }
        closeDialog() {
            Object.assign(this.$data, this.$options.data.call(this))
            const validateForm: any = this.$refs.validateForm
            validateForm.clearError()
        }
    }
</script>
