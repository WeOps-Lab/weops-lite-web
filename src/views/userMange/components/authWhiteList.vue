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
                        <menu-tab
                            v-if="!onlyChooseUser"
                            :panels="panels"
                            v-model="active"
                            type="capsule"
                            @change="changeMenu">
                        </menu-tab>
                        <el-input
                            clearable
                            style="width: 300px;"
                            :placeholder="'请输入关键字搜索'"
                            :suffix-icon="'el-icon-search'"
                            v-model="searchValue"
                            @clear="handleSearch"
                            @change="handleSearch">
                        </el-input>
                    </div>
                    <com-table
                        class="mt20 table-container"
                        ref="userTable"
                        :data="dataList"
                        :pagination="pagination"
                        v-loading="loading"
                        :columns="onlyChooseUser ? userColumns : groupColumns"
                        @select="handleSelect"
                        @select-all="handleAllSelect"
                        @page-change="handlePageChange"
                        @page-limit-change="handleLimitChange">
                    </com-table>
                </div>
                <div class="selection-container">
                    <p>已选择（共<span>{{initChooseAdmin ? allSelected.length + 1 : allSelected.length}}</span>条）<span class="clear" @click="handleClear">清空</span></p>
                    <ul>
                        <li v-if="initChooseAdmin">
                            超管(admin)
                            <span>用户</span>
                        </li>
                        <li v-for="item in allSelected" :key="item.id + item.type">
                            {{ item.type === 'role' ? item.role_name : `${item.chname}(${item.bk_username})` }}
                            <span>{{ item.type === 'role' ? '角色' : '用户' }}</span>
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
    export default class AuthWhiteList extends Vue {
        @Prop({
            type: Boolean,
            default: () => false
        })
        isMyCredentials: boolean
        @Prop({
            type: String,
            default: () => '白名单'
        })
        title: string
        // 只进行人员选择
        @Prop({
            type: Boolean,
            default: () => false
        })
        onlyChooseUser: boolean
        // 哪里调用，角色管理或者组织管理，调用的接口不一样
        @Prop({
            type: String,
            default: () => 'roleManage'
        })
        caller: string
        visible: boolean = false
        loading: boolean = false
        isConfirm: boolean = false
        panels: Array<{
            label: string,
            name: string
        }> = [
            {
                label: '角色',
                name: 'role'
            },
            {
                label: '用户',
                name: 'user'
            }
        ]
        active: string = 'role'
        pagination: Pagination = {
            current: 1,
            count: 0,
            limit: 20,
            small: true
        }
        groupColumns: Array<TableData> = [
            {
                type: 'selection'
            },
            {
                label: '角色名称',
                key: 'role_name'
            },
            {
                label: '用户数',
                key: 'user_count'
            }
        ]
        userColumns: Array<TableData> = [
            {
                type: 'selection',
                selectable: (row) => {
                    if (this.onlyChooseUser && row.bk_username === 'admin') {
                        return !row.isChecked
                    }
                    return true
                }
            },
            {
                label: '中文名',
                key: 'chname'
            },
            {
                label: '用户名',
                key: 'bk_username'
            }
        ]
        searchValue: string = ''
        dataList: any = []
        selectedData:any = {}
        allSelected:any = []
        rawSelected:any = []
        credentialsDetail: any = {}
        roleDetail: any = {}
        get initChooseAdmin() {
            return !this.isMyCredentials && !this.onlyChooseUser
        }
        get isGroup() {
            return this.active === 'role'
        }

        async showSlider(list, row?) {
            this.visible = true
            this.searchValue = ''
            if (this.onlyChooseUser) {
                this.roleDetail = row
            }
            const originList = {
                role: [],
                user: []
            }
            if (this.isMyCredentials) {
                this.credentialsDetail = row
                const { result, data } = await this.$api.RemoteConnectMain.getCredDetail({id: row.id})
                if (result) {
                    originList.role = data.role
                    originList.user = data.user
                }
            }
            this.selectedData = this.$deepClone(this.isMyCredentials ? originList : (list || originList))
            // 保存user原始数据
            this.rawSelected = this.$deepClone(this.selectedData.user)
            this.handleAllSelected()
            this.changeMenu(this.onlyChooseUser ? 'user' : 'role')
        }

        handleAllSelected() {
            this.allSelected = []
            Object.keys(this.selectedData).forEach(key => {
                this.allSelected = this.allSelected.concat(this.selectedData[key].map(r => ({ ...r, type: key })))
            })
            if (this.initChooseAdmin) {
                this.allSelected = this.allSelected.filter(item => item?.bk_username !== 'admin')
            }
        }

        changeMenu(active) {
            this.active = active
            this.pagination.current = 1
            this.$refs.userTable?.updateColumns(this.isGroup ? this.groupColumns : this.userColumns)
            this.getDataList()
        }

        async getDataList() {
            const params = {
                page: this.pagination.current,
                per_page: this.pagination.limit,
                search: this.searchValue
            }
            this.loading = true
            try {
                const res = this.isGroup
                    ? await this.$api.UserManageMain.searchRoleList(params)
                    : await this.$api.UserManageMain.getUserList(params)
                if (!res.result) {
                    this.dataList = []
                    this.pagination.count = 0
                    return this.$error(res.message)
                }
                res.data.items = res.data.users.map(item => ({id: item.id, bk_username: item.username, chname: item.lastName}))
                const selectMap = Object.fromEntries((this.selectedData[this.active] || []).map(r => [r.id, r]))
                const isAdminGroup = this.roleDetail?.role_name === 'admin_group'
                this.dataList = (res.data?.items || []).map(item => ({
                    ...item,
                    isChecked: isAdminGroup ? selectMap[item.id] : true
                }))
                this.pagination.count = res.data.count
                this.$nextTick(() => {
                    this.dataList.forEach(item => {
                        if (selectMap[item.id] || (this.initChooseAdmin && item?.bk_username === 'admin')) {
                            this.$refs.userTable?.toggleRowSelection(item, true)
                        }
                    })
                })
            } finally {
                this.loading = false
            }
        }

        handleConfirm() {
            if (this.isMyCredentials) {
                this.imPower()
            } else if (this.onlyChooseUser) {
                this.setUsersByRole(this.rawSelected, this.allSelected)
            } else {
                this.visible = false
                this.$emit('confirm', this.selectedData)
            }
        }
        async setUsersByRole(rawData, updateData) {
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
            // 如果是角色管理页面调用
            let deletePromises = []
            let addPromises = []
            if (this.caller === 'roleManage') {
                deletePromises = deleteId.map(id => {
                return this.$api.RoleManageMain.deleteUserRole({id: this.roleDetail.id, userId: id})
            })
                addPromises = addId.map(id => {
                    return this.$api.UserManageMain.setUserRoles({id: this.roleDetail.id, userId: id})
                })
            } else if (this.caller === 'groupManage') { // 组织管理调用
                addId.length > 0 && addPromises.push(this.$api.GroupManage.addGroupUsers({id: this.roleDetail.id, addIds: addId}))
                deleteId.length > 0 && deletePromises.push(this.$api.GroupManage.delGroupUsers({id: this.roleDetail.id, deleteIds: deleteId}))
            }
            this.isConfirm = true
            try {
                // const res = await this.$api.UserManageMain.setUsersByRole({
                //     users: this.selectedData.user.map(item => item.id),
                //     id: this.roleDetail?.id
                // })
                // const { result, message } = res
                // if (!result) {
                //     this.$error(message)
                //     return false
                // }
                // this.$success('设置人员成功')
                // this.handleClose()
                // this.$emit('confirm')
                // const { result, message } = res
                // if (!result) {
                //     this.$error(message)
                //     return false
                // }
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
        imPower() {
            this.isConfirm = true
            this.$api.RemoteConnectMain.setCredAuthList({
                id: this.credentialsDetail.id,
                body: {
                    user_list: this.selectedData.user.map(item => item.bk_username),
                    role_list: this.selectedData.role.map(item => item.id)
                }
            }).then(res => {
                const { result, message } = res
                if (!result) {
                    this.$error(message)
                    return false
                }
                this.$success('授权成功')
                this.handleClose()
            }).finally(() => {
                this.isConfirm = false
            })
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
            this.getDataList()
        }

        handleLimitChange(size) {
            this.pagination.current = 1
            this.pagination.limit = size
            this.getDataList()
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
                    const isAdmin = this.initChooseAdmin && item?.bk_username === 'admin'
                    this.$refs.userTable?.toggleRowSelection(item, isAdmin)
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
