// 用户管理模块
import {get, deletes, patch, post, put, reUrl, deleteb} from '@/api/axiosconfig/axiosconfig'
export default {
    /**
     * 获取用户列表数据
     *
     * @param {Object} params 请求参数
     */
    getUserList(params = {}) {
        return get(`${reUrl}/system/mgmt/users/`, params)
    },
    /**
     * 删除用户
     *
     * @param {Object} params 请求参数
     */
    deleteUser(params = {}) {
        return deletes(`${reUrl}/system/mgmt/users/${params.id}/`, {})
    },
    /**
     * 重置用户密码
     *
     * @param {Object} params 请求参数
     */
    resetPassword(params = {}) {
        return patch(`${reUrl}/system/mgmt/users/${params.id}/`, params)
    },
    /**
     * 新建用户
     *
     * @param {Object} params 请求参数
     */
    createUser(params = {}) {
        return post(`${reUrl}/system/mgmt/users/`, params)
    },
    /**
     * 编辑用户
     *
     * @param {Object} params 请求参数
     */
    editUser(params = {}) {
        return put(`${reUrl}/system/mgmt/users/${params.id}/`, params)
    },
    /**
     * 设置用户角色
     *
     * @param {Object} params 请求参数
     */
    setUserRoles(params = {}) {
        return put(`${reUrl}/system/mgmt/roles/${params.id}/assign/${params.userId}/`, {})
    },
    /**
     * 双因子认证配置
     *
     * @param {Object} params 请求参数
     */
    updateLoginSet(params = {}) {
        return post(`${reUrl}/system/mgmt/sys_setting/update_login_set/`, params)
    },
    /**
     * 双因子认证配置
     *
     * @param {Object} params 请求参数
     */
    getLoginSet(params = {}) {
        return get(`${reUrl}/system/mgmt/sys_setting/get_login_set/`, params)
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
        return get(`${reUrl}/system/mgmt/user_manage/search_user_list/`, params)
    },
    /**
     * 查询角色列表
     *
     * @param {Object} params 请求参数
     */
    searchRoleList(params = {}) {
        return get(`${reUrl}/system/mgmt/role_manage/search_role_list/`, params)
    },
    /**
     * 查询角色列表
     *
     * @param {Object} params 请求参数
     */
    getDomainList(params = {}) {
        return get(`${reUrl}/system/mgmt/sys_setting/get_domain/`, params)
    },
    /**
     * 默认域配置
     *
     * @param {Object} params 请求参数
     */
    setDomain(params = {}) {
        return post(`${reUrl}/system/mgmt/sys_setting/set_domain/`, params)
    },
    /**
     * 通过角色设置用户的角色
     *
     * @param {Object} params 请求参数
     */
    setUsersByRole(params: any = {}) {
        return post(`${reUrl}/system/mgmt/role_manage/${params.id}/role_set_users/`, params)
    },
    /**
     * 创建自定义菜单
     *
     * @param {Object} params 请求参数
     */
    createMenuManage(params = {}) {
        return post(`${reUrl}/system/mgmt/menu_manage/`, params)
    },
    /**
     * 查询自定义菜单列表
     *
     * @param {Object} params 请求参数
     */
    getMenuManage(params: any = {}) {
        return get(`${reUrl}/system/mgmt/menu_manage/`, params)
    },
    getMenuById(params: any = {}) {
        return get(`${reUrl}/system/mgmt/menu_manage/${params.id}/`, params)
    },
    /**
     * 启用自定义菜单
     *
     * @param {Object} params 请求参数
     */
    useCustomMenu(params: any = {}) {
        return patch(`${reUrl}/system/mgmt/menu_manage/${params.id}/use_menu/`, params)
    },
    /**
     * 删除自定义菜单
     *
     * @param {Object} params 请求参数
     */
    deleteCustomMenu(params: any = {}) {
        return deletes(`${reUrl}/system/mgmt/menu_manage/${params.id}/`, params)
    },
    /**
     * 修改自定义菜单
     *
     * @param {Object} params 请求参数
     */
    updateMenuManage: function(params: any = {}) {
        return put(`${reUrl}/system/mgmt/menu_manage/${params.id}/`, params)
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
        return patch(`${reUrl}/system/mgmt/user_manage/${params.id}/update_user_status/`, params.body)
    },
    /**
     * 将一系列组添加到用户
     *
     * @param {Object} params 请求参数
     */
    addUserGroups(params: any = {}) {
        return patch(`${reUrl}/system/mgmt/users/${params.id}/assign_groups/`, params.addIds)
    },
    /**
     * 将一系列组从该用户移除
     *
     * @param {Object} params 请求参数
     */
    delUserGroups(params: any = {}) {
        return deleteb(`${reUrl}/system/mgmt/users/${params.id}/unassign_groups/`, params.deleteIds)
    }
}
