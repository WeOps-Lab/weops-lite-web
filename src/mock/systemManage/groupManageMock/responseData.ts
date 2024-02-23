import groupData from './data/group.json'

export default {
    getGroups: (params) => {
        const res = {
            result: true,
            code: 20000,
            message: 'success',
            data: groupData
        }
        res.data = groupData.filter((item) =>
            item.name.includes(params.search)
        )
        return res
    }
}
