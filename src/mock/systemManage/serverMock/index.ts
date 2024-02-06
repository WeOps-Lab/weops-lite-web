// server模块（各模块）api
import { get, post, put, reUrl } from '@/api/axiosconfig/axiosconfig'
import Mock from 'mockjs'
import responseData from './responseData'

// 返回在vue模板中的调用接口
export default {
    // ----GET-------------------------------------------------------------
    // 测试 get 请求
    testGet: function(params) {
        return get(reUrl + '/test_get/', params)
    },
    getMonitorMenus: function(params) {
        return get(reUrl + '/get_monitor_menus/', params)
    },
    getLogo: function(params, config) {
        Mock.mock(/api\/system\/mgmt\/logo/, 'get', responseData.getLogo())
        return get('/system/mgmt/logo/', params, config)
    },
    updateLogo: function(params) {
        Mock.mock(/api\/system\/mgmt\/logo/, 'put', responseData.updateLogo())
        return put(reUrl + '/system/mgmt/logo/', params)
    },
    getBkUsers: function(params) {
        Mock.mock(/api\/system\/mgmt\/sys_users/, 'get', responseData.getBkUsers(params))
        return get('/system/mgmt/sys_users/', params)
    },
    getBizs: function(params) {
        return get(reUrl + '/system/mgmt/sys_users/bizs/', params)
    },
    getLogs: function(params) {
        Mock.mock(/api\/system\/mgmt\/operation_log/, 'get', responseData.getLogs(params))
        return get('/system/mgmt/operation_log/', params)
    },
    checkLogin: function(params) {
        return get(reUrl + '/check_login/', params)
    },
    // ----POST------------------------------------------------------------
    resetlogo: function(params) {
        Mock.mock(/api\/system\/mgmt\/logo\/reset/, 'post', responseData.resetlogo())
        return post('/system/mgmt/logo/reset/', params, {showLoad: true})
    },
    syncUsers: function(params) {
        Mock.mock(/api\/system\/mgmt\/sys_users\/pull_bk_user/, 'post', responseData.syncUsers(params))
        return post('/system/mgmt/sys_users/pull_bk_user/', params, {showLoad: true})
    },
    testEsb: function(params) {
        return post(reUrl + '/common/esb_test/', params)
    },
    getVersionLogsList: function(params = {}) {
        return get(reUrl + '/version_log/version_logs_list/', params)
    },
    getversionLogDetail: function(params = {}) {
        return get(reUrl + '/version_log/version_log_detail/', params)
    }
}
