<template>
    <drawer-component
        title="导入资产"
        :size="640"
        :visible="visible"
        destroy-on-close
        custom-class="common-dialog-wrapper"
        :before-close="beforeCloseDialog"
        @changeVisible="changeVisible">
        <div slot="content" class="content-box common-dialog-wrapper-main">
            <div class="upload-area">
                <el-upload
                    class="upload-com"
                    :accept="'.xls,.xlsx'"
                    :file-list="formData.fileList"
                    :http-request="handleUpload"
                    :show-file-list="false"
                    drag
                    action="https://jsonplaceholder.typicode.com/posts/">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传xlsx文件，且不超过20MB</div>
                </el-upload>
                <span class="template-file" @click="handleDownload"><span class="cw-icon file-download weops-download"></span>下载模板</span>
                <ul v-if="formData.fileList.length" class="file-list">
                    <li v-for="(item, index) in formData.fileList" :key="index">
                        <div class="file-list-name">
                            <span class="file-success cw-icon weops-complete-fill"></span>
                            <span class="name hide-text">{{item.name}}</span>
                        </div>
                        <span class="file-delete show-delete" @click="deleteFile(index)">×</span>
                    </li>
                </ul>
            </div>
        </div>
        <div slot="footer">
            <el-button
                :disabled="!formData.fileList.length"
                :loading="loading"
                :type="'primary'"
                size="small"
                @click="handleSubmit">
                保存
            </el-button>
            <el-button
                size="small"
                @click="beforeCloseDialog">
                关闭
            </el-button>
        </div>
    </drawer-component>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator'
    import DrawerComponent from '@/components/comDrawer/index.vue'
    @Component({
        name: 'import-resource',
        components: {
            DrawerComponent
        }
    })
    export default class ImportResource extends Vue {
    @Prop({
        type: String,
        default: () => ''
    })
    modelId: string

    visible: boolean = false
    loading: boolean = false
    formData: any = {
        fileList: []
    }
    formDataV2 = {}

    deleteFile(index) {
        this.formData.fileList.splice(index, 1)
    }
    handleUpload(data) {
        if ((data.file.size / (1024 * 1024)) > 20) {
            this.$error('文件大小不能超过20M')
            return
        }
        this.formData.fileList = [data.file]
    }
    changeVisible(val) {
        this.visible = val
    }
    showDialog() {
        this.visible = true
        this.formData.fileList = []
        this.formDataV2 = this.$copy(this.formData)
    }
    beforeCloseDialog() {
        const flag = this.$compareFormData(this.formData, this.formDataV2)
        if (!flag) {
            this.$confirm('放弃将导致未保存信息丢失', '是否放弃本次操作？', {
                center: true
            }).then(() => {
                this.visible = false
            })
            return
        }
        this.visible = false
    }
    handleDownload() {
        this.$api.AssetData.downloadTemplate({id: this.modelId}).then((res) => {
            const blob = new Blob([res], {type: '.xlsx'})
            // 通过创建a标签实现
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            // 对下载的文件命名
            link.download = `${this.modelId}资产模板.xlsx`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        })
    }
    async handleSubmit() {
        this.loading = true
        try {
            const paramsBody = new FormData()
            paramsBody.append('file', this.formData.fileList[0])
            const params = {
                id: this.modelId,
                body: paramsBody
            }
            const { result, message } = await this.$api.AssetData.importInst(params)
            if (!result) {
                return this.$error(message)
            }
            this.visible = false
            this.$success('已成功导入')
            this.$emit('on-success', params)
        } finally {
            this.loading = false
        }
    }
}
</script>

<style scoped lang="scss">
.upload-area {
    width: 100%;
    /deep/.el-upload-dragger {
        width: 600px;
    }
    .template-file {
        cursor: pointer;
        color: #3A84FF;
        display: flex;
        align-items: center;
        margin: 10px 0 0 0;
        .file-download {
            font-size: 14px;
            margin-right: 4px;
        }
    }
    .file-list {
        padding: 10px 0;
        line-height: 25px;
        font-size: 14px;
        color: #475468;
        li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 12px;
            line-height: 36px;
            border-radius: 2px;
            &:hover {
                background-color: #F4F5F8;
                .show-delete {
                    display: flex;
                }
            }
            .file-list-name {
                display: flex;
                align-items: center;
                .file-success {
                    color: #2DCB56;
                    font-size: 14px;
                    margin-right: 4px;
                }
                .name {
                    max-width: 520px;
                }
            }
            .file-delete {
                display: none;
                font-size: 20px;
                color: #3A84FF;
                cursor: pointer;
            }
        }
    }
}
</style>
