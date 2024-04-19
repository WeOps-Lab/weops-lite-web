// 资产数据模块
import {get, deletes, post, patch, reUrl} from '@/api/axiosconfig/axiosconfig'
export default {
    /**
     * 查询实例列表
     * @param {Object} params 请求参数
     */
    getInstanceList(params = {}) {
        return post(`${reUrl}/instance/search/`, params)
    },
    /**
     * 创建实例
     * @param {Object} params 请求参数
     */
    createInstance(params = {}) {
        return post(`${reUrl}/instance/`, params)
    },
    /**
     * 修改实例
     * @param {Object} params 请求参数
     */
    updateInstance(params = {}) {
        return patch(`${reUrl}/instance/${params.id}/`, params.body)
    },
    /**
     * 批量删除实例
     * @param {Object} params 请求参数
     */
    deleteInstance(params = {}) {
        return post(`${reUrl}/instance/batch_delete/`, params.body)
    },
    /**
     * 实例详情
     * @param {Object} params 请求参数
     */
    getInstDetial(params = {}) {
        return get(`${reUrl}/instance/${params.id}/`)
    },
    /**
     * 查询某个实例的所有关联实例
     * @param {Object} params 请求参数
     */
    getAssoInstList(params = {}) {
        return get(`${reUrl}/instance/association_instance_list/${params.model_id}/${params.inst_id}/`)
    },
    /**
     * 创建实例关联
     * @param {Object} params 请求参数
     */
    createInstAsso(params = {}) {
        return post(`${reUrl}/instance/association/`, params)
    },
    /**
     * 删除实例关联
     * @param {Object} params 请求参数
     */
    deleteInstAsso(params = {}) {
        return deletes(`${reUrl}/instance/association/${params.id}/`)
    },
    /**
     * 删除实例关联
     * @param {Object} params 请求参数
     */
    getRelatedList(params = {}) {
        return get(`${reUrl}/instance/instance_association/${params.model_id}/${params.inst_id}/`)
    }
}
