<template>
    <div>
        <drawer-component
            title="个人信息"
            :visible="isShow"
            :size="600"
            :before-close="beforeClose"
            @changeVisible="changeVisible">
            <div slot="content" class="content-box">
                <el-form label-width="80px" :model="formData" ref="validateForm"
                    v-loading="isInfoLoading" :rules="formRules">
                    <el-form-item label="用户名" :required="true" prop="username">
                        <el-input size="small" :disabled="true" v-model="formData.username" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="中文名" prop="display_name">
                        <el-input size="small" :disabled="!isEdit" v-model="formData.display_name" placeholder="请输入中文名"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input size="small" :disabled="!isEdit" v-model="formData.email" placeholder="请输入邮箱"></el-input>
                    </el-form-item>
                    <el-form-item v-show="isEdit" class="form-btn">
                        <el-button type="primary" @click="onFormSubmit">提交</el-button>
                        <el-button type="default" @click="onFormCancel">取消</el-button>
                    </el-form-item>
                </el-form>
                <div class="btn-box">
                    <el-button type="text" style="margin-right: 20px;" @click="updateFormData">
                        修改信息
                    </el-button>
                    <el-button type="text" @click="showPasswordForm">
                        重置密码
                    </el-button>
                </div>
                <el-form
                    :model="passwordFormData"
                    ref="validatePsdForm"
                    :rules="passwordRules"
                    label-width="80px"
                    v-show="showPassword"
                    v-loading="isPsdLoading">
                    <el-form-item label="密码" :required="true" prop="password">
                        <el-input size="small" show-password v-model="passwordFormData.password" placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" :required="true" prop="confirmPassword" error-display-type="normal">
                        <el-input size="small" show-password v-model="passwordFormData.confirmPassword" placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item class="form-btn">
                        <el-button type="primary" @click="onPasswordSubmit">提交</el-button>
                        <el-button type="default" @click="onPasswordCancel">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </drawer-component>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator'
    import DrawerComponent from './comDrawer.vue'

    @Component({
        components: {
            DrawerComponent
        }
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
                    validator: (rule, value, callback) => {
                        if (value === '') {
                            callback(new Error('必填项'))
                        } else if (value !== this.passwordFormData.password) {
                            callback(new Error('两次输入密码不一致!'))
                        } else {
                            callback()
                        }
                    },
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
            this.rawFormData = {...this.formData}
            this.isShow = true
        }

        updateFormData() {
            this.isEdit = true
        }

        async onFormSubmit() {
            this.$refs.validateForm.validate((valid) => {
                if (valid) {
                    this.editUser()
                }
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
            validateForm.clearValidate()
            this.isEdit = false
        }

        showPasswordForm() {
            this.showPassword = true
        }

        onPasswordSubmit() {
            const validatePsdForm: any = this.$refs.validatePsdForm
            validatePsdForm.validate((valid) => {
                if (valid) {
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
                }
            })
        }

        onPasswordCancel() {
            this.passwordFormData.password = ''
            this.passwordFormData.confirmPassword = ''
            const validatePsdForm: any = this.$refs.validatePsdForm
            validatePsdForm.resetFields()
            this.showPassword = false
        }

        beforeClose() {
            this.isEdit = false
            this.showPassword = false
            return true
        }

        changeVisible(val) {
            this.isShow = val
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
