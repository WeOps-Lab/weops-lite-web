
const groupData = [
    {
        'id': 'a7847105-df3d-4ba8-a057-dedc9bb91c4c',
        'name': 'Test Group',
        'path': '/Test Group',
        'subGroups': [
            {
                'id': '0095ff1f-d562-4d5f-bad2-1d92bf884502',
                'name': 'Sub Group',
                'path': '/Test Group/Sub Group',
                'subGroups': []
            }
        ]
    },
    {
        'id': 'd9cca9e9-967b-4c9c-9330-882b8e36160d',
        'name': '新组织',
        'path': '/新组织',
        'subGroups': []
    }
]

export default {
    getGroups: (params) => {
        const res = {
            result: true,
            code: 20000,
            message: 'success',
            data: groupData
        }
        res.data = groupData.filter(item => item.name.includes(params.search))
        return res
    }
}
