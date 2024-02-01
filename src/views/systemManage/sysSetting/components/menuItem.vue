<template>
    <draggable
        v-model="menuList"
        :options="{ group: 'menus', animation: 150, draggable: '.menu-item' }"
        @change="handleChange">
        <template v-for="childData in menuList">
            <div :key="childData.id" class="menu-item">
                <div class="menu-item-row">
                    <i class="icon" :class="childData.isUrl ? 'el-icon-link' : childData.isPage ? 'el-icon-tickets' : 'el-icon-folder-opened'"></i>
                    <template v-if="!childData.isEdit">
                        <span>{{ childData.name }}</span>
                        <span
                            class="cw-icon weops-edit"
                            @click="handleEditStatus(childData, true)"></span>
                    </template>
                    <template v-else>
                        <div class="menu-name-input">
                            <el-input
                                size="small"
                                style="width: 200px;"
                                :class="{ 'error-tip': !childData.name && editConfrim }"
                                :clearable="true"
                                placeholder="请输入"
                                v-model="childData.name"
                                @enter="handleConfirmEdit(childData)" />
                            <el-tooltip v-if="!childData.name && editConfrim" effect="dark" content="请输入名称" placement="top">
                                <span>
                                    <i class="el-icon-info"></i>
                                </span>
                            </el-tooltip>
                        </div>
                        <span
                            class="cw-icon weops-complete ml10"
                            @click="handleConfirmEdit(childData)"></span>
                    </template>
                    <div :class="{ 'page-icon': true, 'sys-page-icon': childData.id === 'SysSetting' }">
                        <span v-if="childData.isUrl">外链</span>
                        <span v-if="childData.isPage && !childData.isUrl">(原始页面: {{ childData.originName }})</span>
                        <el-popconfirm
                            width="288px"
                            :title="'确认要删除这个' + (childData.isPage ? '页面' : '目录下所有的页面') + '吗？'"
                            icon="el-icon-info"
                            icon-color="red"
                            @confirm="handleDelete(childData)"
                        >
                            <i v-if="childData.id !== 'SysSetting'" class="el-icon-close delete" slot="reference"></i>
                        </el-popconfirm>
                    </div>
                </div>
                <menu-item
                    v-if="childData.children"
                    :all-menu="allMenu"
                    :menu="childData.children"
                    @delete="deleteMenuItem"
                    @edit-external-chain="editExternalChain"
                    @change="(menu) => changeMenuItem(menu, childData)" />
            </div>
        </template>
    </draggable>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator'
    import draggable from 'vuedraggable'
    import uuid from 'uuid'
    @Component({
        name: 'menu-item',
        components: {
            draggable
        }
    })
    export default class MenuItem extends Vue {
        @Prop({ type: Array, default: [] }) allMenu: any
        @Prop({ type: Array, default: [] }) menu: any
        menuList: any = this.menu
        editConfrim: boolean = false
        handleChange() {
            this.$emit('change', this.menuList)
        }
        changeMenuItem(menu, data) {
            data.children = menu
        }
        handleEditStatus(data, status) {
            if (data.isUrl) {
                this.$emit('edit-external-chain', data)
            } else {
                this.$set(data, 'isEdit', status)
            }
        }
        editExternalChain(data) {
            this.$emit('edit-external-chain', data)
        }
        handleConfirmEdit(data) {
            if (!data.name) {
                this.editConfrim = true
                return false
            }
            if (!data.isPage) {
                data.id = uuid()
            }
            data.isEdit = false
            this.editConfrim = false
            this.$emit('change', this.menuList)
        }
        deleteMenuItem(data) {
            this.$emit('delete', data)
        }
        handleDelete(data) {
            const deleteItem = (data, id) => {
                for (let i = 0; i < data.length; i++) {
                    const item = data[i]
                    if (item.id === id) {
                        data.splice(i, 1)
                        return true
                    }
                    if (item.children?.length) {
                        const deleted = deleteItem(item.children, id)
                        if (deleted) {
                            return true
                        }
                    }
                }
                return false
            }
            deleteItem(this.allMenu, data.id)
            this.$emit('delete', data)
            // 判断删除的这个目录是否存在系统设置这个页面,存在的话将除系统设置的页面删掉
            let sysMenu = {}
            const hasSysSettingId = (item) => {
                if (item.id === 'SysSetting') {
                    sysMenu = item
                    return true
                }
                if (item.children && Array.isArray(item.children)) {
                    for (const child of item.children) {
                        if (hasSysSettingId(child)) {
                            return true
                        }
                    }
                }
                return false
            }
            if (hasSysSettingId(data)) {
                this.menuList.push(sysMenu)
                this.$emit('change', this.menuList)
            }
        }
    }
</script>

<style scoped lang="scss">

.menu-item {
    .menu-item {
        padding-left: 30px !important;
        .menu-item {
            padding-left: 30px !important;
        }
    }
    .menu-item-row {
        cursor: move;
        padding: 10px;
        background: $cw-color-bg-1;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        i,
        .cw-icon {
            display: inline-block;
            font-size: 16px !important;
            color: $cw-color-text-2;
            cursor: pointer;
        }
        .icon {
            cursor: inherit;
            margin-right: 10px;
            color: $cw-color-text-1;
        }
        .page-icon {
            color: $cw-color-text-2;
            font-size: 12px;
            margin-left: auto;
            .delete {
                display: inline-block;
                margin-left: 20px;
            }
            &.sys-page-icon {
                margin-right: 40px;
            }
        }
        .weops-edit {
            display: none;
            margin-left: 10px;
        }
        &:hover {
            .weops-edit {
                display: inline-block;
            }
        }
    }
    .menu-name-input {
        position: relative;
        display: inline-block;
        >span {
            position: absolute;
            right: 5px;
            top: 7px;
            i {
                color: #ff5656 !important;
            }
        }
    }
    .error-tip {
        /deep/input {
            border: 1px solid #ff5656 !important;
        }
    }
}
</style>
