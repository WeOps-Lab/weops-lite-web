<template>
    <div class="select-input">
        <div class="select-input-main" :style="{ width: `${width}px` }">
            <el-select
                class="field"
                size="small"
                filterable
                v-model="fieldKey"
                placeholder="请选择"
                @change="changeFieldKey">
                <el-option
                    v-for="(item,index) in propertyList"
                    :key="index"
                    :label="item.attr_name"
                    :value="item.attr_id">
                </el-option>
            </el-select>
            <el-date-picker
                v-if="['date', 'time'].includes(currentFeildInfo['attr_type'])"
                class="value"
                size="small"
                v-model="fieldValue"
                :placeholder="'选择日期时间'"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                @change="changeFieldvaule">
            </el-date-picker>
            <el-select
                v-else-if="['enum', 'bool','user'].includes(currentFeildInfo['attr_type'])"
                class="value"
                clearable=""
                size="small"
                v-model="fieldValue"
                filterable
                :multiple="currentFeildInfo['attr_type'] === 'user'"
                @change="changeFieldvaule">
                <el-option
                    v-for="option in currentFeildInfo['attr_type'] === 'user' ? userList : currentFeildInfo.option"
                    :key="option.id"
                    :value="option.id"
                    :label="option.name">
                </el-option>
            </el-select>
            <el-input
                v-else
                class="value"
                v-model="fieldValue"
                size="small"
                clearable
                type="text"
                @change="changeFieldvaule">
            </el-input>
        </div>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
    @Component({
        components: {}
    })
    export default class SelectInput extends Vue {
    @Prop({
        type: Array,
        default: () => []
    })
    propertyList: Array<any>
    @Prop({
        type: Number,
        default: () => 350
    })
    width: number
    @Prop({
        type: Array,
        default: () => []
    })
    userList: Array<any>

    fieldKey: string = ''
    fieldValue: any = ''

    get currentFeildInfo() {
        return this.propertyList.find(item => item.attr_id === this.fieldKey) || {}
    }

    @Watch('propertyList', { immediate: true, deep: true })
    onPropertyListChange(newVal: any) {
         if (newVal?.length) {
             this.fieldKey = newVal[0].attr_id
         }
    }

    changeFieldvaule(val) {
         let condition: any = {
            field: this.fieldKey,
            type: this.currentFeildInfo.attr_type,
            value: val
         }
         if ((!val && val !== false) || (Array.isArray(val) && !val.length)) {
            condition = null
         } else {
            switch (this.currentFeildInfo.attr_type) {
                case 'enum':
                    condition.type = typeof val === 'number' ? 'int=' : 'str='
                    break
                case 'str':
                    condition.type = 'str='
                    break
                case 'user':
                    condition.type = 'user[]'
                    break
                case 'int':
                    condition.type = 'int='
                    condition.value = +condition.value
                    break
                case 'time':
                    delete condition.value
                    condition.start = val.at(1)
                    condition.end = val.at(-1)
                    break
            }
         }
         this.$emit('change', condition, val)
    }
    changeFieldKey() {
        this.fieldValue = ''
    }
}
</script>
<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern */
.select-input {
    .select-input-main {
        display: flex;
        align-items: center;
        .field {
            width: 100px;
            min-width: 100px;
            /deep/ .el-input__inner {
                border-radius: 4px 0 0 4px;
            }
        }
        .value {
            flex: 1;
            border-radius: 0 4px 4px 0;
            /deep/ .el-input__inner {
                border-radius: 0 4px 4px 0;
            }
        }
    }
}
</style>
