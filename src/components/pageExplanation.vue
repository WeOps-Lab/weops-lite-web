<template>
    <div class="title-area">
        <div>{{ title }}</div>
        <div>{{ content }}</div>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator'
    @Component({})
    export default class PageExplanation extends Vue {
        @Prop({ type: String, default: '' }) title: string
        @Prop({ type: String, default: '' }) content: string
    }
</script>

<style lang="scss" scoped>
.title-area {
    background-color: #fff;
    margin-bottom: 10px;
    border-radius: 4px;
    padding: 15px;
    div:nth-child(1) {
        font-size: 25px;
        margin-bottom: 5px;
    }
    div:nth-child(2) {
        font-size: 14px;
        color: #838383;
    }
}
</style>
