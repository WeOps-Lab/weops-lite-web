// 获取登录信息！！！勿动
import { get, post } from '@/api/axiosconfig/axiosconfig'
import Mock from 'mockjs'
import responseData from './responseData'

// 返回在vue模板中的调用接口
export default {
    // ----GET-------------------------------------------------------------
    // 获取登录信息！！！
    homeInfo: function(params) {
        Mock.mock(/api\/login_info/, 'get', responseData.homeInfo())
        return get('/login_info/', params)
    },
    login: (params) => {
        Mock.mock(/api\/keycloak_login/, 'post', responseData.login(params))
        return post('/keycloak_login/', 'post', params)
    }
}
