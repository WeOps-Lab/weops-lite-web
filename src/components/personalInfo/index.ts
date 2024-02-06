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
    isEdit: boolean = false
    rawFormData: any = ''
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
    showPassword: boolean = false
    pageLoading: boolean = false
    passwordFormData = {
        password: '',
        confirmPassword: ''
    }
    passwordRules = {
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
        Object.assign(this.$data, this.$options.data.call(this))
        this.formData.id = this.user.user_info?.sub
        this.isShow = true
        this.getUserInfo(this.formData.id)
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

    async getUserInfo(id) {
        this.pageLoading = true
        try {
            const res = await this.$api.UserManageMain.getUserInfo({ id })
            const { data, message, result } = res
            if (!result) {
                return this.$error(message)
            }
            this.formData.username = data.username
            this.formData.display_name = data.lastName
            this.formData.email = data.email
            this.rawFormData = { ...this.formData }
        } finally {
            this.pageLoading = false
        }
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
        this.formData = { ...this.rawFormData }
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
