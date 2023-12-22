<template>
    <div class="app-permission" v-bkloading="{ isLoading: appLoading, zIndex: 10 }">
        <div class="content-box">
            <bk-transfer
                :source-list="rtxList"
                :target-list="rtxValue"
                :display-key="'bk_biz_name'"
                :sort-key="'bk_biz_id'"
                :setting-key="'bk_biz_id'"
                :sortable="true"
                @change="change"
            >
                <div slot="left-header" class="left-header">
                    <label>{{'无权限应用(' + sourceLength + ')'}}</label>
                    <div class="add-all">
                        <span @click="addAll" v-if="sourceLength">选择全部</span>
                        <span v-else class="disabled">选择全部</span>
                    </div>
                </div>
                <div slot="right-header" class="right-header">
                    <label>{{'有权限应用(' + targetLength + ')'}}</label>
                    <div class="remove-all">
                        <span @click="removeAll" v-if="targetLength">全部移除</span>
                        <span class="disabled" v-else>全部移除</span>
                    </div>
                </div>
                <div slot="left-empty-content">
                    <div class="empty-content">
                        数据为空
                    </div>
                </div>
                <div slot="right-empty-content">
                    <div class="empty-content">
                        未选择任何数据
                    </div>
                </div>
            </bk-transfer>
        </div>
    </div>
</template>

<script lang="ts">
    import { bkTransfer } from 'bk-magic-vue'
    import { Vue, Component, Prop } from 'vue-property-decorator'
    @Component({
        name: 'app-permission',
        components: {
            bkTransfer
        }
    })
    export default class AppPermission extends Vue {
        @Prop({
            type: Object,
            default: () => ({})
        })
        role: any | undefined
        rtxList: Array<any> = []
        rtxValue: Array<any> = []
        sourceLength: number = 0
        targetLength: number = 0
        selectApp: Array<any> = []
        appLoading: boolean = false
        // mounted() {
        //     this.appLoading = true
        //     this.$emit('getAppLoading', this.appLoading)
        //     Promise.all([this.getBusiness(), this.getRoleApplications()]).then(res => {
        //         const [businessRes, roleAppRes] = res
        //         if (businessRes.result) {
        //             this.rtxList = businessRes.data
        //         }
        //         if (roleAppRes.result) {
        //             this.rtxValue = roleAppRes.data
        //         }
        //     }).finally(() => {
        //         this.appLoading = false
        //         this.$emit('getAppLoading', this.appLoading)
        //     })
        // }
        getRoleApplications() {
            return this.$api.RoleManageMain.getRoleApplications({
                id: this.role.id
            })
        }
        confirm() {
            this.appLoading = true
            this.$emit('getAppLoading', this.appLoading)
            const params = {
                id: this.role.id,
                app_ids: this.selectApp.map(item => item.bk_biz_id)
            }
            this.$api.RoleManageMain.setAppPermissions(params).then(res => {
                if (!res.result) {
                    this.$error(res.message)
                    return false
                }
                this.$success('应用权限设置成功！')
            }).finally(() => {
                this.appLoading = false
                this.$emit('getAppLoading', this.appLoading)
            })
        }
        change(sourceList, targetList) {
            this.sourceLength = sourceList.length
            this.targetLength = targetList.length
            this.selectApp = targetList
        }
        // getBusiness() {
        //     return this.$api.Server.getBizs()
        // }
        addAll() {
            this.rtxValue = this.rtxList.map(item => {
                return item.bk_biz_id
            })
        }
        removeAll() {
            this.rtxValue = []
        }
        getLatestApp() {
            this.$emit('getLatestApp', this.selectApp.map(item => item.bk_biz_id))
        }
    }
</script>

<style scoped lang="scss">
    /deep/ .bk-transfer {
        height: 100%;
        .source-list,
        .target-list {
            height: 100%;
        }
    }
    .app-permission {
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 0 20px;
        .content-box {
            flex: 1;
            height: 0;
            overflow: auto;
            margin-top: 20px;
            .left-header label,
            .right-header label {
                display: inline-block;
                font-size: 12px;
            }
            .add-all {
                display: inline-block;
                float: right;
                cursor: pointer;
                font-size: 14px;
                span {
                    color: #3a84ff;
                    &.disabled {
                        cursor: not-allowed;
                        opacity: 0.5;
                    }
                }
            }
            .add-all {
                display: inline-block;
                float: right;
                cursor: pointer;
                font-size: 12px;
            }
            .add-all span {
                color: #3a84ff;
            }
            .disabled {
                cursor: not-allowed;
                opacity: 0.5;
            }
            .remove-all {
                display: inline-block;
                float: right;
                cursor: pointer;
                font-size: 12px;
            }
            .remove-all span {
                color: #ea3636;
            }
            .empty-content {
                position: relative;
                top: 145px;
                text-align: center;
            }
        }
    }
</style>
