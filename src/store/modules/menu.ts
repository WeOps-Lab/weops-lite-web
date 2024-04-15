// initial state
import { menuList } from '@/router/frameRouter'
import api from '@/api/index'
import router from '@/router'
import permission from '@/store/modules/permisson'
const state = {
    dynamicMenus: '',
    dynamicRoutes: [],
    keepAliveList: []
}

function handleOtherMenus(data, commit, state) {
    const dynamicRoutes = []
    let compMap = {}
    try {
        compMap['assetData'] = require('@/views/asset/assetData/index/index.vue').default
    } catch (e) {
        console.error(`Failed to load Component: ${e.message}`)
    }
    menuList.forEach(item => {
        // 寻找菜单目录下: 资产数据
        if (item.id === 'Asset') {
            item.children.forEach(tex => {
                // 资产下的资产数据
                if (tex.id === 'AssetData') {
                    data.forEach(i => {
                        const obj = {
                            id: i.classification_id,
                            name: i.classification_name,                            ,
                            url: `/${i.classification_id}`,
                            auth: [
                                {
                                    key: '${i.classification_id}_view',
                                    value: false,
                                    label: '查看',
                                    type: 'check',
                                    apiKey: ['group_list','model_list','model_attr_list','instance_list']
                                },
                                {
                                    key: '${i.classification_id}_create',
                                    value: false,
                                    label: '创建资产',
                                    type: 'operate',
                                    apiKey: ['instance_create','group_list','model_attr_list']
                                },
                                {
                                    key: '${i.classification_id}_edit',
                                    value: false,
                                    label: '编辑资产',
                                    type: 'operate',
                                    apiKey: ['instance_update','group_list','model_attr_list','instance_detail']
                                },
                                {
                                    key: '${i.classification_id}_delete',
                                    value: false,
                                    label: '删除资产',
                                    type: 'operate',
                                    apiKey: ['instance_batch_delete']
                                }
                            ]
                        }
                        tex.children.push(obj)
                        // 动态路由的添加
                        const route: any = {
                            path: `/${i.classification_id}`,
                            name: i.classification_id,
                            component: compMap['assetData'],
                            meta: {
                                title: i.classification_name,
                                relatedMenu: tex.id
                            }
                        }
                        dynamicRoutes.push(route)
                        router.addRoute(route)
                    })
                }
            })
        }
    })
    commit('setDynamicRoutes', dynamicRoutes)
    // 资产管理可添加分组模型，当新的分组下有模型的增加，则需要重新更新菜单（资产记录的动态菜单）
    if (permission.state.user && JSON.stringify(permission.state.user) !== '{}') {
        permission.actions.updateMenuList({commit}, permission.state.user)
    }
}

// getters
const getters = { }

// mutations
const mutations = {
    setDynamicRoute(state, value) {
        state.completeDynamicRoute = value
    },
    setDynamicMenus(state, value) {
        state.dynamicMenus = value
    },
    setDynamicRoutes(state, lists) {
        state.dynamicRoutes = lists
    },
    setKeepAliveList(state, value) {
        state.keepAliveList.push(value)
    }
}

// actions
const actions = {
    async getOtherMenus({commit, state}) {
        const promise = new Promise((resolve, reject) => {
            api.ModelManage.getClassification().then(res => {
                if (res.result) {
                    commit('setDynamicRoute', true)
                    commit('setDynamicMenus', res.data)
                    handleOtherMenus(res.data, commit, state)
                    resolve(res.data)
                } else {
                    reject(res.message)
                }
            })
        })
        return promise
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
