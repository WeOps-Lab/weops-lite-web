<template>
    <div>
        <bk-sideslider
            :width="750"
            :is-show.sync="visible"
            :mask-close="false"
            @hidden="visible = false">
            <div slot="header">权限管理-{{`${isAdd ? '新增' : '编辑'}实例权限`}}</div>
            <div slot="content" class="content-box" v-bkloading="{ isLoading: pageLoading }">
                <div class="form-box">
                    <bk-form :label-width="90" :model="formData" :rules="rules" ref="validateForm">
                        <bk-form-item
                            label="实例类型"
                            :required="true"
                            :property="'instanceType'"
                            :error-display-type="'normal'">
                            <bk-select
                                :loading="instanceTypeLoading"
                                v-model="formData.instanceType"
                                style="width: 300px;"
                                :clearable="false"
                                @change="changeInstanceType">
                                <bk-option
                                    v-for="option in instanceTypeList"
                                    :key="option.instance_type"
                                    :id="option.instance_type"
                                    :name="option.instance_type">
                                </bk-option>
                            </bk-select>
                        </bk-form-item>
                        <bk-form-item
                            v-if="isShowModel"
                            label="模型"
                            :required="true"
                            :property="'modelId'"
                            :error-display-type="'normal'">
                            <bk-select
                                searchable
                                :loading="modelLoading"
                                v-model="formData.modelId"
                                style="width: 300px;"
                                @change="changeModel">
                                <bk-option
                                    v-for="option in modelList"
                                    :key="option.bk_obj_id"
                                    :id="option.bk_obj_id"
                                    :disabled="option.disabled"
                                    :name="option.bk_obj_name">
                                </bk-option>
                            </bk-select>
                        </bk-form-item>
                        <bk-form-item
                            v-if="permissionTypeList.length"
                            label="权限类型"
                            :required="true"
                            :property="'permissionType'"
                            :error-display-type="'normal'">
                            <bk-checkbox
                                v-for="item in permissionTypeList"
                                :true-value="true"
                                :false-value="false"
                                :key="item.id"
                                v-model="item.value"
                                class="mr20"
                                @change="changeCheckbox(item)">
                                {{item.label}}
                            </bk-checkbox>
                        </bk-form-item>
                        <bk-form-item
                            label="实例范围"
                            :required="true"
                            :error-display-type="'normal'">
                            <bk-button
                                :disabled="columnsLoading"
                                :theme="'primary'"
                                class="mr20"
                                @click="addInstance">
                                新增实例
                            </bk-button>
                            <bk-button
                                :disabled="!selectTableList.length"
                                :theme="'default'"
                                @click="batchRemoveList">
                                批量移除
                            </bk-button>
                        </bk-form-item>
                    </bk-form>
                    <com-table
                        v-bkloading="{ isLoading: columnsLoading }"
                        class="mt20"
                        ref="comTable"
                        :data="tableData"
                        :columns="columns"
                        @select-all="select"
                        @select="select">
                        <template slot="operation" slot-scope="{ index }">
                            <bk-button
                                :text="true"
                                title="primary"
                                @click="removeSelectList(index)">
                                移除
                            </bk-button>
                        </template>
                    </com-table>
                </div>
                <div class="foot-box">
                    <bk-button :theme="'default'" type="submit" @click="cancel">
                        取消
                    </bk-button>
                    <bk-button
                        :loading="loading"
                        :theme="'primary'"
                        class="mr10"
                        @click="confirm">
                        确认
                    </bk-button>
                </div>
            </div>
        </bk-sideslider>
        <add-instance
            ref="addInstance"
            :instance-show-field="instanceShowField"
            :instance-type="formData.instanceType"
            :model-id="formData.modelId"
            :instance-columns="instanceColumns"
            @change-list="getSelectList">
        </add-instance>
    </div>
</template>
<script lang="ts">
    import {Vue, Component, Prop} from 'vue-property-decorator'
    import ComTable from '@/components/comTable.vue'
    import AddInstance from './addInstance.vue'
    @Component({
        components: {
            ComTable,
            AddInstance
        }
    })
    export default class operateInstancePermission extends Vue {
        @Prop({
            type: Object,
            default: () => ({})
        })
        role: any
        loading: boolean = false
        visible: boolean = false
        type: string = 'add'
        instanceTypeList: any[] = []
        permissionTypeList: any[] = []
        tableData: any = []
        columns: any = []
        formData: any = {
            instanceType: '',
            permissionType: [],
            instanceScope: [],
            modelId: ''
        }
        rules: any = {
            instanceType: [
                {
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }
            ],
            permissionType: [
                {
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }
            ],
            modelId: [
                {
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }
            ]
        }
        instanceTypeLoading: boolean = false
        instanceColumns: any[] = []
        instanceShowField: string = ''
        selectTableList: any[] = []
        detail: any = ''
        instancePermissionDetail: any = {}
        modelLoading: boolean = false
        modelList: any[] = []
        pageLoading: boolean = false
        columnsLoading: boolean = false
        isFirstEnter: boolean = true
        get isAdd() {
            return this.type === 'add'
        }
        get isShowModel() {
            return ['监控策略', '监控采集'].includes(this.formData.instanceType)
        }
        changeCheckbox(option) {
            if (option.id === 'manage') {
                this.setPermissionType('view', true)
            }
            if (option.id === 'view' && !option.value) {
                this.setPermissionType('manage', option.value)
            }
            this.formData.permissionType = this.permissionTypeList.filter(item => item.value).map(item => item.id)
        }
        setPermissionType(id, value) {
            this.permissionTypeList.forEach(item => {
                if (item.id === id) {
                    this.$set(item, 'value', value)
                }
            })
        }
        async show(type, data) {
            Object.assign(this.$data, this.$options.data.call(this))
            this.visible = true
            this.type = type
            this.initData()
            this.detail = data || {}
            try {
                if (!this.isAdd) {
                    this.pageLoading = true
                    await Promise.all([
                        this.getInstancePermissionDetail(this.detail.id),
                        this.getInstanceTypes()
                    ])
                    this.formData.instanceType = this.instancePermissionDetail.instance_type
                    await this.$nextTick()

                    for (const k in this.instancePermissionDetail.permissions) {
                        if (this.instancePermissionDetail.permissions[k] && k !== 'bk_obj_id') {
                            this.permissionTypeList.forEach(item => {
                                if (item.id === k) {
                                    this.$set(item, 'value', true)
                                }
                            })
                        }
                    }

                    this.formData.permissionType = this.permissionTypeList
                        .filter(item => item.value)
                        .map(item => item.id)

                    this.formData.modelId = this.instancePermissionDetail.permissions.bk_obj_id

                    const res = await this.$api.RoleManageMain.getInstances({
                        page: 1,
                        page_size: 9999,
                        search: '',
                        instance_type: this.formData.instanceType,
                        bk_obj_id: this.formData.modelId
                    })

                    const { result, data } = res

                    if (result) {
                        const dataMap = data.items.reduce((map, item) => {
                            map[item.id] = item
                            return map
                        }, {})

                        this.instancePermissionDetail.instances.forEach(item => {
                            const target = dataMap[item]
                            if (target) {
                                this.tableData.push(target)
                            }
                        })
                    }
                    this.pageLoading = false
                } else {
                    await this.getInstanceTypes()
                }
            } catch (error) {
                console.error('An error occurred:', error)
            } finally {
                this.pageLoading = false
            }
        }
        changeModel() {
            this.instanceShowField = ''
            if (!this.isFirstEnter) {
                this.tableData = []
            }
            this.instanceColumns = []
            if (!this.formData.modelId) {
                return false
            }
            this.columnsLoading = true
            this.$api.RoleManageMain.getMonitorAttrs({
                bk_obj_id: this.formData.modelId,
                instance_type: this.formData.instanceType
            }).then(res => {
                const { result, data } = res
                if (!result) {
                    return false
                }
                this.instanceShowField = data.show
                this.handleColumns(data.fields)
                this.isFirstEnter = false
            }).finally(() => {
                this.columnsLoading = false
            })
        }
        initData() {
            this.formData = {
                instanceType: '',
                permissionType: [],
                instanceScope: [],
                modelId: ''
            }
            this.tableData = []
        }
        getInstancePermissionDetail(id) {
            return this.$api.RoleManageMain.getInstPermissionsDetail({
                id
            }).then(res => {
                const { result, data } = res
                if (!result) {
                    return false
                }
                this.instancePermissionDetail = data
            })
        }
        select(selection) {
            this.selectTableList = selection
        }
        batchRemoveList() {
            this.selectTableList.forEach(item => {
                const index = this.tableData.findIndex(tex => tex.id === item.id)
                this.tableData.splice(index, 1)
            })
            this.selectTableList = []
        }
        removeSelectList(index) {
            this.tableData.splice(index, 1)
        }
        getSelectList(data) {
            this.tableData = data
        }
        changeInstanceType(val) {
            this.permissionTypeList = []
            this.tableData = []
            this.instanceColumns = []
            this.instanceShowField = ''
            this.formData.modelId = ''
            const target = this.instanceTypeList.find(item => item.instance_type === val)
            for (const k in target.permissions) {
                this.permissionTypeList.push({
                    id: k,
                    label: target.permissions[k],
                    value: false
                })
            }
            if (this.isShowModel) {
                this.getModelList(val)
                return false
            }
            this.handleColumns(target.fields)
            this.instanceShowField = target.show
        }
        handleColumns(fields) {
            this.instanceColumns = [
                {
                    type: 'selection',
                    width: '50px'
                }
            ]
            for (const k in fields) {
                if (k !== 'id') {
                    this.instanceColumns.push({
                        label: fields[k],
                        key: k,
                        align: 'left',
                        minWidth: '120px'
                    })
                }
            }
            this.$nextTick(() => {
                const comTable: any = this.$refs.comTable
                this.columns = this.instanceColumns.concat([
                    {
                        label: '操作',
                        key: 'operation',
                        width: '160px',
                        prop: 'operation',
                        scopedSlots: 'operation'
                    }
                ])
                comTable.updateColumns(this.columns)
            })
        }
        getModelList(val) {
            this.modelLoading = true
            this.$api.MonitorCollectMain[val === '监控策略' ? 'getStrategyTree' : 'getCollectTree']().then(res => {
                const { result, data } = res
                if (!result) {
                    return false
                }
                const specialNames = val === '监控策略' ? [] : ['Cloud', 'bk_device', 'k8s']
                this.modelList = this.extractLastItems(data, specialNames)
                if (val === '监控策略') {
                    this.modelList.forEach(item => {
                        item.disabled = item.bk_obj_id === 'bk_web_measurement'
                    })
                }
                if (!this.isAdd) {
                    this.formData.modelId = this.instancePermissionDetail.permissions.bk_obj_id || ''
                }
            }).finally(() => {
                this.modelLoading = false
            })
        }
        // 用于从data中提取出最后一级的子项
        extractLastItems(data, specialNames = []) {
            const result = []
            data.forEach(item => {
                if (item.children && item.children.length > 0) {
                    // 如果当前项的名称在specialNames中，则直接将当前项添加到result中
                    if (specialNames.includes(item.name)) {
                        result.push({
                            bk_obj_id: item.name,
                            bk_obj_name: item.cn_name
                        })
                    } else {
                        result.push(...this.extractLastItems(item.children, specialNames))
                    }
                } else {
                    // 如果当前项不具有子项，则直接将当前项添加到result中
                    const newItem = {
                      bk_obj_id: item.bk_obj_id || item.name,
                      bk_obj_name: item.bk_obj_name || item.cn_name
                    }
                    result.push(newItem)
                }
            })
            // 返回result数组，包含了所有提取出的最后一级子项
            return result
        }
        getInstanceTypes() {
            this.instanceTypeLoading = true
            return this.$api.RoleManageMain.getInstanceTypes().then(res => {
                const { result, data } = res
                if (!result) {
                    return false
                }
                this.instanceTypeList = data
            }).finally(() => {
                this.instanceTypeLoading = false
            })
        }
        addInstance() {
            if (!this.formData.instanceType) {
                this.$warn('请先选择实例类型')
                return false
            }
            if (this.isShowModel && !this.formData.modelId) {
                this.$warn('请先选择模型')
                return false
            }
            const addInstance: any = this.$refs.addInstance
            addInstance.show(this.tableData)
        }
        confirm() {
            const validateForm: any = this.$refs.validateForm
            validateForm.validate().then(validator => {
                if (!this.tableData.length) {
                    this.$warn('请选择实例')
                    return false
                }
                const url = this.isAdd ? 'createInstPermissions' : 'editInstPermissions'
                const body = {
                    instance_type: this.formData.instanceType,
                    permissions: {
                        use: !!this.formData.permissionType.find(item => item === 'use'),
                        view: !!this.formData.permissionType.find(item => item === 'view'),
                        manage: !!this.formData.permissionType.find(item => item === 'manage'),
                        bk_obj_id: this.formData.modelId
                    },
                    instances: this.tableData.map(item => item.id),
                    role: this.role.id
                }
                this.loading = true
                this.$api.RoleManageMain[url](this.isAdd ? body : {
                    id: this.detail.id,
                    body
                }).then(res => {
                    const { result, message } = res
                    if (!result) {
                        this.$error(message)
                        return false
                    }
                    this.$success(`${this.isAdd ? '新增' : '修改'}实例权限成功`)
                    this.cancel()
                    this.$emit('refresh-list')
                }).finally(() => {
                    this.loading = false
                })
            })
        }
        cancel() {
            this.visible = false
        }
    }
</script>

<style lang="scss" scoped>
    .foot-box {
        display: flex;
        flex-direction: row-reverse;
        margin-top: 20px;
        padding: 0 20px;
    }
    .content-box {
        height: calc(100vh - 60px);
        padding-bottom: 20px;
        display: flex;
        flex-direction: column;
        .form-box {
            flex: 1;
            padding: 20px 20px 0 20px;
        }
    }
    /deep/.bk-table-body-wrapper {
        max-height: calc(100vh - 350px);
        overflow-y: scroll;
    }
</style>
