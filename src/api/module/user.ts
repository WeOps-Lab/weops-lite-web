// 获取登录信息！！！勿动
import { get, post, reUrl } from '@/api/axiosconfig/axiosconfig'

// 返回在vue模板中的调用接口
export default {
    // ----GET-------------------------------------------------------------
    // 获取登录信息！！！
    homeInfo: function(params) {
        return get(reUrl + '/system/mgmt/login_info/', params)
    },
    login: (params) => {
        return post(reUrl + '/system/mgmt/keycloak_login/', params)
    }
}
