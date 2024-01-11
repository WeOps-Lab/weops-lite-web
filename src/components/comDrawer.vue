<template>
    <div class="drawer-container">
        <el-drawer
            :visible.sync="drawerVisible"
            v-bind="$attrs">
            <div class="title-slot" slot="title">
                <span class="back-icon">
                    <i class="el-icon-arrow-right" @click="handleClose"></i>
                </span>
                <span class="title-text">{{ title }}</span>
            </div>
            <!-- 主体内容 -->
            <slot name="content"></slot>
            <!-- 底部区域 -->
            <div class="footer-slot">
                <slot name="footer"></slot>
            </div>
        </el-drawer>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator'
    import ComTable from '@/components/comTable.vue'

    @Component({
        name: 'drawer-component',
        components: {
            ComTable
        }
    })
    export default class DrawerComponent extends Vue {
        @Prop({
            type: String,
            default: () => '标题'
        })
        title: string

        @Prop({
            type: Boolean,
            default: () => false
        })
        visible: boolean

        get drawerVisible() {
            return this.visible
        }
        set drawerVisible(val) {
            this.$emit('changeVisible', val)
        }
        handleClose() {
            this.$emit('changeVisible', false)
        }
    }
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern */
/deep/.el-drawer__close-btn {
    display: none;
}
/deep/.el-drawer__header {
    height: 60px;
    padding: 0;
    margin-bottom: 0;
    border-bottom: 1px solid #dcdee5;
    .title-slot {
        display: flex;
        align-items: center;
        .back-icon {
            display: inline-block;
            margin-right: 20px;
            width: 30px;
            height: 60px;
            background-color: #3a84ff;
            text-align: center;
            i {
                cursor: pointer;
                line-height: 60px;
                font-size: 20px;
                color: #fff;
            }
        }
        .title-text {
            font-size: 16px;
            color: #313238;
        }
    }
}
.footer-slot {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 54px;
    padding-right: 20px;
    background-color: rgb(250, 251, 253);
}
</style>
