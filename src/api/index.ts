// 统一引入api模块
import Server from './module/server'
import User from './module/user'
import UserManageMain from './module/userManage'
import RoleManageMain from './module/roleManage'
import MonitorCollectMain from './module/monitorCollect'
import RemoteConnectMain from './module/remoteConnect'
import GroupManage from './module/groupManage'
import RoleManageMainMock from './module/mock/roleManageMock'
import UserManageMainMock from './module/mock/userManageMock/index'
import ServerMock from './module/mock/serverMock/index'
import UserMock from './module/mock/userMock/index'
import GroupManageMock from './module/mock/groupManageMock'

let api: any = {
    Server,
    User,
    UserMock,
    UserManageMain,
    RoleManageMain,
    MonitorCollectMain,
    RemoteConnectMain,
    GroupManage
}
// USE_MOCK为true，则使用mock数据
if (window['USE_MOCK']) {
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
