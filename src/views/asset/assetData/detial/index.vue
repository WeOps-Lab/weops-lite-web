<template>
    <div class="asset-detial page-container" v-loading="loading">
        <el-tabs v-model="active" @tab-click="handleTabClick">
            <el-tab-pane
                v-for="(item,index) in panels"
                :key="index"
                :label="item.label"
                :name="item.name">
                <component :is="active" :group-list="groupList" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator'
    import { Panels } from '@/common/types'
    import { ASSET_DTIAL_PANELS } from '@/common/constants/asset/assetData'
    import BaseInfo from '../components/baseInfo/index.vue'
    @Component({
        components: {
            BaseInfo
        }
    })
    export default class AssetDetial extends Vue {
        loading: boolean = false
        panels: Array<Panels> = ASSET_DTIAL_PANELS
        active: string = 'baseInfo'
        groupList:Array<any> = []

        mounted() {
            this.getGroups()
        }

        handleTabClick(tab) {
            console.log(tab)
        }

        async getGroups() {
            this.loading = true
            try {
                const res = await this.$api.GroupManage.getGroups()
                const { result, message, data } = res
                if (!result) {
                    return this.$error(message)
                }
                this.groupList = this.convertArray(data)
            } finally {
                this.loading = false
            }
        }
        convertArray(arr) {
            const result = []
            arr.forEach(item => {
                const newItem = {
                    value: item.id,
                    label: item.name
                }
                if (item.subGroups && !!item.subGroups.length) {
                    newItem.children = this.convertArray(item.subGroups)
                }
                result.push(newItem)
            })
            return result
        }
    }
</script>

<style lang="scss" scoped>
.asset-detial {
    //
}
</style>
