<template>
    <div id="logoSetting" v-bkloading="{ isLoading: basicLoading, zIndex: 10 }">
        <div class="table">
            <bk-upload
                :files="file"
                :theme="'picture'"
                :with-credentials="true"
                :custom-request="handleUpload"
                :multiple="false"
                :url="'0'"
                v-if="reShow" />
            <bk-spin v-else />
            <bk-button
                v-permission="powerParams"
                class="restyle-btn"
                :disabled="!$BtnPermission({
                    id: $route.name,
                    type: 'operateAuth'
                }) && !fileData"
                theme="primary"
                @click="uploadLogo()">
                确认上传
            </bk-button>
            <bk-button
                v-permission="powerParams"
                class="restyle-btn"
                @click="initLogo()">
                恢复默认
            </bk-button>
            <i class="bk-icon icon-info-circle-shape" style="color: #3A84FF;"></i>
            <span style="margin-left: 15px;color: #979BA5;">
                仅支持上传 png、jpg、jpeg 或 svg 格式的图片，建议上传图片宽高比1:1。
            </span>
        </div>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator'
    @Component({
        name: 'logo-set'
    })
    export default class LogoSettings extends Vue {
        imgData: any = ''
        isEdit: boolean = false
        basicLoading: boolean = false
        reShow: boolean = true
        src: string = 'data:image/png;base64,'
        file: any = [
            {
                name: 'image.png',
                status: 'done',
                url: ''
            }
        ]
        fileData: any= ''
        get powerParams() {
            return {
                id: this.$route.name,
                type: 'SysSetting_logo_change'
            }
        }
        created() {
            this.getLogo()
        }
        async uploadLogo() {
            // const config = {
            //     headers: {'Content-Type': 'multipart/form-data'}
            // }
            if (!this.$BtnPermission(this.powerParams)) {
                return false
            }
            const file = this.fileData
            const fileTypes = ['.jpg', '.png', '.jpeg', '.svg']
            const filePath = file.name
            if (file.size > 1048576) {
                this.$warn('图片大小请不要超过10M')
                return
            }
            // 当括号里面的值为0、空字符、false 、null 、undefined的时候就相当于false
            if (filePath) {
                let isNext = false
                const fileEnd = filePath.substring(filePath.lastIndexOf('.'))
                for (let i = 0; i < fileTypes.length; i++) {
                    if (fileTypes[i] === fileEnd) {
                        isNext = true
                        break
                    }
                }
                if (!isNext) {
                    this.$warn('仅支持上传 png、jpg、 jpeg 或 svg 格式的图片')
                    file.value = ''
                    return false
                }
            } else {
                return false
            }
            const fileData = new FormData()
            fileData.append('file', this.fileData.origin)
            this.basicLoading = true
            try {
                const res = await this.$api.Server.updateLogo(fileData)
                if (res.result) {
                    this.$success('上传成功')
                    // this.$store.commit('changeLogo')
                    this.$bus.$emit('updateLogo')
                } else {
                    this.$error('上传失败')
                }
                this.fileData = ''
            } finally {
                this.basicLoading = false
            }
        }
        initLogo() {
            if (!this.$BtnPermission(this.powerParams)) {
                return false
            }
            this.$bkInfo({
                title: '确定恢复默认吗?',
                confirmLoading: true,
                confirmFn: async() => {
                    try {
                        const res = await this.$api.Server.resetlogo()
                        if (res.result) {
                            this.$success('恢复默认成功!')
                            this.$bus.$emit('updateLogo')
                            this.getLogo()
                        } else {
                            this.$error('恢复默认失败!')
                        }
                        return true
                    } catch (e) {
                        return false
                    }
                }
            })
        }
        getLogo() {
            this.reShow = false
            this.$api.Server.getLogo().then(res => {
                if (res.result) {
                    this.file = [
                        {
                            name: 'image.png',
                            status: 'done',
                            url: 'data:image/png;base64,' + res.data.value
                        }
                    ]
                    this.reShow = true
                    this.$store.commit('changeLogo')
                }
            })
        }
        handleUpload(el) {
            this.reShow = false
            this.fileData = el.fileObj
            this.toBase64(el.fileObj.origin).then(res => {
                this.file = [
                    {
                        name: 'image.png',
                        status: 'done',
                        url: res
                    }
                ]
                this.$nextTick(() => {
                    this.reShow = true
                })
            })
        }
        toBase64(file) {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            return new Promise((resolve, reject) => {
                reader.onload = function(e) {
                    if (this.result) {
                        resolve(this.result)
                    } else {
                        reject(new Error('转换预览图片失败'))
                    }
                }
            })
        }
    }
</script>

<style scoped lang="scss">
#logoSetting {
    height: 100%;

    .table {
        width: 100%;
        padding: 16px 20px;
        background-color: #fff;
        border: 1px solid #DCDEE5;
        display: flex;
        align-items: center;
        //> > div:last-child {
        //    display: flex;
        //    align-items: center;
        //}
    }

    .restyle-btn {
        width: 86px;
        height: 32px;
        box-sizing: border-box;
        margin-right: 8px;

        &:nth-of-type(1) {
            margin-left: 40px;
        }
    }

    /deep/ .bk-upload .pic-item {
        width: 80px;
        height: 80px;
    }

    /deep/ .bk-upload .pic-item .mask {
        width: 80px;
        height: 80px;
    }
}
</style>
