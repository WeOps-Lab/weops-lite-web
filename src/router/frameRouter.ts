// 无设置菜单权限
import { routeConfig } from '@/router/menuList'
const AuthPermission = () => import('@/views/authPermission.vue')
const Forbidden = () => import('@/views/403.vue')
const NoFound = () => import('@/views/404.vue')

// 系统管理
const SysRole = () => import('@/views/systemManage/roleManage/index.vue')
const SysUser = () => import('@/views/systemManage/userMange/index.vue')
const SysSetting = () => import('@/views/systemManage/sysSetting/index.vue')
const SysLog = () => import('@/views/systemManage/logManage/index.vue')
const MenuSetting = () => import('@/views/systemManage/sysSetting/menuSetting.vue')
const SysGroup = () => import('@/views/systemManage/groupManage/index.vue')

const mainRouter = [
    {
        path: '/authPermissionFail',
        name: 'AuthPermissionFail',
        component: AuthPermission,
        meta: {
            title: '无菜单权限'
        }
    },
    {
        path: '/403',
        name: '403',
        component: Forbidden,
        meta: {
            title: '页面无访问权限'
        }
    },
    {
        path: '/404',
        name: '404',
        component: NoFound,
        meta: {
            title: '页面找不到'
        }
    },
    // 新增
    {
        path: '/sysRole',
        name: 'SysRole',
        component: SysRole,
        meta: {
            title: '角色管理'
        }
    },
    {
        path: '/sysUser',
        name: 'SysUser',
        component: SysUser,
        meta: {
            title: '用户管理'
        }
    },
    {
        path: '/sysSetting',
        name: 'SysSetting',
        component: SysSetting,
        meta: {
            title: '系统设置',
            cacheName: 'sys-setting' // 需要缓存的页面名称，需要跟这个组件的name命名一致
        }
    },
    {
        path: '/menuSetting',
        name: 'MenuSetting',
        component: MenuSetting,
        meta: {
            title: '自定义菜单',
            activeMenu: 'SysSetting',
            parentIds: ['SysSetting'],
            needCache: false // 离开后是父级页面否需要缓存。需注意的是，要配合cacheName使用，并且在父级页面的beforeRouteLeave钩子中，判断是否需要缓存。若需要缓存，则调用this.$handleKeepAlive(to, from)这个方法,vuex中的keepAliveList要把父级页面的路由名称加进去
        }
    },
    {
        path: '/sysLog',
        name: 'SysLog',
        component: SysLog,
        meta: {
            title: '操作日志'
        }
    },
    {
        path: '/sysGroup',
        name: 'SysGroup',
        component: SysGroup,
        meta: {
            title: '组织管理'
        }
    }
]
const subsMenuPromission = {}
const manageMenu = []

// 自动导入子应用
// @ts-ignore
// const files = require.context('@/projects', true, /frameRouter.ts/)
// files.keys().forEach(key => {
//     const router = files(key).frameRouter
//     const menuList = files(key).adminRouteConfig
//     const subsMenu = files(key).subsMenuList
//     mainRouter = mainRouter.concat(router)
//     // 处理合并项目菜单
//     menuList.forEach(item => {
//         const targetIndex = routeConfig.findIndex(tex => tex.id === item.id)
//         if (targetIndex !== -1) {
//             routeConfig[targetIndex].children = routeConfig[targetIndex].children.concat(item.children).sort((a, b) => a.sortIndex - b.sortIndex)
//         } else {
//             routeConfig.push(item)
//         }
//     })
//     routeConfig.sort((a, b) => a.sortIndex - b.sortIndex)
//     subsMenuPromission = { ...subsMenuPromission, ...subsMenu }
//     const manageMenuItem = files(key).manageMenu
//     if (manageMenuItem) {
//         manageMenuItem.forEach(item => {
//             const findIndex = manageMenu.findIndex(tex => tex.id === item.id)
//             if (findIndex !== -1) {
//                 manageMenu[findIndex].children = manageMenu[findIndex].children.concat(item.children).sort((a, b) => a.sortIndex - b.sortIndex)
//             } else {
//                 manageMenu.push(item)
//             }
//         })
//     }
// })
// routeConfig.forEach(item => {
//     if (item.id === 'Setting') {
//         item.children = item.children.concat(manageMenu).sort((a, b) => a.sortIndex - b.sortIndex)
//     }
// })

export const frameRouter = mainRouter

export const menuList = routeConfig

export const subsMenuList = subsMenuPromission
