<template>
    <div class="menu-setting-wrapper">
        <div class="custom-menu-wrapper">
            <span>菜单名称：</span>
            <bk-input
                style="width: 250px;"
                :clearable="true"
                v-model="menuTitle"
                placeholder="请输入菜单名称" />
        </div>
        <div class="custom-menu-content mt15">
            <div class="built-in-menu container-col">
                <div class="title">菜单项</div>
                <div class="bt-menu-content col-content">
                    <bk-big-tree
                        enable-title-tip
                        default-expand-all
                        :data="activationMenu">
                        <div :class="{
                                 'tree-row': true,
                                 'disabled': data.id === 'SysSetting'
                             }"
                            slot-scope="{ data }"
                            @click="handleRow(data)">
                            <!-- 层级：{{ node.level + 1 }}，名称：  -->
                            <!-- 只有最后一层级路由即页面可勾选（children不存在）或者动态的页面组，如基础监控和资产记录(存在children，但是为空) -->
                            <bk-checkbox
                                v-if="!data.children || (data.children && data.children.length === 0)"
                                :value="data.checked"
                                :before-change="beforeChange" />
                            {{ data.name }}
                            <span
                                v-if="menuGroup.includes(data.id)"
                                class="tip-section">
                                ({{ tipMap[data.id] }})
                            </span>
                        </div>
                    </bk-big-tree>
                </div>
            </div>
            <div class="configuration-menu container-col">
                <div class="title">
                    <p>
                        菜单结构
                        <span
                            v-bk-tooltips="{
                                content: '最多支持三层菜单结构，直接拖动可进行排序和层级调整，其中目录下必须包含页面,‘基础监控’和‘资产记录’仅支持在第1/2层级',
                                placements: ['right']
                            }"
                            class="top-start">
                            <i class="bk-icon icon-question-circle"></i>
                        </span>
                    </p>
                    <bk-button
                        class="mr20"
                        size="small"
                        theme="primary"
                        title="创建外链"
                        :outline="true"
                        @click="createExternalChain('add')">
                        创建外链
                    </bk-button>
                    <bk-button
                        class="mr20"
                        size="small"
                        theme="primary"
                        title="创建目录"
                        :outline="true"
                        @click="handleAddDirectory">
                        创建目录
                    </bk-button>
                </div>
                <div class="col-content" v-bkloading="{ isLoading: initLoading, zIndex: 10 }">
                    <menu-item
                        v-if="configMenuList && configMenuList.length"
                        :all-menu="configMenuList"
                        :menu="configMenuList"
                        :key="refreshKey"
                        @edit-external-chain="editExternalChain"
                        @delete="deleteMenuItem"
                        @change="changeMenuItem" />
                </div>
                <div class="col-button-wrapper">
                    <bk-button
                        theme="primary"
                        title="保存"
                        class="mr10"
                        :disabled="loading"
                        :loading="loading"
                        @click="handleSave">
                        保存
                    </bk-button>
                    <bk-button
                        title="取消"
                        class="mr10"
                        @click="handleCancel">
                        取消
                    </bk-button>
                </div>
            </div>
        </div>
        <external-chain
            ref="externalChain"
            @handle-external-chain="handleExternalChain">
        </external-chain>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator'
    import { mapState } from 'vuex'
    import MenuItem from './components/menuItem.vue'
    import ExternalChain from './components/externalChain.vue'
    @Component({
        name: 'menu-setting',
        components: {
            MenuItem,
            ExternalChain
        },
        beforeRouteLeave(to, from, next) {
            if (this.$compareFormData({
                menuTitle: this.menuTitle,
                ...this.configMenuList
            }, this.menuCloneList)) {
                next()
                return false
            }
            this.$bkInfo({
                title: '确认离开当前页面',
                subTitle: '离开将导致未保存信息丢失',
                confirmLoading: true,
                confirmFn: () => {
                    next()
                },
                cancelFn: () => {
                    this.$bus.$emit('refreshNav', from)
                }
            })
        },
        computed: {
            ...mapState({
                permission: item => item.permission
            })
        }
    })
    export default class MenuSetting extends Vue {
        loading: boolean = false
        initLoading: boolean = false
        activationMenu: any = []
        menuTitle: string = ''
        menuGroup: Array<string> = ['AssetRecords', 'BasicMonitor']
        id: number | string = ''
        tipMap = {
            AssetRecords: '包括主机资产等子页面',
            BasicMonitor: '包括主机监控等子页面'
        }
        configMenuList: any = []
        menuCloneList: any = []
        refreshKey = ''
        mounted() {
            const id = this.$route.query?.id
            this.id = id
            if (id) {
                this.getMenuById(id)
            } else {
                this.handleMenuData()
            }
        }
        findAndReplaceByKey(arr, key, replacement) {
            for (let i = 0; i < arr.length; i++) {
                const element = arr[i]

                // 如果当前元素的 key 与目标 key 相匹配，则替换元素
                if (element.key === key) {
                    arr[i] = replacement
                    return
                }

                // 如果当前元素有 children 属性且是一个数组，则递归调用函数在 children 数组中查找并替换
                if (Array.isArray(element.children)) {
                    this.findAndReplaceByKey(element.children, key, replacement)
                }
            }
        }
        handleExternalChain(data, type) {
            if (type === 'add') {
                this.configMenuList.push(data)
            } else {
                this.findAndReplaceByKey(this.configMenuList, data.key, data)
                this.refreshKey = this.$random(5)
            }
        }
        editExternalChain(data) {
            const externalChain: any = this.$refs.externalChain
            externalChain.show('edit', data)
        }
        createExternalChain(type, data?) {
            const externalChain: any = this.$refs.externalChain
            externalChain.show(type, data)
        }
        async getMenuById(id = '') {
            this.initLoading = true
            try {
                const res = await this.$api.UserManageMain.getMenuById({
                    id
                })
                const { result, data, message } = res
                if (result) {
                    this.menuTitle = data.menu_name
                    this.configMenuList = data.menu
                    this.handleMenuData(this.getMenuIds())
                } else {
                    this.$error(message)
                }
            } finally {
                this.initLoading = false
            }
        }
        handleMenuData(ids = []) {
            const menuList = JSON.parse(JSON.stringify(this.permission.activationMenu))
            const clearChildren = (node) => {
                if (this.menuGroup.includes(node.id)) {
                    node.children = []
                } else if (Array.isArray(node.children)) {
                    node.children.forEach(child => clearChildren(child))
                }
                if (this.id) {
                    if (ids.includes(node.id)) {
                        node.checked = true
                    }
                } else {
                    this.initMenuSetting(node)
                }
            }
            menuList.forEach(item => {
                clearChildren(item)
            })
            this.activationMenu = this.addOriginName(menuList)
            this.menuCloneList = this.$Copy({
                menuTitle: this.menuTitle,
                ...this.configMenuList
            })
        }
        addOriginName(data, parentName = '') {
            return data.map(item => {
                if (item.children) {
                    item.children = this.addOriginName(item.children, item.name)
                }
                return {
                    ...item,
                    originName: parentName ? `${parentName}/${item.name}` : item.name
                }
            })
        }
        getMenuIds() {
            // 页面ID集合
            const getIdsWithLastLevel = (obj) => {
                let result = []
                if (obj.children?.length) {
                    result = result.concat(...obj.children.map(getIdsWithLastLevel))
                } else {
                    obj.isPage = true
                    result.push(obj.id)
                }
                return result
            }
            return this.configMenuList.map(getIdsWithLastLevel).flat()
        }
        initMenuSetting(node) {
            if (node.id === 'SysSetting') {
                node.checked = true
                this.configMenuList.push({
                    ...node,
                    isPage: true,
                    originName: `管理/${node.name}`
                })
            }
        }
        beforeChange() {
            return false
        }
        handleRow(data) {
            if (data.children?.length) {
                return false
            }
            // 不允许反选系统设置
            if (data.id === 'SysSetting') {
                return false
            }
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
            if (data.checked) {
                this.$set(data, 'checked', false)
                deleteItem(this.configMenuList, data.id)
            } else {
                this.$set(data, 'checked', true)
                this.configMenuList.push({ ...data, isPage: true })
            }
        }
        handleAddDirectory() {
            const hasNullName = this.configMenuList.some(item => !item.name || !item.id)
            if (hasNullName) {
                this.$warn('请先保存填写的目录名称')
                return false
            }
            this.configMenuList.push({
                name: '',
                id: '',
                isEdit: true,
                auth: [
                    {
                        key: 'checkAuth',
                        value: false,
                        label: '查看',
                        type: 'check'
                    },
                    {
                        key: 'operateAuth',
                        value: false,
                        label: '操作',
                        type: 'operate'
                    }
                ],
                children: []
            })
        }
        changeMenuItem(menu) {
            this.configMenuList = menu
        }
        deleteMenuItem(menu) {
            // 汇总找到删除的目录或者页面下 包含的页面ID集合
            const getIdsWithIsPageTrue = (obj) => {
                let result = []
                if (obj.isPage) {
                    result.push(obj.id)
                }
                if (obj.children?.length) {
                    result = result.concat(...obj.children.map(getIdsWithIsPageTrue))
                }
                return result
            }
            const deleteIds = getIdsWithIsPageTrue(menu)
            // 改变左侧菜单项的勾选状态，若右侧删除了页面，即改变页面的勾选状态（未勾选）
            const changeMenuChecked = (data) => {
                data.forEach(item => {
                    if (deleteIds.includes(item.id)) {
                        item.checked = false
                    }
                    if (item.children?.length) {
                        changeMenuChecked(item.children)
                    }
                })
            }
            changeMenuChecked(this.activationMenu)
        }
        hasEmptyProps = (list) => {
            return list.some(obj => {
                if (!obj.name || !obj.id) {
                    return true
                }
                if (obj.children) {
                    return this.hasEmptyProps(obj.children)
                }
                return false
            })
        }
        checkIsPage(data) {
            let isAllPage = true
            data.forEach(item => {
                if (item.children?.length) { // 存在子节点
                    const result = this.checkIsPage(item.children) // 递归检查子节点
                    if (!result) { // 子节点中存在未具有 isPage 属性的节点
                        isAllPage = false
                        return false
                    }
                } else { // 没有子节点，即为最后一层节点
                    // 最后一层节点中存在未具有 isPage 属性的节点或者isPage为false
                    if (!item.isPage) {
                        isAllPage = false
                        return false
                    }
                }
            })
            return isAllPage
        }
        handleMenuParams(menuList = this.configMenuList) {
            return menuList.map(menu => {
                const { isPage, isEdit, checked, sonMenuIds, ...params } = menu
                if (params.children?.length) {
                    params.children = this.handleMenuParams(params.children)
                }
                return params
            })
        }
        getDepth(arr) {
            if (!Array.isArray(arr)) {
                return 0
            }
            let maxDepth = 1
            arr.forEach((item) => {
                if (item.children?.length) {
                    const depth = this.getDepth(item.children) + 1
                    if (depth > maxDepth) {
                        maxDepth = depth
                    }
                }
            })
            return maxDepth
        }
        findItemLevel(items, id, level = 1) {
            for (const item of items) {
                if (item.id === id) {
                    return level
                }
                if (item.children?.length) {
                    const childLevel = this.findItemLevel(item.children, id, level + 1)
                    if (childLevel) {
                        return childLevel
                    }
                }
            }
            return 0
        }
        async handleSave() {
            if (!this.menuTitle) {
                this.$warn('请输入菜单名称')
                return false
            }
            // 若菜单目录超过三级，则提示
            if (this.getDepth(this.configMenuList) >= 4) {
                this.$warn('菜单最多仅支持三层的结构，请重新排布')
                return false
            }
            // 判断基础监控和资产记录是否在第1/2级别，超多则提示
            const DYNAMIC_MENU_KEYS = ['BasicMonitor', 'AssetRecords']
            for (const key of DYNAMIC_MENU_KEYS) {
                const level = this.findItemLevel(this.configMenuList, key)
                if (level > 2) {
                    this.$warn('‘基础监控’和‘资产记录’仅支持在第1/2层级')
                    return false
                }
            }
            // 若菜单存在目录或者页面的名称或者id为空，则提示保存失败
            if (this.hasEmptyProps(this.configMenuList)) {
                this.$warn('存在空的菜单名称或有未保存的菜单名称编辑')
                return false
            }
            // 若菜单的目录下没有页面，则提示保存失败
            if (!this.checkIsPage(this.configMenuList)) {
                this.$warn('目录下必须包含有页面')
                return false
            }
            await this.handleCreateMenu()
        }
        async handleCreateMenu() {
            this.loading = true
            try {
                const url = this.id ? 'updateMenuManage' : 'createMenuManage'
                const res = await this.$api.UserManageMain[url]({
                    id: this.id,
                    menu_name: this.menuTitle,
                    menu: this.handleMenuParams()
                })
                if (res.result) {
                    this.menuCloneList = this.$Copy({
                        menuTitle: this.menuTitle,
                        ...this.configMenuList
                    })
                    this.$success('保存成功')
                    this.$router.push({
                        name: 'SysSetting'
                    })
                } else {
                    this.$error(res.message)
                }
            } finally {
                this.loading = false
            }
        }
        handleCancel() {
            this.$router.go(-1)
        }
    }
</script>

<style scoped lang="scss">
.menu-setting-wrapper {
    .custom-menu-wrapper {
        padding: 10px 20px;
        background: #FFFFFF;
        display: flex;
        align-items: center;
    }
    .custom-menu-content {
        display: flex;
        height: calc(100vh - 210px);
        .container-col {
            .title {
                font-size: 16px;
                height: 40px;
                line-height: 40px;
                font-weight: bold;
                border-bottom: 1px solid $cw-color-border-0;
                margin: 0;
                padding-left: 20px;
            }
            .col-content {
                min-height: calc(100% - 40px);
                overflow: scroll;
                max-height: calc(100% - 40px);
                padding: 10px 15px;
            }
        }
        .built-in-menu {
            width: 300px;
            height: 100%;
            background: #FFFFFF;
            .bt-menu-content {
                .tip-section {
                    font-size: 12px;
                    color: $cw-color-text-2;
                }
                .tree-row {
                    display: flex;
                    align-items: center;
                    /deep/.bk-form-checkbox {
                        margin-right: 5px;
                    }
                    &.disabled {
                        color: #b1b2b6;
                        /deep/.bk-checkbox {
                            border-color: #dcdee5;
                            background-color: #dcdee5;
                        }
                    }
                }
            }
        }
        .configuration-menu {
            flex: 1;
            margin-left: 10px;
            background: #FFFFFF;
            .title {
                display: flex;
                align-items: center;
                p {
                    flex: 1;
                    margin: 0;
                }
            }
            i {
                cursor: pointer;
                color: $cw-color-text-2;
            }
            .col-content {
                min-height: calc(100% - 80px);
                max-height: calc(100% - 80px);
            }
            .col-button-wrapper {
                height: 40px;
                text-align: right;
            }
        }
    }
}
</style>
