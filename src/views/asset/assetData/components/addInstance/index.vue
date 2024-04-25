<template>
    <drawer-component
        :title="`${isAdd ? '新建' : '编辑'}资产`"
        :size="640"
        :visible="visible"
        destroy-on-close
        custom-class="common-dialog-wrapper"
        :before-close="beforeCloseDialog">
        <div slot="content" class="content-box common-dialog-wrapper-main">
            <el-form
                label-width="280"
                ref="addResourceForm"
                :rules="rules"
                :model="formData">
                <div class="info-box" v-for="item in resourcList" :key="item.id">
                    <div :class="['header',!item.isExpand && 'mb20']">
                        <span
                            :class="['cw-icon' ,'title-icon',item.isExpand ? 'weops-triangle-down' : 'weops-triangle-right']"
                            @click="item.isExpand = !item.isExpand">
                        </span>
                        <span class="title">{{ item.label }}</span>
                    </div>
                    <div v-show="item.isExpand" class="show-info">
                        <el-form-item
                            v-for="tex in item.list"
                            :key="tex['attr_id']"
                            :label="tex['attr_name']"
                            :prop="tex['attr_id']">
                            <el-date-picker
                                v-if="['date', 'time'].includes(tex['attr_type'])"
                                class="form-item"
                                size="small"
                                v-model="formData[tex.attr_id]"
                                :placeholder="'选择日期时间'"
                                :value-format="tex['attr_type'] === 'time' ? 'yyyy-MM-dd HH:mm:ss' : ''"
                                :type="tex['attr_type'] === 'date' ? 'date' : 'datetime'">
                            </el-date-picker>
                            <el-select
                                class="form-item"
                                v-else-if="['enum', 'list', 'user'].includes(tex['attr_type'])"
                                size="small"
                                :multiple="tex['attr_type'] === 'user'"
                                v-model="formData[tex.attr_id]"
                                filterable>
                                <el-option
                                    v-for="option in tex['attr_type'] === 'user' ? userList : tex.option"
                                    :key="option.id"
                                    :value="option.id"
                                    :label="option.name">
                                </el-option>
                            </el-select>
                            <el-switch
                                class="form-item"
                                v-else-if="tex['attr_type'] === 'bool'"
                                size="small"
                                v-model="formData[tex.attr_id]">
                            </el-switch>
                            <el-cascader
                                v-else-if="tex['attr_type'] === 'organization'"
                                :props="{
                                    emitPath: false,
                                    checkStrictly: true
                                }"
                                class="form-item"
                                size="small"
                                v-model="formData[tex.attr_id]"
                                :options="groupList">
                            </el-cascader>
                            <el-input
                                v-else
                                v-model="formData[tex.attr_id]"
                                size="small"
                                clearable
                                :show-password="tex['attr_type'] === 'pwd'"
                                :type="tex['attr_type'] === 'pwd' ? 'password' : 'text'">
                            </el-input>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </div>
        <div slot="footer">
            <el-button
                :loading="loading"
                :type="'primary'"
                size="small"
                @click="handleSubmit">
                保存
            </el-button>
            <el-button
                size="small"
                @click="beforeCloseDialog">
                关闭
            </el-button>
        </div>
    </drawer-component>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="scss">
@import "./index.scss"
</style>
