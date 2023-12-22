<template>
    <div>
        <bk-sideslider
            :width="600"
            :is-show.sync="isShow"
            :quick-close="true"
            :before-close="beforeClose">
            <div slot="header">个人信息</div>
            <div slot="content" class="content-box">
                <bk-form :label-width="80" :model="formData" ref="validateForm"
                    v-bkloading="{ isLoading: isInfoLoading, zIndex: 10 }" :rules="formRules">
                    <bk-form-item label="用户名" :required="true" :property="'username'" error-display-type="normal">
                        <bk-input :disabled="true" v-model="formData.username" placeholder="请输入用户名"></bk-input>
                    </bk-form-item>
                    <bk-form-item label="中文名" :property="'display_name'" error-display-type="normal">
                        <bk-input :disabled="!isEdit" v-model="formData.display_name" placeholder="请输入中文名"></bk-input>
                    </bk-form-item>
                    <bk-form-item label="邮箱" :property="'email'" error-display-type="normal">
                        <bk-input :disabled="!isEdit" v-model="formData.email" placeholder="请输入邮箱"></bk-input>
                    </bk-form-item>
                    <bk-form-item v-show="isEdit" class="form-btn">
                        <bk-button theme="primary" @click="onFormSubmit">提交</bk-button>
                        <bk-button theme="default" @click="onFormCancel">取消</bk-button>
                    </bk-form-item>
                </bk-form>
                <div class="btn-box">
                    <bk-button :text="true" title="primary" style="margin-right: 20px;" @click="updateFormData">
                        修改信息
                    </bk-button>
                    <bk-button :text="true" title="primary" @click="showPasswordForm">
                        重置密码
                    </bk-button>
                </div>
                <bk-form
                    :model="passwordFormData"
                    ref="validatePsdForm"
                    :rules="passwordRules"
                    :label-width="80"
                    v-show="showPassword"
                    v-bkloading="{ isLoading: isPsdLoading, zIndex: 10 }">
                    <bk-form-item label="密码" :required="true" :property="'password'" error-display-type="normal">
                        <bk-input type="password" v-model="passwordFormData.password" placeholder="请输入密码"></bk-input>
                    </bk-form-item>
                    <bk-form-item label="确认密码" :required="true" :property="'confirmPassword'" error-display-type="normal">
                        <bk-input type="password" v-model="passwordFormData.confirmPassword" placeholder="请输入密码"></bk-input>
                    </bk-form-item>
                    <bk-form-item class="form-btn">
                        <bk-button theme="primary" @click="onPasswordSubmit">提交</bk-button>
                        <bk-button theme="default" @click="onPasswordCancel">取消</bk-button>
                    </bk-form-item>
                </bk-form>
            </div>
        </bk-sideslider>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator'

    @Component({
        components: {}
    })
    export default class PersonalInfo extends Vue {
        isShow:boolean = false
        isEdit:boolean = false
        rawFormData:any = ''
        formData = {
            id: '',
            username: '',
            display_name: '',
            email: ''
        }
        formRules = {
            display_name: [
                {
                    regex: /^[\u4e00-\u9fa5]+$/,
                    message: '必须为中文',
                    trigger: 'blur'
                }
            ]
        }
        isInfoLoading: boolean = false
        isPsdLoading: boolean = false
        showPassword:boolean = false
        passwordFormData = {
            password: '',
            confirmPassword: ''
        }
        passwordRules = {
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
                        return val === this.passwordFormData.password
                    },
                    message: '两次输入密码不一致',
                    trigger: 'blur'
                }
            ]
        }

        get user() {
            return this.$store.state.permission.user
        }

        show() {
            this.formData.id = this.user.id
            this.formData.username = this.user.username
            this.formData.display_name = this.user.chname
            this.formData.email = this.user.email
            this.isShow = true
        }

        updateFormData() {
            this.isEdit = true
        }

        async onFormSubmit() {
            this.$refs.validateForm.validate().then(validator => {
                this.editUser()
            })
        }

        async editUser() {
            this.isInfoLoading = true
            const params = {
                id: this.formData.id,
                lastName: this.formData.display_name,
                email: this.formData.email
            }
            const res = await this.$api.UserManageMain.editUser(params)
            if (!res.result) {
                this.$error(res.message)
            } else {
                this.$success('修改成功!')
            }
            await this.$store.dispatch('GenerateNavLists1')
            this.isInfoLoading = false
        }

        onFormCancel() {
            this.formData = {...this.rawFormData}
            const validateForm: any = this.$refs.validateForm
            validateForm.clearError()
            this.isEdit = false
        }

        showPasswordForm() {
            this.showPassword = true
        }

        onPasswordSubmit() {
            const validatePsdForm: any = this.$refs.validatePsdForm
            validatePsdForm.validate().then(validator => {
                this.isPsdLoading = true
                const params = {
                    id: this.formData.id,
                    password: this.passwordFormData.password
                }
                this.$api.UserManageMain.resetPassword(params).then(res => {
                    if (!res.result) {
                        this.$error(res.message)
                        return false
                    }
                    this.$success('重置密码成功!')
                }).finally(() => {
                    this.isPsdLoading = false
                })
            })
        }

        onPasswordCancel() {
            this.passwordFormData.password = ''
            this.passwordFormData.confirmPassword = ''
            const validatePsdForm: any = this.$refs.validatePsdForm
            validatePsdForm.clearError()
            this.showPassword = false
        }

        beforeClose() {
            this.isEdit = false
            this.showPassword = false
            return true
        }
    }
</script>

<style lang="scss" scoped>
.content-box {
    height: calc(100vh - 60px);
    padding: 20px;
    display: flex;
    flex-direction: column;
    .info-box {
        flex: 1;
        height: 0;
        overflow: auto;
    }
    .btn-box {
        margin: 20px;
    }
    .form-btn {
        display: flex;
        flex-direction: row-reverse;
    }
}
</style>
