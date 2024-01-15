// 角色管理模块
import {get, deletes, post, put, patch, reUrl, deleteb} from '@/api/axiosconfig/axiosconfig'
export default {
    /**
     * 获取角色列表数据
     *
     * @param {Object} params 请求参数
     */
    getRoleList(params = {}) {
        return get(`${reUrl}/system/mgmt/roles/`, params)
    },
    /**
     * 删除角色
     *
     * @param {Object} params 请求参数
     */
    deleteRole(params = {}) {
        return deletes(`${reUrl}/system/mgmt/roles/${params.id}/`, {})
    },
    /**
     * 新增角色
     *
     * @param {Object} params 请求参数
     */
    createRole(params = {}) {
        return post(`${reUrl}/system/mgmt/roles/`, params)
    },
    /**
     * 编辑角色
     *
     * @param {Object} params 请求参数
     */
    editRole(params = {}) {
        return put(`${reUrl}/system/mgmt/roles/${params.id}/`, params)
    },
    /**
     * 将一个用户从角色移除
     *
     * @param {Object} params 请求参数
     */
    deleteUserRole(params = {}) {
        return deletes(`${reUrl}/system/mgmt/roles/${params.id}/withdraw/${params.userId}/`, {})
    },
    /**
     * 获取该角色下的所有用户
     *
     * @param {Object} params 请求参数
     */
    getRoleAllUser(params = {}) {
        return get(`${reUrl}/system/mgmt/users/roles/${params.id}/`, {})
    },
    /**
     * 设置角色菜单权限
     *
     * @param {Object} params 请求参数
     */
    setRoleMenu(params = {}) {
        return patch(`${reUrl}/system/mgmt/roles/${params.id}/permissions/`, params.array)
    },
    /**
     * 获取角色菜单
     *
     * @param {Object} params 请求参数
     */
    getRoleMenus(params = {}) {
        return get(`${reUrl}/system/mgmt/roles/${params.roleId}/`, {})
    },
    /**
     * 将该角色添加到一系列组中
     *
     * @param {Object} params 请求参数
     */
    addRoleGroups(params = {}) {
        return patch(`${reUrl}/system/mgmt/roles/${params.id}/assign_groups/`, params.addGroupId)
    },
    /**
     * 将该角色一系列组中移除
     *
     * @param {Object} params 请求参数
     */
    delRoleGroups(params = {}) {
        return deleteb(`${reUrl}/system/mgmt/roles/${params.id}/unassign_groups/`, params.deleteGroupId)
    },
    /**
     * 获取角色详细信息
     *
     * @param {Object} params 请求参数
     */
    getRoleDetail(params = {}) {
        return get(`${reUrl}/system/mgmt/roles/${params.id}/`, {})
    }
}
