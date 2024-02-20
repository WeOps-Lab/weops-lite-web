<template>
    <drawer-component
        title="重置密码"
        :visible="isShow"
        :size="500"
        custom-class="common-dialog-wrapper"
        :append-to-body="true"
        @changeVisible="changeVisible">
        <div slot="content" class="common-dialog-wrapper-main content-box">
            <el-form
                :model="passwordFormData"
                ref="validatePsdForm"
                :rules="passwordRules"
                label-width="80px">
                <el-form-item label="密码" :required="true" prop="password">
                    <el-input
                        show-password
                        size="small"
                        v-model="passwordFormData.password"
                        placeholder="请输入密码">
                    </el-input>
                </el-form-item>
                <el-form-item label="确认密码" :required="true" prop="confirmPassword" error-display-type="normal">
                    <el-input
                        show-password
                        size="small"
                        v-model="passwordFormData.confirmPassword"
                        placeholder="请输入密码">
                    </el-input>
                </el-form-item>
            </el-form>
        </div>
        <template slot="footer">
            <el-button type="primary" size="small" @click="onPasswordSubmit" :loading="isPsdLoading">提交</el-button>
            <el-button type="default" size="small" class="ml20" @click="onPasswordCancel">取消</el-button>
        </template>
    </drawer-component>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator'
    import DrawerComponent from '../comDrawer/index.vue'
    import { COMMON_RULE } from '@/common/constants'

@Component({
    components: {
        DrawerComponent
    }
})
export default class PersonalInfo extends Vue {
    isShow: boolean = false
    isPsdLoading: boolean = false
    passwordFormData = {
        password: '',
        confirmPassword: ''
    }
    passwordRules = {
        password: [
            COMMON_RULE
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
        this.isShow = true
    }

    onPasswordSubmit() {
        const validatePsdForm: any = this.$refs.validatePsdForm
        validatePsdForm.validate((valid) => {
            if (valid) {
                this.isPsdLoading = true
                const params = {
                    id: this.user.user_info?.sub,
                    password: this.passwordFormData.password
                }
                this.$api.UserManageMain.resetPassword(params).then(res => {
                    if (!res.result) {
                        this.$error(res.message)
                        return false
                    }
                    this.$success('重置密码成功!')
                    this.onPasswordCancel()
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
        this.isShow = false
    }

    changeVisible(val) {
        this.isShow = val
        this.onPasswordCancel()
    }
}
</script>
