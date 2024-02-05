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
                            :panels="panels"
                            :active-panel="active"
                            type="capsule"
                            @change="changeMenu">
                        </menu-tab>
                        <el-input
                            v-if="active === 'user'"
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
                        v-if="active === 'user'"
                        class="mt20 table-container"
                        ref="userTable"
                        :data="dataList"
                        :pagination="pagination"
                        v-loading="loading"
                        :columns="userColumns"
                        @select="handleSelect"
                        @select-all="handleAllSelect"
                        @page-change="handlePageChange"
                        @page-limit-change="handleLimitChange">
                    </com-table>
                    <div v-else class="content-box">
                        <div class="search">
                            <el-input
                                clearable
                                style="width: 300px;"
                                placeholder="请输入搜索关键字"
                                :suffix-icon="'el-icon-search'"
                                v-model="searchValue"
                                @change="handlerIconClick"
                                @clear="handlerIconClick"
                            >
                            </el-input>
                        </div>
                        <div class="organization-box" v-loading="loading">
                            <el-tree
                                v-if="nodeData.length"
                                ref="tree"
                                :data="nodeData"
                                default-expand-all
                                :props="{ children: 'subGroups' }">
                                <span class="custom-tree-node" slot-scope="{ data }">
                                    <span class="name">{{data.name}}</span>
                                    <el-checkbox
                                        v-model="data.checked"
                                        @change="handleCheck(data)" />
                                </span>
                            </el-tree>
                        </div>
                    </div>
                </div>
                <div class="selection-container">
                    <p>已选择（共<span>{{allSelected.length}}</span>条）<span class="clear" @click="handleClear">清空</span></p>
                    <ul>
                        <li v-for="item in allSelected" :key="item.id + item.type">
                            {{ item.type === 'user' ? `${item.chname || '--'}(${item.bk_username})` : item.name }}
                            <span>{{ item.type === 'user' ? '用户' : '组织' }}</span>
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
    import { Pagination, TableData, Panels } from '@/common/types'
    import { USER_COLUMNS, ROLE_PANELS } from '@/common/constants/systemManage/roleManage.ts'
    import ComTable from '@/components/comTable.vue'
    import DrawerComponent from '@/components/comDrawer.vue'

    @Component({
        components: {
            MenuTab,
            ComTable,
            DrawerComponent
        }
    })
    export default class userAndGroup extends Vue {
        @Prop({
            type: String,
            default: () => '白名单'
        })
        title: string
        visible: boolean = false
        loading: boolean = false
        isConfirm: boolean = false
        panels: Array<Panels> = ROLE_PANELS
        active: string = 'user'
        pagination: Pagination = {
            current: 1,
            count: 0,
            limit: 20
        }
        userColumns: Array<TableData> = USER_COLUMNS
        searchValue: string = ''
        dataList: any = [] // 表格展示数据
        selectedData:any = {} // 选中的数据，有{user:[], group:[]}
        allSelected:any = [] // 展示数据列表
        rawSelected:any = [] // user选中原始数据
        roleDetail: any = {} // 角色信息(id)
        deleteUserId: string[] = [] // 删除的用户id
        addUserId: string[] = [] // 增加的组织id
        rawGroupSelected: any = [] // 组织选中原始数据
        nodeData: any[] = [] // 组织数据
        deleteGroupId: string[] = [] // 删除的组织id
        addGroupId: string[] = [] // 要增加的组织id

        async showSlider(list, row?) {
            this.visible = true
            this.active = 'user'
            this.searchValue = ''
            this.roleDetail = row
            const originList = {
                user: [],
                group: []
            }
            this.selectedData = this.$deepClone((list || originList))
            // 保存user原始数据
            this.rawSelected = this.$deepClone(this.selectedData.user)
            // 保存group原始数据
            this.rawGroupSelected = this.$deepClone(this.selectedData.group)
            this.handleAllSelected()
            this.changeMenu('user')
            // 获取列表数据
            if (this.active === 'user') {
                this.getDataList()
            } else {
                this.getGroups()
            }
        }

        handleAllSelected() {
            this.allSelected = []
            // 将选中的数据全部添加到allSelected数组中
            Object.keys(this.selectedData).forEach(key => {
                this.allSelected = this.allSelected.concat(this.selectedData[key].map(r => ({ ...r, type: key })))
            })
        }

        changeMenu(active) {
            this.active = active
            // 如果是user的tab，才有pagination参数
            if (active === 'user') {
                this.pagination.current = 1
                this.$refs.userTable?.updateColumns(this.userColumns)
                this.getDataList()
            } else {
                this.getGroups()
            }
        }

        // 获取user的列表
        async getDataList() {
            const params = {
                page: this.pagination.current,
                per_page: this.pagination.limit,
                search: this.searchValue
            }
            this.loading = true
            try {
                const res = await this.$api.UserManageMain.getUserList(params)
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
            const {addId: addUserId, deleteId: deleteUserId} = this.findAddAndDeleteIds(this.rawSelected, this.allSelected, 'user')
            this.addUserId = addUserId
            this.deleteUserId = deleteUserId
            const {addId: addGroupId, deleteId: deleteGroupId} = this.findAddAndDeleteIds(this.rawGroupSelected, this.allSelected, 'group')
            this.addGroupId = addGroupId
            this.deleteGroupId = deleteGroupId
            this.setUserAndGroup()
        }
        // 调接口
        async setUserAndGroup() {
            let deletePromises = []
            let addPromises = []
            this.isConfirm = true
            // 用户
            deletePromises = this.deleteUserId.map(id => {
                return this.$api.RoleManageMain.deleteUserRole({id: this.roleDetail.id, userId: id})
            })
            addPromises = this.addUserId.map(id => {
                    return this.$api.UserManageMain.setUserRoles({id: this.roleDetail.id, userId: id})
            })
            // 组织
            this.addGroupId.length > 0 && addPromises.push(this.$api.RoleManageMain.addRoleGroups({id: this.roleDetail.id, addGroupId: this.addGroupId}))
            this.deleteGroupId.length > 0 && deletePromises.push(this.$api.RoleManageMain.delRoleGroups({id: this.roleDetail.id, deleteGroupId: this.deleteGroupId}))

            try {
                const res = await Promise.all([...addPromises, ...deletePromises])
                if (res.every(item => item.result)) {
                    this.$success('设置成功')
                    this.handleClose()
                    this.$emit('confirm')
                }
            } catch (error) {
                this.$warn(error)
            } finally {
                this.isConfirm = false
            }
        }
        // 计算 addId 和 deleteId
        findAddAndDeleteIds(rawData, updateData, type) {
            // 找出要删除的id和要增加的id
            const deleteId = []
            const rawTemp = rawData.map(item => item.id)
            const updateTemp = updateData.filter(item => item.type === type).map(item => item.id)
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
            return {addId, deleteId}
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
                if (row.type === 'user') {
                    this.dataList.forEach(item => {
                        if (item.id === row.id) {
                            this.$refs.userTable?.toggleRowSelection(item, false)
                        }
                    })
                } else {
                    this.nodeData.forEach(item => {
                        this.handleGroupData(item, row.id, false)
                    })
                }
            })
            // 移除用户或角色后，更新map数据
            const selectedIndex = this.selectedData[row.type].findIndex(r => r.id === row.id)
            this.selectedData[row.type].splice(selectedIndex, 1)
        }

        handleClear() {
            this.selectedData = {
                user: [],
                group: []
            }
            this.handleAllSelected()
            this.$nextTick(() => {
                this.dataList.forEach(item => {
                    this.$refs.userTable?.toggleRowSelection(item, false)
                })
                if (this.active === 'group') {
                    this.checkAllToFalse(this.nodeData)
                }
            })
        }

        // 组织
        handlerIconClick() {
            this.getGroups()
        }
        async getGroups() {
            this.loading = true
            const params = {
                search: this.searchValue
            }
            const res = await this.$api.GroupManage.getGroups(params)
            if (!res.result) {
                return false
            }
            // 对接口返回的数据进行处理，设置checked
            for (let i = 0; i < this.selectedData.group.length; i++) {
                res.data.forEach(item => {
                    this.handleGroupData(item, this.selectedData.group[i].id, true)
                })
            }
            this.nodeData = res.data
            this.loading = false
        }
        // 设置数据的checked
        handleGroupData(data, id, value: boolean) {
            if (data.id === id) {
                data.checked = value
            } else if (data.subGroups && data.subGroups.length > 0) {
                for (const childNode of data.subGroups) {
                    this.handleGroupData(childNode, id, value)
                }
            }
        }
        // 递归遍历树结构，将 checked 为 true 的项加入 selected 数组
        traverseTree(node, arr) {
            const index = arr.findIndex(item => item.id === node.id)
            // checked为true且arr里不存在该数据
            if (node.checked && index < 0) {
                arr.push(node)
            } else if (!node.checked && index >= 0) {
                arr.splice(index, 1)
            }
            if (node.subGroups && node.subGroups.length > 0) {
                for (const childNode of node.subGroups) {
                    this.traverseTree(childNode, arr)
                }
            }
        }
        // 更改组织选中状态时的回调
        handleCheck(data) {
            // 如果allSelected的group里没有对应的id，则push
            const index = this.selectedData.group.findIndex(item => item.id === data.id)
            if (data.checked && index === -1) {
                this.selectedData.group.push(data)
            } else if (!data.checked) {
                this.selectedData.group.splice(index, 1)
            }
            this.handleAllSelected()
        }
        // 将所有的checked设置为false
        checkAllToFalse(data) {
            for (const item of data) {
                item.checked = false
                if (item.subGroups.length) {
                    this.checkAllToFalse(item.subGroups)
                }
            }
        }

        changeVisible(val) {
            this.visible = val
        }
    }
</script>

<style scoped lang="scss">
/* stylelint-disable selector-class-pattern */
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
        .search {
            padding: 20px 20px 20px 0;
        }
        .organization-box {
            padding-bottom: 20px;
            .custom-tree-node {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding-right: 20px;
                /deep/.el-checkbox__inner {
                    border-radius: 50%;
                }
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
