// 角色管理模块
import { get, post, deletes, put, reUrl } from '@/api/axiosconfig/axiosconfig'
import Mock from 'mockjs'
import responseData from './responseData'
export default {

    /**
     * 获取角色列表数据
     *
     * @param {Object} params 请求参数
     */
    getRoleList(params = {}) {
        Mock.mock(/api\/system\/mgmt\/role_manage\/get_roles/, 'get', responseData.getRoleListData(params))
        return get('/system/mgmt/role_manage/get_roles/', params)
    },
    /**
     * 获取全部角色列表数据
     *
     * @param {Object} params 请求参数
     */
    getAllRoleList(params = {}) {
        Mock.mock(/api\/system\/mgmt\/role_manage\/get_all_roles/, 'get', responseData.getAllRoleList())
        return get('/system/mgmt/role_manage/get_all_roles/', params)
    },
    /**
     * 删除角色
     *
     * @param {Object} params 请求参数
     */
    deleteRole(params = {}) {
        Mock.mock(/api\/system\/mgmt\/role_manage\/delete_role/, 'delete', responseData.deleteRoleData)
        return deletes('/system/mgmt/role_manage/delete_role/', params)
    },
    /**
     * 新增角色
     *
     * @param {Object} params 请求参数
     */
    createRole(params = {}) {
        Mock.mock(/api\/system\/mgmt\/role_manage\/create_role/, 'post', responseData.createRoleData(params))
        return post('/system/mgmt/role_manage/create_role/', params)
    },
    /**
     * 编辑角色
     *
     * @param {Object} params 请求参数
     */
    editRole(params = {}) {
        Mock.mock(/api\/system\/mgmt\/role_manage\/edit_role/, 'put', responseData.editRoleData)
        return put('/system/mgmt/role_manage/edit_role/', params)
    },
    /**
     * 设置角色菜单权限
     *
     * @param {Object} params 请求参数
     */
    setRoleMenu(params = {}) {
        Mock.mock(/api\/system\/mgmt\/role_manage\/set_role_menus/, 'post', responseData.setRoleMenu(params))
        return post('/system/mgmt/role_manage/set_role_menus/', params)
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
        Mock.mock(/api\/system\/mgmt\/role_manage\/get_role_menus/, 'get', responseData.getRoleMenus(params))
        return get('/system/mgmt/role_manage/get_role_menus/', params)
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
        Mock.mock(/api\/system\/mgmt\/inst_permissions\/(\?.*)?$/, 'get', responseData.getInstPermissions(params))
        return get('/system/mgmt/inst_permissions/', params)
    },
    /**
     * 查询实例类型静态字段
     *
     * @param {Object} params 请求参数
     */
    getInstanceTypes(params = {}) {
        Mock.mock(/api\/system\/mgmt\/inst_permissions\/get_instance_types/, 'get', responseData.getInstanceTypes(params))
        return get('/system/mgmt/inst_permissions/get_instance_types/', params)
    },
    /**
     * 查询具体实例类型的数据
     *
     * @param {Object} params 请求参数
     */
    getInstances(params = {}) {
        Mock.mock(/api\/system\/mgmt\/inst_permissions\/get_instances/, 'get', responseData.getInstances(params))
        return get('/system/mgmt/inst_permissions/get_instances/', params)
    },
    /**
     * 创建实例权限
     *
     * @param {Object} params 请求参数
     */
    createInstPermissions(params = {}) {
        Mock.mock(/api\/system\/mgmt\/inst_permissions/, 'post', responseData.createInstPermissions(params))
        return post('/system/mgmt/inst_permissions/', params)
    },
    /**
     * 修改实例权限
     *
     * @param {Object} params 请求参数
     */
    editInstPermissions(params: any = {}) {
        Mock.mock(/api\/system\/mgmt\/inst_permissions/, 'put', responseData.editInstPermissions(params))
        return put(`/system/mgmt/inst_permissions/${params.id}/`, params.body)
    },
    /**
     * 删除实例权限
     *
     * @param {Object} params 请求参数
     */
    deleteInstPermissions(params: any = {}) {
        Mock.mock(/api\/system\/mgmt\/inst_permissions/, 'delete', responseData.deleteInstPermissions(params))
        return deletes(`/system/mgmt/inst_permissions/${params.id}/`, params)
    },
    /**
     * 查询实例权限详情
     *
     * @param {Object} params 请求参数
     */
    getInstPermissionsDetail(params: any = {}) {
        Mock.mock(/api\/system\/mgmt\/inst_permissions\/\d+/, 'get', responseData.getInstPermissionsDetail(params))
        return get(`/system/mgmt/inst_permissions/${params.id}/`, params)
    },
    /**
     * 查询监控采集和监控策略的静态表格字段
     *
     * @param {Object} params 请求参数
     */
    getMonitorAttrs(params: any = {}) {
        return get(`${reUrl}/system/mgmt/inst_permissions/get_monitor_attrs/`, params)
    }
}
