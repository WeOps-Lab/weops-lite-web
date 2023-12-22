<template>
    <bk-sideslider
        :width="500"
        :is-show.sync="isShow"
        :quick-close="true"
    >
        <div slot="header">{{`${isAdd ? '新增' : '编辑'}外链`}}</div>
        <div slot="content" class="content-box">
            <div class="form-box">
                <bk-form :label-width="90" :model="formData" :rules="rules" ref="validateForm">
                    <bk-form-item
                        label="显示名称"
                        :required="true"
                        :property="'name'"
                        :error-display-type="'normal'">
                        <bk-input v-model="formData.name"></bk-input>
                    </bk-form-item>
                    <bk-form-item
                        label="链接"
                        :required="true"
                        :property="'url'"
                        :error-display-type="'normal'">
                        <bk-input v-model="formData.url"></bk-input>
                    </bk-form-item>
                </bk-form>
            </div>
            <div class="foot-box">
                <bk-button :theme="'default'" type="submit" @click="cancel">
                    取消
                </bk-button>
                <bk-button :theme="'primary'" class="mr10" @click="confirm">
                    确认
                </bk-button>
            </div>
        </div>
    </bk-sideslider>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator'
    import pinyin from 'pinyin'
    import camelCase from 'lodash/camelCase'
    @Component({
        name: 'external-chain'
    })
    export default class ExternalChain extends Vue {
        isShow: boolean = false
        formData = {
            name: '',
            url: ''
        }
        rules = {
            name: [
                {
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }
            ],
            url: [
                {
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                },
                {
                    regex: /^(http|https):\/\/((www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}))(:[0-9]{1,5})?(\/.*)?$/,
                    message: '请输入正确外链地址',
                    trigger: 'blur'
                }
            ]
        }
        type: string = ''
        detail: any = {}
        get isAdd() {
            return this.type === 'add'
        }
        show(type, data) {
            this.isShow = true
            this.type = type
            if (!this.isAdd) {
                this.formData.name = data.name
                this.formData.url = data.url
                this.detail = data
            } else {
                this.formData.name = ''
                this.formData.url = ''
            }
        }
        confirm() {
            const validateForm: any = this.$refs.validateForm
            validateForm.validate().then(validator => {
                const params: any = {
                    ...this.formData,
                    isUrl: true,
                    isPage: true,
                    icon: 'cw-icon weops-lian-jie',
                    key: this.isAdd ? this.$random(5) : this.detail.key,
                    auth: [
                        {
                            key: 'checkAuth',
                            value: false,
                            label: '查看',
                            type: 'check'
                        }
                    ]
                }
                const transValue = pinyin(params.name, {
                    style: pinyin.STYLE_NORMAL
                }).join('_')
                params.id = camelCase(`${transValue}_${Math.ceil(Math.random() * 10000)}`)
                this.$emit('handle-external-chain', params, this.type)
                this.cancel()
            })
        }
        cancel() {
            this.isShow = false
        }
    }
</script>

<style scoped lang="scss">
.content-box {
    height: calc(100vh - 60px);
    padding: 20px;
    display: flex;
    flex-direction: column;
    .form-box {
        flex: 1;
        height: 0;
    }
    .foot-box {
        display: flex;
        flex-direction: row-reverse;
    }
}
</style>
