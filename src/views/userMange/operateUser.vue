<template>
    <el-dialog
        :visible.sync="visible"
        width="600px"
        :close-on-click-modal="false"
        :title="type === 'add' ? '新增用户' : '编辑用户'"
        @closed="closeDialog">
        <div class="content-box" v-loading="loading">
            <el-form label-width="80px" :model="formData" :rules="rules" ref="validateForm">
                <el-form-item label="用户名" prop="username">
                    <el-input :disabled="type === 'edit'" v-model="formData.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="中文名" prop="lastName">
                    <el-input v-model="formData.lastName" placeholder="请输入中文名"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :prop="'email'">
                    <el-input v-model="formData.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item v-if="type === 'add'" label="密码" :prop="'password'">
                    <el-input v-model="formData.password" placeholder="请输入密码" show-password :clearable="true"></el-input>
                </el-form-item>
                <el-form-item v-if="type === 'add'" label="确认密码" :prop="'confirmPassword'">
                    <el-input v-model="formData.confirmPassword" placeholder="请输入密码" show-password :clearable="true"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <template slot="footer">
            <el-button :disabled="loading" :type="'primary'" class="mr10" @click="confirm">
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
            const validateForm: any = this.$refs.validateForm
            validateForm.resetFields()
        }
        confirm() {
            const validateForm: any = this.$refs.validateForm
            validateForm.validate((valid) => {
                if (valid) {
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
                }
            })
        }
        closeDialog() {
            // Object.assign(this.$data, this.$options.data.call(this))
            const validateForm: any = this.$refs.validateForm
            validateForm.clearValidate()
            validateForm.resetFields()
        }
    }
</script>
