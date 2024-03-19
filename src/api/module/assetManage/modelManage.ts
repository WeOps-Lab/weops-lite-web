// 模型管理模块
import {get, deletes, post, reUrl} from '@/api/axiosconfig/axiosconfig'
export default {
    /**
     * 查询模型分类
     * @param {Object} params 请求参数
     */
    getClassification(params = {}) {
        return get(`${reUrl}/model/classification/`, params)
    },
    /**
     * 创建模型分类
     * @param {Object} params 请求参数
     */
    createClassification(params = {}) {
        return post(`${reUrl}/model/classification/`, params)
    },
    /**
     * 删除模型分类
     * @param {Object} params 请求参数
     */
    deleteClassification(params = {}) {
        return deletes(`${reUrl}/model/classification/${params.id}/`)
    },
    /**
     * 查询模型
     * @param {Object} params 请求参数
     */
    getModel(params = {}) {
        return get(`${reUrl}/model/`, params)
    },
    /**
     * 创建模型
     * @param {Object} params 请求参数
     */
    createModel(params = {}) {
        return post(`${reUrl}/model/`, params)
    },
    /**
     * 删除模型
     * @param {Object} params 请求参数
     */
    deleteModel(params = {}) {
        return deletes(`${reUrl}/model/${params.id}/`)
    },
    /**
     * 查询模型属性
     * @param {Object} params 请求参数
     */
    getModelAttrList(params = {}) {
        return get(`${reUrl}/model/${params.id}/attr_list/`)
    },
    /**
     * 创建模型属性
     * @param {Object} params 请求参数
     */
    createModelAttr(params = {}) {
        return post(`${reUrl}/model/${params.id}/attr/`, params)
    },
    /**
     * 删除模型属性
     * @param {Object} params 请求参数
     */
    deleteModelAttr(params = {}) {
        return deletes(`${reUrl}/model/${params.id}/attr/${params.attr_id}/`)
    },
    /**
     * 查询模型关联
     * @param {Object} params 请求参数
     */
    getModelAssoList(params = {}) {
        return get(`${reUrl}/model/${params.id}/association/`)
    }
}
