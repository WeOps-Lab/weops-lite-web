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
     * 获取全部角色列表数据
     *
     * @param {Object} params 请求参数
     */
    getAllRoleList(params = {}) {
        return get(`${reUrl}/system/mgmt/role_manage/get_all_roles/`, params)
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
     * 设置角色应用权限
     *
     * @param {Object} params 请求参数
     */
    setAppPermissions(params = {}) {
        return post(`${reUrl}/system/mgmt/role_manage/set_app_permissions/`, params)
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
     * 获取角色应用
     *
     * @param {Object} params 请求参数
     */
    getRoleApplications(params = {}) {
        return get(`${reUrl}/system/mgmt/role_manage/get_role_applications/`, params)
    },
    /**
     * 查询菜单权限中的监控和资产数据的其他分类
     *
     * @param {Object} params 请求参数
     */
    getRoleOtherMenus(params = {}) {
        return get(`${reUrl}/system/mgmt/role_manage/menus/`, params)
    },
    /**
     * 查询实例权限列表
     *
     * @param {Object} params 请求参数
     */
    getInstPermissions(params = {}) {
        return get(`${reUrl}/system/mgmt/inst_permissions/`, params)
    },
    /**
     * 查询实例类型静态字段
     *
     * @param {Object} params 请求参数
     */
    getInstanceTypes(params = {}) {
        return get(`${reUrl}/system/mgmt/inst_permissions/get_instance_types/`, params)
    },
    /**
     * 查询具体实例类型的数据
     *
     * @param {Object} params 请求参数
     */
    getInstances(params = {}) {
        return get(`${reUrl}/system/mgmt/inst_permissions/get_instances/`, params)
    },
    /**
     * 创建实例权限
     *
     * @param {Object} params 请求参数
     */
    createInstPermissions(params = {}) {
        return post(`${reUrl}/system/mgmt/inst_permissions/`, params)
    },
    /**
     * 修改实例权限
     *
     * @param {Object} params 请求参数
     */
    editInstPermissions(params: any = {}) {
        return put(`${reUrl}/system/mgmt/inst_permissions/${params.id}/`, params.body)
    },
    /**
     * 删除实例权限
     *
     * @param {Object} params 请求参数
     */
    deleteInstPermissions(params: any = {}) {
        return deletes(`${reUrl}/system/mgmt/inst_permissions/${params.id}/`, params)
    },
    /**
     * 查询实例权限详情
     *
     * @param {Object} params 请求参数
     */
    getInstPermissionsDetail(params: any = {}) {
        return get(`${reUrl}/system/mgmt/inst_permissions/${params.id}/`, params)
    },
    /**
     * 查询监控采集和监控策略的静态表格字段
     *
     * @param {Object} params 请求参数
     */
    getMonitorAttrs(params: any = {}) {
        return get(`${reUrl}/system/mgmt/inst_permissions/get_monitor_attrs/`, params)
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
