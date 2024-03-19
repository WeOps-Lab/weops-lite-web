<template>
    <el-dialog
        width="600px"
        :visible.sync="visible"
        theme="primary"
        :close-on-click-modal="false"
        title="选择图标"
    >
        <div class="icon-show-list">
            <el-tooltip v-for="(item, index) in iconList" :key="index" :content="item.describe" placement="bottom">
                <div
                    class="top-middle"
                    :class="['icon-item', activeIndex === index && 'active-icon']"
                    @click="selectIcon(item, index)"
                >
                    <img :src="require(`@/assets/svg/model/${item.url}.svg`)" />
                </div>
            </el-tooltip>
        </div>
        <template slot="footer">
            <el-button
                :type="'primary'"
                size="small"
                @click="cancel"
            >
                确认
            </el-button>
            <el-button
                :type="'default'"
                size="small"
                @click="cancel"
            >
                取消
            </el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts">
    import {Component, Emit, Vue} from 'vue-property-decorator'
    @Component
    export default class SelectIcon extends Vue {
        visible: boolean = false
        iconList: {
            url: string,
            describe: string
        }[] = []
        activeIndex: number = 15
        selectIconUrl: string = ''
        mounted() {
            this.iconList = this.$getSvgIcon().map(item => {
                return {
                    url: item,
                    describe: item.split('_')[1]
                }
            }).filter(item => item.url && item.describe)
        }
        cancel() {
            this.setIcon()
            this.visible = false
        }
        selectIcon(item, index) {
            this.activeIndex = index
        }
        show(icon) {
            this.visible = true
            if (icon) {
                const index = this.iconList.findIndex(item => item.url === icon)
                if (index !== -1) {
                    this.activeIndex = index
                }
            }
        }
        @Emit('setIcon')
        setIcon() {
            this.selectIconUrl = this.iconList[this.activeIndex].url
            return this.selectIconUrl
        }
    }
</script>

<style lang="scss" scoped>
    .icon-show-list {
        max-height: 300px;
        overflow: auto;
        display: flex;
        flex-wrap: wrap;
        .icon-item {
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            img {
                width: 24px;
                height: 24px;
            }
            &:hover {
                background-color: rgb(235, 244, 255);
                border: 1px dashed rgb(58, 132, 255);
                color: rgb(58, 132, 255);
            }
        }
        .active-icon {
            background-color: rgb(235, 244, 255);
            border: 1px dashed rgb(58, 132, 255);
            color: rgb(58, 132, 255);
        }
    }
</style>
