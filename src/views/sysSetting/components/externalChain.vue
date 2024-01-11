<template>
    <drawer-component
        :title="`${isAdd ? '新增' : '编辑'}外链`"
        :visible="isShow"
        :size="500"
        @changeVisible="changeVisible">
        <div slot="content" class="content-box">
            <div class="form-box">
                <el-form label-width="90px" :model="formData" :rules="rules" ref="validateForm">
                    <el-form-item label="显示名称" :required="true" prop="name">
                        <el-input v-model="formData.name"></el-input>
                    </el-form-item>
                    <el-form-item label="链接" :required="true" prop="url">
                        <el-input v-model="formData.url"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="foot-box">
                <el-button @click="cancel">
                    取消
                </el-button>
                <el-button type="primary" class="mr10" @click="confirm">
                    确认
                </el-button>
            </div>
        </div>
    </drawer-component>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator'
    import pinyin from 'pinyin'
    import camelCase from 'lodash/camelCase'
    import DrawerComponent from '@/components/comDrawer.vue'
    @Component({
        name: 'external-chain',
        components: {
            DrawerComponent
        }
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
                    type: 'url',
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
            validateForm.validate((valid) => {
                if (valid) {
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
                }
            })
        }
        cancel() {
            this.isShow = false
            const validateForm: any = this.$refs.validateForm
            validateForm.resetFields()
        }

        changeVisible(val) {
            this.isShow = val
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
