// 远程连接
import {get, deletes, post, put, reUrl} from '@/api/axiosconfig/axiosconfig'
export default {
    /**
     * 删除凭据
     *
     * @param {Object} params 请求参数
     */
    deleteCredential(params: any = {}) {
        return deletes(`${reUrl}/vault_credential/${params.id}/`, {})
    },
    /**
     * 凭据管理创建凭据
     *
     * @param {Object} params 请求参数
     */
    createCredential(params = {}) {
        return post(`${reUrl}/vault_credential/`, params)
    },
    /**
     * 凭据管理修改凭据
     *
     * @param {Object} params 请求参数
     */
    modifyCredential(params: any = {}) {
        return put(`${reUrl}/vault_credential/${params.id}/`, params.body)
    },
    /**
     * 凭据管理查询凭据详情
     *
     * @param {Object} params 请求参数
     */
    getCredentialDetail(params: any = {}) {
        return get(`${reUrl}/vault_credential/${params.id}/get_cred_detail/`, {})
    },
    /**
     * 查询指定对象的所有凭据
     *
     * @param {Object} params 请求参数
     */
    getVaultCredential(params = {}) {
        return get(`${reUrl}/vault_credential/`, params)
    },
    /**
     * 查询对象凭据参数列表
     *
     * @param {Object} params 请求参数
     */
    getCredParams(params = {}) {
        return get(`${reUrl}/cred_design/get_cred_params/`, params)
    },
    /**
     * 查询指定凭据的可分配资源列表
     *
     * @param {Object} params 请求参数
     */
    getCredResourceList(params: any = {}) {
        return get(`${reUrl}/vault_credential/${params.id}/get_resource_list/`, {})
    },
    /**
     * 凭据关联主机
     *
     * @param {Object} params 请求参数
     */
    setCredResourceList(params: any = {}) {
        return post(`${reUrl}/vault_credential/${params.id}/set_resource_list/`, params.body)
    },
    /**
     * 凭据授权
     *
     * @param {Object} params 请求参数
     */
    setCredAuthList(params: any = {}) {
        return post(`${reUrl}/vault_credential/${params.id}/set_auth_list/`, params.body)
    },
    /**
     * 远程连接获取凭据详情
     *
     * @param {Object} params 请求参数
     */
    getVaultCredDetail(params: any = {}) {
        return get(`${reUrl}/vault_credential/${params.id}/get_vault_cred_detail/`, params.body)
    },
    /**
     * 获取凭据详情
     *
     * @param {Object} params 请求参数
     */
    getCredDetail(params: any = {}) {
        return get(`${reUrl}/vault_credential/${params.id}/get_cred_detail/`, {})
    },
    /**
     * 远程连接获取主机远程凭据列表
     *
     * @param {Object} params 请求参数
     */
    getCredential(params = {}) {
        return get(`${reUrl}/vault_credential/get_remote_credential_list/`, params)
    },
    /**
     * 远程连接获取凭据详情，包括密码
     *
     * @param {Object} params 请求参数
     */
    getRemoteVoucherDetail(params: any = {}) {
        return get(`${reUrl}/vault_credential/${params.id}/get_vault_cred_detail/`, {})
    },
    /**
     * 远程连接获取上传文件的设置
     *
     * @param {Object} params 请求参数
     */
    getRemoteConfig(params = {}) {
        return get(`${reUrl}/long_distance/get_remote_push_file_config/`, params)
    },
    /**
     * 查询凭据管理左侧凭据树
     *
     * @param {Object} params 请求参数
     */
    getVaultTree(params = {}) {
        return get(`${reUrl}/vault_credential/get_vault_tree/`, params)
    }
}
