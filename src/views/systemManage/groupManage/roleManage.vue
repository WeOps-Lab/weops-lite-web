<template>
    <drawer-component
        :title="title"
        :visible="visible"
        :size="850"
        custom-class="common-dialog-wrapper"
        :before-close="handleClose"
        @changeVisible="changeVisible">
        <div slot="content"
            class="common-dialog-wrapper-main">
            <div class="auth-white-list">
                <div class="list-container">
                    <div class="header">
                        <el-input
                            clearable
                            style="width: 300px;"
                            :placeholder="'请输入关键字搜索'"
                            v-model="searchValue"
                            @clear="handleSearch"
                            @change="handleSearch">
                            <i slot="suffix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </div>
                    <com-table
                        class="mt20 table-container"
                        ref="userTable"
                        :data="dataList"
                        :pagination="pagination"
                        v-loading="loading"
                        :columns="roleColumns"
                        @select="handleSelect"
                        @select-all="handleAllSelect"
                        @page-change="handlePageChange"
                        @page-limit-change="handleLimitChange">
                    </com-table>
                </div>
                <div class="selection-container">
                    <p>已选择（共<span>{{allSelected.length}}</span>条）<span class="clear" @click="handleClear">清空</span></p>
                    <ul>
                        <li v-for="item in allSelected" :key="item.id + item.type">
                            <span class="cw-icon weops-zu-zhi-jue-se"></span>
                            {{ item.name }}
                            <span>组织角色</span>
                            <i class="el-icon-close" style="font-size: 12px;" @click="handleRemove(item)"></i>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <template slot="footer">
            <el-button
                class="mr10"
                :type="'primary'"
                :loading="isConfirm"
                @click="handleConfirm()">
                确认
            </el-button>
            <el-button
                :disabled="isConfirm"
                @click="handleClose()">
                取消
            </el-button>
        </template>
    </drawer-component>
</template>

<script lang="ts">
    import MenuTab from '@/components/menuTab.vue'
    import { Component, Vue, Prop } from 'vue-property-decorator'
    import { Pagination, TableData } from '@/types'
    import ComTable from '@/components/comTable.vue'
    import DrawerComponent from '@/components/comDrawer.vue'

    @Component({
        components: {
            MenuTab,
            ComTable,
            DrawerComponent
        }
    })
    export default class RoleManage extends Vue {
        @Prop({
            type: String,
            default: () => '白名单'
        })
        title: string
        visible: boolean = false
        loading: boolean = false
        isConfirm: boolean = false
        active: string = 'role'
        pagination: Pagination = {
            current: 1,
            count: 0,
            limit: 20,
            small: true
        }
        // 角色管理
        roleColumns: Array<TableData> = [
            {
                type: 'selection'
            },
            {
                label: '角色名称',
                key: 'name'
            },
            {
                label: '角色描述',
                key: 'description'
            }
        ]
        searchValue: string = ''
        rawDataList: any = []
        dataList: any = []
        selectedData:any = {}
        allSelected:any = []
        rawSelected:any = []
        credentialsDetail: any = {}
        roleDetail: any = {}
        get isGroup() {
            return this.active === 'role'
        }

        async showSlider(list, row?) {
            this.visible = true
            this.searchValue = ''
            this.roleDetail = row
            const originList = {
                role: [],
                user: []
            }
            this.selectedData = this.$deepClone((list || originList))
            // 保存原始role数据
            this.rawSelected = this.$deepClone(this.selectedData.role)
            this.handleAllSelected()
            this.getDataList()
        }

        handleAllSelected() {
            this.allSelected = []
            Object.keys(this.selectedData).forEach(key => {
                this.allSelected = this.allSelected.concat(this.selectedData[key].map(r => ({ ...r, type: key })))
            })
        }
        async getDataList() {
            const params = {
                page: this.pagination.current,
                page_size: this.pagination.limit,
                search: this.searchValue
            }
            this.loading = true
            try {
                const res = await this.$api.RoleManageMain.getRoleList(params)
                res.data.items = res.data.map(item => ({id: item.id, name: item.name, description: item.description}))
                if (!res.result) {
                    this.rawDataList = []
                    this.pagination.count = 0
                    return this.$error(res.message)
                }
                const selectMap = Object.fromEntries((this.selectedData[this.active] || []).map(r => [r.id, r]))
                const isAdminGroup = this.roleDetail?.role_name === 'admin_group'
                this.rawDataList = (res.data?.items || []).map(item => ({
                    ...item,
                    isChecked: isAdminGroup ? selectMap[item.id] : true
                }))

                const {current, limit} = this.pagination
                // 搜索的关键字
                this.dataList = this.rawDataList.filter(item => item.name?.includes(this.searchValue))
                this.pagination.count = this.dataList.length
                    // 分页
                this.dataList = this.dataList.slice((current - 1) * limit, current * limit)
                this.$nextTick(() => {
                    this.dataList.forEach(item => {
                        if (selectMap[item.id]) {
                            this.$refs.userTable?.toggleRowSelection(item, true)
                        }
                    })
                })
            } finally {
                this.loading = false
            }
        }

        handleConfirm() {
            this.visible = false
            this.setRolesByGroup(this.rawSelected, this.allSelected)
            // this.$emit('confirm', this.selectedData)
        }
        async setRolesByGroup(rawData, updateData) {
            // 找出要删除的id和要增加的id
            const deleteId = []
            const rawTemp = rawData.map(item => item.id)
            const updateTemp = updateData.map(item => item.id)
            for (let i = 0; i < rawTemp.length; i++) {
                if (!updateTemp.includes(rawTemp[i])) {
                    deleteId.push(rawTemp[i])
                }
            }
            const addId = []
            for (let i = 0; i < updateTemp.length; i++) {
                if (!rawTemp.includes(updateTemp[i])) {
                    addId.push(updateTemp[i])
                }
            }
            const deletePromises = []
            const addPromises = []
            addId.length > 0 && addPromises.push(this.$api.GroupManage.addGroupRoles({id: this.roleDetail.id, addIds: addId}))
            deleteId.length > 0 && deletePromises.push(this.$api.GroupManage.delGroupRoles({id: this.roleDetail.id, deleteIds: deleteId}))

            this.isConfirm = true
            try {
                const res = await Promise.all([...addPromises, ...deletePromises])
                if (res.every(item => item.result)) {
                    this.$success('设置人员成功')
                    this.handleClose()
                    this.$emit('confirm')
                }
            } finally {
                this.isConfirm = false
            }
        }
        handleClose() {
            this.visible = false
        }

        handleSelect(selection, row) {
            const current = selection.find(select => select.id === row.id)
            if (current) {
                this.selectedData[this.active].push(row)
            } else {
                const index = this.selectedData[this.active].findIndex(r => r.id === row.id)
                this.selectedData[this.active].splice(index, 1)
            }
            this.handleAllSelected()
        }

        handleAllSelect(selection) {
            const isSelected = !!selection.length
            this.dataList.forEach(item => {
                if (isSelected) {
                    const current = this.selectedData[this.active].find(r => r.id === item.id)
                    !current && this.selectedData[this.active].push(item)
                } else {
                    const index = this.selectedData[this.active].findIndex(r => r.id === item.id)
                    this.selectedData[this.active].splice(index, 1)
                }
            })
            this.handleAllSelected()
        }

        handlePageChange(page) {
            this.pagination.current = page
            const {limit} = this.pagination
            this.dataList = this.dataList.slice((page - 1) * limit, page * limit)
        }

        handleLimitChange(size) {
            this.pagination.current = 1
            this.pagination.limit = size
            this.dataList = this.rawDataList.slice(0, size)
        }

        handleSearch() {
            this.pagination.current = 1
            this.getDataList()
        }

        handleRemove(row) {
            const index = this.allSelected.findIndex(r => r.id === row.id && r.type === row.type)
            if (index || index === 0) {
                this.allSelected.splice(index, 1)
            }
            this.$nextTick(() => {
                this.dataList.forEach(item => {
                    if (item.id === row.id) {
                        this.$refs.userTable?.toggleRowSelection(item, false)
                    }
                })
            })
            // 移除用户或角色后，更新map数据
            const selectedIndex = this.selectedData[row.type].findIndex(r => r.id === row.id)
            this.selectedData[row.type].splice(selectedIndex, 1)
        }

        handleClear() {
            this.selectedData = {
                role: [],
                user: []
            }
            this.handleAllSelected()
            this.$nextTick(() => {
                this.dataList.forEach(item => {
                    this.$refs.userTable?.toggleRowSelection(item, false)
                })
            })
        }

        changeVisible(val) {
            this.visible = val
        }
    }
</script>

<style scoped lang="scss">
.auth-white-list {
    height: 100%;
    display: flex;
    .list-container {
        width: 60%;
        .header {
            display: flex;
            align-items: center;
            .menu-type-ul {
                flex: 1;
                //margin-top: 5px;
            }
        }
    }
    .selection-container {
        border: 1px solid #dcdee5;
        border-bottom: none;
        background-color: #f5f7fa;
        padding: 12px 24px;
        height: 100%;
        flex: 1;
        margin-left: 10px;
        overflow-y: scroll;
        > p {
            justify-content: space-between;
            font-size: 12px;
            margin: 0 0 10px 0;
            color: #63656e;
            span {
                display: inline-block;
                color: $cw-color-primary;
            }
            .clear {
                float: right;
                cursor: pointer;
            }
        }
        ul {
            margin-top: 15px;
            li {
                background: #fff;
                padding: 10px;
                position: relative;
                border-bottom: 1px solid $cw-color-border-0;
                &:last-child {
                    border: none;
                }
                span {
                    float: right;
                    font-size: 12px;
                    color: $cw-color-text-3;
                    padding-right: 10px;
                }
                .cw-icon {
                    float: left;
                    font-size: 16px;
                }
                > i {
                    display: none;
                    position: absolute;
                    right: 5px;
                    top: 12px;
                    font-size: 18px;
                }
                &:hover {
                    cursor: pointer;
                    i {
                        display: inline-block;
                        &:hover {
                            color: $cw-color-primary;
                        }
                    }
                }
            }
        }
    }
}
</style>
