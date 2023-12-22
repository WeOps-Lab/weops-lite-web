<template>
    <div class="login-config" v-bkloading="{ isLoading: loading, zIndex: 10 }">
        <div class="multiple-factor-wrapper mb20">
            <bk-form
                :label-width="200"
                :model="formData"
                :rules="rules"
                ref="validateForm">
                <bk-form-item
                    label="默认登陆域："
                    property="default_domain"
                    error-display-type="normal"
                    required>
                    <bk-select
                        style="width: 350px;"
                        v-model="formData.default_domain">
                        <bk-option v-for="(option, index) in domainList"
                            :key="index"
                            :id="option"
                            :name="option">
                        </bk-option>
                    </bk-select>
                </bk-form-item>
                <bk-form-item>
                    <bk-button
                        title="保存"
                        theme="primary"
                        style="margin-right: 3px;"
                        :disabled="disabled"
                        :loading="showDomainLoading"
                        @click.stop.prevent="saveDefaultDomain">
                        保存
                    </bk-button>
                </bk-form-item>
            </bk-form>
        </div>
        <div class="multiple-factor-wrapper">
            <bk-form :label-width="200" :model="formData">
                <bk-form-item label="开启双因子认证：" :property="'two_factor_enable'">
                    <bk-switcher
                        size="small"
                        theme="primary"
                        v-model="formData.two_factor_enable">
                    </bk-switcher>
                </bk-form-item>
                <bk-form-item
                    label="认证方式："
                    :property="'auth_type'">
                    <bk-select
                        style="width: 350px;"
                        :clearable="false"
                        ext-cls="select-custom"
                        v-model="formData.auth_type"
                        ext-popover-cls="select-popover-custom">
                        <bk-option v-for="option in typeList"
                            :key="option.key"
                            :id="option.key"
                            :name="option.name">
                        </bk-option>
                    </bk-select>
                </bk-form-item>
                <bk-form-item
                    label="白名单："
                    :property="'auth_white_list'">
                    <div class="auth-white-list" @click="handleChoose">
                        <span v-if="!hasWhiteList" class="placeholder">请选择白名单</span>
                        <span v-else class="overflow" v-bk-overflow-tips>{{ nameList }}</span>
                    </div>
                </bk-form-item>
                <bk-form-item
                    label="验证码："
                    :property="'code'"
                    v-if="!isAdmin">
                    <div class="code-container">
                        <bk-input
                            style="width: 350px;"
                            placeholder="请输入验证码"
                            v-model="code">
                        </bk-input>
                        <span class="tip-txt tip-txt-disabled" v-if="disabledValidate">
                            重新发送<span>{{count}}</span>后
                        </span>
                        <span class="tip-txt" v-else @click="handleGatherCode">
                            获取验证码
                        </span>
                        <div class="m0" v-if="!isConfirm" style="color: #f00;">请输入正确的验证码</div>
                    </div>
                </bk-form-item>
                <bk-form-item>
                    <bk-button
                        title="保存"
                        theme="primary"
                        style="margin-right: 3px;"
                        :disabled="disabled"
                        :loading="showFactorLoading"
                        @click.stop.prevent="handleSubmit">
                        保存
                    </bk-button>
                </bk-form-item>
            </bk-form>
            <auth-white-list ref="authWhite" @confirm="handleConfirm" />
        </div>
    </div>
</template>

<script lang="ts">
    import md5 from 'js-md5'
    import AuthWhiteList from './components/authWhiteList.vue'
    import { Component, Vue } from 'vue-property-decorator'

    @Component({
        components: {
            AuthWhiteList
        }
    })
    export default class MultipleFactor extends Vue {
        loading: boolean = false
        formData: any = {
            two_factor_enable: true,
            auth_type: ['mail'],
            auth_white_list: {
                user: [],
                role: []
            },
            default_domain: ''
        }
        typeList: Array<{
            name: string,
            key: string
        }> = [
            {
                name: '邮件',
                key: 'mail'
            },
            {
                name: '短信',
                key: 'msg'
            }
        ]
        code: string = ''
        allSelected:any = []
        disabled: boolean = true
        isConfirm: boolean = true
        validateCode: string = ''
        count: number = 60
        disabledValidate: boolean = false
        domainList: Array<any> = []
        rules: any = {
            default_domain: [
                {
                    required: true,
                    message: '默认登陆域不能为空',
                    trigger: 'blur'
                }
            ]
        }
        showDomainLoading: boolean = false
        showFactorLoading: boolean = false
        hasWhiteList: boolean = false

        get nameList() {
            const data = this.allSelected.map(r => r.type === 'role' ? r.role_name : r.bk_username)
            return data.join(',')
        }

        get isAdmin() {
            const user = this.$store.getters.getUser
            return user.is_super
        }

        async mounted() {
            this.loading = true
            await this.getDomainList()
            await this.getLoginSet()
            this.disabled = !this.isAdmin
        }

        saveDefaultDomain() {
            this.$refs.validateForm.validate().then(validator => {
                this.setDomain()
            })
        }

        async setDomain() {
            this.showDomainLoading = true
            try {
                const params = {
                    default_domain: this.formData.default_domain
                }
                const res = await this.$api.UserManageMain.setDomain(params)
                if (!res.result) {
                    return this.$error(res.message)
                }
                this.$success('默认登陆域设置成功')
            } finally {
                this.showDomainLoading = false
            }
        }

        async getLoginSet() {
            this.loading = true
            try {
                const res = await this.$api.UserManageMain.getLoginSet()
                if (!res.result) {
                    return this.$error(res.message)
                }
                this.formData = res.data
                this.setWhiteStatus()
                this.handleAllSelected(this.formData.auth_white_list)
            } finally {
                this.loading = false
            }
        }

        async getDomainList() {
            const res = await this.$api.UserManageMain.getDomainList()
            if (!res.result) {
                return this.$error(res.message)
            }
            this.domainList = res.data
        }

        async handleGatherCode() {
            this.disabledValidate = true
            const fn = () => {
                if (this.count === 0) {
                    this.disabledValidate = false
                    this.count = 60
                } else {
                    this.disabledValidate = true
                    this.count--
                    setTimeout(function() {
                        fn()
                    }, 1000)
                }
            }
            fn()
            const res = await this.$api.UserManageMain.sendValidateCode()
            if (!res.result) {
                return this.$error(res.message)
            }
            this.disabled = false
            this.validateCode = res.data.validate_code
        }

        handleChoose() {
            this.$refs.authWhite.showSlider(this.formData.auth_white_list)
        }

        handleConfirm(list) {
            this.formData.auth_white_list = this.$deepClone(list)
            this.setWhiteStatus()
            this.handleAllSelected(list)
        }

        setWhiteStatus() {
            const authWhiteList = this.formData.auth_white_list
            this.hasWhiteList = !!(authWhiteList?.user.length || authWhiteList?.role.length)
        }

        handleAllSelected(list = {}) {
            this.allSelected = []
            Object.keys(list).forEach(key => {
                this.allSelected = this.allSelected.concat(list[key].map(r => ({ ...r, type: key })))
            })
        }

        async handleSubmit() {
            this.showFactorLoading = true
            try {
                this.isConfirm = md5(this.code) === this.validateCode
                if (this.isConfirm || this.isAdmin) {
                    this.formData.auth_type = Array.isArray(this.formData.auth_type) ? this.formData.auth_type : [this.formData.auth_type]
                    const res = await this.$api.UserManageMain.updateLoginSet(this.formData)
                    if (!res.result) {
                        return this.$error(res.message)
                    }
                    this.$success('多因子认证设置成功')
                }
            } finally {
                this.showFactorLoading = false
            }
        }
    }
</script>

<style scoped lang="scss">
.multiple-factor-wrapper {
    height: 100%;
    background-color: #fff;
    padding: 20px;
    .auth-white-list {
        width: 350px;
        height: 32px;
        line-height: normal;
        color: #63656e;
        background-color: #fff;
        border-radius: 2px;
        font-size: 12px;
        box-sizing: border-box;
        border: 1px solid #c4c6cc;
        padding: 0 10px;
        text-align: left;
        vertical-align: middle;
        cursor: pointer;
        span {
            line-height: 32px;
        }
        .overflow {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
        }
        .placeholder {
            color: #bbb;
        }
    }
    .code-container {
        position: relative;
        width: 350px;
        .tip-txt {
            position: absolute;
            right: 5px;
            top: 6px;
            font-size: 12px;
            padding: 0 10px;
            background: #cfe6fd;
            color: $cw-color-primary;
            height: 20px;
            line-height: 20px;
            &:hover {
                cursor: pointer;
            }
        }
        .tip-txt-disabled {
            background: $cw-color-bg-3;
            color: $cw-color-text-3;
        }
    }
}
</style>
