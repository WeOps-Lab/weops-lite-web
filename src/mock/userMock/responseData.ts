import Mock from 'mockjs'

const infoData = {
    'applications': [],
    'is_super': true,
    'menus': ['SysRole'],
    'chname': '超管',
    'menus_permissions': ['SysRole_view', 'SysRole_create', 'SysRole_edit', 'SysRole_users_manage', 'SysRole_permissions'],
    'user_info': {
        name: '超管'
    }
}

export default {
    homeInfo: () => {
        const res = {
            result: true,
            data: infoData
        }
        return res
    },
    login: (params) => {
        if (params.username === 'admin' && params.password === 'admin') {
            return {
                result: true,
                code: '20000',
                data: {
                    token: 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSl'
                }
            }
        } else {
            return {
                result: false,
                message: '账号或密码不正确'
            }
        }
    }
}
