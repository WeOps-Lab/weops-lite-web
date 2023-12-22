# WeOps Framework Web
![](https://wedoc.canway.net/imgs/img/嘉为蓝鲸.jpg)

> 嘉为WeOps轻量级版本基础框架前端源码

#### 更多问题欢迎添加“小嘉”微信，加入官方沟通群
![](https://wedoc.canway.net/imgs/img/小嘉.jpg)

# 嘉为WeOps轻量级版本基础前端框架使用说明

## 开发使用

### 注意事项
-   node版本建议采用`v14.16.0`，对应的npm版本：`6.14.11`

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
- 对于单独存在的页面，如登录页，无需显示在页面外层框架里面，在路由中只需要写在一个配置项`mainRouter`中
- 如登录页，在`src/router/frameRouter.ts`文件中
  
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

- 在`src/router/index.ts`中
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

- 在`src/components/navFrame.vue`中
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

##### 是否使用mock模式
- 在 `index-dev.html` 文件夹中，设置 `USE_MOCK` 为 `true`，即可启用 mock
```
// index-dev.html
window.USE_MOCK = true
```

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

# 生产环境build
npm run build
```
如果想知道相关的[底层工作原理](http://vuejs-templates.github.io/webpack/) 、 [vue-loader 相关文档](http://vuejs.github.io/vue-loader) 和 [开发示例指引](docs/use.md)
