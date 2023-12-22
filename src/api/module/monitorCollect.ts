import {get, reUrl} from '@/api/axiosconfig/axiosconfig'
export default {
    /**
     * 获取监控对象树
     *
     * @param {Object} params 请求参数
     */
    getCollectTree(params = {}) {
        return get(`${reUrl}/monitor_mgmt/monitor_collect/get_collect_tree/`, params)
    },
    /**
     * 获取监控策略模型对象树
     *
     * @param {Object} params 请求参数
     */
    getStrategyTree(params = {}) {
        return get(`${reUrl}/monitor_mgmt/monitor_collect/get_strategy_tree/`, params)
    }
}
