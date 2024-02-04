// 统一引入api模块
import Server from './module/systemManage/server'
import User from './module/systemManage/user'
import UserManageMain from './module/systemManage/userManage'
import RoleManageMain from './module/systemManage/roleManage'
import GroupManage from './module/systemManage/groupManage'
import RoleManageMainMock from '@/mock/systemManage/roleManageMock'
import UserManageMainMock from '@/mock/systemManage/userManageMock'
import ServerMock from '@/mock/systemManage/serverMock'
import UserMock from '@/mock/systemManage/userMock'
import GroupManageMock from '@/mock/systemManage/groupManageMock'

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
