import { Vue, Component } from 'vue-property-decorator'
import { OperateUserRules, OperateUserFormData } from '@/common/types/systemManage/userMange'
import { COMMON_RULE } from '@/common/constants'
@Component({
    name: 'reset-password'
})
export default class ResetPassword extends Vue {
    resetVisible: boolean = false
    password: string = ''
    resetUser: any = ''
    resetLoading: boolean = false
    formData: OperateUserFormData = {
        password: '',
        confirmPassword: ''
    }
    rules: OperateUserRules = {
        password: [
            COMMON_RULE
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
