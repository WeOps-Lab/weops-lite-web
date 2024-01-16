<template>
    <el-dialog
        width="600px"
        :visible.sync="resetVisible"
        :close-on-click-modal="false"
        title="重置密码"
        @closed="closeResetDialog">
        <div v-loading="resetLoading">
            <el-form label-width="80px" :model="formData" :rules="rules" ref="validatePsdForm">
                <el-form-item label="重置密码" :prop="'password'">
                    <el-input
                        :clearable="true"
                        v-model="formData.password"
                        show-password
                        placeholder="请输入重置密码"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item label="确认密码" :prop="'confirmPassword'">
                    <el-input
                        :clearable="true"
                        v-model="formData.confirmPassword"
                        show-password
                        placeholder="请输入重置密码"
                    >
                    </el-input>
                </el-form-item>
            </el-form>
        </div>
        <template slot="footer">
            <el-button :disabled="resetLoading" :type="'primary'" class="mr10" @click="confirmReset">
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
                    validator: (rule, value, callback) => {
                        if (value === '') {
                            callback(new Error('必填项'))
                        } else if (value !== this.formData.password) {
                            callback(new Error('两次输入密码不一致!'))
                        } else {
                            callback()
                        }
                    },
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
            validatePsdForm.clearValidate()
        }
        confirmReset() {
            const validatePsdForm: any = this.$refs.validatePsdForm
            validatePsdForm.validate((valid) => {
                if (valid) {
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
                }
            })
        }
    }
</script>
