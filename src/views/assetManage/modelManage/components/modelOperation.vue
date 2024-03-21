<template>
    <div>
        <drawer-component
            :title="`${isAdd ? '新建' : '编辑'}模型`"
            :size="500"
            :visible="isShow"
            custom-class="common-dialog-wrapper"
            :before-close="cancel"
            @changeVisible="changeVisible"
        >
            <div slot="content" class="common-dialog-wrapper-main">
                <div class="icon-box">
                    <div class="icon" @click="selectIcon">
                        <img :src="require(`@/assets/svg/model/${iconUrl}.svg`)" alt="">
                    </div>
                    <div style="text-align: center;margin-top: 8px;">选择图标</div>
                </div>
                <el-form
                    label-width="110"
                    :model="formData"
                    :rules="rules"
                    ref="validateForm"
                    form-type="vertical"
                >
                    <el-form-item
                        label="所属分组"
                        :required="true"
                        :prop="'group'"
                        :error-display-type="'normal'">
                        <el-select v-model="formData.group" size="small" style="width: 100%;" :disabled="!isAdd">
                            <el-option v-for="option in groupList"
                                :key="option.classification_id"
                                :label="option.classification_name"
                                :value="option.classification_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="唯一标识"
                        :required="true"
                        desc="可使用英文、数字、下划线，需以字母开头"
                        :desc-type="'icon'"
                        :prop="isAdd ? 'onlyMark' : ''"
                        :error-display-type="'normal'">
                        <el-input size="small" v-model="formData.onlyMark" :disabled="!isAdd" placeholder="请输入唯一标识"></el-input>
                    </el-form-item>
                    <el-form-item
                        label="名称"
                        :required="true"
                        :prop="'name'"
                        desc="请填写模型名"
                        :desc-type="'icon'"
                        :error-display-type="'normal'">
                        <el-input size="small" v-model="formData.name" placeholder="请输入名称"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <template slot="footer">
                <el-button size="small" :loading="loading" :disabled="loading" :type="'primary'" @click="confirm">
                    确认
                </el-button>
                <el-button :type="'default'" size="small" @click="cancel">
                    取消
                </el-button>
            </template>
        </drawer-component>
        <select-icon
            ref="selectIcon"
            @setIcon="setIcon"
        >
        </select-icon>
    </div>
</template>

<script lang="ts">
    import SelectIcon from './selectIcon.vue'
    import DrawerComponent from '@/components/comDrawer/index.vue'
    import { Vue, Component, Prop } from 'vue-property-decorator'
    import { COMMON_RULE } from '@/common/constants'
    @Component({
        components: {
            SelectIcon,
            DrawerComponent
        }
    })
    export default class ModelOperation extends Vue {
        @Prop({
            type: Array,
            default: () => []
        })
        groupList: Array<any>
        isShow: boolean = false
        formData = {
            group: '',
            onlyMark: '',
            name: ''
        }
        rules = {
            name: [
                COMMON_RULE
            ],
            onlyMark: [
                COMMON_RULE
            ],
            group: [
                COMMON_RULE
            ]
        }
        iconUrl: string = 'cc-default_默认'
        loading: boolean = false
        currentType: string = 'add'
        modelDetail: any = ''
        formDataV2 = {}
        get isAdd() {
            return this.currentType === 'add'
        }
        setIcon(url) {
            this.iconUrl = url
        }
        changeVisible(val) {
            this.isShow = val
        }
        show(type, data) {
            this.currentType = type
            this.isShow = true
            if (type === 'edit') {
                this.iconUrl = data.icn || 'cc-default_默认'
                this.modelDetail = data
                this.formData = {
                    group: data.classification_id,
                    onlyMark: data.model_id,
                    name: data.model_name
                }
            } else {
                this.iconUrl = 'cc-default_默认'
                this.initData()
            }
            this.formDataV2 = JSON.parse(JSON.stringify(this.formData))
        }
        confirm() {
            const validateForm: any = this.$refs.validateForm
            validateForm.validate(valid => {
                if (valid) {
                    const params: any = {
                        model_name: this.formData.name,
                        model_id: this.formData.onlyMark,
                        icn: this.iconUrl,
                        classification_id: this.formData.group
                    }
                    console.log(params)
                    this.createModel(params)
                }
            })
        }
        createModel(params) {
            this.loading = true
            this.$api.ModelManage[this.isAdd ? 'createModel' : 'updateModel'](params).then(res => {
                if (!res.result) {
                    this.$error(res.message)
                    return false
                }
                this.$success(`${this.isAdd ? '新增' : '编辑'}模型成功!`)
                this.isShow = false
                this.isAdd ? this.$emit('getAllModelList') : this.$emit('refreshModel', {
                    classification_id: this.formData.group,
                    ...params
                })
                if (this.isAdd) {
                    this.$store.dispatch('getOtherMenus')
                }
            }).finally(() => {
                this.loading = false
            })
        }
        cancel() {
            const flag = this.$compareFormData(this.formData, this.formDataV2)
            const validateForm: any = this.$refs.validateForm
            if (!flag) {
                this.$confirm('放弃将导致未保存信息丢失', '是否放弃本次操作？', {
                    center: true
                }).then(() => {
                    this.isShow = false
                    validateForm.clearValidate()
                })
            } else {
                validateForm.clearValidate()
                this.isShow = false
            }
        }
        selectIcon() {
            const selectIcon: any = this.$refs.selectIcon
            selectIcon.show(this.isAdd ? '' : this.iconUrl)
        }
        initData() {
            this.modelDetail = ''
            this.formData = {
                group: '',
                onlyMark: '',
                name: ''
            }
        }
    }
</script>

<style lang="scss" scoped>
    .common-dialog-wrapper-main {
        .icon-box {
            .icon {
                border: 1px solid #c3cdd7;
                border-radius: 50%;
                cursor: pointer;
                font-size: 50px;
                height: 85px;
                margin: 0 auto;
                width: 85px;
                display: flex;
                align-items: center;
                justify-content: center;
                img {
                    width: 50px;
                    height: 50px;
                }
            }
        }
    }
</style>
