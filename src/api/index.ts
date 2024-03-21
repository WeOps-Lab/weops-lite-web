// 统一引入api模块
import Server from './module/systemManage/server'
import User from './module/systemManage/user'
import UserManageMain from './module/systemManage/userManage'
import RoleManageMain from './module/systemManage/roleManage'
import GroupManage from './module/systemManage/groupManage'
import ModelManage from './module/assetManage/modelManage'
const api: any = {
    Server,
    User,
    UserManageMain,
    RoleManageMain,
    GroupManage,
    ModelManage
}

// @ts-ignore
const appFiles = require.context('@/projects/', true, /\/api\/index\.ts$/)
appFiles.keys().forEach(key => {
    const appApi = appFiles(key).default
    for (const k in appApi) {
        api[k] = appApi[k]
    }
})

export default api
