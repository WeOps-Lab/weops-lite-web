// server模块（各模块）api
import { get, post, put, reUrl } from '@/api/axiosconfig/axiosconfig'

// 返回在vue模板中的调用接口
export default {
    getLogo: function(params, config) {
        return get(reUrl + '/system/mgmt/logo/', params, config)
    },
    updateLogo: function(params) {
        return put(reUrl + '/system/mgmt/logo/', params)
    },
    getLogs: function(params) {
        return get(reUrl + '/system/mgmt/operation_log/', params)
    },
    resetlogo: function(params) {
        return post(reUrl + '/system/mgmt/logo/reset/', params, {showLoad: true})
    }
}
