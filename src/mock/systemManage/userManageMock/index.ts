// 用户管理模块
import {get, deletes, patch, post, put, reUrl} from '@/api/axiosconfig/axiosconfig'
import Mock from 'mockjs'
import responseData from './responseData'
export default {
    /**
     * 查询自定义菜单列表
     *
     * @param {Object} params 请求参数
     */
    getMenuManage(params: any = {}) {
        Mock.mock(/api\/system\/mgmt\/menu_manage\/(\?.*)?$/, 'get', responseData.getMenuData(params))
        return get('/system/mgmt/menu_manage/', params)
    },
    getMenuById(params: any = {}) {
        Mock.mock(/api\/system\/mgmt\/menu_manage\/\d+/, 'get', responseData.getMenuById(params))
        return get(`/system/mgmt/menu_manage/${params.id}/`, params)
    },
    /**
     * 启用自定义菜单
     *
     * @param {Object} params 请求参数
     */
    useCustomMenu(params: any = {}) {
        Mock.mock(/api\/system\/mgmt\/menu_manage\/\d+\/use_menu/, 'patch', responseData.useMenu(params))
        return patch(`/system/mgmt/menu_manage/${params.id}/use_menu/`, params)
    },
    /**
     * 删除自定义菜单
     *
     * @param {Object} params 请求参数
     */
    deleteCustomMenu(params: any = {}) {
        Mock.mock(/api\/system\/mgmt\/menu_manage/, 'delete', responseData.deleteMenu(params))
        return deletes(`/system/mgmt/menu_manage/${params.id}/`, params)
    },

    /**
     * 获取用户列表数据
     *
     * @param {Object} params 请求参数
     */
    getUserList(params = {}) {
        Mock.mock(/api\/system\/mgmt\/user_keycloak\/get_users/, 'get', responseData.getUserList(params))
        return get('/system/mgmt/user_keycloak/get_users/', params)
    },
    /**
     * 删除用户
     *
     * @param {Object} params 请求参数
     */
    deleteUser(params = {}) {
        Mock.mock(/api\/system\/mgmt\/user_keycloak\/delete_users/, 'delete', responseData.deleteUser(params))
        return deletes('/system/mgmt/user_keycloak/delete_users/', params)
    },
    /**
     * 重置用户密码
     *
     * @param {Object} params 请求参数
     */
    resetPassword(params = {}) {
        Mock.mock(/api\/system\/mgmt\/user_keycloak\/reset_password/, 'put', responseData.resetPassword(params))
        return put('/system/mgmt/user_keycloak/reset_password/', params)
    },
    /**
     * 新建用户
     *
     * @param {Object} params 请求参数
     */
    createUser(params = {}) {
        Mock.mock(/api\/system\/mgmt\/user_keycloak\/create_user/, 'post', responseData.createUser(params))
        return post('/system/mgmt/user_keycloak/create_user/', params)
    },
    /**
     * 编辑用户
     *
     * @param {Object} params 请求参数
     */
    editUser(params = {}) {
        Mock.mock(/api\/system\/mgmt\/user_keycloak\/update_user/, 'put', responseData.editUser(params))
        return put('/system/mgmt/user_keycloak/update_user/', params)
    },
    /**
     * 设置用户角色
     *
     * @param {Object} params 请求参数
     */
    setUserRoles(params = {}) {
        Mock.mock(/api\/system\/mgmt\/user_manage\/set_user_roles/, 'post', responseData.setUserRoles(params))
        return post('/system/mgmt/user_manage/set_user_roles/', params)
    },
    /**
     * 双因子认证配置
     *
     * @param {Object} params 请求参数
     */
    updateLoginSet(params = {}) {
        Mock.mock(/api\/system\/mgmt\/sys_setting\/update_login_set/, 'post', responseData.updateLoginSet(params))
        return post('/system/mgmt/sys_setting/update_login_set/', params)
    },
    /**
     * 双因子认证配置
     *
     * @param {Object} params 请求参数
     */
    getLoginSet(params = {}) {
        Mock.mock(/api\/system\/mgmt\/sys_setting\/get_login_set/, 'get', responseData.getLoginSet(params))
        return get('/system/mgmt/sys_setting/get_login_set/', params)
    },
    /**
     * 发送验证码
     *
     * @param {Object} params 请求参数
     */
    sendValidateCode(params = {}) {
        return post(`${reUrl}/system/mgmt/sys_setting/send_validate_code/`, params)
    },
    /**
     * 查询用户列表
     *
     * @param {Object} params 请求参数
     */
    searchUserList(params = {}) {
        Mock.mock(/api\/system\/mgmt\/user_manage\/search_user_list/, 'get', responseData.searchUserList(params))
        return get('/system/mgmt/user_manage/search_user_list/', params)
    },
    /**
     * 查询角色列表
     *
     * @param {Object} params 请求参数
     */
    searchRoleList(params = {}) {
        Mock.mock(/api\/system\/mgmt\/role_manage\/search_role_list/, 'get', responseData.searchRoleList(params))
        return get('/system/mgmt/role_manage/search_role_list/', params)
    },
    /**
     * 查询角色列表
     *
     * @param {Object} params 请求参数
     */
    getDomainList(params = {}) {
        Mock.mock(/api\/system\/mgmt\/sys_setting\/get_domain/, 'get', responseData.getDomainList(params))
        return get('/system/mgmt/sys_setting/get_domain/', params)
    },
    /**
     * 默认域配置
     *
     * @param {Object} params 请求参数
     */
    setDomain(params = {}) {
        Mock.mock(/api\/system\/mgmt\/sys_setting\/set_domain/, 'post', responseData.setDomain(params))
        return post('/system/mgmt/sys_setting/set_domain/', params)
    },
    /**
     * 通过角色设置用户的角色
     *
     * @param {Object} params 请求参数
     */
    setUsersByRole(params: any = {}) {
        Mock.mock(/api\/system\/mgmt\/role_manage\/\d+\/role_set_users/, 'post', responseData.setUsersByRole(params))
        return post(`/system/mgmt/role_manage/${params.id}/role_set_users/`, params)
    },
    /**
     * 创建自定义菜单
     *
     * @param {Object} params 请求参数
     */
    createMenuManage(params = {}) {
        Mock.mock(/api\/system\/mgmt\/menu_manage/, 'post', responseData.createMenuManage(params))
        return post('/system/mgmt/menu_manage/', params)
    },
    /**
     * 修改自定义菜单
     *
     * @param {Object} params 请求参数
     */
    updateMenuManage: function(params: any = {}) {
        Mock.mock(/api\/system\/mgmt\/menu_manage/, 'put', responseData.updateMenuManage(params))
        return put(`/system/mgmt/menu_manage/${params.id}/`, params)
    },
    // 获取启用的菜单
    getUseMenu(params = {}) {
        return get(`${reUrl}/system/mgmt/menu_manage/get_use_menu/`, params)
    },
    /**
     * 设置用户角色状态
     *
     * @param {Object} params 请求参数
     */
    updateUserStatus(params: any = {}) {
        Mock.mock(/api\/system\/mgmt\/user_manage\/\d+\/update_user_status/, 'patch', responseData.updateUserStatus(params))
        return patch(`/system/mgmt/user_manage/${params.id}/update_user_status/`, params.body)
    }
}
