<template>
    <div class="operation-permission" v-loading="menuLoading">
        <div class="table-header">
            <div class="menu-box">菜单</div>
            <div class="operate-box">操作权限</div>
        </div>
        <div class="table-body">
            <div class="menu-list" v-for="item in menuList" :key="item.id">
                <div class="first-level-box" @click="setExpandStatus(item)">
                    <div class="menu-name">
                        <i
                            v-if="item.children"
                            class="expand-icon"
                            :class="item.isExpand ? 'el-icon-caret-bottom' : 'el-icon-caret-right'">
                        </i>
                        <el-checkbox
                            :class="['check-box', !item.children && 'check-box-left']"
                            :indeterminate="item.isIndeterminate"
                            v-model="item.isChecked"
                            @click.stop.native="() => {}"
                            @change="handleMenuChecked(item)"
                        >
                        </el-checkbox>
                        <span>{{item.name}}</span>
                    </div>
                    <div v-if="item.auth" class="menu-operate">
                        <div v-for="(authItem, authIndex) in item.auth" :key="authIndex">
                            <el-checkbox
                                class="check-box"
                                v-model="authItem.value"
                                :indeterminate="authItem.isIndeterminate"
                                @click.stop.native="() => {}"
                                @change="handleOperateChecked(item, authItem.type)"
                            >
                            </el-checkbox>
                            <span v-overflow-tooltip>{{authItem.label}} </span>
                        </div>
                    </div>
                </div>
                <div v-if="item.isExpand">
                    <div v-for="tex in item.children" :key="tex.id">
                        <div class="second-level-box" @click="setExpandStatus(tex)">
                            <div class="menu-name" style="padding-left: 40px;">
                                <!--                        down-shape-->
                                <i v-if="tex.children" class="expand-icon" :class="tex.isExpand ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" />
                                <el-checkbox
                                    :class="['check-box', !tex.children && 'check-box-left']"
                                    :indeterminate="tex.isIndeterminate"
                                    v-model="tex.isChecked"
                                    @change="handleMenuChecked(tex)"
                                    @click.stop.native="() => {}"
                                >
                                </el-checkbox>
                                <span>{{tex.name}}</span>
                            </div>
                            <div v-if="tex.auth" class="menu-operate">
                                <div v-for="(authTex, authTexIndex) in tex.auth" :key="authTexIndex">
                                    <el-checkbox
                                        class="check-box"
                                        :indeterminate="authTex.isIndeterminate"
                                        v-model="authTex.value"
                                        @click.stop.native="() => {}"
                                        @change="handleOperateChecked(tex, authTex.type)"
                                    >
                                    </el-checkbox>
                                    <span v-overflow-tooltip>{{authTex.label}}</span>
                                </div>
                            </div>
                        </div>
                        <div v-if="tex.isExpand">
                            <div class="third-level-box" v-for="nev in tex.children" :key="nev.id">
                                <div class="menu-name" style="padding-left: 90px;">
                                    <el-checkbox
                                        :class="['check-box']"
                                        :indeterminate="nev.isIndeterminate"
                                        v-model="nev.isChecked"
                                        @change="handleMenuChecked(nev)"
                                    >
                                    </el-checkbox>
                                    <span>{{nev.name}}</span>
                                </div>
                                <div v-if="nev.auth" class="menu-operate">
                                    <template v-for="(authNev, authNevIndex) in nev.auth">
                                        <div :key="authNevIndex">
                                            <el-checkbox
                                                class="check-box"
                                                v-model="authNev.value"
                                                @change="handleOperateChecked(nev, authNev.type)"
                                            >
                                            </el-checkbox>
                                            <span v-overflow-tooltip>{{authNev.label}}</span>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from 'vue-property-decorator'
    import { removeItemsWithId } from '@/common/dealMenu'
    @Component
    export default class OperationPermission extends Vue {
        @Prop({
            type: Object,
            default: () => ({})
        })
        role: any | undefined
        menuList = []
        menuLoading: boolean = false
        checkAuthMenusIds = []
        operateAuthMenusIds = []
        // 保存角色的原始的权限
        permissions = {}
        // 查看权限的映射, 菜单Id:具体操作名称
        checkMap = {}
        mounted() {
            this.menuList = JSON.parse(JSON.stringify(this.$store.state.permission.menuList))
            // 角色权限这四个菜单只有admin能展示，操作权限不予展示
            // const ONLY_ADMIN_HAS_MENUS = ['SysRole']
            const ONLY_ADMIN_HAS_MENUS = []
            removeItemsWithId(this.menuList, ONLY_ADMIN_HAS_MENUS)
            this.handleMenus(this.menuList)
            this.getRoleMenus()
        }
        confirm() {
            this.menuLoading = true
            this.$emit('getMenuLoading', this.menuLoading)
            this.$api.RoleManageMain.setRoleMenu({
                id: this.role.id,
                menu_ids: this.checkAuthMenusIds
            }).then(res => {
                if (!res.result) {
                    this.$error(res.message)
                    return false
                }
                this.$success('菜单权限设置成功！')
            }).finally(() => {
                this.menuLoading = false
                this.$emit('getMenuLoading', this.menuLoading)
            })
        }
        getLatestMenu() {
            this.checkAuthMenusIds = []
            this.operateAuthMenusIds = []
            this.getSelectMenusIds(this.menuList)
            this.$emit('getLatestMenu', {
                checkAuthIds: this.checkAuthMenusIds,
                operateAuthIds: this.operateAuthMenusIds
            })
            // 将角色权限数据传给父组件
            this.$emit('getPermissions', this.permissions)
        }
        getSelectMenusIds(data) {
            data.forEach(item => {
                if (item.children) {
                    this.getSelectMenusIds(item.children)
                }
                const obj = {
                    menuId: item.id,
                    operate_ids: []
                }
                item.auth.forEach(tex => {
                    if (tex.type === 'check' && tex.value) {
                        this.checkAuthMenusIds.push(item.id)
                    }
                    if (!item.children) {
                        if (tex.type === 'operate' && tex.value) {
                            obj.operate_ids.push(tex.key)
                        }
                    }
                })
                if (obj.operate_ids.length) {
                    this.operateAuthMenusIds.push(obj)
                }
            })
        }
        setExpandStatus(item) {
            if (item.children) {
                this.$set(item, 'isExpand', !item.isExpand)
            }
        }
        getIndeterminateValue(item, type) {
            if (item.children) {
                const allTypeArr = []
                item.children.forEach(nev => {
                    nev.auth.forEach(c => {
                        if (c.type === type) {
                            allTypeArr.push(c)
                        }
                    })
                })
                item.auth.forEach(nev => {
                    if (nev.type === type) {
                        nev.value = allTypeArr.every(c => c.value)
                        nev.isIndeterminate = !(allTypeArr.every(c => c.value) || allTypeArr.every(c => !c.value)) || !!allTypeArr.find(c => c.isIndeterminate)
                    }
                })
                item.isChecked = item.auth.every(nev => nev.value)
                item.isIndeterminate = !(item.auth.every(nev => nev.value) || item.auth.every(nev => !nev.value)) || !!item.auth.find(nev => nev.isIndeterminate)
            }
        }
        handleOperateChecked(item, type, isInit?) {
            item.isChecked = item.auth.every(tex => tex.value)
            item.auth.forEach(tex => {
                if (tex.type === type) {
                    tex.isIndeterminate = false
                }
            })
            if (type === 'operate' && item.auth.find(tex => tex.type === 'operate' && tex.value) && !isInit) {
                item.auth.forEach(tex => {
                    if (tex.type === 'check') {
                        tex.value = true
                        this.setCheckedStatus(item, tex.value, 'check')
                        this.handleParentChecked(item, 'check')
                    }
                    const manageAll = item.auth.find(nev => nev.key === 'manageAllArticlesAuth')
                    if (tex.key === 'manageMyArticlesAuth' && manageAll.value) {
                        tex.value = true
                        this.setCheckedStatus(item, tex.value, 'check')
                        this.handleParentChecked(item, 'check')
                    }
                })
            }
            if (type === 'check' && !item.auth.find(tex => tex.type === 'check').value && !isInit) {
                item.auth.forEach(tex => {
                    if (tex.type === 'operate') {
                        tex.value = false
                        this.setCheckedStatus(item, tex.value, 'operate')
                        this.handleParentChecked(item, 'operate')
                    }
                })
            }
            if (!item.children) {
                item.isIndeterminate = !(item.auth.every(tex => tex.value) || item.auth.every(tex => !tex.value))
            } else {
                this.setCheckedStatus(item, item.auth.find(tex => tex.type === type).value, type)
            }
            this.handleParentChecked(item, type)
        }
        handleParentChecked(item, type?) {
            if (item.parentId) {
                const parent = this.findItemById(item.parentId, this.menuList)
                if (type) {
                    this.getIndeterminateValue(parent, type)
                } else {
                    this.handleAllCheckValue(parent)
                }
                if (parent.parentId) {
                    this.handleParentChecked(parent, type)
                }
            }
        }
        handleAllCheckValue(item) {
            if (item.children) {
                item.isChecked = item.children.every(tex => tex.isChecked)
                item.isIndeterminate = !!item.children.find(tex => tex.isChecked) || !!item.children.find(tex => tex.isIndeterminate)
                item.auth.forEach(tex => {
                    const arr = []
                    item.children.forEach(nev => {
                        nev.auth.forEach(c => {
                            if (c.type === tex.type) {
                                arr.push(c)
                            }
                        })
                    })
                    tex.value = arr.every(nev => nev.value)
                    const authTarget = arr.every(nev => nev.value) || arr.every(nev => !nev.value)
                    tex.isIndeterminate = !authTarget || !!arr.find(tex => tex.isIndeterminate)
                })
            }
        }
        handleMenuChecked(item) {
            this.setCheckedStatus(item, item.isChecked, 'all')
        }
        setCheckedStatus(item, status, type, isLastLevel?) {
            if (item.children) {
                item.children.forEach(tex => {
                    if (type === 'all') {
                        this.$set(tex, 'isChecked', status)
                    }
                    this.setCheckedStatus(tex, status, type)
                })
            }
            if (type === 'all') {
                item.auth.forEach(tex => {
                    this.$set(tex, 'value', status)
                })
                this.$set(item, 'isIndeterminate', false)
                this.handleParentChecked(item)
            } else {
                item.auth.forEach(tex => {
                    if (tex.type === type) {
                        tex.value = status
                    }
                })
                item.isChecked = item.auth.every(tex => tex.value)
                item.isIndeterminate = !(item.auth.every(tex => tex.value) || item.auth.every(tex => !tex.value))
            }
        }
        handleMenus(data, parentId?) {
            data.forEach(item => {
                if (parentId) {
                    this.$set(item, 'parentId', parentId)
                }
                this.$set(item, 'isChecked', false)
                this.$set(item, 'isIndeterminate', false)
                item?.auth.forEach(tex => {
                    this.$set(tex, 'isIndeterminate', false)
                })
                if (item.children) {
                    this.$set(item, 'isExpand', false)
                    this.handleMenus(item.children, item.id)
                }
            })
        }
        findItemById(id, list) {
            let res = list.find(item => item.id === id)
            if (res) {
                return res
            } else {
                for (let i = 0; i < list.length; i++) {
                    if (list[i].children instanceof Array && list[i].children.length > 0) {
                        res = this.findItemById(id, list[i].children)
                        if (res) {
                            return res
                        }
                    }
                }
                return null
            }
        }
        getRoleMenus() {
            this.menuLoading = true
            this.$emit('getMenuLoading', this.menuLoading)
            this.$api.RoleManageMain.getRoleMenus({roleId: this.role.name}).then(res => {
                if (res.result) {
                    this.permissions = res.data
                    const result = this.changeDataFormat(res.data)
                    // 计算一开始有权限的id
                    const rawIds = res.data.map(item => item.name)
                    // 传给父组件保存
                    this.$emit('getRawIds', rawIds)
                    for (const k in result) {
                        result[k].forEach(item => {
                            const target = this.findItemById(k === 'operate_ids' ? item.menuId : item, this.menuList)
                            if (target) {
                                if (k === 'operate_ids') {
                                    item[k].forEach(tex => {
                                        const flag = target.auth.find(nev => nev.key === tex)
                                        flag.value = true
                                        this.handleOperateChecked(target, flag.type, true)
                                    })
                                } else {
                                    if (target.children && target.children.length) {
                                        return false
                                    }
                                    const flag = target.auth.find(nev => nev.key.includes(item))
                                    flag.value = true
                                    this.handleOperateChecked(target, flag.type)
                                }
                            }
                        })
                    }
                }
            }).finally(() => {
                this.menuLoading = false
                this.$emit('getMenuLoading', this.menuLoading)
            })
        }
        // 将数据转格式
        changeDataFormat(data) {
            const operateIds = []
            const menusIds = data.filter(item => item.endsWith('view')).map(item => item.split('_')[0])
            const operateArr = data.filter(item => !item.endsWith('view')).map(item => item)
            operateArr.forEach(item => {
                const menuId = item.split('_')[0]
                const target = operateIds.find(operate => operate.menuId === menuId)
                if (!target) {
                    operateIds.push({
                        menuId,
                        operate_ids: [item]
                    })
                    return
                }
                target.operate_ids.push(item)
            })
            return {
                menus_ids: menusIds,
                operate_ids: operateIds
            }
        }
    }
</script>

<style scoped lang="scss">
    .operation-permission {
        height: 100%;
        padding: 10px 10px 0 10px;
        display: flex;
        flex-direction: column;
        .table-header {
            display: flex;
            height: 50px;
            align-items: center;
            background-color: #FAFAFA;
            border: 1px solid #dcdee5;
            .menu-box,
            .operate-box {
                flex: 1;
                padding-left: 15px;
            }
            .operate-box {
                min-width: 65%;
            }
        }
        .table-body {
            flex: 1;
            height: 0;
            overflow: auto;
            .menu-list {
                .first-level-box,
                .second-level-box,
                .third-level-box {
                    display: flex;
                    height: 50px;
                    align-items: center;
                    border-bottom: 1px solid #c4c6cc;
                }
                .menu-name,
                .menu-operate {
                    flex: 1;
                    padding-left: 15px;
                }
                .menu-name {
                    font-size: 0;
                    display: flex;
                    align-items: center;
                    .expand-icon {
                        font-size: 18px !important;
                        cursor: pointer;
                        margin-right: 5px;
                    }
                    span {
                        font-size: 13px;
                        display: inline-block;
                        height: 18px;
                        line-height: 18px;
                    }
                }
                .menu-operate {
                    display: flex;
                    min-width: 65%;
                    div {
                        //flex: 1;
                        font-size: 0;
                        display: flex;
                        align-items: center;
                        margin-right: 10px;
                        width: 112px;
                        span {
                            flex: 1;
                            width: 0;
                            font-size: 13px;
                            display: inline-block;
                            height: 18px;
                            line-height: 18px;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                        }
                    }
                }
            }
            .check-box {
                //vertical-align: text-top;
                margin-right: 5px;
            }
            .check-box-left {
                margin-left: 23px;
            }
        }
    }
</style>
