// 用户管理模块
import {get, deletes, patch, post, put, reUrl, deleteb} from '@/api/axiosconfig/axiosconfig'
export default {
    /**
     * 获取用户列表数据
     *
     * @param {Object} params 请求参数
     */
    getUserList(params = {}) {
        return get(`${reUrl}/user/`, params)
    },
    /**
     * 删除用户
     *
     * @param {Object} params 请求参数
     */
    deleteUser(params = {}) {
        return deletes(`${reUrl}/user/${params.id}/`, {})
    },
    /**
     * 重置用户密码
     *
     * @param {Object} params 请求参数
     */
    resetPassword(params = {}) {
        return patch(`${reUrl}/user/${params.id}/`, params)
    },
    /**
     * 新建用户
     *
     * @param {Object} params 请求参数
     */
    createUser(params = {}) {
        return post(`${reUrl}/user/`, params)
    },
    /**
     * 编辑用户
     *
     * @param {Object} params 请求参数
     */
    editUser(params = {}) {
        return put(`${reUrl}/user/${params.id}/`, params)
    },
    /**
     * 设置用户角色
     *
     * @param {Object} params 请求参数
     */
    setUserRoles(params = {}) {
        return put(`${reUrl}/role/${params.id}/assign/${params.userId}/`, {})
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
    /**
     * 将一系列组添加到用户
     *
     * @param {Object} params 请求参数
     */
    addUserGroups(params: any = {}) {
        return patch(`${reUrl}/user/${params.id}/assign_groups/`, params.addIds)
    },
    /**
     * 将一系列组从该用户移除
     *
     * @param {Object} params 请求参数
     */
    delUserGroups(params: any = {}) {
        return deleteb(`${reUrl}//user/${params.id}/unassign_groups/`, params.deleteIds)
    }
}
