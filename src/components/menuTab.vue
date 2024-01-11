<template>
    <div ref="container" :class="['menu-type-container', `${type}-container`]">
        <i v-if="showOperation" class="el-icon-arrow-left" @click="previous"></i>
        <div :class="[`${type}-content`]">
            <ul>
                <li :key="index"
                    v-for="(item, index) in panels"
                    :class="[
                        type,
                        (item.name === active && 'active'),
                        ((type === 'card' && border) && 'border-li'),
                        (item.disabled && 'disable')
                    ]"
                    @click="toClick(item)">
                    <span v-if="item.tooltips && item.disabled" v-bk-tooltips="item.tooltips">{{ item.label }}</span>
                    <span v-else>{{ item.label }}</span>
                    <template v-if="item.count">
                        <span>{{ item.count }}</span>
                    </template>
                </li>
            </ul>
        </div>
        <bk-icon v-if="showOperation" type="angle-right" @click="next" />
        <i v-if="showOperation" class="el-icon-arrow-right" @click="next"></i>
    </div>
</template>

<script lang="ts">
    import { Panel } from '@/types/index'
    import * as _ from 'lodash'
    import { EleResize } from '@/common/esresize'
    import { Component, Prop, Model, Vue, Watch } from 'vue-property-decorator'

    @Component({})
    export default class NavHeader extends Vue {
        @Model('change', {type: String}) value: string
        @Prop({type: Array, default: []}) panels: any
        @Prop({type: String, default: ''}) activePanel: string
        @Prop({type: Boolean, default: false}) border: boolean
        // type类型为 card,line,text,capsule
        @Prop({type: String, default: 'card'}) type: string
        @Prop({type: Boolean, default: false}) hideArrow: boolean
        active: string = ''
        showOperation: boolean = false
        clientWidth: number = 0
        totalWidth: number = 0
        showTabsCount:number = 0
        unoccupied: number = 0
        moveX: number = 0

        @Watch('activePanel')
        activePanelChange(val) {
            this.active = val
        }

        mounted() {
            this.active = this.activePanel || (this.panels[0] && this.panels[0].name)
            const dom = this.$refs.container
            const changeOperation = () => {
                this.clientWidth = dom?.clientWidth
                const liEle = dom.querySelectorAll('li')
                this.totalWidth = 0
                for (let i = 0; i < liEle.length; i++) {
                    const distanceWidth = liEle.length - 1 === i ? 0 : 8
                    this.totalWidth += liEle[i].clientWidth + distanceWidth
                }
                this.showOperation = !this.hideArrow && this.totalWidth > this.clientWidth
                // 可视区域能放入多少个元素 = 可视区域的宽度 循环全部tab,合计宽度当超过内容宽度
                setTimeout(() => {
                    let isCalculated = false
                    const contentWidth = dom.querySelector(`.${this.type}-content`).clientWidth
                    let computedWidth = 0
                    for (let i = 0; i < liEle.length; i++) {
                        const distanceWidth = liEle.length - 1 === i ? 0 : 8
                        computedWidth += liEle[i].clientWidth + distanceWidth
                        if (computedWidth > contentWidth && !isCalculated) {
                            this.showTabsCount = i
                            isCalculated = true
                            // 被遮挡tab元素的可见部分的宽度 = 可见区域的宽度 - 显示完全的tab宽度
                            this.unoccupied = contentWidth - computedWidth + liEle[i].clientWidth + 8
                        }
                    }
                }, 0)
            }
            this.$nextTick(() => changeOperation())
            if (dom) {
                EleResize.on(dom, _.throttle(() => changeOperation(), 500))
            }
        }
        toClick(item: Panel) {
            if (item.disabled) {
                return
            }
            this.active = item.name
            this.$emit('change', this.active)
            this.$emit('click', item)
        }
        next() {
            this.$nextTick(() => {
                const contentWidth = this.$refs.container.querySelector(`.${this.type}-content`).clientWidth
                // 可视区域 < 滚动区域（滚动区域大于可视区域才可以移动）
                // 移动距离 + 可视区域 = 滚动区域的宽度（上一次的宽度，当点击时才是实际宽度）< 滚动区域
                if (contentWidth < this.totalWidth && this.moveX + contentWidth < this.totalWidth) {
                    // this.moveX为0减去空余空间的宽度
                    // this.moveX += this.moveX ? this.width : this.width - this.unoccupied
                    this.moveX += 50
                    this.translateX(this.moveX)
                }
            })
        }
        previous() {
            if (this.moveX > 0) {
                this.moveX -= 50
                this.translateX(this.moveX)
            }
        }
        translateX(x) {
            this.moveX = x < 0 ? 0 : x
            const dom = this.$refs.container.querySelector('ul')
            dom.style.transform = `translateX(-${this.moveX}px)`
        }
    }
</script>

<style lang="scss" scoped>
.menu-type-container {
    display: flex;
    align-items: center;
    width: 100%;
    > i {
        cursor: pointer;
        font-size: 14px;
        color: $cw-color-text-2;
        &:hover {
            border-radius: 50%;
            background: $cw-color-bg-1;
        }
    }
    &.line-container {
        width: 100%;
        height: 50px;
        background-image: linear-gradient(transparent 49px, rgb(230, 233, 238) 1px);
    }
    .card {
        display: inline-block;
        margin-right: 4px;
        padding: 8px 16px;
        cursor: pointer;
        position: relative;
        font-weight: 400;
        color: $cw-color-text-1;
        background: #EDF0F5;
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
        span {
            display: inline-block;
            padding: 0 2px;
            color: $cw-color-text-2;
            font-size: 13px;
        }
        &:hover {
            background: $cw-color-bg-3;
            span {
                color: $cw-color-primary;
            }
        }
        &.active {
            background: #FFF;
            color: $cw-color-primary;
            position: relative;
            span {
                color: $cw-color-primary;
            }
            &::before {
                left: 0;
                bottom: -1px;
                content: "";
                width: 100%;
                height: 1px;
                background: #fff;
                position: absolute;
                z-index: 99;
            }
        }
        &.border-li {
            border: 1px solid #E6E9EE;
            border-bottom: none;
        }
    }
    .line {
        font-weight: 400;
        display: inline-block;
        padding: 0 0 13px 0;
        color: $cw-color-text-1;
        cursor: pointer;
        position: relative;
        margin: 0 16px;
        height: 50px;
        line-height: 50px;
        &.active {
            font-weight: 500;
            color: $cw-color-text-0;
            border-bottom: 3px solid $cw-color-primary;
        }
        &:hover {
            color: #1E252E;
        }
    }
    .text-content {
        height: 28px;
        overflow: hidden;
        ul {
            transition: transform .5s;
            display: flex;
            align-items: center;
        }
    }
    .text {
        display: inline-block;
        height: 28px;
        cursor: pointer;
        font-weight: 400;
        white-space: nowrap;
        -webkit-appearance: none;
        text-align: center;
        vertical-align: middle;
        font-size: 14px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: $cw-color-text-1;
        margin-right: 8px;
        padding: 4px 12px;
        &:last-child {
            margin-right: 0;
        }
        &:hover {
            background: $cw-color-bg-1;
            border-radius: 3px;
            .count-container {
                color: $cw-color-primary;
            }
        }
        &.active {
            position: relative;
            z-index: 1;
            background: $cw-color-bg-1;
            color: $cw-color-primary;
            border-radius: 3px;
            -webkit-transition: background-color .3s ease;
            transition: background-color .3s ease;
            .count-container {
                color: $cw-color-primary;
            }
        }
    }
    .disable {
        cursor: not-allowed;
        color: #B2BDCC;
    }
    .capsule {
        display: inline-block;
        height: 28px;
        cursor: pointer;
        font-weight: 400;
        text-align: center;
        font-size: 14px;
        box-sizing: border-box;
        color: #475468;
        line-height: 14px;
        padding: 4px 18px;
        background: #EDEFF3;
        border: 3px solid #EDEFF3;
        &.active {
            color: #1E252E;
            background: #ffffff;
            font-weight: 550;
        }
        &:hover {
            color: #475468;
            background: #ffffff;
        }
    }
}
</style>
