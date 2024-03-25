<template>
    <div>
        <drawer-component
            :size="538"
            :title="`${currentType}属性`"
            :visible="isShow"
            :quick-close="true"
            destroy-on-close
            custom-class="common-dialog-wrapper"
            :before-close="cancel"
            @changeVisible="changeVisible">
            <div slot="content">
                <div class="common-dialog-wrapper-main" v-loading="loading">
                    <div class="form-box">
                        <el-form
                            label-width="94"
                            :model="formData"
                            :rules="rules"
                            ref="validateForm">
                            <el-form-item
                                label="属性ID"
                                desc="请填写英文开头，下划线、数字、英文的组合"
                                :desc-type="'icon'"
                                :prop="isAdd ? 'propertyID' : ''">
                                <el-input
                                    v-model="formData.propertyID"
                                    size="small"
                                    :disabled="!isAdd"
                                    placeholder="请输入属性ID">
                                </el-input>
                            </el-form-item>
                            <el-form-item
                                label="属性名"
                                prop="name">
                                <el-input v-model="formData.name" size="small" placeholder="请输入属性名"></el-input>
                            </el-form-item>
                            <el-form-item
                                label="值类型"
                                prop="valueType">
                                <el-select
                                    style="width: 100%;"
                                    placeholder="请选择值类型"
                                    v-model="formData.valueType"
                                    searchable
                                    size="small"
                                    :clearable="false"
                                    :disabled="!isAdd"
                                    @change="changeValueType">
                                    <el-option
                                        v-for="option in valueTypeList"
                                        :key="option.id"
                                        :label="option.name"
                                        :value="option.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <div class="field-setting" v-if="formData.valueType === 'enum'">
                                <!-- 暂且隐藏 -->
                                <!-- <div class="field-setting-item">
                                    <div class="label">字段设置</div>
                                    <bk-checkbox
                                        v-model="formData.fieldEdit.isEdit"
                                        :true-value="true"
                                        :false-value="false">
                                        可编辑
                                    </bk-checkbox>
                                </div>
                                <div v-if="['bool'].includes(formData.valueType)" class="field-setting-item">
                                    <div class="label">默认值</div>
                                    <bk-switcher v-model="formData.fieldEdit.defaultValue" theme="primary"></bk-switcher>
                                </div>
                                <div v-if="['singlechar', 'longchar'].includes(formData.valueType)" class="field-setting-item">
                                    <div class="label">正则校验</div>
                                    <bk-input
                                        v-model="formData.fieldEdit.regularCheck"
                                        placeholder="请输入"
                                        :type="'textarea'"
                                        :rows="3">
                                    </bk-input>
                                </div>
                                <div v-if="['int', 'float'].includes(formData.valueType)" class="field-setting-item">
                                    <div class="label line-height-32">最小值</div>
                                    <bk-input
                                        v-model="formData.fieldEdit.minValue"
                                        type="number"
                                        placeholder="请输入最小数值"
                                        @change="verificationNumber('min')">
                                    </bk-input>
                                </div>
                                <div v-if="['int', 'float'].includes(formData.valueType)" class="field-setting-item">
                                    <div class="label line-height-32">最大值</div>
                                    <bk-input
                                        v-model="formData.fieldEdit.maxValue"
                                        type="number"
                                        placeholder="请输入最大数值"
                                        @change="verificationNumber('max')">
                                    </bk-input>
                                </div> -->
                                <div v-if="['list', 'enum'].includes(formData.valueType)" class="field-setting-item">
                                    <div class="label">{{formData.valueType === 'list' ? '列表' : '枚举'}}值</div>
                                    <div class="list-type" style="flex: 1;">
                                        <div class="already-add-list">
                                            <transition-group class="container" name="sort">
                                                <div
                                                    v-for="(item, index) in alreadyAddList"
                                                    :key="item.id"
                                                    :class="[
                                                        'already-add-list-item',
                                                        index !== 0 && 'item-top',
                                                        item.id === dragEndId && dragStartId !== dragEndId && (dragStartIndex > dragEndIndex ? 'already-add-active-top' : 'already-add-active-bottom')
                                                    ]">
                                                    <div
                                                        class="drag-box"
                                                        draggable="true"
                                                        @dragstart="dragstart(item, index)"
                                                        @dragenter="dragenter(item, index)"
                                                        @dragend="getDragend()"
                                                        @dragover="dragover($event)">
                                                        <div style="margin-right: 5px;">
                                                            <i class="cw-icon weops-drag-drop"></i>
                                                        </div>
                                                        <div class="input-box">
                                                            <el-input
                                                                v-if="formData.valueType === 'enum'"
                                                                size="small"
                                                                v-model="item.valueId"
                                                                style="width: 110px;margin-right: 10px;"
                                                                placeholder="请输入ID"
                                                                @change="changeValueId(item, index)">
                                                            </el-input>
                                                            <span class="error-input-msg">{{item.valueIdErrorMsg}}</span>
                                                        </div>
                                                        <div class="input-box" style="flex: 1;">
                                                            <el-input
                                                                v-model="item.name"
                                                                size="small"
                                                                style="width: 100%;"
                                                                placeholder="请输入值"
                                                                @change="changeName(item, index)">
                                                            </el-input>
                                                            <span class="error-input-msg">{{item.nameErrorMsg}}</span>
                                                        </div>
                                                        <div class="icon-box" :style="{ flexDirection: alreadyAddList.length > 1 ? 'row' : 'row-reverse' }">
                                                            <i class="cw-icon weops-add" @click="addListTypeData"></i>
                                                            <i
                                                                v-if="alreadyAddList.length > 1"
                                                                class="cw-icon weops-delete"
                                                                @click="deleteListTypeData(index)">
                                                            </i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </transition-group>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    v-if="['enum'].includes(formData.valueType)"
                                    class="field-setting-item default-value-setting"
                                    style="display: flex;">
                                    <div class="label line-height-32">默认值设置</div>
                                    <el-select
                                        v-model="formData.fieldEdit.enumDefaultValue"
                                        size="small"
                                        placeholder="请选择默认值"
                                        :clearable="false"
                                        searchable
                                        style="flex: 1;">
                                        <el-option
                                            v-for="option in enumDefaultList"
                                            :key="option.id"
                                            :value="option.id"
                                            :label="option.name">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <!-- <bk-form-item
                                label="所属分组"
                                :required="true"
                                :property="'group'"
                                :error-display-type="'normal'">
                                <bk-select
                                    v-model="formData.group"
                                    placeholder="请选择所属分组"
                                    searchable
                                    :disabled="!isAdd"
                                    :clearable="false">
                                    <bk-option
                                        v-for="option in groupList"
                                        :key="option.id"
                                        :id="option.id"
                                        :name="option.name">
                                    </bk-option>
                                </bk-select>
                            </bk-form-item>
                            <bk-form-item
                                v-if="!['date', 'time', 'bool'].includes(formData.valueType)"
                                label="是否唯一"
                                :required="true"
                                :property="'is_only'"
                                ext-cls="whether-class"
                                :error-display-type="'normal'">
                                <bk-radio-group v-model="formData.is_only">
                                    <bk-radio :value="true" style="margin-right: 27px;">是</bk-radio>
                                    <bk-radio :value="false">否</bk-radio>
                                </bk-radio-group>
                            </bk-form-item> -->
                            <el-form-item
                                label="是否必填"
                                prop="is_required"
                                ext-cls="whether-class"
                                :error-display-type="'normal'">
                                <el-radio-group v-model="formData.is_required" style="width: 100%;">
                                    <el-radio :label="true" class="mr20">是</el-radio>
                                    <el-radio :label="false">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <!-- <bk-form-item
                                v-if="formData.valueType === 'int'"
                                label="单位">
                                <bk-cascade
                                    clearable
                                    :list="unitOptions"
                                    :options="{
                                        childrenKey: 'formats'
                                    }"
                                    placeholder="请选择数据单位"
                                    v-model="formData.unitGroup"
                                    style="width: 100%;"
                                    @change="changeUnit">
                                </bk-cascade>
                            </bk-form-item> -->
                        </el-form>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <el-button
                    :disabled="loading"
                    type="primary"
                    size="small"
                    @click="validate">
                    提交
                </el-button>
                <el-button
                    :disabled="loading"
                    size="small"
                    type="default"
                    @click="cancel">
                    取消
                </el-button>
            </div>
        </drawer-component>
    </div>
</template>

<script lang="ts">
    import { OPERATE_TYPE_LIST } from '@/common/constants/assetManage/modelManage'
    import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
    import DrawerComponent from '@/components/comDrawer/index.vue'
    @Component({
        name: 'attributes-operation',
        components: {
        DrawerComponent
    }
    })
    export default class AttributesOperation extends Vue {
        @Prop({
            type: String,
            default: () => ''
        })
        modelId: string
        isShow: boolean = false
        currentType: string = ''
        formData: any = {
            propertyID: '',
            name: '',
            valueType: '',
            group: '',
            is_only: '',
            is_required: false,
            fieldEdit: {
                isEdit: false,
                defaultValue: false,
                regularCheck: '',
                minValue: '',
                maxValue: '',
                enumDefaultValue: ''
            }
        }
        formDataV2: any = {}
        rules = {
            propertyID: [
                {
                    required: true,
                    message: '请输入属性ID',
                    trigger: 'blur'
                },
                {
                    validator: (rule, value, callback) => this.validatePropertyID(rule, value, callback),
                    trigger: 'blur'
                }
                // {
                //     validator: function(val) {
                //         return !val.startsWith('bk_')
                //     },
                //     message: '不能以“bk_”开头',
                //     trigger: 'blur'
                // }
            ],
            name: [
                {
                    required: true,
                    message: '请输入属性名',
                    trigger: 'blur'
                }
            ],
            valueType: [
                {
                    required: true,
                    message: '请选择值类型',
                    trigger: 'blur'
                }
            ],
            group: [
                {
                    required: true,
                    message: '请选择所属分组',
                    trigger: 'blur'
                }
            ],
            is_only: [
                {
                    required: true,
                    message: '请选择是否唯一',
                    trigger: 'blur'
                }
            ],
            is_required: [
                {
                    required: true,
                    message: '请选择是否必填',
                    trigger: 'blur'
                }
            ]
        }
        valueTypeList = OPERATE_TYPE_LIST
        groupList: Array<any> = []
        loading: boolean = false
        operationMap = {
            'singlechar': 'regularCheck',
            'str': 'regularCheck',
            'bool': 'defaultValue'
        }
        oldData: any = ''
        dragStartId: string | number = ''
        dragEndId: string | number = ''
        dragStartIndex: string | number = ''
        dragEndIndex: string | number = ''
        alreadyAddList: Array<any> = []
        enumDefaultList: Array<any> = []
        attrData: any = {}
        unitOptions: any[] = []
        @Watch('alreadyAddList', {
            immediate: true,
            deep: true
        })
        onAlreadyAddListChanged(val) {
            this.enumDefaultList = val.filter(item => item.valueId && item.name).map(item => {
                return {
                    id: item.name,
                    name: item.name
                }
            })
            this.enumDefaultList = this.$ArrayObjDup(this.enumDefaultList, 'id')
            if (this.enumDefaultList.length === 1) {
                this.formData.fieldEdit.enumDefaultValue = this.enumDefaultList[0].id
            }
        }
        get username() {
            return this.$store.state.permission.user.username
        }
        get isAdd() {
            return this.currentType === '添加'
        }
        validatePropertyID(rule, value, callback) {
            if (!/^[a-zA-Z]([a-zA-Z0-9_]+)?$/.test(value)) {
                callback(new Error('请填写英文开头，下划线、数字、英文的组合'))
            } else {
                callback()
            }
        }
        verificationNumber(type) {
            const minValue = Number(this.formData.fieldEdit.minValue)
            const maxValue = Number(this.formData.fieldEdit.maxValue)
            if (this.formData.fieldEdit.minValue !== '' && this.formData.fieldEdit.maxValue !== '') {
                if (minValue >= maxValue) {
                    if (type === 'min') {
                        this.$nextTick(() => {
                            this.formData.fieldEdit.minValue = maxValue - 1
                        })
                    } else {
                        this.$nextTick(() => {
                            this.formData.fieldEdit.maxValue = minValue + 1
                        })
                    }
                }
            }
        }
        handleErrorMsg(item, index, valueLabel, errorMsg) {
            if (!item[valueLabel]) {
                item[errorMsg] = '该字段是必填项'
            }
            this.alreadyAddList.forEach((tex, i) => {
                if (tex[errorMsg] !== '该字段是必填项' || (index === i && item[valueLabel])) {
                    tex[errorMsg] = ''
                }
                this.alreadyAddList.forEach((nev, k) => {
                    if (i !== k && nev[valueLabel] && tex[valueLabel] === nev[valueLabel]) {
                        nev[errorMsg] = '重复的值'
                        tex[errorMsg] = '重复的值'
                    }
                })
            })
        }
        changeValueId(item, index) {
            this.handleErrorMsg(item, index, 'valueId', 'valueIdErrorMsg')
        }
        changeName(item, index) {
            this.handleErrorMsg(item, index, 'name', 'nameErrorMsg')
        }
        deleteListTypeData(index) {
            this.alreadyAddList.splice(index, 1)
        }
        changeValueType() {
            this.alreadyAddList = []
            if (['list', 'enum'].includes(this.formData.valueType)) {
                this.alreadyAddList = [
                    {
                        id: this.$random(5),
                        name: '',
                        valueId: '',
                        valueIdErrorMsg: '',
                        nameErrorMsg: ''
                    }
                ]
            }
        }
        addListTypeData() {
            this.alreadyAddList.push({
                    id: this.$random(5),
                    name: '',
                    valueId: '',
                    valueIdErrorMsg: '',
                    nameErrorMsg: ''
                }
            )
        }
        dragstart(value, index) {
            this.oldData = value
            this.dragStartId = value.id
            this.dragStartIndex = index
        }
        dragenter(value, index) {
            this.dragEndId = value.id
            this.dragEndIndex = index
        }
        dragover(e) {
            e.preventDefault()
        }
        getDragend() {
            if (this.dragStartId !== this.dragEndId) {
                const oldIndex = this.alreadyAddList.findIndex(item => item.id === this.dragStartId)
                const newIndex = this.alreadyAddList.findIndex(item => item.id === this.dragEndId)
                // 删除之前DOM节点
                this.alreadyAddList.splice(oldIndex, 1)
                // 在拖拽结束目标位置增加新的DOM节点
                this.alreadyAddList.splice(newIndex, 0, this.oldData)
            }
            this.dragEndId = ''
        }
        show(data) {
            this.hiddenSlider()
            this.isShow = true
            // this.unitOptions = getCategories().map(option => ({
            //     id: option.name,
            //     ...option
            // }))
            this.currentType = data.type
            this.groupList = data.groupList
            this.formData.valueType = this.valueTypeList[0].id
            if (data.type === '编辑') {
                this.handleEditTypeFirst(data)
            }
            this.formDataV2 = this.$deepClone(this.formData)
        }
        changeUnit(value) {
            const id = value?.[1]
            if (id) {
                this.formData.unit = id
                // this.formData.unitName = getUnitNameById(this.unitOptions, id)
            }
        }
        handleEditTypeFirst(data) {
            this.attrData = data.rowData
            const { unit_info: unitInfo } = this.attrData
            this.formData = {
                propertyID: this.attrData.attr_id,
                name: this.attrData.attr_name || '',
                valueType: this.attrData.attr_type || '',
                group: this.attrData.attr_group || '',
                is_only: this.attrData.is_only || false,
                is_required: this.attrData.is_required || false,
                fieldEdit: {
                    isEdit: this.attrData.editable || false,
                    defaultValue: false,
                    regularCheck: '',
                    minValue: '',
                    maxValue: '',
                    enumDefaultValue: ''
                },
                unit: unitInfo?.unit || '',
                unitName: unitInfo?.unit_name || ''
                // unitGroup: getUnitIdPath(this.unitOptions, unitInfo.unit) || []
            }
            this.handleEditTypeSecond()
        }
        handleEditTypeSecond() {
            if (['bool'].includes(this.formData.valueType)) {
                this.formData.fieldEdit.defaultValue = this.attrData.option || false
            }
            if (['singlechar', 'str'].includes(this.formData.valueType)) {
                this.formData.fieldEdit.regularCheck = this.attrData.option || ''
            }
            if (['int', 'float'].includes(this.formData.valueType)) {
                this.formData.fieldEdit.minValue = this.attrData.option?.min || 0
                this.formData.fieldEdit.maxValue = this.attrData.option?.max || 0
            }
            if (['list', 'enum'].includes(this.formData.valueType)) {
                this.alreadyAddList = this.attrData.option.map(item => {
                    if (item.is_default) {
                        this.formData.fieldEdit.enumDefaultValue = item.name
                    }
                    return {
                        id: this.$random(5),
                        name: item.name,
                        valueId: item.id,
                        valueIdErrorMsg: '',
                        nameErrorMsg: ''
                    }
                })
            }
        }
        validate() {
            const validateForm: any = this.$refs.validateForm
            validateForm.validate(validator => {
                if (validator) {
                    const params = this.handleParams()
                    const enumFlag = this.alreadyAddList.every(item => !item.nameErrorMsg)
                    enumFlag && this.save(params)
                }
            })
        }
        handleParams() {
            const params: any = {
                id: this.modelId,
                attr_id: this.formData.propertyID,
                attr_name: this.formData.name,
                attr_type: this.formData.valueType,
                is_required: this.formData.is_required,
                attr_group: '',
                is_only: false,
                editable: false
            }
            this.handleNormalType(params)
            this.handleEnumType(params)
            return params
        }
        handleNormalType(params) {
            if (['singlechar', 'str', 'bool'].includes(this.formData.valueType)) {
                params.option = this.formData.fieldEdit[this.operationMap[this.formData.valueType]]
            }
            if (['int', 'float'].includes(this.formData.valueType)) {
                params.option = {
                    min: Number(this.formData.fieldEdit.minValue),
                    max: Number(this.formData.fieldEdit.maxValue)
                }
            }
            if (this.formData.valueType === 'list') {
                params.option = this.alreadyAddList.map(item => {
                    return item.name
                })
            }
        }
        handleEnumType(params) {
            if (this.formData.valueType === 'enum') {
                const target = this.alreadyAddList.find(item => !item.valueId || !item.name || item.nameErrorMsg || item.valueIdErrorMsg)
                if (target) {
                    this.alreadyAddList.forEach(item => {
                        !item.name ? item.nameErrorMsg = '该字段是必填项' : item.nameErrorMsg = ''
                        !item.valueId ? item.valueIdErrorMsg = '该字段是必填项' : item.valueIdErrorMsg = ''
                    })
                    return false
                }
                params.option = this.alreadyAddList.map(item => {
                    const obj = {
                        id: item.valueId,
                        is_default: false,
                        name: item.name,
                        type: 'text'
                    }
                    if (item.name === this.formData.fieldEdit.enumDefaultValue) {
                        obj.is_default = true
                    }
                    return obj
                })
            }
        }
        save(params) {
            this.loading = true
            this.$api.ModelManage[this.isAdd ? 'createModelAttr' : 'updateModelAttr'](params).then(res => {
                if (!res.result) {
                    this.$error(res.message)
                    return false
                }
                this.$success(`${this.isAdd ? '新增' : '修改'}属性成功`)
                this.isShow = false
                this.$emit('getTableData')
            }).finally(() => {
                this.loading = false
            })
        }
        cancel() {
            const flag = this.$compareFormData(this.formData, this.formDataV2)
            if (!flag) {
                this.$confirm('放弃将导致未保存信息丢失', '是否放弃本次操作？', {
                    center: true
                }).then(() => {
                    this.isShow = false
                })
            } else {
                this.isShow = false
            }
        }
        hiddenSlider() {
            Object.assign(this.$data, this.$options.data.call(this))
        }
        changeVisible(val) {
            this.isShow = val
        }
    }
</script>

<style scoped lang="scss">
    /deep/ .whether-class {
        .bk-form-content {
            display: flex;
            align-items: center;
        }
    }
    .form-box {
        width: 100%;
        .field-setting {
            width: 100%;
            background-color: #F0F8FF;
            border-radius: 2px;
            margin: 20px 0;
            padding: 20px 20px 1px 14px;
            box-sizing: border-box;
            .field-setting-item {
                display: flex;
                color: #63656E;
                margin-bottom: 19px;
                .label {
                    margin-right: 20px;
                    width: 70px;
                    min-width: 70px;
                    text-align: right;
                }
                .line-height-32 {
                    line-height: 32px;
                }
                .list-type {
                    .introduction {
                        color: #9B9B9B;
                    }
                }
                .already-add-list {
                    .already-add-list-item {
                        display: flex;
                        justify-content: space-between;
                        height: 34px;
                        line-height: 34px;
                        position: relative;
                        .drag-box {
                            flex: 1;
                            display: flex;
                            .name {
                                color: $cw-color-text-0;
                            }
                            .cw-icon {
                                color: $cw-color-text-3;
                            }
                            .weops-add,
                            .weops-delete {
                                color: #3A84FF !important;
                                cursor: pointer;
                                font-size: 16px;
                                margin-left: 5px;
                            }
                            .weops-add {
                                margin-left: 11px;
                            }
                            .weops-drag-drop {
                                cursor: move;
                                font-size: 16px;
                            }
                            .input-box {
                                position: relative;
                                .error-input-msg {
                                    line-height: 12px;
                                    position: absolute;
                                    left: 0;
                                    bottom: -15px;
                                    color: #ea3636;
                                    font-size: 12px;
                                }
                            }
                            .icon-box {
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                position: relative;
                                top: 1px;
                            }
                        }
                        .cw-icon-a-guanbi2 {
                            color: $cw-color-text-3;
                        }
                        .cw-icon-a-guanbi2:hover {
                            color: $cw-color-text-2;
                        }
                    }
                    .item-top {
                        margin-top: 14px;
                    }
                    .already-add-active-top::after,
                    .already-add-active-bottom::after {
                        position: absolute;
                        display: block;
                        content: "";
                        width: 100%;
                        height: 1px;
                        background-color: #0D90FC;
                    }
                    .already-add-active-top::after {
                        top: -5px;
                    }
                    .already-add-active-bottom::after {
                        bottom: -5px;
                    }
                }
            }
            .default-value-setting {
                /deep/ .bk-select {
                    background-color: #fff;
                }
            }
        }
    }
</style>
