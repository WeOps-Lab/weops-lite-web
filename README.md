# WeOps Framework Web

![](https://wedoc.canway.net/imgs/img/嘉为蓝鲸.jpg)

> 嘉为WeOps轻量级版本基础框架前端源码

#### 更多问题欢迎添加“小嘉”微信，加入官方沟通群

![](https://wedoc.canway.net/imgs/img/小嘉.jpg)

# 嘉为WeOps轻量级版本基础前端框架使用说明

## 开发使用

### 注意事项

- node版本建议采用 `v14.16.0`，对应的npm版本：`6.14.11`

### 框架目录

```markdown
├── build # 构建相关
├── config # 配置相关
├── src  # 源代码
│    ├── api # 所有请求（请求封装 + 请求定义）
│    ├── assets # 静态文件
│    ├── common # 公用方法定义
│    ├── components # 全局UI组件
│    ├── controller # 控制器
│    ├── directive # 指令
│    ├── fiter # 过滤器
│    ├── microRouter # 所有projects子应用资源注册的路由合并
│    ├── projects # 自定义添加应用代码
│    ├── router # 路由
│    ├── store # 全局store管理
├── App.vue # 入口文件
├── main.ts # 入口 加载组件 初始化等
├── static  # 静态资源
│    ├── css # css
│    ├── js # js
├── .babelrc                   # babel-loader 配置
├── eslintrc.js                # eslint 配置项
├── eslintignore               # eslint 忽略项
├── .gitignore                 # git 忽略项
├── stylelintrc.js             # stylelintrc 配置项
├── index-dev.html             # 本地调试入口文件
├── index.html                 # html模板
└── package.json               # package.json
```

### 开发

#### src目录详情

##### src目录

```markdown
├── api # 所有请求（请求封装 + 请求定义）
│    ├── axiosconfig # 请求封装
│    ├── module # 定义接口模块
│    │    ├── example.ts # 自定义api模块
│    ├── index.ts # 统一引入api模块
├── assets # 静态文件
├── common # 公用方法定义
├── components # 全局UI组件
├── controller # 控制器
├── directive # 指令
├── fiter # 过滤器
├── microRouter # 所有projects子应用资源注册的路由合并
├── projects # 自定义添加应用代码
├── router # 路由
├── store # 全局store管理
│      ├── modules # store模块管理
│      │    ├── example.ts # 自定义store模块
│      ├── index.ts # 统一引入store模块
```

##### src目录文件内容示例

- api模块文件

```js
// api/module/example.ts

// 获取登录信息
import { get, post, reUrl } from '@/api/axiosconfig/axiosconfig'

// 返回在vue模板中的调用接口
export default {
    // 获取登录信息！！！
    homeInfo: function(params) {
        return get(reUrl + '/login_info/', params)
    }
}
```

```js
// api/index.ts
// 需要在项目的main.ts中引入

// 统一引入api模块
import Example from './module/example'

const api: any = {
    Example
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
```

- 定义公共方法文件，用到公共方法的地方需要先用 `import` 引入

```js
// common/example.ts

// 定义公用方法
export function example() {
    return '公共方法例子'
}
```

- 定义公共组件文件

```html
<!-- components/example.vue -->

<template>
    <div class="title-area">
        <div>{{ title }}</div>
        <div>{{ content }}</div>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator'
    @Component({})
    export default class Example extends Vue {
        @Prop({ type: String, default: '' }) title: string
        @Prop({ type: String, default: '' }) content: string
    }
</script>
```

- 控制器的文件，在项目的 `main.ts` 中引入，在 `.vue` 文件中使用到时，直接通过 `this.$方法名()` 调用

```js
// controller/example.ts

import Vue from 'vue'

// 去重函数，挂载到Vue的原型上
Vue.prototype.$DupRem = function(list) {
    const newArr = []
    for (let i = 0; i < list.length; i++) {
        if (newArr.indexOf(list[i]) < 0) {
            newArr.push(list[i])
        }
    }
    return newArr
}
```

- 路由配置文件

```js
// router/frameRouter.ts

const NoFound = () => import('@/views/404.vue')
const SysSetting = () => import('@/views/sysSetting/index.vue')
const SysLog = () => import('@/views/logManage/index.vue')
// 页面路由
let mainRouter = [
    {
        path: '/404',
        name: '404',
        component: NoFound,
        meta: {
            title: '页面找不到'
        }
    },
    {
        path: '/sysSetting',
        name: 'SysSetting',
        component: SysSetting,
        meta: {
            title: '系统设置',
        }
    },
    {
        path: '/sysLog',
        name: 'SysLog',
        component: SysLog,
        meta: {
            title: '操作日志'
        }
    }
    // 如果需要新增页面路由，在下面进行编写
    // ...
]

// 路由配置
const routeConfig = [
    {
        name: '管理',
        id: 'Setting',
        children: [
            {
                name: '系统管理',
                id: 'sysManage',
                children: [
                    {
                        name: '操作日志',
                        id: 'SysLog',
                    },
                    {
                        name: '系统设置',
                        id: 'SysSetting',
                    }
                ]
            }
        ]
    }
]
// ...
```

- store仓库模块

```js
// store/modules/example.ts

const state = {
    list: [{'message': '我是信息'}]
}

// getters
const getters = {
    //
}

// mutations
const mutations = {
    setList(state, newData) {
        state.list = newData
    }
}

// actions
const actions = {
    updateList({ commit }, newData) {
        commit('setList', newData)
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
```

```js
// store/index.ts

import Vuex from 'vuex'
import Vue from 'vue'
import example from './modules/example'

// @ts-ignore
Vue.use(Vuex)

// 引入
const modules = {
    example
}

// 遍历projects下的store文件，将子应用导出的store配置添加到modules中
// @ts-ignore
const appFiles = require.context('@/projects', true, /\/store$/)

appFiles.keys().forEach(key => {
    const module = appFiles(key).default
    Object.keys(module).forEach(name => {
        modules[name] = module[name]
    })
})

const store: any = new Vuex.Store({
    // 添加引入的modules
    modules,
    state: {
        logoChange: 1
    },
    mutations: {
        changeLogo(state, value) {
            state.logoChange++
        }
    }
})

window['$store'] = store
export default store

```

- 自定义指令，在 `directive/modal/xxx.ts` 中定义，在 `main.ts` 中引入。

```js
// directive/modal/highlight.ts
const highlight = {
    bind(el, binding) {
    // 设置元素的背景颜色为指令的值
    el.style.backgroundColor = binding.value;
  }
}
export default (Vue) => {
    Vue.directive('highlight', highlight)
}
```

```js
// main.ts
import highlight from './directive/modal/highlight'
Vue.use(highlight)

```

- 过滤器，在 `fiter/xxx.ts` 中定义函数，在 `fiter/index.ts` 中统一引入，并在 `main.ts` 中引入。

```js
// filters/date.ts
export default function formatDate(value) {
  // 实际的日期格式化逻辑
  const date = new Date(value)
  return date.toLocaleDateString()
}
```

```js
// filters/index.ts
import Vue from 'vue';
import formatDate from './date';

Vue.filter('formatDate', formatDate);
```

```js
// main.ts
import './filters'; // 引入过滤器注册模块
```

##### projects文件夹：见[开发示例指引](docs/use.md)

#### 注意

##### 创建单独的页面

- 对于单独存在的页面，如登录页，无需显示在页面外层框架里面，在路由中只需要写在一个配置项 `mainRouter`中
- 如登录页（此处为举例，本框架采用keycloak的登录页，无需写登录页面），在 `src/router/frameRouter.ts`文件中

```js
// src/router/frameRouter.ts

// ...
let mainRouter = [
    // ...
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            title: '登录'
        }
    }
    // ...
]
// ...
```

- 在 `src/router/index.ts`中

```js
// ...
function checkRouteAccess(to, from, next) {
    const permission = store.state.permission
    // 登录页不做路由拦截，修改这部分为'Login'
    if (to.name === 'Login') {
        next()
        return
    }
    // ...
}
// ...
```

- 在 `src/components/navFrame.vue`中

```js
// ...
// 修改 headerHight函数，如果是登录页，不显示顶部菜单
get headerHight() {
    return this.$route.name === 'Login' ? '0' : '52'
}
// 修改 needLeftNav函数
get needLeftNav() {
    // 增加if判断，如果是登录页，不显示左侧菜单
    if (this.$route.name === 'Login') {
        return false
    }
    const target = this.menuList.find(item => item.id === this.activeTopNav)
    return !!(target && target.children)
}
// ...
```

##### 引入图标文件后出现代码规范报错

- 解决方案：在 `.eslintignore` 和 `.stylelintignore` 文件中添加图标文件路径。

```js
// .eslintignore
/src/assets/icon/bk_icon_font/
```

```js
// .stylelintignore
/src/assets/icon/bk_icon_font/
```

##### 修改element-ui类名样式时报代码规范错误

- 解决方案：在前面增加 `/* stylelint-disable selector-class-pattern */`忽略此规则即可

#### 快速上手

```shell
# 克隆项目
git clone https://github.com/WeOps-Lab/weops-framework-web.git

# 安装依赖
npm install --registry=https://registry.npm.taobao.org

// or 使用cnpm代替npm来进行依赖安装

npm install -g cnpm --registry=https://registry.npm.taobao.org

# 安装依赖
npm install

# 服务启动
npm run dev

# 使用mock
npm run dev:mock

# 生产环境build
npm run build
```

# 技术选型

## 前端依赖库

| 组件 | 地址 | 描述 |
| ---- | ---- | ---- |
|      |      |      |
|      |      |      |

## 开发依赖库

| 组件                               | 地址                                                       | 描述                         |
| ---------------------------------- | ---------------------------------------------------------- | ---------------------------- |
|                                    |                                                            |                              |
| @babel/plugin-transform-runtime    | https://github.com/babel/babel-eslint                      | ES6+的新特性转换为ES5代码    |
| @babel/preset-env                  | https://babel.dev/docs/babel-preset-env                    | JS转换组件                   |
| autoprefixer                       | https://github.com/postcss/autoprefixer                    | css浏览器兼容后处理组件      |
| babel-eslint                       | https://github.com/babel/babel-eslint                      | Babel ESLint插件             |
| babel-plugin-syntax-jsx            | https://babel.dev/docs/babel-plugin-syntax-jsx             | babel jsx语法插件            |
| babel-loader                       | https://github.com/babel/babel-loader                      | babel加载器                  |
| babel-plugin-transform-vue-jsx     | https://github.com/vuejs/babel-plugin-transform-vue-jsx    | vue jsx bable                |
| chalk                              | https://github.com/chalk/chalk                             | 终端字体着色器               |
| copy-webpack-plugin                | https://github.com/webpack-contrib/copy-webpack-plugin     | 文件拷贝库                   |
| core-js                            | https://github.com/zloirock/core-js                        | 浏览器polyfill               |
| cross-env                          | https://github.com/kentcdodds/cross-env                    | 跨平台环境变量设置工具       |
| css-loader                         | https://github.com/webpack-contrib/css-loader              | css加载器                    |
| eslint                             | https://eslint.org/                                        | 代码规范校验器               |
| eslint-plugin-import               | https://github.com/import-js/eslint-plugin-import          | import eslint插件            |
| eslint-plugin-node                 | https://github.com/mysticatea/eslint-plugin-node           | node lint扩展插件            |
| eslint-plugin-promise              | https://github.com/eslint-community/eslint-plugin-promise  | promise lint插件             |
| eslint-plugin-standard             | https://github.com/standard/eslint-plugin-standard         | eslint 标准插件              |
| eslint-plugin-vue                  | https://github.com/vuejs/eslint-plugin-vue                 | vue eslint插件               |
| file-loader                        | https://github.com/webpack-contrib/file-loader             | 文件加载器                   |
| friendly-errors-webpack-plugin     | https://github.com/geowarin/friendly-errors-webpack-plugin | 异常提示插件                 |
| html-webpack-plugin                | https://github.com/jantimon/html-webpack-plugin            | Webpack html文件自动生成插件 |
| mockjs                             | https://github.com/nuysoft/Mock                            | Mock数据生成器               |
| node-notifier                      | https://github.com/mikaelbr/node-notifier                  | Native的消息通知             |
| node-sass                          | https://github.com/sass/node-sass                          | sass解析器                   |
| optimize-css-assets-webpack-plugin | https://github.com/NMFR/optimize-css-assets-webpack-plugin | CSS压缩插件                  |
| ora                                | https://github.com/sindresorhus/ora                        | 终端Spinner库                |
| portfinder                         | https://github.com/http-party/node-portfinder              | 检查本地开放端口库           |
| postcss-import                     | https://github.com/postcss/postcss-import                  | postcss 导入器               |
| postcss-loader                     | https://github.com/webpack-contrib/postcss-loader          | postcss 加载器               |
| postcss-url                        | https://github.com/postcss/postcss-url                     | postcss url插件              |
| rimraf                             | https://github.com/isaacs/rimraf                           | node版本的rm -Rf            |
| sass-loader                        | https://github.com/webpack-contrib/sass-loader             | sass加载器                   |
| sass-resources-loader              | https://github.com/shakacode/sass-resources-loader         | sass资源加载器               |
| semver                             | https://github.com/semver/semver                           | 语义化版本解析库             |
| shelljs                            | https://github.com/shelljs/shelljs                         | NodeJS下的一些Shell指令      |
| ts-loader                          | https://github.com/TypeStrong/ts-loader                    | ts-loader加载器              |
| tslint                             | https://github.com/palantir/tslint                         | TypeScript Lint              |
| tslint-config-standard             | https://github.com/blakeembrey/tslint-config-standard      | TSLint标准化配置             |
| typescript                         | https://github.com/Microsoft/TypeScript                    | 类型安全的JavaScript         |
| url-loader                         | https://github.com/webpack-contrib/url-loader              | 文件转Base64加载器           |
| vue-loader                         | https://github.com/vuejs/vue-loader                        | Vue单文件加载器              |
| vue-style-loader                   | https://github.com/vuejs/vue-style-loader                  | CSS预加载器                  |
| webpack                            | https://github.com/webpack/webpack                         | 打包工具                     |
| webpack-bundle-analyzer            | https://github.com/webpack-contrib/webpack-bundle-analyzer | 打包后包大小分析工具         |
| webpack-dev-server                 | https://github.com/webpack/webpack-dev-server              | 本地开发服务器               |
| webpack-merge                      | https://github.com/survivejs/webpack-merge                 | WebPack配置文件合并工具      |
|                                    |                                                            |                              |
