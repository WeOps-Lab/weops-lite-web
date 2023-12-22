import Vue from 'vue'
import api from '@/api'
import store from '@/store/index'
import axios from 'axios'
import '@/controller/func/common'
import {{importName}} from '{{importUrl}}'
let instance = null

// 声明 mount 生命周期
export function mount(component, targetNode, props) {
    Vue.prototype.$api = api
    Vue.mixin({
        beforeCreate() {
            this.$options._base = Vue
        }
    })
    window.siteUrl = props.apiPrefix + (props.apiPrefix.endsWith('/') ? '' : '/')
    axios.defaults.baseURL = props.apiPrefix
    instance = new Vue({
        components: {
            app: component
        },
        store,
        data() {
            return {}
        },
        render: (h) => h('app')
    }).$mount(targetNode)
}

// 声明 unmount 生命周期
export function unmount(targetNode) {
    instance && instance.$destroy()
}

export default {{importName}}
