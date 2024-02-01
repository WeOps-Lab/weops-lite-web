// 统一引入api模块
import Server from './module/server'
import User from './module/user'
import UserManageMain from './module/userManage'
import RoleManageMain from './module/roleManage'
import GroupManage from './module/groupManage'
import RoleManageMainMock from '@/mock/roleManageMock'
import UserManageMainMock from '@/mock/userManageMock/index'
import ServerMock from '@/mock/serverMock/index'
import UserMock from '@/mock/userMock/index'
import GroupManageMock from '@/mock/groupManageMock'

let api: any = {
    Server,
    User,
    UserMock,
    UserManageMain,
    RoleManageMain,
    GroupManage
}
// USE_MOCK为true，则使用mock数据
if (process.env.USE_MOCK) {
    api = {
        Server: ServerMock,
        User: UserMock,
        RoleManageMain: RoleManageMainMock,
        UserManageMain: UserManageMainMock,
        GroupManage: GroupManageMock
    }
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
