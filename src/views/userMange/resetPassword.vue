<template>
    <bk-dialog
        v-model="resetVisible"
        theme="primary"
        :mask-close="false"
        header-position="left"
        title="重置密码"
        @after-leave="closeResetDialog">
        <div v-bkloading="{ isLoading: resetLoading, zIndex: 10 }">
            <bk-form :label-width="80" :model="formData" :rules="rules" ref="validatePsdForm">
                <bk-form-item :required="true" label="重置密码" :property="'password'" error-display-type="normal">
                    <bk-input
                        :clearable="true"
                        v-model="formData.password"
                        type="password"
                        placeholder="请输入重置密码"
                    >
                    </bk-input>
                </bk-form-item>
                <bk-form-item :required="true" label="确认密码" :property="'confirmPassword'" error-display-type="normal">
                    <bk-input
                        :clearable="true"
                        v-model="formData.confirmPassword"
                        type="password"
                        placeholder="请输入重置密码"
                    >
                    </bk-input>
                </bk-form-item>
            </bk-form>
        </div>
        <template slot="footer">
            <bk-button :disabled="resetLoading" :theme="'primary'" :title="'确认'" class="mr10" @click="confirmReset">
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
        name: 'reset-password'
    })
    export default class ResetPassword extends Vue {
        resetVisible: boolean = false
        password: string = ''
        resetUser: any = ''
        resetLoading: boolean = false
        formData = {
            password: '',
            confirmPassword: ''
        }
        rules = {
            password: [
                {
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }
                // {
                //     regex: /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,32}$/,
                //     message: '密码长度为8-32个字符，必须包含大小写字母，数字',
                //     trigger: 'blur'
                // }
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
        show(data) {
            this.resetVisible = true
            this.resetUser = data
        }
        close() {
            this.resetVisible = false
        }
        closeResetDialog() {
            this.formData.password = ''
            this.formData.confirmPassword = ''
            const validatePsdForm: any = this.$refs.validatePsdForm
            validatePsdForm.clearError()
        }
        confirmReset() {
            const validatePsdForm: any = this.$refs.validatePsdForm
            validatePsdForm.validate().then(validator => {
                this.resetLoading = true
                this.$api.UserManageMain.resetPassword({
                    password: this.formData.password,
                    id: this.resetUser.id
                }).then(res => {
                    if (!res.result) {
                        this.$error(res.message)
                        return false
                    }
                    this.$success('重置密码成功!')
                }).finally(() => {
                    this.resetLoading = false
                    this.close()
                })
            })
        }
    }
</script>
